var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var document = context.document;
    var selection = context.selection;
    var currentPage = document.currentPage();

    if (selection.count() == 0) {
        document.showMessage("Please select a layer.");
        return;
    }

    var parentArtboards = NSMutableSet.alloc().init();
    selection.forEach(function(layer) {
        if (layer.parentArtboard()) {
            parentArtboards.addObject(layer.parentArtboard());
        }
    });

    if (parentArtboards.allObjects().count() == 0) {
        document.showMessage("Selected layers not in artboard.");
        return;
    }

    currentPage.changeSelectionBySelectingLayers(parentArtboards.allObjects());

};
