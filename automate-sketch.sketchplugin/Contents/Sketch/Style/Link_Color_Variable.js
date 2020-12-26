var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var sketch = require("sketch/dom");
    var toast = require("sketch/ui").message;
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    if (selectedLayers.length == 0) {
        toast("Please select at least 1 layer.");
        return;
    }

    var swatches = document.swatches;
    var libraries = sketch.getLibraries().filter(function(library) {
        return library.valid && library.enabled && library.getImportableSwatchReferencesForDocument(document).length > 0;
    });
    
    var targetList = [];
    if (swatches.length > 0) {
        targetList.push("This Document");
    }
    if (libraries.length > 0) {
        targetList = targetList.concat(libraries.map(function(library) {
            return library.name;
        }));
    }

    if (targetList.length == 0) {
        toast("This document and library have not any color variables.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Link Color Variables",
        "Link fill colors, tint, text color and override color to color variables with same value."
    );

    dialog.addLabel("Find Color Variables From");

    var listView = ui.popupButton(targetList);
    dialog.addView(listView);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var library;
        var swatchReferences;
        var swatchReferencesToColors;
        var swatchesToColors;
        if (swatches.length == 0) {
            library = libraries[listView.indexOfSelectedItem()];
        } else {
            if (listView.indexOfSelectedItem() != 0) {
                library = libraries[listView.indexOfSelectedItem() - 1];
            }
        }
        if (library) {
            swatchReferences = library.getImportableSwatchReferencesForDocument(document);
        }
        if (swatchReferences) {
            swatchReferencesToColors = swatchReferences.map(function(swatchReference) {
                return colorToString(swatchReference.sketchObject.color());
            });
        }
        if (!swatchReferencesToColors) {
            swatchesToColors = swatches.map(function(swatch) {
                return swatch.color;
            });
        }


        console.log(swatchesToColors);
        console.log(swatchReferencesToColors);

        var count = {
            fill: 0,
            tint: 0,
            text: 0,
            override: 0
        };
        selectedLayers.forEach(function(layer) {
            // Fill and tint colors
            layer.style.fills.forEach(function(fill) {
                if (fill.fillType == "Color") {
                    console.log(fill.color);
                    if (swatchesToColors) {
                        // TODO: Link Color Variables
                    } else {
                        if (swatchReferencesToColors.includes(fill.color)) {
                            var swatchReference = swatchReferences[swatchReferencesToColors.indexOf(fill.color)];
                            var newSwatch = swatchReference.import();
                            fill.color = newSwatch.referencingColor;
                        }
                    }
                }
            });
    
            // Text colors
    
            // Override colors
    
        });
        
    }

};

function colorToString(value) {
    function toHex(v) {
      // eslint-disable-next-line
      return (Math.round(v * 255) | (1 << 8)).toString(16).slice(1)
    }
    const red = toHex(value.red())
    const green = toHex(value.green())
    const blue = toHex(value.blue())
    const alpha = toHex(value.alpha())
    return `#${red}${green}${blue}${alpha}`
}