var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var system = require("../modules/System");
    var document = context.document;
    var pluginIdentifier = context.command.identifier();
    var documentData = document.documentData();

    // Choose the sketch file.
    var chooseFile = system.chooseFile(["sketch"]);

    if (!chooseFile) {
        return;
    }

    // Read data from the new sketch file.
    var fileURL = NSURL.fileURLWithPath(chooseFile);
    var error = MOPointer.alloc().init();
    var newDocument = MSDocument.alloc().init();
        newDocument.readFromURL_ofType_error(fileURL, "com.bohemiancoding.sketch.drawing", error);

    if (error.value() != null) {
        document.showMessage("Error: " + error.value());
        return;
    }

    var newDocumentData = newDocument.documentData();
    var styles;
    var newStyles;
    var name;
    var count = 0;
    if (pluginIdentifier == "import_text_styles_from_sketch_file") {
        styles = documentData.layerTextStyles();
        newStyles = newDocumentData.layerTextStyles();
        name = "text styles";
    }
    if (pluginIdentifier == "import_layer_styles_from_sketch_file") {
        styles = documentData.layerStyles();
        newStyles = newDocumentData.layerStyles();
        name = "layer styles";
    }

    if (newStyles.numberOfSharedStyles() == 0) {
        document.showMessage(`No ${name} in this file.`);
        return;
    }

    var loopStyles = newStyles.sharedStyles().objectEnumerator();
    var style;
    while (style = loopStyles.nextObject()) {
        if (styles.sharedStyleWithID(style.objectID())) {
            styles.removeSharedStyle(styles.sharedStyleWithID(style.objectID()));
        }
        var newStyle = MSSharedStyle.alloc().initWithName_sharedObjectID_value(
            style.name(), style.objectID(), style.value()
        );
        styles.addSharedObject(newStyle);
        count ++;
    }

    document.reloadInspector();

    if (count == 1) {
        document.showMessage(`Import 1 ${name}.`);
    } else {
        document.showMessage(`Import ${count} ${name}s.`);
    }



};
