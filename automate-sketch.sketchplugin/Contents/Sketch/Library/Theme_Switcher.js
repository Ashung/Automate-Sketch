var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    if (document.selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");

    var dialog = new Dialog("Theme Switcher", "Find and replace symbols, styles, colors that match the key word.");

    dialog.addLabel("Key Word");
    var wrap = ui.view(25);
    var fromTextView = ui.textField(preferences.get("themeSwitcherKeyFrom") || "Light", [0, 0, 100, 25]);
    var toTextView = ui.textField(preferences.get("themeSwitcherKeyTo") || "Dark", [125, 0, 100, 25]);
    var textView = ui.textLabel('→', [105, 5, 20, 25]);
    wrap.addSubview(fromTextView);
    wrap.addSubview(toTextView);
    wrap.addSubview(textView);
    dialog.addView(wrap);

    var checkboxSymbol = ui.checkBox(preferences.get("themeSwitcherSymbol") || true, "Replace Symbols.");
    var checkboxLayerStyle = ui.checkBox(preferences.get("themeSwitcherLayerStyle") || true, "Replace Layer Styles.");
    var checkboxTextStyle = ui.checkBox(preferences.get("themeSwitcherTextStyle") || true, "Replace Text styles.");
    var checkboxColor = ui.checkBox(preferences.get("themeSwitcherColor") || true, "Replace color variables.");

    dialog.addView(checkboxSymbol);
    dialog.addView(checkboxLayerStyle);
    dialog.addView(checkboxTextStyle);
    dialog.addView(checkboxColor);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        preferences.set("themeSwitcherKeyFrom", fromTextView.stringValue());
        preferences.set("themeSwitcherKeyTo", toTextView.stringValue());
        preferences.set("themeSwitcherSymbol", Boolean(checkboxSymbol.state()));
        preferences.set("themeSwitcherLayerStyle", Boolean(checkboxLayerStyle.state()));
        preferences.set("themeSwitcherTextStyle", Boolean(checkboxTextStyle.state()));
        preferences.set("themeSwitcherColor", Boolean(checkboxColor.state()));
    }

}