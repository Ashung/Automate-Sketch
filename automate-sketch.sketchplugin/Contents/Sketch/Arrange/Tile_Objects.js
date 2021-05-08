var sketch = require('sketch')

var tileLayersByPositionY = function(context) {
    tileLayer(context, "posy");
};

var tileLayersByPositionX = function(context) {
    tileLayer(context, "posx");
};

var tileLayersHorizontallyByIndex = function(context) {
    tileLayer(context, "horizontallyByIndex");
};

var tileLayersVerticallyByIndex = function(context) {
    tileLayer(context, "verticallyByIndex");
};

var customTileLayers = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var preferences = require("../modules/Preferences");
    var help = require("../modules/Help");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = context.document;
    var selection = context.selection;

    if (selection.count() < 2) {
        document.showMessage("Please select more than 2 layers.");
        return;
    }

    // Get last user input
    var defaultMarginX = preferences.get("tileObjectMarginX") || 20,
        defaultMarginY = preferences.get("tileObjectMarginY") || 20,
        defaultColumns = preferences.get("tileObjectColumns") || 10;

    // Dialog
    var dialog = new Dialog(
        "Tile Objects",
        "Tile objects with grid or any orientations."
    );

    var labelView1 = ui.textLabel("How to tile...");
    dialog.addView(labelView1);

    var selectTileType = ui.popupButton([
        "🔣 Grid",
        "➡️ Left to Right",
        "⬇️ Top to Bottom",
        "⬅️ Right to Left",
        "⬆️ Bottom to Top",
        "↘️ TopLeft to BottomRight",
        "↖️ BottomRight to TopLeft",
        "↗️ BottomLeft to TopRight",
        "↙️ TopRight to BottomLeft"
    ]);
    dialog.addView(selectTileType);

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
    var inputColumns = andInputGroup(view, 0, 80, "Columns", defaultColumns);
    var inputMarginX = andInputGroup(view, 100, 80, "Margin X", defaultMarginX);
    var inputMarginY = andInputGroup(view, 200, 80, "Margin Y", defaultMarginY);
    dialog.addView(view);

    var checkboxOrderByName = ui.checkBox(false, "Order by name.");
    dialog.addView(checkboxOrderByName);

    dialog.setKeyOrder([inputColumns, inputMarginX, inputMarginY]);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var columns = parseInt(inputColumns.stringValue()) > 0 ? parseInt(inputColumns.stringValue()) : defaultColumns,
            marginX = parseInt(inputMarginX.stringValue()) >= 0 ? parseInt(inputMarginX.stringValue()) : defaultMarginX,
            marginY = parseInt(inputMarginY.stringValue()) >= 0 ? parseInt(inputMarginY.stringValue()) : defaultMarginY;

        preferences.set("tileObjectColumns", columns);
        preferences.set("tileObjectMarginX", marginX);
        preferences.set("tileObjectMarginY", marginY);

        var layers = selection.mutableCopy();
        if (checkboxOrderByName.state()) {
            var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
                "name", true, "localizedStandardCompare:"
            );
            layers = layers.sortedArrayUsingDescriptors([sortDescriptor]);
        }

        var tileType = selectTileType.indexOfSelectedItem();

        var rect = help.getMSRectFromMSLayers(layers);
        var x = rect.x();
        var y = rect.y();
        var right = help.maxXOfRect(rect);
        var bottom = help.maxYOfRect(rect);

        // Grid
        if (tileType == 0) {
            var rowHeight = 0;
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                if (i % columns == 0) {
                    x = rect.x();
                    if (i != 0) {
                        y = y + rowHeight + marginY;
                    }
                }
                layer.frame().setX(x);
                layer.frame().setY(y);
                x = x + layer.frame().width() + marginX;
                rowHeight = layer.frame().height() > rowHeight ? layer.frame().height() : rowHeight;
            }
        }

        // Left to Right
        if (tileType == 1) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(x);
                layer.frame().setY(y);
                x = x + layer.frame().width() + marginX;
            }
        }

        // Top to Bottom
        if (tileType == 2) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(x);
                layer.frame().setY(y);
                y = y + layer.frame().height() + marginY;
            }
        }

        // Right to Left
        if (tileType == 3) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(right - layer.frame().width());
                layer.frame().setY(y);
                right = right - layer.frame().width() - marginX;
            }
        }

        // Bottom to Top
        if (tileType == 4) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                log(`${layer.name()} (${x}, ${bottom})`);
                layer.frame().setX(x);
                layer.frame().setY(bottom - layer.frame().height());
                bottom = bottom - layer.frame().height() - marginY;
            }
        }

        // TopLeft to BottomRight
        if (tileType == 5) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(x);
                layer.frame().setY(y);
                x = x + layer.frame().width() + marginX;
                y = y + layer.frame().height() + marginY;
            }
        }

        // BottomRight to TopLeft
        if (tileType == 6) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(right - layer.frame().width());
                layer.frame().setY(bottom - layer.frame().height());
                right = right - layer.frame().width() - marginX;
                bottom = bottom - layer.frame().height() - marginY;
            }
        }

        // BottomLeft to TopRight
        if (tileType == 7) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(x);
                layer.frame().setY(bottom - layer.frame().height());
                x = x + layer.frame().width() + marginX;
                bottom = bottom - layer.frame().height() - marginY;
            }
        }

        // TopRight to BottomLeft
        if (tileType == 8) {
            for (var i = 0; i < layers.count(); i++) {
                var layer = layers[i];
                layer.frame().setX(right - layer.frame().width());
                layer.frame().setY(y);
                right = right - layer.frame().width() - marginX;
                y = y + layer.frame().height() + marginY;
            }
        }

    }

};

function tileLayer(context, orientation) {
    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var preferences = require("../modules/Preferences");
    var UI = require("sketch/ui");
    var doc = context.document;
    var selection = context.selection;
    if (selection.count() < 2) {
        doc.showMessage("Please select more than 2 layers.");
    } else {

        var defaultGap = preferences.get("gap") || "0";
        var gap;
        if (sketch.version.sketch >= 53) {
            UI.getInputFromUser(
                "Tile Objects",
                {
                    initialValue: defaultGap,
                    description: "The gap between two layers. (px)"
                },
                function (err, value) {
                  if (err) return;
                  gap = value;
                }
            );
        } else {
            gap = UI.getStringFromUser("The gap between two layers. (px)", defaultGap);
        }
        if (!gap) return;

        gap = parseInt(gap);
        preferences.set("gap", gap);

        // Tile by position x/y
        if (orientation == "posx" || orientation == "posy") {
            var layers = [];
            for (var i = 0; i < selection.count(); i ++) {
                var selectionIndex = i,
                    x = selection[i].frame().x(),
                    y = selection[i].frame().y(),
                    w = selection[i].frame().width(),
                    h = selection[i].frame().height();
                layers.push({
                    "index": selectionIndex,
                    "x": x,
                    "y": y,
                    "w": w,
                    "h": h
                });
            }

            if (orientation == "posx") {
                layers.sort(function(a, b) {
                    return a.x - b.x;
                });
                for (var i = 1; i < layers.length; i ++) {
                    layers[i].x = layers[i-1].x + layers[i-1].w + gap;
                    selection[layers[i].index].frame().setX(
                        layers[i].x
                    );
                }
            }

            if (orientation == "posy") {
                layers.sort(function(a, b) {
                    return a.y - b.y;
                });
                for (var i = 1; i < layers.length; i ++) {
                    layers[i].y = layers[i-1].y + layers[i-1].h + gap;
                    selection[layers[i].index].frame().setY(
                        layers[i].y
                    );
                }
            }
        }

        // Tile horizontally by index
        if (orientation == "horizontallyByIndex") {
            for (var i = 1; i < selection.count(); i ++) {
                selection.objectAtIndex(i).frame().setX(
                    selection.objectAtIndex(i-1).frame().x() + selection.objectAtIndex(i-1).frame().width() + gap
                );
            }
        }

        // Tile vertically by index
        if (orientation == "verticallyByIndex") {
            for (var i = 1; i < selection.count(); i ++) {
                selection.objectAtIndex(i).frame().setY(
                    selection.objectAtIndex(i-1).frame().y() + selection.objectAtIndex(i-1).frame().height() + gap
                );
            }
        }

        // Resize group to fit children
        var loopSelection = selection.objectEnumerator();
        var selectedLayer;
        while (selectedLayer = loopSelection.nextObject()) {
            if (selectedLayer.parentGroup().class() == "MSLayerGroup") {
                if (sketch.version.sketch >= 53) {
                    selectedLayer.parentGroup().fixGeometryWithOptions(1);
                } else {
                    selectedLayer.parentGroup().resizeToFitChildrenWithOption(1);
                }
            }
        }
    }
};

function andInputGroup(view, x, width, label, defaultString) {
    var ui = require("../modules/Dialog").ui;
    var labelView = ui.textLabel(label, [x, 25, width, 25]);
    view.addSubview(labelView);
    var inputView = ui.textField(defaultString, [x, 0, width, 25])
    var formatter = NSNumberFormatter.alloc().init().autorelease();
    formatter.setNumberStyle(NSNumberFormatterNoStyle);
    inputView.setFormatter(formatter);
    view.addSubview(inputView);
    return inputView;
}
