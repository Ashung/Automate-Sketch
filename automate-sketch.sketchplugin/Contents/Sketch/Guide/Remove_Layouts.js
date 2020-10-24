var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    var selectedArtboards = document.selectedLayers.layers.filter(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    });

    if (selectedArtboards.length == 0) {
        sketch.UI.message("Please select at least 1 artboard or symbol master.");
        return;
    }

};