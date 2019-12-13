var copyLayout = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    if (selection.count() > 0) {
        // Get layout setting of first layer
        var layer = selection.firstObject();
        if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
            if (layer.layout()) {
                copyLayoutToPasteboard(context, layer);
            } else {
                document.showMessage("No layout setting in \"" + layer.name() + "\".");
                return;
            }
        } else {
            document.showMessage("The layer \"" + layer.name() + "\" is not an artboard.");
            return;
        }
    } else {
        // Get layout setting of page
        if (page.layout() && page.artboards().count() == 0) {
            copyLayoutToPasteboard(context, page);
        } else {
            document.showMessage("No layout setting in \"" + page.name() + "\".");
            return;
        }
    }

};

var pasteLayout = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    var pasteboardString = getStringFromPasteboard(context);
    if (pasteboardString) {
        try {
            var layoutSetting = JSON.parse(pasteboardString);
            if (selection.count() > 0) {
                // Set layout for artboards
                var loopSelection = selection.objectEnumerator();
                while (layer = loopSelection.nextObject()) {
                    if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
                        applyLayoutToLayer(layoutSetting, layer);
                    }
                }
            } else {
                // Set layout for page
                if (page.artboards().count() == 0) {
                    applyLayoutToLayer(layoutSetting, page);
                }
            }
        } catch (err) {
            document.showMessage("Please copy a grid setting first.");
        }
    }

};

function copyLayoutToPasteboard(context, layer) {
    var layoutSetting = {
        "columnWidth": layer.layout().columnWidth(),
        "drawHorizontal": layer.layout().drawHorizontal(),
        "drawHorizontalLines": layer.layout().drawHorizontalLines(),
        "drawVertical": layer.layout().drawVertical(),
        "gutterHeight": layer.layout().gutterHeight(),
        "gutterWidth": layer.layout().gutterWidth(),
        "guttersOutside": layer.layout().guttersOutside(),
        "horizontalOffset": layer.layout().horizontalOffset(),
        "isEnabled": layer.layout().isEnabled(),
        "numberOfColumns": layer.layout().numberOfColumns(),
        "rowHeightMultiplication": layer.layout().rowHeightMultiplication(),
        "totalWidth": layer.layout().totalWidth()
    };
    copyStringToPasteboard(context, JSON.stringify(layoutSetting));
}

function applyLayoutToLayer(layoutSetting, layer) {
    var layout = MSLayoutGrid.alloc().init();

    layout.setDrawVertical(layoutSetting.drawVertical);
    layout.setTotalWidth(layoutSetting.totalWidth);
    layout.setHorizontalOffset(layoutSetting.horizontalOffset);
    layout.setNumberOfColumns(layoutSetting.numberOfColumns);
    layout.setGuttersOutside(layoutSetting.guttersOutside);

    layout.setGutterWidth(layoutSetting.gutterWidth);
    layout.setColumnWidth(layoutSetting.columnWidth);

    layout.setDrawHorizontal(layoutSetting.drawHorizontal);
    layout.setGutterHeight(layoutSetting.gutterHeight);
    layout.setRowHeightMultiplication(layoutSetting.rowHeightMultiplication);
    layout.setDrawHorizontalLines(layoutSetting.drawHorizontalLines);
    layout.setIsEnabled(true);

    layer.setLayout(layout);
}

function copyStringToPasteboard(context, string) {
    var pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    pasteboard.setString_forType(NSMutableString.stringWithString(string), NSPasteboardTypeString);
    context.document.showMessage("Layout setting copied.");
}

function getStringFromPasteboard(context) {
    var pasteboard = NSPasteboard.generalPasteboard();
    var pasteboardItems = pasteboard.pasteboardItems();
    if (pasteboardItems.count() > 0) {
        var string = pasteboardItems.firstObject().stringForType(NSPasteboardTypeString);
        if (string) {
            return string;
        } else {
            context.document.showMessage("No layout setting in clipboard.");
            return nil;
        }
    }
}
