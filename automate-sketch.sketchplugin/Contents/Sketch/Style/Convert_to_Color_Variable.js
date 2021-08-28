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

    // Document / library have color variable
    var targetList = [];
    var swatches = document.swatches;
    if (swatches.length > 0) {
        targetList.push(`This Document (${swatches.length})`);
    }

    var libraries = sketch.getLibraries().filter(function(library) {
        return library.valid && library.enabled && library.getImportableSwatchReferencesForDocument(document).length > 0;
    });
    if (libraries.length > 0) {
        targetList = targetList.concat(libraries.map(function(library) {
            let count = library.getImportableSwatchReferencesForDocument(document).length;
            return `${library.name} (${count})`;
        }));
    }

    if (targetList.length == 0) {
        toast("This document and library have not any color variables.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Convert to Color Variable",
        "Convert fill color, tint, text color and override color to existing color variable with same value."
    );

    dialog.addLabel("Find Color Variables From");

    var listView = ui.popupButton(targetList);
    dialog.addView(listView);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var colors = {};
        var library;
        if (swatches.length == 0) {
            library = libraries[listView.indexOfSelectedItem()];
        } else {
            if (listView.indexOfSelectedItem() != 0) {
                library = libraries[listView.indexOfSelectedItem() - 1];
            }
        }
        if (library) {
            library.getImportableSwatchReferencesForDocument(document).forEach(function(item) {
                var key = colorToString(item.sketchObject.color());
                colors[key] = {
                    isReference: true,
                    value: item,
                }
            });
        } else {
            swatches.forEach(function(item) {
                colors[item.color] = {
                    isReference: false,
                    value: item,
                };
            });
        }

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
                    if (colors[fill.color]) {
                        var swatch = colors[fill.color].value;
                        if (colors[fill.color].isReference) {
                            swatch = swatch.import();
                        }
                        fill.color = swatch.referencingColor;
                    }
                    if (layer.type == "Group" || layer.type == "SymbolInstance") {
                        count.tint += 1;
                    } else {
                        count.fill += 1;
                    }
                }
            });

            // Text colors
            if (layer.style.textColor && colors[layer.style.textColor]) {
                var swatch = colors[layer.style.textColor].value;
                if (colors[layer.style.textColor].isReference) {
                    swatch = swatch.import();
                }
                layer.style.textColor = swatch.referencingColor;
                count.text += 1;
            }

            // Override colors
            if (layer.overrides) {
                layer.overrides.forEach(function(o) {
                    if (o.property == 'fillColor' && o.editable) {
                        var key = colorToString(o.sketchObject.currentValue());
                        if (colors[key]) {
                            var swatch = colors[key].value;
                            if (colors[key].isReference) {
                                swatch = swatch.import();
                            }
                            o.value = swatch.sketchObject.makeReferencingColor().immutableModelObject();
                            count.override += 1;
                        }
                    }
                });
            }
        });

        var messages = [];
        if (count.fill > 0) {
            messages.push(`${count.fill} fill color${count.fill > 1 ? 's' : ''}` );
        }
        if (count.tint > 0) {
            messages.push(`${count.tint} tint color${count.tint > 1 ? 's' : ''}` );
        }
        if (count.text > 0) {
            messages.push(`${count.text} text color${count.text > 1 ? 's' : ''}` );
        }
        if (count.override > 0) {
            messages.push(`${count.override} override color${count.override > 1 ? 's' : ''}` );
        }
        toast(`Convert ${messages.join(', ')}.`);
        
    }
};

function colorToString(value) {
    function toHex(v) {
        // eslint-disable-next-line
        return (Math.round(v * 255) | (1 << 8)).toString(16).slice(1);
    }
    const red = toHex(value.red());
    const green = toHex(value.green());
    const blue = toHex(value.blue());
    const alpha = toHex(value.alpha());
    return `#${red}${green}${blue}${alpha}`;
}