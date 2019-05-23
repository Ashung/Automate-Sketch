var fitToParentHeightWithMargin = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");
    
    var preferences = require("../modules/Preferences");
    var sketchUI = require("sketch/ui");
    var doc = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        doc.showMessage("Please select at least 1 layer.");
        return;
    }

    var defaultUserInput = preferences.get("margin") || "0";

    var userInput;
    sketchUI.getInputFromUser(
        "Fit to Parent Height with Margin",
        {
            initialValue: defaultUserInput,
            description: 'Margins: "<top & bottom>" or "<top> <bottom>". '
        },
        function (err, value) {
            if (err) return;
            userInput = value;
        }
    );

    if (userInput) {
        preferences.set("margin", userInput.toString());

        var marginTop = marginBottom = 0;

        if (/(\d+)\s(\d+)/.test(userInput)) {
            marginTop = parseInt(/(\d+)\s(\d+)/.exec(userInput)[1]);
            marginBottom = parseInt(/(\d+)\s(\d+)/.exec(userInput)[2]);
        } else if (/\d+/.test(userInput)) {
            marginTop = marginBottom = parseInt(userInput);
        }

        for (var i = 0; i < selection.count(); i++) {
            var layer = selection.objectAtIndex(i);
            if (layer.parentGroup().class() != "MSPage") {
                var parentHeight = layer.parentGroup().frame().height();
                layer.frame().setY(marginTop);
                layer.frame().setHeight(parentHeight - marginTop - marginBottom);
            }
        }

    }

};

var fitToParentWidthWithMargin = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var preferences = require("../modules/Preferences");
    var sketchUI = require("sketch/ui");
    var doc = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        doc.showMessage("Please select at least 1 layer.");
        return;
    }

    var defaultUserInput = preferences.get("margin") || "0";

    var userInput;
    sketchUI.getInputFromUser(
        "Fit to Parent Width with Margin",
        {
            initialValue: defaultUserInput,
            description: 'Margins: "<left & right>" or "<left> <right>". '
        },
        function (err, value) {
            if (err) return;
            userInput = value;
        }
    );

    if (userInput) {
        preferences.set("margin", userInput.toString());

        var marginLeft = marginRight = 0;

        if (/(\d+)\s(\d+)/.test(userInput)) {
            marginLeft = parseInt(/(\d+)\s(\d+)/.exec(userInput)[1]);
            marginRight = parseInt(/(\d+)\s(\d+)/.exec(userInput)[2]);
        } else if (/\d+/.test(userInput)) {
            marginLeft = marginRight = parseInt(userInput);
        }

        for (var i = 0; i < selection.count(); i++) {
            var layer = selection.objectAtIndex(i);
            if (layer.parentGroup().class() != "MSPage") {
                var parentWidth = layer.parentGroup().frame().width();
                layer.frame().setX(marginLeft);
                layer.frame().setWidth(parentWidth - marginLeft - marginRight);
            }
        }

    }

};
