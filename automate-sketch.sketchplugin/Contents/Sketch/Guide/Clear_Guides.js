var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var util = require("util");

    if (selectedLayers.length == 0) {
        var page = document.selectedPage.sketchObject;
        clearGuides(page);
        var artboards = util.toArray(page.artboards());
        artboards.forEach(function(artboard) {
            clearGuides(artboard);
        });
    } else {
        selectedLayers.forEach(function(layer) {
            clearGuides(layer.parent.sketchObject);
        });
    }
};

function clearGuides(target) {
    target.horizontalRulerData().removeAllGuides();
    target.verticalRulerData().removeAllGuides();
}
