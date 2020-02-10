var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var pasteboard = require("../modules/Pasteboard");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;

    if (selection.length != 1) {
        sketch.UI.message("Please select 1 shape layer.");
        return;
    }

    var layer = selection[0];
    if (!["Shape", "ShapePath"].includes(layer.type)) {
        sketch.UI.message("Please select 1 shape layer.");
        return;
    }

    var bezierPath = NSBezierPath.bezierPathWithPath(layer.sketchObject.pathInBounds());
    var pathdata = String(bezierPath.svgPathAttribute()).replace(/^d="/, "").replace(/"$/, "");

    pasteboard.pbcopy(pathdata);
    sketch.UI.message("SVG path data is copied.");

};