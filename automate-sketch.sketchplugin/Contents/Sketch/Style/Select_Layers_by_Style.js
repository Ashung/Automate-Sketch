var sketch = require("sketch");

var selectLayersByLayerStyle = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var document = context.document;
    var documentData = document.documentData();
    var layerStyles = NSMutableArray.alloc().init();
    layerStyles.addObjectsFromArray(documentData.layerStyles().sharedStyles());
    if (sketch.version.sketch >= 51) {
        layerStyles.addObjectsFromArray(documentData.foreignLayerStyles());
    }
    if (layerStyles.count() > 0) {
        main(context, layerStyles, "Select Layers by Layer Style", "Select all layers with a layer style in current page.");
    } else {
        document.showMessage("No layer styles in current document.");
    }
};

var selectLayersByTextStyle = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var document = context.document;
    var documentData = document.documentData();
    var textStyles = NSMutableArray.alloc().init();
    textStyles.addObjectsFromArray(documentData.layerTextStyles().sharedStyles());
    if (sketch.version.sketch >= 51) {
        textStyles.addObjectsFromArray(documentData.foreignTextStyles());
    }
    if (textStyles.count() > 0) {
        main(context, textStyles, "Select Layers by Text Style", "Select all layers with a text style in current page.");
    } else {
        document.showMessage("No text styles in current document.");
    }
};

function main(context, styles, title, message) {

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");

    var sketch = require("sketch");
    // Order style
    var orderedStyles = NSMutableArray.alloc().init();
    var loopStyles = styles.objectEnumerator();
    var style;
    while (style = loopStyles.nextObject()) {
        var name, type;
        if (style.class() == "MSSharedStyle") {
            name = style.name();
            if (style.style().hasTextStyle()) {
                type = "text";
            } else {
                type = "layer";
            }
        }
        if (style.class() == "MSForeignTextStyle" || style.class() == "MSForeignLayerStyle") {
            name = style.sourceLibraryName() + " ▶︎ " + style.localObject().name();
            if (style.class() == "MSForeignTextStyle") {
                type = "text";
            }
            if (style.class() == "MSForeignLayerStyle") {
                type = "layer";
            }
        }
        orderedStyles.addObject({
            "name": name,
            "type": type,
            "style": style
        });
    };
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    orderedStyles = orderedStyles.sortedArrayUsingDescriptors([sortDescriptor]);

    // Dialog
    var dialog = new Dialog(title, message);

    dialog.addLabel("Choose Style:");

    var orderedStyleNames = util.toArray(orderedStyles).map(function(item) {
        return item.name;
    });
    var styleListView = ui.popupButton(orderedStyleNames);
    dialog.addView(styleListView);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var document = context.document;
        var page = document.currentPage();
        var selection = context.selection;

        var selectedStyle = orderedStyles.objectAtIndex(styleListView.indexOfSelectedItem()).style;
        var styleType = orderedStyles.objectAtIndex(styleListView.indexOfSelectedItem()).type;
        var selectedStyleName = styleListView.titleOfSelectedItem();

        if (selection.count() > 0) {
            var childLayers = NSMutableArray.alloc().init();
            var loopSelection = selection.objectEnumerator();
            var layer;
            while (layer = loopSelection.nextObject()) {
                childLayers.addObjectsFromArray(layer.children());
            }
            var messageAddon = " in selected layers";
        }
        else {
            var childLayers = page.children();
            var messageAddon = " in current page";
        }

        var predicate;
        if (selectedStyle.class() == "MSSharedStyle") {
            if (sketch.version.sketch >= 52) {
                predicate = NSPredicate.predicateWithFormat("sharedStyle.objectID == %@", selectedStyle.objectID());
            } else {
                predicate = NSPredicate.predicateWithFormat("style.sharedObjectID == %@", selectedStyle.objectID());
            }
        }
        if (selectedStyle.class() == "MSForeignTextStyle" || selectedStyle.class() == "MSForeignLayerStyle") {
            if (sketch.version.sketch >= 52) {
                predicate = NSPredicate.predicateWithFormat("sharedStyleID == %@", selectedStyle.localShareID());
            } else {
                predicate = NSPredicate.predicateWithFormat("style.sharedObjectID == %@", selectedStyle.localShareID());
            }
        }
        var childLayersWithStyle = childLayers.filteredArrayUsingPredicate(predicate);

        if (childLayersWithStyle.count() > 1) {
            page.changeSelectionBySelectingLayers(childLayersWithStyle);
            document.showMessage(`Select ${childLayersWithStyle.count()} layers with ${styleType} "${selectedStyleName}"${messageAddon}.`);
        }
        else if (childLayersWithStyle.count() == 1) {
            page.changeSelectionBySelectingLayers(childLayersWithStyle);
            document.showMessage(`Select 1 layer with ${styleType} "${selectedStyleName}"${messageAddon}.`);
        }
        else {
            document.showMessage(`No layers with ${styleType} "${selectedStyleName}"${messageAddon}.`);
        }

        NSApp.sendAction_to_from("zoomToSelection:", nil, document);

    }
}
