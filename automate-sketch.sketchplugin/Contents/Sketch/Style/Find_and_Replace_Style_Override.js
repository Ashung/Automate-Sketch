var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    var styles = [];
    if (identifier == "find_and_replace_layer_style_override") {
        styles = document.sharedLayerStyles;
    } else {
        styles = document.sharedTextStyles;
    }
    if (styles.length == 0) {
        sketch.UI.message("This document have not any style.");
        return;
    }

    var idsOfUniqueStyle = [];
    var uniqueStyles = [];
    var localStyles = [];
    styles.forEach(function(style) {
        var styleID;
        if (style.id.match(/\[(.*)\]/)) {
            styleID = style.id.match(/\[(.*)\]/)[1];
        } else {
            styleID = (style.id);
            localStyles.push(style);
        }
        if (!idsOfUniqueStyle.includes(styleID)) {
            idsOfUniqueStyle.push(styleID);
            uniqueStyles.push(style);
        }
    });

    // Dialog
    var dialogTitle;
    if (identifier == "find_and_replace_layer_style_override") {
        dialogTitle = "Find and Replace Layer Style Override";
    } else {
        dialogTitle = "Find and Replace Text Style Override";
    }
    var dialog = new Dialog(dialogTitle, "");

    // Find
    dialog.addLabel("Find a style override in this document:");
    var findStyleView = ui.popupButton([]);
    loadSelectMenuData(findStyleView, uniqueStyles);
    dialog.addView(findStyleView);

    // Library
    var libraries = require("sketch/dom").getLibraries();
    var enabledLibraries = libraries.filter(function(library) {
        return library.enabled == true;
    });

    dialog.addLabel("Style from library or document:");
    var namesOfEnabledLibraries = enabledLibraries.map(function(library) {
        return "(Library) " + library.name;
    });
    namesOfEnabledLibraries.push("Document");
    var libraryView = ui.popupButton(namesOfEnabledLibraries);
    dialog.addView(libraryView);

    // Style
    dialog.addLabel("Choose a style:");
    var targetStyleView = ui.popupButton([]);
    dialog.addView(targetStyleView);

    // Init
    var selectedLibrary;
    var styleReferences;
    if (enabledLibraries == 0) {
        loadSelectMenuData(targetStyleView, localStyles);
    } else {
        var selectedLibrary = enabledLibraries[0];
        if (identifier == "find_and_replace_layer_style_override") {
            styleReferences = selectedLibrary.getImportableLayerStyleReferencesForDocument(document);
        } else {
            styleReferences = selectedLibrary.getImportableTextStyleReferencesForDocument(document);
        }
        loadSelectMenuData(targetStyleView, styleReferences);
    }

    libraryView.setCOSJSTargetFunction(function(sender) {
        var selectedIndex = sender.indexOfSelectedItem();
        if (selectedIndex == enabledLibraries.length) {
            loadSelectMenuData(targetStyleView, localStyles);
            selectedLibrary = undefined;
        } else {
            selectedLibrary = enabledLibraries[selectedIndex];
            if (identifier == "find_and_replace_layer_style_override") {
                styleReferences = selectedLibrary.getImportableLayerStyleReferencesForDocument(document);
            } else {
                styleReferences = selectedLibrary.getImportableTextStyleReferencesForDocument(document);
            }
            loadSelectMenuData(targetStyleView, styleReferences);
        }
    });

    // Filter
    dialog.addLabel("Only find style override in:");
    var filterView = ui.popupButton([
        "Selected layers",
        "Child layers of selected layer",
        "Current page",
        "Document"
    ]);
    dialog.addView(filterView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var findStyle = uniqueStyles[findStyleView.indexOfSelectedItem()];
        var findStyleId = (findStyle.id);
        if (findStyleId.match(/\[(.*)\]/)) {
            findStyleId = findStyleId.match(/\[(.*)\]/)[1];
        }

        var targetStyleId;
        if (selectedLibrary) {
            var styleReference = styleReferences[targetStyleView.indexOfSelectedItem()];
            var sharedStyle = styleReference.import();
            targetStyleId = (sharedStyle.id);
        } else {
            var targetStyle = localStyles[targetStyleView.indexOfSelectedItem()];
            targetStyleId = (targetStyle.id);
        }

        var allInstances;
        var filterIndex = filterView.indexOfSelectedItem();
        if (filterIndex == 0) {
            allInstances = document.selectedLayers.layers.filter(function(layer) {
                return layer.type == "SymbolInstance";
            });
        } else if (filterIndex == 1) {
            allInstances = instancesInSelectedLayers(document);
        } else if (filterIndex == 2) {
            allInstances = instancesInCurrentPage(document);
        } else {
            allInstances = instancesInDocument(document);
        }

        if (allInstances.length == 0) {
            sketch.UI.message("No symbol instance in " + '"' + filterView.titleOfSelectedItem() + '".')
            return;
        }

        var count = 0;
        allInstances.forEach(function(instance) {
            instance.overrides.forEach(function(override) {
                if (override.property == "layerStyle" && identifier == "find_and_replace_layer_style_override") {
                    override.value = targetStyleId;
                    count ++;
                }
                if (override.property == "textStyle" && identifier == "find_and_replace_text_style_override") {
                    override.value = targetStyleId;
                    count ++;
                }
            });
        });

        sketch.UI.message(`${count} ${count > 1 ? "overrides" : "override"} named "${findStyleView.titleOfSelectedItem()}" have replace to "${targetStyleView.titleOfSelectedItem()}"`);

    }

};

function loadSelectMenuData(popupButton, styles) {
    var preview = require("../modules/Preview");
    popupButton.removeAllItems();
    styles.forEach(function(style) {
        var menuItem = NSMenuItem.alloc().init();
        var menuTitle;
        if (style.type == "SharedStyle") {
            if (style.getLibrary()) {
                menuTitle = style.getLibrary().name + " ▶︎ " + style.name;
            } else {
                menuTitle = style.name;
            }
            if (style.style.styleType == "Layer") {
                var menuImage = preview.layerStyle(style.sketchObject);
                menuItem.setImage(menuImage);
            }
        }
        if (style.type == "ImportableObject") {
            menuTitle = style.name;
            if (style.objectType == "LayerStyle") {
                var shareStyle = MSSharedStyle.alloc().initWithName_style(style.name, style.sketchObject.style());
                var menuImage = preview.layerStyle(shareStyle);
                menuItem.setImage(menuImage);
            }
        }
        menuItem.setTitle(menuTitle);
        popupButton.menu().addItem(menuItem);
    });
}

function instancesInSelectedLayers(document) {
    var util = require("util");
    var sketch = require("sketch");
    var instances = [];
    var predicateSymbolInstance = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    document.selectedLayers.layers.forEach(function(layer) {
        instances = instances.concat(util.toArray(layer.sketchObject.children().filteredArrayUsingPredicate(predicateSymbolInstance)));
    });
    return instances.map(function(item) {
        return sketch.fromNative(item);
    });
}

function instancesInCurrentPage(document) {
    var util = require("util");
    var sketch = require("sketch");
    var currentPage = document.selectedPage;
    var predicateSymbolInstance = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    var instances = currentPage.sketchObject.children().filteredArrayUsingPredicate(predicateSymbolInstance);
    return util.toArray(instances).map(function(item) {
        return sketch.fromNative(item);
    });
}

function instancesInDocument(document) {
    var util = require("util");
    var sketch = require("sketch");
    var instances = [];
    var predicateSymbolInstance = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    document.pages.forEach(function(page) {
        instances = instances.concat(util.toArray(page.sketchObject.children().filteredArrayUsingPredicate(predicateSymbolInstance)));
    });
    return instances.map(function(item) {
        return sketch.fromNative(item);
    });
}