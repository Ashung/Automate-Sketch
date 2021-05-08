var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var doc = context.document;
    var selection = context.selection;

    if (selection.count() > 0) {

        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {

            if (layer.class() == "MSTextLayer") {

                if (layer.textBehaviour() == 0) {
                    continue;
                }

                var verticalAlignment = 0,
                    originalLeft = layer.frame().x(),
                    originalMiddle = layer.frame().y() + layer.frame().height() / 2,
                    originalBottom = layer.frame().y() + layer.frame().height(),
                    originalWidth = layer.frame().width();

                // If vertical alignment support
                if (layer.style().textStyle().verticalAlignment()) {
                    verticalAlignment = layer.style().textStyle().verticalAlignment();
                }

                // Auto
                layer.setTextBehaviour(0);

                layer.frame().setX(originalLeft);

                // Vertical alignment middle
                if (verticalAlignment == 1) {
                    layer.frame().setMidY(originalMiddle);
                }

                // Vertical alignment bottom
                if (verticalAlignment == 2) {
                    layer.frame().setMaxY(originalBottom);
                }

                layer.frame().setWidth(originalWidth);

                // Fixed
                layer.setTextBehaviour(1);

            }
        }

    } else {
        doc.showMessage("Please select at least 1 text layer.");
    }

};
