var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch/dom");
    var toast = require("sketch/ui").message;
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    if (selectedLayers.length == 0) {
        toast("Please select at least 1 layer.");
        return;
    }

    // TODO: Detach Color Variables

};