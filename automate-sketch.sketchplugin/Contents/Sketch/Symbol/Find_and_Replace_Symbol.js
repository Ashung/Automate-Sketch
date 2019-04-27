// TODO: New Feature: Find and replace symbol.

var onRun = function(context) {

    var Dialog = require("../modules/Dialog");
    var UI = require("../modules/UI");

var dialog = new Dialog("title", "info");

console.log(context.plugin)

dialog.addView(UI.textField("eeeee"));
// 
dialog.run()

console.log(dialog.views)
};