(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gen = void 0;
    function gen(cGenV2ParamObj) {
        var cGen = cGenV2ParamObj.cGen;
        var def = cGenV2ParamObj.def;
        var componentWrapperTree = cGenV2ParamObj.componentWrapperTree;
        var isDesigntime = cGenV2ParamObj.isDesigntime;
        var containerEnabled = cGenV2ParamObj.containerEnabled;
        var folderUrl = cGenV2ParamObj.folderUrl;
        var ibi;
        var params = [];
        ibi = new cGen.Tree('incontent-busy-indicator');
        if (def.Name) {
            params.push("Name: '" + def.Name + "'");
        }
        if (def.isLoading === true) {
            params.push("isLoading: " + def.isLoading);
        }
        else if (def.isLoading) {
            var isLoadingParam = def.isLoading.Binding ? cGen.processBinding(def.isLoading.Binding)
                : "'" + def.isLoading.replace(/\"/g, '&quot;') + "'";
            params.push("isLoading: " + isLoadingParam);
        }
        else {
            params.push("isLoading: " + false);
        }
        if (def.loadingImageSource) {
            var src = def.loadingImageSource;
            if (src && folderUrl) {
                src = src.replace(/<resources>/gi, folderUrl.resources);
            }
            params.push("loadingImageSource: '" + src + "'");
        }
        if (def.iconCssClass) {
            params.push("iconCssClass: '" + def.iconCssClass + "'");
        }
        params.push('$parentData: $data');
        ibi.attributes.params = params.join(', ');
        if (def.Content) {
            var childContainerEnabled = cGen.createEnabledValue({ def: def, containerEnabled: containerEnabled }).getValue();
            ibi.content.push(cGen.genComponentTree({ def: def.Content, isDesigntime: isDesigntime, containerEnabled: childContainerEnabled }));
        }
        componentWrapperTree.content.push(ibi);
    }
    exports.gen = gen;
});
