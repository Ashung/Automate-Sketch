var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Fit to Parent with Margin",
        'Input CSS margins like "all", "TB LR", "T LR B" or "T R B L", ' +
        'use "x", "*" or "-" to keep a original margin.'
    );

    var defaultUserInput = preferences.get("fitToParentMargins") || "0";
    var textField = ui.textField(defaultUserInput);
    dialog.addView(textField);
    dialog.focus(textField);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var userInput = textField.stringValue();

        var marginTop = 0,
            marginBottom = 0,
            marginLeft = 0,
            marginRight = 0;

        if (/^\d+$/.test(userInput)) {
            marginTop = marginBottom = marginLeft = marginRight = parseInt(userInput);
        }

        else if (/^(\d+|x|\*|-)\s(\d+|x|\*|-)$/i.test(userInput)) {
            marginTop = marginBottom = parseInt(userInput.split(/\s+/)[0]);
            marginLeft = marginRight = parseInt(userInput.split(/\s+/)[1]);
        }

        else if (/^(\d+|x|\*|-)(\s(\d+|x|\*|-)){2}$/.test(userInput)) {
            marginTop = parseInt(userInput.split(/\s+/)[0]);
            marginLeft = marginRight = parseInt(userInput.split(/\s+/)[1]);
            marginBottom = parseInt(userInput.split(/\s+/)[2]);
        }

        else if (/^(\d+|x|\*|-)(\s(\d+|x|\*|-)){3}$/.test(userInput)) {
            marginTop = parseInt(userInput.split(/\s+/)[0]);
            marginRight = parseInt(userInput.split(/\s+/)[1]);
            marginBottom = parseInt(userInput.split(/\s+/)[2]);
            marginLeft = parseInt(userInput.split(/\s+/)[3]);
        }

        else {
            document.showMessage("Bad input format.");
            return;
        }

        preferences.set("fitToParentMargins", userInput.toString());

        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            if (layer.parentGroup().class() != "MSPage") {

                var parentHeight = layer.parentGroup().frame().height(),
                    parentWidth = layer.parentGroup().frame().width();

                if (isNaN(marginTop)) {
                    marginTop = layer.frame().y();
                }
                if (isNaN(marginRight)) {
                    marginRight = parentWidth - layer.frame().x() - layer.frame().width();
                }
                if (isNaN(marginBottom)) {
                    marginBottom = parentHeight - layer.frame().y() - layer.frame().height();
                }
                if (isNaN(marginLeft)) {
                    marginLeft = layer.frame().x();
                }

                // log(`${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`);

                layer.frame().setWidth(parentWidth - marginLeft - marginRight);
                layer.frame().setHeight(parentHeight - marginTop - marginBottom);
                layer.frame().setX(marginLeft);
                layer.frame().setY(marginTop);

            }
        }

    }

};
