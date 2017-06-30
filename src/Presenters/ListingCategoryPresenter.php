<?php

namespace Mcms\Listings\Presenters;
use App;
use Mcms\Core\Services\Presenter\Presenter;
use Mcms\Listings\Models\ListingCategory;

/**
 * Works as $category->present()->methodName
 *
 * Class ListingCategoryPresenter
 * @package Mcms\Listings\Presenters
 */
class ListingCategoryPresenter extends Presenter
{
    /**
     * @var string
     */
    protected $lang;

    /**
     * ListingPresenter constructor.
     * @param ListingCategory $listingCategory
     */
    public function __construct(ListingCategory $listingCategory)
    {
        $this->lang = App::getLocale();

        parent::__construct($listingCategory);
    }


}