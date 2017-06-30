<?php

namespace Mcms\Listings\StartUp;



use Mcms\Listings\Middleware\PublishListing;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;

/**
 * Class RegisterMiddleware
 * @package Mcms\Listings\StartUp
 */
class RegisterMiddleware
{

    /**
     * Register all your middleware here
     * @param ServiceProvider $serviceProvider
     * @param Router $router
     */
    public function handle(ServiceProvider $serviceProvider, Router $router)
    {
        $router->aliasMiddleware('publishListing', PublishListing::class);
    }
}