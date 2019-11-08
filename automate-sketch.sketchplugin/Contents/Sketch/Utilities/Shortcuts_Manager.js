var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");



    var userDefaults = NSUserDefaults.standardUserDefaults();
    var shortcuts = userDefaults.dictionaryForKey("NSUserKeyEquivalents");
    var shortcutMenuTitles;
    if (shortcuts) {
        shortcutMenuTitles = util.toArray(shortcuts.allKeys()).map(function(item) {
            return String(item).split("\u001b").splice(3).join("->");
        });
    }

    var commands = __command.pluginBundle().commands();
    var manifest = require("../manifest.json");
    var pluginMenu = "";
    var pluginName = manifest.menu.title;
    var commandViews = [];

    // TODO: 
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
                var labelView = ui.textLabel(itemLabel, [10, 10, 400, 20]);
                var shortcutView = ui.textField("", [400, 10, 80, 20]);
                itemView.addSubview(labelView);
                itemView.addSubview(shortcutView);
                if (shortcuts && shortcutMenuTitles.includes(itemLabel)) {
                    var shortcutKeys = shortcuts.allValues().objectAtIndex(shortcutMenuTitles.indexOf(itemLabel));
                    log(shortcutKeys);
                    if (shortcutKeys) {
                        shortcutView.setStringValue(shortcutKeys);
                    }
                }
                

                commandViews.push(itemView);
            }
        });
    }

    log(shortcutMenuTitles);
    // log(commands);


    // manifest.menu.items.forEach(function(group) {
    //     // log(group)
    //     group.items.forEach(function(item) {
    //         if (group.title != "Help" || group.title != "帮助") {
    //             if (item != "-") {
    //                 menus.push(group.title + "->" + item);
    //             }
    //         }
    //     });
    // });

    // log(menus);
    // menus.forEach(menu => {
    //     
    // })


    
    // log(commands);
    // util.toArray(commands).forEach(item => {
    //     log(item.name());
    //     log(item.shortcut());
    // });


// .allKeys().firstObject().toString()

    var dialog = new Dialog(
        "Shortcuts Manager",
        "Command: @\nAlt/Option: ~\nControl: ^\nShift: $",
        500,
        ["Close"]
    );

    var scrollView = ui.scrollView(commandViews, [500, 400]);
    dialog.addView(scrollView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {



    }


};
