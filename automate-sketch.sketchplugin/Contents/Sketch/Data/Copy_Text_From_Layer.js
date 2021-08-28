var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var pasteboard = require("../modules/Pasteboard");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var identifier = __command.identifier();

    if (identifier == "copy_text_from_layer") {
        var selectedTextLayer = selectedLayers.filter(function(layer) {
            return layer.type == "Text";
        });
        if (selectedTextLayer.length == 0) {
            sketch.UI.message("Please select at least 1 text layer.");
            return;
        }
        var text = [];
        selectedTextLayer.forEach(function(layer) {
            text.push(layer.text);
        });
        pasteboard.copy(text.join("\n"));
        sketch.UI.message("Text copied.");
    }

    if (identifier == "copy_text_from_override") {
        var selectedInstances = selectedLayers.filter(function(layer) {
            return layer.type == "SymbolInstance";
        });
        if (selectedInstances.length == 0) {
            sketch.UI.message("Please select at least 1 symbol instance.");
            return;
        }
        var text = [];
        selectedInstances.forEach(function(layer) {
            layer.overrides.forEach(function(override) {
                if (override.property == "stringValue") {
                    text.push(override.value);
                }
            });
        });
        pasteboard.copy(text.join("\n"));
        sketch.UI.message("Text copied.");
    }
};