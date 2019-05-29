var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var doc = context.document;
    var documentData = doc.documentData();

    if (documentData.allArtboards().count() == 0) {
        doc.showMessage("No artboards in current document.");
        return;
    }

    var types = ["Artboard", "Symbol Master", "Artboard & Symbol Master"];
    var scales = [1, 0.5, 1.5, 2, 2.5, 3, 4];
    var formats = ["png", "jpg", "tif", "webp", "pdf", "eps", "svg"];
    var scaleStrings = scales.map(function(scale) {
        return scale + "x";
    });

    // Dialog
    var dialog = new Dialog(
        "Export All Artboards",
        "Export all artboards, symbol masters or both."
    );

    var labelView1 = ui.textLabel("Export:");
    dialog.addView(labelView1);

    var selectBoxTypes = ui.popupButton(types, 200);
    dialog.addView(selectBoxTypes);

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));

    var labelView2 = ui.textLabel("Format:", [0, 25, 100, 25]);
    view.addSubview(labelView2);

    var selectBoxFormats = ui.popupButton(formats, [0, 0, 100, 25]);
    view.addSubview(selectBoxFormats);

    var labelView3 = ui.textLabel("Scale:", [110, 25, 100, 25]);
    view.addSubview(labelView3);

    var selectBoxScales = ui.popupButton(scaleStrings, [110, 0, 100, 25]);
    view.addSubview(selectBoxScales);

    dialog.addView(view);

    var checkboxBackground = ui.checkBox(false, "Include background color of artboard.")
    dialog.addView(checkboxBackground);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var savePath = system.chooseFolder();
        if (savePath) {

            var scale = scales[selectBoxScales.indexOfSelectedItem()];
            var format = selectBoxFormats.titleOfSelectedItem();

            var exportLayers = documentData.allArtboards();
            var typeIndex = selectBoxTypes.indexOfSelectedItem();
            if (typeIndex == 0) {
                exportLayers = exportLayers.mutableCopy();
                exportLayers.removeObjectsInArray(documentData.localSymbols());
            }
            if (typeIndex == 1) {
                exportLayers = documentData.localSymbols();
            }

            var loopExportLayers = exportLayers.objectEnumerator();
            var layer;
            while (layer = loopExportLayers.nextObject()) {

                var exportFormat = MSExportFormat.alloc().init();
                var exportRequest = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(
                    exportFormat, layer, layer.frame().rect(), false
                );
                exportRequest.setShouldTrim(false);
                exportRequest.setFormat(format);
                exportRequest.setScale(scale);

                if (checkboxBackground.state() == 1) {
                    exportRequest.setIncludeArtboardBackground(true);
                }

                var layerName = layer.name()
                    .replace(/\s*\/\s*/g, "\/")
                    .replace(/^(\/)/, "")
                    .replace(/\/$/, "")
                    .replace(/\/\./g, "\/")
                    .replace(/(\/){2,}/g, "\/")
                    .trim();

                doc.saveExportRequest_toFile(
                    exportRequest,
                    savePath + "/" + layerName + "." + format
                );

            }

            system.showInFinder(savePath);

        }
    }

};
