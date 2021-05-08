var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var help = require("../modules/Help");
    var identifier = __command.identifier();
    var doc = context.document;
    var selection = context.selection;
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {

        var artboard = layer.parentArtboard();

        if (artboard) {
            var rectOfChildLayers = help.getMSRectFromMSLayers(artboard.layers());
            var width = Math.ceil(rectOfChildLayers.x() + rectOfChildLayers.width());
            var height = Math.ceil(rectOfChildLayers.y() + rectOfChildLayers.height());
            // Adjust content on resize
            if (artboard.resizesContent()) {
                artboard.setResizesContent(false);
                if (identifier == "resize_to_fit_width") {
                    artboard.frame().setWidth(width);
                }
                if (identifier == "resize_to_fit_height") {
                    artboard.frame().setHeight(height);
                }
                artboard.setResizesContent(true);
            } else {
                if (identifier == "resize_to_fit_width") {
                    artboard.frame().setWidth(width);
                }
                if (identifier == "resize_to_fit_height") {
                    artboard.frame().setHeight(height);
                }
            }
        } else {
            doc.showMessage('"' + layer.name() + '" is not an artboard or not inside an artboard.');
        }

    }

};
