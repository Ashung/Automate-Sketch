var sketch = require("sketch");

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");
    
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    if (sketch.version.sketch < 47) {
        document.showMessage("😮 You have to update to Sketch 47+ to use this feature.");
        return;
    }

    var documentData = document.documentData();
    var allImportedSymbols = documentData.foreignSymbols();
    if (allImportedSymbols.count() == 0) {
        document.showMessage("You have no imported symbols.");
        return;
    }

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptor]);
    if (availableLibraries.count() == 0) {
        document.showMessage("You have no available libraries.");
        return;
    }

    // Imported symbols that library file is not found.
    var allImportedSymbolsMissLibrary = allImportedSymbols.mutableCopy();
    var allImportedSymbolsNotFound = allImportedSymbols.mutableCopy();
    var loopAllImportedSymbols = allImportedSymbols.objectEnumerator();
    var importedSymbol;
    while (importedSymbol = loopAllImportedSymbols.nextObject()) {
        if (sketch.version.sketch >= 49) {
            var libraryForSymbol = assetLibraryController.libraryForShareableObject(importedSymbol.symbolMaster());
        } else {
            var libraryForSymbol = assetLibraryController.libraryForSymbol(importedSymbol.symbolMaster());
        }
        if (libraryForSymbol) {
            allImportedSymbolsMissLibrary.removeObject(importedSymbol);
            if (libraryForSymbol.enabled() == false) {
                allImportedSymbolsNotFound.removeObject(importedSymbol);
            }
            if (importedSymbol.masterFromLibrary(libraryForSymbol)) {
                allImportedSymbolsNotFound.removeObject(importedSymbol);
            }
        } else {
            allImportedSymbolsNotFound.removeObject(importedSymbol);
        }
    }

    // Dialog
    var dialog = new Dialog(
        "Imported Symbols Link Manage",
        "Link imported symbols to another library, or fix the 'Library not found' error.",
        500,
        ["Close"]
    );

    var filterView = ui.popupButton([
        "Show all symbols.",
        "Show only symbols that library file is not found.",
        "Show only symbols that symbol is not found in library."
    ]);
    dialog.addView(filterView);

    filterView.setCOSJSTargetFunction(function(sender) {
        if (sender.indexOfSelectedItem() == 1) {
            loadData(scrollView, allImportedSymbolsMissLibrary);
            preferences.set("importedSymbolsLinkManageFilter", "1");
        } else if (sender.indexOfSelectedItem() == 2) {
            loadData(scrollView, allImportedSymbolsNotFound);
            preferences.set("importedSymbolsLinkManageFilter", "2");
        } else {
            loadData(scrollView, allImportedSymbols);
            preferences.set("importedSymbolsLinkManageFilter", "0");
        }
    });

    var scrollView = ui.scrollView([], [500, 400]);
    dialog.addView(scrollView);

    var defaultFilterIndex = preferences.get("importedSymbolsLinkManageFilter") || "0";
    if (defaultFilterIndex == "0") {
        filterView.selectItemAtIndex(0);
        loadData(scrollView, allImportedSymbols);
    } else if (defaultFilterIndex == "1") {
        filterView.selectItemAtIndex(1);
        loadData(scrollView, allImportedSymbolsMissLibrary);
    } else if (defaultFilterIndex == "2") {
        filterView.selectItemAtIndex(2);
        loadData(scrollView, allImportedSymbolsNotFound);
    }

    dialog.run();

};

function loadData(scrollView, symbols) {

    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();

    var contentView = ui.view([0, 0, 500, symbols.count() * 60 + 10]);
    contentView.setFlipped(true);

    var loopImportedSymbols = symbols.objectEnumerator();
    var importedSymbol;
    var i = 0;
    while (importedSymbol = loopImportedSymbols.nextObject()) {

        if (sketch.version.sketch >= 49) {
            var libraryForSymbol = assetLibraryController.libraryForShareableObject(importedSymbol.symbolMaster());
        } else {
            var libraryForSymbol = assetLibraryController.libraryForSymbol(importedSymbol.symbolMaster());
        }
        var sourceLibraryName = importedSymbol.sourceLibraryName();

        // List
        var itemView = ui.view([0, 60 * i, 500, 60]);
        itemView.setFlipped(true);

        // 0: Index symbols
        var indexView = ui.textLabel(i, [0, 0, 0, 0]);
        itemView.addSubview(indexView);

        // Tips
        var tipView = ui.textLabel("", [370, 42, 120, 30]);
        tipView.setFont(NSFont.systemFontOfSize(10));
        tipView.setTextColor(NSColor.redColor());
        itemView.addSubview(tipView);

        // Preview image
        var symbolPreviewImage = preview.symbol(importedSymbol.symbolMaster(), 40);
        var imageView = ui.image(symbolPreviewImage, [10, 10, 40, 40]);
        itemView.addSubview(imageView);

        // Title
        var titleView = ui.textLabel(importedSymbol.symbolMaster().name(), [60, 10, 300, 20]);
        itemView.addSubview(titleView);

        // Library name
        var libraryNameView = ui.textLabel(libraryForSymbol ? libraryForSymbol.name() : sourceLibraryName, [60, 30, 300, 20]);
        libraryNameView.setTextColor(NSColor.grayColor());
        itemView.addSubview(libraryNameView);

        if (!libraryForSymbol) {
            tipView.setStringValue("Library not found.");
        } else {
            if (libraryForSymbol.enabled() == false) {
                tipView.setStringValue("Library is disabled.");
            } else {
                if (!importedSymbol.masterFromLibrary(libraryForSymbol)) {
                    tipView.setStringValue("Symbol not found.");
                }
            }
        }

        // Library list
        var libraryListView = ui.popupButton([], [370, 15, 120, 30]);
        if (!libraryForSymbol) {
            libraryListView.addItemWithTitle("");
            libraryListView.lastItem().setTitle(sourceLibraryName);
        } else {
            if (libraryForSymbol.enabled() == false) {
                libraryListView.addItemWithTitle("");
                libraryListView.lastItem().setTitle(libraryForSymbol.name());
            }
        }
        var loopAvailableLibraries = availableLibraries.objectEnumerator();
        var availableLibrary;
        while (availableLibrary = loopAvailableLibraries.nextObject()) {
            libraryListView.addItemWithTitle("");
            libraryListView.lastItem().setTitle(availableLibrary.name());
        }
        itemView.addSubview(libraryListView);

        if (libraryForSymbol) {
            if (libraryForSymbol.enabled()) {
                libraryListView.selectItemAtIndex(availableLibraries.indexOfObject(libraryForSymbol));
            }
        }

        // Change the libraryID of MSForeignSymbol
        libraryListView.setCOSJSTargetFunction(function(sender) {

            var tipView = sender.superview().subviews().objectAtIndex(1);
            var importedSymbolIndex = parseInt(sender.superview().subviews().objectAtIndex(0).stringValue());
            var importedSymbol = symbols.objectAtIndex(importedSymbolIndex);
            if (sketch.version.sketch >= 49) {
                var originalLibrary = assetLibraryController.libraryForShareableObject(importedSymbol.symbolMaster());
            } else {
                var originalLibrary = assetLibraryController.libraryForSymbol(importedSymbol.symbolMaster());
            }
            var originalLibraryID = importedSymbol.libraryID();
            var originalLibraryName = importedSymbol.sourceLibraryName();

            var selectedLibraryIndex = sender.indexOfSelectedItem();
            if (sender.numberOfItems() == availableLibraries.count()) {
                var finalLibrary = availableLibraries.objectAtIndex(selectedLibraryIndex);
            } else {
                if (selectedLibraryIndex == 0) {
                    var finalLibrary = nil;
                } else {
                    var finalLibrary = availableLibraries.objectAtIndex(selectedLibraryIndex - 1);
                }
            }

            if (finalLibrary) {
                var finalLibraryID = finalLibrary.libraryID();
                var finalLibraryName = finalLibrary.name();
                if (importedSymbol.masterFromLibrary(finalLibrary)) {
                    tipView.setStringValue("");
                } else {
                    tipView.setStringValue("Symbol not found.");
                }
            } else {
                var finalLibraryID = originalLibraryID;
                var finalLibraryName = originalLibraryName;
                if (!originalLibrary) {
                    tipView.setStringValue("Library not found.");
                } else {
                    if (originalLibrary.enabled() == false) {
                        tipView.setStringValue("Library is disabled.");
                    }
                }
            }

            importedSymbol.setLibraryID(finalLibraryID);
            importedSymbol.setSourceLibraryName(finalLibraryName);

        });

        // Divider
        var divider = ui.divider([0, 60 - 1, 500, 1]);
        itemView.addSubview(divider);

        contentView.addSubview(itemView);

        i ++;

    }

    scrollView.setDocumentView(contentView);
}
