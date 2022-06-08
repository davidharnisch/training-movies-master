var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var groupItem;
        (function (groupItem) {
            if (ko && !ko.components.isRegistered('group-item')) {
                ko.components.register('group-item', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.groupItem.GroupItemModel(params, componentInfo); }
                    },
                    template: "<div class=\"sffw-group-item\">\n                        <fieldset class=\"group-item-fieldset\" data-bind=\"css:(!isExpanded() ? 'gi-border-collapsed' : 'gi-border-uncollapsed')\">\n                            <legend>\n                                <div style=\"display: inline-block\">\n                                    <button data-bind=\"click: onToggleCollapseClick, attr: { 'aria-expanded': isExpanded() ? 'true' : 'false' }\">\n                                        <span data-bind=\"css: (isExpanded == true || !isExpanded() ? isCollapsedClass : isUnCollapsedClass)\" class=\"sffw-group-item-icon\"></span>\n                                        <!-- ko giHeadingBinding: heading, caption: caption --><!--/ko-->\n                                    </button>\n                                </div>\n                                <button class=\"sffw-group-item-removeButton\" data-bind=\"click: onRemoveClick, visible: allowRemove, css: deleteIconClass, attr: {'aria-label': $root.$localize('groupItem$$Remove') + ' ' + ko.unwrap(caption)}\"></button>\n                            </legend>\n                            <div data-bind=\"visible: isExpanded\" class=\"sffw-group-item-body\">\n                                <!-- ko template: { nodes: $componentTemplateNodes, data: ctx } --><!-- /ko -->\n                            </div>\n                        </fieldset>\n                        </div>"
                });
                ko.virtualElements.allowedBindings.giHeadingBinding = true;
            }
        })(groupItem = components.groupItem || (components.groupItem = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var groupItem;
        (function (groupItem) {
            var GroupItemModel = /** @class */ (function () {
                function GroupItemModel(params, componentInfo) {
                    var _this = this;
                    this.caption = params.caption;
                    if (_.isNull(params.allowRemove) || _.isUndefined(params.allowRemove)) {
                        this.allowRemove = true;
                    }
                    else {
                        this.allowRemove = params.allowRemove;
                    }
                    if (typeof params.nonCollapsedIconClass !== 'undefined' && typeof params.collapsedIconClass !== 'undefined') {
                        this.isCollapsedClass = params.collapsedIconClass;
                        this.isUnCollapsedClass = params.nonCollapsedIconClass;
                    }
                    else {
                        this.isCollapsedClass = 'fa fa-chevron-down';
                        this.isUnCollapsedClass = 'fa fa-chevron-up';
                    }
                    if (typeof params.deleteIconClass !== 'undefined' && typeof params.deleteIconClass !== 'undefined') {
                        this.deleteIconClass = params.deleteIconClass;
                    }
                    else {
                        this.deleteIconClass = 'fa fa-trash';
                    }
                    this.heading = params.heading;
                    this.isCollapsed = params.isCollapsed || ko.observable(false);
                    this.isExpanded = ko.pureComputed(function () { return !_this.isCollapsed(); });
                    this.ctx = params.$parentData;
                    this.onRemoveClick = this.removeItem;
                    this.onToggleCollapseClick = this.toggleCollapse;
                }
                GroupItemModel.prototype.removeItem = function (data, event) {
                    var collection = data.ctx.$parentStruct;
                    collection.$removeItem(data.ctx);
                };
                GroupItemModel.prototype.toggleCollapse = function (data, event) {
                    data.isCollapsed(!data.isCollapsed());
                };
                return GroupItemModel;
            }());
            groupItem.GroupItemModel = GroupItemModel;
        })(groupItem = components.groupItem || (components.groupItem = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var groupItem;
        (function (groupItem) {
            'use strict';
            var handlers = ko.bindingHandlers;
            handlers.giHeadingBinding = handlers.giHeadingBinding || {
                init: function (element, valueAccessor, allBindings) {
                    var heading = ko.unwrap(valueAccessor());
                    var caption = ko.unwrap(allBindings.get('caption'));
                    var tagName = heading !== null && heading !== void 0 ? heading : 'span';
                    var $element = $(element);
                    var $toggleButton = $element.parent();
                    $toggleButton.append("<" + tagName + " class=\"sffw-group-item-caption\">" + caption + "</" + tagName + ">");
                },
                update: function (element, valueAccessor, allBindings) {
                    var caption = ko.unwrap(allBindings.get('caption'));
                    var $element = $(element);
                    var $toggleButton = $element.parent();
                    $toggleButton.find('.sffw-group-item-caption').text(caption);
                }
            };
        })(groupItem = components.groupItem || (components.groupItem = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
