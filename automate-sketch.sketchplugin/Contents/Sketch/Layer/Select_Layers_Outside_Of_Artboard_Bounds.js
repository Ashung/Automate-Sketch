var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var artboardCount = 0;
    var pageCount = 0;
    var layerCount = 0;

    document.pages().forEach(function(page) {

        page.artboards().forEach(function(artboard) {
            artboard.children().forEach(function(child) {
                if (
                    child.class() == "MSSliceLayer" ||
                    child.class() == "MSLayerGroup" ||
                    child.class() == "MSShapeGroup" ||
                    child.class() == "MSRectangleShape" ||
                    child.class() == "MSOvalShape" ||
                    child.class() == "MSShapePathLayer" ||
                    child.class() == "MSBitmapLayer" ||
                    child.class() == "MSTextLayer" ||
                    child.class() == "MSHotspotLayer" ||
                    child.class() == "MSSymbolInstance"
                ) {
                    var width = artboard.frame().width();
                    var height = artboard.frame().height();
                    if (
                        child.frame().y() >= height ||
                        child.frame().x() >= width ||
                        child.frame().y() + child.frame().height() <= 0 ||
                        child.frame().x() + child.frame().width() <= 0
                    ) {
                        child.moveToLayer_beforeLayer(page, nil);
                        layerCount ++;
                    }
                }
            });
            artboardCount ++;
        });
        pageCount ++;
    });

    if (artboardCount == 0) {
        document.showMessage("This document has no artboards.");
        return;
    }

    if (layerCount > 0) {
        document.showMessage(`Select ${layerCount} layer(s) in ${artboardCount} artboard(s) and ${pageCount} page(s).`);
    } else {
        document.showMessage("No layers outside of artboard bounds.");
    }

};
