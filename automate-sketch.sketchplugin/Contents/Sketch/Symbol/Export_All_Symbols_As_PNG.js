var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var system = require("../modules/System");
    var document = context.document;
    var allSymbols = document.documentData().localSymbols();

    if (allSymbols.count() == 0) {
        document.showMessage("This document has no local symbols.");
        return;
    }

    var path = system.chooseFolder();
    if (path) {

        var loopAllSymbols = allSymbols.objectEnumerator();
        var symbol;
        while (symbol = loopAllSymbols.nextObject()) {
            var fileName = symbol.parentPage().name() + "/" + symbol.name();
            var fileNameParts = fileName.split("/");
            fileNameParts = fileNameParts.map(function(item) {
                return item.trim().replace(/^\./, "_")
                    .replace(/[`~!@#$%^&*+=:;,<>?|(){}\[\]\\]/g, "")
                    .trim();
            });
            fileName = fileNameParts.join("/") + ".png";
            document.saveArtboardOrSlice_toFile(symbol, path + "/" + fileName);
        }

        // Show in Finder
        system.showInFinder(path);

    }

};
