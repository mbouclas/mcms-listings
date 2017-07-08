(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function(){
    'use strict';

    angular.module('mcms.listings.extraFields', []);
})();

require('./routes');
require('./ExtraFieldHomeController');

},{"./ExtraFieldHomeController":1,"./routes":3}],3:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.listings.extraFields')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/extraFields', {
                templateUrl:  Config.templatesDir + 'ExtraFields/index.html',
                controller: 'ListingsExtraFieldHomeController',
                controllerAs: 'VM',
                reloadOnSearch : true,
                resolve: {
                    init : ["AuthService", '$q', function (ACL, $q) {
                        return (!ACL.role('admin')) ? $q.reject(403) : $q.resolve();
                    }]
                },
                name: 'listings-extra-fields-home'
            });
    }

})();

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.listings.listingCategory')
        .service('ListingCategoryDataService',Service);

    Service.$inject = ['$http', '$q'];

    function Service($http, $q) {
        var _this = this;
        var baseUrl = '/admin/api/listingCategory/';

        this.index = index;
        this.tree = tree;
        this.store = store;
        this.show = show;
        this.update = update;
        this.destroy = destroy;
        this.rebuild = rebuild;

        function index() {
            return $http.get(baseUrl).then(returnData);
        }

        function tree(filters) {
            return $http.get(baseUrl + 'tree', {params : filters}).then(returnData);
        }

        /**
         * Creates a new category
         *
         * @param {object} category - the category object
         * @returns {object} - the ajax response
         */
        function store(category) {
            return $http.post(baseUrl, category)
                .then(returnData);
        }

        function show(id) {
            return $http.get(baseUrl + id)
                .then(returnData);
        }

        function update(category) {
            return $http.put(baseUrl + category.id, category)
                .then(returnData);
        }

        function destroy(id) {
            return $http.delete(baseUrl + id)
                .then(returnData);
        }

        function rebuild(tree) {
            return $http.put(baseUrl + 'rebuild', tree)
                .then(returnData);
        }

        function returnData(response) {
            return response.data;
        }
    }
})();

},{}],6:[function(require,module,exports){
(function () {
    angular.module('mcms.listings.listing')
        .directive('editListingCategory', Directive);

    Directive.$inject = ['LISTINGS_CONFIG', '$timeout'];
    DirectiveController.$inject = ['$scope', 'ListingCategoryService',
        'core.services', 'configuration', 'AuthService', 'LangService',
        'LISTINGS_CONFIG', 'ItemSelectorService', 'SeoService', 'mcms.settingsManagerService',
        'LayoutManagerService', 'ModuleExtender'];

    function Directive(Config, $timeout) {

        return {
            templateUrl: Config.templatesDir + "ListingCategory/editListingCategory.component.html",
            controller: DirectiveController,
            controllerAs: 'VM',
            require: ['editListingCategory'],
            scope: {
                options: '=?options',
                addTo: '=?addTo',
                item: '=?item',
                onSave: '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    hasFilters: true
                };

                controllers[0].init(scope.item);
                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function DirectiveController($scope, ListingCategory, Helpers, Config, ACL, Lang, ListingsConfig, ItemSelector, SEO, SM, LMS, ModuleExtender) {
        var vm = this;
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();
        vm.ValidationMessagesTemplate = Config.validationMessages;
        vm.Roles = ACL.roles();
        vm.Item = {};
        vm.Parent = null;
        vm.Roles = ACL.roles();
        vm.Permissions = ACL.permissions();
        vm.isSu = ACL.role('su');//more efficient check
        vm.isAdmin = ACL.role('admin');//more efficient check
        vm.tabs = [
            {
                label: 'General',
                file: ListingsConfig.templatesDir + 'ListingCategory/Components/tab-general-info.html',
                active: true,
                default: true,
                id: 'general',
                order : 1
            },
            {
                label: 'Translations',
                file: ListingsConfig.templatesDir + 'ListingCategory/Components/tab-translations.html',
                active: false,
                id: 'translations',
                order : 10
            },
            {
                label: 'Extra Fields',
                file: ListingsConfig.templatesDir + 'Listing/Components/tab-extra-fields.html',
                active: false,
                id: 'extraFields',
                order : 20
            },
            {
                label: 'Featured',
                file: ListingsConfig.templatesDir + 'ListingCategory/Components/tab-featured.html',
                active: false,
                id: 'featured',
                order : 30
            },
            {
                label : 'SEO',
                file : ListingsConfig.templatesDir + 'ListingCategory/Components/tab-seo.html',
                active : false,
                id : 'seo',
                order : 40
            }
        ];

        vm.tabs = ModuleExtender.extend('listings', vm.tabs);
        vm.Layouts = LMS.layouts('listings.categories');
        vm.LayoutsObj = LMS.toObj();

        vm.thumbUploadOptions = {
            url : Config.imageUploadUrl,
            acceptSelect : ListingsConfig.fileTypes.image.acceptSelect,
            maxFiles : 1,
            params : {
                container : 'Item'
            }
        };
        vm.UploadConfig = {
            file: {},
            image: vm.imagesUploadOptions
        };

        vm.init = function (item) {
            if (typeof item == 'number') {
                //call for data from the server
                return ListingCategory.find(item)
                    .then(init);
            }

            init(item);

        };

        vm.onResult = function (result) {
            if (typeof vm.Item.featured == 'undefined' || !vm.Item.featured){
                vm.Item.featured = [];
            }

            result.category_id = vm.Item.id;
            vm.Item.featured.push(result);
        };


        vm.save = function () {
            ListingCategory.save(vm.Item)
                .then(function (result) {
                    var isNew = (!vm.Item.id && result.id);
                    if (isNew) {
                        vm.Item = result;
                        vm.Item.children = [];
                    }

                    Helpers.toast('Saved!');

                    if (typeof $scope.onSave == 'function') {
                        $scope.onSave({item: vm.Item, isNew: isNew, parent: vm.Parent});
                    }
                });
        };

        function init(item) {
            vm.Connectors = ItemSelector.connectors();
            vm.Item = item;

            SEO.fillFields(vm.Item.settings, function (model, key) {
                SEO.prefill(model, vm.Item, key);
            });

            vm.SEO = SEO.fields();
            vm.Parent = $scope.addTo || null;
            vm.thumbUploadOptions.params.item_id = item.id;
            vm.thumbUploadOptions.params.configurator = '\\Mcms\\Listings\\Services\\ListingCategory\\ImageConfigurator';
            vm.thumbUploadOptions.params.type = 'thumb';
            vm.Settings = SM.get({name : 'listingCategories'});
            LMS.setModel(vm.Item);
        }
    }
})();
},{}],7:[function(require,module,exports){
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
},{"./ListingCategoryHomeController":4,"./dataService":5,"./editListingCategory.component":6,"./routes":8,"./service":9}],8:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.listings.listingCategory')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/categories', {
                templateUrl:  Config.templatesDir + 'ListingCategory/index.html',
                controller: 'ListingCategoryHomeController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    init : ["AuthService", '$q', 'ListingCategoryService', function (ACL, $q, Category) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Category.get();
                    }]
                },
                name: 'listings-categories'
            });
    }

})();

},{}],9:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.listings.listingCategory')
        .service('ListingCategoryService',Service);

    Service.$inject = ['ListingCategoryDataService', 'ItemSelectorService', 'SeoService', 'LangService',
        'core.services', 'lodashFactory','mcms.settingsManagerService'];

    function Service(DS, ItemSelector, SEO, Lang, Helpers, lo, SM) {
        var _this = this;
        var Categories = [];
        var CategoriesFlat = [];
        this.get = get;
        this.setCategories = setCategories;
        this.find = find;
        this.newCategory = newCategory;
        this.save = save;
        this.destroy = destroy;
        this.rebuild = rebuild;
        this.tree = tree;
        this.categories = categories;
        this.toFlat = flattenCategories;
        this.where = where;

        function get() {
            return DS.index()
                .then(function (response) {
                    setCategories(response)
                    return response;
                });
        }

        function setCategories(categories) {
            Categories = categories;
            CategoriesFlat = flattenCategories();
        }

        function find(id) {
            return DS.show(id)
                .then(function (response) {
                    ItemSelector.register(response.connectors);
                    SEO.init(response.seoFields);
                    SM.addSettingsItem(response.settings);
                    return response.item;
                });
        }

        function tree(filters) {
            return DS.tree(filters)
                .then(function (response) {
                    return response;
                });
        }


        /**
         * Create the holder object for a new category object
         *
         * @returns {{title: string, description: string, slug: string, children: Array, settings: {}, active: boolean, orderBy: number}}
         */
        function newCategory() {
            var Locales = Lang.locales();
            var settings = {seo : {}};
            for (var key in Locales){
                settings.seo[key] = {};
            }

            return {
                title : Lang.langFields(),
                description : Lang.langFields(),
                slug : '',
                children : [],
                settings : settings,
                active : false,
                orderBy : 0,
            };
        }

        function save(item) {
            if (!item.id){
                return DS.store(item);
            }


            return DS.update(item);
        }

        function destroy(item) {
            return DS.destroy(item.id);
        }

        function rebuild(tree) {
            return DS.rebuild(tree)
                .then(function (newTree) {
                    Categories = newTree;
                });
        }

        function categories() {
            return Categories;
        }

        function flattenCategories() {
            CategoriesFlat = Helpers.flattenTree(Categories);
            return CategoriesFlat;
        }

        function where(search) {
            return lo.find(CategoriesFlat, search);
        }

    }
})();

},{}],10:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.listings.listing')
        .controller('ListingController',Controller);

    Controller.$inject = ['item', 'LangService', '$location', '$filter', '$scope', '$rootScope', 'ListingService'];

    function Controller(Item, Lang, $location, $filter, $scope, $rootScope, ListingService) {
        var vm = this,
            previewOn = false;

        vm.Item = Item;
        vm.defaultLang = Lang.defaultLang();
        vm.previewAvailable = true;



        vm.onSave = function (item, isNew) {
            if (isNew){
                $location.path($filter('reverseUrl')('listings-edit',{id : item.id}).replace('#',''));
            }
        };

        vm.preview = function () {
            if (typeof vm.Item.id == 'undefined'){
                return;
            }

            if (previewOn) {
                togglePreview();
                previewOn = false;
                return;
            }

            ListingService.previewUrl(vm.Item.id)
                .then(function (response) {
                    vm.previewSrc = response.url;
                    togglePreview();
                    previewOn = true;
                });
        };

        vm.openInNewTab = function () {
            ListingService.previewUrl(vm.Item.id)
                .then(function (response) {
                    var win = window.open(response.url, '_blank');
                    if (win) {
                        //Browser has allowed it to be opened
                        win.focus();
                    } else {
                        //Browser has blocked it
                        alert('Please allow popups for this website');
                    }

                });
        };

        function togglePreview() {
            $scope.preview = !$scope.preview;
            $scope.layout = ($scope.preview) ? 'row' : 'column';
            $rootScope.$broadcast('sideNav.unlock', !$scope.preview);
            $rootScope.$broadcast('listing.preview', $scope.preview);
        }

    }

})();

},{}],11:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.listings.listing')
        .controller('ListingHomeController',Controller);

    Controller.$inject = ['init', 'ListingService', '$mdBottomSheet', 'LangService',
        '$mdSidenav', 'BottomSheet', 'Dialog', '$filter', '$location', 'core.services', '$rootScope', '$scope'];

    function Controller(Init, ListingService, $mdBottomSheet, Lang, $mdSidenav, BottomSheet, Dialog,
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
        vm.filters = ListingService.availableFilters();

        var Listings = Init[0];
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Pagination = Listings;
        vm.Items = Listings.data;
        vm.Categories = Init[1];

        vm.sort = function (sort, direction) {
            vm.filters.orderBy = sort;
            vm.filters.way = direction || null;
            filter();
        };

        function filter() {
            vm.Loading = true;
            vm.Items = [];
            return ListingService.get(vm.filters)
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
            $location.path($filter('reverseUrl')('listings-edit',{id : id}).replace('#',''));
        };

        vm.quickEdit = function (item) {
            if (!item || !item.id){
                item = ListingService.newListing();
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

            ListingService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.disableItem = function (item) {
            item.active = false;

            ListingService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.delete = function (item) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    ListingService.destroy(item)
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
            vm.filters = ListingService.availableFilters(true);
        }

    }

})();

},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
(function () {
    angular.module('mcms.listings.listing')
        .directive('editListing', Directive);

    Directive.$inject = ['LISTINGS_CONFIG', 'hotkeys'];
    DirectiveController.$inject = [ '$scope','ListingService',
        'core.services', 'configuration', 'AuthService', 'LangService',
        'ListingCategoryService',  'LISTINGS_CONFIG', 'ItemSelectorService', 'lodashFactory',
        'mcms.settingsManagerService', 'SeoService', 'LayoutManagerService', '$timeout', '$rootScope', '$q',
        'momentFactory', 'ModuleExtender', 'MediaLibraryService', 'ExtraFieldService', 'DynamicTableService'];

    function Directive(Config, hotkeys) {

        return {
            templateUrl: Config.templatesDir + "Listing/editListing.component.html",
            controller: DirectiveController,
            controllerAs: 'VM',
            require : ['editListing'],
            scope: {
                options: '=?options',
                item: '=?item',
                onSave : '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    hasFilters: true,
                    isWindow : false
                };

                scope.refreshIframe = function () {
                    var iframe = document.getElementById('preview');
                    if (!iframe){
                        return;
                    }

                    iframe.contentDocument.location.reload(true);
                };

                hotkeys.add({
                    combo: 'ctrl+s',
                    description: 'save',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function(e) {
                        e.preventDefault();
                        controllers[0].save();
                    }
                });

                controllers[0].init(scope.item);
                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function DirectiveController($scope, Listing, Helpers, Config, ACL, Lang, ListingCategory, ListingsConfig,
                                 ItemSelector, lo, SM, SEO, LMS, $timeout, $rootScope, $q,
                                 moment, ModuleExtender, MLS, ExtraFieldService, DynamicTableService) {
        var vm = this,
            autoSaveHooks = [],
            Model = '\\Mcms\\Listings\\Models\\Listing';

        vm.published_at = {};
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();
        vm.ValidationMessagesTemplate = Config.validationMessages;
        vm.Roles = ACL.roles();
        vm.Item = {};
        vm.Roles = ACL.roles();
        vm.Permissions = ACL.permissions();
        vm.isSu = ACL.role('su');//more efficient check
        vm.isAdmin = ACL.role('admin');//more efficient check

        vm.tabs = [
            {
                label : 'General',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-general-info.html',
                active : true,
                default : true,
                id : 'general',
                order : 1
            },
            {
                label : 'Translations',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-translations.html',
                active : false,
                id : 'translations',
                order : 20
            },
            {
                label : 'Image gallery',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-image-gallery.html',
                active : false,
                default : false,
                id : 'imageGallery',
                order : 30
            },
            {
                label : 'Files',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-file-gallery.html',
                active : false,
                default : false,
                id : 'fileGallery',
                order : 40
            },
            {
                label : 'Extra Fields',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-extra-fields.html',
                active : false,
                id : 'extraFields',
                order : 45
            },
            {
                label : 'Related Items',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-related-items.html',
                active : false,
                id : 'related',
                order : 50
            },
            {
                label : 'SEO',
                file : ListingsConfig.templatesDir + 'Listing/Components/tab-seo.html',
                active : false,
                id : 'seo',
                order : 60
            }
        ];

        vm.tabs = ModuleExtender.extend('listings', vm.tabs);
        if (Lang.allLocales().length == 1){
            //remove the translation tab
            var tabIndex = lo.findIndex(vm.tabs, {id : 'translations'});
            vm.tabs.splice(tabIndex, 1);
        }
        vm.Categories = [];
        vm.thumbUploadOptions = {
            url : Config.imageUploadUrl,
            acceptSelect : ListingsConfig.fileTypes.image.acceptSelect,
            maxFiles : 1,
            params : {
                container : 'Item'
            }
        };

        vm.imagesUploadOptions = {
            url : ListingsConfig.imageUploadUrl,
            acceptSelect : ListingsConfig.fileTypes.image.acceptSelect,
            params : {
                container : 'Item'
            },
            uploadOptions : ListingsConfig.fileTypes.image.uploadOptions
        };
        vm.mediaFilesOptions = {imageTypes : [], withMediaLibrary : true};
        vm.UploadConfig = {
            file : {},
            image : vm.imagesUploadOptions
        };

        vm.FileUploadConfig = {
            url : Config.fileUploadUrl,
            acceptedFiles : ListingsConfig.fileTypes.file.acceptSelect,
            uploadOptions : ListingsConfig.fileTypes.file.uploadOptions,
            params : {
                container : 'Item'
            }
        };

        vm.Layouts = LMS.layouts('listings.items');
        vm.LayoutsObj = LMS.toObj();
        vm.categoriesValid = null;

        vm.init = function (item) {
            if (!item.id){
                //call for data from the server
                return Listing.find(item)
                    .then(init);
            }

            init(item);

        };


        vm.exists = function (item, type) {
            type = (!type) ? 'checkForPermission' : 'checkFor' + type;
            return ACL[type](vm.User, item);
        };

        vm.save = function () {
            vm.errorsFound = false;
            if (typeof $scope.ItemForm == 'undefined'){
                return $q.reject();
            }

            if (!$scope.ItemForm.$valid){

                Helpers.toast($scope.ItemForm.$error.required.length + ' Errors found, please fill all required fields', null, 5000, 'error');
                vm.errorsFound = true;

                $rootScope.$broadcast('scroll.to.top');
                return $q.reject();
            }

            var isNew = (!(typeof vm.Item.id == 'number'));

            vm.Item.published_at = Helpers.deComposeDate(vm.publish_at).toISOString();


            return Listing.save(vm.Item)
                .then(function (result) {
                    Helpers.toast('Saved!', null, null, 'success');

                    if (isNew){
                        vm.Item = result;
                    }

                    if (typeof $scope.onSave == 'function'){
                        $scope.onSave({item : result, isNew : isNew});
                    }

                    return result;
                });
        };

        vm.onResult = function (result) {
            if (typeof vm.Item.related == 'undefined' || !vm.Item.related){
                vm.Item.related = [];
            }

            result.source_item_id = vm.Item.id;
            vm.Item.related.push(result);
        };

        vm.removeCategory = function (cat) {
            vm.Item.categories.splice(lo.findIndex(vm.Item.categories, {id : cat.id}), 1);

            if (vm.Item.categories.length == 0){
                vm.categoriesValid = null;
            }
        };

        vm.onCategorySelected = function (cat) {

            if (!cat || typeof cat.id == 'undefined'){
                return;
            }

            if (lo.find(vm.Item.categories, {id : cat.id})){
                return;
            }

            vm.Item.categories.push(cat);
            vm.categoriesValid = true;
            vm.searchText = null;
        };

        vm.getCategories = function (query) {

            if (vm.Categories.length > 0){
                return (!query) ? vm.Categories : vm.Categories.filter( Helpers.createFilterFor('title',query) );
            }

            return ListingCategory.tree()
                .then(function (res) {
                    vm.Categories = res;
                    return (!query) ? res : res.filter( Helpers.createFilterFor('title',query) );
                });
        };

        function init(item) {
            vm.Item = item;
            vm.DynamicTables = DynamicTableService.tables('listings');

            if (typeof vm.Item.files == 'undefined'){
                vm.Item.files = [];
            }
            if (!lo.isObject(vm.Item.extra_fields)){
                vm.Item.extra_fields = {};
            }
            vm.Item.extra_fields = ExtraFieldService.simplifyFromMysql(item.extra_fields);

            SEO.fillFields(vm.Item.settings, function (model, key) {
                SEO.prefill(model, vm.Item, key);
            });
            // console.log(lo.find(vm.Layouts, {varName : vm.Item.settings.Layout.id}));
            vm.publish_at = Helpers.composeDate(vm.Item.published_at);
            vm.SEO = SEO.fields();
            vm.Connectors = ItemSelector.connectors();
            vm.thumbUploadOptions.params.item_id = item.id;
            vm.thumbUploadOptions.params.model = Model;
            vm.thumbUploadOptions.params.type = 'thumb';
            vm.thumbUploadOptions.params.resize = true;
            vm.imagesUploadOptions.params.item_id = item.id;
            vm.imagesUploadOptions.params.model = Model;
            vm.imagesUploadOptions.params.type = 'images';
            vm.imagesUploadOptions.params.resize = true;
            vm.FileUploadConfig.params.item_id = item.id;
            vm.FileUploadConfig.params.model = Model;
            vm.FileUploadConfig.params.type = 'file';
            LMS.setModel(vm.Item);
            vm.Settings = SM.get({name : 'listings'});
            if (lo.isArray(vm.Item.categories) && vm.Item.categories.length > 0){
                vm.categoriesValid = true;
            }

            vm.filterExtraFields();
            vm.adminSize = Listing.imageSettings().adminCopy();
            vm.recommendedSizeLabel = Listing.imageSettings().recommendedSizeLabel();
        }

        vm.filterExtraFields = function() {
            var layout = (typeof vm.Item.settings.Layout.id != 'undefined') ? vm.Item.settings.Layout.id : null;

            vm.ExtraFields = ExtraFieldService
                .filter(Listing.extraFields())
                .whereIn('layoutId', layout);
        };



        var watcher = null,
            timer = null;

        /*
         * autosave
         * */
        watcher = $scope.$watch(angular.bind(vm, function () {
            var publishDate = Helpers.deComposeDate(vm.publish_at);
            if (publishDate.isAfter(moment())){
                vm.Item.active = false;
                vm.disableStatus = true;
                vm.toBePublished = publishDate;
            } else {
                vm.disableStatus = false;
            }
            return this.Item;
        }), function (newVal) {

            if(angular.isDefined(timer)){
                $timeout.cancel(timer);
            }

            if (typeof newVal.id == 'undefined' || !newVal.id){
                watcher();
                return;
            }

            timer = $timeout(function () {
                vm.save().then(function (item) {

                    for (var i in autoSaveHooks){
                        autoSaveHooks[i].call(this, item);
                    }
                });
            }, 5000);

        }, true);

        $scope.$on(
            "$destroy",
            function( event ) {
                $timeout.cancel( timer );
            }
        );

        $rootScope.$on('listing.preview', function (e, preview) {
            if (preview){
                autoSaveHooks.push($scope.refreshIframe);
            } else {
                autoSaveHooks.splice(autoSaveHooks.indexOf($scope.refreshIframe), 1);
            }
        });

        vm.onSelectFromMediaLibrary = function (item) {
            MLS.assign(vm.thumbUploadOptions.params,item)
                .then(function (res) {
                    vm.Item.thumb = res;
                    Helpers.toast('Saved!!!');
                });
        };

    }
})();

},{}],15:[function(require,module,exports){
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

},{"./ListingController":10,"./ListingHomeController":11,"./Widgets/latestListings.widget":12,"./dataService":13,"./editListing.component":14,"./listingList.component":16,"./routes":17,"./service":18}],16:[function(require,module,exports){
(function () {
    angular.module('mcms.listings.listing')
        .directive('listingList', Directive);

    Directive.$inject = ['LISTINGS_CONFIG', '$timeout'];
    Controller.$inject = ['$scope', 'ListingService', '$mdBottomSheet', 'LangService',
        '$mdSidenav', 'BottomSheet', 'Dialog', '$filter', '$location', 'core.services', '$rootScope'];

    function Directive(Config, $timeout) {

        return {
            templateUrl: Config.templatesDir + "Listing/Components/listingList.component.html",
            controller: Controller,
            controllerAs: 'VM',
            require: ['listingList'],
            scope: {
                options: '=?options',
                items: '=items',
                categories: '=?categories',
                onSave: '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    limit : 10
                };
                var watcher = scope.$watch('items', function (val) {
                   if (!val){
                       return;
                   }
                    controllers[0].setUp(scope.items, scope.categories);
                    watcher();
                });

                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function Controller($scope, ListingService, $mdBottomSheet, Lang, $mdSidenav, BottomSheet, Dialog,
                        $filter, $location, Helpers, $rootScope) {
        var vm = this,
            Filters = {
                title: null,
                description: null,
                description_long: null,
                active: null,
                userId: null,
                dateStart: null,
                dateEnd: null,
                category_ids : [],
                dateMode: 'created_at',
                orderBy : 'created_at',
                way : 'DESC',
                listing: 1,
                limit : $scope.options.limit || 10
            };
        vm.Items = [];
        vm.Categories = [];
        vm.Pagination = {};

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
        resetFilters();
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();

        this.setUp = function (items, categories) {
            vm.Pagination = items;
            vm.Items = items.data;
            vm.Categories = categories;
        };

        vm.sort = function (sort, direction) {
            vm.filters.orderBy = sort;
            vm.filters.way = direction || null;
            filter();
        };

        function filter() {
            vm.Loading = true;
            vm.Items = [];
            return ListingService.get(vm.filters)
                .then(function (res) {
                    vm.Loading = false;
                    vm.Pagination = res;
                    vm.Items = res.data;
                    $rootScope.$broadcast('scroll.to.top');
                });
        }

        vm.changePage = function (page, limit) {
            vm.filters.page = page;
            filter();
        };

        vm.applyFilters = function () {
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
            $location.path($filter('reverseUrl')('listings-edit',{id : id}).replace('#',''));
        };

        vm.quickEdit = function (item) {
            if (!item || !item.id){
                item = ListingService.newListing();
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

            ListingService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.disableItem = function (item) {
            item.active = false;

            ListingService.save(item)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.delete = function (item) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    ListingService.destroy(item)
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



        function resetFilters() {
            vm.filters = angular.copy(Filters);
        }
    }
})();

},{}],17:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.listings.listing')
        .config(config);

    config.$inject = ['$routeProvider','LISTINGS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/listings/content', {
                templateUrl:  Config.templatesDir + 'Listing/index.html',
                controller: 'ListingHomeController',
                controllerAs: 'VM',
                reloadOnSearch : true,
                resolve: {
                    init : ["AuthService", '$q', 'ListingService', function (ACL, $q, Listing) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Listing.init();
                    }]
                },
                name: 'listings-home'
            })
            .when('/listings/content/:id', {
                templateUrl:  Config.templatesDir + 'Listing/editListing.html',
                controller: 'ListingController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    item : ["AuthService", '$q', 'ListingService', '$route', function (ACL, $q, Listing, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Listing.find($route.current.params.id);
                    }]
                },
                name: 'listings-edit'
            });
    }

})();

},{}],18:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.listings.listing')
        .service('ListingService',Service);

    Service.$inject = ['ListingDataService', 'LangService', 'lodashFactory', 'mediaFileService',
        '$q', 'ListingCategoryService', 'ItemSelectorService', 'mcms.settingsManagerService',
        'SeoService', 'TagsService', '$location', 'LISTINGS_CONFIG', 'core.services', 'ExtraFieldService', '' +
        'DynamicTableService'];

    function Service(DS, Lang, lo, MediaFiles, $q, ListingCategoryService, ItemSelector,
                     SM, SEO, Tags, $location, Config, Helpers, ExtraFieldService, DynamicTableService) {
        var _this = this,
            Filters = {},
            ExtraFields = [],
            Listings = [],
            ImageSettings = {},
            ImageCopies = [];

        this.get = get;
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
                get(Filters),
                categories()
            ];

            return $q.all(tasks);
        }

        function get(filters) {
            return DS.index(filters)
                .then(function (response) {
                    Listings = response;
                    return Listings;
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
                description_long: null,
                active: null,
                userId: null,
                dateStart: null,
                dateEnd: null,
                category_id: null,
                category_ids : [],
                dateMode: 'created_at',
                orderBy : 'created_at',
                way : 'DESC',
                listing: 1,
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

},{}],19:[function(require,module,exports){
(function(){
    'use strict';
    var assetsUrl = '/assets/',
        appUrl = '/app/',
        componentsUrl = appUrl + 'Components/',
        templatesDir = '/vendor/mcms/listings/app/templates/',
    itemModelName = 'Mcms\\\\Listings\\\\Models\\\\Listing',
    categoryModelName = 'Mcms\\\\Listings\\\\Models\\\\ListingCategory';

    var config = {
        itemModelName : itemModelName,
        listingModel : itemModelName,
        listingCategoryModel : categoryModelName,
        apiUrl : '/api/',
        prefixUrl : '/admin',
        previewUrl : '/admin/api/listing/preview/',
        templatesDir : templatesDir,
        imageUploadUrl: '/admin/api/upload/image',
        fileUploadUrl: '/admin/api/upload/file',
        imageBasePath: assetsUrl + 'img',
        validationMessages : templatesDir + 'Components/validationMessages.html',
        appUrl : appUrl,
        componentsUrl : componentsUrl,
        fileTypes : {
            image : {
                accept : 'image/*',
                acceptSelect : 'image/jpg,image/JPG,image/jpeg,image/JPEG,image/PNG,image/png,image/gif,image/GIF'
            },
            document : {
                accept : 'application/pdf,application/doc,application/docx',
                acceptedFiles : '.pdf,.doc,.docx',
                acceptSelect : 'application/pdf,application/doc,application/docx'
            },
            file : {
                accept : 'application/*',
                acceptSelect : 'application/*,.pdf,.doc,.docx'
            },
            audio : {
                accept : 'audio/*',
                acceptSelect : 'audio/*'
            }
        }
    };

    angular.module('mcms.core')
        .constant('LISTINGS_CONFIG',config);
})();

},{}],20:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.listings', [
        'mcms.mediaFiles',
        'mcms.fileGallery',
        'mcms.extraFields',
        'mcms.listings.listing',
        'mcms.listings.listingCategory',
        'mcms.listings.extraFields',
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
            })
        ]);
    }

})();

require('./config');
require('./Listing');
require('./ListingCategory');
require('./ExtraFields');

},{"./ExtraFields":2,"./Listing":15,"./ListingCategory":7,"./config":19}]},{},[20])