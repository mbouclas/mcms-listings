(function () {
    'use strict';

    angular.module('mcms.listings.dynamicTables')
        .config(config);

    config.$inject = ['$routeProvider', 'LISTINGS_CONFIG'];

    function config($routeProvider, Config) {
        $routeProvider
            .when('/listings/dynamicTables', {
                templateUrl: Config.templatesDir + 'DynamicTables/index.html',
                controller: 'DynamicTablesHomeController',
                controllerAs: 'VM',
                reloadOnSearch: true,
                resolve: {
                    init: ["AuthService", '$q', function (ACL, $q) {
                        return (!ACL.role('admin')) ? $q.reject(403) : $q.resolve();
                    }]
                },
                name: 'dynamic-tables-home'
            })
            .when('/listings/dynamicTables/:id', {
                templateUrl: Config.templatesDir + 'DynamicTables/index.html',
                controller: 'DynamicTablesHomeController',
                controllerAs: 'VM',
                reloadOnSearch: true,
                resolve: {
                    init: ["AuthService", '$q', 'DynamicTableService', '$route', function (ACL, $q, DynamicTableService, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : DynamicTableService.get($route.current.params.id);
                    }]
                },
                name: 'dynamic-table-items'
            })
            .when('/listings/dynamicTables/item/:id', {
                templateUrl: Config.templatesDir + 'DynamicTables/index.html',
                controller: 'DynamicTablesHomeController',
                controllerAs: 'VM',
                reloadOnSearch: true,
                resolve: {
                    init: ["AuthService", '$q', 'DynamicTableService', '$route', function (ACL, $q, DynamicTableService, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : DynamicTableService.find($route.current.params.id);
                    }]
                },
                name: 'dynamic-table-item-edit'
            });
    }
})();
