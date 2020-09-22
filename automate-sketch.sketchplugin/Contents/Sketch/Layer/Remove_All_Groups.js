var onRun = function (context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    var count = 0;

    if (selection.count() > 0) {

        var loop = selection.objectEnumerator();
        while (layer = loop.nextObject()) {
            deleteGroups(layer, function (_count) {
                count += _count;
            });
        }

    } else {
        deleteGroups(page, function (_count) {
            count = _count;
        });
    }


    var message;
    if (count > 1) {
        message = "🎉 " + count + " groups removed.";
    } else if (count == 1) {
        message = "😊 1 group removed.";
    } else {
        message = "👍 Your document has no group.";
    }
    doc.showMessage(message);

};

function deleteGroups(layer, callback) {

    var count = 0;

    if (layer.class() == "MSLayerGroup") {
        layer.ungroup();
        count++;
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

                if (childLayer.class() == "MSLayerGroup") {
                    childLayer.ungroup();
                    count++;
                }
            }
        }
    }

    callback(count);
}

