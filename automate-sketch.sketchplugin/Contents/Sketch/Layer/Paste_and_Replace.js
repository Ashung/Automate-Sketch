var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var preferences = require("../modules/Preferences");
    var type = require("../modules/Type");

    var appVersion = MSApplicationMetadata.metadata().appVersion;
    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    var pasteboard = NSPasteboard.generalPasteboard();
    if (pasteboard.pasteboardItems().count() > 0) {

        // Check Pasteboard type
        var pasteboardType = pasteboard.pasteboardItems().firstObject().types().firstObject();
        var supportedPasteboardTypes = [
            "public.jpeg",
            "public.gif",
            "public.png",
            "public.tiff", // Photoshop
            "com.adobe.pdf",
            "com.adobe.illustrator.aicb", // Illustrator
            "com.bohemiancoding.sketch.v3", // Sketch
            "com.seriflabs.persona.nodes" // Affinity Designer
        ];

        if (supportedPasteboardTypes.indexOf(String(pasteboardType))) {

            if (selection.count() > 0) {

                // Layer will be selected.
                var newLayers = NSMutableArray.alloc().init();

                var loopSelection = selection.objectEnumerator();
                while (oldLayer = loopSelection.nextObject()) {

                    var pasteboardLayers = getPasteboardLayers(context);
                    var parentGroup = oldLayer.parentGroup();

                    if (MSApplicationMetadata.metadata().appVersion >= 50) {
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
                    if (MSApplicationMetadata.metadata().appVersion >= 52) {
                        group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers());
                    } else {
                        group = MSLayerGroup.groupFromLayers(pasteboardLayers.layers());
                    }
                    group.moveToLayer_beforeLayer(parentGroup, oldLayer);
                    
                    // Position
                    if (preferences.get("pasteAndReplaceLayerPosition") == "1") {
                        group.frame().setMidX(Math.round(oldLayer.frame().midX()));
                        group.frame().setMidY(Math.round(oldLayer.frame().midY()));
                    } else {
                        group.frame().setX(Math.round(oldLayer.frame().x()));
                        group.frame().setY(Math.round(oldLayer.frame().y()));
                    }

                    // oldLayer is a mask
                    if (
                        oldLayer.hasClippingMask() &&
                        pasteboardLayers.layers().layers().count() == 1 &&
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
                        if (
                            pasteboardLayers.layers().layers().count() == 1 &&
                            pasteboardLayers.layers().firstLayer().class() == "MSSymbolMaster"
                        ) {
                            changeAllInstancesToSymbol(context, oldSymbolMaster, newSymbolMaster);
                        }
                        // Change symbol's instances into group
                        else {
                            changeAllInstancesToGroup(context, oldSymbolMaster);
                        }
                    }

                    oldLayer.removeFromParent();

                    newLayers.addObjectsFromArray(pasteboardLayers.layers().layers());

                    if (parentGroup.class() == "MSLayerGroup") {
                        if (MSApplicationMetadata.metadata().appVersion >= 53) {
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

            } else {
                document.showMessage("Please select at least 1 layer.");
            }


        } else {
            document.showMessage("Please copy a Sketch layer first.");
        }

    } else {
        document.showMessage("Clipboard is empty.");
    }

}

function getPasteboardLayers(context) {
    var pasteboard = NSPasteboard.generalPasteboard();
    var pasteboardManager = NSApp.delegate().pasteboardManager();
    if (MSApplicationMetadata.metadata().appVersion >= 48) {
        var document = context.document;
        var pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options(pasteboard, document.colorSpace(), nil);
    } else {
        var pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_options(pasteboard, nil);
    }
    return pasteboardLayers;
}

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
    var loopPages = context.document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var instances = page.allSymbolInstancesInChildren().allObjects();
        var loopInstances = instances.objectEnumerator();
        var instance;
        while (instance = loopInstances.nextObject()) {
            if (instance.symbolMaster()) {
                if (instance.symbolMaster() == symbolMaster) {
                    instance.detachByReplacingWithGroup();
                }
            }
        }
    }
}
