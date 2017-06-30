(function() {
    'use strict';

    angular.module('mcms.listings.extraFields')
        .controller('ListingsExtraFieldHomeController',Controller);

    Controller.$inject = ['LISTINGS_CONFIG', 'LayoutManagerService'];

    function Controller(Config, LMS) {
        var vm = this;
        var layouts = [],
            allLayouts = LMS.layouts('listings.items');

        for (var i in allLayouts){
            layouts.push({
                label : allLayouts[i].label,
                value : allLayouts[i].varName,
            });
        }

        vm.Model = Config.listingModel;
        vm.additionalFields = [
            {
                varName : 'layoutId',
                label : 'Layout',
                type : 'selectMultiple',
                options : layouts
            }
        ];
    }
})();
