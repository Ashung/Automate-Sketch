var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var document = require("sketch/dom").getSelectedDocument();
    var selection = document.selectedLayers.layers;

    var selectedSymbolInstances = selection.filter(function(layer) {
        return layer.type == "SymbolInstance";
    });
    if (selectedSymbolInstances.length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance.");
        return;
    }

    var librarySymbols = selectedSymbolInstances.filter(function(layer) {
        return layer.master.getLibrary() ? true : false;
    });
    var librarySymbolsIds = librarySymbols.map(function(symbol) {
        return symbol.id;
    });

    // library symbols inside symbol
    selectedSymbolInstances.forEach(function(layer) {
        var symbols = layer.overrides.filter(function(override) {
            return override.symbolOverride == 1;
        }).map(function(override) {
            return document.getSymbolMasterWithID(override.value);
        }).filter(function(symbol) {
            return symbol.getLibrary() ? true : false;
        });
        symbols.forEach(function(symbol) {
            if (!librarySymbolsIds.includes(symbol.id)) {
                librarySymbols.push(symbol);
                librarySymbolsIds.push(symbol.id);
            }
        });
    });

    if (librarySymbols.length == 0) {
        sketch.UI.message("Please select at least 1 library symbol or symbol instance include library symbol.");
        return;
    }

    var count = 0;
    librarySymbols.forEach(function(layer) {
        var success = layer.master.syncWithLibrary();
        if (success) {
            count ++;
        }
    });

    AppController.sharedInstance().refreshDocumentWindowBadges();

    sketch.UI.message("Sync " + count + " library symbol" + (count > 1 ? "s" : "") + ".");

};
