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
                addSpace(layer);
            }
        }
    } else {
        var allLayers = doc.currentPage().children();
        for(var i = 0; i < allLayers.count(); i++) {
            if(allLayers[i].className() == "MSTextLayer") {
                hasTextLayer = true;
                addSpace(allLayers[i]);
            }
        }
    }

    if(!hasTextLayer) {
        doc.showMessage("No text layer.");
    }

    function addSpace(textlayer) {

        // http://unicode-table.com/
        var unicode = {
            "latin" : "[\u0021-\u2C7F]",
            "cjk_punctuation" : "[\u2E00-\u2E7F\u3000-\u303F]",
            "cjk" : "[\u2E80-\u2FDF\u3040-\u9FFF]"
        };

        var text = textlayer.stringValue();
            text = text.replace(new RegExp("(" + unicode.cjk + ")(" + unicode.latin + ")", "g"), "$1 $2");
            text = text.replace(new RegExp("(" + unicode.latin + ")(" + unicode.cjk + ")", "g"), "$1 $2");

        textlayer.setStringValue(text);

        // Refresh textLayer
        textlayer.adjustFrameToFit();

    }

};
