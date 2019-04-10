var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga(context, "Arrange");

    var document = context.document;
    var selection = context.selection;
    var currentPage = document.currentPage();
    var identifier = context.command.identifier();

    if (selection.count() < 2) {
        document.showMessage("Please select at least 2 layers.");
        return;
    }

    var sortDescriptor;
    if (identifier == "order_layers_by_x") {
        sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending("frame.x", true);
    } else {
        sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending("frame.y", true);
    }
    var sortDescriptorByName = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    var sortedLayers = selection.mutableCopy();
    sortedLayers = sortedLayers.sortedArrayUsingDescriptors([sortDescriptor, sortDescriptorByName]);

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
