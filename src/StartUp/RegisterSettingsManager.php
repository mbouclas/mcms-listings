<?php

namespace Mcms\Listings\StartUp;

use Mcms\Core\Services\SettingsManager\SettingsManagerService;
use Illuminate\Support\ServiceProvider;

class RegisterSettingsManager
{
    public function handle(ServiceProvider $serviceProvider)
    {
        SettingsManagerService::register('listings', 'listing_settings.listings');
        SettingsManagerService::register('listingCategories', 'listing_settings.categories');
    }
}