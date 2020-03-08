var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Prototyping");

    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    selectedLayers.filter(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    }).forEach(function(layer) {
        var children = util.toArray(layer.sketchObject.children());
        children.forEach(function(child) {
            if (child.flow()) {
                if (child.class() == "MSHotspotLayer") {
                    child.removeFromParent();
                } else {
                    child.setFlow(null);
                }
            }
        });
    });

    // document.sketchObject.loadLayerListPanel();
};