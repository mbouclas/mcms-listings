(function () {
    'use strict';

    angular.module('mcms.listings.addons')
        .service('ListingAddonService',Service);

    Service.$inject = ['ListingAddonDataService', 'LangService', 'lodashFactory',
        '$q', 'ItemSelectorService', 'mcms.settingsManagerService', '$location',
        'core.services'];

    function Service(DS, Lang, lo, $q, ItemSelector,
                     SM, $location, Helpers) {
        var _this = this,
            Filters = {},
            ExtraFields = [],
            Addons = [],
            ImageSettings = {},
            ImageCopies = [];

        this.get = get;
        this.setAddons = setAddons;
        this.getAddons = getAddons;
        this.init = init;
        this.find = find;
        this.newListing = newListing;
        this.save = save;
        this.destroy = destroy;
        this.availableFilters = availableFilters;
        this.previewUrl = previewUrl;
        this.extraFields = extraFields;
        this.formatListingAccessor = formatListingAccessor;
        this.formatListingMutator = formatListingMutator;
        this.imageSettings = imageSettings;

        function init(filters) {
            Filters = Helpers.parseLocation(availableFilters(), $location.search());

            if (lo.isObject(filters)){
                Filters = angular.extend(filters, Filters);
            }

            var tasks = [
                get(Filters)
            ];

            return $q.all(tasks);
        }

        function setAddons(addons) {
            Addons = addons;
        }

        function getAddons() {
            return Addons;
        }

        function get(filters) {
            return DS.index(filters)
                .then(function (response) {
                    Addons = response;
                    return Addons;
                });
        }

        function categories() {
            return ListingCategoryService.tree();
        }

        function find(id) {
            return DS.show(id)
                .then(function (response) {

                    ItemSelector.register(response.connectors);
                    MediaFiles.setImageCategories(response.imageCategories);
                    SM.addSettingsItem(response.settings);
                    if (typeof response.config == 'undefined' || typeof response.config.previewController == 'undefined'){
                        Config.previewUrl = null;
                    }
                    imageSettings().set(response.imageCopies);
                    SEO.init(response.seoFields);
                    Tags.set(response.tags);
                    ExtraFields = ExtraFieldService.convertFieldsFromMysql(response.extraFields);
                    DynamicTableService.tables('listings', response.dynamicTables);
                    return formatListingAccessor(response.item) || newListing();
                });
        }

        function newListing() {
            return {
                title : Lang.langFields(),
                slug : '',
                sku : '',
                description : Lang.langFields(),
                description_long : Lang.langFields(),
                active : false,
                price : 0,
                categories : [],
                extraFields : [],
                tagged : [],
                related : [],
                files : [],
                settings : {
                    seo : {}
                },
                id : null
            };
        }

        function save(item) {
            var toSave = angular.copy(item);
            toSave = formatListingMutator(toSave);
            if (!item.id){
                return DS.store(toSave);
            }

            return DS.update(toSave);
        }

        function destroy(item) {
            return DS.destroy(item.id);
        }

        function availableFilters(reset) {
            if (!lo.isEmpty(Filters) && !reset){
                return Filters;
            }

            return {
                id : null,
                title: null,
                description: null,
                active: null,
                dateStart: null,
                dateEnd: null,
                category_id: null,
                category_ids : [],
                dateMode: 'created_at',
                orderBy : 'created_at',
                way : 'DESC',
                limit :  10
            };
        }

        function extraFields() {
            return ExtraFields;
        }

        function previewUrl(id) {
            return DS.previewUrl(id);
        }

        function formatListingAccessor(item) {
            if (lo.isNull(item)){
                return item;
            }

            var precision = 2;

            if (lo.isObject(item.price)){
                precision = item.price.currency[Object.keys(item.price.currency)[0]].precision || 2;
                item.price = parseFloat(item.price.amount/100).toFixed(precision);
            } else if (lo.isNumber(item.price)) {
                item.price = parseFloat(item.price/100).toFixed(precision);
            }

            return item;
        }

        function formatListingMutator(item) {
            item.price = parseInt(item.price*100);

            return item;
        }

        function imageSettings() {
            return {
                set : function(val){
                    ImageSettings = val;
                    lo.forEach(val.copies, function (copy, key) {
                        copy.key = key;
                        ImageCopies.push(copy);
                    });
                },
                recommendedSizeLabel : function(){
                    return ImageSettings.recommendedSize || null;
                },
                adminCopy : function () {
                    var copy = lo.find(ImageCopies, {useOnAdmin : true});
                    return (copy) ? copy.key : 'thumb';
                }
            };
        }
    }
})();
