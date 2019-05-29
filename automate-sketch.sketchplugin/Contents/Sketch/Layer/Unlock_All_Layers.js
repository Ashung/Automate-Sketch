var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");
    var doc = context.document;
    var page = doc.currentPage();
    var layers = page.children();
    var loop = layers.objectEnumerator();
    while (layer = loop.nextObject()) {
        if (layer.isLocked()) {
            layer.setIsLocked(false);
        }
    }
};
