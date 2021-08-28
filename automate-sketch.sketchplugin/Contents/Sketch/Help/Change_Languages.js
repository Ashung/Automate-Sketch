var preferences = require("../modules/Preferences");
var userDefaults = NSUserDefaults.standardUserDefaults();
var sketchLanguage = String(userDefaults.objectForKey("AppleLanguages").firstObject()).replace(/-\w*/g, "");
var pluginLanguage = preferences.get("pluginLanguage");

var onRun = function(context) {
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var dialog = new Dialog(
        "Change Plugin Menu Language"
    );
    var supportedLanguages = {
        'auto': 'Auto',
        'zh': '简体中文',
        'en': 'English',
    };
    var titles = Object.values(supportedLanguages);
    var changeLanguage = ui.popupButton(titles, 300);
    if (pluginLanguage) {
        changeLanguage.selectItemAtIndex(titles.indexOf(supportedLanguages[pluginLanguage]));
    }
    dialog.addView(changeLanguage);
    
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var selectedLanguage = Object.keys(supportedLanguages)[changeLanguage.indexOfSelectedItem()];
        var lang = selectedLanguage == "auto" ? sketchLanguage : selectedLanguage;
        reloadManifest(context, lang);
        preferences.set("pluginLanguage", selectedLanguage);
    }

};

var onOpenDocument = function(context) {
    if (!pluginLanguage || pluginLanguage == "auto") {
        reloadManifest(context, sketchLanguage);
    }
};

function reloadManifest(context, lang) {
    var languageFileURL = context.plugin.urlForResourceNamed("manifest_" + lang + ".json");
    if (languageFileURL) {
        var manifestFilePath = context.plugin.url().path() + "/Contents/Sketch/manifest.json";
        var languageFilePath = languageFileURL.path();
        // Remove manifest.json
        NSFileManager.defaultManager().removeItemAtPath_error(manifestFilePath, nil);
        // Replace manifest.json
        NSFileManager.defaultManager().copyItemAtPath_toPath_error(languageFilePath, manifestFilePath, nil);
        // Reload Plugin
        AppController.sharedInstance().pluginManager().reloadPlugins();
    }
}
