var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();
    var selectedLayers = document.selectedLayers.layers;
    var textLayers = selectedLayers.filter(function(layer) {
        return layer.type == 'Text';
    });
    if (textLayers.length == 0) {
        sketch.UI.message("Please select at least 1 text layer.");
        return;
    }

    textLayers.forEach(function(layer) {
        if (identifier == "unfixed_layer_name") {
            layer.name = layer.text.substr(0, 20);
            layer.sketchObject.setNameIsFixed(0);
        }
        if (identifier == "fixed_layer_name") {
            layer.sketchObject.setNameIsFixed(1);
        }
    });

};
