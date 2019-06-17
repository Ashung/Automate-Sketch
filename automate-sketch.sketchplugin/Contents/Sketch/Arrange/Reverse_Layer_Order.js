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

    var tempLayer = MSLayer.alloc().init();
    selection.firstObject().parentGroup().insertLayers_beforeLayer([tempLayer], selection.firstObject());

    for (var i = selection.count() - 1; i >= 0; i--) {
        var layer = selection.objectAtIndex(i);
        layer.moveToLayer_beforeLayer(layer.parentGroup(), tempLayer);
    }

    tempLayer.removeFromParent();

    currentPage.changeSelectionBySelectingLayers(nil);
    currentPage.changeSelectionBySelectingLayers(selection.reverseObjectEnumerator().allObjects());
    context.selection = selection.reverseObjectEnumerator().allObjects();

};
