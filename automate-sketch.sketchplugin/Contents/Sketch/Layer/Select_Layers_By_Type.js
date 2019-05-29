var selectAllGroupsInSelection = function(context) {
    selectLayersInSelectionByType(context, "group");
};

var selectAllTextsInSelection = function(context) {
    selectLayersInSelectionByType(context, "text");
};

var selectAllShapesInSelection = function(context) {
    selectLayersInSelectionByType(context, "shape");
};

var selectAllImagesInSelection = function(context) {
    selectLayersInSelectionByType(context, "image");
};

var selectAllSymbolInstancesInSelection = function(context) {
    selectLayersInSelectionByType(context, "symbol instance");
};

var selectAllSlicesInSelection = function(context) {
    selectLayersInSelectionByType(context, "slice");
};

var selectAllExportableInSelection = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var Sketch = require("../modules/Sketch");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;
    var appVersion = MSApplicationMetadata.metadata().appVersion;

    var totalCount = 0;

    // Fix Sketch 45
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }

    if (selection.count() > 0) {
        var loopSelection = selection.objectEnumerator();
        while (layer = loopSelection.nextObject()) {
            var loopChildren = layer.children().objectEnumerator();
            var child;
            while (child = loopChildren.nextObject()) {
                if (child.exportOptions().exportFormats().count() > 0 && child.class() != "MSSliceLayer") {
                    // Fix Sketch 45
                    if (appVersion < 45) {
                        child.select_byExpandingSelection(true, true);
                    } else {
                        child.select_byExtendingSelection(true, true);
                    }

                    totalCount ++;
                }
            }
        }
    } else {
        var loopChildren = page.children().objectEnumerator();
        var child;
        while (child = loopChildren.nextObject()) {
            if (child.exportOptions().exportFormats().count() > 0 && child.class() != "MSSliceLayer") {
                // Fix Sketch 45
                if (appVersion < 45) {
                    child.select_byExpandingSelection(true, true);
                } else {
                    child.select_byExtendingSelection(true, true);
                }

                totalCount ++;
            }
        }
    }

    if (totalCount == 0) {
        doc.showMessage("No exportable layers found.");
    } else if (totalCount == 1) {
        doc.showMessage("Select 1 exportable layer.");
    } else {
        doc.showMessage("Select " + totalCount + " exportable layers.");
    }

};

function selectLayersInSelectionByType(context, type) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    var totalCount = 0;

    // Fix Sketch 45
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }

    if (selection.count() == 0) {
        selectLayersInParent_byType(page, type, function(count) {
            totalCount = count;
        });
    } else {
        var loop = selection.objectEnumerator();
        while (layer = loop.nextObject()) {
            selectLayersInParent_byType(layer, type, function(count) {
                totalCount += count;
            });
        }
    }

    if (totalCount == 0) {
        doc.showMessage(`No ${type} layers found.`);
    } else if (totalCount == 1) {
        doc.showMessage(`Select 1 ${type} layer.`);
    } else {
        doc.showMessage(`Select ${totalCount} ${type} layers.`);
    }

}

function selectLayersInParent_byType(parent, type, callback) {

    var appVersion = MSApplicationMetadata.metadata().appVersion;

    var count = 0;

    if (
        parent.containsLayers() && parent.class() != "MSShapeGroup"
    ) {

        if (type == "group") {
            var loopLayes = parent.layers().objectEnumerator();
            var layer;
            while (layer = loopLayes.nextObject()) {
                if (layer.class() == "MSLayerGroup") {
                    // Fix Sketch 45
                    if (appVersion < 45) {
                        layer.select_byExpandingSelection(true, true);
                    } else {
                        layer.select_byExtendingSelection(true, true);
                    }
                    count ++;
                }
                if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
                    var loopLayesInArtboard = layer.layers().objectEnumerator();
                    var layerInArtboard;
                    while (layerInArtboard = loopLayesInArtboard.nextObject()) {
                        if (layerInArtboard.class() == "MSLayerGroup") {
                            // Fix Sketch 45
                            if (appVersion < 45) {
                                layerInArtboard.select_byExpandingSelection(true, true);
                            } else {
                                layerInArtboard.select_byExtendingSelection(true, true);
                            }
                            count ++;
                        }
                    }
                }
            }
        } else {
            var loopChildrens = parent.children().objectEnumerator();
            var layer;
            while (layer = loopChildrens.nextObject()) {
                
                if (
                    (type == "text" && layer.class() == "MSTextLayer") ||
                    (type == "shape" && Sketch.isShapeLayer(layer)) ||
                    (type == "image" && layer.class() == "MSBitmapLayer") ||
                    (type == "slice" && layer.class() == "MSSliceLayer") ||
                    (type == "symbol instance" && layer.class() == "MSSymbolInstance")
                ) {
                    // Fix Sketch 45
                    if (appVersion < 45) {
                        layer.select_byExpandingSelection(true, true);
                    } else {
                        layer.select_byExtendingSelection(true, true);
                    }
                    count ++;
                }
            }
        }

    }

    if (callback && typeof(callback) == "function") {
        callback(count);
    }

}
