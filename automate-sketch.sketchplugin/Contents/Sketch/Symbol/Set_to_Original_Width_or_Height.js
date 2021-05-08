var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var doc = context.document;
    var selection = context.selection;
    var pluginIdentifier = context.command.identifier();

    if (selection.count() == 0) {
        doc.showMessage("Please select at least 1 symbol instance.");
        return;
    }

    var loop = selection.objectEnumerator();
    var layer;
    while (layer = loop.nextObject()) {
        if (layer.class() == "MSSymbolInstance") {

            var symbolMaster = layer.symbolMaster();
            var originalWidth = symbolMaster.frame().width();
            var originalHeight = symbolMaster.frame().height();

            layer.frame().setConstrainProportions(false);

            if (pluginIdentifier == "set_to_original_width" || pluginIdentifier == "set_to_original_size") {
                layer.frame().setWidth(originalWidth);
            }

            if (pluginIdentifier == "set_to_original_height" || pluginIdentifier == "set_to_original_size") {
                layer.frame().setHeight(originalHeight);
            }

            layer.setScale(1);

            if (layer.parentGroup().class() == "MSLayerGroup") {
                if (sketch.version.sketch >= 53) {
                    layer.parentGroup().fixGeometryWithOptions(1);
                } else {
                    layer.parentGroup().resizeToFitChildrenWithOption(1);
                }
            }

        }
    }

};
