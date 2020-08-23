var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var util = require("util");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var count = 0;
    if (selectedLayers.length == 0) {
        // Show all layers in current page.
        var allChildren = util.toArray(document.selectedPage.sketchObject.children()); //);
        allChildren.forEach(function(layer) {
            if (!layer.isVisible()) {
                layer.setIsVisible(true);
                count ++;
            }
        });
        if (count == 0) {
            sketch.UI.message("No hide layer in current page.");
        } else {
            sketch.UI.message("Show " + count + " layer" + (count > 1 ? "s" : "") + " in current page.");
        }
    } else {
        // Show all layers in selected layer.
        var allChildren = [];
        selectedLayers.forEach(function(layer) {
            allChildren = allChildren.concat(
                util.toArray(layer.sketchObject.children())
            );
        });
        allChildren.forEach(function(layer) {
            if (!layer.isVisible()) {
                layer.setIsVisible(true);
                count ++;
            }
        })
        if (count == 0) {
            sketch.UI.message("No hide layer in selected layers.");
        } else {
            sketch.UI.message("Show " + count + " layer" + (count > 1 ? "s" : "") + " in selected layers.");
        }
    }

};