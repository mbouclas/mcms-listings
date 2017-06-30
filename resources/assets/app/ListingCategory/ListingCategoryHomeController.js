(function() {
    'use strict';

    angular.module('mcms.listings.listingCategory')
        .controller('ListingCategoryHomeController',Controller);

    Controller.$inject = ['init', 'LangService', 'Dialog', 'ListingCategoryService', 'core.services', 'ItemSelectorService'];

    function Controller(Categories, Lang, Dialog, ListingCategoryService, Helpers, ItemSelector) {
        var vm = this;
        vm.Categories = Categories;
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.treeOptions = {
            dragStop: function (ev) {

            }
        };

        ListingCategoryService.find(3)
            .then(function (res) {
                vm.Item = res;
                vm.Connectors = ItemSelector.connectors();

            });

        vm.onResult = function (result) {
            if (typeof vm.Item.featured == 'undefined' || !vm.Item.featured){
                vm.Item.featured = [];
            }

            vm.Item.featured.push(result);
        };

        vm.onSave = function (item, isNew, parent) {
            if (isNew){
                if (parent){
                    if (!parent.children){
                        parent.children = [];
                    }

                    parent.children.push(item);
                } else {
                    vm.Categories.push(item);
                }
                ListingCategoryService.toFlat();

                Dialog.close();
                vm.edit(item);
            }
            var found = ListingCategoryService.where({id : item.id});

            if (found){
                found.title= item.title;
            }
        };

        vm.add = function (node) {
            node = node || null;
            var newCategory = ListingCategoryService.newCategory();
            newCategory.parent_id = node.id;

            Dialog.show({
                title: (!node) ? 'Create root node' : 'Add node to "' + node.title[vm.defaultLang] + '"',
                contents: '<edit-listing-category item="VM.node" add-to="VM.parentNode" ' +
                'on-save="VM.onSave(item, isNew, parent)"></edit-listing-category>',
                locals: {
                    node: newCategory,
                    onSave: vm.onSave,
                    parentNode: node || null
                }
            });
        };

        vm.edit = function (node) {
            if (!node){
                node = ListingCategoryService.newCategory();
            }

            Dialog.show({
                title: (node.id) ? 'Edit "' + node.title[vm.defaultLang] + '"' : 'Create new',
                contents: '<edit-listing-category item="VM.node" ' +
                'on-save="VM.onSave(item, isNew)"></edit-listing-category>',
                locals: {
                    node: (node.id) ? node.id : node,
                    onSave: vm.onSave
                }
            });

        };

        vm.save = function () {
            ListingCategoryService.rebuild(vm.Categories)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.delete = function (node) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    ListingCategoryService.destroy(node)
                        .then(function (nodes) {
                            vm.Categories = nodes;
                            Helpers.toast('Deleted');
                        });
                });
        };
    }

})();
