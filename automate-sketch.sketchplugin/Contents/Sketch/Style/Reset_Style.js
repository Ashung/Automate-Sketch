var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    // Reset style for selected layers
    if (identifier == "reset_style") {
        var selectedLayers = document.selectedLayers.layers;
        if (selectedLayers.length == 0) {
            sketch.UI.message("Please select at least 1 layer with shared style.");
            return;
        }
        var count = 0;
        selectedLayers.forEach(function(layer) {
            if (layer.sharedStyleId) {
                var shareObjects;
                if (layer.type == "Text") {
                    shareObjects = document.sharedTextStyles;
                } else {
                    shareObjects = document.sharedLayerStyles;
                }
                layer.style = shareObjects.find(function(style) {
                    return style.id == layer.sharedStyleId;
                }).style;
                count ++;
            }
        });
        sketch.UI.message('Reset ' + count + ' shared style' + (count > 1 ? 's' : '') + '.');
    }

    if (identifier == "reset_all_layer_styles" || identifier == "reset_all_text_styles") {
        var sharedLayerStyles = (identifier == "reset_all_layer_styles") ? document.sharedLayerStyles : document.sharedTextStyles;
        sharedLayerStyles.forEach(function(sharedStyle) {
            sharedStyle.sketchObject.resetReferencingInstances();
        });
    }

};
