var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Help");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var manifestFilePath = context.plugin.url().path() + "/Contents/Sketch/manifest.json";

    var supportLanguages = {
        "en": "English",
        "zh": "简体中文"
    };
    var supportLanguagesKeys = Object.keys(supportLanguages);
    var supportLanguagesValues = [];
    for (var key in supportLanguages) {
        supportLanguagesValues.push(supportLanguages[""+key+""]);
    }

    // Dialog
    var dialog = new Dialog("Change Menu Language");

    var languagesView = ui.popupButton(supportLanguagesValues);
    dialog.addView(languagesView);

    // Click OK button
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var languageIndex = languagesView.indexOfSelectedItem();
        var languageFileURL = context.plugin.urlForResourceNamed("manifest_" + supportLanguagesKeys[languageIndex] + ".json");
        if (languageFileURL) {
            var languageFilePath = languageFileURL.path();
            // Remove manifest.json
            NSFileManager.defaultManager().removeItemAtPath_error_(
                manifestFilePath, nil
            );
            // Replace manifest.json
            NSFileManager.defaultManager().copyItemAtPath_toPath_error_(
                languageFilePath, manifestFilePath, nil
            );
            // Reload Plugin
            AppController.sharedInstance().pluginManager().reloadPlugins();
        } else {
            var alert = require("sketch/ui").alert;
            alert(
                "Language file not found.",
                "Language file \"" + context.plugin.url().path() + "/Contents/Resources/manifest_" + supportLanguagesKeys[languageIndex] + ".json\" does not existed."
            );
        }

    }

    
};
