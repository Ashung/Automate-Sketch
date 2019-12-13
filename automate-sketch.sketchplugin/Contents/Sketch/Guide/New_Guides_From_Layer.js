var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var util = require("util");

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select 1 layer.");
        return;
    }

    showRuler(document.sketchObject);

    selectedLayers.forEach(function(layer) {
        var rect = layer.sketchObject.frameForTransforms();
        var x = Math.floor(rect.origin.x),
            y = Math.floor(rect.origin.y),
            w = Math.ceil(rect.size.width),
            h = Math.ceil(rect.size.height);
        var parent = layer.parent.sketchObject;

        var horizontalRulerData = parent.horizontalRulerData();
        var verticalRulerData = parent.verticalRulerData();

        if (!horizontalRulerData.guides().containsObject(x)) {
            horizontalRulerData.addGuideWithValue(x);
        }
        if (!horizontalRulerData.guides().containsObject(x + w)) {
            horizontalRulerData.addGuideWithValue(x + w);
        }
        if (!verticalRulerData.guides().containsObject(y)) {
            verticalRulerData.addGuideWithValue(y);
        }
        if (!verticalRulerData.guides().containsObject(y + h)) {
            verticalRulerData.addGuideWithValue(y + h);
        }

    });
};

function showRuler(document) {
    if (!document.isRulersVisible()) {
        var toggleRulersAction = document.actionsController().actionForID("MSToggleRulersAction");
        if(toggleRulersAction.validate()) {
            toggleRulersAction.performAction(nil);
        }
    }
}