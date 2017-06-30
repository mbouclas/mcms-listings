<?php

namespace Mcms\Listings\Services\ListingCategory;


use App;
use Config;
use Mcms\Core\Helpers\Strings;
use Mcms\Core\Services\Image\ImageConfiguratorConfigurable;
use Mcms\Core\Services\Image\ImageConfiguratorContract;
use Mcms\Listings\Models\ListingCategory;

/**
 * Configure the image uploader for our instance.
 *
 * Class ImageConfigurator
 * @package Mcms\Listings\Services\ListingCategory
 */
class ImageConfigurator implements ImageConfiguratorContract
{
    use ImageConfiguratorConfigurable;
    /**
     * @var mixed
     */
    protected $config;
    /**
     * @var
     */
    public $model;
    /**
     * @var Strings
     */
    protected $stringHelpers;
    /**
     * @var string
     */
    protected $basePath;
    /**
     * @var string
     */
    protected $baseUrl;
    /**
     * @var string
     */
    public $savePath;

    /**
     * ImageConfigurator constructor.
     * @param $item_id
     */
    public function __construct($item_id)
    {
        $this->config = Config::get('listings.categories.images');
        $this->model = ListingCategory::find($item_id);
        $this->stringHelpers = new Strings();
        $this->basePath = 'images';
        $this->baseUrl = '/images/listings/';
        //This gay little bit is cause in windows we cannot symlink from storage -> upload
        if (isset($this->config['savePath'])){
            $this->savePath = $this->config['savePath'];
        } else {
            $this->savePath = (App::environment() == 'listingion') ? 'storage_path' : 'public_path';
        }
    }

}