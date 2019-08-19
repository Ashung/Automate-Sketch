var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Prototyping");

    var document = context.document;
    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {

        var predicate = NSPredicate.predicateWithFormat("className == %@", "MSHotspotLayer");
        var hotspotLayers = page.children().filteredArrayUsingPredicate(predicate);

        var loopHotspotLayers = hotspotLayers.objectEnumerator();
        var hotspotLayer;
        while (hotspotLayer = loopHotspotLayers.nextObject()) {
            var root = hotspotLayer.parentArtboard() || hotspotLayer.parentPage();
            hotspotLayer.moveToLayer_beforeLayer(root, nil);
        }

    }

};
