var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var document = context.document;
    var page = document.currentPage();
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Please select a layer.");
        return;
    }

    // Deselect all layers
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }

    var layer = selection.firstObject();
    var parent = layer.parentGroup();

    var loopChild = parent.layers().objectEnumerator();
    var child;
    while (child = loopChild.nextObject()) {
        if (sketch.version.sketch < 45) {
            child.select_byExpendingSelection(true, true);
        } else {
            child.select_byExtendingSelection(true, true);
        }
    }

};
