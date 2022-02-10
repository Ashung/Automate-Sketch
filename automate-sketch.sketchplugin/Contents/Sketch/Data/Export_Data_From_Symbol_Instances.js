var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var System = require("../modules/System");
    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    var symbolInstances = selection.filteredArrayUsingPredicate(predicate);
    if (symbolInstances.count() == 0) {
        document.showMessage("Please select at least 1 symbol instance layer.");
    }

    // get data
    var overrideData = {};
    var loopSymbolInstances = symbolInstances.objectEnumerator();
    var instance;
    while (instance = loopSymbolInstances.nextObject()) {
        var loopOverrideValues = instance.overrideValues().objectEnumerator();
        var overrideValue;
        while (overrideValue = loopOverrideValues.nextObject()) {
            if (overrideValue.attributeName() == "image" || overrideValue.attributeName() == "stringValue") {
                var layerID = getLayerIDFromOverrideName(instance, overrideValue.overrideName());
                if (Object.keys(overrideData).indexOf(String(layerID)) == -1) {
                    overrideData[layerID] = {
                        "type": String(overrideValue.attributeName()),
                        "data": []
                    };
                }
                overrideData[layerID]["data"].push(overrideValue.value());
            }
        }
    }

    if (Object.keys(overrideData).length == 0) {
        document.showMessage("No overrides available in selection.");
        return;
    }

    // Export
    var exportFolder = System.chooseFolder();
    if (exportFolder) {
        for (item in overrideData) {
            if (overrideData[item]["type"] == "stringValue") {
                var content = overrideData[item]["data"].join("\n");
                var filePath = exportFolder + "/" + item + ".txt";
                System.writeStringToFile(content, filePath);
            }
            if (overrideData[item]["type"] == "image") {
                var folderPath = exportFolder + "/" + item;
                System.mkdir(folderPath);
                overrideData[item]["data"].forEach(function(image) {
                    var sha1 = image.sha1().hexString();
                    var imagePath = folderPath + "/" + sha1 + ".png";
                    image.data().writeToFile_atomically(imagePath, "YES");
                });
            }
        }
        System.showInFinder(exportFolder);
    }

};

function getLayerIDFromOverrideName(instance, overrideName) {
    var loopOverridePoints = instance.overridePoints().objectEnumerator();
    var overridePoint;
    while (overridePoint = loopOverridePoints.nextObject()) {
        if (overridePoint.name().isEqualToString(overrideName)) {
            return overridePoint.layerID();
        }
    }
}