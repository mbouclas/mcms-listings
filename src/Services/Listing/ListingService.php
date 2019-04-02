<?php

namespace Mcms\Listings\Services\Listing;


use App;
use Config;
use Event;
use Mcms\Core\Helpers\Strings;
use Mcms\Core\Models\Image;
use Mcms\Core\Models\MenuItem;

use Mcms\Core\QueryFilters\Filterable;
use Mcms\Core\Services\DynamicTables\DynamicTablesService;
use Mcms\Core\Services\Image\GroupImagesByType;
use Mcms\Core\Traits\FixTags;
use Mcms\FrontEnd\Services\PermalinkArchive;
use Mcms\Listings\Exceptions\InvalidListingFormatException;
use Mcms\Listings\Models\Featured;
use Mcms\Listings\Models\Listing;
use Mcms\Listings\Models\Related;
use Str;

/**
 * Class ListingService
 * @package Mcms\Listings\Services\Listing
 */
class ListingService
{
    use Filterable, FixTags;

    /**
     * @var Listing
     */
    protected $listing;
    /**
     * @var
     */
    public $model;

    protected $validator;

    protected $imageGrouping;

    /**
     * ListingService constructor.
     * @param Listing $listing
     */
    public function __construct()
    {
        $model = (Config::has('listings.listing')) ? Config::get('listings.listing') : Listing::class;
        $this->listing = $this->model = new $model;
        $this->validator = new ListingValidator();
        $this->imageGrouping = new GroupImagesByType();
    }

    /**
     * Filters the translations based on filters provided
     * Legend has it that it will filter properly role based queries.
     * So, if i am an admin, i should not be able to see the super users
     *
     * @param $filters
     */

    public function filter($filters, array $options = [])
    {
        $results = $this->listing->filter($filters);
        $results = (array_key_exists('orderBy', $options)) ? $results->orderBy($options['orderBy']) : $results->orderBy('created_at', 'asc');
        $limit = ($filters->request->has('limit')) ? $filters->request->input('limit') : 10;
        $results = $results->paginate($limit);


        return $results;
    }

    /**
     * @param $id
     * @param array $listing
     * @return array
     */
    public function update($id, array $listing)
    {
        $Listing = $this->listing->find($id);
        dd($listing);
        //link has changed, write it out as a 301
        //create link
        $oldLink = $Listing->generateSlug();
        $newLink = $Listing->generateSlug($listing);

        if ($oldLink != $newLink){
            //write 301

            PermalinkArchive::add($oldLink, $newLink);
        }
        $Listing->update($listing);
        //update relations
        $Listing->categories()->sync($this->sortOutCategories($listing['categories']));
        //sanitize the model
        $Listing = $this->saveRelated($listing, $Listing);
        if (isset($listing['dynamic_tables'])) {
            $dynamicTableService = new DynamicTablesService(new $this->model->dynamicTablesModel);
            $Listing->dynamicTables()->sync($dynamicTableService->sync($listing['dynamic_tables']));
        }
        $Listing = $this->fixTags($listing, $Listing);
        if (isset($listing['extra_fields'])){
            $Listing->extraFieldValues()->sync($Listing->sortOutExtraFields($listing['extra_fields']));
        }

        if (isset($listing['addons'])){
            $Listing->addons()->sync($this->sortOutAddons($listing['addons']));
        }
        //emit an event so that some other bit of the app might catch it
        event('menu.item.sync',$Listing);
        event('listing.updated',$Listing);

        return $Listing;
    }

    /**
     * Create a new listing
     *
     * @param array $listing
     * @return static
     */
    public function store(array $listing)
    {
        try {
            $this->validator->validate($listing);
        }
        catch (InvalidListingFormatException $e){
            return $e->getMessage();
        }

        $listing['slug'] = $this->setSlug($listing);

        $Listing = $this->listing->create($listing);
        $Listing->categories()->attach($this->sortOutCategories($listing['categories']));
        if (isset($listing['dynamic_tables'])){
            $dynamicTableService = new DynamicTablesService(new $this->model->dynamicTablesModel);
            $Listing->dynamicTables()->attach($dynamicTableService->sync($listing['dynamic_tables']));
        }

        if (isset($listing['addons'])){
            $Listing->addons()->sync($this->sortOutAddons($listing['addons']));
        }

        $Listing = $this->saveRelated($listing, $Listing);
        $Listing = $this->fixTags($listing, $Listing);
        event('listing.created',$Listing);
        return $Listing;
    }

    /**
     * Delete a listing
     *
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        $item = $this->listing->find($id);

        if (! $item) {
            return false;
        }

        //delete images
        Image::where('model',get_class($this->model))->where('item_id', $id)->delete();
        //delete from menus
        MenuItem::where('model',get_class($this->model))->where('item_id', $id)->delete();
        //delete from featured
        Featured::where('model',get_class($this->model))->where('item_id', $id)->delete();
        //delete from related
        Related::where('model',get_class($this->model))->where('source_item_id', $id)->orWhere('item_id', $id)->delete();
        //emit an event so that some other bit of the app might catch it
        event('menu.item.destroy',$item);
        event('listing.destroyed',$item);

        return $item->delete();
    }

    public function findOne($id, array $with = [], array $options = [
        'where' => []
    ])
    {

        $item = $this->model
            ->with($with);

        if (count($options['where']) > 0) {
            foreach ($options['where'] as $key => $value) {
                $item = $item->where($key, $value);
            }
        }

        $item = $item->find($id);

        if ($item){
            $item = $item->relatedItems();
            $item->related = collect($item->related);
        }

        if (in_array('galleries', $with)){
            $item->images = $this->imageGrouping
                ->group($item->galleries, \Config::get('listings.items.images.types'));
        }

        return $item;
    }

    /**
     * create an array of category ids with the extra value main
     *
     * @param $itemCategories
     * @return array
     */
    private function sortOutCategories($itemCategories){
        $categories = [];
        foreach ($itemCategories as $category){
            $main = (! isset($category['main']) || ! $category['main']) ? false : true;
            $categories[$category['id']] = ['main' => $main];
        }

        return $categories;
    }

    private function setSlug($item){
        if ( ! isset($item['slug']) || ! $item['slug']){
            return Str::slug($item['title'][App::getLocale()]);
        }

        return $item['slug'];
    }


    /**
     * @param array $listing
     * @param Listing $Listing
     * @return Listing
     */
    private function saveRelated(array $listing, Listing $Listing)
    {
        if ( ! isset($listing['related']) || ! is_array($listing['related'])  ){
            return $Listing;
        }

        foreach ($listing['related'] as $index => $item) {
            $listing['related'][$index]['dest_model'] = ( ! isset($item['dest_model']))
                ? $listing['related'][$index]['dest_model'] = $item['model']
                : $listing['related'][$index]['dest_model'] = $item['dest_model'];
            $listing['related'][$index]['model'] = get_class($Listing);
        }

        $Listing->related = $Listing->saveRelated($listing['related']);

        return $Listing;
    }

    public function buildPermalink(array $item)
    {
        $stringHelpers = new Strings();

        return $stringHelpers->vksprintf(Config::get('listings.items.slug_pattern'), $item);
    }

    private function sortOutAddons($addons)
    {
        if (empty($addons) || count($addons) == 0) {
            return [];
        }

        $ids = [];

        foreach ($addons as $addon) {
            if (is_numeric($addon)) {
                $ids[] = $addon;
                continue;
            }

            if (is_object($addon)) {
                $ids[] = $addon->id;
            }

            if (is_array($addon)) {
                $ids[] = $addon['id'];
            }

            event('listing.addon.sorted', $addon);
        }

        return $ids;
    }


}