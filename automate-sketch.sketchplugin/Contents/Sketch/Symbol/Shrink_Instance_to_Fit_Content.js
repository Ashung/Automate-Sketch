var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var selectedSymbolInstances = selectedLayers.filter(function(layer) {
        return layer.type == "SymbolInstance";
    });

    if (selectedSymbolInstances.length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance.");
        return;
    }

    selectedSymbolInstances.forEach(function(layer) {
        layer.sketchObject.resizeToFitContentsIfNeededNoCache();
    });

};