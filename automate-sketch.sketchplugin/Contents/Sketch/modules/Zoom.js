var sketch = require("sketch");
var document = sketch.getSelectedDocument();
var contentDrawView = document.sketchObject.contentDrawView();

module.exports.zoomValue = contentDrawView.zoomValue();

// CMD + 0
module.exports.toActualSize = function() {
    contentDrawView.zoomToActualSizeAnimated(true);
}

// CMD + 1
module.exports.toFitCanvas = function() {
    contentDrawView.centerLayersInCanvas();
}

// CMD + 2
module.exports.toSelection = function() {
    NSApp.sendAction_to_from("zoomToSelection:", nil, document.sketchObject);
}