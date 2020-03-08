var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var SharedStyle = require("sketch/dom").SharedStyle;
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    selectedLayers = selectedLayers.filter(function(layer) {
        return layer.style;
    })
    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 styled layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog("Add Styles from Selected Layers");

    var replaceSameName = ui.checkBox(true, "Replace shared styles with same name.");
    dialog.addView(replaceSameName);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var createCount = 0;
        var replaceCount = 0;
        if (replaceSameName.state() == NSOffState) {
            selectedLayers.forEach(function(layer) {
                var newSharedStyle = SharedStyle.fromStyle({
                    name: layer.name,
                    style: layer.style,
                    document: document,
                });
                layer.sharedStyleId = (newSharedStyle.id);
                createCount ++;
            });
            sketch.UI.message("Add " + createCount + " style" + (createCount > 1 ? "s" : "") + ".");
        } else {
            var localLayerStyles = document.sharedLayerStyles.filter(function(style) {
                return !style.getLibrary();
            });
            var localTextStyles = document.sharedTextStyles.filter(function(style) {
                return !style.getLibrary();
            });
            selectedLayers.forEach(function(layer) {
                var type = layer.style.styleType;
                var sharedStyleWithSameName;
                if (type == "Layer") {
                    sharedStyleWithSameName = localLayerStyles.find(function(style) {
                        return style.name == layer.name;
                    });
                }
                if (type == "Text") {
                    sharedStyleWithSameName = localTextStyles.find(function(style) {
                        return style.name == layer.name;
                    });
                }
                if (sharedStyleWithSameName) {
                    sharedStyleWithSameName.style = layer.style;
                    sharedStyleWithSameName.getAllInstancesLayers().forEach(function(_layer) {
                        _layer.style.syncWithSharedStyle(sharedStyleWithSameName);
                    });
                    layer.sharedStyleId = (sharedStyleWithSameName.id);
                    replaceCount ++;
                } else {
                    var newSharedStyle = SharedStyle.fromStyle({
                        name: layer.name,
                        style: layer.style,
                        document: document,
                    });
                    layer.sharedStyleId = (newSharedStyle.id);
                    createCount ++;
                }
            });
            var message = [];
            if (createCount > 0) {
                message.push("Add " + createCount + " style" + (createCount > 1 ? "s" : "") + ".");
            }
            if (replaceCount > 0) {
                message.push("Replace " + replaceCount + " style" + (replaceCount > 1 ? "s" : "") + ".");
            }
            sketch.UI.message(message.join(" "));
        }
    }
};