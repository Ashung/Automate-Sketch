var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var system = require("../modules/System");
    var document = context.document;

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

    if (sketch.version.sketch >= 53) {
        var assetCollection = document.documentData().assets();
        var newAssetCollection = newDocument.documentData().assets();

        var countColor = 0;
        var countGradient = 0;
        var countImage = 0;

        if (sketch.version.sketch >= 69) {
            var swatches = newDocument.documentData().sharedSwatches().objectsSortedByName();
            document.documentData().sharedSwatches().addSharedObjects(swatches);
            countColor = swatches.count();
        } else {
            newAssetCollection.colorAssets().forEach(function(item) {
                if(!assetCollection.colorAssets().containsObject(item)) {
                    assetCollection.addColorAsset(item);
                    countColor ++;
                }
            });
        }

        newAssetCollection.gradientAssets().forEach(function(item) {
            if(!assetCollection.gradientAssets().containsObject(item)) {
                assetCollection.addGradientAsset(item);
                countGradient ++;
            }
        });

        newAssetCollection.images().forEach(function(item) {
            if(!assetCollection.images().containsObject(item)) {
                assetCollection.images().addObject(item);
                countImage ++;
            }
        });

        document.reloadInspector();

        document.showMessage(
            "Imported " + countColor + " colors, " +
            countGradient + " gradients," +
            countImage + " images."
        );

    } else {

        var assets = document.documentData().assets();
        var colors = assets.colors();  //arrayForType(0);
        var gradients = assets.gradients(); //arrayForType(1);
        var patterns = assets.images(); //arrayForType(2);

        var newAssets = newDocument.documentData().assets();
        var newColors = newAssets.colors(); //arrayForType(0);
        var newGradients = newAssets.gradients(); //arrayForType(1);
        var newPatterns = newAssets.images(); //arrayForType(2);

        for (var i = 0; i < newColors.count(); i++) {
            var newColor = newColors.objectAtIndex(i);
            if (!colors.containsObject(newColor)) {
                colors.addObject(newColor);
            }
        }

        for (var i = 0; i < newGradients.count(); i++) {
            var newGradient = newGradients.objectAtIndex(i);
            var containsObject = false;
            for (var j = 0; j < gradients.count(); j++) {
                if (newGradient.isAssetEqual(gradients.objectAtIndex(j))) {
                    containsObject = true;
                    break;
                }
            }
            if (!containsObject) {
                gradients.addObject(newGradient);
            }
        }

        for (var i = 0; i < newPatterns.count(); i++) {
            var newPattern = newPatterns.objectAtIndex(i);
            if (!patterns.containsObject(newPattern)) {
                assets.addAsset(newPattern);
            }
        }

        document.reloadInspector();

        document.showMessage(
            "Imported " + newColors.count() + " colors, " +
            newGradients.count() + " gradients, " +
            newPatterns.count() + " patterns."
        );

    }

};
