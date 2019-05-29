var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var document = context.document;
    var selection = context.selection;
    var selectedLayer = selection.firstObject();
    var page = document.currentPage();

    if (selectedLayer == null || selectedLayer.sharedStyle() == null) {
        document.showMessage("Please select a layer with Shared Style.");
        return;
    }

    var predicate = NSPredicate.predicateWithFormat("sharedStyle.objectID == %@", selectedLayer.sharedStyleID());
    var childLayers = page.children();
    var layersWithSameStyle = childLayers.filteredArrayUsingPredicate(predicate);

    page.changeSelectionBySelectingLayers(layersWithSameStyle);

    document.showMessage(`Select ${layersWithSameStyle.count()} layer${layersWithSameStyle.count() > 1 ? "s" : ""} with style "${selectedLayer.sharedStyle().name()}".`);
};