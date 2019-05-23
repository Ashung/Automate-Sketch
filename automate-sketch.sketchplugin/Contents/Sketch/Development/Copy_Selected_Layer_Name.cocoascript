var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var document = context.document;
    var selection = context.selection;

    if (selection.count() > 0) {

        var pasteBoardString = NSMutableString.alloc().init();
        var loopSelection = selection.reverseObjectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            pasteBoardString.appendString(layer.name() + "\n");
        }

        // remove last new lice
        pasteBoardString = pasteBoardString.replace(/\n$/, "");

        var pboard = NSPasteboard.generalPasteboard();
        pboard.clearContents();
        pboard.setString_forType_(pasteBoardString, NSStringPboardType);

        if (selection.count() > 1) {
            document.showMessage(selection.count() + " layer names copied.");
        } else {
            document.showMessage("Layer names copied.");
        }

    } else {
        document.showMessage("Please select at least 1 layer.");
    }

};
