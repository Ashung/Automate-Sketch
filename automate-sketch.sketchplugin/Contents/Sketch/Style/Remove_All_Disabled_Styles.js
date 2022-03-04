var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var version = sketch.version.sketch;
    var document = context.document;
    var currentPage = document.currentPage();
    var selection = context.selection;
    var selectedLayers;
    if (version >= 84) {
        selectedLayers = currentPage.selectedLayers();
    } else {
        selectedLayers = currentPage.selectedLayers().layers();
    }

    // Selected layer
    if (selection.count() > 0) {
        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            var loopChild = layer.children().objectEnumerator();
            var child;
            while (child = loopChild.nextObject()) {
                removeUnusedStyles(context, child);
            }
        }
    }
    // Current page
    else {
        var loopChild = currentPage.children().objectEnumerator();
        var child;
        while (child = loopChild.nextObject()) {
            removeUnusedStyles(context, child);
        }
    }

    // Restore selection
    currentPage.changeSelectionBySelectingLayers(selectedLayers);

};

function removeUnusedStyles(context, layer) {
    var document = context.document;
    layer.select_byExtendingSelection(true, false);
    if (layer.isKindOfClass(MSStyledLayer)) {
        NSApp.sendAction_to_from_("removeUnusedStyles:", nil, document);
    }
    layer.select_byExtendingSelection(false, false);
}
