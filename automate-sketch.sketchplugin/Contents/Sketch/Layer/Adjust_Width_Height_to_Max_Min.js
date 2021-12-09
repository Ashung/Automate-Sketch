var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();
    
    if (document.selectedLayers.length < 2) {
        sketch.UI.message("Please select at least 2 layers.");
        return;
    }

    var layers = document.selectedLayers.layers;

    if (identifier == "adjust_width_to_max") {
        var max = Math.max(...layers.map(layer => layer.frame.width));
        layers.forEach(layer => {
            layer.frame.width = Math.round(max);
        });
    }

    if (identifier == "adjust_width_to_min") {
        var min = Math.min(...layers.map(layer => layer.frame.width));
        layers.forEach(layer => {
            layer.frame.width = Math.round(min);
        });
    }

    if (identifier == "adjust_height_to_max") {
        var max = Math.max(...layers.map(layer => layer.frame.height));
        layers.forEach(layer => {
            layer.frame.height = Math.round(max);
        });
    }

    if (identifier == "adjust_height_to_min") {
        var min = Math.min(...layers.map(layer => layer.frame.height));
        layers.forEach(layer => {
            layer.frame.height = Math.round(min);
        });
    }

}