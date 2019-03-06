<?php

namespace Mcms\Listings\Models\Filters;


use App;


use Config;
use Illuminate\Http\Request;
use Mcms\Core\Models\Filters\DynamicTableFilters;
use Mcms\Core\QueryFilters\FilterableDate;
use Mcms\Core\QueryFilters\FilterableExtraFields;
use Mcms\Core\QueryFilters\FilterableLimit;
use Mcms\Core\QueryFilters\FilterableOrderBy;
use Mcms\Core\QueryFilters\FilterableTagged;
use Mcms\Core\QueryFilters\QueryFilters;
use Mcms\Listings\Models\Listing;


class ListingFilters extends QueryFilters
{
    /**
     * @var array
     */
    protected $filterable = [
        'id',
        'title',
        'slug',
        'description',
        'description_long',
        'userId',
        'ownerId',
        'active',
        'dateStart',
        'dateEnd',
        'category_id',
        'orderBy',
        'extraFields',
        'minPricce',
        'maxPrice',
        'q',
        'dt',
        'tag',
        'sku'
    ];

    use FilterableDate, FilterableOrderBy, FilterableLimit, FilterableExtraFields, DynamicTableFilters, FilterableTagged;

    public function __construct(Request $request)
    {
        parent::__construct($request);

        $this->model = (Config::has('listings.listing')) ? Config::get('listings.listing') : Listing::class;
    }



    /**
     * @example ?id=1,0
     * @param null|string $id
     * @return mixed
     */
    public function id($id = null)
    {
        if ( ! isset($id)){
            return $this->builder;
        }


        if (! is_array($id)) {
            $id = $id = explode(',',$id);
        }

        return $this->builder->whereIn('id', $id);
    }


    /**
     * @example ?active=1,0
     * @param null|string $active
     * @return mixed
     */
    public function active($active = null)
    {
        if ( ! isset($active)){
            return $this->builder;
        }

        //In case ?status=active,inactive
        if (! is_array($active)) {
            $active = $active = explode(',',$active);
        }

        return $this->builder->whereIn('active', $active);
    }

    /**
     * @example ?userId =1,10
     * @param null|string $user_id
     * @return mixed
     */
    public function userId($user_id = null)
    {
        if ( ! isset($user_id)){
            return $this->builder;
        }

        //In case ?status=user_id,inuser_id
        if (! is_array($user_id)) {
            $user_id = $user_id = explode(',',$user_id);
        }

        return $this->builder->whereIn('user_id', $user_id);
    }

    public function ownerId($owner_id = null)
    {
        if ( ! isset($owner_id)){
            return $this->builder;
        }

        //In case ?status=owner_id,inowner_id
        if (! is_array($owner_id)) {
            $owner_id = $owner_id = explode(',',$owner_id);
        }

        return $this->builder->whereIn('owner_id', $owner_id);
    }


    /**
     * @param null|string $title
     * @return $this
     */
    public function title($title = null)
    {
        $locale = App::getLocale();
        if ( ! $title){
            return $this->builder;
        }

        $title = mb_strtolower($title);
        return $this->builder->whereRaw((\DB::raw("LOWER(`title`->'$.\"{$locale}\"') LIKE '%{$title}%'")));
    }

    public function slug($slug = null)
    {
        if ( ! $slug){
            return $this->builder;
        }

        return $this->builder->where("slug", 'LIKE', "%{$slug}%");
    }

    public function sku($sku = null)
    {
        if ( ! $sku){
            return $this->builder;
        }

        return $this->builder->where("sku", 'LIKE', "%{$sku}%");
    }

    /**
     * @param null|string $description
     * @return $this
     */
    public function description($description = null)
    {
        $locale = App::getLocale();
        if ( ! $description){
            return $this->builder;
        }

        $description = mb_strtolower($description);
        return $this->builder->whereRaw((\DB::raw("LOWER(`description`->'$.\"{$locale}\"') LIKE '%{$description}%'")));
    }

    /**
     * @param null|string $description_long
     * @return $this
     */
    public function description_long($description_long = null)
    {
        $locale = App::getLocale();
        if ( ! $description_long){
            return $this->builder;
        }

        $description_long = mb_strtolower($description_long);
        return $this->builder->whereRaw((\DB::raw("LOWER(`description_long`->'$.\"{$locale}\"') LIKE '%{$description_long}%'")));

    }

    /**
     * @param null|string $category_id
     * @return $this
     */
    public function category_id($category_id = null)
    {
        if ( ! $category_id){
            return $this->builder;
        }

        if (! is_array($category_id)) {
            $category_id = $category_id = explode(',',$category_id);
        }

        return $this->builder->whereHas('categories', function ($q) use ($category_id){
            $q->whereIn('listing_category_id', $category_id);
        });
    }

    public function minPrice($minPrice = null)
    {
        if ( ! $minPrice){
            return $this->builder;
        }

        return $this->builder->where('price', '>=', (int) $minPrice);
    }

    public function maxPrice($maxPrice = null)
    {
        if ( ! $maxPrice){
            return $this->builder;
        }

        return $this->builder->where('price', '>=', (int) $maxPrice);
    }

    public function q($q = null)
    {
        if ( ! $q){
            return $this->builder;
        }

        $locale = App::getLocale();

        return $this->builder->where(function($query) use ($q, $locale) {
            $q = mb_strtolower($q);
            $query->orWhereRaw(\DB::raw("LOWER(`title`->'$.\"{$locale}\"') LIKE '%{$q}%'"));
            $query->orWhereRaw(\DB::raw("LOWER(`description`->'$.\"{$locale}\"') LIKE '%{$q}%'"));
            $query->orWhereRaw(\DB::raw("LOWER(`description_long`->'$.\"{$locale}\"') LIKE '%{$q}%'"));
        });
    }


}