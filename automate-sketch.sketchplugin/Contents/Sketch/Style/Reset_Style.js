var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch/dom");
    var document = sketch.getSelectedDocument();

    document.selectedLayers.layers.forEach(function(layer) {
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

};
