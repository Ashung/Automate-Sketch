module.exports.get = function (key) {
    var identifier = __command.pluginBundle().identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    if (!userDefaults.dictionaryForKey(identifier)) {
        var defaultPreferences = NSMutableDictionary.alloc().init();
        userDefaults.setObject_forKey(defaultPreferences, identifier);
        userDefaults.synchronize();
    }
    return userDefaults.dictionaryForKey(identifier).objectForKey(key);
}

module.exports.set = function (key, value) {
    var identifier = __command.pluginBundle().identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    var preferences;
    if (!userDefaults.dictionaryForKey(identifier)) {
        preferences = NSMutableDictionary.alloc().init();
    } else {
        preferences = NSMutableDictionary.dictionaryWithDictionary(userDefaults.dictionaryForKey(identifier));
    }
    preferences.setObject_forKey(value, key);
    userDefaults.setObject_forKey(preferences, identifier);
    userDefaults.synchronize();
}