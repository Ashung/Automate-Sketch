var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var doc = context.document;
    var selection = context.selection;

    var hasTextLayer = false;

    if(selection.count() > 0) {
        var loop = selection.objectEnumerator();
        while (layer = loop.nextObject()) {
            if(layer.className() == "MSTextLayer") {
                hasTextLayer = true;
                var text = layer.stringValue();
                    text = capitalize(text);
                layer.setStringValue(text);

                // Refresh textLayer
                layer.adjustFrameToFit();
            }
        }
    }

    if(!hasTextLayer) {
        doc.showMessage("No text layers seleted.");
    }

};

function capitalize(initStr) {
    return initStr.toLowerCase().replace(/[\w\u249c-\u24b5\u24d0-\u24e9]\S*/g, function(tempStr) {
        return tempStr.charAt(0).toUpperCase() + tempStr.substr(1);
    });
}
