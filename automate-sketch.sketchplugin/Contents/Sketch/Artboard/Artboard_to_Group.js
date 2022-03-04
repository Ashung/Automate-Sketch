var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var sketch = require("sketch");

    var document = context.document;
    var selection = context.selection;
    
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSArtboardGroup");
    var artboardsInSelection = selection.filteredArrayUsingPredicate(predicate);

    if (artboardsInSelection.count() == 0) {
        document.showMessage("Select artboard first.");
    }

    var loopArtboards = artboardsInSelection.objectEnumerator();
    while (artboard = loopArtboards.nextObject()) {

        // Add background layer
        if (artboard.hasBackgroundColor()) {
            var rectangle = MSRectangleShape.alloc().init();
            rectangle.setRect(CGRectMake(0, 0, artboard.frame().width(), artboard.frame().height()));
            
            var backgroundLayer;
            if (sketch.version.sketch >= 52) {
                backgroundLayer = rectangle;
            } else {
                backgroundLayer = MSShapeGroup.shapeWithPath(rectangle);
            }

            backgroundLayer.setName("background");
            backgroundLayer.style().addStylePartOfType(0);
            backgroundLayer.style().fills().firstObject().setColor(artboard.backgroundColor());
            artboard.insertLayer_beforeLayer(backgroundLayer, artboard.firstLayer());
        }

        // Create new group for all layers in artboard
        var newGroup;
        if (sketch.version.sketch >= 84) {
            newGroup = MSLayerGroup.groupWithLayers(artboard.layers());
        } else {
            var layerArray = MSLayerArray.arrayWithLayers(artboard.layers());
            if (sketch.version.sketch >= 83) {
                newGroup = MSLayerGroup.groupWithLayers(layerArray.layers());
            } else if (sketch.version.sketch >= 52) {
                newGroup = MSLayerGroup.groupWithLayers(layerArray);
            } else {
                newGroup = MSLayerGroup.groupFromLayers(layerArray);
            }
        }
        newGroup.setName(artboard.name());

        artboard.ungroup();

    }

};
