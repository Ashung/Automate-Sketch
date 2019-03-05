@import "../Libraries/Google_Analytics.cocoascript";

var onRun = function(context) {

    ga(context, "Development");

    var sketch = require("sketch");
    var pasteboard = require("../Libraries/Pasteboard.js");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers.layers;
    var layer = selection[0];

    if (!layer && !["Shape", "ShapePath"].includes(layer.type)) {
        sketch.UI.message("Please select 1 shape layer.");
        return;
    }

    var bezierPath = NSBezierPath.bezierPathWithPath(layer.sketchObject.pathInBounds());
    var pathdata = String(bezierPath.svgPathAttribute()).replace(/^d="/, "").replace(/"$/, "");

    pasteboard.pbcopy(pathdata);
    sketch.UI.message("SVG path data is copied.");

};