(function() {
    'use strict';

    angular.module('mcms.listings.addons')
        .controller('AddonsHomeController',Controller);

    Controller.$inject = ['init', 'ListingAddonService', '$mdBottomSheet', 'LangService',
        '$mdSidenav', 'BottomSheet', 'Dialog', '$filter', '$location', 'core.services', '$rootScope', '$scope'];

    function Controller(Init, ListingAddonService, $mdBottomSheet, Lang, $mdSidenav, BottomSheet, Dialog,
                        $filter, $location, Helpers, $rootScope, $scope) {

        Helpers.clearLocation($scope);
        var vm = this;
        vm.boolValues = [
            {
                label: 'Don\'t care',
                value: null
            },
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];
        vm.filters = ListingAddonService.availableFilters();

        var Addons = Init[0];
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Pagination = Addons;
        vm.Items = Addons.data;
        vm.Categories = Init[1];

        vm.sort = function (sort, direction) {
            vm.filters.orderBy = sort;
            vm.filters.way = direction || null;
            filter();
        };

        function filter() {
            vm.Loading = true;
            vm.Items = [];
            return ListingAddonService.get(vm.filters)
                .then(function (res) {
                    $location.search(vm.filters);
                    vm.Loading = false;
                    vm.Pagination = res;
                    vm.Items = res.data;
                    $rootScope.$broadcast('scroll.to.top');
                });
        }

        vm.changePage = function (page, limit) {
            vm.filters.page = page;
            // console.log(vm.filters);
            filter();
        };

        vm.applyFilters = function () {
            vm.filters.listing = 1;
            filter();
        };

        vm.listItemClick = function($index) {
            $mdBottomSheet.hide(clickedItem);
        };

        vm.toggleFilters = function () {
            $mdSidenav('filters').toggle();
        };

        vm.edit = function (item) {
            var id = (item) ? item.id : 'new';
            $location.path($filter('reverseUrl')('addons-edit',{id : id}).replace('#',''));
        };

        vm.quickEdit = function (item) {
            if (!item || !item.id){
                item = ListingAddonService.newListing();
            }


            Dialog.show({
                title : (!item.id) ? 'Create item' : 'Edit #' + item.id,
                contents : '<edit-listing item="VM.Item.id" on-save="VM.onSave(item, isNew)"></edit-listing>',
                locals : {
                    Item :item,
                    onSave : vm.onSave
                }
            });
        };

        vm.enableItem = function (item) {
            item.active = true;

            ListingAddonService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.disableItem = function (item) {
            item.active = false;

            ListingAddonService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.delete = function (item) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    ListingAddonService.destroy(item)
                        .then(function () {
                            filter();
                            Helpers.toast('Saved!');
                        });
                });
        };

        vm.showActions = function (ev, item) {
            var toggle = (item.active) ?
            { name: 'Disable', icon: 'block', fn : vm.disableItem } :
            { name: 'Enable', icon: 'done', fn : vm.enableItem };

            BottomSheet.show({
                item : item,
                title : 'Edit ' + item.title[vm.defaultLang]
            },[
                { name: 'Edit', icon: 'edit', fn : vm.edit },
                { name: 'Quick Edit', icon: 'edit', fn : vm.quickEdit },
                toggle,
                { name: 'Delete', icon: 'delete', fn : vm.delete },
            ]);
        };

        vm.resetFilters = function () {
            resetFilters();
            filter();
        };

        function resetFilters() {
            vm.filters = ListingAddonService.availableFilters(true);
        }

    }

})();
