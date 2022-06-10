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
        var editor = cGen.editor;
        var generateIconstyle = cGen.defFromIde.VisualSettings.IconStyleRadios === true;
        componentWrapperTree.cssClass.editor = true;
        componentWrapperTree.cssClass.radiogroup = true;
        componentWrapperTree.cssClass.booleanradiogroup = true;
        if (generateIconstyle) {
            componentWrapperTree.cssClass.iconstyle = true;
        }
        var fieldsetTree = new cGen.Tree('fieldset');
        var legendTree = new cGen.Tree('legend');
        var legendTreeSpan = new cGen.Tree('span');
        legendTreeSpan.cssClass['caption-text'] = true;
        legendTreeSpan.cssClass['caption-legend-span'] = true;
        var editorWrapperTree = new cGen.Tree('div');
        editor.generateValidationsNotAbove(cGen, editorWrapperTree, fieldsetTree);
        editor.setCaption(cGen, def, legendTreeSpan, undefined);
        if (def.CaptionLength) {
            legendTree.style.width = def.CaptionLength;
        }
        editor.setCaptionPosition(def, editorWrapperTree);
        var editorValueTree = new cGen.Tree('div');
        editorValueTree.attributes.role = 'radiogroup';
        editorValueTree.cssClass.radioGroupItems = true;
        var itemCaptionPosition = def.ItemCaptionPosition || 'Right';
        editorValueTree.cssClass["item-caption-position-" + itemCaptionPosition.toLowerCase()] = true;
        editor.setEditorCss(editorValueTree, editorWrapperTree);
        editor.setValueBinding(cGen, def, legendTreeSpan, editorWrapperTree, editorValueTree);
        editor.setRequiredMark(cGen, def, editorWrapperTree);
        cGen.mixinEnabled({ def: def, tree: editorValueTree, asObservable: true, containerEnabled: containerEnabled });
        if (isDesigntime) {
            cGen.mixinDisableTabFocus(def, editorValueTree);
        }
        legendTree.content.push(legendTreeSpan);
        editor.setTooltip(def, legendTree, cGen);
        editor.generateValidationsAbove(cGen, editorWrapperTree, fieldsetTree);
        fieldsetTree.content.push(legendTree);
        fieldsetTree.content.push(editorValueTree);
        componentWrapperTree.content.push(editorWrapperTree);
        var enabledBinding = editorValueTree.databind.enable;
        if (enabledBinding) {
            delete editorValueTree.databind.enable;
        }
        var staticDisabled = editorValueTree.attributes.disabled;
        if (staticDisabled === null) {
            delete editorValueTree.attributes.disabled;
        }
        if (def.Data && def.Data.Binding) {
            var att = cGen.processBinding(def.Data.Binding, null);
            var optionTrue = createRadioInputTree(cGen, def, att, enabledBinding, staticDisabled, itemCaptionPosition, generateIconstyle, true);
            editorValueTree.content.push(optionTrue);
            var optionFalse = createRadioInputTree(cGen, def, att, enabledBinding, staticDisabled, itemCaptionPosition, generateIconstyle, false);
            editorValueTree.content.push(optionFalse);
        }
        else {
            var designerInput = new cGen.Tree('input');
            designerInput.attributes.type = 'radio';
            var designerDiv = new cGen.Tree('div');
            designerDiv.cssClass.radioGroupItem = true;
            designerDiv.content.push(designerInput);
            editorValueTree.content.push(designerDiv);
        }
        var orientation = def.Orientation || 'Vertical';
        componentWrapperTree.cssClass["radiogroup-" + orientation.toLowerCase()] = true;
    }
    exports.gen = gen;
    function createRadioInputTree(cGen, def, att, enabledBinding, staticDisabled, itemCaptionPosition, generateIconstyle, optionValue) {
        var inputTree = new cGen.Tree('input');
        inputTree.attributes.type = 'radio';
        inputTree.attributes.name = def.Name;
        inputTree.databind.checkedValue = optionValue;
        inputTree.databind.checked = att + ".$value";
        if (enabledBinding) {
            inputTree.databind.enable = enabledBinding;
        }
        if (staticDisabled === null) {
            inputTree.attributes.disabled = null;
        }
        var captionTree = new cGen.Tree('div');
        captionTree.cssClass['radioCaption-wrap'] = true;
        captionTree.databind.text = "$root.$localization.currentCulture().boolToStr(" + optionValue + ")";
        var labelTree = new cGen.Tree('label');
        labelTree.cssClass.radioGroupItem = true;
        if (itemCaptionPosition === 'Right' || generateIconstyle) {
            labelTree.content.push(inputTree);
            labelTree.content.push(captionTree);
        }
        else {
            labelTree.content.push(captionTree);
            labelTree.content.push(inputTree);
        }
        return labelTree;
    }
});
