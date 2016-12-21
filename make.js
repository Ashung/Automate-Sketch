
var fs = require("fs");
var yaml = require("js-yaml");
var Mustache = require("mustache");
var supportLanguages = ["en", "zh_Hans", "zh_Hant"];

var buildDateString = "1.0." + getDateString();


var language = yaml.safeLoad(fs.readFileSync("languages/zh_Hans.yaml", "utf8"));
    language.version = buildDateString;
var template = fs.readFileSync("manifest.mustache", "utf8");


var output = Mustache.render(template, language);

console.log(output)

function getDateString() {
    var y = new Date().getFullYear(),
        m = new Date().getMonth() > 8 ? new Date().getMonth() + 1 : "0" + (new Date().getMonth() + 1),
        d = new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate();
    return "" + y + m + d;
}
