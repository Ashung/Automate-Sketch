

var onRun = function(context) {
    
    var document = require("sketch/dom").getSelectedDocument();
    var currentPage = document.selectedPage;

    document.pages.forEach(function(page) {

        document.selectedPage = page;

        // Fit canvas
        var contentDrawView = document.sketchObject.contentDrawView();
        contentDrawView.centerLayersInCanvas();

        // Collapse All Groups
        page.layers.forEach(function(layer) {
            layer.sketchObject.setLayerListExpandedType(1);
        });

    });

    document.selectedPage = currentPage;


};