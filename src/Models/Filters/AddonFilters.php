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



class AddonFilters extends QueryFilters
{
    /**
     * @var array
     */
    protected $filterable = [
        'id',
        'title',
        'slug',
        'description',
        'active',
        'dateStart',
        'dateEnd',
        'orderBy',
        'minPricce',
        'maxPrice',
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


}