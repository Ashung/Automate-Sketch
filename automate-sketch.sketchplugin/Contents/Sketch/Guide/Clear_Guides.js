var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var util = require("util");

    showRuler(document.sketchObject);

    if (selectedLayers.length == 0) {
        var page = document.selectedPage.sketchObject;
        clearGuides(page);
        var artboards = util.toArray(page.artboards());
        artboards.forEach(function(artboard) {
            clearGuides(artboard);
        });
    } else {
        selectedLayers.forEach(function(layer) {
            if (layer.type == "Artboard" || layer.type == "SymbolMaster") {
                clearGuides(layer.sketchObject);
            } else {
                clearGuides(layer.sketchObject.parentArtboard());
            }
        });
    }
};

function clearGuides(target) {
    target.horizontalRulerData().removeAllGuides();
    target.verticalRulerData().removeAllGuides();
}

function showRuler(document) {
    if (!document.isRulersVisible()) {
        var toggleRulersAction = document.actionsController().actionForID("MSToggleRulersAction");
        if(toggleRulersAction.validate()) {
            toggleRulersAction.performAction(nil);
        }
    }
}