var onRun = function(context) {

    var ga = require("../lib/Google_Analytics");
    ga(context, "Development");

    var pasteboard = require("../lib/Pasteboard");

    var sketch = require("sketch");
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