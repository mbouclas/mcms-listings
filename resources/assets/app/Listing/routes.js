(function() {
    'use strict';

    angular.module('mcms.listings.listing')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/content', {
                templateUrl:  Config.templatesDir + 'Listing/index.html',
                controller: 'ListingHomeController',
                controllerAs: 'VM',
                reloadOnSearch : true,
                resolve: {
                    init : ["AuthService", '$q', 'ListingService', function (ACL, $q, Listing) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Listing.init();
                    }]
                },
                name: 'listings-home'
            })
            .when('/listings/content/:id', {
                templateUrl:  Config.templatesDir + 'Listing/editListing.html',
                controller: 'ListingController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    item : ["AuthService", '$q', 'ListingService', '$route', function (ACL, $q, Listing, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Listing.find($route.current.params.id);
                    }]
                },
                name: 'listings-edit'
            });
    }

})();
