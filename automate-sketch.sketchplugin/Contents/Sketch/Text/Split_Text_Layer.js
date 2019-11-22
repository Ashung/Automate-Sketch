var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSTextLayer");
    var selectedTextLayers = selection.filteredArrayUsingPredicate(predicate);
    if (selectedTextLayers.count() == 0) {
        document.showMessage("Place select a text layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Split Text Layer",
        "Split selected text layers to multiple layer, use new line and separator."
    );

    var splitSpace = ui.checkBox(true, 'Split blank space, "a b c".');
    dialog.addView(splitSpace);

    var splitComma = ui.checkBox(false, 'Split comma, "a, b, c".');
    dialog.addView(splitComma);

    var splitLine = ui.checkBox(false, 'Split vertical line. "a | b | c"');
    dialog.addView(splitLine);

    splitSpace.setCOSJSTargetFunction(function(sender) {
        unCheckedAllViews(dialog.accessoryView().subviews());
        sender.setState(NSOnState);
    });
    splitComma.setCOSJSTargetFunction(function(sender) {
        unCheckedAllViews(dialog.accessoryView().subviews());
        sender.setState(NSOnState);
    });
    splitLine.setCOSJSTargetFunction(function(sender) {
        unCheckedAllViews(dialog.accessoryView().subviews());
        sender.setState(NSOnState);
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var separator = " ";
        if (splitComma.state() == NSOnState) {
            separator = ",";
        }
        if (splitLine.state() == NSOnState) {
            separator = "|";
        }

        var loopSelectedTextLayer = selectedTextLayers.objectEnumerator();
        var textLayer;
        while (textLayer = loopSelectedTextLayer.nextObject()) {

            var text = textLayer.stringValue();

            var textLines = text.split("\n");
            while (textLines.length > 0) {
                var textForNewLine = textLines.pop();
                textLayer.setStringValue(textLines.join("\n"));
                var rectLine = CGRectMake(textLayer.frame().x(), textLayer.frame().maxY(), textLayer.frame().width(), 10);
                if (textLines.length == 0) {
                    rectLine.origin.y = textLayer.frame().y();
                }

                textForNewLine = textForNewLine.trim();
                if (textForNewLine != "") {
                    var newLineTextLayer = MSTextLayer.alloc().initWithFrame(rectLine);
                    newLineTextLayer.setStringValue(textForNewLine);
                    newLineTextLayer.setName(textForNewLine);
                    newLineTextLayer.setStyle(textLayer.style());
                    newLineTextLayer.adjustFrameToFit();
                    textLayer.parentGroup().addLayer(newLineTextLayer);
                    newLineTextLayer.select_byExtendingSelection(true, true);

                    var textColumns = textForNewLine.split(separator);
                    while (textColumns.length > 0) {
                        var textForNewColumn = textColumns.pop();
                        newLineTextLayer.setStringValue(textColumns.join(separator) + " ");
                        var rectColumn = CGRectMake(newLineTextLayer.frame().maxX(), newLineTextLayer.frame().y(), 10, 10);
                        if (textColumns.length == 0) {
                            rectColumn.origin.x = newLineTextLayer.frame().x();
                        }
                        textForNewColumn = textForNewColumn.trim();
                        if (textForNewColumn != "") {
                            var newColumnTextLayer = MSTextLayer.alloc().initWithFrame(rectColumn);
                            newColumnTextLayer.setStringValue(textForNewColumn);
                            newColumnTextLayer.setName(textForNewColumn);
                            newColumnTextLayer.setStyle(textLayer.style());
                            newColumnTextLayer.adjustFrameToFit();
                            textLayer.parentGroup().addLayer(newColumnTextLayer);
                            newColumnTextLayer.select_byExtendingSelection(true, true);
                        }
                    }

                    newLineTextLayer.removeFromParent();

                }

            }

            textLayer.removeFromParent();

        }

    }

};

function unCheckedAllViews(views) {
    views.forEach(function(view) {
        view.setState(NSOffState);
    });
}
