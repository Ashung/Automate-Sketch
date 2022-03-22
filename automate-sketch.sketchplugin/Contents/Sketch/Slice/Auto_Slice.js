@import "Fast_Slice.js";

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var version = sketch.version.sketch;

    var document = context.document;
    var selection = context.selection;
    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }

    // All Export Presets
    var exportPresets = MSExportPreset.allExportPresets();

    // Preferences
    var defaultUserInput = preferences.get("sliceSize") || "0";
    var defaultExportPresetIndex = preferences.get("sliceExportPresetIndex") || 0;
    var sliceNameFormat = preferences.get("sliceNameFormat") || 0;
    var renameSliceLayer = preferences.get("renameSliceLayer") || false;

    // Dialog
    var dialog = new Dialog(
        "Auto Slice",
        "Input the size like 24, 24x24 or 0, use 0 means to fit the layer size."
    );

    var view = ui.view([300, 24]);

    var textField = ui.textField(defaultUserInput, [0, 0, 170, 24]);
    view.addSubview(textField);

    var exportPresetTitles = exportPresets.slice().map(function(item) {
        return item.name();
    });
    var selectBox = ui.popupButton(exportPresetTitles, [180, 0, 120, 24]);
    selectBox.selectItemAtIndex(defaultExportPresetIndex);
    view.addSubview(selectBox);

    dialog.addView(view);
    dialog.focus(textField);

    var renameSliceCheckbox = ui.checkBox(renameSliceLayer, "Rename slice layer to url-friendly format.")
    dialog.addView(renameSliceCheckbox);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var userInputString = textField.stringValue();
        preferences.set("sliceSize", userInputString);

        var exportPresetIndex = selectBox.indexOfSelectedItem();
        preferences.set("sliceExportPresetIndex", exportPresetIndex);

        var renameSliceBoolean = renameSliceCheckbox.state() == NSOnState ? true : false;
        preferences.set("renameSliceLayer", renameSliceBoolean);

        // Add Slice
        var allSlices = [];
        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {

            var sliceWith = 0,
                sliceHeight = 0;

            if (/^\d+$/.test(userInputString)) {
                if (parseInt(userInputString) > 0) {
                    sliceWith = parseInt(userInputString) * 2 + Math.ceil(layer.frame().width());
                    sliceHeight = parseInt(userInputString) * 2 + Math.ceil(layer.frame().height());
                }
            } else if (/^\d+x\d+$/.test(userInputString)) {
                sliceWith = parseInt(userInputString.match(/\d+/g)[0]);
                sliceHeight = parseInt(userInputString.match(/\d+/g)[1]);
            } else {
                document.showMessage("Bad format.");
                return;
            }

            var slice = MSSliceLayer.sliceLayerFromLayer(layer);
            slice.makeOriginIntegral();
            allSlices.push(slice);

            if (sliceWith > 0) {
                slice.frame().setWidth(sliceWith);
                slice.frame().setX(layer.frame().x() + layer.frame().width() / 2 - sliceWith / 2);
            }
            if (sliceHeight > 0) {
                slice.frame().setHeight(sliceHeight);
                slice.frame().setY(layer.frame().y() + layer.frame().height() / 2 - sliceHeight / 2);
            }

            slice.frame().setX(Math.round(slice.frame().x()));
            slice.frame().setY(Math.round(slice.frame().y()));

            // layer order
            if (
                preferences.get("sliceLayerOrder") == null ||
                preferences.get("sliceLayerOrder") == "0" ||
                preferences.get("sliceLayerOrder") == "1"
            ) {
                if (
                    layer.class() == "MSLayerGroup" ||
                    layer.class() == "MSArtboardGroup" ||
                    layer.class() == "MSSymbolMaster"
                ) {
                    if (layer.class() == "MSLayerGroup") {
                        slice.exportOptions().setLayerOptions(2);
                    }
                    if (preferences.get("sliceLayerOrder") == "1") {
                        slice.moveToLayer_beforeLayer(layer, nil);
                    } else {
                        slice.moveToLayer_beforeLayer(layer, layer.firstLayer());
                    }
                } else {
                    if (preferences.get("sliceLayerOrder") == "0") {
                        var newGroup;
                        if (version >= 84) {
                            newGroup = MSLayerGroup.groupWithLayers([slice, layer]);
                        } else if (version >= 83) {
                            var layerArray = MSLayerArray.arrayWithLayers([slice, layer]);
                            newGroup = MSLayerGroup.groupWithLayers(layerArray.layers());
                        } else {
                            var layerArray = MSLayerArray.arrayWithLayers([slice, layer]);
                            newGroup = MSLayerGroup.groupWithLayers(layerArray);
                        }
                        newGroup.setName(layer.name());
                        slice.exportOptions().setLayerOptions(2);
                    } else if (preferences.get("sliceLayerOrder") == "1") {
                        var newGroup;
                        if (version >= 84) {
                            newGroup = MSLayerGroup.groupWithLayers([layer, slice]);
                        } else if (version >= 83) {
                            var layerArray = MSLayerArray.arrayWithLayers([layer, slice]);
                            newGroup = MSLayerGroup.groupWithLayers(layerArray.layers());
                        } else {
                            var layerArray = MSLayerArray.arrayWithLayers([layer, slice]);
                            newGroup = MSLayerGroup.groupWithLayers(layerArray);
                        }
                        newGroup.setName(layer.name());
                        slice.exportOptions().setLayerOptions(2);
                    } else {
                        slice.moveToLayer_beforeLayer(layer.parentGroup(), layer);
                    }
                }
            }

            // Slice layer name
            if (renameSliceCheckbox.state() == NSOnState) {
                var layerName = layer.name();
                // group/base_name
                if (sliceNameFormat == 0) {
                    layerName = formatLayerName(layerName, "_", "/", { removeStartDigits: true });
                }
                // group/base-name
                if (sliceNameFormat == 1) {
                    layerName = formatLayerName(layerName, "-", "/", { removeStartDigits: true });
                }
                // group_base_name
                if (sliceNameFormat == 2) {
                    layerName = formatLayerName(layerName, "_", "_").replace(/^\d+_*/, "");
                }
                // group-base-name
                if (sliceNameFormat == 3) {
                    layerName = formatLayerName(layerName, "-", "-").replace(/^\d+-*/, "");
                }
                // base_name
                if (sliceNameFormat == 4) {
                    layerName = cropLayerName(layerName, "_").replace(/^\d+_*/, "");
                }
                // base-name
                if (sliceNameFormat == 5) {
                    layerName = cropLayerName(layerName, "-").replace(/^\d+-*/, "");
                }
                slice.setName(layerName);
            }

            if (slice.parentGroup().class() == "MSLayerGroup") {
                slice.exportOptions().setLayerOptions(2);
            }

            slice.exportOptions().setExportFormats(exportPresets.objectAtIndex(exportPresetIndex).exportFormats());
        }

        document.currentPage().changeSelectionBySelectingLayers(allSlices);

        document.reloadInspector();

    }

};
