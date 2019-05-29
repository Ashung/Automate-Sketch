var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var doc = context.document;
    var selection = context.selection;

    if (selection.count() > 0) {
        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            if (layer.class() != "MSArtboardGroup" && layer.class() != "MSSymbolMaster") {
                var artboard = MSArtboardGroup.alloc().init();
                artboard.setName(layer.name());
                artboard.setFrame(MSRect.alloc().initWithRect(layer.absoluteRect().rect()));
                doc.currentPage().addLayers([artboard]);
                artboard.frame().setConstrainProportions(false);
                layer.moveToLayer_beforeLayer(artboard, nil);

                if (layer.class() == "MSLayerGroup") {
                    var layerGroup = artboard.layers().firstObject();
                    layerGroup.ungroup();
                }
            }
        }
    }

};
