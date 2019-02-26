<?php

namespace Mcms\Listings\Models;

use Config;
use Illuminate\Database\Eloquent\Model;
use Mcms\Core\Models\FileGallery;
use Mcms\Core\QueryFilters\Filterable;
use Mcms\Core\Traits\Userable;
use Mcms\FrontEnd\Helpers\Sluggable;
use Themsaid\Multilingual\Translatable;
use Mcms\Core\Models\Image;

class ListingAddon extends Model
{
    use Translatable, Filterable, Sluggable, Userable;

    protected $table = 'listing_addons';

    public $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'description',
        'slug',
        'thumb',
        'price',
        'settings',
        'active',
        'period',
        'period_unit',
        'trial_period',
        'trial_period_unit',
        'charge_model',
        'free_quantity',
        'taxable',
        'currency_code',
        'fields',
    ];

    protected $dates = ['created_at', 'updated_at'];

    public $casts = [
        'title' => 'array',
        'description' => 'array',
        'settings' => 'array',
        'thumb' => 'array',
        'fields' => 'array',
        'active' => 'boolean',
        'taxable' => 'boolean',
    ];

    public $imageConfigurator = \Mcms\Listings\Services\Listing\ImageConfigurator::class;
    public $fileConfigurator = \Mcms\Listings\Services\Listing\FileConfigurator::class;
    protected $slugPattern = 'listing_addons.slug_pattern';

    public $config;
    public $route;
    protected $defaultRoute = 'listing-addon';
    protected $appends = ['priceOverride'];

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);

        $this->config = Config::get('listings_addons');
        $this->defaultRoute = (isset($this->config['route'])) ? $this->config['route'] : $this->defaultRoute;
        $this->slugPattern = Config::get($this->slugPattern);
        if (Config::has('listing_addons.images.imageConfigurator')){
            $this->imageConfigurator = Config::get('listing_addons.images.imageConfigurator');
        }

        if (Config::has('listing_addons.files.fileConfigurator')){
            $this->fileConfigurator = Config::get('listing_addons.files.fileConfigurator');
        }
    }

    public function getPriceAttribute($price)
    {
        return $price/100;
    }

    public function setPriceAttribute($price)
    {
        $this->attributes['price'] = $price*100;
    }


    public function getPriceOverrideAttribute($price)
    {
        if (!isset($this->pivot->price_override)) {
            return;
        }
        return $this->pivot->price_override/100;
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'item_id')
            ->where('type', 'images')
            ->orderBy('orderBy','ASC');
    }

    public function files()
    {
        return $this->hasMany(FileGallery::class, 'item_id')
            ->orderBy('orderBy','ASC');
    }

    public function listings()
    {
        return $this->hasMany(Listing::class, 'id');
    }
}
