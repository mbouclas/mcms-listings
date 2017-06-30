(function(){
    'use strict';

    angular.module('mcms.listings.listing', [
        'cfp.hotkeys'
    ])
        .run(run);

    run.$inject = ['mcms.widgetService'];

    function run(Widget) {
        Widget.registerWidget(Widget.newWidget({
            id : 'latestListings',
            title : 'Latest listings',
            template : '<latest-listings-widget></latest-listings-widget>',
            settings : {},
            order : 10
        }));

    }
})();

require('./routes');
require('./dataService');
require('./service');
require('./ListingHomeController');
require('./ListingController');
require('./listingList.component');
require('./editListing.component');
require('./Widgets/latestListings.widget');
