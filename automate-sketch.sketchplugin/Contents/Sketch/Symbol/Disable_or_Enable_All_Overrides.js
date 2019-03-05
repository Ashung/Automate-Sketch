@import "../Libraries/Google_Analytics.cocoascript";

var onRun = function(context) {

    ga(context, "Symbol");

    var sketch = require("sketch");
    var pluginIdentifier = context.command.identifier();
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;

    var symbolID = [];
    var selectedSymbol = selection.filter(function(layer) {
        if (layer.type == "SymbolMaster" || layer.type == "SymbolInstance") {
            return layer;
        }
    }).map(function(layer) {
        if (layer.type == "SymbolInstance") {
            return layer.master;
        } else {
            return layer;
        }
    }).filter(function(layer) {
        if (!symbolID.includes(layer.id)) {
            symbolID.push(layer.id);
            return layer;
        }
    });

    if (selectedSymbol.length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance or master.");
        return;
    }

    selectedSymbol.forEach(function(symbol) {
        
        var overridePoints = symbol.overrides.map(function(override) {
            return override.sketchObject.overridePoint();
        });

        overridePoints.forEach(function(override) {
            var idToBoolean = (pluginIdentifier == "enable_all_overrides") ? true : false;
            symbol.sketchObject.setOverridePoint_editable(override, idToBoolean);
        });

    });

    document.sketchObject.reloadInspector();

    var message = ((pluginIdentifier == "enable_all_overrides") ? "Enable " : "Disable ") +
        selectedSymbol.length + " symbol master" +
        ((selectedSymbol.length > 1) ? "s." : ".");

    sketch.UI.message(message);

};
