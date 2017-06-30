(function(){
    'use strict';

    angular.module('mcms.listings.listingCategory', [
        'ui.tree'
    ])
        .run(run);

    run.$inject = ['mcms.menuService'];

    function run(Menu) {

    }


})();

require('./routes');
require('./dataService');
require('./service');
require('./ListingCategoryHomeController');
require('./editListingCategory.component');