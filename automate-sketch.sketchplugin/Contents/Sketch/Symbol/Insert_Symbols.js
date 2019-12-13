var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");
    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var currentPage = document.selectedPage;

    var localSymbols = util.toArray(context.document.documentData().localSymbols());
    if (localSymbols.length == 0) {
        sketch.UI.message("This document have not any local symbol.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Insert Symbols",
        "Insert local symbols that name match the regular expression."
    );

    dialog.addLabel("Find symbols via regular expression:");
    var defaultRegExpString = preferences.get("insertSymbolNameRegExp") || ".*";
    var regExpView = ui.textField(defaultRegExpString);
    dialog.addView(regExpView);

    var nameMatchCase = preferences.get("insertSymbolNameRegExpMatchCase") || false;
    var matchCaseView = ui.checkBox(nameMatchCase, "Match Case");
    dialog.addView(matchCaseView);

    dialog.focus(regExpView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        // Save preferences
        preferences.set("insertSymbolNameRegExp", regExpView.stringValue());
        preferences.set("insertSymbolNameRegExpMatchCase", Boolean(matchCaseView.state()));

        // Insert symbols
        var rexExpFlag = Boolean(matchCaseView.state()) ? "" : "i";
        var regExp;
        try {
            regExp = new RegExp(String(regExpView.stringValue()).replace(/\\/g,"\\"), rexExpFlag);
        } catch (error) {
            sketch.UI.message("Invalid regular expression.");
            return;
        }

        localSymbols.forEach(function(symbol) {
            if (regExp.test(symbol.name())) {
                var instance = sketch.fromNative(symbol).createNewInstance();
                currentPage.layers.push(instance);
                instance.selected = true;
            }
        });
    }
};