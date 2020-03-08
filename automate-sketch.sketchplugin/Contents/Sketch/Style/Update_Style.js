var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    // Update style for selected layers
    var selectedLayers = document.selectedLayers.layers;
    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 layer with shared style.");
        return;
    }
    var count = 0;
    var countLibraryStyle = 0;
    selectedLayers.forEach(function(layer) {
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
                countLibraryStyle ++;
            } else {
                sharedStyle.style = layer.style;
                sharedStyle.getAllInstancesLayers().forEach(function(_layer) {
                    _layer.style = layer.style;
                });
                count ++;
            }
        }
    });
    var message = 'Update ' + count + ' shared style' + (count > 1 ? 's' : '') + '.';
    if (countLibraryStyle > 0) {
        message += ' Ignore ' + countLibraryStyle + ' library style' + (count > 1 ? 's' : '') + '.';
    }
    sketch.UI.message(message);

};