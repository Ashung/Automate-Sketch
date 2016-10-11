
// Create multi-language manifest.json files.

var fs = require("fs");
var yaml = require("js-yaml");
var manifestFile = "manifest.yaml";
var supportLanguages = ["en", "zh_Hans"];

fs.watch(manifestFile, function (event, filename) {
    if (event == "change" && filename) {

        try {
            var startTime = new Date().getTime();
            var buildDateString = getDateString();
            var manifest = yaml.safeLoad(fs.readFileSync(manifestFile, "utf8"));
            var finalManifest = {};

            for (var key in manifest) {
                if (key != "menuConfigs") {
                    finalManifest["" + key + ""] = manifest["" + key + ""];
                }
            }
            finalManifest.version += "." + buildDateString;

            for (var i = 0; i < supportLanguages.length; i++) {
                // Add commands
                finalManifest.commands = [];
                getCommands(manifest.menuConfigs.items, supportLanguages[i], finalManifest.commands);

                // Add menu
                finalManifest.menu = {};
                finalManifest.menu.isRoot = false;
                finalManifest.menu.title = manifest.menuConfigs.title["" + supportLanguages[i] + ""];
                finalManifest.menu.items = [];
                getMenus(manifest.menuConfigs.items, supportLanguages[i], finalManifest.menu.items);

                // Write manifest.json
                fs.writeFileSync(
                    "automate-sketch.sketchplugin/Contents/Resources/manifest_" + supportLanguages[i] + ".json",
                    JSON.stringify(finalManifest, null, 4)
                );
                if (supportLanguages[i] == "en") {
                    fs.writeFileSync(
                        "automate-sketch.sketchplugin/Contents/Sketch/manifest.json",
                        JSON.stringify(finalManifest, null, 4)
                    );
                }

            }

            var endTime = new Date().getTime();
            var runTime = endTime - startTime;
            // console.log("File \"" + manifestFile + "\" " + event + ". Remake manifest file finished. Use " + runTime + "ms.");

        } catch (e) {
            console.log(e);
        }

    }
});

function getDateString() {
    var y = new Date().getFullYear(),
        m = new Date().getMonth() > 8 ? new Date().getMonth() + 1 : "0" + (new Date().getMonth() + 1),
        d = new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate();
    return "" + y + m + d;
}

function getCommands(commandsArray, language, resultArray) {
    for (var i = 0; i < commandsArray.length; i++) {
        for (var j = 0; j < commandsArray[i].items.length; j++) {
            var command = commandsArray[i].items[j];
            if (command.identifier != "-") {
                var commandObj = {};
                commandObj["name"] = command["name"]["" + language + ""];
                for (var key in command) {
                    if (key != "name") {
                        commandObj["" + key + ""] = command["" + key + ""];
                    }
                }
                resultArray.push(commandObj);
            }
        }
    }
}

function getMenus(menuArray, language, resultArray) {
    for (var i = 0; i < menuArray.length; i++) {
        var menuObj = {};
            menuObj.title = menuArray[i].title["" + language + ""];
            menuObj.items = [];
        for (var j = 0; j < menuArray[i].items.length; j++) {
            var menu = menuArray[i].items[j];
            menuObj.items.push(menu.identifier);
        }
        resultArray.push(menuObj);
    }
}
