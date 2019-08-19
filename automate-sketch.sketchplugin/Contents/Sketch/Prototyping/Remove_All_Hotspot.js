var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Prototyping");

    var hotspotLayerCount = 0;
    var linkLayerCount = 0;

    var document = context.document;
    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var predicate = NSPredicate.predicateWithFormat("flow != null");
        var hotspotLayers = page.children().filteredArrayUsingPredicate(predicate);
        var loopHotspotLayers = hotspotLayers.objectEnumerator();
        var hotspotLayer;
        while (hotspotLayer = loopHotspotLayers.nextObject()) {
            if (hotspotLayer.class() == "MSHotspotLayer") {
                hotspotLayer.removeFromParent();
                hotspotLayerCount ++;
            }
            else {
                hotspotLayer.setFlow(null);
                linkLayerCount ++;
            }
        }
    }

    if (hotspotLayerCount != 0 || linkLayerCount != 0) {
        document.showMessage(`Remove ${hotspotLayerCount} hotspot layers, ${linkLayerCount} layers with link.`);
    }
    else {
        document.showMessage("No hotspot layers.");
    }

};
