var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    var idsOfUniqueStyle = [];
    var allStyles;
    var styles = [];
    var localStyles = [];
    if (identifier == "find_and_replace_layer_style") {
        allStyles = document.sharedLayerStyles;
    } else {
        allStyles = document.sharedTextStyles;
    }
    allStyles.forEach(function(style) {
        var styleID = getStyleId(style.id);
        if (styleID == style.id) {
            localStyles.push(style);
        }
        if (!idsOfUniqueStyle.includes(styleID)) {
            idsOfUniqueStyle.push(styleID);
            styles.push(style);
        }
    });
    if (styles.length == 0) {
        sketch.UI.message("This document have not any style.");
        return;
    }

    styles = styles.sort(function(a, b) {
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

    // Style use in override
    var stylesInOverride = {};
    sketch.find("SymbolInstance").forEach(function(instance) {
        instance.overrides.filter(function(override) {
            if (identifier == "find_and_replace_layer_style") {
                return override.property == "layerStyle";
            } else {
                return override.property == "textStyle";
            }
        }).forEach(function(override) {
            var styleID = getStyleId(override.value);
            if (Object.keys(stylesInOverride).includes(styleID)) {
                stylesInOverride[styleID] += 1;
            } else {
                stylesInOverride[styleID] = 1;
            }
        });
    });

    // Dialog
    var dialogTitle;
    if (identifier == "find_and_replace_layer_style") {
        dialogTitle = "Find and Replace Layer Style";
    } else {
        dialogTitle = "Find and Replace Text Style";
    }
    var dialog = new Dialog(dialogTitle, "Note: Library ▶︎ Style (layer count, override count).");

    // Find
    dialog.addLabel("Find a style in this document:");
    var findStyleView = ui.popupButton([]);
    loadSelectMenuData(findStyleView, styles, stylesInOverride);
    dialog.addView(findStyleView);

    // Filter
    dialog.addLabel("Only find style in:");
    var filterView = ui.popupButton([
        "Selected layers",
        "Child layers of selected layer",
        "Current page",
        "Document"
    ]);
    dialog.addView(filterView);

    dialog.addView(ui.divider());

    // Library
    var libraries = sketch.getLibraries();
    var enabledLibraries = libraries.filter(function(library) {
        return library.enabled == true;
    });

    dialog.addLabel("Style from library or document:");
    var namesOfEnabledLibraries = enabledLibraries.map(function(library) {
        return "(Library) " + library.name;
    });
    namesOfEnabledLibraries.unshift("Document");
    var libraryView = ui.popupButton(namesOfEnabledLibraries);
    dialog.addView(libraryView);

    // Style
    dialog.addLabel("Choose a style:");
    var targetStyleView = ui.popupButton([]);
    dialog.addView(targetStyleView);

    // Init
    var selectedLibrary;
    var styleReferences;
    if (enabledLibraries.length == 0) {
        selectedLibrary = enabledLibraries[0];
        if (identifier == "find_and_replace_layer_style") {
            styleReferences = selectedLibrary.getImportableLayerStyleReferencesForDocument(document);
        } else {
            styleReferences = selectedLibrary.getImportableTextStyleReferencesForDocument(document);
        }
        loadSelectMenuData(targetStyleView, styleReferences, stylesInOverride);
    } else {
        loadSelectMenuData(targetStyleView, localStyles, stylesInOverride);
    }

    libraryView.setCOSJSTargetFunction(function(sender) {
        var selectedIndex = sender.indexOfSelectedItem();
        if (selectedIndex == 0) {
            loadSelectMenuData(targetStyleView, localStyles, stylesInOverride);
            selectedLibrary = undefined;
        } else {
            selectedLibrary = enabledLibraries[selectedIndex-1];
            if (identifier == "find_and_replace_layer_style") {
                styleReferences = selectedLibrary.getImportableLayerStyleReferencesForDocument(document);
            } else {
                styleReferences = selectedLibrary.getImportableTextStyleReferencesForDocument(document);
            }
            loadSelectMenuData(targetStyleView, styleReferences, stylesInOverride);
        }
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var findStyle = styles[findStyleView.indexOfSelectedItem()];
        var findStyleId = getStyleId(findStyle.id);

        var targetStyle;
        if (selectedLibrary) {
            var styleReference = styleReferences[targetStyleView.indexOfSelectedItem()];
            targetStyle = styleReference.import();
        } else {
            targetStyle = localStyles[targetStyleView.indexOfSelectedItem()];
        }

        var allInstancesLayers = findStyle.getAllInstancesLayers();
        var allSymbolInstances = [];
        sketch.find("SymbolInstance").forEach(function(instance) {
            instance.overrides.filter(function(override) {
                if (identifier == "find_and_replace_layer_style") {
                    return override.property == "layerStyle";
                } else {
                    return override.property == "textStyle";
                }
            }).forEach(function(override) {
                if (getStyleId(override.value) == findStyleId) {
                    allSymbolInstances.push(instance);
                }
            });
        });

        var filterIndex = filterView.indexOfSelectedItem();
        if (filterIndex == 0) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.selected == true;
            });
            allSymbolInstances = allSymbolInstances.filter(function(layer) {
                return layer.selected == true;
            });
        } else if (filterIndex == 1) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.parent.selected == true;
            });
            allSymbolInstances = allSymbolInstances.filter(function(layer) {
                return layer.parent.selected == true;
            });
        } else if (filterIndex == 2) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.sketchObject.parentPage() == document.selectedPage.sketchObject;
            });
            allSymbolInstances = allSymbolInstances.filter(function(layer) {
                return layer.sketchObject.parentPage() == document.selectedPage.sketchObject;
            });
        }

        if (allInstancesLayers.length == 0 && allSymbolInstances.length == 0) {
            sketch.UI.message("No layer and override use " + '"' + filterView.titleOfSelectedItem() + '".');
            return;
        }

        allInstancesLayers.forEach(function(layer) {
            layer.style = targetStyle.style;
            layer.sharedStyleId = (targetStyle.id);
        });

        allSymbolInstances.forEach(function(instance) {
            instance.overrides.filter(function(override) {
                if (identifier == "find_and_replace_layer_style") {
                    return override.property == "layerStyle";
                } else {
                    return override.property == "textStyle";
                }
            }).forEach(function(override) {
                if (getStyleId(override.value) == findStyleId) {
                    override.value = (targetStyle.id);
                }
            });
        });

        var layerCount = allInstancesLayers.length;
        var overrideCount = stylesInOverride[findStyleId];
        sketch.UI.message(`${layerCount} ${layerCount > 1 ? "layers" : "layer"} and ${overrideCount} ${overrideCount > 1 ? "overrides" : "override"} with style "${findStyle.name}" have replace to style "${targetStyle.name}"`);
    }
};

function loadSelectMenuData(popupButton, styles, stylesInOverride) {
    var preview = require("../modules/Preview");
    popupButton.removeAllItems();
    styles.sort((a,b) => a.name > b.name);
    styles.forEach(function(style) {
        var menuItem = NSMenuItem.alloc().init();
        var menuTitle;
        var menuImage;
        if (style.type == "SharedStyle") {
            if (style.getLibrary()) {
                menuTitle = style.getLibrary().name + " ▶︎ " + style.name;
            } else {
                menuTitle = style.name;
            }
            if (style.style.styleType == "Layer") {
                menuImage = preview.layerStyle(style.sketchObject);
            }
            if (style.style.styleType == "Text") {
                menuImage = preview.textStyleSmall(style.sketchObject);
            }
            menuItem.setImage(menuImage);
            var styleID = getStyleId(style.id);
            var countOverride = stylesInOverride[styleID] || 0;
            menuTitle += " (" + style.getAllInstancesLayers().length + ", " + countOverride + ")";
        }
        if (style.type == "ImportableObject") {
            menuTitle = style.name;
            var shareStyle = MSSharedStyle.alloc().initWithName_style(style.name, style.sketchObject.style());
            if (style.objectType == "LayerStyle") {
                menuImage = preview.layerStyle(shareStyle);
            }
            if (style.objectType == "TextStyle") {
                menuImage = preview.textStyleSmall(shareStyle);
            }
            menuItem.setImage(menuImage);
        }
        menuItem.setTitle(menuTitle);
        popupButton.menu().addItem(menuItem);
    });
}

function getStyleId(styleId) {
    if (styleId.match(/\[(.*)\]/)) {
        return styleId.match(/\[(.*)\]/)[1];
    } else {
        return styleId;
    }
}