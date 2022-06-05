var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var page;
        (function (page) {
            var BrowserTab = /** @class */ (function () {
                function BrowserTab(target) {
                    if (window) {
                        this.windowHandle = target ? window.open(undefined, target) : window.open();
                    }
                }
                BrowserTab.prototype.setUrl = function (args) {
                    if (this.windowHandle && this.windowHandle.location) {
                        this.windowHandle.location.href = args.url;
                    }
                };
                BrowserTab.prototype.close = function () {
                    if (this.windowHandle) {
                        this.windowHandle.close();
                    }
                };
                BrowserTab.prototype.focus = function () {
                    if (this.windowHandle) {
                        this.windowHandle.focus();
                    }
                };
                BrowserTab.prototype.containsElement = function (args) {
                    if (this.windowHandle && this.windowHandle.location) {
                        return this.windowHandle.document.getElementById(args.elementId) !== null;
                    }
                    return false;
                };
                return BrowserTab;
            }());
            page.BrowserTab = BrowserTab;
        })(page = api.page || (api.page = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var page;
        (function (page) {
            var Page = /** @class */ (function () {
                function Page(datacontext, args) {
                    this.subscriptions = [];
                    this.onLangChangedCallback = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnLangChanged');
                    if (this.onLangChangedCallback && typeof window !== 'undefined' && window.sf && window.sf.localization) {
                        this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(this.onCurrentCultureCodeChanged, this));
                    }
                }
                Page.prototype.onCurrentCultureCodeChanged = function () {
                    if (this.onLangChangedCallback && _.isFunction(this.onLangChangedCallback)) {
                        this.onLangChangedCallback();
                    }
                };
                Page.prototype.setLang = function (args) {
                    if (typeof window !== 'undefined' && window.sf && window.sf.localization) {
                        window.sf.localization.setCurrentCultureSync(args.lang);
                    }
                };
                Page.prototype.getLang = function () {
                    if (typeof window !== 'undefined' && window.sf && window.sf.localization) {
                        return window.sf.localization.currentCultureCode();
                    }
                };
                Page.prototype.setTitle = function (args) {
                    if (args.title) {
                        document.title = args.title;
                    }
                };
                Page.prototype.confirm = function (args) {
                    return confirm(args.message);
                };
                Page.prototype.scrollToTop = function (args) {
                    $('html,body').scrollTop(0);
                };
                Page.prototype.navigateToUrl = function (args) {
                    if (window) {
                        if (args.replace) {
                            window.location.replace(args.url);
                        }
                        else {
                            window.location.href = args.url;
                        }
                    }
                };
                Page.prototype.getCurrentUrlProtocol = function () {
                    if (window) {
                        return window.location.protocol;
                    }
                };
                Page.prototype.getCurrentUrlOrigin = function () {
                    if (window) {
                        return window.location.origin;
                    }
                };
                Page.prototype.getCurrentUrlPathName = function () {
                    if (window) {
                        return window.location.pathname;
                    }
                };
                Page.prototype.getCurrentUrlHash = function () {
                    if (window) {
                        return window.location.hash;
                    }
                };
                Page.prototype.print = function () {
                    if (window) {
                        window.print();
                    }
                };
                Page.prototype.focusControl = function (args) {
                    var index;
                    if (args.pointer) {
                        var matchArray = args.pointer.match(/\d+(?=\])/g); // pointer with [number]
                        if (matchArray && matchArray.length > 0) {
                            index = +matchArray[matchArray.length - 1]; // index in last collection in the pointer path
                        }
                    }
                    else if (args.collectionIdx) {
                        index = args.collectionIdx;
                    }
                    if (_.isNumber(index)) {
                        // component in collection (repeater, datatable)
                        if ($("div[data-name='" + args.name + "'] sffw-referencelookup").length > 0 || $("div[data-name='" + args.name + "'] sffw-tariclookup").length > 0) {
                            // referenceLookup or taricLookup
                            $("div[data-name='" + args.name + "']:eq(" + (index - 1) + ") .editor-value .ui-autocomplete-input").trigger('focus');
                        }
                        else if ($("div[data-name='" + args.name + "'] sffw-iconstylecheckbox").length > 0) {
                            // iconStyleCheckbox
                            $("div[data-name='" + args.name + "']:eq(" + (index - 1) + ") .editor-value .sffw-icon-checkbox").trigger('focus');
                        }
                        else if ($("div[data-name='" + args.name + "']").length > 0) {
                            // input editor
                            $("div[data-name='" + args.name + "']:eq(" + (index - 1) + ") .editor-value").trigger('focus');
                        }
                        return;
                    }
                    if ($("div[data-name='" + args.name + "'] sffw-referencelookup").length > 0 || $("div[data-name='" + args.name + "'] sffw-tariclookup").length > 0) {
                        // referenceLookup or taricLookup
                        $("div[data-name='" + args.name + "'] .editor-value .ui-autocomplete-input").trigger('focus');
                    }
                    else if ($("div[data-name='" + args.name + "'] sffw-iconstylecheckbox").length > 0) {
                        // iconStyleCheckbox
                        $("div[data-name='" + args.name + "'] .editor-value .sffw-icon-checkbox").trigger('focus');
                    }
                    else {
                        // input editor
                        $("div[data-name='" + args.name + "'] .editor-value").trigger('focus');
                    }
                };
                Page.prototype.scrollTo = function (args) {
                    var $element = this.getScrollElement(args);
                    if ($element) {
                        var pos = $element.offset();
                        $('html,body').animate({ scrollTop: pos.top });
                    }
                };
                Page.prototype.getScrollElement = function (args) {
                    var $element = null;
                    var collectionIdx;
                    if (args.pointer) {
                        var matchArray = args.pointer.match(/\d+(?=\])/g); // pointer with [number]
                        if (matchArray && matchArray.length > 0) {
                            collectionIdx = +matchArray[matchArray.length - 1]; // index in last collection in the pointer path
                        }
                    }
                    if (_.isNumber(collectionIdx)) {
                        // input editor in collection (repeater, datatable)
                        if ($("div[data-name='" + args.name + "']").length >= 1) {
                            $element = $("div[data-name='" + args.name + "']:eq(" + (collectionIdx - 1) + ")");
                        }
                    }
                    else {
                        $element = $("div[data-name='" + args.name + "']");
                    }
                    return $element;
                };
                Page.prototype.scrollToWithOffset = function (args) {
                    var $element = this.getScrollElement(args);
                    if ($element) {
                        var scrollTo_1 = $element.offset().top;
                        var offset = +args.offset;
                        if (_.isNumber(offset)) {
                            scrollTo_1 -= offset;
                        }
                        $('html,body').animate({ scrollTop: scrollTo_1 });
                    }
                };
                Page.prototype.openNewTab = function () {
                    return new page.BrowserTab();
                };
                Page.prototype.openNamedTab = function (args) {
                    return new page.BrowserTab(args.name);
                };
                Page.prototype.focusMainHeading = function () {
                    var isModalOpen = $('body.modal-open').length > 0;
                    var $h1 = isModalOpen ? $('#outerModal h1') : $('#mainFormHolder h1');
                    // handle inconsistent headings - when someone has left more then one h1 on the page
                    if ($h1.length > 0) {
                        // set tabindex=-1 to enable focusing by script
                        $h1.first().attr('tabindex', '-1');
                        $h1.first().trigger('focus');
                    }
                };
                Page.prototype.focusHyperlink = function (args) {
                    $("div[data-name='" + args.name + "'].hyperlink a").trigger('focus');
                };
                Page.prototype.focusButton = function (args) {
                    if ($("div[data-name='" + args.name + "'] button").length === 1) {
                        // button
                        $("div[data-name='" + args.name + "'].button button").trigger('focus');
                    }
                    else if ($("sffw-imagebutton[data-name='" + args.name + "'] button").length === 1) {
                        // imagebutton
                        $("sffw-imagebutton[data-name='" + args.name + "'] button").trigger('focus');
                    }
                };
                Page.prototype.focusFirstInvalidInput = function () {
                    var isModalOpen = $('body.modal-open').length > 0;
                    var $container = isModalOpen ? $('#outerModal') : $('#mainFormHolder');
                    var $first = $container.find('input[type=text], textarea, select').filter('[aria-invalid]:visible:enabled:not([readonly]):first');
                    $first.trigger('focus');
                };
                Page.prototype.dispose = function () {
                    this.onLangChangedCallback = null;
                    _.each(this.subscriptions, function (sub) { return sub.dispose(); });
                };
                return Page;
            }());
            page.Page = Page;
        })(page = api.page || (api.page = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.page.Page;
    });
}
var sffw;
(function (sffw) {
    function extractEventHandlerFromApiArgs(datacontext, args, eventName) {
        if (args.$events && args.$events[eventName] && args.$events[eventName].Reference) {
            if (args.$events[eventName].ReferenceType === 'Global') {
                return datacontext.$globals.$actions[args.$events[eventName].Reference];
            }
            else {
                return datacontext.$actions[args.$events[eventName].Reference];
            }
        }
        return undefined;
    }
    sffw.extractEventHandlerFromApiArgs = extractEventHandlerFromApiArgs;
})(sffw || (sffw = {}));
