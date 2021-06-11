var onOpenDocument = function(context) {

    var preferences = require("../modules/Preferences");
    var userDefaults = NSUserDefaults.standardUserDefaults();
    var sketchLanguage = String(userDefaults.objectForKey("AppleLanguages").firstObject()).replace(/-\w*/g, "");
    var pluginLanguage = preferences.get("pluginLanguage");

    if (pluginLanguage != sketchLanguage) {
        var languageFileURL = context.plugin.urlForResourceNamed("manifest_" + sketchLanguage + ".json");
        if (languageFileURL) {
            var manifestFilePath = context.plugin.url().path() + "/Contents/Sketch/manifest.json";
            var languageFilePath = languageFileURL.path();
            // Remove manifest.json
            NSFileManager.defaultManager().removeItemAtPath_error(manifestFilePath, nil);
            // Replace manifest.json
            NSFileManager.defaultManager().copyItemAtPath_toPath_error(languageFilePath, manifestFilePath, nil);
            // Reload Plugin
            AppController.sharedInstance().pluginManager().reloadPlugins();

            preferences.set("pluginLanguage", sketchLanguage);
        }
    }
};
