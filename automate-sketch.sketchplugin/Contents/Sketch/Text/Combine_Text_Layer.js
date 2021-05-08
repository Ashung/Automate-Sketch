var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat('className == "MSTextLayer"')
    var selectedTextLayers = selection.filteredArrayUsingPredicate(predicate).mutableCopy();
    if (selectedTextLayers.count() < 1) {
        document.showMessage("Place select at least 2 text layers.");
        return;
    }

    // Sort by y
    selectedTextLayers.sort(function(a, b) {
        return a.frame().y() - b.frame().y();
    });

    // Bounds
    var top = selectedTextLayers[0].frame().y(),
        right = selectedTextLayers[0].frame().x() + selectedTextLayers[0].frame().width(),
        bottom = selectedTextLayers[0].frame().y() + selectedTextLayers[0].frame().height(),
        left = selectedTextLayers[0].frame().x();

    // Row
    var rows = [];
    var row = 0;
    selectedTextLayers.forEach(function(item, i) {
        if (i == 0) {
            rows[row] = [];
            rows[row].push(item);
        }
        else {
            if (item.frame().y() < selectedTextLayers[i - 1].frame().y() + selectedTextLayers[i - 1].frame().height()) {
                rows[row].push(item);
            }
            else {
                row ++;
                rows[row] = [];
                rows[row].push(item);
            }
        }

        if (item.frame().y() < top) { top = item.frame().y() }
        if (item.frame().x() + item.frame().width() > right) { right = item.frame().x() + item.frame().width() }
        if (item.frame().y() + item.frame().height() > bottom) { bottom = item.frame().y() + item.frame().height() }
        if (item.frame().x() < left) { left = item.frame().x() }

    });

    // Sort by x
    var text = "";
    rows.forEach(function(row, i) {
        row.sort(function(a, b) {
            return a.frame().x() - b.frame().x();
        });
        row.forEach(function(col, j) {
            if (j == row.length - 1) {
                text += col.stringValue();
            }
            else {
                text += col.stringValue() + " ";
            }
        });
        if (i != rows.length - 1) {
            text += "\n";
        }
    });

    // Add new layer
    var newTextLayer = MSTextLayer.alloc().initWithFrame(CGRectMake(0, 0, 10, 10));
    newTextLayer.setStringValue(text);
    newTextLayer.setName(text.substr(0, 20));
    newTextLayer.setStyle(rows[0][0].style());
    newTextLayer.adjustFrameToFit();
    rows[0][0].parentGroup().addLayer(newTextLayer);
    newTextLayer.select_byExtendingSelection(true, true);
    newTextLayer.frame().setX(Math.round(left));
    newTextLayer.frame().setY(Math.round(top));

    // Remove old layers
    selectedTextLayers.forEach(function(item) {
        item.removeFromParent();
    });

};
