(function(){
    'use strict';

    angular.module('mcms.listings.listing')
        .directive('latestListingsWidget', Component);

    Component.$inject = ['LISTINGS_CONFIG', 'ListingService'];

    function Component(Config, Listing){

        return {
            templateUrl: Config.templatesDir + "Listing/Widgets/latestListings.widget.html",
            restrict : 'E',
            scope : {
                options : '=?options'
            },
            link : function(scope, element, attrs, controllers){
                scope.Options = {limit : 5};
                if (typeof scope.options != 'undefined'){
                    scope.Options = angular.extend(scope.Options, scope.options);
                }

                Listing.init({limit : scope.Options.limit}).then(function (res) {
                    scope.Categories = res[1];
                    scope.Items = res[0];

                });
            }
        };
    }
})();