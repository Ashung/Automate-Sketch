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
        "Import Style from Library",
        "You can import layer styles and text styles from any library."
    );

    dialog.addLabel("Choose a library.");

    var availableLibraryNames = util.toArray(availableLibraries).map(function(item) {
        return item.name();
    });
    var selectBox = ui.popupButton(availableLibraryNames);
    dialog.addView(selectBox);

    var checkboxTextStyle = ui.checkBox(true, "Import text styles.");
    dialog.addView(checkboxTextStyle);

    var checkboxLayerStyle = ui.checkBox(true, "Import layer styles.");
    dialog.addView(checkboxLayerStyle);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var importedTextStyleCount = 0;
        var importedLayerStyleCount = 0;

        var documentData = document.documentData();
        var textStyles = documentData.layerTextStyles();
        var layerStyles = documentData.layerStyles();

        var selectedLibrary = availableLibraries.objectAtIndex(selectBox.indexOfSelectedItem());
        var libraryTextStyles = selectedLibrary.document().layerTextStyles();
        var libraryLayerStyles = selectedLibrary.document().layerStyles();

        if (checkboxTextStyle.state() && libraryTextStyles.numberOfSharedStyles() > 0) {
            var loopLibraryTextStyles = libraryTextStyles.sharedStyles().objectEnumerator();
            var textStyle;
            while (textStyle = loopLibraryTextStyles.nextObject()) {

                if (textStyles.sharedStyleWithID(textStyle.objectID())) {
                    textStyles.removeSharedStyle(textStyles.sharedStyleWithID(textStyle.objectID()));
                }

                var newTextStyle = MSSharedStyle.alloc().initWithName_sharedObjectID_value(
                    textStyle.name(), textStyle.objectID(), textStyle.value()
                );

                textStyles.addSharedObject(newTextStyle);

            }

            importedTextStyleCount = libraryTextStyles.numberOfSharedStyles();
        }

        if (checkboxLayerStyle.state() && libraryLayerStyles.numberOfSharedStyles() > 0) {
            var loopLibraryLayerStyles = libraryLayerStyles.sharedStyles().objectEnumerator();
            var layerStyle;
            while (layerStyle = loopLibraryLayerStyles.nextObject()) {

                if (layerStyles.sharedStyleWithID(layerStyle.objectID())) {
                    layerStyles.removeSharedStyle(layerStyles.sharedStyleWithID(layerStyle.objectID()));
                }

                var newLayerStyle = MSSharedStyle.alloc().initWithName_sharedObjectID_value(
                    layerStyle.name(), layerStyle.objectID(), layerStyle.value()
                );

                layerStyles.addSharedObject(newLayerStyle);

            }

            importedLayerStyleCount = libraryLayerStyles.numberOfSharedStyles();
        }

        document.reloadInspector();

        if (importedTextStyleCount > 0 && importedLayerStyleCount > 0) {
            var msg = 'Imported ' +
                (importedTextStyleCount > 1 ? importedTextStyleCount + ' text styles ' : importedTextStyleCount + ' text style ') +
                'and ' +
                (importedLayerStyleCount > 1 ? importedLayerStyleCount + ' layer styles ' : importedLayerStyleCount + ' layer style ') +
                'from library "' + selectedLibrary.name() + '"';
            document.showMessage(msg);
        } else if (importedTextStyleCount > 0) {
            var msg = 'Imported ' +
                (importedTextStyleCount > 1 ? importedTextStyleCount + ' text styles ' : importedTextStyleCount + ' text style ') +
                'from library "' + selectedLibrary.name() + '"';
            document.showMessage(msg);
        } else if (importedLayerStyleCount > 0) {
            var msg = 'Imported ' +
                (importedLayerStyleCount > 1 ? importedLayerStyleCount + ' layer styles ' : importedLayerStyleCount + ' layer style ') +
                'from library "' + selectedLibrary.name() + '"';
            document.showMessage(msg);
        }

    }

};
