<?php

namespace Mcms\Listings\StartUp;


use Mcms\Listings\Menu\ListingsInterfaceMenuConnector;
use Mcms\Listings\Models\Listing;
use Illuminate\Support\ServiceProvider;
use ModuleRegistry, ItemConnector;

class RegisterAdminPackage
{
    public function handle(ServiceProvider $serviceProvider)
    {
        ModuleRegistry::registerModule($serviceProvider->packageName . '/admin.package.json');
        try {
            ItemConnector::register((new ListingsInterfaceMenuConnector())->run()->toArray());
        } catch (\Exception $e){

        }
    }
}