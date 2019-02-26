<?php

namespace Mcms\Listings\Http\Controllers;

use App\Http\Controllers\Controller;
use Config;
use Mcms\Core\ExtraFields\ExtraFields;
use Mcms\Core\Models\Filters\ExtraFieldFilters;
use Mcms\Core\Services\DynamicTables\DynamicTablesService;
use Mcms\Core\Services\SettingsManager\SettingsManagerService;
use Mcms\Listings\Models\Filters\ListingFilters;
use Mcms\Listings\Models\Listing;
use Illuminate\Http\Request;
use ItemConnector;
use Mcms\Listings\Services\ListingAddonService;

class ListingAddonController extends Controller
{
    protected $listing;
    protected $addonService;

    public function __construct()
    {
        $this->addonService = new ListingAddonService();
    }

    public function index(ListingFilters $filters, Request $request)
    {
        $limit = ($request->has('limit')) ? (int) $request->input('limit') : 10;
        return $this->addonService->model
            ->filter($filters)
            ->paginate($limit);
    }

    public function store(Request $request)
    {
        $data = $request->toArray();
        $data['user_id'] = \Auth::user()->id;
        return $this->addonService->store($data);
    }


    public function update(Request $request, $id)
    {
        return $this->addonService->update($id, $request->toArray());
    }


    public function destroy($id)
    {
        $result = $this->addonService->destroy($id);
        return ['success' => $result];
    }

    public function show($id, ExtraFieldFilters $filters)
    {
        $imageCategories = Config::get('listings.items.images.types');
        $extraFieldService = new ExtraFields();
        \DB::listen(function ($query) {
//            print_r($query->sql);
//            print_r($query->bindings);
            // $query->time
        });
        $filters->request->merge(['model' => str_replace('\\','\\\\',get_class($this->addonService->model))]);
        $dynamicTableService = new DynamicTablesService(new $this->addonService->model->dynamicTablesModel);

        return [
            'item' => $this->addonService->findOne($id, ['related', 'categories', 'dynamicTables',
                'galleries','tagged','files', 'extraFields', 'extraFields.field']),
            'imageCategories' => $imageCategories,
            'extraFields' => $extraFieldService->model->filter($filters)->get(),
            'imageCopies' => Config::get('listings.items.images'),
            'config' => array_merge(Config::get('listings.items'), Config::get('listings.money')),
            'tags' => $this->addonService->model->existingTags(),
            'dynamicTables' => $dynamicTableService->all(),
            'settings' => SettingsManagerService::get('listings'),
            'connectors' => ItemConnector::connectors(),
            'seoFields' => Config::get('seo')
        ];
    }

    public function preview($id)
    {
        $item = Listing::find($id);
        return response(['url' => $item->createUrl()]);
    }
}
