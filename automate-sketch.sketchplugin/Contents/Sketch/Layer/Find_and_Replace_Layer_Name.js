var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var toast = require("sketch").UI.message;
    var util = require("util");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");

    var dialog = new Dialog(
        'Find & Replace Layer Name',
        'Input string like "123" or Regular Expression like "\d+".'
    );

    dialog.addLabel("Find:");

    var defaultFindString = preferences.get("findAndReplaceFind") || "";
    var findView = ui.textField(defaultFindString);
    dialog.addView(findView);

    dialog.addLabel("Replace:");

    var defaultReplaceString = preferences.get("findAndReplaceReplace") || "";
    var replaceView = ui.textField(defaultReplaceString);
    dialog.addView(replaceView);

    dialog.addLabel("Find Layers From:");

    var findLayersFrom = preferences.get("findAndReplaceFrom") || 0;
    var layersFrom = [
        "Current Page",
        "Selection",
        "Children Layers in Selection"
    ];
    var layersFromView = ui.popupButton(layersFrom);
    layersFromView.selectItemAtIndex(findLayersFrom);
    dialog.addView(layersFromView);

    var nameMatchCase = preferences.get("findAndReplaceMatchCase") || false;
    var matchCaseView = ui.checkBox(nameMatchCase, "Match Case");
    dialog.addView(matchCaseView);

    var nameMatchWholeWord = preferences.get("findAndReplaceMatchWholeWord") || false;
    var matchWholeWordView = ui.checkBox(nameMatchWholeWord, "Match Whole Word");
    dialog.addView(matchWholeWordView);

    var nameRegExp = preferences.get("findAndReplaceRegExp") || false;
    var regExpView = ui.checkBox(nameRegExp, "Use Regular Expression");
    dialog.addView(regExpView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        // Save preferences
        preferences.set("findAndReplaceFind", findView.stringValue());
        preferences.set("findAndReplaceReplace", replaceView.stringValue());
        preferences.set("findAndReplaceFrom", layersFromView.indexOfSelectedItem());
        preferences.set("findAndReplaceMatchCase", Boolean(matchCaseView.state()));
        preferences.set("findAndReplaceMatchWholeWord", Boolean(matchWholeWordView.state()));
        preferences.set("findAndReplaceRegExp", Boolean(regExpView.state()));

        // Filter layers
        var currentPage = context.document.currentPage();
        var layers = NSMutableArray.alloc().init();
        if (layersFromView.indexOfSelectedItem() == 0) {
            layers.addObjectsFromArray(currentPage.children());
            layers.removeObject(currentPage);

        } else if (layersFromView.indexOfSelectedItem() == 1) {
            layers.addObjectsFromArray(context.selection);

        } else if (layersFromView.indexOfSelectedItem() == 2) {
            context.selection.forEach(function(item) {
                var _layer = item.children();
                _layer.removeObject(item);
                layers.addObjectsFromArray(_layer);
            });
            
        }





    }
};