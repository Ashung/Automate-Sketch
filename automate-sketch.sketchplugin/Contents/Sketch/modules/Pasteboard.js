var pasteboard = NSPasteboard.generalPasteboard();

module.exports.copy = function(text) {
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSPasteboardTypeString);
};

module.exports.getPasteboardLayers = function() {
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var version = sketch.version.sketch;
    var pasteboardManager = NSApp.delegate().pasteboardManager();
    var pasteboardLayers;
    if (version >= 74) {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_document_options(
            pasteboard, document.sketchObject, nil
        );
    } else if (version >= 64) {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options_convertColorSpace(
            pasteboard, document.sketchObject.colorSpace(), nil, true
        );
    } else if (version >= 48) {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_colorSpace_options(
            pasteboard, document.sketchObject.colorSpace(), nil
        );
    } else {
        pasteboardLayers = pasteboardManager.readPasteboardLayersFromPasteboard_options(pasteboard, nil);
    }
    return pasteboardLayers;
}

module.exports.getLayers = function() {
    return this.getPasteboardLayers().layers().layers();
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

module.exports.isEmpty = function() {
    return pasteboard.pasteboardItems().count() == 0;
}

module.exports.isSupportedType = function() {
    var pasteboardType = pasteboard.pasteboardItems().firstObject().types().firstObject();
    var supportedPasteboardTypes = [
        "public.jpeg",
        "public.gif",
        "public.png",
        "public.tiff", // Photoshop
        "com.adobe.pdf",
        "com.adobe.illustrator.aicb", // Illustrator
        "com.bohemiancoding.sketch.v3", // Sketch
        "com.seriflabs.persona.nodes" // Affinity Designer
    ];
    return supportedPasteboardTypes.indexOf(String(pasteboardType));
}
