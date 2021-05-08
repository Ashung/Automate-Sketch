var sketch = require("sketch");

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var document = context.document;
    var documentData = document.documentData();

    if (sketch.version.sketch < 47) {
        document.showMessage("😮 You have to update to Sketch 47+ to use thie feature.");
        return;
    }

    var selection = context.selection;
    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptor]);

    if (documentData.localSymbols().count() == 0) {
        document.showMessage("Current document has no local symbols.");
        return;
    }

    if (availableLibraries.count() == 0) {
        document.showMessage("You have no available libraries.");
        return;
    }

    if (selection.count() == 0) {
        document.showMessage("Please select 1 symbol.");
        return;
    }

    var selectedSymbol;
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {
        if (layer.class() == "MSSymbolInstance") {
            if (!layer.symbolMaster().isForeign()) {
                selectedSymbol = layer.symbolMaster();
                break;
            }
        }
        if (layer.class() == "MSSymbolMaster") {
            selectedSymbol = layer;
            break;
        }
    }

    if (!selectedSymbol) {
        document.showMessage("You have not selected any local symbols.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Replace Symbol With Library Symbol",
        "You currently selected the symbol master named \"" + selectedSymbol.name() +"\".",
        500,
        ["Cancel"]
    );

    dialog.addLabel("Choose A Library:");

    var availableLibraryNames = util.toArray(availableLibraries).map(function(item) {
        return item.name();
    });
    var selectBox = ui.popupButton(availableLibraryNames);
    dialog.addView(selectBox);

    dialog.addLabel("All Symbols:");

    var scrollView = ui.scrollView([], [500, 400]);
    dialog.addView(scrollView);

    var checkboxSize = ui.checkBox(false, "After replace with library symbols, set all instances to original size.");
    dialog.addView(checkboxSize);

    var selectedLibrary = availableLibraries.firstObject();
    reloadSymbolData(context, scrollView, selectedSymbol, selectedLibrary, checkboxSize);

    selectBox.setCOSJSTargetFunction(function(sender) {
        var i = sender.indexOfSelectedItem();
        var selectedLibrary = availableLibraries.objectAtIndex(i);
        reloadSymbolData(context, scrollView, selectedSymbol, selectedLibrary, checkboxSize);
    });

    dialog.run();

};

function reloadSymbolData(context, view, symbol, library, checkboxSize) {

    var originalSymbolID = symbol.symbolID();

    var document = context.document;
    var documentData = document.documentData();

    var allSymbols = library.document().allSymbols().mutableCopy();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    allSymbols = allSymbols.sortedArrayUsingDescriptors([sortDescriptor]).mutableCopy();

    var symbolWithSameID = library.document().symbolWithID(originalSymbolID);
    var symbolsWithSameName = NSMutableArray.alloc().init();
    var symbolsWithSameSize = NSMutableArray.alloc().init();
    var loopAllSymbols_1 = allSymbols.objectEnumerator();
    var symbol_1;
    while (symbol_1 = loopAllSymbols_1.nextObject()) {
        if (NSEqualSizes(symbol_1.rect().size, symbol.rect().size)) {
            symbolsWithSameSize.addObject(symbol_1);
        }
        if (symbol_1.name() == symbol.name()) {
            symbolsWithSameName.addObject(symbol_1);
        }
    }

    if (symbolsWithSameSize.count() > 0) {
        allSymbols.removeObjectsInArray(symbolsWithSameSize);
        var indexes = NSIndexSet.alloc().initWithIndexesInRange(NSMakeRange(0, symbolsWithSameSize.count()));
        allSymbols.insertObjects_atIndexes(symbolsWithSameSize, indexes);
    }

    if (symbolsWithSameName.count() > 0) {
        allSymbols.removeObjectsInArray(symbolsWithSameName);
        var indexes = NSIndexSet.alloc().initWithIndexesInRange(NSMakeRange(0, symbolsWithSameName.count()));
        allSymbols.insertObjects_atIndexes(symbolsWithSameName, indexes);
    }

    if (symbolWithSameID) {
        allSymbols.removeObject(symbolWithSameID);
        allSymbols.insertObject_atIndex(symbolWithSameID, 0);
    }

    var viewWidth = 500;
    var itemHeight = 50;
    var itemsCount = allSymbols.count();
    var contentView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, itemsCount * itemHeight + 10));
    contentView.setFlipped(true);

    var loopAllSymbols_2 = allSymbols.objectEnumerator();
    var symbol_2;
    while (symbol_2 = loopAllSymbols_2.nextObject()) {

        var index = allSymbols.indexOfObject(symbol_2);
        var itemView = NSView.alloc().initWithFrame(NSMakeRect(0, itemHeight * index, viewWidth, itemHeight));
        itemView.setFlipped(true);

        // Symbol ID
        var symbolIDView = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 0, 0));
        symbolIDView.setStringValue(symbol_2.symbolID());
        itemView.addSubview(symbolIDView);

        // Preview image
        var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(5, 5, itemHeight - 10, itemHeight - 10));
        var layerAncestry = symbol_2.ancestry();
        var symbolPreviewImage = MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
            layerAncestry, CGSizeMake((itemHeight - 10) * 2, (itemHeight - 10) * 2), NSColorSpace.sRGBColorSpace(), false
        );
        imageView.setImage(symbolPreviewImage);
        itemView.addSubview(imageView);

        // Symbol Name
        var textLabelName = NSTextField.alloc().initWithFrame(NSMakeRect(itemHeight, 8, viewWidth - itemHeight - 90, 20));
        textLabelName.setStringValue(symbol_2.name());
        textLabelName.setFont(NSFont.systemFontOfSize(12));
        textLabelName.setBezeled(false);
        textLabelName.setEditable(false);
        itemView.addSubview(textLabelName);

        // Tip
        var textLabelNote = NSTextField.alloc().initWithFrame(NSMakeRect(itemHeight, 28, 200, 20));
        textLabelNote.setFont(NSFont.systemFontOfSize(9));
        textLabelNote.setTextColor(NSColor.grayColor());
        textLabelNote.setBezeled(false);
        textLabelNote.setEditable(false);
        var tipTexts = [];
        if (symbol_2.symbolID().isEqualToString(originalSymbolID)) {
            tipTexts.push("Same ID");
        }
        if (symbolsWithSameName.containsObject(symbol_2)) {
            tipTexts.push("Same Name");
        }
        if (symbolsWithSameSize.containsObject(symbol_2)) {
            tipTexts.push("Same Size");
        }
        textLabelNote.setStringValue(tipTexts.join(", "));
        textLabelNote.sizeToFit();
        itemView.addSubview(textLabelNote);

        // Button
        var replaceButton = NSButton.alloc().initWithFrame(NSMakeRect(viewWidth - 90, (itemHeight - 30)/2, 80, 30));
        replaceButton.setBezelStyle(NSRoundedBezelStyle);
        replaceButton.setTitle("Replace");
        replaceButton.setCOSJSTargetFunction(function(sender) {

            // Import symbol
            var assetLibraryController = AppController.sharedInstance().librariesController();
            var importedSymbolID = sender.superview().subviews().firstObject().stringValue();

            // Remove exist imported symbol with same remoteSymbolID
            var foreignSymbolID;
            var foreignSymbols = documentData.foreignSymbols().objectEnumerator();
            var foreignSymbol;
            while (foreignSymbol = foreignSymbols.nextObject()) {
                if (foreignSymbol.remoteSymbolID().isEqualToString(importedSymbolID)) {
                    documentData.removeForeignSymbol(foreignSymbol);
                    foreignSymbolID = foreignSymbol.symbolMaster().symbolID();
                }
            }

            if (sketch.version.sketch >= 50) {
                var shareableObjectReference = MSShareableObjectReference.referenceForShareableObject_inLibrary(
                    library.document().symbolWithID(importedSymbolID),
                    library
                );
                var importedSymbol = assetLibraryController.importShareableObjectReference_intoDocument(
                    shareableObjectReference,
                    documentData
                );
            } else {
                var importedSymbol = assetLibraryController.importForeignSymbol_fromLibrary_intoDocument(
                    library.document().symbolWithID(importedSymbolID), library, documentData
                );
            }

            if (foreignSymbolID) {
                importedSymbol.symbolMaster().setSymbolID(foreignSymbolID);
            }

            if (importedSymbol.isOutOfDateWithLibrary(library)) {
                importedSymbol.syncWithMaster(library.document().symbolWithID(importedSymbolID));
            }

            // Replace all instances of symbol master
            var instancesWillReplaced = symbol.allInstances();
            var loopInstancesWillReplaced = instancesWillReplaced.objectEnumerator();
            var instanceWillReplaced;
            while (instanceWillReplaced = loopInstancesWillReplaced.nextObject()) {
                instanceWillReplaced.changeInstanceToSymbol(importedSymbol.symbolMaster());
            }

            // Symbol ID map
            var symbolIDMap = NSMutableDictionary.alloc().init();
            symbolIDMap.setObject_forKey(importedSymbol.symbolMaster().symbolID(), originalSymbolID);

            // Delete symbolMaster
            symbol.removeFromParent();

            // Change overrides mapping
            var instancesInCurrentDocument = instancesInDocument(document);
            var loopInstancesInCurrentDocument = instancesInCurrentDocument.objectEnumerator();
            var instance;
            while (instance = loopInstancesInCurrentDocument.nextObject()) {
                instance.updateOverridesWithObjectIDMap(symbolIDMap);
                if (instance.symbolMaster() == importedSymbol.symbolMaster()) {
                    instance.setName(instance.symbolMaster().name());
                    if (checkboxSize.state()) {
                        instance.resetSizeToMaster();
                    }
                }
            }
            document.reloadInspector();

            NSApp.stopModal();
        });
        itemView.addSubview(replaceButton);

        // Divide line
        var divider = NSView.alloc().initWithFrame(NSMakeRect(0, itemHeight - 1, 500, 1));
        divider.setWantsLayer(1);
        divider.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
        itemView.addSubview(divider);

        contentView.addSubview(itemView);
    }

    view.setDocumentView(contentView);

}

function instancesInDocument(document) {
    var allInstances = NSMutableArray.alloc().init();
    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
        var instancesInPage = page.children().filteredArrayUsingPredicate(predicate);
        allInstances.addObjectsFromArray(instancesInPage);
    }
    return allInstances;
}
