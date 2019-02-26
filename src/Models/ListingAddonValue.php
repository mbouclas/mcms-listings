<?php

namespace Mcms\Listings\Models;


use Illuminate\Database\Eloquent\Model;

class ListingAddonValue extends Model
{
    protected $table = 'listing_addons_values';

    protected $fillable = [
        'item_id',
        'listing_addon_id',
        'price_override',
        'field_values',
        'activated_at',
        'expires_at'
    ];
    protected $dates = ['created_at', 'updated_at', 'activated_at', 'expires_at'];

    public function getPriceOverrideAttribute($price)
    {
        return $price/100;
    }
}