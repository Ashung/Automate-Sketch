var onRun = function(context) {
    
    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var sketch = require("sketch/dom");
    var toast = require("sketch/ui").message;
    var document = sketch.getSelectedDocument();
    var util = require("util");
    var Swatch = sketch.Swatch;

    // Document swatches and imported swatches
    var allSwatches = util.toArray(document._getMSDocumentData().allSwatches()).map(function(swatch) {
        return Swatch.fromNative(swatch);
    });
    if (allSwatches.length == 0) {
        toast("These are no color variables in document.");
        return;
    }

    var libraries = sketch.getLibraries().filter(function(library) {
        return library.valid && library.enabled && library.getImportableSwatchReferencesForDocument(document).length > 0;
    });
    libraries.sort(function(a, b) {
        return a.name > b.name;
    });
    if (libraries.length == 0) {
        toast('These are no enabled library with color variables in "Preferences" - "Libraries".');
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Swap Color Variables from Library",
        "Swap color variables from library with same name."
    );

    dialog.addLabel("Choose a Library");

    var allLibrariesNames = libraries.map(function(item) {
        return item.name;
    });
    var selectLibraryView = ui.popupButton(allLibrariesNames);
    dialog.addView(selectLibraryView);

    var ignoreNumberView = ui.checkBox(true, "Ignore the number before color name.")
    dialog.addView(ignoreNumberView);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var targetLibrary = libraries[selectLibraryView.indexOfSelectedItem()];
        var swatchRefs = targetLibrary.getImportableSwatchReferencesForDocument(document);

        var fullMatchName = ignoreNumberView.state() == NSOffState;

        var count = 0;
        allSwatches.forEach(function(swatch) {
            var importableSwatch;
            if (fullMatchName) {
                importableSwatch = swatchRefs.find(function(item) {
                    return item.name == swatch.name;
                });
            } else {
                importableSwatch = swatchRefs.find(function(item) {
                    var _name1 = item.name.replace(/^\d+[.]?\s*/, "").trim().toLowerCase();
                    var _name2 = swatch.name.replace(/^\d+[.]?\s*/, "").trim().toLowerCase();
                    return _name1 == _name2;
                });
            }

            if (importableSwatch) {
                var newSwatch = importableSwatch.import();
                document._getMSDocumentData().replaceInstancesOfColor_withColor_ignoreAlphaWhenMatching_replaceAlphaOfOriginalColor(
                    swatch.referencingColor,
                    newSwatch.referencingColor,
                    false,
                    false
                );
                count ++;
            }
        });

        toast(`Swap ${count} color variables from library ${selectLibraryView.titleOfSelectedItem()}.`);

    }
};