var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch/dom");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    if (identifier == "reset_style") {
        var selectedLayers = document.selectedLayers.layers;
        if (selectedLayers.length == 0) {
            sketch.UI.message("Please select at least 1 layer with shared style.");
        }
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
            }
        });
    }

    if (identifier == "reset_all_layer_styles") {
        var sharedLayerStyles = document.sharedLayerStyles;
        sharedLayerStyles.forEach(function(sharedStyle) {
            sharedStyle.getAllInstancesLayers().forEach(function(layer) {
                layer.style = sharedStyle.style;
            });
        });
    }

    if (identifier == "reset_all_text_styles") {
        var sharedTextStyles = document.sharedTextStyles;
        sharedTextStyles.forEach(function(sharedStyle) {
            sharedStyle.getAllInstancesLayers().forEach(function(layer) {
                layer.style = sharedStyle.style;
            });
        });
    }

};
