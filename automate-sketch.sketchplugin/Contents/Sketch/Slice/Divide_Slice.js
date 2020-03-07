var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;
    if (selectedLayers.length != 1 || selectedLayers.layers[0].type != "Slice") {
        sketch.UI.message("Please select 1 slice layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Divide Slice"
    );

    var checkboxHorizontal = ui.checkBox(true, "↓ Divide Horizontally Into");
    dialog.addView(checkboxHorizontal);

    var horizontalCount = ui.numberField(1, [24, 4, 50, 24]);
    var horizontalHeight = ui.numberField("", [24, 36, 50, 24]);
    var horizontalRadios = createRadios(horizontalCount, "slices down, evenly spaced", horizontalHeight, "pixels per slice");

    dialog.addView(ui.divider());

    var checkboxVertical = ui.checkBox(true, "→ Divide Vertically Into");
    dialog.addView(checkboxVertical);

    var verticalCount = ui.numberField(1, [24, 4, 50, 24]);
    var verticalWidth = ui.numberField("", [24, 36, 50, 24]);
    var verticalRadios = createRadios(verticalCount, "slices across, evenly spaced", verticalWidth, "pixels per slice");

    function createRadios(textField1, text1, textField2, text2) {
        var wrap = ui.view([0, 0, 300, 64]);
        var radio = NSButtonCell.alloc().init();
        radio.setButtonType(NSRadioButton);
        var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
            NSMakeRect(0, 0, 300, 64),
            NSRadioModeMatrix,
            radio,
            2,
            1
        );
        matrixFormat.setCellSize(CGSizeMake(300, 32));
        var cells = matrixFormat.cells();
        cells.objectAtIndex(0).setTitle("                  " + text1);
        cells.objectAtIndex(1).setTitle("                  " + text2);
        wrap.addSubview(matrixFormat);
        wrap.addSubview(textField1);
        wrap.addSubview(textField2);
        dialog.addView(wrap);
        return matrixFormat;
    }

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        
        var slice = selectedLayers.layers[0];

        var horizontal;
        if (checkboxHorizontal.state() == NSOffState) {
            horizontal = { type: "count", value: 1 };
        } else {
            var horizontalOption = horizontalRadios.cells().indexOfObject(horizontalRadios.selectedCell());
            if (horizontalOption == 0) {
                horizontal = { type: "count", value: parseInt(horizontalCount.stringValue()) };
            } else {
                horizontal = { type: "fixed", value: parseInt(horizontalHeight.stringValue()) };
            }
        }
    
        var vertical;
        if (checkboxVertical.state() == NSOffState) {
            vertical = { type: "count", value: 1 };
        } else {
            var verticalOption = verticalRadios.cells().indexOfObject(verticalRadios.selectedCell());
            if (verticalOption == 0) {
                vertical = { type: "count", value: parseInt(verticalCount.stringValue()) };
            } else {
                vertical = { type: "fixed", value: parseInt(verticalWidth.stringValue()) };
            }
        }

        divideSlice(slice, horizontal, vertical);
    }
};

/**
 * @param  {} slice
 * @param  {} horizontal {type, value}
 * @param  {} vertical {type, value}
 */
function divideSlice(slice, horizontal, vertical) {
    var x = slice.frame.x;
    var y = slice.frame.y;
    var width = slice.frame.width;
    var height = slice.frame.height;
    var maxX = x + width;
    var maxY = y + height;
    var cellHeight = horizontal.type == "count" ? Math.floor(height / horizontal.value) : horizontal.value;
    var cellWidth = vertical.type == "count" ? Math.floor(width / vertical.value) : vertical.value;
    var i = 1;
    for (var _y = y; _y < maxY; _y += cellHeight) {
        for (var _x = x; _x < maxX; _x += cellWidth) {
            var newSlice = slice.duplicate();
            newSlice.name += "_" + i;
            newSlice.frame.x = _x;
            newSlice.frame.y = _y;
            if (_x + cellWidth > maxX) {
                newSlice.frame.width = maxX - _x;
            } else {
                newSlice.frame.width = cellWidth;
            }
            if (_y + cellHeight > maxY) {
                newSlice.frame.height = maxY - _y;
            } else {
                newSlice.frame.height = cellHeight;
            }
            i ++;
        }
    }
    slice.remove();
}