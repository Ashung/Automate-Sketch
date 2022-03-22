var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require('sketch');
    var preferences = require("../modules/Preferences");
    var pasteboard = require("../modules/Pasteboard");
    var type = require("../modules/Type");
    var appVersion = sketch.version.sketch;
    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    if (pasteboard.isEmpty()) {
        sketch.UI.message("Clipboard is empty.");
        return;
    }

    if (!pasteboard.isSupportedType()) {
        sketch.UI.message("Please copy a Sketch layer first.");
        return;
    }

    if (selection.count() == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    // Layer will be selected.
    var newLayers = NSMutableArray.alloc().init();

    var loopSelection = selection.objectEnumerator();
    while (oldLayer = loopSelection.nextObject()) {

        var pasteboardLayers = pasteboard.getPasteboardLayers();
        var parentGroup = oldLayer.parentGroup();

        if (appVersion >= 50) {
            pasteboardLayers.insertInGroup_atPosition_afterLayer_viewport_fitToParent(
                parentGroup,
                oldLayer.frame().rect().origin,
                oldLayer,
                document.contentDrawView().viewPort(),
                false
            );
        } else {
            pasteboardLayers.insertInGroup_atPosition_afterLayer(
                parentGroup,
                oldLayer.frame().rect().origin,
                oldLayer
            );
        }

        var group;
        if (appVersion >= 84) {
            group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers());
        } else if (appVersion >= 83) {
            group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers().layers());
        } else if (appVersion >= 52) {
            group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers());
        } else {
            group = MSLayerGroup.groupFromLayers(pasteboardLayers.layers());
        }
        group.moveToLayer_beforeLayer(parentGroup, oldLayer);
        
        // Position
        var position = preferences.get("pasteAndReplaceLayerPosition");
        var x, y;
        var left = oldLayer.frame().x();
        var right = oldLayer.frame().x() + oldLayer.frame().width() - group.frame().width();
        var top = oldLayer.frame().y();
        var bottom = oldLayer.frame().y() + oldLayer.frame().height() - group.frame().height();
        var centerX = oldLayer.frame().x() + oldLayer.frame().width() / 2 - group.frame().width() / 2;
        var centerY = oldLayer.frame().y() + oldLayer.frame().height() / 2 - group.frame().height() / 2;
        // Bottom-right
        if (position == "8") {
            x = right;
            y = bottom;
        }
        // Bottom-center
        else if (position == "7") {
            x = centerX;
            y = bottom;
        }
        // Bottom-left
        else if (position == "6") {
            x = left;
            y = bottom;
        }
        // Right-center
        else if (position == "5") {
            x = right;
            y = centerY;
        }
        // Left-center
        else if (position == "4") {
            x = left;
            y = centerY;
        }
        // Top-right
        else if (position == "3") {
            x = right;
            y = top;
        }
        // Top-center
        else if (position == "2") {
            x = centerX;
            y = top;
        }
        // Center
        else if (position == "1") {
            x = centerX;
            y = centerY;
        }
        // Top-left
        else {
            x = left;
            y = top;
        }
        group.frame().setX(Math.round(x));
        group.frame().setY(Math.round(y));

        // oldLayer is a mask
        var count;
        if (appVersion >= 84) {
            count = pasteboardLayers.layers().count();
        } else {
            count = pasteboardLayers.layers().layers().count();
        }
        if (
            oldLayer.hasClippingMask() &&
            count == 1 &&
            type.isShape(group.layers().firstObject())
        ) {
            group.layers().firstObject().setHasClippingMask(true);
        }

        group.ungroup();

        // Replace symbol master
        if (oldLayer.class() == "MSSymbolMaster") {
            var newSymbolMaster = pasteboardLayers.layers().firstLayer();
            var oldSymbolMaster = oldLayer;
            // Replace with another symbol master
            var doChangeAllInstancesToSymbol;
            if (appVersion >= 84) {
                doChangeAllInstancesToSymbol = pasteboardLayers.layers().count() == 1 && pasteboardLayers.layers().firstObject().class() == "MSSymbolMaster";
            } else {
                doChangeAllInstancesToSymbol = pasteboardLayers.layers().layers().count() == 1 && pasteboardLayers.layers().firstLayer().class() == "MSSymbolMaster";
            }
            if (doChangeAllInstancesToSymbol) {
                changeAllInstancesToSymbol(context, oldSymbolMaster, newSymbolMaster);
            } else {
                // Change symbol's instances into group
                changeAllInstancesToGroup(context, oldSymbolMaster);
            }
        }

        oldLayer.removeFromParent();

        if (appVersion >= 84) {
            newLayers.addObjectsFromArray(pasteboardLayers.layers());
        } else {
            newLayers.addObjectsFromArray(pasteboardLayers.layers().layers());
        }

        if (parentGroup.class() == "MSLayerGroup") {
            if (appVersion >= 53) {
                parentGroup.fixGeometryWithOptions(1);
            } else {
                parentGroup.resizeToFitChildrenWithOption(1);
            }
        }

    }

    if (appVersion >= 45) {
        page.changeSelectionBySelectingLayers(newLayers);
    } else {
        var loopNewLayers = newLayers.objectEnumerator();
        while (layer = loopNewLayers.nextObject()) {
            layer.select_byExpandingSelection(true, true);
        }
    }

};

function changeAllInstancesToSymbol(context, oldSymbolMaster, newSymbolMaster) {
    var loopPages = context.document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var instances = page.allSymbolInstancesInChildren().allObjects();
        var loopInstances = instances.objectEnumerator();
        var instance;
        while (instance = loopInstances.nextObject()) {
            if (instance.symbolMaster()) {
                if (instance.symbolMaster() == oldSymbolMaster) {
                    instance.changeInstanceToSymbol(newSymbolMaster);
                }
            }
        }
    }
}

function changeAllInstancesToGroup(context, symbolMaster) {
    var sketch = require('sketch');
    var version = sketch.version.sketch;
    var loopPages = context.document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var instances = page.allSymbolInstancesInChildren().allObjects();
        var loopInstances = instances.objectEnumerator();
        var instance;
        while (instance = loopInstances.nextObject()) {
            if (instance.symbolMaster()) {
                if (instance.symbolMaster() == symbolMaster) {
                    if (version >= 76) {
                        instance.detachStylesAndReplaceWithGroup();
                    } else if (version >= 53) {
                        instance.detachStylesAndReplaceWithGroupRecursively(false);
                    } else {
                        instance.detachByReplacingWithGroup();
                    }
                }
            }
        }
    }
}
