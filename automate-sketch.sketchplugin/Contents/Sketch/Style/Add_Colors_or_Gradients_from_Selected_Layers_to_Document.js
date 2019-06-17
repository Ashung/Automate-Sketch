var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select 1 layer that has color or gradient fill.");
        return;
    }

    var colorAssets = document.colors;
    var gradientAssets = document.gradients;
    var colorCount =  colorAssets.length;
    var gradientCount = gradientAssets.length;
    selectedLayers.forEach(function(layer) {
        layer.style.fills.forEach(function(fill) {
            if (fill.fill == "Color") {
                colorAssets.push({
                    name: null,
                    color: fill.color
                });
            }
            if (fill.fill == "Gradient") {
                gradientAssets.push({
                    name: null,
                    gradient: fill.gradient
                });
            }
        });
    });

    sketch.UI.message(
        "Add " + (document.colors.length - colorCount) + " colors and " + 
        (document.gradients.length - gradientCount) + " gradients."
    );
    
};