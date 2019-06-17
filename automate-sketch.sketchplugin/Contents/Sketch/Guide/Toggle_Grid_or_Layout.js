var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var util = require("util");
    var identifier = context.command.identifier();
    var document = context.document;
    var page = document.currentPage();
    var artboards = util.toArray(page.artboards());

    if (identifier == "hide_or_show_all_grid") {
        var artboardGridIsEnabled = artboards.find(function(artboard) {
            return artboard.grid() && artboard.grid().isEnabled() == true;
        });
    
        artboards.forEach(function(artboard) {
            if (artboardGridIsEnabled) {
                if (artboard.grid()) {
                    artboard.grid().setIsEnabled(false);
                }
            } else {
                if (!artboard.grid()) {
                    artboard.setGrid(MSDefaultGrid.defaultGrid());
                }
                artboard.grid().setIsEnabled(true);
            }
        });
    }

    if (identifier == "hide_or_show_all_layout") {
        var artboardLayoutIsEnabled = artboards.find(function(artboard) {
            return artboard.layout() && artboard.layout().isEnabled() == true;
        });
    
        artboards.forEach(function(artboard) {
            if (artboardLayoutIsEnabled) {
                if (artboard.layout()) {
                    artboard.layout().setIsEnabled(false);
                }
            } else {
                if (!artboard.layout()) {
                    artboard.setLayout(MSDefaultLayoutGrid.defaultLayout());
                }
                artboard.layout().setIsEnabled(true);
            }
        });
    }

};