var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var symbols = document.getSymbols();
    symbols = symbols.sort(function(a, b) {
        var _a = a.getLibrary() ? "zzz" + a.getLibrary().name + "-" + a.name : a.name;
        var _b = b.getLibrary() ? "zzz" + b.getLibrary().name + "-" + b.name : b.name;
        if (_a < _b) {
            return -1;
        }
        if (_a > _b) {
            return 1;
        }
        return 0;
    });

    var localSymbols = symbols.filter(function(symbol) {
        return !symbol.getLibrary();
    });

    if (symbols.length == 0) {
        sketch.UI.message("This document have not any symbol.");
        return;
    }

    // Dialog
    var dialog = new Dialog("Find and Replace Symbol");

    // Find
    dialog.addLabel("Find a symbol in this document:");
    var findSymbolView = ui.popupButton([]);
    loadSelectMenuData(findSymbolView, symbols);
    dialog.addView(findSymbolView);

    // Filter
    dialog.addLabel("Find symbols in:");
    var findFilterView = ui.popupButton([
        "Selected layers",
        "Child layers of selected layer",
        "Current page",
        "Document"
    ]);
    dialog.addView(findFilterView);

    dialog.addLabel("Find symbol layer or override:");
    var replaceFilterView = ui.popupButton([
        "Both symbol layer and override",
        "Symbol layer",
        "Symbol override"
    ]);
    dialog.addView(replaceFilterView);

    dialog.addView(ui.divider());

    // Library
    var libraries = sketch.getLibraries();
    var enabledLibraries = libraries.filter(function(library) {
        return library.enabled == true;
    });

    dialog.addLabel("Replace symbol from document or library:");
    var namesOfEnabledLibraries = enabledLibraries.map(function(library) {
        return library.name;
    });
    namesOfEnabledLibraries.unshift("Document");
    var libraryView = ui.popupButton(namesOfEnabledLibraries);
    dialog.addView(libraryView);

    // Symbol
    dialog.addLabel("Choose a symbol:");
    var targetSymbolView = ui.popupButton([]);
    dialog.addView(targetSymbolView);

    // Init
    loadSelectMenuData(targetSymbolView, localSymbols);

    var selectedLibrary;
    var symbolReferences;
    libraryView.setCOSJSTargetFunction(function(sender) {
        var selectedIndex = sender.indexOfSelectedItem();
        if (selectedIndex == 0) {
            selectedLibrary = undefined;
            loadSelectMenuData(targetSymbolView, localSymbols);
        } else {
            selectedLibrary = enabledLibraries[selectedIndex - 1];
            symbolReferences = selectedLibrary.getImportableSymbolReferencesForDocument(document);
            symbolReferences = symbolReferences.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
            loadSelectMenuData(targetSymbolView, symbolReferences);
        }
    });

    dialog.addView(ui.divider());

    var sizeView = ui.checkBox(false, "Swap at Original Size. (For symbol layer)");
    dialog.addView(sizeView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var findSymbol = symbols[findSymbolView.indexOfSelectedItem()];
        var targetSymbol;
        if (selectedLibrary) {
            var symbolReference = symbolReferences[targetSymbolView.indexOfSelectedItem()];
            targetSymbol = symbolReference.import();
        } else {
            targetSymbol = localSymbols[targetSymbolView.indexOfSelectedItem()];
        }

        var findFilterIndex = findFilterView.indexOfSelectedItem();
        var replaceFilterIndex = replaceFilterView.indexOfSelectedItem();
        // Symbol layer
        if (replaceFilterIndex == 0 || replaceFilterIndex == 1) {
            var allInstances = findSymbol.getAllInstances();
            if (findFilterIndex == 0) {
                allInstances = allInstances.filter(function(layer) {
                    return layer.selected == true;
                });
            } else if (findFilterIndex == 1) {
                allInstances = allInstances.filter(function(layer) {
                    return layer.parent.selected == true;
                });
            } else if (findFilterIndex == 2) {
                allInstances = allInstances.filter(function(layer) {
                    return layer.getParentPage().id == document.selectedPage.id;
                });
            }
            if (replaceFilterIndex == 1 && allInstances.length == 0) {
                sketch.UI.message(`No symbol layer in "${findFilterView.titleOfSelectedItem()}".`);
                return;
            }
            allInstances.forEach(function(instance) {
                //instance.sketchObject.changeInstanceToSymbol(targetSymbol.sketchObject);
                if (
                    instance.getParentSymbolMaster() == undefined ||
                    (instance.getParentSymbolMaster() && instance.getParentSymbolMaster().symbolId != targetSymbol.symbolId)
                ) {
                    var newInstance = targetSymbol.createNewInstance();
                    instance.parent.layers.push(newInstance);
                    newInstance.index = instance.index;
                    newInstance.frame = instance.frame;
                    newInstance.name = instance.name;
                    instance.remove();
                    if (sizeView.state() == NSOnState) {
                        newInstance.sketchObject.resetSizeToMaster();
                        if (newInstance.parent.type == "Group") {
                            newInstance.parent.sketchObject.fixGeometryWithOptions(1);
                        }
                    }
                }
            });
        }
        // Symbol override
        if (replaceFilterIndex == 0 || replaceFilterIndex == 2) {
            var allInstancesHaveThisSymbolOverride = sketch.find("SymbolInstance");
            if (findFilterIndex == 0) {
                allInstancesHaveThisSymbolOverride = sketch.find("SymbolInstance").filter(function(layer) {
                    return layer.selected == true;
                });
            } else if (findFilterIndex == 1) {
                allInstancesHaveThisSymbolOverride = sketch.find("SymbolInstance").filter(function(layer) {
                    return layer.parent.selected == true;
                });
            } else if (findFilterIndex == 2) {
                allInstancesHaveThisSymbolOverride = sketch.find("SymbolInstance").filter(function(layer) {
                    return layer.getParentPage().id == document.selectedPage.id;
                });
            }
            allInstancesHaveThisSymbolOverride = allInstancesHaveThisSymbolOverride.filter(function(instance) {
                return instance.overrides.find(function(override) {
                    return override.property == "symbolID" && override.value == findSymbol.symbolId;
                });
            });
            if (replaceFilterIndex == 2 && allInstancesHaveThisSymbolOverride.length == 0) {
                sketch.UI.message(`No symbol override in "${findFilterView.titleOfSelectedItem()}".`);
                return;
            }
            allInstancesHaveThisSymbolOverride.forEach(function(instance) {
                var findSymbolOverrides = instance.overrides.filter(function(override) {
                    return override.property == "symbolID" && override.value == findSymbol.symbolId;
                });
                findSymbolOverrides.forEach(function(override) {
                    var notAvailableSymbolIds = getNotAvailableSymbolIds(instance, override);
                    if (!notAvailableSymbolIds.includes(targetSymbol.symbolId)) {
                        override.value = targetSymbol.symbolId;
                    }
                });
            });
        }

        document.sketchObject.reloadInspector();
    }
};

function getNotAvailableSymbolIds(instance, override) {
    var symbolIds = [instance.symbolId];
    var overridePathParts = override.path.split("/");
    for (var i = 0; i < overridePathParts.length; i++) {
        var overridePath = overridePathParts.slice(0,i+1).join("/");
        var overrideValue = instance.overrides.find(function(item) {
            return item.path == overridePath;
        }).value;
        symbolIds.push(overrideValue);
    }
    return symbolIds;
}

function loadSelectMenuData(popupButton, symbols) {
    var preview = require("../modules/Preview");
    popupButton.removeAllItems();
    symbols.forEach(function(symbol) {
        var menuItem = NSMenuItem.alloc().init();
        var menuTitle;
        var menuImage;
        var symbolNative;
        if (symbol.type == "SymbolMaster") {
            if (symbol.getLibrary()) {
                menuTitle = symbol.getLibrary().name + " ▶︎ " + symbol.name;
            } else {
                menuTitle = symbol.name;
            }
            symbolNative = symbol.sketchObject;
        }
        if (symbol.type == "ImportableObject") {
            menuTitle = symbol.name;
            symbolNative = symbol.sketchObject.symbolMaster();
        }
        menuImage = preview.symbol(symbolNative, 40);
        menuImage.setSize(CGSizeMake(menuImage.size().width / 2, menuImage.size().height / 2));
        menuItem.setImage(menuImage);
        menuItem.setTitle(menuTitle);
        popupButton.menu().addItem(menuItem);
    });
}