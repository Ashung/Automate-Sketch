var copyGrid = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    if (selection.count() > 0) {
        // Get grid setting of first layer
        var layer = selection.firstObject();
        if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
            if (layer.grid()) {
                copyGridToPasteboard(context, layer);
            } else {
                document.showMessage("No grid setting in \"" + layer.name() + "\".");
                return;
            }
        } else {
            document.showMessage("The layer \"" + layer.name() + "\" is not a artboard.");
            return;
        }
    } else {
        // Get grid setting of page
        if (page.grid() && page.artboards().count() == 0) {
            copyGridToPasteboard(context, page);
        } else {
            document.showMessage("No grid setting in \"" + page.name() + "\".");
            return;
        }
    }

};

var pasteGrid = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    var pasteboardString = getStringFromPasteboard(context);
    if (pasteboardString) {
        try {
            var gridSetting = JSON.parse(pasteboardString);
            if (selection.count() > 0) {
                // Set grid for artboards
                var loopSelection = selection.objectEnumerator();
                while (layer = loopSelection.nextObject()) {
                    if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
                        applyGridToLayer(gridSetting, layer);
                    }
                }
            } else {
                // Set grid for page
                if (page.artboards().count() == 0) {
                    applyGridToLayer(gridSetting, page);
                }
            }
        } catch (err) {
            document.showMessage("Please copy a grid setting first.");
        }
    }

};

function copyGridToPasteboard(context, layer) {
    var gridSetting = {
        "girdSize": layer.grid().gridSize(),
        "thickGridTimes": layer.grid().thickGridTimes(),
        "isEnabled": layer.grid().isEnabled()
    };
    copyStringToPasteboard(context, JSON.stringify(gridSetting));
}

function applyGridToLayer(gridSetting, layer) {
    var grid = MSSimpleGrid.alloc().init();
    grid.setGridSize(gridSetting.girdSize);
    grid.setThickGridTimes(gridSetting.thickGridTimes);
    grid.setIsEnabled(true);
    layer.setGrid(grid);
}

function copyStringToPasteboard(context, string) {
    var pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    pasteboard.setString_forType(NSMutableString.stringWithString(string), NSPasteboardTypeString);
    context.document.showMessage("Grid setting copied.");
}

function getStringFromPasteboard(context) {
    var pasteboard = NSPasteboard.generalPasteboard();
    var pasteboardItems = pasteboard.pasteboardItems();
    if (pasteboardItems.count() > 0) {
        var string = pasteboardItems.firstObject().stringForType(NSPasteboardTypeString);
        if (string) {
            return string;
        } else {
            context.document.showMessage("No grid setting in clipboard.");
            return nil;
        }
    }
}
