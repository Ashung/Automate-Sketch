var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga(context, "Development");

    var ui = require("../modules/ui");
    var userDefaults = NSUserDefaults.standardUserDefaults();

    var dialog = ui.cosDialog(
        "Plugin Dev Settings",
        "For more info, visit https://developer.sketch.com/guides/preferences."
    );

    var disableAutomaticSafeMode = userDefaults.objectForKey("disableAutomaticSafeMode");
    var disableAutomaticSafeModeSetting = ui.checkBox(disableAutomaticSafeMode, "Disable Safe Mode");
    dialog.addAccessoryView(disableAutomaticSafeModeSetting);

    var actionWildcardsAllowed = userDefaults.objectForKey("actionWildcardsAllowed");
    var actionWildcardsAllowedSetting = ui.checkBox(actionWildcardsAllowed, "Listen to All Actions");
    dialog.addAccessoryView(actionWildcardsAllowedSetting);

    var alwaysReloadScript = userDefaults.objectForKey("AlwaysReloadScript");
    var alwaysReloadScriptSetting = ui.checkBox(alwaysReloadScript, "Always Reload Scripts Before Running");
    dialog.addAccessoryView(alwaysReloadScriptSetting);

    var webKitDeveloperExtras = userDefaults.objectForKey("WebKitDeveloperExtras");
    var webKitDeveloperExtrasSetting = ui.checkBox(webKitDeveloperExtras, "Inspect a WebView");
    dialog.addAccessoryView(webKitDeveloperExtrasSetting);

    var label1 = ui.textLabel("Code Editor for Plugins");
    dialog.addAccessoryView(label1);

    var pluginEditor = userDefaults.objectForKey("Plugin Editor") || "";
    var pluginEditorSetting = ui.textField(pluginEditor);
    dialog.addAccessoryView(pluginEditorSetting);

    var label2 = ui.textLabel("'Custom Plugin…' Font");
    dialog.addAccessoryView(label2);

    var scriptEditorFont = userDefaults.objectForKey("scriptEditorFont") || "";
    var scriptEditorFontSetting = ui.textField(scriptEditorFont);
    dialog.addAccessoryView(scriptEditorFontSetting);

    var label6 = ui.textLabel("'Custom Plugin…' Font Size");
    dialog.addAccessoryView(label6);

    var scriptEditorFontSize = userDefaults.objectForKey("scriptEditorFontSize") || "12";
    var scriptEditorFontSizeSetting = ui.numberField(scriptEditorFontSize, 10, 20);
    dialog.addAccessoryView(scriptEditorFontSizeSetting.view);

    var responseCode = dialog.runModal();
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
        if (scriptEditorFontSizeSetting.value == 12) {
            userDefaults.removeObjectForKey("scriptEditorFontSize");
        } else {
            userDefaults.setObject_forKey(scriptEditorFontSizeSetting.value, "scriptEditorFontSize");
        }
        userDefaults.synchronize();
        // AppController.sharedInstance().pluginManager().reloadPlugins();
    }
};
