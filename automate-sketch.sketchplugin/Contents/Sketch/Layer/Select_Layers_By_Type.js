var sketch = require("sketch");

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

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;
    var appVersion = sketch.version.sketch;

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

var selectAllLockedLayerInSelection = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    page.changeSelectionBySelectingLayers(nil);

    var count = 0;
    if (selection.count() > 0) {
        selection.forEach(function(layer) {
            layer.children().forEach(function(child) {
                if (child.isLocked()) {
                    child.select_byExtendingSelection(true, true);
                    count ++;
                }
            });
        });
    } else {
        page.children().forEach(function(child) {
            if (child.isLocked()) {
                child.select_byExtendingSelection(true, true);
                count ++;
            }
        }); 
    }

    if (count == 0) {
        doc.showMessage("No locked layer found.");
    } else {
        doc.showMessage("Select " + totalCount + " locked layer" + (count > 1 ? "s" : "") + ".");
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
    
    var layerType = require("../modules/Type");
    var appVersion = sketch.version.sketch;
    var count = 0;
    
    if (
        parent.containsLayers() && parent.class() != "MSShapeGroup"
    ) {

        if (type == "group") {
            var loopLayers = parent.layers().objectEnumerator();
            var layer;
            while (layer = loopLayers.nextObject()) {
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
                    var loopLayersInArtboard = layer.layers().objectEnumerator();
                    var layerInArtboard;
                    while (layerInArtboard = loopLayersInArtboard.nextObject()) {
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
            var loopChildren = parent.children().objectEnumerator();
            var layer;
            while (layer = loopChildren.nextObject()) {
                if (
                    (type == "text" && layerType.isText(layer)) ||
                    (type == "shape" && layerType.isShape(layer)) ||
                    (type == "image" && layerType.isBitmap(layer)) ||
                    (type == "slice" && layerType.isSlice(layer)) ||
                    (type == "symbol instance" && layerType.isSymbolInstance(layer))
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
