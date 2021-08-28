var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var pasteboard = require("../modules/Pasteboard");
    var util = require("util");

    var userDefaults = NSUserDefaults.standardUserDefaults();
    var shortcuts = userDefaults.dictionaryForKey("NSUserKeyEquivalents");

    var shortcutMenuTitles = [];
    if (shortcuts) {
        shortcutMenuTitles = util.toArray(shortcuts.allKeys()).map(function(item) {
            return String(item).split("\u001b").splice(3).join("->");
        });
    } else {
        shortcuts = NSDictionary.alloc().init();
    }

    var commands = __command.pluginBundle().commands();
    var manifest = require("../manifest.json");
    var sketchLanguage = String(userDefaults.objectForKey("AppleLanguages").firstObject());
    var pluginMenu = /^zh/.test(sketchLanguage) ? "插件" :  "Plugins";
    var pluginName = manifest.menu.title;
    var commandViews = [];

    loopMenus(manifest.menu.items, "");
    
    function loopMenus(items, groupTitle) {
        items.forEach(function(item) {
            if (typeof item == "object" && Array.isArray(item.items)) {
                if (item.title != "Help" && item.title != "帮助") {
                    var title = (groupTitle == "" ? "" : groupTitle + "->") + item.title;
                    loopMenus(item.items, title);
                }
            }
            if (item != "-" && typeof item == "string") {
                var command = commands.valueForKey(item);
                var itemView = ui.view([500, 40]);
                var itemLabel = groupTitle + "->" + command.name();
                var labelView = ui.button(itemLabel, [10, 10, 400, 20]);
                labelView.setBordered("NO");
                labelView.sizeToFit();
                labelView.setCOSJSTargetFunction(function(sender) {
                    var menu = pluginMenu + "->" + pluginName + "->" + sender.title();
                    pasteboard.copy(menu);
                    sketch.UI.message('"' + menu + '" copied.');
                });
                var shortcutView = ui.textField("", [400, 10, 80, 20]);
                itemView.addSubview(labelView);
                itemView.addSubview(shortcutView);
                if (shortcuts && shortcutMenuTitles.includes(itemLabel)) {
                    var shortcutKeys = shortcuts.allValues().objectAtIndex(shortcutMenuTitles.indexOf(itemLabel));
                    if (shortcutKeys) {
                        shortcutView.setStringValue(shortcutKeys);
                    }
                }
                commandViews.push(itemView);
            }
        });
    }

    var dialog = new Dialog(
        "Shortcuts Manager",
        "This setting is same as System Preferences - Keyboard - Shortcuts, but you need to restart Sketch to apply settings. If you don't want to restart Sketch, click the plugin menus in the list to copy the menu title string, then go to System Preferences - Keyboard - Shortcuts to add a shortcut." +
        "DO NOT USE the modifier key name and symbol in shortcut input, use the meta-key in the list below, for example \"@$t\" is equal to \"cmd+shift+t\".\n\n" +
        "Command (⌘): @          Alt/Option (⌥): ~          Control (⌃): ^          Shift (⇧): $\n" +
        "Delete: \\u007f           Tab: \\u0009           Return: \\u000d           Space: \\u0020\n" +
        "←: \\u001c            →: \\u001d            ↑: \\u001e            ↓: \\u001f", 
        500,
        ["Save", "Cancel"]
    );

    var scrollView = ui.scrollView(commandViews, [500, 400]);
    dialog.addView(scrollView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var shortcutsCopy = shortcuts.mutableCopy();
        commandViews.forEach(function(item) {
            var key = ["", pluginMenu, pluginName].concat(item.subviews().objectAtIndex(0).title().split("->")).join("\u001b");
            var value = item.subviews().objectAtIndex(1).stringValue();
            if (value != "") {
                shortcutsCopy.setValue_forKey(value, key);
            }
            userDefaults.setObject_forKey(shortcutsCopy, "NSUserKeyEquivalents");
        });
        userDefaults.synchronize();
    }
};
