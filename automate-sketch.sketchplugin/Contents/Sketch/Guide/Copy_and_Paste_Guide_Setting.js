var copyGuide = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    if (selection.count() > 0) {
        // Get guide setting of first layer
        var layer = selection.firstObject();
        if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
            copyGuideToPasteboard(context, layer);
        } else {
            document.showMessage("The layer \"" + layer.name() + "\" is not a artboard.");
            return;
        }
    } else {
        // Get guide setting of page
        if (page.artboards().count() == 0) {
            copyGuideToPasteboard(context, page);
        } else {
            document.showMessage("No guide setting in \"" + page.name() + "\".");
            return;
        }
    }

};

var pasteGuide = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var document = context.document;
    var selection = context.selection;
    var page = document.currentPage();

    var pasteboardString = getStringFromPasteboard(context);
    if (pasteboardString) {
        try {
            var guideSetting = JSON.parse(pasteboardString);
            if (selection.count() > 0) {
                // Set guide for artboards
                var loopSelection = selection.objectEnumerator();
                while (layer = loopSelection.nextObject()) {
                    if (layer.class() == "MSArtboardGroup" || layer.class() == "MSSymbolMaster") {
                        applyGuideToLayer(guideSetting, layer);
                    }
                }
            } else {
                // Set guide for page
                if (page.artboards().count() == 0) {
                    applyGuideToLayer(guideSetting, page);
                }
            }

            // Show guide
            if (!document.isRulersVisible()) {
                var toggleRulersAction = document.actionsController().actionForID("MSToggleRulersAction");
                if(toggleRulersAction.validate()) {
                    toggleRulersAction.performAction(nil);
                }
            }

        } catch (err) {
            document.showMessage("Please copy a guide setting first.");
        }
    }
};

function copyGuideToPasteboard(context, layer) {

    var document = context.document;

    if (
        layer.horizontalRulerData().guides().count() == 0 &&
        layer.verticalRulerData().guides().count() == 0
    ) {
        document.showMessage("No guide setting in \"" + layer.name() + "\".");
        return;
    } else {
        var horizontalRulerData = layer.horizontalRulerData().guides().componentsJoinedByString(",");
        var verticalRulerData = layer.verticalRulerData().guides().componentsJoinedByString(",");
        var guideSetting = '{' +
            '"horizontalRulerData":[' + horizontalRulerData + '],' +
            '"verticalRulerData":[' + verticalRulerData + ']}';
        copyStringToPasteboard(context, guideSetting);
    }
}

function applyGuideToLayer(guideSetting, layer) {
    if (guideSetting.horizontalRulerData) {
        layer.horizontalRulerData().setGuides(guideSetting.horizontalRulerData);
    }
    if (guideSetting.verticalRulerData) {
        layer.verticalRulerData().setGuides(guideSetting.verticalRulerData);
    }
}

function copyStringToPasteboard(context, string) {
    var pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    pasteboard.setString_forType(NSMutableString.stringWithString(string), NSPasteboardTypeString);
    context.document.showMessage("Guide setting copied.");
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
