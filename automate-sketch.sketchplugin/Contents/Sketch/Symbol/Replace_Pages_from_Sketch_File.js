var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var system = require("../modules/System");
    var document = context.document;

    // Choose the new sketch file.
    var chooseFile = system.chooseFile(["sketch"]);
    if (!chooseFile) {
        return;
    }

    var count = 0;

    // Read data from the new sketch file.
    var fileURL = NSURL.fileURLWithPath(chooseFile);
    var error = MOPointer.alloc().init();
    var newDocument = MSDocument.alloc().init();
        newDocument.readFromURL_ofType_error(fileURL, "com.bohemiancoding.sketch.drawing", error);

    if (error.value() != null) {
        document.showMessage("Error: " + error.value());
        return;
    }

    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {

        var loopPagesFromNewDocument = newDocument.pages().objectEnumerator();
        var pageFromNewDocument;
        while (pageFromNewDocument = loopPagesFromNewDocument.nextObject()) {

            if (page.name().isEqualToString(pageFromNewDocument.name())) {
                page.removeAllLayers();
                page.addLayers(pageFromNewDocument.layers());

                count++;
            }

        }
    }

    // document.loadLayerListPanel();
    document.showMessage("Replace " + ((count > 1) ? (count + " pages.") : (count + " page.")));

};
