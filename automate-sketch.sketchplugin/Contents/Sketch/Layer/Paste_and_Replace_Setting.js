var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Preferences");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    // Dialog
    var dialog = new Dialog(
        "Paste and Replace Setting",
        "The position of new layer relative the old one."
    );

    var layerPosition = ui.popupButton([
        "↖️ Top-left (default)",
        "⏺ Center",
        "⬆️ Top-center",
        "↗️ Top-right",
        "⬅️ Left-center",
        "➡️ Right-center",
        "↙️ Bottom-left",
        "⬇️ Bottom-center",
        "↘️ Bottom-right"
    ]);
    dialog.addView(layerPosition);
    layerPosition.selectItemAtIndex(parseInt(preferences.get("pasteAndReplaceLayerPosition")) || 0);
    layerPosition.setCOSJSTargetFunction(function(sender) {
        preferences.set("pasteAndReplaceLayerPosition", String(sender.indexOfSelectedItem()));
    });

    // Run
    dialog.run();

};