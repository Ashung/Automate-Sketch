var sketch = require('sketch')

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var version = sketch.version.sketch;

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    if (selection.count() > 0) {

        // Resort the array
        var layers = selection.mutableCopy();
        layers.sort(function(a, b) {
            return page.children().indexOfObject(a) - page.children().indexOfObject(b);
        });

        // Deselect all layers
        deselectAllLayers(page);

        // Select layers
        var loop = layers.objectEnumerator();
        var layer;
        while (layer = loop.nextObject()) {
            if (layer.parentGroup().class() != "MSPage") {
                selectLayer(layer.parentGroup());
            } else {
                selectLayer(layer);
            }
        }

        // Deselect child layers.
        var newSelectedLayers;
        if (version >= 84) {
            newSelectedLayers = page.selectedLayers();
        } else {
            newSelectedLayers = page.selectedLayers().layers();
        }
        var loopSelectedLayers = newSelectedLayers.objectEnumerator();
        var selectedLayer;
        while (selectedLayer = loopSelectedLayers.nextObject()) {
            deselectAllChildAndSelf(selectedLayer, false);
        }

    } else {
        doc.showMessage("Please select at least 1 layer.");
    }

};

function selectLayer(layer) {
    if (sketch.version.sketch < 45) {
        layer.select_byExpendingSelection(true, true);
        if (!layer.selectedInLayerList()) {
            deselectAllChildAndSelf(layer, true);
            layer.select_byExpendingSelection(true, true);
        }
    } else {
        layer.select_byExtendingSelection(true, true);
        if (!layer.isSelected()) {
            deselectAllChildAndSelf(layer, true);
            layer.select_byExtendingSelection(true, true);
        }
    }
}

function deselectAllChildAndSelf(layer, self) {
    var loop = layer.children().objectEnumerator();
    var child;
    while (child = loop.nextObject()) {
        if (self == false && child == layer) {
            continue;
        }
        if (sketch.version.sketch < 45) {
            child.select_byExpendingSelection(false, true);
        } else {
            child.select_byExtendingSelection(false, true);
        }
    }
}

function deselectAllLayers(page) {
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }
}
