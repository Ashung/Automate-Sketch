var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Export");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    
    if (document.selectedLayers.length == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var preferences = require("../modules/Preferences");
    var util = require("util");
    var version = sketch.version.sketch;
    
    var dialog = new Dialog("Export Selected Layers", "Export selected layers and rename with number.");

    dialog.addLabel("Reorder layers");
    var reorderView = ui.popupButton([
        "Order by position X",
        "Order by position y",
        "Order by name",
        "Order by layer list"
    ]);
    reorderView.selectItemAtIndex(preferences.get("exportSelectedLayersOrder") || 0);
    dialog.addView(reorderView);

    dialog.addLabel("Layer name");
    var nameView = ui.textField(preferences.get("exportSelectedLayersName") || "layer_");
    dialog.addView(nameView);

    dialog.addLabel("Format");
    var supportFormats = ["png", "jpg", "tiff", "webp", "pdf", "eps", "svg"];
    var formatView = ui.popupButton(supportFormats.map(function(item) {
        return item.toUpperCase();
    }));
    formatView.selectItemAtIndex(preferences.get("exportSelectedLayersFormat") || 0);
    dialog.addView(formatView);

    dialog.addLabel("Size, 0.5x, 1x, 2x, 500w, 200h");
    var sizeView = ui.textField(preferences.get("exportSelectedLayersSize") || "1x");
    dialog.addView(sizeView);

    dialog.addLabel("Quality, for JPG & WebP");
    var sliderView = ui.slider(100, 0, 90);
    dialog.addView(sliderView.view);
    if (preferences.get("exportSelectedLayersQuality")) {
        var initValue = parseInt(preferences.get("exportSelectedLayersQuality"), 10);
        sliderView.slider.setIntValue(initValue);
        sliderView.text.setStringValue(initValue);
    }

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        
        preferences.set("exportSelectedLayersOrder", reorderView.indexOfSelectedItem());
        preferences.set("exportSelectedLayersName", nameView.stringValue());
        preferences.set("exportSelectedLayersFormat", formatView.indexOfSelectedItem());
        preferences.set("exportSelectedLayersSize", sizeView.stringValue())
        preferences.set("exportSelectedLayersQuality", sliderView.slider.intValue());

        var folder = system.chooseFolder();
        if (!folder) {
            return;
        }

        var layers = [];
        
        // position X
        if (reorderView.indexOfSelectedItem() == 0) {
            layers = document.selectedLayers.layers.sort(function(a, b) {
                return a.frame.x >= b.frame.x;
            });
        }
        // position Y
        else if (reorderView.indexOfSelectedItem() == 1) {
            layers = document.selectedLayers.layers.sort(function(a, b) {
                return a.frame.y >= b.frame.y;
            });
        }
        // name
        else if (reorderView.indexOfSelectedItem() == 2) {
            var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
                "name", true, "localizedStandardCompare:"
            );
            sortedLayers = context.selection.mutableCopy().sortedArrayUsingDescriptors([sortDescriptor]);
            layers = util.toArray(sortedLayers).map(layer => sketch.fromNative(layer))
        }

        // console.log(layers.map(x => x.name));

        var format = String(formatView.titleOfSelectedItem()).toLowerCase();
        var size = String(sizeView.stringValue());
        var prefix = String(nameView.stringValue());
        var quality = sliderView.slider.intValue();

        layers.forEach(function(layer, index) {
            var scale = 1;
            if (size.endsWith("x") || size.endsWith("X")) {
                scale = parseInt(size, 10);
            } else if (size.endsWith("w") || size.endsWith("W")) {
                scale = parseInt(size, 10) / layer.frame.width;
            } else if (size.endsWith("h") || size.endsWith("H")) {
                scale = parseInt(size, 10) / layer.frame.height;
            }

            var ancestry = layer.sketchObject.ancestry();
            var exportRequest = MSExportRequest.exportRequestsFromLayerAncestry(ancestry).firstObject();
            exportRequest.setFormat(format);
            exportRequest.setScale(scale);
            exportRequest.setShouldTrim(false);
            exportRequest.setSaveForWeb(true);
            exportRequest.setInterlaced(false);
            exportRequest.setProgressive(false);
            exportRequest.setCompression(quality / 100);
            var colorSpace;
            if (version >= 86) {
                colorSpace = document.sketchObject.colorSpace().CGColorSpace();
            } else {
                colorSpace = document.sketchObject.colorSpace();
            }
            var path = folder + "/" + prefix + (index + 1) + '.' + format;            
            var exporter = MSExporter.exporterForRequest_colorSpace(exportRequest, colorSpace);
            exporter.exportToFileURL(NSURL.fileURLWithPath(path));
        });
        
    }
}