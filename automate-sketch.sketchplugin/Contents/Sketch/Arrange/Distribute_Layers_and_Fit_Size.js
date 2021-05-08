var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var help = require("../modules/Help");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var identifier = __command.identifier();

    if (selectedLayers.length < 2) {
        sketch.UI.message("Please select at least 2 layers.");
        return;
    }

    var dialogTitle = identifier == "distribute_layers_horizontally_and_fit_width" ?
        "Distribute Layers Horizontally and Fit Width" :
        "Distribute Layers Vertically and Fit Height";
    var dialog = new Dialog(dialogTitle);

    dialog.addLabel("Gap between layers:");
    var gapView = ui.numberField(preferences.get("distributeLayersGap") || 8);
    dialog.addView(gapView);
    dialog.focus(gapView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        // Gap between layers
        var gap = parseInt(gapView.stringValue());
        if (gap < 0) {
            sketch.UI.message("Gap must >= 0.");
            return;
        }
        preferences.set("distributeLayersGap", gap);

        var minSize = selectedLayers.length + (selectedLayers.length - 1) * gap;

        // Get rect of selected layers
        var rect = help.getRectFromLayers(selectedLayers);

        if (identifier == "distribute_layers_horizontally_and_fit_width") {
            if (minSize > rect.width) {
                var value = rect.width - selectedLayers.length - (selectedLayers.length - 1) * gap;
                sketch.UI.message("Gap must less then " + value + ".");
                return;
            }
            var layerWidth = Math.round(
                (rect.width - (selectedLayers.length - 1) * gap) / selectedLayers.length
            );
            selectedLayers.sort(function(a, b) {
                if (a.frame.x > b.frame.x) return 1;
                if (a.frame.x < b.frame.x) return -1;
                return 0;
            });
            selectedLayers.forEach(function(layer, index) {
                layer.frame.x = rect.x + (layerWidth + gap) * index;
                if (index == selectedLayers.length - 1) {
                    layer.frame.width = rect.width - (layerWidth + gap) * index;
                } else {
                    layer.frame.width = layerWidth;
                }
            });
        }
    
        if (identifier == "distribute_layers_vertically_and_fit_height") {
            if (minSize > rect.height) {
                var value = rect.height - selectedLayers.length - (selectedLayers.length - 1) * gap;
                sketch.UI.message("Gap must less then " + value + ".");
                return;
            }
            var layerHeight = Math.round(
                (rect.height - (selectedLayers.length - 1) * gap) / selectedLayers.length
            );
            selectedLayers.sort(function(a, b) {
                if (a.frame.y > b.frame.y) return 1;
                if (a.frame.y < b.frame.y) return -1;
                return 0;
            });
            selectedLayers.forEach(function(layer, index) {
                layer.frame.y = rect.y + (layerHeight + gap) * index;
                if (index == selectedLayers.length - 1) {
                    layer.frame.height = rect.height - (layerHeight + gap) * index;
                } else {
                    layer.frame.height = layerHeight;
                }
            });
        }
    }
};