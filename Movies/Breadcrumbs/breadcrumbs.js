var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var breadcrumbs;
        (function (breadcrumbs) {
            var BreadcrumbsClickParams = /** @class */ (function () {
                function BreadcrumbsClickParams(breadcrumb, fullPath) {
                    this.index = breadcrumb.index;
                    this.id = breadcrumb.id;
                    this.title = breadcrumb.getTitle();
                    this.url = breadcrumb.url;
                    this.data = breadcrumb.data;
                    this.fullPath = fullPath;
                }
                return BreadcrumbsClickParams;
            }());
            breadcrumbs.BreadcrumbsClickParams = BreadcrumbsClickParams;
            var BreadcrumbsModel = /** @class */ (function () {
                function BreadcrumbsModel(params, componentInfo) {
                    var _this = this;
                    this.paramCssClass = 'breadcrumb breadcrumb-default';
                    this.breadcrumbs = ko.observableArray();
                    if (params.controller) {
                        this.controller = params.controller;
                        if (params.cssClass) {
                            this.paramCssClass = params.cssClass;
                        }
                        this.ariaLabel = params.ariaLabel || null;
                        this.breadcrumbs = this.controller.breadcrumbs;
                        this.itemClickHandler = params.OnItemClick;
                        var self_1 = this;
                        self_1.onItemClicked = function (item, event) {
                            if (self_1.itemClickHandler) {
                                var fullPath = _this.controller.getFullPath();
                                var itemClickParams = new BreadcrumbsClickParams(item, fullPath);
                                self_1.itemClickHandler(null, event, itemClickParams);
                            }
                        };
                        self_1.onItemKeyUp = function (item, event) {
                            if (event.keyCode === 13) {
                                self_1.onItemClicked(item, event);
                            }
                        };
                    }
                    else {
                        console.error('Controller param not provided to Breadcrumbs');
                    }
                    this.cssClass = ko.pureComputed(this.getCssClass, this);
                }
                BreadcrumbsModel.prototype.dispose = function () {
                    this.itemClickHandler = null;
                    this.breadcrumbs = null;
                    this.controller = null;
                };
                BreadcrumbsModel.prototype.getCssClass = function () {
                    return this.paramCssClass;
                };
                return BreadcrumbsModel;
            }());
            breadcrumbs.BreadcrumbsModel = BreadcrumbsModel;
        })(breadcrumbs = components.breadcrumbs || (components.breadcrumbs = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var breadcrumbs;
        (function (breadcrumbs) {
            if (ko && !ko.components.isRegistered('sffw-breadcrumbs')) {
                ko.components.register('sffw-breadcrumbs', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.breadcrumbs.BreadcrumbsModel(params, componentInfo); }
                    },
                    template: "\n<nav data-bind=\"attr: { 'aria-label': ariaLabel }\">\n    <ol data-bind=\"css: cssClass\">\n        <!-- ko foreach: breadcrumbs -->\n            <!-- ko if: clickable() === true -->\n                <li role=\"presentation\"><a tabindex=\"0\" data-bind=\"text: title, attr: { href: url, 'data-id': id, 'data-other-data': data, 'aria-current': active() ? 'page' : null }, event: { click: $parent.onItemClicked, keyup: $parent.onItemKeyUp }, css: cssClass\"></a></li>\n            <!-- /ko -->\n            <!-- ko ifnot: clickable() === true -->\n                <li role=\"presentation\" data-bind=\"text: title, attr: { 'data-id': id, 'data-other-data': data }, css: cssClass\"></li>\n            <!-- /ko -->\n        <!-- /ko -->\n    </ol>\n</nav>\n"
                });
            }
        })(breadcrumbs = components.breadcrumbs || (components.breadcrumbs = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
