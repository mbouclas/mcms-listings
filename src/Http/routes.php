<?php

Route::group(['prefix' => 'admin/api'], function () {
    Route::group(['middleware' =>['level:2']], function($router)
    {
        $router->get('listing/preview/{id}', 'Mcms\Listings\Http\Controllers\ListingController@preview');
        $router->resource('listing' ,'Mcms\Listings\Http\Controllers\ListingController');
        $router->put('listingCategory/rebuild','Mcms\Listings\Http\Controllers\ListingCategoryController@rebuild');
        $router->get('listingCategory/tree','Mcms\Listings\Http\Controllers\ListingCategoryController@tree');
        $router->resource('listingCategory' ,'Mcms\Listings\Http\Controllers\ListingCategoryController');
    });

    Route::group(['middleware' =>['level:98'], 'prefix' => 'listings'], function($router)
    {
        $router->resource('addons' ,'Mcms\Listings\Http\Controllers\ListingAddonController');
    });

});