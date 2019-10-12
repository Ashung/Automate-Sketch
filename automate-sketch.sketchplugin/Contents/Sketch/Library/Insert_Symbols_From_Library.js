var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var currentPage = document.selectedPage;
    var libraries = require("sketch/dom").getLibraries();
    var enabledLibraries = libraries.filter(function(library) {
        return library.enabled == true;
    });

    if (enabledLibraries.length == 0) {
        sketch.UI.message("Have not any enabled library.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Insert Symbols from Library",
        "Insert symbol that name match the regular expression from the choose library."
    );

    dialog.addLabel("Choose a library:");
    var namesOfEnabledLibraries = enabledLibraries.map(function(library) {
        return library.name;
    });
    var libraryView = ui.popupButton(namesOfEnabledLibraries);
    dialog.addView(libraryView);

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
        var selectedIndex = libraryView.indexOfSelectedItem();
        var selectedLibrary = enabledLibraries[selectedIndex];
        var symbolReferences = selectedLibrary.getImportableSymbolReferencesForDocument(document);

        var rexExpFlag = Boolean(matchCaseView.state()) ? "" : "i";
        var regExp;
        try {
            regExp = new RegExp(String(regExpView.stringValue()).replace(/\\/g,"\\"), rexExpFlag);
        } catch (error) {
            sketch.UI.message("Invalid regular expression.");
            return;
        }

        symbolReferences.forEach(function(symbolReference) {
            if (regExp.test(symbolReference.name)) {
                var symbolMaster = symbolReference.import();
                var instance = symbolMaster.createNewInstance();
                currentPage.layers.push(instance);
                instance.selected = true;
            }
        });
    }
};