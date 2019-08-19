var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

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

    var disableCount = 0;
    var enableCount = 0;

    selectedSymbols.forEach(function(symbol) {

        // Sketch 54 add allows overrides
        if (sketch.version.sketch >= 54) {
            symbol.sketchObject.setAllowsOverrides(true);
        }

        var isAllOverridesDisable = symbol.overrides.every(function(override) {
            return override.editable == false;
        });

        symbol.overrides.forEach(function(override) {
            var point = override.sketchObject.overridePoint();
            symbol.sketchObject.setOverridePoint_editable(point, isAllOverridesDisable);
        });

        if (isAllOverridesDisable) {
            enableCount ++;
        } else {
            disableCount ++;
        }

    });

    document.sketchObject.reloadInspector();

    var message = "";
    if (disableCount > 0) {
        message += "Disable all overrides for " + disableCount + " symbol master" + (disableCount > 1 ? "s" : "") + ". ";
    }
    if (enableCount > 0) {
        message += "Enable all overrides for " + enableCount + " symbol master" + (enableCount > 1 ? "s" : "") + ". ";
    }

    sketch.UI.message(message);

};
