var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var pasteboard = require("../modules/Pasteboard");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    if (selectedLayers.length != 1 || selectedLayers[0].type != "Slice") {
        sketch.UI.message("Please select 1 slice layer.")
        return;
    }

    var slice = selectedLayers[0];
    var options = {
        formats: "svg",
        output: false
    }
    var svgCode = sketch.export(slice, options).toString();
    pasteboard.pbcopy(svgCode);

    sketch.UI.message("SVG code copied.");

};