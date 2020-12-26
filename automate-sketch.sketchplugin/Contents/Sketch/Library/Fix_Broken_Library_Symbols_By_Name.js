var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");
    
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/preview");
    var sketch = require("sketch/dom");
    var toast = require("sketch/ui").message;
    var document = sketch.getSelectedDocument();
    var util = require("util");

    var libraries = sketch.getLibraries().filter(function(library) {
        return library.valid && library.enabled;
    });
    if (libraries.length == 0) {
        toast('These are no enabled library in "Preferences" - "Libraries".');
        return;
    }

    // { id: { brokenSymbol: MSForeignObject, library, symbolReferenceWithSameName } }
    var allBrokenImportedSymbols = {};
    
    // [ id ]
    var allBrokenImportedSymbolIds = [];

    // [ MSForeignObject ]
    var allImportedSymbols = util.toArray(document._getMSDocumentData().foreignSymbols());
    allImportedSymbols.forEach(function(symbol) {
        var idKey = String(symbol.localShareID());
        var library = libraries.find(function(lib) {
            return lib.id == symbol.libraryID();
        });
        if (library) {
            var symbolReferences = library.getImportableSymbolReferencesForDocument(document);
            var symbolReferenceWithSameId = symbolReferences.find(function(symbolReference) {
                return symbolReference.id == idKey;
            });
            if (symbolReferenceWithSameId == undefined) {
                var symbolReferenceWithSameName = symbolReferences.find(function(sf) {
                    return sf.name == symbol.symbolMaster().name();
                });
                allBrokenImportedSymbolIds.push(idKey);
                allBrokenImportedSymbols[idKey] = {
                    brokenSymbol: symbol,
                    library,
                    symbolReferenceWithSameName
                };
            }
        }
    });

    if (allBrokenImportedSymbolIds.length == 0) {
        toast("These are no broken library symbols in document.");
        return;
    }

    // Dialog
    var viewWidth = 350;
    var rowHeight = 150;
    var dialog = new Dialog(
        "Fix Broken Library Symbols by Name",
        'If can\'t find a library symbol with same name, you can use "Symbol" - "Find and Replace Symbol".',
        viewWidth
    );

    var scrollView = ui.scrollView([], [viewWidth, 400]);
    dialog.addView(scrollView);

    var selectAll = ui.checkBox(true, "Select / Deselect All Symbols.");
    selectAll.setAllowsMixedState(true);
    dialog.addView(selectAll);

    var swapSize = ui.checkBox(false, "Swap at Original Size");
    dialog.addView(swapSize);

    var contentView = ui.view([0, 0, viewWidth, allBrokenImportedSymbolIds.length * rowHeight + 10]);
    contentView.setFlipped(true);
    scrollView.setDocumentView(contentView);

    var checked = allBrokenImportedSymbolIds.length;
    var unChecked = 0;

    allBrokenImportedSymbolIds.forEach(function(key, i) {

        var symbol = allBrokenImportedSymbols[key];

        // List
        var itemView = ui.view([0, rowHeight * i, viewWidth, rowHeight]);
        itemView.setFlipped(true);

        // Checkbox
        var checkbox = ui.checkBox(true, `${symbol.library.name} ▶︎ ${symbol.brokenSymbol.symbolMaster().name()}`, [10, 10, viewWidth - 10, 30]);
        itemView.addSubview(checkbox);
        if (symbol.symbolReferenceWithSameName == undefined) {
            checkbox.setTitle(`(Not found!) ${symbol.library.name} ▶︎ ${symbol.brokenSymbol.symbolMaster().name()}`);
            checkbox.setState(NSOffState);
            checkbox.setEnabled(false);
        }
        checkbox.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                checked --;
                unChecked ++;
            }
            if (sender.state() == NSOnState) {
                checked ++;
                unChecked --;
            }
            if (checked == allBrokenImportedSymbolIds.length && unChecked == 0) {
                selectAll.setState(NSOnState);
            } else if (checked == 0 && unChecked == allBrokenImportedSymbolIds.length) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });

        // Preview
        var symbolPreview1 = ui.image(preview.symbol(symbol.brokenSymbol.symbolMaster(), 200), [10, 30, 100, 100]);
        itemView.addSubview(symbolPreview1);
        if (symbol.symbolReferenceWithSameName) {
            var symbolPreview2 = ui.image(preview.symbol(symbol.symbolReferenceWithSameName.sketchObject.symbolMaster(), 200), [140, 30, 100, 100]);
            itemView.addSubview(symbolPreview2);
        }

        var divider = ui.divider([0, rowHeight - 1, viewWidth, 1]);
        itemView.addSubview(divider);

        contentView.addSubview(itemView);
    });

    // Select / Deselect
    selectAll.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            checked = allBrokenImportedSymbolIds.length;
            unChecked = 0;
            var viewContainer = contentView.subviews().objectEnumerator();
            var subview;
            while (subview = viewContainer.nextObject()) {
                var checkbox = subview.subviews().firstObject();
                if (checkbox.enabled) {
                    checkbox.setState(NSOnState);
                }
            }
        } else {
            checked = 0;
            unChecked = allBrokenImportedSymbolIds.length;
            var viewContainer = contentView.subviews().objectEnumerator();
            var subview;
            while (subview = viewContainer.nextObject()) {
                var checkbox = subview.subviews().firstObject();
                if (checkbox.enabled) {
                    checkbox.setState(NSOffState);
                }
            }
        }
    });
    
    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var selectedBrokenImportedSymbolIds = [];
        var listViews = contentView.subviews().objectEnumerator();
        var listView;
        var viewIndex = 0;
        while (listView = listViews.nextObject()) {
            var checkbox = listView.subviews().firstObject();
            if (checkbox.enabled && checkbox.state() == NSOnState) {
                selectedBrokenImportedSymbolIds.push(allBrokenImportedSymbolIds[viewIndex]);
            }
            viewIndex ++;
        }

        var count = {
            instances: 0,
            overrides: 0
        };

        // Find all symbol instances
        var allInstances = sketch.find("SymbolInstance");
        allInstances.forEach(function(instance) {
            // Library symbol
            var symbolId = instance.symbolId;
            if (selectedBrokenImportedSymbolIds.includes(symbolId)) {
                var importedSymbol = allBrokenImportedSymbols[symbolId].symbolReferenceWithSameName.import();
                instance.sketchObject.changeInstanceToSymbol(importedSymbol.sketchObject);
                if (swapSize.state() == NSOnState) {
                    importedSymbol.getAllInstances().forEach(function(importedSymbolInstance) {
                        importedSymbolInstance.frame.width = importedSymbol.frame.width;
                        importedSymbolInstance.frame.height = importedSymbol.frame.height;
                    });
                }
                count.instances ++;
            } else {
                // Find symbol overrides
                instance.overrides.forEach(function(override) {
                    if (override.symbolOverride && selectedBrokenImportedSymbolIds.includes(override.value)) {
                        var importedSymbol = allBrokenImportedSymbols[override.value].symbolReferenceWithSameName.import();
                        override.value = importedSymbol.symbolId;
                        count.overrides ++;
                    }
                });
            }
        });

        toast(`Fix ${count.instances} symbol instance${count.instances > 1 ? 's' : ''}, and ${count.overrides} symbol override${count.overrides > 1 ? 's' : ''}.`);

        // This only replace symbol instance
        // selectedBrokenImportedSymbolIds.forEach(function(symbolId) {
        //     var brokenSymbol = document.getSymbolMasterWithID(symbolId);
        //     var importedSymbol = allBrokenImportedSymbols[symbolId].symbolReferenceWithSameName.import();
        //     brokenSymbol.getAllInstances().forEach(function(brokenSymbolInstance) {
        //         brokenSymbolInstance.sketchObject.changeInstanceToSymbol(importedSymbol.sketchObject);
        //         if (swapSize.state() == NSOnState) {
        //             brokenSymbolInstance.frame.width = importedSymbol.frame.width;
        //             brokenSymbolInstance.frame.height = importedSymbol.frame.height;
        //         }
        //     });
        // });

    }
};