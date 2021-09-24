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

    if (sketch.version.sketch < 51) {
        toast("😮 You have to update to Sketch 51+ to use this feature.");
        return;
    }

    var document = context.document;
    var documentData = document.documentData();
    var allLocalStyle;
    var styleType;
    var pluginIdentifier = context.command.identifier();
    if (pluginIdentifier == "change_local_text_style_to_library_text_style") {
        allLocalStyle = NSArray.arrayWithArray(
            sketch
                .getSelectedDocument()
                .sharedTextStyles.filter((style) => style.getAllInstancesLayers().length > 0)
                .map((s) => s.sketchObject)
        );
        styleType = "text";
    }
    if (pluginIdentifier == "change_local_layer_style_to_library_layer_style") {
        allLocalStyle = NSArray.arrayWithArray(
            sketch
                .getSelectedDocument()
                .sharedLayerStyles.filter((style) => style.getAllInstancesLayers().length > 0)
                .map((s) => s.sketchObject)
        );
        styleType = "layer";
    }
    if (allLocalStyle.count() == 0) {
        toast(`No ${styleType} styles in current document.`);
        return;
    }
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    allLocalStyle = allLocalStyle.sortedArrayUsingDescriptors([sortDescriptor]);

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptor]);
    if (availableLibraries.count() == 0) {
        toast("You have no available libraries.");
        return;
    }

    var dialog = new Dialog(
        `Swap ${capitalize(styleType)} Styles`,
        `Swap ${styleType} styles used in the current document with matching ones from a library.` +
        "\n\nGreen • : Matching style found with the same properties." +
        "\nRed • : Matching style found with different properties.",
        400
    );

    // Choose a library
    var libraryLabelView = ui.textLabel("Choose A Library");
    dialog.addView(libraryLabelView);

    var libraryNames = util.toArray(availableLibraries).map(function(library) {
        return library.name();
    });
    var selectBoxLibrary = ui.popupButton(libraryNames, 200);
    dialog.addView(selectBoxLibrary);

    // Choose name, properties, id
    var labelChangeType = ui.textLabel("Match library style with same...");
    dialog.addView(labelChangeType);
    var selectBoxChangeType = ui.popupButton(["Name", "Properties", "ID"], 200);
    dialog.addView(selectBoxChangeType);

    // List all style
    var stylesWillChanged = allLocalStyle.mutableCopy();
    var selectedItemsCount = stylesWillChanged.count();
    var styleToLibraryDict = {};

    var selectAllStyles = ui.checkBox(true, "Select / Deselect all styles.");
    selectAllStyles.setAllowsMixedState(true);
    dialog.addView(selectAllStyles);

    var views = [];
    util.toArray(allLocalStyle).forEach(function(style) {
        var wrapper = ui.view([400, 50]);
        var checkBoxStyle;
        var imageStyle;
        if (styleType == "text") {
            checkBoxStyle = ui.checkBox(true, " ", [5, 10, 30, 30]);
            imageStyle = ui.imageButton(preview.textStyle(style), [28, 10, 360, 30]);
        } else {
            checkBoxStyle = ui.checkBox(true, "            " + style.name(), [5, 10, 380, 30]);
            imageStyle = ui.imageButton(preview.layerStyle(style, 48), [28, 10, 30, 30]);
        }

        // Add status view
        var status = ui.circle("#00000000", [60, 22, 6, 6]);
        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());
        var matchLibraryStyle;
        if (selectBoxChangeType.indexOfSelectedItem() == 0) {
            matchLibraryStyle = findStyleWithName_fromLibrary_type(style.name(), selectedLibrary, styleType);
        }
        if (selectBoxChangeType.indexOfSelectedItem() == 1) {
            matchLibraryStyle = findSameStyle_fromLibrary_type(style, selectedLibrary, styleType);
        }
        if (selectBoxChangeType.indexOfSelectedItem() == 2) {
            matchLibraryStyle = findStyleWithID_fromLibrary_type(style.objectID(), selectedLibrary, styleType);
        }
        if (matchLibraryStyle) {
            styleToLibraryDict["" + style.objectID()] = matchLibraryStyle;
            if (style.value().propertiesAreEqual(matchLibraryStyle.value())) {
                status.setBackgroundColor(greenColor);
            } else {
                status.setBackgroundColor(redColor);
            }
        }

        wrapper.addSubview(checkBoxStyle);
        wrapper.addSubview(imageStyle);
        wrapper.addSubview(status);
        views.push(wrapper);

        checkBoxStyle.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                selectedItemsCount --;
                stylesWillChanged.removeObject(style);
            }
            if (sender.state() == NSOnState) {
                selectedItemsCount ++;
                stylesWillChanged.addObject(style);
            }
            if (selectedItemsCount == allLocalStyle.count()) {
                selectAllStyles.setState(NSOnState);
            } else if (selectedItemsCount == 0) {
                selectAllStyles.setState(NSOffState);
            } else {
                selectAllStyles.setState(NSMixedState);
            }
        });
        imageStyle.setCOSJSTargetFunction(function(sender) {
            var checkBox = sender.superview().subviews().firstObject();
            checkBox.setState(checkBox.state() == NSOnState ? NSOffState : NSOnState);
            if (checkBox.state() == NSOffState) {
                selectedItemsCount --;
                stylesWillChanged.removeObject(style);
            }
            if (checkBox.state() == NSOnState) {
                selectedItemsCount ++;
                stylesWillChanged.addObject(style);
            }
            if (selectedItemsCount == allLocalStyle.count()) {
                selectAllStyles.setState(NSOnState);
            } else if (selectedItemsCount == 0) {
                selectAllStyles.setState(NSOffState);
            } else {
                selectAllStyles.setState(NSMixedState);
            }
        });
    });
    var scrollView = ui.scrollView(views, [400, 300]);
    dialog.addView(scrollView);

    // Reset style
    var resetStyleView = ui.checkBox(false, `Reset all ${styleType} styles.`);
    dialog.addView(resetStyleView);

    // Actions
    selectAllStyles.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            selectedItemsCount = allLocalStyle.count();
            stylesWillChanged = allLocalStyle.mutableCopy();
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOnState);
            });
        } else {
            selectedItemsCount = 0;
            stylesWillChanged.removeAllObjects();
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOffState);
            });
        }
    });
    
    selectBoxLibrary.setCOSJSTargetFunction(function(sender) {
        styleToLibraryDict = {};
        var selectedLibrary = availableLibraries.objectAtIndex(sender.indexOfSelectedItem());
        util.toArray(allLocalStyle).forEach(function(style, index) {
            var matchLibraryStyle;
            if (selectBoxChangeType.indexOfSelectedItem() == 0) {
                matchLibraryStyle = findStyleWithName_fromLibrary_type(style.name(), selectedLibrary, styleType);
            }
            if (selectBoxChangeType.indexOfSelectedItem() == 1) {
                matchLibraryStyle = findSameStyle_fromLibrary_type(style, selectedLibrary, styleType);
            }
            if (selectBoxChangeType.indexOfSelectedItem() == 2) {
                matchLibraryStyle = findStyleWithID_fromLibrary_type(style.objectID(), selectedLibrary, styleType);
            }
            var status = scrollView.documentView().subviews().objectAtIndex(index).subviews().objectAtIndex(2);
            if (matchLibraryStyle) {
                styleToLibraryDict["" + style.objectID()] = matchLibraryStyle;
                if (style.value().propertiesAreEqual(matchLibraryStyle.value())) {
                    status.setBackgroundColor(greenColor);
                } else {
                    status.setBackgroundColor(redColor);
                }
            } else {
                status.setBackgroundColor(noColor);
            }
        });
    });

    selectBoxChangeType.setCOSJSTargetFunction(function(sender) {
        styleToLibraryDict = {};
        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());
        util.toArray(allLocalStyle).forEach(function(style, index) {
            var matchLibraryStyle;
            if (sender.indexOfSelectedItem() == 0) {
                matchLibraryStyle = findStyleWithName_fromLibrary_type(style.name(), selectedLibrary, styleType);
            }
            if (sender.indexOfSelectedItem() == 1) {
                matchLibraryStyle = findSameStyle_fromLibrary_type(style, selectedLibrary, styleType);
            }
            if (sender.indexOfSelectedItem() == 2) {
                matchLibraryStyle = findStyleWithID_fromLibrary_type(style.objectID(), selectedLibrary, styleType);
            }
            var status = scrollView.documentView().subviews().objectAtIndex(index).subviews().objectAtIndex(2);
            if (matchLibraryStyle) {
                styleToLibraryDict["" + style.objectID()] = matchLibraryStyle;
                if (style.value().propertiesAreEqual(matchLibraryStyle.value())) {
                    status.setBackgroundColor(greenColor);
                } else {
                    status.setBackgroundColor(redColor);
                }
            } else {
                status.setBackgroundColor(noColor);
            }
        });
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var selectedLibrary = availableLibraries.objectAtIndex(selectBoxLibrary.indexOfSelectedItem());

        if (Object.keys(styleToLibraryDict).length == 0) {
            toast('Library "' + selectedLibrary.name() + '" not have match styles.');
            return;
        }

        // Add library style to foreign style
        var localStyleIDToForeignStyleMapping = {};
        var loopStylesWillChanged = stylesWillChanged.objectEnumerator();
        var style;
        while (style = loopStylesWillChanged.nextObject()) {
            var sharedStyle = styleToLibraryDict["" + style.objectID()];
            if (sharedStyle) {
                var foreignStyle;
                if (styleType == "text") {
                    foreignStyle = foreignTextStyleInDocument_forSharedStyle_fromLibrary(documentData, sharedStyle, selectedLibrary);
                }
                if (styleType == "layer") {
                    foreignStyle = foreignLayerStyleInDocument_forSharedStyle_fromLibrary(documentData, sharedStyle, selectedLibrary);
                }
                localStyleIDToForeignStyleMapping[style.objectID()] = foreignStyle;
            }
        }

        // Find all symbol instances use selected style in override, except default value, then replace override value.
        var loopPages = document.pages().objectEnumerator();
        var page;
        while (page = loopPages.nextObject()) {
            var predicateSymbolInstance = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
            var symbolInstancesInPage = page.children().filteredArrayUsingPredicate(predicateSymbolInstance);
            var loopSymbolInstancesInPage = symbolInstancesInPage.objectEnumerator();
            var instance;
            while (instance = loopSymbolInstancesInPage.nextObject()) {
                MSAvailableOverride.flattenAvailableOverrides(instance.availableOverrides()).forEach(function(override) {
                    if (override.hasOverride() && override.overridePoint().isStyleOverride()) {
                        if (Object.keys(localStyleIDToForeignStyleMapping).includes(String(override.overrideValue()))) {
                            instance.setValue_forOverridePoint(
                                localStyleIDToForeignStyleMapping[override.overrideValue()].localShareID(),
                                override.overridePoint()
                            );
                        }
                    }
                });
            }
        };

        // Change sharedObjectID
        stylesWillChanged.forEach(function(item) {
            var sharedStyle = styleToLibraryDict["" + item.objectID()];
            if (sharedStyle) {
                item.allLayersInstances().forEach(function(layer) {
                    if (sketch.version.sketch >= 52) {
                        var localStyleID = layer.sharedStyleID();
                        if (resetStyleView.state() == NSOffState) {
                            layer.setSharedStyleID(localStyleIDToForeignStyleMapping[localStyleID].localShareID());
                        }
                        // Reset Text/Layer Style
                        else {
                            layer.setSharedStyle(localStyleIDToForeignStyleMapping[localStyleID].localSharedStyle());
                        }
                    } else {
                        var localStyleID = layer.style().sharedObjectID();
                        if (resetStyleView.state() == NSOffState) {
                            layer.style().setSharedObjectID(localStyleIDToForeignStyleMapping[localStyleID].localShareID());
                        }
                        // Reset Text/Layer Style
                        else {
                            layer.setStyle(localStyleIDToForeignStyleMapping[localStyleID].localSharedStyle().newInstance());
                        }
                    }
                });
            }
        });

        // Remove local style
        var count = 0;
        stylesWillChanged.forEach(function(item) {
            var sharedStyle = styleToLibraryDict["" + item.objectID()];
            if (sharedStyle) {
                var sharedObjectContainer;
                if (styleType == "text") {
                    sharedObjectContainer = documentData.layerTextStyles();
                }
                if (styleType == "layer") {
                    sharedObjectContainer = documentData.layerStyles();
                }
                sharedObjectContainer.removeSharedObject(item);
                count ++;
            }
        });

        toast(
            `Change ${count} local ${styleType} style${count > 1 ? "s" : ""} to library style.`
        );
    }

};

function foreignTextStyleInDocument_forSharedStyle_fromLibrary(documentData, sharedStyle, library) {
    for (var i = 0; i < documentData.foreignTextStyles().count(); i++) {
        var foreignTextStyle = documentData.foreignTextStyles().objectAtIndex(i);
        if (String(sharedStyle.objectID()) == String(foreignTextStyle.remoteShareID())) {
            return foreignTextStyle;
        }
    }
    var foreignTextStyle = MSForeignTextStyle.alloc().initWithOriginalObject_inLibrary(sharedStyle, library);
    documentData.addForeignTextStyle(foreignTextStyle);
    return foreignTextStyle;
}

function foreignLayerStyleInDocument_forSharedStyle_fromLibrary(documentData, sharedStyle, library) {
    for (var i = 0; i < documentData.foreignLayerStyles().count(); i++) {
        var foreignLayerStyle = documentData.foreignLayerStyles().objectAtIndex(i);
        if (String(sharedStyle.objectID()) == String(foreignLayerStyle.remoteShareID())) {
            return foreignLayerStyle;
        }
    }
    var foreignLayerStyle = MSForeignLayerStyle.alloc().initWithOriginalObject_inLibrary(sharedStyle, library);
    documentData.addForeignLayerStyle(foreignLayerStyle);
    return foreignLayerStyle;
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function findSameStyle_fromLibrary_type(style, library, styleType) {
    var allLibraryStyles = stylesFromLibrary(library, styleType);
    var result = [];
    allLibraryStyles.forEach(libraryStyle => {
        if (style.value().propertiesAreEqual(libraryStyle.value())) {
            result.push(libraryStyle);
        }
    });
    return result.length > 0 ? result[0] : null;
}

function findStyleWithName_fromLibrary_type(name, library, styleType) {
    var allLibraryStyles = stylesFromLibrary(library, styleType);
    var predicate = NSPredicate.predicateWithFormat("name == %@", name);
    var result = allLibraryStyles.filteredArrayUsingPredicate(predicate);
    return result.firstObject();
}

function findStyleWithID_fromLibrary_type(id, library, styleType) {
    var allLibraryStyles = stylesFromLibrary(library, styleType);
    var predicate = NSPredicate.predicateWithFormat("objectID == %@", id);
    var result = allLibraryStyles.filteredArrayUsingPredicate(predicate);
    return result.firstObject();
}

function stylesFromLibrary(library, styleType) {
    var libraryDocumentData = library.document();
    var allLibraryTextStyles = libraryDocumentData.layerTextStyles().objects();
    var allLibraryLayerStyles = libraryDocumentData.layerStyles().objects();
    var allLibraryStyles;
    if (styleType == "text") {
        allLibraryStyles = allLibraryTextStyles;
    }
    if (styleType == "layer") {
        allLibraryStyles = allLibraryLayerStyles;
    }
    return allLibraryStyles;
}
