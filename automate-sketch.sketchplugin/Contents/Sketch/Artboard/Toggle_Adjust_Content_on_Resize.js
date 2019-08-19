var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var selectedArtboards = selectedLayers.filter(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    });

    if (selectedArtboards.length == 0) {
        sketch.UI.message("Please select at least 1 artboard or symbol master.");
        return;
    }

    var isEveryArtboardIsUnchecked = selectedArtboards.every(function(artboard) {
        return artboard.sketchObject.resizesContent() == false;
    });

    selectedArtboards.forEach(function(artboard) {
        // ON
        if (isEveryArtboardIsUnchecked) {
            artboard.sketchObject.setResizesContent(true);
        }
        // OFF
        else {
            artboard.sketchObject.setResizesContent(false);
        }
    });

    // ON
    if (isEveryArtboardIsUnchecked) {
        sketch.UI.message('Turn on "Adjust content on resize" for all selected artboard.');
    }
    // OFF
    else {
        sketch.UI.message('Turn off "Adjust content on resize" for all selected artboard.');
    }

};
