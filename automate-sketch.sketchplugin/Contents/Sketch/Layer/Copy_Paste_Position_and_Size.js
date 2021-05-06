var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var util = require("util");
    var sketch = require("sketch/dom");
    var message = require("sketch/ui").message;
    var pasteboard = require("../modules/Pasteboard");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    if (identifier == "copy_layer_position_and_size") {
        if (document.selectedLayers.length != 1) {
            message("Select only 1 layer.");
            return;
        }
        var layer = document.selectedLayers.layers[0];
        pasteboard.setText(JSON.stringify(layer.frame));
        message("Layer position and size copied.");
    }

    var data = pasteboard.getText();
    if (data) {
        if (identifier == "paste_layer_position_and_size") {
            try {
                var frame = JSON.parse(data);
                if (frame.x >= 0 && frame.y >= 0 && frame.width > 0 && frame.height > 0) {
                    document.selectedLayers.forEach(function(layer) {
                        layer.frame = frame;
                    });
                }
            } catch (err) {
                message("Please copy a position and size of 1 layer first.");
            }
        }
        if (identifier == "paste_layer_position") {
            try {
                var frame = JSON.parse(data);
                if (frame.x >= 0 && frame.y >= 0) {
                    document.selectedLayers.forEach(function(layer) {
                        layer.frame.x = frame.x;
                        layer.frame.y = frame.y;
                    });
                }
            } catch (err) {
                message("Please copy a position and size of 1 layer first.");
            }
        }
        if (identifier == "paste_layer_size") {
            try {
                var frame = JSON.parse(data);
                if (frame.width > 0 && frame.height > 0) {
                    document.selectedLayers.forEach(function(layer) {
                        layer.frame.width = frame.width;
                        layer.frame.height = frame.height;
                    });
                }
            } catch (err) {
                message("Please copy a position and size of 1 layer first.");
            }
        }
    } else {
        message("Not text in pasteboard.");
    }
}