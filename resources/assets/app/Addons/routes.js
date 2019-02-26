(function() {
    'use strict';

    angular.module('mcms.listings.addons')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];
    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/addons', {
                templateUrl:  Config.templatesDir + 'Addons/index.html',
                controller: 'AddonsHomeController',
                controllerAs: 'VM',
                reloadOnSearch : true,
                resolve: {
                    init : ["AuthService", '$q', 'ListingAddonService', function (ACL, $q, Addons) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Addons.init();
                    }]
                },
                name: 'addons-home'
            })
            .when('/listings/addons/:id', {
                templateUrl:  Config.templatesDir + 'Addons/editAddons.html',
                controller: 'AddonsController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    item : ["AuthService", '$q', 'AddonsService', '$route', function (ACL, $q, Addons, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Addons.find($route.current.params.id);
                    }]
                },
                name: 'addons-edit'
            });
    }

})();
