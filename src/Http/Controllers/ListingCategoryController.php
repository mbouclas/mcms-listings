<?php

namespace Mcms\Listings\Http\Controllers;

use App\Http\Controllers\Controller;
use Config;
use Mcms\Core\Services\SettingsManager\SettingsManagerService;
use Mcms\Listings\Services\ListingCategory\ListingCategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use ItemConnector;


class ListingCategoryController extends Controller
{
    protected $category;

    public function __construct(ListingCategoryService $listingCategory)
    {
        $this->category = $listingCategory;
    }

    public function index()
    {
        $results = $this->category
            ->model
            ->defaultOrder()
            ->get()
            ->toTree();

        return $results;
    }

    public function tree()
    {
        return $this->category->htmlTree();
    }

    public function store(Request $request)
    {
        $data = $request->toArray();
        $data['user_id'] = \Auth::user()->id;
        $parentId = (!isset($data['id']) && isset($data['parent_id'])) ? $data['parent_id'] : null;
        return $this->category->store($data, $parentId);
    }


    public function update(Request $request, $id)
    {
        return $this->category->update($id, $request->toArray());
    }


    public function destroy($id)
    {
        $result = $this->category->destroy($id);
        return $this->index();
    }

    public function show($id)
    {

        return [
            'item' => $this->category->model->with(['image', 'featured.item'])->find($id),
            'settings' => SettingsManagerService::get('listingCategories'),
            'connectors' => ItemConnector::connectors(),
            'seoFields' => Config::get('seo')
        ];
    }

    /**
     * Rebuild the entire tree
     *
     * @param Request $request
     * @return mixed
     */
    public function rebuild(Request $request)
    {
        $this->category
            ->model
            ->rebuildTree($request->all());

        return $this->category
            ->model
            ->defaultOrder()
            ->get()
            ->toTree();
    }
}
