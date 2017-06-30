(function() {
    'use strict';

    angular.module('mcms.listings.listingCategory')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/categories', {
                templateUrl:  Config.templatesDir + 'ListingCategory/index.html',
                controller: 'ListingCategoryHomeController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    init : ["AuthService", '$q', 'ListingCategoryService', function (ACL, $q, Category) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Category.get();
                    }]
                },
                name: 'listings-categories'
            });
    }

})();
