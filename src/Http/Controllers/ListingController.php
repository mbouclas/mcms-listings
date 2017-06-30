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
use Mcms\Listings\Models\ListingCategory;
use Mcms\Listings\Services\Listing\ListingService;
use Illuminate\Http\Request;
use ItemConnector;

class ListingController extends Controller
{
    protected $listing;
    protected $listingService;

    public function __construct(ListingService $listingService)
    {
        $this->listingService = $listingService;
    }

    public function index(ListingFilters $filters, Request $request)
    {


        \DB::listen(function ($query) {
//            print_r($query->sql);
//            print_r($query->bindings);
            // $query->time
        });
        $limit = ($request->has('limit')) ? (int) $request->input('limit') : 10;
        return $this->listingService->model->with(['categories','images'])
            ->filter($filters)
            ->paginate($limit);
    }

    public function store(Request $request)
    {
        $data = $request->toArray();
        $data['user_id'] = \Auth::user()->id;
        return $this->listingService->store($data);
    }


    public function update(Request $request, $id)
    {
        return $this->listingService->update($id, $request->toArray());
    }


    public function destroy($id)
    {
        $result = $this->listingService->destroy($id);
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
        $filters->request->merge(['model' => str_replace('\\','\\\\',get_class($this->listingService->model))]);
        $dynamicTableService = new DynamicTablesService(new $this->listingService->model->dynamicTablesModel);

        return [
            'item' => $this->listingService->findOne($id, ['related', 'categories', 'dynamicTables',
                'galleries','tagged','files', 'extraFields', 'extraFields.field']),
            'imageCategories' => $imageCategories,
            'extraFields' => $extraFieldService->model->filter($filters)->get(),
            'imageCopies' => Config::get('listings.items.images'),
            'config' => array_merge(Config::get('listings.items'), Config::get('listings.money')),
            'tags' => $this->listingService->model->existingTags(),
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
