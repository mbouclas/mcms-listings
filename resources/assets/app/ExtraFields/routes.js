(function() {
    'use strict';

    angular.module('mcms.listings.extraFields')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/extraFields', {
                templateUrl:  Config.templatesDir + 'ExtraFields/index.html',
                controller: 'ListingsExtraFieldHomeController',
                controllerAs: 'VM',
                reloadOnSearch : true,
                resolve: {
                    init : ["AuthService", '$q', function (ACL, $q) {
                        return (!ACL.role('admin')) ? $q.reject(403) : $q.resolve();
                    }]
                },
                name: 'listings-extra-fields-home'
            });
    }

})();
