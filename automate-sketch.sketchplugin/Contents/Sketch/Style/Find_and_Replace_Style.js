// TODO: New Feature: Find and replace text/layer style.

var onRun = function(context) {

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var toArray = require("util").toArray;
    var toast = require("sketch/ui").message;
    var sketch = require("sketch/dom");
    var document = sketch.getSelectedDocument();
    var documentData = document._getMSDocumentData();
    var identifier = __command.identifier();
    
    // Get all style
    var styles = NSMutableArray.alloc().init();
    var sortDescriptorByName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    if (identifier == "find_and_replace_layer_style") {
        if (document.sharedLayerStyles.length == 0) {
            toast("Document have not any layer style.");
            return;
        }
        styles.addObjectsFromArray(documentData.allLayerStyles().sortedArrayUsingDescriptors([sortDescriptorByName]));
    } else {
        if (document.sharedTextStyles.length == 0) {
            toast("Document have not any text style.");
            return;
        }
        styles.addObjectsFromArray(documentData.allTextStyles().sortedArrayUsingDescriptors([sortDescriptorByName]));
    }
    var foreignStyles = NSMutableArray.alloc().init();
    var loopStyles = styles.mutableCopy().objectEnumerator();
    var style;
    while (style = loopStyles.nextObject()) {

        if (style.isForeign()) {

    //         const libraryController = AppController.sharedInstance().librariesController()
    // const lib = libraryController.libraryForShareableObject(style)

    // log(lib.name())
    //         log(style)
    //         // log(style.foreignObject().localObject()); .sharedObject()
    //         log(style.foreignObject().remoteStyleID());
    //         log(style.foreignObject().masterFromLibrary(lib))

    //         log(lib.document().layerStyles().sharedStyles())

            styles.removeObject(style);
            foreignStyles.addObject(style);
        }
    };
    var sortDescriptorByLibraryName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "foreignObject.sourceLibraryName", true, "localizedStandardCompare:"
    );
    foreignStyles = foreignStyles.sortedArrayUsingDescriptors([sortDescriptorByLibraryName]);
    styles.addObjectsFromArray(foreignStyles);

    // return;

    // Dialog
    var dialog;
    var type;
    if (identifier == "find_and_replace_layer_style") {
        dialog = new Dialog("Find and Replace Layer Style");
        type = "layer";
    } else {
        dialog = new Dialog("Find and Replace Text Style");
        type = "text";
    }

    dialog.addLabel("Find");
    var styleNames = toArray(styles).map(function(style) {
        if (style.isForeign()) {
            return style.foreignObject().sourceLibraryName() + " ▶︎ " +  style.name();
        } else {
            return style.name();
        }
    });
    var findStyleView = ui.popupButton(styleNames);
    dialog.addView(findStyleView);

    dialog.addLabel("Replace Style From...");
    var replaceToLibraries = NSMutableArray.alloc().init();
    replaceToLibraries.addObject(documentData);
    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptorByName]);
    replaceToLibraries.addObjectsFromArray(availableLibraries);
    var replaceToLibraryNames = toArray(replaceToLibraries).map(function(item) {
        if (item.class() == "MSDocumentData") {
            return "Document";
        } else {
            return item.name();
        }
    });
    var replaceLibraryView = ui.popupButton(replaceToLibraryNames);
    dialog.addView(replaceLibraryView);

    dialog.addLabel("Styles");
    var replaceStyles = getStyleFromDocumentOrLibrary_except(
        type,
        replaceToLibraries.objectAtIndex(replaceLibraryView.indexOfSelectedItem()),
        styles.objectAtIndex(findStyleView.indexOfSelectedItem())
    );
    // replaceStyles.removeObject();
    var replaceStylesNames = toArray(replaceStyles).map(function(item) {
        return item.name();
    });
    var replaceStylesView = ui.popupButton(replaceStylesNames);
    dialog.addView(replaceStylesView);

    // Actions
    findStyleView.setCOSJSTargetFunction(function(sender) {
        replaceStyles = getStyleFromDocumentOrLibrary_except(
            type,
            replaceToLibraries.objectAtIndex(replaceLibraryView.indexOfSelectedItem()),
            styles.objectAtIndex(sender.indexOfSelectedItem())
        );
        // replaceStyles.removeObject();
        replaceStylesNames = toArray(replaceStyles).map(function(item) {
            return item.name();
        });
        ui.setItems_forPopupButton(replaceStylesNames, replaceStylesView);
    });

    replaceLibraryView.setCOSJSTargetFunction(function(sender) {
        replaceStyles = getStyleFromDocumentOrLibrary_except(
            type,
            replaceToLibraries.objectAtIndex(sender.indexOfSelectedItem()),
            styles.objectAtIndex(findStyleView.indexOfSelectedItem())
        );
        // replaceStyles.removeObject(styles.objectAtIndex(findStyleView.indexOfSelectedItem()));
        replaceStylesNames = toArray(replaceStyles).map(function(item) {
            return item.name();
        });
        ui.setItems_forPopupButton(replaceStylesNames, replaceStylesView);
    });
    dialog.run();

};

function getStyleFromDocumentOrLibrary_except(type, document, style) {
    var styles = NSMutableArray.alloc().init();
    var documentData;
    if (document.class() == "MSDocumentData") {
        documentData = document;
    }
    if (document.class() == "MSRemoteAssetLibrary" || document.class() == "MSUserAssetLibrary") {
        documentData = document.document();
    }
    var sortDescriptorByName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    if (type == "text") {
        styles.addObjectsFromArray(documentData.layerTextStyles().sharedStyles().sortedArrayUsingDescriptors([sortDescriptorByName]));
    }
    if (type == "layer") {
        styles.addObjectsFromArray(documentData.layerStyles().sharedStyles().sortedArrayUsingDescriptors([sortDescriptorByName]));
    }
    // if (style.isForeign()) {
    //     styles.removeObject(style.foreignObject().masterFromLibrary(document));
    // } else {
    //     styles.removeObject(style);
    // }
    return styles;
}