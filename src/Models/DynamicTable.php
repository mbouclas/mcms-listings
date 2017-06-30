<?php

namespace Mcms\Listings\Models;


use Config;
use Mcms\Core\Models\DynamicTable as BaseDynamicTable;
use Mcms\FrontEnd\Helpers\Sluggable;

class DynamicTable extends BaseDynamicTable
{
    use Sluggable;

    public $itemModel;

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->itemModel = (Config::has('listings.listing')) ? Config::get('listings.listing') : Listing::class;
    }

    public function listings()
    {
        return $this->belongsToMany($this->itemModel);
    }


}
