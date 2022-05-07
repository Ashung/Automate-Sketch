var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    selectedLayers.forEach(function(layer) {
        if (layer.style) {
            layer.style.sketchObject.setWindingRule(0);
        }
    });

    sketch.UI.message('Change fill rule to Non-Zero.');
}