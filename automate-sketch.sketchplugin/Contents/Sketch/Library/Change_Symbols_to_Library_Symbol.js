var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var toast = sketch.UI.message;
    var util = require("util");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");

    var greenColor = NSColor.colorWithRed_green_blue_alpha(0, 0.8, 0.3, 1);
    var redColor = NSColor.colorWithRed_green_blue_alpha(0.8, 0.1, 0.1, 1);
    var noColor = NSColor.colorWithRed_green_blue_alpha(0, 0, 0, 0);

    if (sketch.version.sketch < 47) {
        toast("😮 You have to update to Sketch 47+ to use this feature.");
        return;
    }

    var document = context.document;
    var documentData = document.documentData();
    var localSymbols = documentData.localSymbols();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    localSymbols = localSymbols.sortedArrayUsingDescriptors([sortDescriptor]);

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptor]);

    if (availableLibraries.count() == 0) {
        toast("You have no available libraries.");
        return;
    }

    if (localSymbols.count() == 0) {
        toast("Current document has no local symbols.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Change Local Symbols to Library Symbol",
        "Change local symbols to library symbol with same symbol id or name." +
        "\n\nGreen • : Have match symbol in current library, and same properties." +
        "\nRed • : Have match symbol in current library, but different properties.",
        400
    );

    // Choose a library file
    var labelLibrary = ui.textLabel("Choose a library");
    dialog.addView(labelLibrary);
    var libraryNames = util.toArray(availableLibraries).map(function(library) {
        return library.name();
    });
    var selectBoxLibrary = ui.popupButton(libraryNames, 200);
    dialog.addView(selectBoxLibrary);
    
    // Choose id or name
    var labelNameOrId = ui.textLabel("Replace library symbol with same...");
    dialog.addView(labelNameOrId);
    var selectBoxNameOrId = ui.popupButton(["Name", "ID"], 200);
    dialog.addView(selectBoxNameOrId);

    // List all local symbols
    var symbolMastersWillChanged = localSymbols.mutableCopy();
    var selectedItemsCount = symbolMastersWillChanged.count();
    var symbolMasterToLibraryDict = {};

    var labelSymbols = ui.textLabel("Local Symbols");
    dialog.addView(labelSymbols);

    var selectAllSymbol = ui.checkBox(true, "Select / Deselect all symbols.");
    selectAllSymbol.setAllowsMixedState(true);
    dialog.addView(selectAllSymbol);

    var views = [];
    util.toArray(localSymbols).forEach(function(symbol) {
        var wrapper = ui.view([400, 70]);
        var imageSymbol = ui.imageButton(preview.symbol(symbol, 50), [28, 10, 50, 50]);
        var checkBoxSymbol = ui.checkBox(true, "                   " + symbol.name(), [5, 10, 380, 50]);
        
        // Add status view
        var status = ui.circle("#00000000", [82, 32, 6, 6]);
        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());
        var matchLibrarySymbol;
        if (selectBoxNameOrId.indexOfSelectedItem() == 0) {
            matchLibrarySymbol = findSymbolByName_fromLibrary(symbol.name(), selectedLibrary);
        } else {
            matchLibrarySymbol = findSymbolByID_fromLibrary(symbol.symbolID(), selectedLibrary);
        }
        if (matchLibrarySymbol) {
            symbolMasterToLibraryDict["" + symbol.symbolID()] = matchLibrarySymbol;
            if (diffSymbols(symbol, matchLibrarySymbol)) {
                status.setBackgroundColor(greenColor);
            } else {
                status.setBackgroundColor(redColor);
            }
        }

        wrapper.addSubview(checkBoxSymbol);
        wrapper.addSubview(imageSymbol);
        wrapper.addSubview(status);
        views.push(wrapper);

        checkBoxSymbol.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                selectedItemsCount --;
                symbolMastersWillChanged.removeObject(symbol);
            }
            if (sender.state() == NSOnState) {
                selectedItemsCount ++;
                symbolMastersWillChanged.addObject(symbol);
            }
            if (selectedItemsCount == localSymbols.count()) {
                selectAllSymbol.setState(NSOnState);
            } else if (selectedItemsCount == 0) {
                selectAllSymbol.setState(NSOffState);
            } else {
                selectAllSymbol.setState(NSMixedState);
            }
        });
        imageSymbol.setCOSJSTargetFunction(function(sender) {
            var checkBox = sender.superview().subviews().firstObject();
            checkBox.setState(checkBox.state() == NSOnState ? NSOffState : NSOnState);
            if (checkBox.state() == NSOffState) {
                selectedItemsCount --;
                symbolMastersWillChanged.removeObject(symbol);
            }
            if (checkBox.state() == NSOnState) {
                selectedItemsCount ++;
                symbolMastersWillChanged.addObject(symbol);
            }
            if (selectedItemsCount == localSymbols.count()) {
                selectAllSymbol.setState(NSOnState);
            } else if (selectedItemsCount == 0) {
                selectAllSymbol.setState(NSOffState);
            } else {
                selectAllSymbol.setState(NSMixedState);
            }
        });
    });
    var scrollView = ui.scrollView(views, [400, 300]);
    dialog.addView(scrollView);

    // Reset to original size
    var checkboxSize = ui.checkBox(false, "Set all instances to original size.");
    dialog.addView(checkboxSize);

    // Actions
    selectAllSymbol.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            selectedItemsCount = localSymbols.count();
            symbolMastersWillChanged = localSymbols.mutableCopy();
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOnState);
            });
        } else {
            selectedItemsCount = 0;
            symbolMastersWillChanged.removeAllObjects();
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOffState);
            });
        }
    });

    selectBoxLibrary.setCOSJSTargetFunction(function(sender) {
        symbolMasterToLibraryDict = {};
        var selectedLibrary = availableLibraries.objectAtIndex(sender.indexOfSelectedItem());
        util.toArray(localSymbols).forEach(function(symbol, index) {
            var matchLibrarySymbol;
            if (selectBoxNameOrId.indexOfSelectedItem() == 0) {
                matchLibrarySymbol = findSymbolByName_fromLibrary(symbol.name(), selectedLibrary);
            } else {
                matchLibrarySymbol = findSymbolByID_fromLibrary(symbol.symbolID(), selectedLibrary);
            }
            var status = scrollView.documentView().subviews().objectAtIndex(index).subviews().objectAtIndex(2);
            if (matchLibrarySymbol) {
                symbolMasterToLibraryDict["" + symbol.symbolID()] = matchLibrarySymbol;
                if (diffSymbols(symbol, matchLibrarySymbol)) {
                    status.setBackgroundColor(greenColor);
                } else {
                    status.setBackgroundColor(redColor);
                }
            } else {
                status.setBackgroundColor(noColor);
            }
        });
    });

    selectBoxNameOrId.setCOSJSTargetFunction(function(sender) {
        symbolMasterToLibraryDict = {};
        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());
        util.toArray(localSymbols).forEach(function(symbol, index) {
            var matchLibrarySymbol;
            if (sender.indexOfSelectedItem() == 0) {
                matchLibrarySymbol = findSymbolByName_fromLibrary(symbol.name(), selectedLibrary);
            } else {
                matchLibrarySymbol = findSymbolByID_fromLibrary(symbol.symbolID(), selectedLibrary);
            }
            var status = scrollView.documentView().subviews().objectAtIndex(index).subviews().objectAtIndex(2);
            if (matchLibrarySymbol) {
                symbolMasterToLibraryDict["" + symbol.symbolID()] = matchLibrarySymbol;
                if (diffSymbols(symbol, matchLibrarySymbol)) {
                    status.setBackgroundColor(greenColor);
                } else {
                    status.setBackgroundColor(redColor);
                }
            } else {
                status.setBackgroundColor(noColor);
            }
        });
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());

        if (Object.keys(symbolMasterToLibraryDict).length == 0) {
            toast('Library "' + selectedLibrary.name() + '" not have match symbols.');
            return;
        }

        // Import symbol from library
        var countSymbol = 0;
        var countInstance = 0;
        var symbolIDMap = NSMutableDictionary.alloc().init();
        var loopSymbolMastersWillChanged = symbolMastersWillChanged.objectEnumerator();
        var symbolMaster;
        while (symbolMaster = loopSymbolMastersWillChanged.nextObject()) {

            var remoteSymbol = symbolMasterToLibraryDict["" + symbolMaster.symbolID()];
            if (remoteSymbol) {

                // Import symbol
                var importedSymbol;
                if (sketch.version.sketch >= 50) {
                    var shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(
                        remoteSymbol, selectedLibrary
                    );
                    importedSymbol = assetLibraryController.importShareableObjectReference_intoDocument(
                        shareableObjectReference, documentData
                    );
                } else {
                    importedSymbol = assetLibraryController.importForeignSymbol_fromLibrary_intoDocument(
                        remoteSymbol, selectedLibrary, documentData
                    );
                }

                // Replace all instances of symbolMaster
                var instancesWillReplaced = symbolMaster.allInstances();
                var loopInstancesWillReplaced = instancesWillReplaced.objectEnumerator();
                var instanceWillReplaced;
                while (instanceWillReplaced = loopInstancesWillReplaced.nextObject()) {
                    instanceWillReplaced.changeInstanceToSymbol(importedSymbol.symbolMaster());
                    instanceWillReplaced.setName(instanceWillReplaced.symbolMaster().name());
                    if (checkboxSize.state()) {
                        instanceWillReplaced.resetSizeToMaster();
                    }
                    countInstance ++;
                }

                // Delete symbolMaster
                symbolMaster.removeFromParent();
                countSymbol ++;

                // Symbol ID map
                symbolIDMap.setObject_forKey(importedSymbol.symbolMaster().symbolID(), symbolMaster.symbolID());

            }
        }

        // Change overrides mapping
        if (countInstance > 0) {
            var instancesInCurrentDocument = instancesInDocument(document);
            var loopInstancesInCurrentDocument = instancesInCurrentDocument.objectEnumerator();
            var instance;
            while (instance = loopInstancesInCurrentDocument.nextObject()) {
                instance.updateOverridesWithObjectIDMap(symbolIDMap);
            }
            document.reloadInspector();
        }

        var message;
        if (countSymbol > 1) {
            message = countSymbol + " symbol masters changed to library symbol.";
        } else if (countSymbol == 1) {
            message = "1 symbol master changed to library symbol.";
        } else {
            message = "No symbol masters changed to library symbol.";
        }
        toast(message);
    };

};

function instancesInDocument(document) {
    var allInstances = NSMutableArray.alloc().init();
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var instancesInPage = page.children().filteredArrayUsingPredicate(predicate);
        allInstances.addObjectsFromArray(instancesInPage);
    }
    return allInstances;
}

function findSymbolByID_fromLibrary(id, library) {
    return library.document().symbolWithID(id);
}

function findSymbolByName_fromLibrary(name, library) {
    var predicate = NSPredicate.predicateWithFormat("name == %@", name);
    var symbols = library.document().localSymbols().filteredArrayUsingPredicate(predicate);
    return symbols.firstObject();
}

function diffSymbols(symbol1, symbol2) {
    if (symbol1.layers().count() == symbol2.layers().count()) {
        var diff = [];
        symbol1.layers().forEach(function(layer, index) {
            diff.push(layer.propertiesAreEqual_forPurpose(symbol2.layers().objectAtIndex(index), 1));
        });
        return diff.every(function(item) {
            return item == true;
        });
    } else {
        return false;
    }
}