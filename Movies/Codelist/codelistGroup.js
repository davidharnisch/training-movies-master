var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistGroup = /** @class */ (function () {
                function CodelistGroup(dc, ctorArgs) {
                    this.dc = dc;
                    this.ctorArgs = ctorArgs;
                    this.onBackgroundLoadingFinished = sffw.extractEventHandlerFromApiArgs(dc, ctorArgs, 'OnBackgroundLoadingFinished');
                    this.useBatch = ctorArgs.useBatch !== false; // default is true; IDE will not send it
                }
                CodelistGroup.prototype.dispose = function () {
                    this.dc = null;
                    this.onBackgroundLoadingFinished = null;
                };
                ;
                CodelistGroup.prototype.ensureInitialized = function () {
                    var _this = this;
                    if (!this.server) {
                        this.server = this.findApiObject(this.ctorArgs.server.Reference, this.ctorArgs.server.IsGlobal);
                        sffw.assert(this.server, "CodelistGroup failed to find ServerConnection " + this.ctorArgs.server.Reference);
                    }
                    if (!this.codelists) {
                        this.codelists = [];
                        var cdl_1;
                        _.each(this.ctorArgs.codelists, function (cItem) {
                            cdl_1 = _this.findApiObject(cItem.codelist.Reference, cItem.codelist.IsGlobal);
                            sffw.assert(cdl_1, "CodelistGroup failed to find Codelist " + cItem.codelist.Reference);
                            _this.codelists.push(cdl_1);
                        });
                    }
                };
                CodelistGroup.prototype.findApiObject = function (reference, global) {
                    if (!!global) {
                        return this.dc.$globals.$api[reference];
                    }
                    else {
                        return this.dc.$api[reference];
                    }
                };
                CodelistGroup.prototype.loadDataAsync = function (date) {
                    var _this = this;
                    this.ensureInitialized();
                    this.lastLoadingResult = new codelist.CodelistLoadingResult();
                    if (!this.useBatch) {
                        var loadPromises = _.map(this.codelists, function (c) { return c.loadDataAsync({ date: date }); });
                        return Promise.all(loadPromises).then(function (results) {
                            _.each((results), function (r) {
                                _this.lastLoadingResult.failedCodelists = _this.lastLoadingResult.failedCodelists.concat(r.failedCodelists);
                            });
                            return _this.lastLoadingResult;
                        });
                    }
                    else {
                        _(this.codelists).each(function (c) { return c.setDateTime({ datetime: date }); });
                        // second parameter is base in case rootUrl is relative
                        var host = new URL(this.server.rootUrl, window.location.origin).hostname;
                        var urls = _.map(this.codelists, function (c) { return c.getRequestUrl(); });
                        var batchReq = new codelist.ODataBatchRequest(urls, host);
                        this.loadingPromise = this.server.sendRequest('$batch', 'POST', { 'Content-Type': batchReq.getContentType() }, batchReq.getBody()).then(function (r) {
                            if (r.isError()) {
                                _this.lastLoadingResult.generalError = "CodelistGroup failed to load data. Server responded with " + r.getErrorMessage();
                            }
                            else {
                                // odata result is object with value attribute that contains array of items
                                // in case of error the result will be object with property Error
                                var data = void 0;
                                var odataResponse = new codelist.ODataBatchResponse(r);
                                for (var i = 0; i < _this.codelists.length; i += 1) {
                                    data = JSON.parse(odataResponse.codelistsData[i]);
                                    if (data.Error) {
                                        _this.lastLoadingResult.failedCodelists.push([_this.codelists[i].getCodelistName(), JSON.stringify(data.Error)]);
                                    }
                                    else {
                                        _this.codelists[i].fillFromArray(data.value);
                                    }
                                }
                                _this.loadingPromise = null;
                                if (_this.loadingStartedOnBackground && _this.onBackgroundLoadingFinished) {
                                    _this.loadingStartedOnBackground = undefined;
                                    _this.onBackgroundLoadingFinished(_this.lastLoadingResult, null, { Result: _this.lastLoadingResult });
                                }
                            }
                            return _this.lastLoadingResult;
                        });
                        return this.loadingPromise;
                    }
                };
                CodelistGroup.prototype.startBackgroundLoading = function (date) {
                    this.loadingStartedOnBackground = true;
                    this.loadDataAsync(date); // start the operation but don't return promise
                };
                CodelistGroup.prototype.finishBackgroundLoadingAsync = function () {
                    return this.loadingPromise || Promise.resolve(this.lastLoadingResult || new codelist.CodelistLoadingResult('Loading has not finished yet'));
                };
                return CodelistGroup;
            }());
            codelist.CodelistGroup = CodelistGroup;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistGroupApi = /** @class */ (function () {
                function CodelistGroupApi(dc, args) {
                    this.core = new codelist.CodelistGroup(dc, args);
                }
                CodelistGroupApi.prototype.dispose = function () {
                    this.core.dispose();
                };
                ;
                CodelistGroupApi.prototype.loadDataAsync = function (args) {
                    return this.core.loadDataAsync(args.date);
                };
                CodelistGroupApi.prototype.startBackgroundLoading = function (args) {
                    this.core.startBackgroundLoading(args.date);
                };
                CodelistGroupApi.prototype.finishBackgroundLoadingAsync = function () {
                    return this.core.finishBackgroundLoadingAsync();
                };
                return CodelistGroupApi;
            }());
            codelist.CodelistGroupApi = CodelistGroupApi;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define(function () { return sffw.api.codelist.CodelistGroupApi; });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistLoadingResult = /** @class */ (function () {
                function CodelistLoadingResult(generalError) {
                    this.failedCodelists = [];
                    this.generalError = generalError;
                }
                CodelistLoadingResult.prototype.isError = function () {
                    return !!(this.generalError || this.failedCodelists.length > 0);
                };
                CodelistLoadingResult.prototype.getErrorMessage = function () {
                    if (this.generalError) {
                        return this.generalError;
                    }
                    switch (this.failedCodelists.length) {
                        case 0:
                            return null;
                        case 1:
                            return "Failed to load codelist " + this.failedCodelists[0] + ".";
                        default:
                            return "Failed to load codelists: " + _.map(this.failedCodelists, function (fc) { return fc[0]; }).join(', ') + ".";
                    }
                };
                return CodelistLoadingResult;
            }());
            codelist.CodelistLoadingResult = CodelistLoadingResult;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var ODataBatchRequest = /** @class */ (function () {
                function ODataBatchRequest(reqUrls, host) {
                    this.boundary = this.generateBoundary();
                    this.items = _.map(reqUrls, function (url) { return new codelist.ODataBatchRequestItem(url, host); });
                }
                ODataBatchRequest.prototype.generateBoundary = function () {
                    // generate random string; following algorithm is based on nanoid
                    var e = '';
                    var t = 23;
                    var r = crypto.getRandomValues(new Uint8Array(t));
                    for (; t--;) {
                        // tslint:disable-next-line: no-bitwise
                        var n = 63 & r[t];
                        e += (n < 36 ? n.toString(36) : (n < 62 ? (n - 26).toString(36).toUpperCase() : (n < 63 ? '_' : '-')));
                    }
                    ;
                    return e;
                };
                ODataBatchRequest.prototype.getBody = function () {
                    var itemsStr = _(this.items)
                        .map(function (item) { return item.toString(); })
                        .valueOf();
                    return "--" + this.boundary + "\r\n" + itemsStr.join("\r\n--" + this.boundary + "\r\n") + "\r\n--" + this.boundary + "--";
                };
                ODataBatchRequest.prototype.getContentType = function () {
                    return "multipart/mixed; boundary=" + this.boundary;
                };
                return ODataBatchRequest;
            }());
            codelist.ODataBatchRequest = ODataBatchRequest;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var ODataBatchResponse = /** @class */ (function () {
                function ODataBatchResponse(response) {
                    var _this = this;
                    sffw.assert(!response.isError(), "CodelistGroup expects response to be OK");
                    var boundary = this.getBoundary(response);
                    var raw = response.getJsonString(); // it won't be json in this case but that's ok
                    var parts = raw.split(new RegExp("--" + boundary + "[-|\r\n]*"));
                    this.codelistsData = _(parts)
                        .filter(function (p) { return p.length > 0; })
                        .map(function (p) { return _this.getCodelistData(p); })
                        .valueOf();
                }
                ODataBatchResponse.prototype.getBoundary = function (response) {
                    var contentType = response.getHeader({ name: 'Content-Type' });
                    sffw.assert(contentType, "CodelistGroup is expecting response to have Content-Type header");
                    var regexMatch = contentType.match(/^multipart\/mixed;\s*boundary=(.*)$/i);
                    sffw.assert(regexMatch.length === 2, "CodelistGroup failed to parse response Content-Type " + contentType);
                    var boundary = regexMatch[1];
                    sffw.assert(_.isString(boundary) && boundary.length > 0, "CodelistGropu failed to parse multipart boundary in Content-Type " + contentType);
                    return boundary;
                };
                ODataBatchResponse.prototype.getCodelistData = function (reponsePart) {
                    var err = "CodelistGroup failed to parse response " + reponsePart;
                    var parts = reponsePart.split('\r\n\r\n');
                    sffw.assert(parts.length >= 3, err);
                    var body = parts.slice(2).join('\r\n');
                    sffw.assert(body && body.length > 0, err);
                    return body;
                };
                return ODataBatchResponse;
            }());
            codelist.ODataBatchResponse = ODataBatchResponse;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var ODataBatchRequestItem = /** @class */ (function () {
                function ODataBatchRequestItem(url, host) {
                    this.url = url;
                    this.host = host;
                }
                ODataBatchRequestItem.prototype.toString = function () {
                    return [
                        'Content-Type: application/http',
                        'Content-Transfer-Encoding: binary',
                        '',
                        "GET " + this.url + " HTTP/1.1",
                        "Host: " + this.host,
                        '',
                        ''
                    ].join('\r\n');
                };
                return ODataBatchRequestItem;
            }());
            codelist.ODataBatchRequestItem = ODataBatchRequestItem;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
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
var sffw;
(function (sffw) {
    function stringFormat(strToFormat, replaceArgs) {
        var result = strToFormat;
        _(replaceArgs).each(function (k) {
            result = result.replace(new RegExp("\\{" + k.Code + "\\}", 'g'), k.Value);
        });
        return result;
    }
    sffw.stringFormat = stringFormat;
})(sffw || (sffw = {}));
