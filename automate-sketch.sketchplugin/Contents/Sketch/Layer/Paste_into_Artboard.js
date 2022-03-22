var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");
    
    var sketch = require('sketch');
    var version = sketch.version.sketch;
    var document = sketch.getSelectedDocument();
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");
    var pasteboard = require("../modules/Pasteboard");

    if (pasteboard.isEmpty()) {
        sketch.UI.message("Clipboard is empty.");
        return;
    }

    if (!pasteboard.isSupportedType()) {
        sketch.UI.message("Please copy a Sketch layer first.");
        return;
    }

    var artboards = document.selectedLayers.layers.filter(function(layer) {
        return layer.type == "Artboard";
    });

    if (artboards.length == 0) {
        sketch.UI.message("No selected artboard.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Paste into Artboard",
        "Paste layers into current/selected artboard."
    );

    dialog.addLabel("Position");
    var wrap = ui.view([0, 0, 60, 60]);
    wrap.setWantsLayer(true);
    wrap.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1));
    var radio = NSButtonCell.alloc().init();
    radio.setButtonType(NSRadioButton);
    var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
        NSMakeRect(0, 0, 60, 60),
        NSRadioModeMatrix,
        radio,
        3,
        3
    );
    matrixFormat.setCellSize(CGSizeMake(20, 20));
    var cells = matrixFormat.cells();
    for(var i = 0; i < 9; i++) {
        cells.objectAtIndex(i).setTitle("");
    }
    var defaultCell = preferences.get("pasteIntoArtboardPosition") || 0;
    matrixFormat.selectCellAtRow_column(Math.floor(defaultCell / 3), defaultCell % 3);
    wrap.addSubview(matrixFormat);
    dialog.addView(wrap);

    var fitWidth = ui.checkBox(preferences.get("pasteIntoArtboardFitArtboardWidth") || false, "Fit to Artboard Width");
    dialog.addView(fitWidth);

    var fitHeight = ui.checkBox(preferences.get("pasteIntoArtboardFitArtboardHeight") || false, "Fit to Artboard Height");
    dialog.addView(fitHeight);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        preferences.set("pasteIntoArtboardPosition", matrixFormat.cells().indexOfObject(matrixFormat.selectedCell()));
        preferences.set("pasteIntoArtboardFitArtboardWidth", fitWidth.state() == NSOnState);
        preferences.set("pasteIntoArtboardFitArtboardHeight", fitHeight.state() == NSOnState);

        var pasteboardLayers = pasteboard.getPasteboardLayers();
        var position = matrixFormat.cells().indexOfObject(matrixFormat.selectedCell());
        artboards.forEach(function(artboard) {
            if (version >= 50) {
                pasteboardLayers.insertInGroup_atPosition_afterLayer_viewport_fitToParent(
                    artboard.sketchObject,
                    CGPointMake(0, 0),
                    null,
                    document.sketchObject.contentDrawView().viewPort(),
                    false
                );
            } else {
                pasteboardLayers.insertInGroup_atPosition_afterLayer(
                    artboard.sketchObject,
                    CGPointMake(0, 0),
                    null
                );
            }

            var group;
            if (version >= 84) {
                group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers());
            } else if (version >= 83) {
                group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers().layers());
            } else if (version >= 52) {
                group = MSLayerGroup.groupWithLayers(pasteboardLayers.layers());
            } else {
                group = MSLayerGroup.groupFromLayers(pasteboardLayers.layers());
            }
            group.moveToLayer_beforeLayer(artboard.sketchObject, null);

            if (fitWidth.state() == NSOnState) {
                group.frame().setWidth(artboard.frame.width);
            }

            if (fitHeight.state() == NSOnState) {
                group.frame().setHeight(artboard.frame.height);
            }

            var x, y;
            var centerX = (artboard.frame.width - group.frame().width()) / 2;
            var centerY = (artboard.frame.height - group.frame().height()) / 2;
            var right = artboard.frame.width - group.frame().width();
            var bottom = artboard.frame.height - group.frame().height();
            if (position == 0) {
                x = 0;
                y = 0;
            }
            else if (position == 1) {
                x = centerX;
                y = 0;
            }
            else if (position == 2) {
                x = right;
                y = 0;
            }
            else if (position == 3) {
                x = 0;
                y = centerY;
            }
            else if (position == 4) {
                x = centerX;
                y = centerY;
            }
            else if (position == 5) {
                x = right;
                y = centerY;
            }
            else if (position == 6) {
                x = 0;
                y = bottom;
            }
            else if (position == 7) {
                x = centerX;
                y = bottom;
            }
            else if (position == 8) {
                x = right;
                y = bottom;
            }
            group.frame().setX(Math.round(x));
            group.frame().setY(Math.round(y));
            group.ungroup();

        });
    }
}
