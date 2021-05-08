var sketch = require('sketch')

var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    if (selection.count() == 0) {
        // Remove Redundant Groups in Current Page
        removeRedundantGroups(page);
    } else {
        // Remove Redundant Groups in Selected Object
        var loop = selection.objectEnumerator();
        var layer;
        while (layer = loop.nextObject()) {
            removeRedundantGroups(layer);
        }
    }

};

function removeRedundantGroups(layer) {
    if (layer.class() == "MSLayerGroup") {
        // Ungroup Redundant Groups
        if (layer.layers().count() == 1) {
            var child = layer.layers().firstObject();
            if(groupIsSafeToUngroup(layer)) {
                layer.ungroup();
            }
            if (child.class() == "MSLayerGroup") {removeRedundantGroups(child);}
        } else {
            for (var i = 0; i < layer.layers().count(); i++) {
                var childLayer = layer.layers().objectAtIndex(i);
                removeRedundantGroups(childLayer);
            }
        }
        // Remove Empty Groups
        if (layer.layers().count() == 0) {
            layer.removeFromParent();
        }
    } else {
        if (layer.containedLayers() && layer.class() != "MSShapeGroup") {
            for (var i = 0; i < layer.layers().count(); i++) {
                var childLayer = layer.layers().objectAtIndex(i);
                removeRedundantGroups(childLayer);
            }
        }
    }
}

function groupIsSafeToUngroup(group) {
    var noOpacity = (group.style().contextSettings().opacity() == 1),
        noBlending = (group.style().hasBlending() == 0),
        noShadows = (group.style().hasEnabledShadow() == 0),
        noExportOptions = (group.exportOptions().exportFormats().count() == 0);

    // Sketch 44+ resizing constraint
    if (sketch.version.sketch >= 44) {
        var noResizingConstraint = (group.resizingConstraint() == 63);
        return noOpacity && noBlending && noShadows && noResizingConstraint && noExportOptions;
    } else {
        var noResizing = (group.resizingType() == 0);
        return noOpacity && noBlending && noShadows && noResizing && noExportOptions;
    }
}
