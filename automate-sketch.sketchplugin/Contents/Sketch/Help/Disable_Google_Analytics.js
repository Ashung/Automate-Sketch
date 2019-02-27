var onRun = function(context) {
    var identifier = context.plugin.identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    userDefaults.setObject_forKey(false, identifier + ".useGoogleAnalytics");
    userDefaults.synchronize();
    context.document.showMessage("Google Analytics tracking is disabled.");
};