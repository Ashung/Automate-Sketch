
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
