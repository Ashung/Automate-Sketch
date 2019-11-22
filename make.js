#!/usr/bin/env node

var fs = require("fs");
var yaml = require("js-yaml");
var Mustache = require("mustache");
var sketchVersion = process.argv[2];

sketchVersion = Number(sketchVersion).toFixed(1) + "." + getDateString();

var template = fs.readFileSync("templates/manifest.mustache", "utf8");
var features = 0;

var data = yaml.safeLoad(fs.readFileSync("templates/langs.yaml", "utf8"));
data.version = [sketchVersion, sketchVersion];


var language_en = {};
var language_zh = {};

Object.keys(data).forEach(key => {
    language_en[key] = data[key][0];
    language_zh[key] = data[key][1] || data[key][0];
});

[language_en, language_zh].forEach((language, index) => {
    try {
        var manifest = Mustache.render(template, language);
        if (JSON.parse(manifest)) {
            var manifestJSON = JSON.parse(manifest);
            var commands = manifestJSON.commands;
            commands.forEach(function(command) {
                if (command.name) {
                    command["icon"] = "icon_runner.png";
                    // TODO: add description for sketch runner
                    // https://docs.sketchrunner.com/developers
                }
            });
            manifest = JSON.stringify(manifestJSON, null, 2);

            if (index == 0) {
                fs.writeFileSync("automate-sketch.sketchplugin/Contents/Resources/manifest_en.json", manifest);
                fs.writeFileSync("automate-sketch.sketchplugin/Contents/Sketch/manifest.json", manifest);
            } else {
                fs.writeFileSync("automate-sketch.sketchplugin/Contents/Resources/manifest_zh.json", manifest);
            }

            features = commands.length;
        }
    } catch (e) {
        console.error(e);
    }
});

console.log("Features: " + features);

function getDateString() {
    var y = new Date().getFullYear(),
        m = new Date().getMonth() > 8 ? new Date().getMonth() + 1 : "0" + (new Date().getMonth() + 1),
        d = new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate();
    return "" + y + m + d;
}
