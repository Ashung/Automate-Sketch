@import "../Libraries/Google_Analytics.cocoascript";

var onRun = function(context) {

    ga(context, "Symbol");

    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;

    var symbolID = [];
    var selectedSymbol = selection.filter(function(layer) {
        // Only local symbol instance and symbol master
        if (
            layer.type == "SymbolMaster" ||
            (layer.type == "SymbolInstance" && !layer.master.sketchObject.isForeign())
        ) {
            return layer;
        }
    }).map(function(layer) {
        // Map to symbol master
        if (layer.type == "SymbolInstance") {
            return layer.master;
        } else {
            return layer;
        }
    }).filter(function(layer) {
        // Remove the duplicated
        if (!symbolID.includes(layer.id)) {
            symbolID.push(layer.id);
            return layer;
        }
    });

    if (selectedSymbol.length == 0) {
        sketch.UI.message("Please select at least 1 local symbol instance or master.");
        return;
    }

    var isAllOverridesDisable;

    selectedSymbol.forEach(function(symbol) {

        var overridePropertyKeys = symbol.sketchObject.overrideProperies().allKeys();
        var idsOfOverrideInManagePanel = util.toArray(overridePropertyKeys).map(function(item) {
            return String(item);
        });
        
        var overridesInManagePanel = symbol.overrides.filter(function(override) {
            return idsOfOverrideInManagePanel.includes(override.id);
        });

        var overridePoints = overridesInManagePanel.map(function(override) {
            return override.sketchObject.overridePoint();
        });

        isAllOverridesDisable = overridesInManagePanel.every(function(override) {
            return override.editable == false;
        });

        overridePoints.forEach(function(override) {
            symbol.sketchObject.setOverridePoint_editable(override, isAllOverridesDisable);
        });

    });

    document.sketchObject.reloadInspector();

    var message = ((isAllOverridesDisable) ? "Enable " : "Disable ") + "all overrides for " +
        selectedSymbol.length + " symbol master" +
        ((selectedSymbol.length > 1) ? "s." : ".");

    sketch.UI.message(message);

};
