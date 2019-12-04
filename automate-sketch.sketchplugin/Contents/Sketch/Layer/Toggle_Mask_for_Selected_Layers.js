var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    selectedLayers.forEach(function(layer) {
        if (layer.type == "ShapePath" || layer.type == "Shape") {
            if (layer.sketchObject.hasClippingMask()) {
                layer.sketchObject.setHasClippingMask(false);
            } else {
                layer.sketchObject.setHasClippingMask(true);
            }
        }
    });

};