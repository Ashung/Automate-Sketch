
var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var type = require("../modules/Type");
    var sketchUI = require("sketch/ui");
    var doc = context.document;
    var selection = context.selection;

    if (selection.count() != 1) {
        doc.showMessage("Please select 1 shape layer.");
    }

    var layer = selection.firstObject();
    if (type.isShape(layer)) {
        // \d+x\d+
        var userInputString;
        sketchUI.getInputFromUser(
            "Divide Layer",
            {
                initialValue: preferences.get("divide") || "2x1",
                description: "Input 2x2, 2x1 or 1x2."
            },
            function (err, value) {
                if (err) return;
                userInputString = value;
            }
        );

        if (userInputString) {

            preferences.set("divide", userInputString.toString());

            if (/^\d+x\d+$/.test(userInputString) && eval(userInputString.replace("x", "*")) > 1) {

                var hCount = parseInt(/(\d+)/.exec(userInputString)[1]);
                var vCount = parseInt(/x(\d+)/.exec(userInputString)[1]);

                var originX = Math.floor(layer.frame().x()),
                    originY = Math.floor(layer.frame().y()),
                    width = layer.frame().width(),
                    height = layer.frame().height();

                var cellWidth = Math.floor(width / hCount),
                    cellHeight = Math.floor(height / vCount);

                for (var j = 0, y = originY; j < vCount; j++, y += cellHeight) {
                    for (var i = 0, x = originX; i < hCount; i++, x += cellWidth) {
                        // log(i+","+j+" --> (x:" + x + ",y:" + y + ",w:" + cellWidth + ",h:" + cellHeight + ")");
                        var cellLayer = layer.duplicate();
                        cellLayer.frame().setX(x);
                        cellLayer.frame().setY(y);
                        cellLayer.frame().setConstrainProportions(false);
                        cellLayer.frame().setWidth(cellWidth);
                        cellLayer.frame().setHeight(cellHeight);

                        // Fix Sketch 45
                        if (sketch.version.sketch < 45) {
                            cellLayer.select_byExpandingSelection(true, true);
                        } else {
                            cellLayer.select_byExtendingSelection(true, true);
                        }
                    }
                }

                layer.removeFromParent();

            } else {
                doc.showMessage("Bad format, please input string like 2x1.");
            }
        }

    } else {
        doc.showMessage("Please select 1 shape layer.");
    }

};
