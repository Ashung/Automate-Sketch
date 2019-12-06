var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    var styles;
    var localStyles;
    if (identifier == "find_and_replace_layer_style") {
        styles = document.sharedLayerStyles.filter(function(style) {
            return style.getAllInstancesLayers().length > 0;
        });
        localStyles = document.sharedLayerStyles.filter(function(style) {
            return !style.getLibrary();
        });
    } else {
        styles = document.sharedTextStyles.filter(function(style) {
            return style.getAllInstancesLayers().length > 0;
        });
        localStyles = document.sharedTextStyles.filter(function(style) {
            return !style.getLibrary();
        });
    }
    if (styles.length == 0) {
        sketch.UI.message("This document have not any style.");
        return;
    }

    // Dialog
    var dialogTitle;
    if (identifier == "find_and_replace_layer_style") {
        dialogTitle = "Find and Replace Layer Style";
    } else {
        dialogTitle = "Find and Replace Text Style";
    }
    var dialog = new Dialog(dialogTitle, "");

    // Find
    dialog.addLabel("Find a style in this document:");
    var findStyleView = ui.popupButton([]);
    loadSelectMenuData(findStyleView, styles);
    dialog.addView(findStyleView);

    // Library
    var libraries = sketch.getLibraries();
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
    if (enabledLibraries.length == 0) {
        loadSelectMenuData(targetStyleView, localStyles);
    } else {
        selectedLibrary = enabledLibraries[0];
        if (identifier == "find_and_replace_layer_style") {
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
            if (identifier == "find_and_replace_layer_style") {
                styleReferences = selectedLibrary.getImportableLayerStyleReferencesForDocument(document);
            } else {
                styleReferences = selectedLibrary.getImportableTextStyleReferencesForDocument(document);
            }
            loadSelectMenuData(targetStyleView, styleReferences);
        }
    });

    // Filter
    dialog.addLabel("Only find style in:");
    var filterView = ui.popupButton([
        "Selected layers",
        "Child layers of selected layer",
        "Current page",
        "Document"
    ]);
    dialog.addView(filterView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var findStyle = styles[findStyleView.indexOfSelectedItem()];

        var targetStyle;
        if (selectedLibrary) {
            var styleReference = styleReferences[targetStyleView.indexOfSelectedItem()];
            targetStyle = styleReference.import();
        } else {
            targetStyle = localStyles[targetStyleView.indexOfSelectedItem()];
        }

        var allInstancesLayers = findStyle.getAllInstancesLayers();
        var filterIndex = filterView.indexOfSelectedItem();
        if (filterIndex == 0) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.selected == true;
            });
        } else if (filterIndex == 1) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.parent.selected == true;
            });
        } else if (filterIndex == 2) {
            allInstancesLayers = allInstancesLayers.filter(function(layer) {
                return layer.sketchObject.parentPage() == document.selectedPage.sketchObject;
            });
        }

        if (allInstancesLayers.length == 0) {
            sketch.UI.message("No style layer in " + '"' + filterView.titleOfSelectedItem() + '".');
            return;
        }

        allInstancesLayers.forEach(function(layer) {
            layer.style = targetStyle.style;
            layer.sharedStyleId = (targetStyle.id);
        });

        var count = allInstancesLayers.length;
        sketch.UI.message(`${count} ${count > 1 ? "layers" : "layer"} with style "${findStyle.name}" have replace to style "${targetStyle.name}"`);
    }
};

function loadSelectMenuData(popupButton, styles) {
    var preview = require("../modules/Preview");
    popupButton.removeAllItems();
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
            menuTitle += " (" + style.getAllInstancesLayers().length + ")";
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
