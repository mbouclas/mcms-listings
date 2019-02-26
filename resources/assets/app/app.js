(function () {
    'use strict';

    angular.module('mcms.listings', [
        'mcms.mediaFiles',
        'mcms.fileGallery',
        'mcms.extraFields',
        'mcms.listings.listing',
        'mcms.listings.listingCategory',
        'mcms.listings.extraFields',
        'mcms.listings.addons',
        'ngFileUpload'
    ])
        .run(run);

    run.$inject = ['mcms.menuService', 'LISTINGS_CONFIG', 'DynamicTableService'];

    function run(Menu, Config, DynamicTableService) {
        DynamicTableService.mapModel('listings', Config.itemModelName);

        Menu.addMenu(Menu.newItem({
            id: 'listings',
            title: 'Listings',
            permalink: '',
            icon: 'shopping_cart',
            order: 1,
            acl: {
                type: 'level',
                permission: 2
            }
        }));

        var listingsMenu = Menu.find('listings');

        listingsMenu.addChildren([
            Menu.newItem({
                id: 'listingsCategories-manager',
                title: 'Categories',
                permalink: '/listings/categories',
                icon: 'view_list',
                order : 1
            }),
            Menu.newItem({
                id: 'listings-manager',
                title: 'Catalogue',
                permalink: '/listings/content',
                icon: 'content_copy',
                order : 2
            }),
            Menu.newItem({
                id: 'listings-extra-fields',
                title: 'Extra Fields',
                permalink: '/listings/extraFields',
                icon: 'note_add',
                order : 3
            }),
            Menu.newItem({
                id: 'dynamic-tables',
                title: 'Dynamic Tables',
                permalink: '/dynamicTables/listings',
                icon: 'assignment',
                order : 4
            }),
            Menu.newItem({
                id: 'listing-addons',
                title: 'Addons',
                permalink: '/listings/addons',
                icon: 'add_to_queue',
                order : 5
            })
        ]);
    }

})();

require('./config');
require('./Listing');
require('./ListingCategory');
require('./ExtraFields');
require('./Addons');
