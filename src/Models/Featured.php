<?php

namespace Mcms\Listings\Models;

use Config;
use Mcms\Core\Models\Featured as BaseFeatured;


/**
 * Class Listing
 * @package Mcms\Listings\Models
 */
class Featured extends BaseFeatured
{

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];

    protected $listingsModel;

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->listingsModel = (Config::has('listings.listing')) ? Config::get('listings.listing') : Listing::class;
    }

    public function item()
    {
        return $this->BelongsTo($this->listingsModel, 'item_id');
    }

}
