var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var document = context.document;
    var selection = context.selection;

    if (selection.count() > 1) {

        var pasteboardContent = "";
        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            if (layer.class() == "MSSymbolMaster") {
                pasteboardContent += layer.name() + ": " + layer.symbolID() + "\n";
            } else {
                pasteboardContent += layer.name() + ": " + layer.objectID() + "\n";
            }
        }

        var pboard = NSPasteboard.generalPasteboard();
        pboard.clearContents();
        pboard.setString_forType_(pasteboardContent, NSStringPboardType);

        document.showMessage('Layer objectID/SymbolID copied.');

    } else if (selection.count() == 1) {

        var layer = selection.firstObject();

        var pboard = NSPasteboard.generalPasteboard();
        pboard.clearContents();

        if (layer.class() == "MSSymbolMaster") {
            pboard.setString_forType_(
                NSMutableString.stringWithString(layer.symbolID()),
                NSStringPboardType
            );
            document.showMessage('SymbolID "' + layer.symbolID() + '" copied.');
        } else {
            pboard.setString_forType_(
                NSMutableString.stringWithString(layer.objectID()),
                NSStringPboardType
            );
            document.showMessage('Layer objectID "' + layer.objectID() + '" copied.');
        }

    } else {
        document.showMessage("Please select 1 layer.");
    }

};
