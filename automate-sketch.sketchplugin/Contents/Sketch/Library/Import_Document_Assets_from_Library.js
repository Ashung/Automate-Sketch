var sketch = require('sketch')

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

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
        var colors = assets.colors();
        var gradients = assets.gradients();
        var images = assets.images();

        var selectedLibrary = availableLibraries.objectAtIndex(selectBox.indexOfSelectedItem());
        var libraryAssets = selectedLibrary.document().assets();

        if (checkboxColors.state() && libraryAssets.colors().count() > 0) {
            var loopLibraryColors = libraryAssets.colors().objectEnumerator();
            var color;
            while (color = loopLibraryColors.nextObject()) {
                if (!colors.containsObject(color)) {
                    colors.addObject(color);
                }
            }
        }

        if (checkboxGradients.state() && libraryAssets.gradients().count() > 0) {
            var loopLibraryGradients = libraryAssets.gradients().objectEnumerator();
            var gradient;
            while (gradient = loopLibraryGradients.nextObject()) {
                var containsObject = false;
                var loopDocumentGradients = gradients.objectEnumerator();
                var documentGradient;
                while (documentGradient = loopDocumentGradients.nextObject()) {
                    if (documentGradient.isAssetEqual(gradient)) {
                        containsObject = true;
                        break;
                    }
                }
                if (!containsObject) {
                    gradients.addObject(gradient);
                }
            }
        }

        if (checkboxImages.state() && libraryAssets.images().count() > 0) {
            var loopLibraryImages = libraryAssets.images().objectEnumerator();
            var image;
            while (image = loopLibraryImages.nextObject()) {
                if (!images.containsObject(image)) {
                    assets.addAsset(image);
                }
            }
        }

        document.reloadInspector();

        document.showMessage(
            "Imported " + libraryAssets.colors().count() + " colors, " +
            libraryAssets.gradients().count() + " gradients, " +
            libraryAssets.images().count() + " patterns from library \"" +
            selectedLibrary.name() + "\"."
        );

    }

};

// TODO：color variables