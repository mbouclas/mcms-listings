<?php

namespace Mcms\Listings\Services\Listing;


use App;
use Config;
use Mcms\Core\Helpers\Strings;
use Mcms\Core\Services\File\BaseFileConfigurator;
use Mcms\Core\Services\Image\ImageConfiguratorConfigurable;
use Mcms\Listings\Models\Listing;

class FileConfigurator extends BaseFileConfigurator
{

    /**
     * @var mixed
     */
    public $config;
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

    public function __construct($item_id = null)
    {
        $this->config = Config::get('listings.items.files');
        if ($item_id){
            $this->model = Listing::find($item_id);
        }

        $this->stringHelpers = new Strings();
        $this->basePath = 'files';
        $this->baseUrl = '/files/listings/';
        //This gay little bit is cause in windows we cannot symlink from storage -> upload
        if (isset($this->config['savePath'])){
            $this->savePath = $this->config['savePath'];
        } else {
            $this->savePath = (App::environment() == 'listingion') ? 'storage_path' : 'public_path';
        }

    }

    /**
     * Creates the destination path from the configuration $dirPattern
     *
     * @return mixed
     */
    public function uploadPath()
    {
        return call_user_func($this->savePath,
            'files/' .
            $this->stringHelpers->vksprintf($this->config['dirPattern'], $this->model->toArray())
        );
    }
}