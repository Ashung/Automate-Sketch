var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch/dom");
    var UI = require("sketch/ui");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;

    var selectedArtboards = selection.filter(function(layer) {
        return layer.type == "Artboard";
    });

    if (selectedArtboards.length == 0) {
        UI.message("Please select at least 1 artboard.");
        return;
    }

    selectedArtboards.forEach(function(artboard) {
        sketch.SymbolMaster.fromArtboard(artboard);
    });

};