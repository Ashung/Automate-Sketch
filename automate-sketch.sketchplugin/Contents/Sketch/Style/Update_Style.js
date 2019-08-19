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
            var sharedStyle = shareObjects.find(function(style) {
                return style.id == layer.sharedStyleId;
            });
            if (sharedStyle.getLibrary()) {
                sharedStyle.unlinkFromLibrary();
            }
            sharedStyle.style = layer.style;
            sharedStyle.getAllInstancesLayers().forEach(function(_layer) {
                _layer.style = layer.style;
            });
        }
    });

};