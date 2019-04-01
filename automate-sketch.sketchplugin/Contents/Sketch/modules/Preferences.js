module.exports.get = function (context, key) {
    var identifier = context.plugin.identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    if (!userDefaults.dictionaryForKey(identifier)) {
        var defaultPreferences = NSMutableDictionary.alloc().init();
        userDefaults.setObject_forKey(defaultPreferences, identifier);
        userDefaults.synchronize();
    }
    return userDefaults.dictionaryForKey(identifier).objectForKey(key);
}

module.exports.set = function (context, key, value) {
    var identifier = context.plugin.identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    if (!userDefaults.dictionaryForKey(identifier)) {
        var preferences = NSMutableDictionary.alloc().init();
    } else {
        var preferences = NSMutableDictionary.dictionaryWithDictionary(userDefaults.dictionaryForKey(identifier));
    }
    preferences.setObject_forKey(value, key);
    userDefaults.setObject_forKey(preferences, identifier);
    userDefaults.synchronize();
}