<?php

namespace Mcms\Listings;


use Mcms\Listings\StartUp\RegisterAdminPackage;
use Mcms\Listings\StartUp\RegisterEvents;
use Mcms\Listings\StartUp\RegisterFacades;
use Mcms\Listings\StartUp\RegisterMiddleware;
use Mcms\Listings\StartUp\RegisterServiceProviders;
use Mcms\Listings\StartUp\RegisterSettingsManager;
use Mcms\Listings\StartUp\RegisterWidgets;
use Illuminate\Support\ServiceProvider;
use \App;
use \Installer, \Widget;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Routing\Router;

class ListingsServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $commands = [
        \Mcms\Listings\Console\Commands\Install::class,
        \Mcms\Listings\Console\Commands\RefreshAssets::class,
    ];
    
    public $packageName = 'package-listings';
    
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot(DispatcherContract $events, GateContract $gate, Router $router)
    {
        $this->publishes([
            __DIR__ . '/../config/config.php' => config_path('listings.php'),
            __DIR__ . '/../config/listing_settings.php' => config_path('listing_settings.php'),
            __DIR__ . '/../config/listing_addons.php' => config_path('listing_addons.php'),
        ], 'config');

        $this->publishes([
            __DIR__ . '/../database/migrations/' => database_path('migrations')
        ], 'migrations');

        $this->publishes([
            __DIR__ . '/../database/seeds/' => database_path('seeds')
        ], 'seeds');

        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/listings'),
        ], 'views');

        $this->publishes([
            __DIR__ . '/../resources/lang' => resource_path('lang'),
        ], 'lang');

        $this->publishes([
            __DIR__ . '/../resources/public' => public_path('vendor/mcms/listings'),
        ], 'public');

        $this->publishes([
            __DIR__ . '/../resources/assets' => public_path('vendor/mcms/listings'),
        ], 'assets');

        $this->publishes([
            __DIR__ . '/../config/admin.package.json' => storage_path('app/package-listings/admin.package.json'),
        ], 'admin-package');
        

        if (!$this->app->routesAreCached()) {
            $router->group([
                'middleware' => 'web',
            ], function ($router) {
                require __DIR__.'/Http/routes.php';
            });

            $this->loadViewsFrom(__DIR__ . '/../resources/views', 'listings');
        }

        /**
         * Register any widgets
         */
        (new RegisterWidgets())->handle();

        /**
         * Register Events
         */
//        parent::boot($events);
        (new RegisterEvents())->handle($this, $events);

        /*
         * Register dependencies
        */
        (new RegisterServiceProviders())->handle();

        /*
         * Register middleware
        */
        (new RegisterMiddleware())->handle($this, $router);


        /**
         * Register admin package
         */
        (new RegisterAdminPackage())->handle($this);

        (new RegisterSettingsManager())->handle($this);
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register()
    {
        /*
        * Register Commands
        */
        $this->commands($this->commands);

        /**
         * Register Facades
         */
        (new RegisterFacades())->handle($this);


        /**
         * Register installer
         */
        Installer::register(\Mcms\Listings\Installer\Install::class);

    }
}
