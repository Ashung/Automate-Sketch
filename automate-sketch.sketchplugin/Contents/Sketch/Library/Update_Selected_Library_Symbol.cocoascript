var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var UI = require("sketch/ui");
    var document = require("sketch/dom").getSelectedDocument();
    var selection = document.selectedLayers;

    if (!selection.layers.some(isLibrarySymbol)) {
        UI.message("Please select at least 1 library symbol.");
        return;
    }
    
    var count = 0;
    selection.forEach(function(layer) {
        if (layer.type == "SymbolInstance") {
            var success = layer.master.syncWithLibrary();
            if (success) {
                count ++;
            }
        }
    });

    AppController.sharedInstance().refreshDocumentWindowBadges();

    UI.message("Sync " + count + " library symbol" + (count > 1 ? "s" : "") + ".");

};

function isLibrarySymbol(layer) {
    if (layer.type == "SymbolInstance") {
        return layer.master.getLibrary() ? true : false;
    }
    return false;
}
