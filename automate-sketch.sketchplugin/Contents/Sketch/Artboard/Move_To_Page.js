var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var sketch = require("sketch");
    var zoom = require("../modules/Zoom");
    var preferences = require("../modules/Preferences");
    var document = sketch.getSelectedDocument();
    var originalPage = document.selectedPage;
    var selectedLayers = document.selectedLayers;

    var selectedArtboards = selectedLayers.layers.filter(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    });
    if (selectedArtboards.length == 0) {
        sketch.UI.message("Please select at least 1 artboard or symbol master.");
        return;
    }

    // Dialog
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var dialog = new Dialog(
        "Move to Page",
        "Move selected artboards or symbol masters to another page."
    );

    dialog.addLabel("Choose a page:");
    var pages = document.pages.filter(function(page) {
        return page.id != document.selectedPage.id;
    });
    var pageList = pages.map(function(page) {
        return page.name;
    });
    pageList.push("New Page");
    var pageListView = ui.popupButton(pageList);
    dialog.addView(pageListView);

    var jumpToPage = preferences.get("jumpToPage") || false;
    var jumpToPageView = ui.checkBox(jumpToPage, "Jump to target page.");
    dialog.addView(jumpToPageView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        preferences.set("jumpToPage", Boolean(jumpToPageView.state()));

        var selectedIndex = pageListView.indexOfSelectedItem();
        var targetPage;
        if (selectedIndex < pages.length) {
            targetPage = pages[selectedIndex];
        } else {
            var Page = require("sketch/dom").Page;
            targetPage = new Page({
                name: document._getMSDocumentData().nameForNewPage(),
                parent: document,
                selected: false
            });
        }

        selectedArtboards.forEach(function(artboard) {
            var artboardPosition = targetPage.sketchObject.originForNewArtboardWithSize(artboard.sketchObject.rect().size);
            var positionX = artboardPosition.x;
            var positionY = artboardPosition.y;
            targetPage.layers.push(artboard);
            artboard.frame.x = positionX;
            artboard.frame.y = positionY;
        });

        if (jumpToPageView.state() == NSOnState) {
            document.selectedPage = targetPage;
            document.selectedLayers.layers = selectedArtboards;
            zoom.toSelection();
        } else {
            document.selectedPage = originalPage;
        }

        sketch.UI.message(`Move ${selectedArtboards.length} artboard${selectedArtboards.length > 1 ? 's' : ''} to page "${targetPage.name}"`);

    }
};
