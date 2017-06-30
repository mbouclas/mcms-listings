(function () {
    'use strict';

    angular.module('mcms.listings.listing')
        .service('ListingDataService',Service);

    Service.$inject = ['$http', '$q', 'LISTINGS_CONFIG'];

    function Service($http, $q, Config) {
        var _this = this;
        var baseUrl = '/admin/api/listing/';

        this.index = index;
        this.store = store;
        this.show = show;
        this.update = update;
        this.destroy = destroy;
        this.previewUrl = previewUrl;

        function index(filters) {
            return $http.get(baseUrl, {params : filters}).then(returnData);
        }

        function store(item) {
            return $http.post(baseUrl, item)
                .then(returnData);
        }

        function show(id) {
            return $http.get(baseUrl + id)
                .then(returnData);
        }

        function update(item) {
            return $http.put(baseUrl + item.id, item)
                .then(returnData);
        }

        function destroy(id) {
            return $http.delete(baseUrl + id)
                .then(returnData);
        }

        function previewUrl(id) {
            return $http.get(Config.previewUrl + id)
                .then(returnData);
        }

        function returnData(response) {
            return response.data;
        }
    }
})();
