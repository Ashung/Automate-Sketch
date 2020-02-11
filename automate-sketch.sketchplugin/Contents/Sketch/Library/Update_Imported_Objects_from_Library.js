var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = require("sketch/dom").getSelectedDocument();

    // Get all imported symbols
    var importedSymbols = document.getSymbols().filter(function(item) {
        return item.getLibrary();
    });

    // Get all imported layer styles
    var importedLayerStyles = document.sharedLayerStyles.filter(function(item) {
        return item.getLibrary();
    });

    // Get all imported text styles
    var importedTextStyles = document.sharedTextStyles.filter(function(item) {
        return item.getLibrary();
    });

    if (importedSymbols.length == 0 && importedLayerStyles.length == 0 && importedTextStyles.length == 0) {
        sketch.UI.message("Document have not imported objects.")
        return;
    }

    // Dialog
    var dialog = new Dialog("Update Imported Objects from Library");

    // Type
    dialog.addLabel("Choose a type of imported object:");
    var types = [];
    if (importedSymbols.length > 0) {
        types.push("Symbol");
    }
    if (importedLayerStyles.length > 0) {
        types.push("Layer Style");
    }
    if (importedTextStyles.length > 0) {
        types.push("Text Style");
    }
    var typeView = ui.popupButton(types);
    dialog.addView(typeView);

    // Library
    dialog.addLabel("Library:");
    var libraries = getLibraries(typeView.titleOfSelectedItem());
    var libraryNames = libraries.map(function(library) {
        return library.name;
    });
    var libraryView = ui.popupButton(libraryNames);
    dialog.addView(libraryView);

    typeView.setCOSJSTargetFunction(function(sender) {
        libraries = getLibraries(sender.titleOfSelectedItem());
        libraryNames = libraries.map(function(library) {
            return library.name;
        });
        ui.setItems_forPopupButton(libraryNames, libraryView);
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var library = libraries[libraryView.indexOfSelectedItem()];
        var objects;
        var count = 0;
        if (typeView.titleOfSelectedItem() == "Symbol") {
            objects = importedSymbols;
        } else if (typeView.titleOfSelectedItem() == "Layer Style") {
            objects = importedLayerStyles;
        } else if (typeView.titleOfSelectedItem() == "Text Style") {
            objects = importedTextStyles;
        }
        objects.forEach(function(item) {
            if (
                item.getLibrary().id == library.id &&
                item.getLibrary().name == library.name
            ) {
                item.syncWithLibrary();
                count ++;
            }
        });

        AppController.sharedInstance().refreshDocumentWindowBadges();

        var message = "Sync " + count + " imported " + 
            typeView.titleOfSelectedItem().toLowerCase() + (count > 1 ? "s" : "") + " in library " +
            '"' + libraryView.titleOfSelectedItem() + '"';
        sketch.UI.message(message);
    }

    function getLibraries(type) {
        var libraries = [];
        var libraryIdNames = [];
        var objects;
        if (type == "Symbol") {
            objects = importedSymbols;
        } else if (type == "Layer Style") {
            objects = importedLayerStyles;
        } else if (type == "Text Style") {
            objects = importedTextStyles;
        }
        objects.forEach(function(item) {
            var library = item.getLibrary();
            var idName = library.id + "-" + library.name;
            if (!libraryIdNames.includes(idName)) {
                libraries.push(library);
                libraryIdNames.push(idName);
            }
        });
        return libraries;
    }

};