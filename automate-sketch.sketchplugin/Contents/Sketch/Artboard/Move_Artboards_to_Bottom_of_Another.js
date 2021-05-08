var sketch = require('sketch')

var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var zoom = require("../modules/Zoom");
    var doc = context.document;
    var selection = context.selection;
    var page = doc.currentPage();

    var selectedArtboards = NSMutableArray.alloc().init();
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {
        if (layer.class() == "MSSymbolMaster" || layer.class() == "MSArtboardGroup") {
            selectedArtboards.addObject(layer);
        }
    }

    if (selectedArtboards.count() == 0) {
        doc.showMessage("Please select at least 1 artboard.");
        return;
    }

    var artboards = page.artboards().mutableCopy();
    artboards.removeObjectsInArray(selectedArtboards);

    var sortByName = NSSortDescriptor.sortDescriptorWithKey_ascending("name", true);
    artboards.sortUsingDescriptors(NSArray.arrayWithObject(sortByName));

    if (artboards.count() == 0) {
        doc.showMessage("You can't select all artboards.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Move Selected Artboard or Symbol",
        "You can move selected artboard or symbol master to the bottom of another one in current page."
    );

    var labelView1 = ui.textLabel("Choose An Artboard or Symbol:");
    dialog.addView(labelView1);

    var artboardNames = util.toArray(artboards).map(function(artboard) {
        return artboard.name();
    });
    var selectBox = ui.popupButton(artboardNames, 240);
    dialog.addView(selectBox);

    selectBox.setCOSJSTargetFunction(function(sender) {
        var target = artboards.objectAtIndex(sender.indexOfSelectedItem());
        selectLayer(target, false);
        zoom.toSelection();
    });

    var labelView2 = ui.textLabel("Space Between 2 Artboards:");
    dialog.addView(labelView2);

    var gap = preferences.get("spaceBetweenArtboards") || "50";
    var textField = ui.textField(gap, 50);
    dialog.addView(textField);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        preferences.set("spaceBetweenArtboards", textField.stringValue());

        var target = artboards.objectAtIndex(selectBox.indexOfSelectedItem());
        var space = parseInt(textField.stringValue());
        var positionX = target.frame().x();
        var positionY = target.frame().y() + target.frame().height() + space;

        var loopSelectedArtboards = selectedArtboards.objectEnumerator();
        var selectedArtboard;
        while (selectedArtboard = loopSelectedArtboards.nextObject()) {
            selectedArtboard.frame().setX(positionX);
            selectedArtboard.frame().setY(positionY);
            positionY += (selectedArtboard.frame().height() + space);
        }

    } else {
        selectLayers(context, selection);
    }

};

function selectLayers(context, layers) {
    var doc = context.document;
    var page = doc.currentPage();
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }
    var loopLayers = layers.objectEnumerator();
    var layer;
    while (layer = loopLayers.nextObject()) {
        selectLayer(layer, true);
        zoom.toSelection();
    }
}

function selectLayer(layer, add) {
    if (sketch.version.sketch < 45) {
        layer.select_byExpandingSelection(true, add);
    } else {
        layer.select_byExtendingSelection(true, add);
    }
}
