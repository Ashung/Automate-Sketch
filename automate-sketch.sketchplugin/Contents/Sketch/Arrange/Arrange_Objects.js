var help = require("../modules/Help");

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var doc = context.document;
    var selection = context.selection;

    if (selection.count() > 1) {

        // Get last user input
        var defaultGapX = preferences.get("arrangeObjectGapX") || 100,
            defaultGapY = preferences.get("arrangeObjectGapY") || 100;

        var defaultSnapDistance = getMinHeightFromLayers(selection);

        // Dialog
        var dialog = new Dialog(
            "Arrange Objects",
            "Arrange selected layers or artboards."
        );

        var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
        var inputGapX = andInputGroup(view, 0, 60, 40, "Gap X", defaultGapX);
        var inputGapY = andInputGroup(view, 60, 60, 40, "Gap Y", defaultGapY);
        var inputSnapDistance = andInputGroup(view, 120, 100, 50, "Snap Distance", defaultSnapDistance);
        dialog.addView(view);

        dialog.setKeyOrder([inputGapX, inputGapY, inputSnapDistance]);

        var responseCode = dialog.run();
        if (responseCode == 1000) {

            var gapX = parseInt(inputGapX.stringValue()),
                gapY = parseInt(inputGapY.stringValue()),
                snapDistance = parseInt(inputSnapDistance.stringValue());

            // Save user input
            preferences.set("arrangeObjectGapX", gapX);
            preferences.set("arrangeObjectGapY", gapY);

            var origin = help.getMSRectFromMSLayers(selection);
            var globalLeft = Math.round(origin.x()),
                globalTop = Math.round(origin.y());

            var layers = selection.mutableCopy();

            arrangeLayers(layers, globalLeft, globalTop, gapX, gapY, globalTop, snapDistance);

            // Resize group to fit children
            if (selection.firstObject().parentGroup().class() == "MSLayerGroup") {
                if (sketch.version.sketch >= 53) {
                    selection.firstObject().parentGroup().fixGeometryWithOptions(1);
                } else {
                    selection.firstObject().parentGroup().resizeToFitChildrenWithOption(1);
                }
            }

        }

    } else {
        doc.showMessage("Please select at least 2 layers.");
    }

};

function andInputGroup(view, x, width, length, label, defaultString) {
    var ui = require("../modules/Dialog").ui;
    var labelView = ui.textLabel(label, [x, 25, width, 25]);
    view.addSubview(labelView);
    var inputView = ui.textField(defaultString, [x, 0, length, 25])
    var formatter = NSNumberFormatter.alloc().init().autorelease();
    formatter.setNumberStyle(NSNumberFormatterNoStyle);
    inputView.setFormatter(formatter);
    view.addSubview(inputView);
    return inputView;
}

function getMinHeightFromLayers(layers) {
    var layers = layers.mutableCopy().sort(function(a, b) {
        return a.frame().height() - b.frame().height();
    });
    return layers.firstObject().frame().height();
}

function arrangeLayers(layers, originX, originY, gapX, gapY, rowTop, snapDistance) {

    // Row layers
    var rowGroup = [];
    var loopLayers = layers.objectEnumerator();
    var layer;
    while (layer = loopLayers.nextObject()) {
        if (layer.frame().y() - originY < snapDistance) {
            rowGroup.push(layer);
        }
    }

    // Sort by position x
    rowGroup.sort(function(a, b) {
        return a.frame().x() - b.frame().x();
    });

    // Arrange layers in a row
    var x = originX;
    var newRowTop = rowTop;
    for (var i = 0; i < rowGroup.length; i++) {
        var rowGroupLayer = rowGroup[i];
        rowGroupLayer.frame().setX(x);
        rowGroupLayer.frame().setY(rowTop);
        x = x + Math.round(rowGroupLayer.frame().width()) + gapX;
        if (newRowTop < Math.round(rowTop + rowGroupLayer.frame().height())) {
            newRowTop = Math.round(rowTop + rowGroupLayer.frame().height())
        }
    }

    newRowTop += gapY;

    layers.removeObjectsInArray(rowGroup);

    if (layers.count() > 0) {
        arrangeLayers(layers, originX, help.getMSRectFromMSLayers(layers).y(), gapX, gapY, newRowTop, snapDistance)
    }

}
