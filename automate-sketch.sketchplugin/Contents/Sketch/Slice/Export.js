var sketch = require("sketch");
var document = sketch.getSelectedDocument();
var version = sketch.version.sketch;

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var preferences = require("../modules/Preferences");
    var system = require("../modules/System");
    var identifier = __command.identifier();

    var supportFormats = ["png", "jpg", "tiff", "eps", "pdf", "webp", "svg"];

    if (identifier == "export") {
        var format = supportFormats[preferences.get("exportFormat") || 0];
        var quality = preferences.get("exportJpgQuality") || 100;
        var defaultScale = preferences.get("exportScale") || 1;
        if (document.selectedLayers.length == 1) {
            var layer = document.selectedLayers.layers[0];
            var path = system.savePanel(layer.name);
            var scale = getScale(defaultScale, layer);
            if (path) {
                var output = path + (path.endsWith(`.${format}`) ? '' : `.${format}`);
                exportLayer(layer, {
                    output,
                    format,
                    scale,
                    compression: quality / 100
                });
            }
        } else {
            var path = system.chooseFolder();
            if (path) {
                document.selectedLayers.forEach(function(layer) {
                    var scale = getScale(defaultScale, layer);
                    var output = path + "/" + layer.name.split("/").map(name => name.trim()).join("/") + "." + format;
                    exportLayer(layer, {
                        output,
                        format,
                        scale,
                        compression: quality / 100
                    });
                });
            }
        }
    }

    if (identifier == "export_setting") {
        var Dialog = require("../modules/Dialog").dialog;
        var ui = require("../modules/Dialog").ui;
        
        var dialog = new Dialog("Export Setting");
        
        dialog.addLabel("Format");
        var formatView = ui.popupButton(supportFormats.map(function(item) {
            return item.toUpperCase();
        }));
        formatView.selectItemAtIndex(preferences.get("exportFormat") || 0);
        dialog.addView(formatView);

        dialog.addLabel("Scale, Valid values include 2, 2x, 100w, 100h");
        var scaleView = ui.textField(preferences.get("exportScale") || "1");
        dialog.addView(scaleView);

        dialog.addLabel("JPG Quality");
        var sliderView = ui.slider(100, 0, 100);
        dialog.addView(sliderView.view);
        if (preferences.get("exportJpgQuality")) {
            var initValue = parseInt(preferences.get("exportJpgQuality"), 10)
            sliderView.slider.setIntValue(initValue);
            sliderView.text.setStringValue(initValue);
        }

        var responseCode = dialog.run();
        if (responseCode == 1000) {
            preferences.set("exportFormat", formatView.indexOfSelectedItem());
            preferences.set("exportScale", scaleView.stringValue())
            preferences.set("exportJpgQuality", sliderView.slider.intValue());
        }
    }

};

function getScale(defaultScale, layer) {
    var scale = 1;
    if (defaultScale.endsWith("x")) {
        scale = parseInt(defaultScale, 10);
    } else if (defaultScale.endsWith("w")) {
        scale = parseInt(defaultScale, 10) / layer.frame.width;
    } else if (defaultScale.endsWith("h")) {
        scale = parseInt(defaultScale, 10) / layer.frame.height;
    } else {
        scale = parseInt(defaultScale, 10) || 1;
    }
    scale = scale || 1;
    return scale;
}

function exportLayer(layer, option) {
    const ancestry = layer.sketchObject.ancestry();
    const exportRequest = MSExportRequest.exportRequestsFromLayerAncestry(ancestry).firstObject();
    exportRequest.setFormat(option.format);
    exportRequest.setScale(option.scale);
    exportRequest.setCompression(option.compression);
    exportRequest.setShouldTrim(false);
    var colorSpace;
    if (version >= 86) {
        colorSpace = document.sketchObject.colorSpace().CGColorSpace();
    } else {
        colorSpace = document.sketchObject.colorSpace();
    }
    var exporter = MSExporter.exporterForRequest_colorSpace(exportRequest, colorSpace);
    exporter.exportToFileURL(NSURL.fileURLWithPath(option.output));
}