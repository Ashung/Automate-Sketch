var onRun = function(context) {
    
    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var sketch = require("sketch/dom");
    var toast = require("sketch/ui").message;
    var document = sketch.getSelectedDocument();

    var libraries = sketch.getLibraries().filter(function(library) {
        return library.valid && library.enabled;
    });
    if (libraries.length == 0) {
        toast('These are no valid library in "Preferences" - "Libraries".');
        return;
    }
    libraries.sort(function(a, b) {
        return a.name > b.name;
    });
    var allLibrariesNames = libraries.map(function(item) {
        return item.name;
    });

    // All libraries of imported symbols
    var librariesOfImportedSymbol = [];
    var librariesOfImportedSymbolKeys = [];
    document.getSymbols().forEach(function(item) {
        if (item.getLibrary() && !librariesOfImportedSymbolKeys.includes(item.getLibrary().id + '-' + item.getLibrary().name)) {
            librariesOfImportedSymbol.push(item.getLibrary());
            librariesOfImportedSymbolKeys.push(item.getLibrary().id + '-' + item.getLibrary().name);
        }
    });
    var libraryNamesOfImportedSymbol = librariesOfImportedSymbol.map(function(item) {
        return item.name;
    });

    // All libraries of imported text style
    var librariesOfImportedTextStyle = [];
    var librariesOfImportedTextStyleKeys = [];
    document.sharedTextStyles.forEach(function(item) {
        if (item.getLibrary() && !librariesOfImportedTextStyleKeys.includes(item.getLibrary().id + '-' + item.getLibrary().name)) {
            librariesOfImportedTextStyle.push(item.getLibrary());
            librariesOfImportedTextStyleKeys.push(item.getLibrary().id + '-' + item.getLibrary().name);
        }
    });
    var libraryNamesOfImportedTextStyle = librariesOfImportedTextStyle.map(function(item) {
        return item.name;
    });

    // All libraries of imported layer style
    var librariesOfImportedLayerStyle = [];
    var librariesOfImportedLayerStyleKeys = [];
    document.sharedLayerStyles.forEach(function(item) {
        if (item.getLibrary() && !librariesOfImportedLayerStyleKeys.includes(item.getLibrary().id + '-' + item.getLibrary().name)) {
            librariesOfImportedLayerStyle.push(item.getLibrary());
            librariesOfImportedLayerStyleKeys.push(item.getLibrary().id + '-' + item.getLibrary().name);
        }
    });
    var libraryNamesOfImportedLayerStyle = librariesOfImportedLayerStyle.map(function(item) {
        return item.name;
    });


    // Dialog
    var dialog = new Dialog(
        "Replace Library",
        "Force change the library of imported symbols, styles to anther library, the appearance do not changed."
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
            toast("Not any " + applyToView.titleOfSelectedItem() + ".");
            return;
        }

        var toLibrary = libraries[libraryReplaceView.indexOfSelectedItem()];
        var fromLibrary;

        // Symbol
        var count = 0;
        if (applyToView.indexOfSelectedItem() == 0) {
            fromLibrary = librariesOfImportedSymbol[librariesUsedView.indexOfSelectedItem()];
            document.getSymbols().forEach(function(symbol) {
                if (symbol.getLibrary()) {
                    if (symbol.getLibrary().id == fromLibrary.id && symbol.getLibrary().name == fromLibrary.name) {
                        symbol.sketchObject.foreignObject().setLibraryID(toLibrary.id);
                        symbol.sketchObject.foreignObject().setSourceLibraryName(toLibrary.name);
                        count ++;
                    }
                }
            });
            toast(`Replace ${count} symbol` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name}" to "${toLibrary.name}".`);
        // Text style
        } else if (applyToView.indexOfSelectedItem() == 1) {
            fromLibrary = librariesOfImportedTextStyle[librariesUsedView.indexOfSelectedItem()];
            document.sharedTextStyles.forEach(function(style) {
                if (style.getLibrary()) {
                    if (style.getLibrary().id == fromLibrary.id && style.getLibrary().name == fromLibrary.name) {
                        style.sketchObject.foreignObject().setLibraryID(toLibrary.id);
                        style.sketchObject.foreignObject().setSourceLibraryName(toLibrary.name);
                        count ++;
                    }
                }
            });
            toast(`Replace ${count} text style` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name}" to "${toLibrary.name}".`);
        // Layer style
        } else if (applyToView.indexOfSelectedItem() == 2) {
            fromLibrary = librariesOfImportedLayerStyle[librariesUsedView.indexOfSelectedItem()];
            document.sharedLayerStyles.forEach(function(style) {
                if (style.getLibrary()) {
                    if (style.getLibrary().id == fromLibrary.id && style.getLibrary().name == fromLibrary.name) {
                        style.sketchObject.foreignObject().setLibraryID(toLibrary.id);
                        style.sketchObject.foreignObject().setSourceLibraryName(toLibrary.name);
                        count ++;
                    }
                }
            });
            toast(`Replace ${count} layer style` + (count > 1 ? "s" : "") + ` from "${fromLibrary.name}" to "${toLibrary.name}".`);
        }
    }
};