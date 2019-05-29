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
            removeHiddenLayers(layer, function(_count) {
                count += _count;
            });
        }

    } else {
        removeHiddenLayers(page, function(_count) {
            count = _count;
        });
    }

    var message;
    if (count > 1) {
        message = "🎉 " + count + " hidden layers removed.";
    } else if (count == 1) {
        message = "😊 1 hidden layer removed.";
    } else {
        message = "👍 Your document has no hidden layers.";
    }
    doc.showMessage(message);

};

function removeHiddenLayers(parent, callback) {

    var count = 0;

    if (parent.containsLayers()) {
        var loop = parent.children().objectEnumerator();
        var layer;
        while (layer = loop.nextObject()) {
            if (!layer.isVisible()) {
                layer.removeFromParent();
                count ++;
            }
        }
    }

    callback(count);
}
