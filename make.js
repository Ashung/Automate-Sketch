
var fs = require("fs");
var yaml = require("js-yaml");
var Mustache = require("mustache");
var supportLanguages = ["en", "zh_Hans", "zh_Hant"];
var buildDateString = getDateString();
var template = fs.readFileSync("templates/manifest.mustache", "utf8");

var features = 0;

for (var i = 0; i < supportLanguages.length; i++) {
    var language = yaml.safeLoad(fs.readFileSync("templates/" + supportLanguages[i] + ".yaml", "utf8"));
        language.version = buildDateString;
    var manifest = Mustache.render(template, language);

    try {
        if (JSON.parse(manifest)) {
            fs.writeFileSync("automate-sketch.sketchplugin/Contents/Resources/manifest_" + supportLanguages[i] + ".json", manifest);
            if (supportLanguages[i] == "en") {
                fs.writeFileSync("automate-sketch.sketchplugin/Contents/Sketch/manifest.json", manifest);
            }
            features = JSON.parse(manifest)["commands"].length;
        }
    } catch (e) {
        console.error(e);
    }

}

console.log("Features: " + features);

function getDateString() {
    var y = new Date().getFullYear(),
        m = new Date().getMonth() > 8 ? new Date().getMonth() + 1 : "0" + (new Date().getMonth() + 1),
        d = new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate();
    return "" + y + m + d;
}
