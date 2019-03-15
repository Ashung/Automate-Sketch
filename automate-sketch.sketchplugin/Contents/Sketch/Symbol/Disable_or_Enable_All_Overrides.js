@import "../Libraries/Google_Analytics.cocoascript";

var onRun = function(context) {

    ga(context, "Symbol");

    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    var symbolIDs = [];
    var selectedSymbols = [];
    
    var selection = document.selectedLayers.layers;
    // Only local symbol instance and symbol master
    selection.filter(function(layer) {
        if (layer.type == "SymbolMaster") {
            selectedSymbols.push(layer);
        } else if (layer.type == "SymbolInstance" && !layer.master.sketchObject.isForeign()) {
            selectedSymbols.push(layer.master);
        }
    });
    // Remove the duplicated
    selectedSymbols = selectedSymbols.filter(function(layer) {
        if (!symbolIDs.includes(layer.id)) {
            symbolIDs.push(layer.id);
            return layer;
        }
    });

    if (selectedSymbols.length == 0) {
        sketch.UI.message("Please select at least 1 local symbol instance or master.");
        return;
    }

    var isAllOverridesDisable;

    selectedSymbols.forEach(function(symbol) {

        // All override in manage overrides panel
        var manageOverrides = symbol.overrides;
        symbol.overrides.forEach(function(item) {
            if (item.sketchObject.parent()) {
                var master = sketch.fromNative(item.sketchObject.master().newMutableCounterpart());
                master.overrides.forEach(function(item2) {
                    if (!item2.editable) {
                        manageOverrides.splice(manageOverrides.indexOf(item), 1);
                    }
                });
            }
        });

        isAllOverridesDisable = manageOverrides.every(function(override) {
            return override.editable == false;
        });

        manageOverrides.forEach(function(override) {
            var point = override.sketchObject.overridePoint();
            symbol.sketchObject.setOverridePoint_editable(point, isAllOverridesDisable);
        });

    });

    document.sketchObject.reloadInspector();

    var message = ((isAllOverridesDisable) ? "Enable " : "Disable ") + "all overrides for " +
        selectedSymbols.length + " symbol master" +
        ((selectedSymbols.length > 1) ? "s." : ".");

    sketch.UI.message(message);

};
