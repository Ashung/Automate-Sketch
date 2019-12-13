var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var userDefaults = NSUserDefaults.standardUserDefaults();

    var dialog = new Dialog(
        "Plugin Dev Settings",
        "For more info, visit https://developer.sketch.com/guides/preferences."
    );

    var disableAutomaticSafeMode = userDefaults.objectForKey("disableAutomaticSafeMode");
    var disableAutomaticSafeModeSetting = ui.checkBox(disableAutomaticSafeMode, "Disable Safe Mode");
    dialog.addView(disableAutomaticSafeModeSetting);

    var actionWildcardsAllowed = userDefaults.objectForKey("actionWildcardsAllowed");
    var actionWildcardsAllowedSetting = ui.checkBox(actionWildcardsAllowed, "Listen to All Actions");
    dialog.addView(actionWildcardsAllowedSetting);

    var alwaysReloadScript = userDefaults.objectForKey("AlwaysReloadScript");
    var alwaysReloadScriptSetting = ui.checkBox(alwaysReloadScript, "Always Reload Scripts Before Running");
    dialog.addView(alwaysReloadScriptSetting);

    var webKitDeveloperExtras = userDefaults.objectForKey("WebKitDeveloperExtras");
    var webKitDeveloperExtrasSetting = ui.checkBox(webKitDeveloperExtras, "Inspect a WebView");
    dialog.addView(webKitDeveloperExtrasSetting);

    var label1 = ui.textLabel("Code Editor for Plugins");
    dialog.addView(label1);

    var pluginEditor = userDefaults.objectForKey("Plugin Editor") || "";
    var pluginEditorSetting = ui.textField(pluginEditor);
    dialog.addView(pluginEditorSetting);

    var label2 = ui.textLabel("'Custom Plugin…' Font");
    dialog.addView(label2);

    var scriptEditorFont = userDefaults.objectForKey("scriptEditorFont") || "";
    var scriptEditorFontSetting = ui.textField(scriptEditorFont);
    dialog.addView(scriptEditorFontSetting);

    var label6 = ui.textLabel("'Custom Plugin…' Font Size");
    dialog.addView(label6);

    var scriptEditorFontSize = userDefaults.objectForKey("scriptEditorFontSize") || "12";
    var scriptEditorFontSizeSetting = ui.numberStepper(scriptEditorFontSize, 10, 20);
    dialog.addView(scriptEditorFontSizeSetting.view);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        if (disableAutomaticSafeModeSetting.state() == NSOffState) {
            userDefaults.removeObjectForKey("disableAutomaticSafeMode");
        } else {
            userDefaults.setObject_forKey(true, "disableAutomaticSafeMode");
        }
        if (actionWildcardsAllowedSetting.state() == NSOffState) {
            userDefaults.removeObjectForKey("actionWildcardsAllowed");
        } else {
            userDefaults.setObject_forKey(true, "actionWildcardsAllowed");
        }
        if (alwaysReloadScriptSetting.state() == NSOffState) {
            userDefaults.removeObjectForKey("AlwaysReloadScript");
        } else {
            userDefaults.setObject_forKey(true, "AlwaysReloadScript");
        }
        if (webKitDeveloperExtrasSetting.state() == NSOffState) {
            userDefaults.removeObjectForKey("WebKitDeveloperExtras");
        } else {
            userDefaults.setObject_forKey(true, "WebKitDeveloperExtras");
        }
        if (pluginEditorSetting.stringValue() == "") {
            userDefaults.removeObjectForKey("Plugin Editor");
        } else {
            userDefaults.setObject_forKey(pluginEditorSetting.stringValue(), "Plugin Editor");
        }
        if (scriptEditorFontSetting.stringValue() == "") {
            userDefaults.removeObjectForKey("scriptEditorFont");
        } else {
            userDefaults.setObject_forKey(scriptEditorFontSetting.stringValue(), "scriptEditorFont");
        }

        if (scriptEditorFontSizeSetting.stepper.integerValue() == 12) {
            userDefaults.removeObjectForKey("scriptEditorFontSize");
        } else {
            userDefaults.setObject_forKey(scriptEditorFontSizeSetting.stepper.integerValue(), "scriptEditorFontSize");
        }
        userDefaults.synchronize();

    }
};
