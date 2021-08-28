var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var pasteboard = require("../modules/Pasteboard");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var documentId = (document.id);

    // Dialog
    var dialog = new Dialog(
        "Change Document ID",
        "Click OK to change the document ID."
    );

    if (document.sketchObject.isLibraryDocument()) {
        var libraryTip = ui.textLabel(
            "This document is a library. Other document which use its components can't get updated if you change the document id.",
            [0, 0, 300, 50]
        );
        libraryTip.setTextColor(NSColor.redColor());
        dialog.addView(libraryTip);
    }

    dialog.addLabel("Document ID:");
    var idView = ui.textField(documentId);
    idView.setFont(NSFont.monospacedSystemFontOfSize_weight(12, NSFontWeightRegular));
    dialog.addView(idView);

    var buttons = ui.view(24);
    var buttonCopy = ui.button("Copy", [-5, 0, 60, 24]);
    var buttonRefresh = ui.button("Refresh", [50, 0, 75, 24]);
    buttons.addSubview(buttonCopy);
    buttons.addSubview(buttonRefresh);
    dialog.addView(buttons);

    buttonCopy.setCOSJSTargetFunction(function(sender) {
        pasteboard.copy(idView.stringValue());
        sketch.UI.message("ID \"" + idView.stringValue() + "\" copied.");
    });

    buttonRefresh.setCOSJSTargetFunction(function(sender) {
        var newId = NSUUID.UUID().UUIDString();
        idView.setStringValue(newId);
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        if (documentId != idView.stringValue()) {
            document._getMSDocumentData().setObjectID(idView.stringValue());
            sketch.UI.message("Document ID changed.");
        }
    }

};
