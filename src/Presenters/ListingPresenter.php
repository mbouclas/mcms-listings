<?php

namespace Mcms\Listings\Presenters;
use App;
use Mcms\Core\Services\Presenter\Presenter;
use Mcms\Listings\Models\Listing;

/**
 * Works as $listing->present()->methodName
 *
 * Class ListingPresenter
 * @package Mcms\Listings\Presenters
 */
class ListingPresenter extends Presenter
{
    /**
     * @var string
     */
    protected $lang;

    /**
     * ListingPresenter constructor.
     * @param Listing $listing
     */
    public function __construct(Listing $listing)
    {
        $this->lang = App::getLocale();

        parent::__construct($listing);
    }


}