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
        var width = layer.frame.width;
        var height = layer.frame.height;
        layer.frame.width = height;
        layer.frame.height = width;
    });

};