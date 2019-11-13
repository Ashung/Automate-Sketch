var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var doc = context.document;
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var fontUsedInDocument = NSMutableArray.alloc().init();

    iterateDocument(doc, function(layer) {
        if (layer.class() == "MSTextLayer") {
            var fontsUsedInTextLayer = layer.attributedString().fontNames().allObjects();
            var loopFonts = fontsUsedInTextLayer.objectEnumerator();
            var font;
            while (font = loopFonts.nextObject()) {
                if (!fontUsedInDocument.containsObject(font)) {
                    fontUsedInDocument.addObject(font);
                }
            }
        }
    });

    if (fontUsedInDocument.count() == 0) {
        doc.showMessage("This document has no text layers.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Replace Fonts."
    );

    dialog.addLabel("Choose a font used in current document:");

    var findFontView = ui.popupButton(fontUsedInDocument);
    dialog.addView(findFontView);

    dialog.addLabel("Replace with:");

    var availableFontFamilies = NSFontManager.sharedFontManager().availableFontFamilies();
    var replaceFontView = ui.popupButton(availableFontFamilies);
    dialog.addView(replaceFontView);

    var replaceFontStyleView = ui.popupButton(getStylesFromFamilyName(availableFontFamilies.firstObject()));
    dialog.addView(replaceFontStyleView);

    replaceFontView.setCOSJSTargetFunction(function(sender) {
        ui.setItems_forPopupButton(getStylesFromFamilyName(sender.titleOfSelectedItem()), replaceFontStyleView);
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var selectedFont = fontUsedInDocument.objectAtIndex(findFontView.indexOfSelectedItem());
        var replaceFont = getPostscriptNameFromFamilyNameAndStyle(replaceFontView.titleOfSelectedItem(), replaceFontStyleView.titleOfSelectedItem());

        iterateDocument(doc, function(layer) {
            if (layer.class() == "MSTextLayer") {
                var fontsUsedInTextLayer = layer.attributedString().fontNames().allObjects();
                if (fontsUsedInTextLayer.containsObject(selectedFont)) {
                    layer.setFontPostscriptName(replaceFont);
                }
            }
        });

        doc.showMessage('Complete replace of "' + selectedFont + '" with ' + '"' + replaceFont + '".');

    }
    
};

function getStylesFromFamilyName(name) {
    var util = require("util");
    var availableMembers = NSFontManager.sharedFontManager().availableMembersOfFontFamily(name);
    var styles = util.toArray(availableMembers).map(function(item) {
        return item[1];
    });
    return styles;
}

function getPostscriptNameFromFamilyNameAndStyle(familyName, style) {
    var util = require("util");
    var availableMembers = NSFontManager.sharedFontManager().availableMembersOfFontFamily(familyName);
    var font = util.toArray(availableMembers).find(function(item) {
        return item[1] == style;
    });
    return font[0];
}

function iterateDocument(doc, func) {
    var pages = doc.pages();
    var loopPages = pages.objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var children = page.children();
        var loopChildren = children.objectEnumerator();
        var layer;
        while (layer = loopChildren.nextObject()) {
            func(layer);
        }
    }
}