var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var document = context.document;
    var currentPage = document.currentPage();
    var selection = context.selection;

    if (selection.count() < 2) {
        document.showMessage("Please select at least 2 layers.");
        return;
    }

    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", false, "localizedStandardCompare:"
    );
    var sortedLayers = selection.mutableCopy();
    sortedLayers = sortedLayers.sortedArrayUsingDescriptors([sortDescriptor]);

    var tempLayer = MSLayer.alloc().init();
    selection.firstObject().parentGroup().insertLayer_beforeLayer(tempLayer, selection.firstObject());

    var loopLayers = sortedLayers.objectEnumerator();
    var layer;
    while (layer = loopLayers.nextObject()) {
        layer.moveToLayer_beforeLayer(layer.parentGroup(), tempLayer);
    }

    tempLayer.removeFromParent();

    currentPage.changeSelectionBySelectingLayers(nil);
    currentPage.changeSelectionBySelectingLayers(sortedLayers);
    context.selection = sortedLayers;
};
