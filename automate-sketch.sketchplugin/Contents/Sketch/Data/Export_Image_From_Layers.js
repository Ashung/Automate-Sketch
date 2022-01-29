var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var System = require("../modules/System");
    var document = context.document;
    var selection = context.selection;

    var images = NSMutableArray.alloc().init();
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {
        if (layer.class() == "MSBitmapLayer") {
            var image = layer.image()
            if (!images.containsObject(image)) {
                images.addObject(image);
            }
        }
        if (layer.style().fills().count() > 0) {
            var loopFills = layer.style().fills().objectEnumerator();
            var fill;
            while (fill = loopFills.nextObject()) {
                var image = fill.image();
                if (image && !images.containsObject(image)) {
                    images.addObject(image);
                }
            }
        }
    }

    if (images.count() == 0) {
        document.showMessage("No image-fill or bitmap layers in selection.");
        return;
    }
    
    // Export data
    var exportFolder = System.chooseFolder();
    if (exportFolder) {
        var loopImages = images.objectEnumerator();
        var image;
        while (image = loopImages.nextObject()) {
            var sha1 = image.sha1().hexString();
            var imagePath = exportFolder + "/" + sha1 + ".png";
            image.data().writeToFile_atomically(imagePath, "YES");
        }
        System.showInFinder(exportFolder);
    }

};