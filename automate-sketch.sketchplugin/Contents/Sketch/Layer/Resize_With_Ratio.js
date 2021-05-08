var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var ratios = [
        { w: 1, h: 1 },
        { w: 2, h: 1 },
        { w: 3, h: 2 },
        { w: 4, h: 3 },
        { w: 5, h: 3 },
        { w: 5, h: 4 },
        { w: 7, h: 5 },
        { w: 16, h: 9 }
    ];

    var sketch = require("sketch");
    var version = sketch.version.sketch;
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Resize with Ratio"
    );

    dialog.addLabel("Choose a ratio:");
    var ratioPresets = ratios.map(function(item) {
        return item.w + ":" + item.h;
    });
    var ratioPresetsView = ui.popupButton(ratioPresets);
    dialog.addView(ratioPresetsView);

    var portraitView = ui.checkBox(false, "Portrait orientation.");
    dialog.addView(portraitView);

    var lockHeightView = ui.checkBox(false, "Lock height.");
    dialog.addView(lockHeightView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        selectedLayers.forEach(function(layer) {
            var selectIndex = ratioPresetsView.indexOfSelectedItem();
            if (lockHeightView.state() == NSOffState) {
                var width = layer.frame.width;
                var height = Math.round(width * ratios[selectIndex].h / ratios[selectIndex].w);
                if (portraitView.state() == NSOnState) {
                    height = Math.round(width * ratios[selectIndex].w / ratios[selectIndex].h);
                }
                if (version >= 72) {
                    if (layer.sketchObject.shouldConstrainProportions()) {
                        layer.sketchObject.setShouldConstrainProportions(false);
                    }
                } else {
                    if (layer.sketchObject.constrainProportions()) {
                        layer.sketchObject.setConstrainProportions(false);
                    }
                }
                layer.frame.height = height;
            } else {
                var height = layer.frame.height;
                var width = Math.round(height * ratios[selectIndex].w / ratios[selectIndex].h);
                if (portraitView.state() == NSOnState) {
                    width = Math.round(height * ratios[selectIndex].h / ratios[selectIndex].w);
                }
                if (version >= 72) {
                    if (layer.sketchObject.shouldConstrainProportions()) {
                        layer.sketchObject.setShouldConstrainProportions(false);
                    }
                } else {
                    if (layer.sketchObject.constrainProportions()) {
                        layer.sketchObject.setConstrainProportions(false);
                    }
                }
                layer.frame.width = width;
            }
        });

        
    }
};