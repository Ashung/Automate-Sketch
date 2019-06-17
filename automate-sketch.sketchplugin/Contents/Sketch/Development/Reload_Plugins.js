var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Development");
    AppController.sharedInstance().pluginManager().reloadPlugins();
};
