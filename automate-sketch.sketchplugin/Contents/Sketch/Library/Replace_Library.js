var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var toast = require("sketch/ui").message;

    var document = context.document;
    var documentData = document.documentData();

    // Libraries
    var assetLibraryController = AppController.sharedInstance().librariesController();
    var allLibraries = assetLibraryController.libraries();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    allLibraries = allLibraries.sortedArrayUsingDescriptors([sortDescriptor]);

    if (allLibraries.count() == 0) {
        toast('These are no libraries in "Preferences" - "Libraries".')
        return;
    }

    var allLibrariesNames = util.toArray(allLibraries).map(function(item) {
        return item.name() + (item.status() == 1 ? " (Disabled)" : "");
    });

    // All libraries of imported symbols
    var librariesOfImportedSymbol = [];
    var libraryNamesOfImportedSymbol = [];
    var importedSymbols = documentData.foreignSymbols();
    importedSymbols.forEach(function(symbol) {
        var libraryOfSymbol = assetLibraryController.libraryForShareableObject(symbol.symbolMaster());
        if (libraryOfSymbol && !librariesOfImportedSymbol.includes(libraryOfSymbol)) {
            librariesOfImportedSymbol.push(libraryOfSymbol);
            libraryNamesOfImportedSymbol.push(libraryOfSymbol.name());
        }
    });

    // All libraries of imported text style
    var librariesOfImportedTextStyle = [];
    var libraryNamesOfImportedTextStyle = [];
    var importedTextStyle = documentData.foreignTextStyles();
    importedTextStyle.forEach(function(style) {
        var libraryOfTextStyle = assetLibraryController.libraryForShareableObject(style.localSharedStyle());
        if (libraryOfTextStyle && !librariesOfImportedTextStyle.includes(libraryOfTextStyle)) {
            librariesOfImportedTextStyle.push(libraryOfTextStyle);
            libraryNamesOfImportedTextStyle.push(libraryOfTextStyle.name());
        }
    });

    // All libraries of imported layer style
    var librariesOfImportedLayerStyle = [];
    var libraryNamesOfImportedLayerStyle = [];
    var importedLayerStyle = documentData.foreignLayerStyles();
    importedLayerStyle.forEach(function(style) {
        var libraryOfLayerStyle = assetLibraryController.libraryForShareableObject(style.localSharedStyle());
        if (libraryOfLayerStyle && !librariesOfImportedLayerStyle.includes(libraryOfLayerStyle)) {
            librariesOfImportedLayerStyle.push(libraryOfLayerStyle);
            libraryNamesOfImportedLayerStyle.push(libraryOfLayerStyle.name());
        }
    });

    // Dialog
    var dialog = new Dialog(
        "Replace Library",
        "Change the library of imported symbols, styles to anther library."
    );

    dialog.addLabel("Apply to");

    var applyToView = ui.popupButton([
        "Imported Symbols",
        "Imported Text Styles",
        "Imported Layer Styles"
    ]);
    dialog.addView(applyToView);

    dialog.addLabel("Libraries of Imported Objects");

    var librariesUsedView = ui.popupButton(libraryNamesOfImportedSymbol);
    dialog.addView(librariesUsedView);

    dialog.addLabel("Replace to Library");

    var libraryReplaceView = ui.popupButton(allLibrariesNames);
    dialog.addView(libraryReplaceView);

    // Actions
    applyToView.setCOSJSTargetFunction(function(sender) {
        var selectedIndex = sender.indexOfSelectedItem();
        if (selectedIndex == 0) {
            ui.setItems_forPopupButton(libraryNamesOfImportedSymbol, librariesUsedView);
        }
        if (selectedIndex == 1) {
            ui.setItems_forPopupButton(libraryNamesOfImportedTextStyle, librariesUsedView);
        }
        if (selectedIndex == 2) {
            ui.setItems_forPopupButton(libraryNamesOfImportedLayerStyle, librariesUsedView);
        }
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        if (librariesUsedView.numberOfItems() == 0) {
            toast("Not any imported object.");
            return;
        }

        var librariesUsedViewIndex = librariesUsedView.indexOfSelectedItem();
        var toLibrary = allLibraries.objectAtIndex(libraryReplaceView.indexOfSelectedItem());
        var fromLibrary;

        // Symbol
        var count;
        if (applyToView.indexOfSelectedItem() == 0) {
            count = 0;
            fromLibrary = librariesOfImportedSymbol[librariesUsedViewIndex];
            importedSymbols.forEach(function(symbol) {
                if (symbol.libraryID() == fromLibrary.libraryID() && symbol.sourceLibraryName() == fromLibrary.name()) {
                    symbol.setLibraryID(toLibrary.libraryID());
                    symbol.setSourceLibraryName(toLibrary.name());
                    count ++;
                }
            });
            toast(`Replace ${count} symbol` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name()}" to "${toLibrary.name()}".`);
        // Text style
        } else if (applyToView.indexOfSelectedItem() == 1) {
            count = 0;
            fromLibrary = librariesOfImportedTextStyle[librariesUsedViewIndex];
            importedTextStyle.forEach(function(style) {
                if (style.libraryID() == fromLibrary.libraryID() && style.sourceLibraryName() == fromLibrary.name()) {
                    style.setLibraryID(toLibrary.libraryID());
                    style.setSourceLibraryName(toLibrary.name());
                    count ++;
                }
            });
            toast(`Replace ${count} text style` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name()}" to "${toLibrary.name()}".`);
        // Layer style
        } else if (applyToView.indexOfSelectedItem() == 2) {
            count = 0;
            fromLibrary = librariesOfImportedLayerStyle[librariesUsedViewIndex];
            importedLayerStyle.forEach(function(style) {
                if (style.libraryID() == fromLibrary.libraryID() && style.sourceLibraryName() == fromLibrary.name()) {
                    style.setLibraryID(toLibrary.libraryID());
                    style.setSourceLibraryName(toLibrary.name());
                    count ++;
                }
            });
            toast(`Replace ${count} layer style` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name()}" to "${toLibrary.name()}".`);
        }

    }

};
