var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var doc = context.document;
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var alert = require("sketch/ui").alert;
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
        "Replace Fonts.",
        "Tips: You can find the PostScript name of the font from \"Font Book\" app."
    );

    dialog.addLabel("Choose a font used in current document:");

    var selectBox = ui.popupButton(fontUsedInDocument);
    dialog.addView(selectBox);

    dialog.addLabel("Replace with:");

    var textField = ui.textField(preferences.get("replaceFont") || "");
    textField.setPlaceholderString("Type the PostScript name of the font.");
    dialog.addView(textField);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var selectedFont = fontUsedInDocument.objectAtIndex(selectBox.indexOfSelectedItem());
        var replaceFont = textField.stringValue();

        // Font no specified.
        if (replaceFont == "") {
            alert("Font Not Specified.", "Pleace input the PostScript of font you want to replace with.");
            return;
        }

        // Font not found.
        var allSystemFonts = NSFontManager.sharedFontManager().availableFonts();
        if (allSystemFonts.indexOfObject(replaceFont) == 9.223372036854776e+18) {
            alert("Font Not Found.", "The font \"" + replaceFont + "\" can't found in system installed fonts.");
            return;
        }

        iterateDocument(doc, function(layer) {
            if (layer.class() == "MSTextLayer") {
                var fontsUsedInTextLayer = layer.attributedString().fontNames().allObjects();
                if (fontsUsedInTextLayer.containsObject(selectedFont)) {
                    layer.setFontPostscriptName(replaceFont);
                }
            }
        });

        preferences.set("replaceFont", replaceFont);

        doc.showMessage('Complete replace of "' + selectedFont + '" with ' + '"' + replaceFont + '".');

    }
    
};

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