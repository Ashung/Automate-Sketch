var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");



    var userDefaults = NSUserDefaults.standardUserDefaults();


    log(userDefaults.dictionaryForKey("NSUserKeyEquivalents"));


    var commands = __command.pluginBundle().commands(); //.allValues()

    var manifest = require("../manifest.json");
    var pluginName = manifest.menu.title;
    var menus = [];
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
                menus.push(groupTitle + "->" + command.name());
                commandViews.push(ui.textLabel(groupTitle + "->" + command.name(), [500, 50]));
            }
        });
    }

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

    log(menus);
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
        "xxxxx",
        500,
        ["Close"]
    );

    



    var scrollView = ui.scrollView(commandViews, [500, 200]);
    dialog.addView(scrollView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {



    }


};