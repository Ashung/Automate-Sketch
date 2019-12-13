
var pasteboard = NSPasteboard.generalPasteboard();

module.exports.pbcopy = function(text) {
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSPasteboardTypeString);
};

module.exports.layersFromPasteboard = function(context){
    var pasteboardManager = AppController.sharedInstance().pasteboardManager();
    var pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options(
        pasteboard, context.document.colorSpace(), nil
    );
    if (pasteboardLayers == null) {
        return;
    }
    return pasteboardLayers.layers().layers();
};

module.exports.textsFromPasteboard = function() {
    var data = pasteboard.dataForType(NSPasteboardTypeString);
    var text = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
    var texts = text.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet());
    return texts;
};

module.exports.setImage = function(nsData) {
    pasteboard.clearContents();
    pasteboard.setData_forType(nsData, NSPasteboardTypePNG);
};

module.exports.setText = function(text) {
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSPasteboardTypeString);
};
