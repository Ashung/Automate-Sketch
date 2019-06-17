var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var document = context.document;
    var selection = context.selection;

    if (selection.count() > 0) {

        var loopSelection = selection.objectEnumerator();
        while(layer = loopSelection.nextObject()) {

            var fills = layer.style().fills();
            var borders = layer.style().borders();

            if (fills.count() > 0 || borders.count() > 0) {

                var newFills = NSMutableArray.alloc().init();
                var newBorders = NSMutableArray.alloc().init();

                var borderWidth = borders.count() > 0 ? borders.lastObject().thickness() : 1;
                var borderPosition = borders.count() > 0 ? borders.lastObject().position() : 0;

                // Get borders from fills
                var loopFills = fills.objectEnumerator();
                while (fill = loopFills.nextObject()) {
                    if (fill.fillType() == 0 || fill.fillType() == 1) {
                        var styleBorder = MSStyleBorder.alloc().init();
                        if (fill.fillType() == 0) {
                            styleBorder.setFillType(0);
                            styleBorder.setColor(fill.color());
                        }
                        if (fill.fillType() == 1) {
                            styleBorder.setFillType(1);
                            styleBorder.setGradient(fill.gradient());
                        }
                        styleBorder.setThickness(borderWidth);
                        styleBorder.setPosition(borderPosition);
                        styleBorder.setContextSettings(fill.contextSettings());
                        styleBorder.setIsEnabled(fill.isEnabled());
                        newBorders.addObject(styleBorder);
                    } else {
                        newFills.addObject(fill);
                    }
                }

                // Get fills from borders
                var loopBorders = borders.objectEnumerator();
                while (border = loopBorders.nextObject()) {
                    var styleFill = MSStyleFill.alloc().init();
                    styleFill.setFillType(border.fillType());
                    if (border.fillType() == 0) {
                        styleFill.setColor(border.color());
                    }
                    if (border.fillType() == 1) {
                        styleFill.setGradient(border.gradient());
                    }
                    styleFill.setContextSettings(border.contextSettings());
                    styleFill.setIsEnabled(border.isEnabled());
                    newFills.addObject(styleFill);
                }

                // Swap fill and border
                layer.style().removeAllStyleFills();
                layer.style().removeAllStyleBorders();
                layer.style().addStyleBorders(newBorders);
                layer.style().addStyleFills(newFills);

                document.reloadInspector();

            }
        }

    } else {
        doc.showMessage("Please select 1 layer with fill or border.");
    }

}
