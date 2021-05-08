var sketch = require("sketch");

var saveExportPresetsToFile = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var util = require("util");
    var system = require("../modules/System");

    var exportPresets = MSExportPreset.allExportPresets();
    if (exportPresets.count() == 0) {
        sketch.UI.message("No export presets.");
        return;
    };

    var exportPresetsJSON = [];
    util.toArray(exportPresets).forEach(function(exportPreset) {

        var formats = [];
        var loopExportFormats = exportPreset.exportFormats().objectEnumerator();
        var exportFormat;
        while (exportFormat = loopExportFormats.nextObject()) {
            var format = {
                "absoluteSize": parseFloat(exportFormat.absoluteSize()),
                "fileFormat": String(exportFormat.fileFormat()),
                "name": String(exportFormat.name()),
                "namingScheme": parseInt(exportFormat.namingScheme()),
                "scale": parseFloat(exportFormat.scale()),
                "visibleScaleType": parseInt(exportFormat.visibleScaleType())
            };
            formats.push(format);
        }

        var item = {
            "name": String(exportPreset.name()),
            "shouldApplyAutomatically": Boolean(exportPreset.shouldApplyAutomatically()),
            "exportFormats": formats
        };

        exportPresetsJSON.push(item);

    });

    var filePath = system.savePanel("sketch_export_presets.json");
    if (!filePath) return;

    var writeToFile = system.writeStringToFile(JSON.stringify(exportPresetsJSON, null, 4), filePath);
    if (writeToFile != null) {
        sketch.UI.message("Error: " + writeToFile);
        return;
    }

    sketch.UI.message("Export presets saved to " + filePath);

    system.showInFinder(filePath);
};

var loadExportPresetsFromFile = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var util = require("util");
    var path = require("path");
    var system = require("../modules/System");

    var exportPresets = MSExportPreset.allExportPresets();
    // Restore defaults export presets
    if (exportPresets.count() == 0) {
        exportPresets.addObjectsFromArray(MSPersistentAssetCollection.defaultExportPresets());
    }

    var filePath = system.chooseFile(["json", "sketchpreset"]);
    if (!filePath) return;

    var fileType;
    var content = system.readStringFromFile(filePath);
    var ext = path.extname(filePath);
    if (ext == ".json") {
        fileType = "json"
    }
    if (ext == ".sketchpreset") {
        try {
            if (JSON.parse(content)) {
                fileType = "json";
            }
        } catch (err) {
            fileType = "zip";
        }
    }

    if (fileType == "json") {
        var exportPresetsJSON = JSON.parse(content);
        if (exportPresetsJSON instanceof Array) {
            exportPresets.removeAllObjects();
            exportPresetsJSON.forEach(function(item) {
                var exportPreset = exportPresetFromJsObject(item);
                exportPresets.addObject(exportPreset);
            });
        } else {
            if (exportPresetsJSON.root.exportPresets instanceof Array) {
                exportPresets.removeAllObjects();
                exportPresetsJSON.root.exportPresets.forEach(function(item) {
                    var exportPreset = exportPresetFromJsObject(item);
                    exportPresets.addObject(exportPreset);
                });
            }
        }
    }

    if (fileType == "zip") {
        if (sketch.version.sketch >= 54) {
            var Buffer = require("buffer").Buffer;
            var fileBuffer = Buffer.from(NSData.dataWithContentsOfFile(filePath));
            if (!fileBuffer || fileBuffer.length < 4) {
                sketch.UI.message("No supported file format.");
                return false;
            }
            if (fileBuffer[0] == 0x50 && fileBuffer[1] == 0x4B && fileBuffer[2] == 0x03 && fileBuffer[3] == 0x04) {
                let nativeAssets = MSPersistentAssetCollection.assetCollectionWithURL(NSURL.fileURLWithPath(filePath));
                exportPresets.removeAllObjects();
                util.toArray(nativeAssets.exportPresets()).forEach(function(item) {
                    exportPresets.addObject(item);
                });
            } else {
                sketch.UI.message("No supported file format.");
                return false;
            }
        } else {
            sketch.UI.message("No supported file format.");
            return;
        }
    }

    // Refresh data
    var panelController = MSPreferencesController.sharedController();
    panelController.switchToPaneWithIdentifier(MSExportPresetsPreferencePane.identifier());
    panelController.currentPreferencePane().tableView().reloadData();
    panelController.window().close();

    sketch.UI.message("Export presets loaded.");

};

function exportPresetFromJsObject(jsObject) {
    var exportFormats = NSMutableArray.alloc().init();
    jsObject.exportFormats.forEach(function(format) {
        var exportFormat = MSExportFormat.alloc().init();
        exportFormat.setAbsoluteSize(format["absoluteSize"]);
        exportFormat.setFileFormat(format["fileFormat"]);
        exportFormat.setName(format["name"]);
        exportFormat.setNamingScheme(format["namingScheme"]);
        exportFormat.setScale(format["scale"]);
        exportFormat.setVisibleScaleType(format["visibleScaleType"]);
        exportFormats.addObject(exportFormat);
    });
    var exportPreset = MSExportPreset.alloc().initWithName_formats(jsObject["name"], exportFormats);
    exportPreset.setShouldApplyAutomatically(jsObject["shouldApplyAutomatically"]);
    return exportPreset;
}
