var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    var selectedLayers = document.selectedLayers.layers;
    var selectedSymbolInstances = selectedLayers.filter(layer => {
        return layer.type == "SymbolInstance";
    });
    if (selectedSymbolInstances.length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance layer.");
        return;
    }

    var selectedSymbolOverrides = [];
    selectedSymbolInstances.forEach(function(instance) {
        instance.overrides.forEach(function(override) {
            if (override.selected && override.symbolOverride) {
                selectedSymbolOverrides.push(override);
            }
        });
    });
    
    if (selectedSymbolOverrides.length == 0) {
        sketch.UI.message("Please select at least 1 symbol override.");
        return;
    }

    selectedSymbolOverrides.forEach(function(override) {
        override.value = "";
    });

};