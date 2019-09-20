var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");

    var document = context.document;
    if (MSApplicationMetadata.metadata().appVersion < 53) {
        document.showMessage("This feature only works in Sketch 53+.");
        return;
    }

    var selection = context.selection;
    var documentData = document.documentData();

    var dialogMessage;
    var instances;
    if (selection.count() == 0) {
        dialogMessage = "Find an override symbol from document, and replace with another."
        instances = symbolInstancesInDocument(context);
        if (instances.count() == 0) {
            document.showMessage("No instances in selected layers.");
            return;
        }
    } else {
        dialogMessage = "Find an override symbol from selected layers, and replace with another."
        instances = symbolInstancesInSelection(context);
        if (instances.count() == 0) {
            document.showMessage("No instances in document.");
            return;
        }
    }

    var uniqueOverrideValues = NSMutableArray.alloc().init();
    var changeableOverridePoints = NSMutableArray.alloc().init();

    instances.forEach(function(instance) {
        MSAvailableOverride.flattenAvailableOverrides(instance.availableOverrides()).forEach(function(override) {
            if (override.isEditable() && override.overridePoint().isSymbolOverride()) {
                var symbolID = override.currentValue() == "" ? override.defaultValue() : override.currentValue();
                changeableOverridePoints.addObject({
                    "layer": instance,
                    "point": override.overridePoint(),
                    "value": symbolID
                });
                if (!uniqueOverrideValues.containsObject(symbolID)) {
                    uniqueOverrideValues.addObject(symbolID);
                }
            }
        });
    });

    if (changeableOverridePoints.count() == 0) {
        document.showMessage("No symbol overrides.");
        return;
    }

    // log(changeableOverridePoints)
    // log(uniqueOverrideValues)

    // Dialog
    var dialog = new Dialog(
        "Replace Override Symbol",
        dialogMessage,
        300,
        ["Replace", "Cancel"]
    );

    // Find
    var findLabel = ui.textLabel("Find");
    dialog.addView(findLabel);

    var overrideSymbolsButton = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 300, 30));
    uniqueOverrideValues.forEach(function(symbolID) {
        var menuItem = NSMenuItem.alloc().init();
        var symbolMaster = documentData.symbolWithID(symbolID);
        if (symbolMaster) {
            var title = symbolMaster.name();
            if (symbolMaster.isForeign()) {
                title = symbolMaster.foreignObject().sourceLibraryName() + " ▶︎ " + symbolMaster.name();
            }
            menuItem.setTitle(title);
            var menuImage = preview.symbol(symbolMaster, 20);
            menuItem.setImage(menuImage);
            overrideSymbolsButton.menu().addItem(menuItem);
        }
    });
    dialog.addView(overrideSymbolsButton);

    // Replace
    var replaceLabel = ui.textLabel("Replace to");
    dialog.addView(replaceLabel);

    var replaceOverrideButton = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, 0, 300, 30));
    dialog.addView(replaceOverrideButton);

    // Replace symbols
    var currentOverrideSymbolID = uniqueOverrideValues.objectAtIndex(overrideSymbolsButton.indexOfSelectedItem());
    var currentOverrideSymbol = documentData.symbolWithID(currentOverrideSymbolID);
    var replaceSymbols = sameSizeSymbols(context, currentOverrideSymbol.rect().size);
    loadReplaceSymbols(replaceOverrideButton, replaceSymbols);

    overrideSymbolsButton.setCOSJSTargetFunction(function(sender) {
        currentOverrideSymbolID = uniqueOverrideValues.objectAtIndex(sender.indexOfSelectedItem());
        currentOverrideSymbol = documentData.symbolWithID(currentOverrideSymbolID);
        replaceSymbols = sameSizeSymbols(context, currentOverrideSymbol.rect().size);
        loadReplaceSymbols(replaceOverrideButton, replaceSymbols);
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var loopOverridePoints = changeableOverridePoints.objectEnumerator();
        var item;
        while (item = loopOverridePoints.nextObject()) {
            if (item.value == currentOverrideSymbolID) {
                var instance = item.layer;
                var overridePoint = item.point;
                var overrideValue = "";
                if (replaceOverrideButton.indexOfSelectedItem() > 0) {
                    var replaceSymbol = replaceSymbols.objectAtIndex(replaceOverrideButton.indexOfSelectedItem() - 1);
                    if (replaceSymbol.library.class() == "MSDocument") {
                        overrideValue = replaceSymbol.symbol.symbolID();
                    } else {
                        var predicate = NSPredicate.predicateWithFormat("remoteSymbolID == %@", replaceSymbol.symbol.symbolID());
                        var matchForeignSymbol = documentData.foreignSymbols().filteredArrayUsingPredicate(predicate);
                        if (matchForeignSymbol.count() > 0) {
                            overrideValue = matchForeignSymbol.firstObject().symbolMaster().symbolID();
                        } else {
                            // Import symbol from library
                            var library = replaceSymbol.library;
                            var importedSymbol;
                            var assetLibraryController = AppController.sharedInstance().librariesController();
                            
                            var shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(
                                library.document().symbolWithID(replaceSymbol.symbol.symbolID()),
                                library
                            );
                            importedSymbol = assetLibraryController.importShareableObjectReference_intoDocument(
                                shareableObjectReference,
                                documentData
                            );
                            
                            overrideValue = importedSymbol.symbolMaster().symbolID();
                        }
                    }
                }
                instance.setValue_forOverridePoint(overrideValue, overridePoint);
            }
        }

        document.reloadInspector();

    }
}

function loadReplaceSymbols(popupButton, data) {

    var preview = require("../modules/Preview");
    popupButton.removeAllItems();

    var menuItemNone = NSMenuItem.alloc().init();
    menuItemNone.setTitle("None");
    popupButton.menu().addItem(menuItemNone);

    var loopData = data.objectEnumerator();
    var item;
    while (item = loopData.nextObject()) {
        var menuItem = NSMenuItem.alloc().init();
        var menuTitle;
        if (item.library.class() == "MSDocument") {
            menuTitle = "Document" + " ▶︎ " + item.symbol.name();
        } else {
            menuTitle = item.library.name() + " ▶︎ " + item.symbol.name();
        }
        menuItem.setTitle(menuTitle);
        var menuImage = preview.symbol(item.symbol, 20);
        menuItem.setImage(menuImage);
        popupButton.menu().addItem(menuItem);
    }
}

function sameSizeSymbols(context, size) {
    var symbols = NSMutableArray.alloc().init();

    var sortDescriptorName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    var sortDescriptorSymbolName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "symbol.name", true, "localizedStandardCompare:"
    );

    // local symbols
    var document = context.document;
    var documentData = document.documentData();
    var sameSizelocalSymbols = NSMutableArray.alloc().init();
    var loopLocalSymbols = documentData.localSymbols().objectEnumerator();
    var localSymbol;
    while (localSymbol = loopLocalSymbols.nextObject()) {
        if (NSEqualSizes(localSymbol.rect().size, size)) {
            sameSizelocalSymbols.addObject({
                "library": document,
                "symbol": localSymbol
            });
        }
    }
    symbols.addObjectsFromArray(sameSizelocalSymbols.sortedArrayUsingDescriptors([sortDescriptorSymbolName]));

    // library symbols
    var assetLibraryController = AppController.sharedInstance().librariesController();
    var libraries = assetLibraryController.availableLibraries().mutableCopy().sortedArrayUsingDescriptors([sortDescriptorName]);
    var loopLibrary = libraries.objectEnumerator();
    var library;
    while (library = loopLibrary.nextObject()) {
        var sameSizeLibrarySymbols = NSMutableArray.alloc().init();
        var loopLibraryLocalSymbols = library.document().localSymbols().objectEnumerator();
        var libraryLocalSymbol;
        while (libraryLocalSymbol = loopLibraryLocalSymbols.nextObject()) {
            if (NSEqualSizes(libraryLocalSymbol.rect().size, size)) {
                sameSizeLibrarySymbols.addObject({
                    "library": library,
                    "symbol": libraryLocalSymbol
                });
            }
        }
        symbols.addObjectsFromArray(sameSizeLibrarySymbols.sortedArrayUsingDescriptors([sortDescriptorSymbolName]));
    }

    return symbols;
}

function symbolInstancesInSelection(context) {
    var allInstances = NSMutableArray.alloc().init();
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    var loopSelection = context.selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {
        var instances = layer.children().filteredArrayUsingPredicate(predicate);
        allInstances.addObjectsFromArray(instances);
    }
    return allInstances;
}

function symbolInstancesInDocument(context) {
    var allInstances = NSMutableArray.alloc().init();
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    var loopPages = context.document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var instancesInPage = page.children().filteredArrayUsingPredicate(predicate);
        allInstances.addObjectsFromArray(instancesInPage);
    }
    return allInstances;
}
