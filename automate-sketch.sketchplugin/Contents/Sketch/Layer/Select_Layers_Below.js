var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers;

    if (selection.length == 0) {
        sketch.UI.message("Please select 1 layer.");
        return;
    }

    var parent = selection.layers[0].parent;
    var bottom = Math.max(...selection.layers.map(item => item.frame.y));
    
    selection.clear();

    var belowLayers = parent.layers.filter(layer => layer.frame.y >= bottom);
    document.selectedLayers = belowLayers;

};
