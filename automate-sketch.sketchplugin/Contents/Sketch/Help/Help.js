var reportIssue = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Help");
    openUrlInBrowser("https://github.com/Ashung/Automate-Sketch/issues/");
};

var website = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Help");
    openUrlInBrowser("https://github.com/Ashung/Automate-Sketch/");
};

var changelog = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Help");
    openUrlInBrowser("http://ashung.github.io/Automate-Sketch/");
};

var donate = function() {
    var ga = require("../modules/Google_Analytics");
    ga("Help");
    openUrlInBrowser("https://ashung.github.io/donate.html?ref=automate-sketch");
};

function openUrlInBrowser(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}
