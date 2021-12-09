var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var zoom = require("../modules/Zoom");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch/dom");
    var SymbolMaster = sketch.SymbolMaster;
    var document = sketch.getSelectedDocument();
    var currentPage = document.selectedPage;
    var libraries = sketch.getLibraries();
    var enabledLibraries = libraries.filter(function(library) {
        return library.enabled == true;
    });
    var enabledLibraryNames = enabledLibraries.map(function(library) {
        return library.name;
    });

    var dialog = new Dialog("Insert Artboard from Library");

    dialog.addLabel("Choose a Library:");
    var libraryView = ui.popupButton(enabledLibraryNames);
    dialog.addView(libraryView);

    dialog.addLabel("Choose a Artboard:");
    var artboardView = ui.popupButton([]);
    dialog.addView(artboardView);

    var selectedLibrary = enabledLibraries[0];
    var artboards = getArtboardsFromLibrary(selectedLibrary);
    loadSelectMenuData(artboardView, artboards);

    libraryView.setCOSJSTargetFunction(function(sender) {
        selectedLibrary = enabledLibraries[sender.indexOfSelectedItem()];
        artboards = getArtboardsFromLibrary(selectedLibrary);
        loadSelectMenuData(artboardView, artboards);
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        document.selectedLayers.clear();

        // Convert artboard to symbol master.
        var selectedArtboard = artboards[artboardView.indexOfSelectedItem()].duplicate();
        var master = SymbolMaster.fromArtboard(selectedArtboard);
        var symbolReferences = selectedLibrary.getImportableSymbolReferencesForDocument(document);
        var symbolReference = symbolReferences.find(function(item) {
            return item.id == master.symbolId;
        });

        // Import as library symbol
        var importedSymbol = symbolReference.import();
        var newInstance = importedSymbol.createNewInstance();
        var originForNewArtboard = currentPage.sketchObject.originForNewArtboardWithSize(CGSizeMake(newInstance.frame.width, newInstance.frame.height));
        currentPage.layers.push(newInstance);

        // Convert to local symbol
        var newSymbolMaster = newInstance.master;
        newSymbolMaster.unlinkFromLibrary();
        newInstance.remove();

        // Covert to artboard
        var newArtboard = newSymbolMaster.toArtboard();
        if (currentPage.id != newArtboard.sketchObject.parentPage().objectID()) {
            currentPage.layers.push(newArtboard);
        }
        newArtboard.frame.x = originForNewArtboard.x;
        newArtboard.frame.y = originForNewArtboard.y;
        newArtboard.selected = true;

        selectedArtboard.remove();

        zoom.toSelection();
    }
};

function getArtboardsFromLibrary(library) {
    var sketch = require("sketch/dom");
    var util = require("util");
    var libDocument = library.getDocument();
    return util.toArray(libDocument.sketchObject.allArtboards()).filter(function(artboard) {
        return artboard.className() == "MSArtboardGroup";
    }).map(function(artboard) {
        return sketch.fromNative(artboard);
    });
}

function loadSelectMenuData(popupButton, artboards) {
    var preview = require("../modules/Preview");
    popupButton.removeAllItems();
    artboards.forEach(function(artboard) {
        var menuItem = NSMenuItem.alloc().init();
        var menuTitle = artboard.name;
        var menuImage;
        var artboardNative = artboard.sketchObject;
        menuImage = preview.symbol(artboardNative, 80);
        menuImage.setSize(CGSizeMake(menuImage.size().width / 2, menuImage.size().height / 2));
        menuItem.setImage(menuImage);
        menuItem.setTitle(menuTitle);
        popupButton.menu().addItem(menuItem);
    });
}