var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    var selectedArtboard = document.selectedLayers.layers.find(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    });

    if (!selectedArtboard) {
        sketch.UI.message("Please select 1 artboard or symbol master.");
        return;
    }

    var dialog = new Dialog("New Guide", "You can input a integer or percent like '50%', use comma split multi positions.");

    var positionView = ui.textField(preferences.get("newGuidePosition") || "50%");
    dialog.addView(positionView);
    dialog.focus(positionView);

    dialog.addLabel("Orientation");
    var orientationView = ui.popupButton(["Horizontal", "Vertical"]);
    dialog.addView(orientationView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        preferences.set("newGuidePosition", positionView.stringValue());

        showRuler(document.sketchObject);

        var orientation = orientationView.indexOfSelectedItem();
        var positions = positionView.stringValue().split(/\,\s?/);
        positions.forEach(function(position) {
            addGuide(position, orientation);
        });

    }

    function addGuide(position, orientation) {
        var horizontalRulerData = selectedArtboard.sketchObject.horizontalRulerData();
        var verticalRulerData = selectedArtboard.sketchObject.verticalRulerData();
        var value;
        if (/^[0-9]+(\.[0-9]+)?$/.test(position)) {
            value = parseFloat(position);
        }
        if (/^[0-9]+(\.[0-9]+)?%$/.test(position)) {
            value = selectedArtboard.frame.width * parseFloat(position) / 100;
        }
       value = Math.round(value);
        if (orientation == 0) {
            horizontalRulerData.addGuideWithValue(value);
        } else {
            verticalRulerData.addGuideWithValue(value);
        }
    }

};

function showRuler(document) {
    if (!document.isRulersVisible()) {
        var toggleRulersAction = document.actionsController().actionForID("MSToggleRulersAction");
        if(toggleRulersAction.validate()) {
            toggleRulersAction.performAction(nil);
        }
    }
}
