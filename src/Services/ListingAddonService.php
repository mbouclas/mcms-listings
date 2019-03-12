<?php
namespace Mcms\Listings\Services;

use App;
use Event;
use Mcms\Listings\Models\ListingAddon;
use Str;

class ListingAddonService
{
    public $model;

    public function __construct()
    {
        $this->model = new ListingAddon();
    }

    public function filter($filters, array $options = [])
    {
        $results = $this->model->filter($filters);
        $results = (array_key_exists('orderBy', $options)) ? $results->orderBy($options['orderBy']) : $results->orderBy('created_at', 'asc');
        $limit = ($filters->request->has('limit')) ? $filters->request->input('limit') : 10;
        $results = $results->paginate($limit);


        return $results;
    }

    public function findOne($id, array $with = [])
    {
        return $this->model
            ->with($with)
            ->find($id);
    }

    public function store(array $addon)
    {
        $addon['slug'] = $this->setSlug($addon);

        $Addon = $this->model->create($addon);

        event('listing.addon.created',$Addon);

        return $Addon;
    }

    public function update($id, array $addon)
    {
        $Addon = $this->model->find($id);

        $Addon->update($addon);

        event('listing.addon.updated',$Addon);

        return $Addon;
    }

    public function destroy($id)
    {
        $Addon = $this->model->find($id);
        if (! $Addon) {
            return false;
        }

        event('listing.addon.destroyed',$Addon);

        return $Addon->delete();
    }

    private function setSlug($item){
        if ( ! isset($item['slug']) || ! $item['slug']){
            return Str::slug($item['title'][App::getLocale()]);
        }

        return $item['slug'];
    }
}