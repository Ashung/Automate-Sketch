var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var identifier = __command.identifier();
    var pasteboard = require("../modules/Pasteboard");

    if (selectedLayers.length != 1) {
        sketch.UI.message("Please select 1 layer.");
        return;
    }

    var layer = selectedLayers[0];
    var option = {
        scales: "1",
        formats: "png",
        trimmed: false,
        output: false
    };
    var buffer = sketch.export(layer, option);

    if (identifier == "copy_as_png") {
        pasteboard.setImage(buffer.toNSData());
        sketch.UI.message("PNG copied.");
    }

    if (identifier == "copy_as_png") {
        option.scales = "2";
        pasteboard.setImage(buffer.toNSData());
        sketch.UI.message("PNG @2x copied.");
    }

    if (identifier == "copy_as_svg") {
        option.formats = "svg";
        pasteboard.setText(buffer.toString());
        sketch.UI.message("SVG copied.");
    }

};