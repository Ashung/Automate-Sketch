var help = require("./Help");

var doc = NSDocumentController.sharedDocumentController().currentDocument();
var contentDrawView = doc.contentDrawView();

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
    contentDrawView.centerSelectionInVisibleArea();
    var rect = help.getMSRectFromMSLayers(doc.selectedLayers().layers());
    var newRect = CGRectMake(rect.x() - 25,rect.y() - 25, rect.width() + 50, rect.height() + 50);
    contentDrawView.zoomToFitRect(newRect);
    // NSApp.sendAction_to_from("zoomToSelection:", nil, context.document);
}