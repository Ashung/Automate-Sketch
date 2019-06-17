var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var doc = context.document;
    var selection = context.selection;

    if (selection.count() > 0 && selection.firstObject().class() == "MSSymbolMaster") {
        var symbol = selection.firstObject();
        if (!symbol.hasInstances()) {
            symbol.ungroup();
        } else {
            doc.showMessage("This symbol master is used.");
        }
    } else {
        doc.showMessage("Select a symbol master.");
    }

};
