var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    if (selection.count() > 0) {

        // Deselect all layers
        if (page.deselectAllLayers) {
            page.deselectAllLayers();
        } else {
            page.changeSelectionBySelectingLayers(nil);
        }

        var loop = selection.objectEnumerator();
        var layer;
        while (layer = loop.nextObject()) {
            if (
                (layer.class() == "MSShapeGroup" && layer.layers().count() > 1) ||
                layer.class() == "MSLayerGroup" ||
                layer.class() == "MSArtboardGroup" ||
                layer.class() == "MSSymbolMaster"
            ) {
                var loopChild = layer.layers().objectEnumerator();
                var child;
                while (child = loopChild.nextObject()) {
                    // Fix Sketch 45
                    if (sketch.version.sketch < 45) {
                        child.select_byExpendingSelection(true, true);
                    } else {
                        child.select_byExtendingSelection(true, true);
                    }
                }
            }
        }

    } else {
        doc.showMessage("Please select at least 1 group or artboard.");
    }

};
