var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var document = require("sketch/dom").getSelectedDocument();
    var currentPage = document.selectedPage;

    document.pages.forEach(function(page) {
        // Fit canvas
        var contentDrawView = document.sketchObject.contentDrawView();
        contentDrawView.centerLayersInCanvas();

        // Collapse All Groups
        currentPage.layers.forEach(function(layer) {
            layer.sketchObject.setLayerListExpandedType(1);
        });
        // context.document.loadLayerListPanel();
    });

    document.selectedPage = currentPage;

};