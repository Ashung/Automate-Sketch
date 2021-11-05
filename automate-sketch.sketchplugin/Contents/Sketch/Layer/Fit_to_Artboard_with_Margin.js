var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var sketch = require("sketch");
    var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select 1 layer in Artboard.");
        return;
    }

    var dialog = new Dialog(
        "Fit to Artboard with Margin",
        'Syntax: "<all>", "<top>;<right>;<bottom>;<left>", "<top>;<right|left>;<bottom>", "<top|bottom>;<right|left>". use empty value to keep original margin, like "8;8;;8".'
    );

    var defaultMargin = preferences.get("fitToArtboardMargin") || "8";
    var marginInput = ui.textField(defaultMargin);
    dialog.addView(marginInput);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var userInput = marginInput.stringValue();
        preferences.set("fitToArtboardMargin", userInput.toString());
        
        var margins = userInput.split(/;\s*/).map(function(item) {
            return !isNaN(parseInt(item)) ? parseInt(item) : undefined;
        });
        var top, right, bottom, left;
        if (margins.length == 1) {
            top = right = bottom = left =  margins[0];
        }
        if (margins.length == 2) {
            top = bottom =  margins[0];
            right = left =  margins[1];
        }
        if (margins.length == 3) {
            top = margins[0];
            right = left =  margins[1];
            bottom =  margins[2];
        }
        if (margins.length == 4) {
            top = margins[0];
            right = margins[1]
            bottom =  margins[2];
            left =  margins[3];
        }

        selectedLayers.forEach(function(layer) {
            var artboard = layer.sketchObject.parentArtboard();
            if (artboard) {
                var aw = artboard.frame().width();
                var ah = artboard.frame().height();
                var xInArtboard = layer.sketchObject.absoluteRect().x() - artboard.absoluteRect().x();
                var yInArtboard = layer.sketchObject.absoluteRect().y() - artboard.absoluteRect().y();
                var x = left != undefined ? left : xInArtboard;
                var y = top != undefined ? top : yInArtboard;
                var width = aw - x - (right != undefined ? right : aw - xInArtboard - layer.frame.width);
                var height = ah - y - (bottom != undefined ? bottom : ah - yInArtboard - layer.frame.height);
                layer.sketchObject.absoluteRect().setX(artboard.absoluteRect().x() + x);
                layer.sketchObject.absoluteRect().setY(artboard.absoluteRect().y() + y);
                layer.sketchObject.frame().setWidth(width);
                layer.sketchObject.frame().setHeight(height);
                if (layer.type == "Text") {
                    layer.sketchObject.setTextBehaviour_mayAdjustFrame(1, false);
                }
                if (layer.sketchObject.parentGroup().className() == "MSLayerGroup") {
                    layer.sketchObject.parentGroup().fixGeometryWithOptions(1);
                }
            }
        });

    }
}