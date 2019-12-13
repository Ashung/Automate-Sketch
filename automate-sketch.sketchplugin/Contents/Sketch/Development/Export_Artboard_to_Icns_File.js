var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var system = require("../modules/System");
    var runCommand = require("../modules/Run_Command");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    if (selectedLayers.length != 1) {
        sketch.UI.message("Please select 1 artboard or symbols master.");
        return;
    }

    if (selectedLayers[0].type != "Artboard" && selectedLayers[0].type != "SymbolMaster") {
        sketch.UI.message("Please select 1 artboard or symbols master.");
        return;
    }

    if (selectedLayers[0].frame.width != 512 && selectedLayers[0].frame.height != 512) {
        sketch.UI.message("Artboard size must 512x512px.");
        return;
    }

    var destFolder = system.chooseFolder();

    var artboard = selectedLayers[0].sketchObject;
    var options = [
        { size: 16, name: "16x16" },
        { size: 32, name: "16x16@2x" },
        { size: 32, name: "32x32" },
        { size: 64, name: "32x32@2x" },
        { size: 128, name: "128x128" },
        { size: 256, name: "128x128@2x" },
        { size: 256, name: "256x256" },
        { size: 512, name: "256x256@2x" },
        { size: 512, name: "512x512" },
        { size: 1024, name: "512x512@2x" }
    ];
    options.forEach(function(option) {
        var exportFormat = MSExportFormat.alloc().initWithScale_name_fileFormat(option.size / 512, "", "png");
        var exportRequest = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(exportFormat, artboard, artboard.frame().rect(), false);
        var filePath = destFolder + "/icon.iconset/icon_" + option.name + ".png";
        document.sketchObject.saveExportRequest_toFile(exportRequest, filePath);
    });
    
    runCommand(
        "/bin/bash",
        ["-l", "-c", '/usr/bin/iconutil -c icns "' + destFolder + '/icon.iconset"']
    );

};


