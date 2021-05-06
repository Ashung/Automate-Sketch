var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select 1 layer that has color or gradient fill.");
        return;
    }

    var colorAssets = document.colors;
    var gradientAssets = document.gradients;
    var colorCount =  0;
    var gradientCount = 0;
    var updateCount = 0;
    
    var Swatch;
    var swatches;
    var swatchNames;
    if (sketch.version.sketch >= 69) {
        Swatch = require("sketch/dom").Swatch;
        swatches = document.swatches;
        swatchNames = swatches.map(function(item) { return item.name });
    
        var selectedLayersNames = selectedLayers.map(function(layer) {
            return layer.name;
        });
        var showConfirmDialog = selectedLayersNames.some(function(name) {
            return swatchNames.includes(name);
        });
        var responseCode;
        if (showConfirmDialog) {
            var dialog = new Dialog(
                "Update Color Variables",
                'Update the exists color variable with the same name as layer.',
                300,
                ["Update", "Cancel", "Add"]
            );
            responseCode = dialog.run();
        }
    }

    selectedLayers.forEach(function(layer) {
        layer.style.fills.forEach(function(fill) {
            if (fill.fill == "Color") {
                // For Sketch 69 color variables
                if (sketch.version.sketch >= 69) {
                    if (showConfirmDialog) {
                        if (responseCode == 1000) {
                            var mscolor = MSImmutableColor.colorWithSVGString(fill.color).newMutableCounterpart();
                            var swatch = swatches.find(function(item) {
                                return item.name == layer.name
                            });
                            swatch.sketchObject.updateWithColor(mscolor);
                            fill.color = swatch.referencingColor;
                            let swatchContainer = document._getMSDocumentData().sharedSwatches();
                            swatchContainer.updateReferencesToSwatch(swatch.sketchObject);
                            updateCount ++;
                        }
                        if (responseCode == 1002) {
                            var swatch = Swatch.from({
                                name: layer.name,
                                color: fill.color
                            });
                            swatches.push(swatch);
                            fill.color = swatch.referencingColor;
                            colorCount ++;
                        }
                    } else {
                        var swatch = Swatch.from({
                            name: layer.name,
                            color: fill.color
                        });
                        swatches.push(swatch);
                        fill.color = swatch.referencingColor;
                        colorCount ++;
                    }
                } else {
                    colorAssets.push({
                        name: layer.name,
                        color: fill.color
                    });
                    colorCount ++;
                }
            }
            if (fill.fill == "Gradient") {
                gradientAssets.push({
                    name: layer.name,
                    gradient: fill.gradient
                });
                gradientCount ++;
            }
        });
    });

    sketch.UI.message(
        "Add " + colorCount + " colors, " +
        "Update " + updateCount + " colors, " +
        "Add " + gradientCount + " gradients."
    );
    
};