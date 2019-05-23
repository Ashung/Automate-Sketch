var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var document = context.document;
    var selection = context.selection;
    var text = selection.firstObject();

    if (selection.count() != 1 || !text || text.class() != "MSTextLayer") {
        document.showMessage("Please select a text layer.");
        return;
    }

    if (text.isEditingText()) {
        var count = text.editingDelegate().textView().selectedRange().length;
        document.showMessage(`Selected Character Count: ${count}.`);
    }
    else {
        var count = text.stringValue().length();
        document.showMessage(`Character Count: ${count}.`);
    }

};
