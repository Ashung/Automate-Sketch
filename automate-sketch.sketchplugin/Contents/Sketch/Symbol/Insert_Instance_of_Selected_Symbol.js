var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch/dom");
    var UI = require("sketch/ui");

    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;
    var selectedSymbolMaster = selection.find(function(layer) {
        return layer.type == "SymbolMaster";
    });
    if (selection.length != 1 || selectedSymbolMaster == undefined) {
        UI.message("Please select 1 symbol master.");
        return;
    }

    // Insert symbol instance.
    try {
        var symbolMasterNative = selectedSymbolMaster.sketchObject;
        var symbolReference = MSSymbolMasterReference.referenceForShareableObject(symbolMasterNative);
        var action = document.sketchObject.actionsController().actionForID("MSInsertSymbolAction");
        var menuItem = NSMenuItem.alloc().init();
        menuItem.setRepresentedObject([symbolReference]);
        action.doPerformAction(menuItem);
    } catch(error) {
        UI.message("Error: " + error.message);
    }

};