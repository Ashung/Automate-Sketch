// TODO: New Feature: Find and replace symbol.

var onRun = function(context) {

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var toast = require("sketch/ui").message;
    var sketch = require("sketch/dom");
    var document = sketch.getSelectedDocument();

    
    // Get all symbols
    var symbols = document.getSymbols();
    if (symbols.length == 0) {
        toast("Document have not any symbols.");
        return;
    }
    var allSymbolsNames = symbols.map(function(symbol) {
        return symbol.name;
    });


    var dialog = new Dialog("Find and Replace Symbol", "info");

    dialog.addLabel("Find");

    
    var findSymbolView = ui.popupButton(allSymbolsNames);
    dialog.addView(findSymbolView);

    dialog.addLabel("Replace");



    dialog.run();

};