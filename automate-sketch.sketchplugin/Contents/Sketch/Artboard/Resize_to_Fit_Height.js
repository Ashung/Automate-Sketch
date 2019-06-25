var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var doc = context.document;
    var selection = context.selection;
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {

        var artboard = layer.parentArtboard();

        if (artboard) {
            var rectOfChildLayers = getRectFromLayers(artboard);
            var height = Math.ceil(rectOfChildLayers.y() + rectOfChildLayers.height());
            // Adjust content on resize
            if (artboard.resizesContent()) {
                artboard.setResizesContent(false);
                artboard.frame().setHeight(height);
                artboard.setResizesContent(true);
            } else {
                artboard.frame().setHeight(height);
            }
        } else {
            doc.showMessage('"' + layer.name() + '" is not an artboard or not inside an artboard.');
        }

    }

};

function getRectFromLayers(parentGroup) {

    var rectArray = NSMutableArray.alloc().init();

    var loopLayers = parentGroup.layers().objectEnumerator();
    var layer;
    while (layer = loopLayers.nextObject()) {
        rectArray.addObject(layer.frame());
    }

    var rect = MSRect.rectWithUnionOfRects(rectArray);

    // Return {x, y, width, height}
    return rect;

}
