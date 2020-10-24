var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    var count = 0;

    if (selection.count() > 0) {

        var loop = selection.objectEnumerator();
        while (layer = loop.nextObject()) {
            deleteEmptyGroups(layer, function(_count) {
                count += _count;
            });
        }

    } else {
        deleteEmptyGroups(page, function(_count) {
            count = _count;
        });
    }


    var message;
    if (count > 1) {
        message = "🎉 " + count + " empty groups removed.";
    } else if (count == 1) {
        message = "😊 1 empty group removed.";
    } else {
        message = "👍 Your document has no empty group.";
    }
    doc.showMessage(message);

};

function deleteEmptyGroups(layer, callback) {

    var count = 0;

    if (layer.class() == "MSLayerGroup" && !layer.containsLayers()) {
        layer.removeFromParent();
        count ++;
    } else {
        if (
            layer.containsLayers() && 
            (
                layer.class() != "MSShapeGroup" ||
                layer.class() != "MSRectangleShape" ||
                layer.class() != "MSOvalShape" ||
                layer.class() != "MSShapePathLayer"
            )
        ) {
            var loopChildren = layer.children().objectEnumerator();
            while (childLayer = loopChildren.nextObject()) {
                if (childLayer.class() == "MSLayerGroup" && !childLayer.containsLayers()) {
                    childLayer.removeFromParent();
                    count ++;
                }
            }
        }
    }

    callback(count);
}
