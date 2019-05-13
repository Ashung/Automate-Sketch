// TODO: New Feature: Find and replace symbol.

var onRun = function(context) {

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var dialog = new Dialog("Find and Replace Symbol", "info");

    var views = [];
    var views2 = [];
    for (var i = 0; i < 100; i++) {
        views.push(ui.checkBox(true, String(i)));
        views2.push(ui.checkBox(true, "AAAA" + String(i)));
        //views.push(ui.divider());
    }

    var scrollView = ui.scrollView(views, [0, 0, 400, 400]);
    dialog.addView(scrollView);

    // ui.scrollViewSetContent(scrollView, views2);

    dialog.run();

};