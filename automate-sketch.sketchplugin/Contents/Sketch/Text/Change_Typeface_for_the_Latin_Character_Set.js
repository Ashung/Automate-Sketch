var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var doc = context.document;
    var selection = context.selection;

    // https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)
    // https://en.wikipedia.org/wiki/ISO/IEC_8859-1
    var reg_latin_1 = /[\u0020-\u00FF]+/g;

    if(selection.count() == 0) {
        doc.showMessage("Please select a text layer.");
        return;
    }

    var hasTextLayer = false;
    for(var i = 0; i < selection.count(); i ++) {
        if(selection[i].className() == "MSTextLayer") {
            hasTextLayer = true;
        }
    }
    if(hasTextLayer == false) {
        doc.showMessage("Your selection has no text layers.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Change Typeface for Latin Character Set",
        "Type the PostScript name of font. \n" +
        "PostScript name can be found in \"/Applications/FontBook.app\".\n\n" +
        "Android: Roboto-Regular(Thin, Light),\n" +
        "iOS: SFUIDisplay-Regular, \n" +
        "Web: Arial, Helvetica, HelveticaNeue",
    );

    var textField = ui.textField(preferences.get("defaultLatinFont") || "");
    dialog.focus(textField);
    dialog.addView(textField);

    var responseCode = dialog.run();
    if(responseCode == 1000) {
        var postScriptName = textField.stringValue();
        if(postScriptName != "") {
            for(var i = 0; i < selection.count(); i ++) {
                if(selection[i].className() == "MSTextLayer") {
                    var textLayer = selection[i];
                    var textSize = textLayer.fontSize();
                    var textString = textLayer.stringValue();
                    var textFont = NSFont.fontWithName_size(postScriptName, textSize);
                    var match;
                    while(match = reg_latin_1.exec(textString)) {
                        // log(match[0] + ' >>>> range(' + match.index + ', ' + (match.index + match[0].length) + ')');
                        var range = NSMakeRange(match.index, match[0].length);
                        textLayer.setIsEditingText(true);
                        textLayer.addAttribute_value_forRange(NSFontAttributeName, textFont, range);
                        textLayer.setIsEditingText(false);
                    }
                }
            }

            preferences.set("defaultLatinFont", postScriptName);

        } else {
            doc.showMessage("Please enter the PostScript name.");
        }
    }

}
