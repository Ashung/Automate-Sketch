
var pasteboard = NSPasteboard.generalPasteboard();

module.exports.pbcopy = function(text) {
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSPasteboardTypeString);
};

module.exports.getLayers = function(context){
    var version = MSApplicationMetadata.metadata().appVersion;
    var pasteboardManager = AppController.sharedInstance().pasteboardManager();
    var pasteboardLayers;
    if (version >= 64) {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options_convertColorSpace(
            pasteboard, context.document.colorSpace(), nil, true
        );
    } else if (version >= 48) {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options(
            pasteboard, context.document.colorSpace(), nil
        );
    } else {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_options(pasteboard, nil);
    }
    if (pasteboardLayers == null) {
        return;
    }
    return pasteboardLayers.layers().layers();
};

module.exports.setImage = function(nsData) {
    pasteboard.clearContents();
    pasteboard.setData_forType(nsData, NSPasteboardTypePNG);
};

module.exports.setText = function(text) {
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSPasteboardTypeString);
};

module.exports.getTextsNsArray = function() {
    var data = pasteboard.dataForType(NSPasteboardTypeString);
    var text = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
    var texts = text.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet());
    return texts;
};

module.exports.getText = function() {
    var pasteboardItems = pasteboard.pasteboardItems();
    if (pasteboardItems.count() > 0) {
        return pasteboardItems.firstObject().stringForType(NSPasteboardTypeString);
    }
};
