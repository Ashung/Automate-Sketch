var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var toast = require("sketch").UI.message;
    var util = require("util");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");

    var dialog = new Dialog(
        'Find & Replace Style Name',
        'Input string like "123" or Regular Expression like "\d+".'
    );

    dialog.addLabel("Find:");

    var defaultFindString = preferences.get("findAndReplaceStyleNameFind") || "";
    var findView = ui.textField(defaultFindString);
    dialog.addView(findView);

    dialog.addLabel("Replace:");

    var defaultReplaceString = preferences.get("findAndReplaceStyleNameReplace") || "";
    var replaceView = ui.textField(defaultReplaceString);
    dialog.addView(replaceView);


}