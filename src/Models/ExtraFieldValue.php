<?php

namespace Mcms\Listings\Models;

use Config;
use Mcms\Core\Models\ExtraFieldValue as BaseExtraFieldValue;


/**
 * Class Listing
 * @package Mcms\Listings\Models
 */
class ExtraFieldValue extends BaseExtraFieldValue
{
    protected $listingsModel;

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->listingsModel = (Config::has('listings.listing')) ? Config::get('listings.listing') : Listing::class;
    }

    public function field()
    {
        return $this->BelongsTo(ExtraField::class, 'extra_field_id');
    }

}
