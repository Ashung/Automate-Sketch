var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var document = context.document;
    if (sketch.version.sketch < 47) {
        document.showMessage("😮 You have to update to Sketch 47+ to use thie feature.");
        return;
    }

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var availableLibraries = assetLibraryController.availableLibraries();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector("name", true, "localizedStandardCompare:");
    availableLibraries = availableLibraries.sortedArrayUsingDescriptors([sortDescriptor]);

    if (availableLibraries.count() == 0) {
        document.showMessage("You have no available libraries.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Import Document Assets from Library",
        "You can import colors, gradients, images from any library."
    );

    dialog.addLabel("Choose a library.");

    var availableLibraryNames = util.toArray(availableLibraries).map(function(item) {
        return item.name();
    });
    var selectBox = ui.popupButton(availableLibraryNames);
    dialog.addView(selectBox);

    var checkboxColors = ui.checkBox(true, "Import colors.");
    dialog.addView(checkboxColors);

    var checkboxGradients = ui.checkBox(true, "Import gradients.");
    dialog.addView(checkboxGradients);

    var checkboxImages = ui.checkBox(true, "Import images.");
    dialog.addView(checkboxImages);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var assets = document.documentData().assets();
        var selectedLibrary = availableLibraries.objectAtIndex(selectBox.indexOfSelectedItem());
        var libraryAssets = selectedLibrary.document().assets();

        var countColor = 0;
        var countGradient = libraryAssets.gradientAssets().count();
        var countImage = libraryAssets.images().count();

        if (checkboxColors.state()) {
            if (sketch.version.sketch >= 69) {
                // Color variables
                var swatches = selectedLibrary.document().documentData().sharedSwatches().objectsSortedByName();
                document.documentData().sharedSwatches().addSharedObjects(swatches);
                countColor = swatches.count();
            } else {
                // Color
                countColor = libraryAssets.colorAssets().count();
                var loopLibraryColors = libraryAssets.colorAssets().objectEnumerator();
                var color;
                while (color = loopLibraryColors.nextObject()) {
                    assets.colors().addObject(color);
                }
            }
        }

        if (checkboxGradients.state() && countGradient > 0) {
            var loopLibraryGradients = libraryAssets.gradientAssets().objectEnumerator();
            var gradient;
            while (gradient = loopLibraryGradients.nextObject()) {
                assets.gradients().addObject(gradient);
            }
        }

        if (checkboxImages.state() && countImage > 0) {
            var loopLibraryImages = libraryAssets.images().objectEnumerator();
            var image;
            while (image = loopLibraryImages.nextObject()) {
                assets.images().addObject(image);
            }
        }

        document.reloadInspector();

        document.showMessage(
            "Imported " + countColor + " colors, " +
            countGradient + " gradients, " +
            countImage + " images from library \"" +
            selectedLibrary.name() + "\"."
        );

    }
};
