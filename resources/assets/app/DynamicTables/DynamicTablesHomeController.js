(function() {
    'use strict';

    angular.module('mcms.listings.dynamicTables')
        .controller('DynamicTablesHomeController',Controller);

    Controller.$inject = ['init', 'LISTINGS_CONFIG', 'lodashFactory'];

    function Controller(Init, Config, lo) {
        var vm = this;

        if (typeof Init === 'undefined') {
            vm.Type = 'tables';
            vm.modelName = Config.itemModelName;
            vm.itemsRoute = 'dynamic-table-items';
        }

        if (lo.isArray(Init)){
            vm.Type = 'tableItems';
            vm.Items = Init;
            vm.editItemRoute = 'dynamic-table-item-edit';
        }

        if (lo.isObject(Init)) {
            vm.Type = 'editTableItem';
            vm.Item = Init;
            vm.editItemRoute = 'dynamic-table-item-edit';
        }

    }
})();
