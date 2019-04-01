var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga(context, "Slice");

    var ui = require("../modules/UI");
    var preferences = require("../modules/Preferences");
    var system = require("../modules/System");
    var identifier = context.command.identifier();
    var util = require("util");
    var sketch = require("sketch");

    var exportPresets = MSExportPreset.allExportPresets();
    if (exportPresets.count() == 0) {
        sketch.UI.message('No preset, go to "Preferences" - "Presets" to restore defaults or add a preset.');
        return;
    }

    var preset1Index = preferences.get(context, "quickExportPreset1") || 1;
    var preset2Index = preferences.get(context, "quickExportPreset2") || 2;
    var isShowInFinder = preferences.get(context, "quickExportShowInFinder") || true;

    // Setting
    if (identifier == "quick_export_setting") {

        if (exportPresets.count() == 1) {
            sketch.UI.message('Go to "Preferences" - "Presets" to add more preset.');
            return;
        }

        var dialog = ui.cosDialog(
            "Quick Export Setting",
            'You can go to "Preferences" - "Presets" to add more export preset.'
        );

        var exportPresetTitles = util.toArray(exportPresets).slice(1).map(function(item) {
            return item.name();
        });

        var presetLabel1 = ui.textLabel("Preset 1");
        dialog.addAccessoryView(presetLabel1);
        var preset1 = ui.popupButton(exportPresetTitles, 300);
        dialog.addAccessoryView(preset1);

        var presetLabel2 = ui.textLabel("Preset 2");
        dialog.addAccessoryView(presetLabel2);
        var preset2 = ui.popupButton(exportPresetTitles, 300);
        dialog.addAccessoryView(preset2);

        var showInFinder = ui.checkBox(isShowInFinder, "Show in Finder after export.");
        dialog.addAccessoryView(showInFinder);

        if (preset1Index < exportPresets.count()) {
            preset1.selectItemAtIndex(preset1Index - 1);
        }
        if (preset2Index < exportPresets.count()) {
            preset2.selectItemAtIndex(preset2Index - 1);
        }

        var responseCode = dialog.runModal();
        if (responseCode == 1000) {
            preferences.set(context, "quickExportPreset1", preset1.indexOfSelectedItem() + 1);
            preferences.set(context, "quickExportPreset2", preset2.indexOfSelectedItem() + 1);
            preferences.set(context, "quickExportShowInFinder", showInFinder.state() == NSOnState ? true : false);
        }

        return;
    }

    // Export
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers;

    var presetIndex;
    if (identifier == "quick_export_default") {
        presetIndex = 0;
    } else if (identifier == "quick_export_1") {
        presetIndex = preset1Index;
    } else if (identifier == "quick_export_2") {
        presetIndex = preset2Index;
    }

    var preset;
    if (presetIndex < exportPresets.count()) {
        preset = exportPresets.objectAtIndex(presetIndex);
    } else {
        sketch.UI.message('No preset, run "Quick Export Preset Setting" to config.');
        return;
    }

    if (selection.length == 0) {
        sketch.UI.message("Please select at least 1 layer.");
        return;
    }

    var destFolder = system.chooseFolder();
    if (destFolder == null) {
        return;
    }

    selection.layers.forEach(function(layer) {
        exportLayer(document.sketchObject, layer.sketchObject, destFolder, preset);
    });

    if (isShowInFinder) {
        system.showInFinder(destFolder);
    }

    sketch.UI.message('Export layer use "' + preset.name() + '" preset.');

};

function exportLayer(document, layer, destFolder, preset) {
    var exportRequests = MSExportRequest.exportRequestsFromLayerAncestry_exportFormats_inRect(
        layer.ancestry(),
        preset.exportFormats(),
        layer.absoluteInfluenceRect()
    );
    exportRequests.forEach(function(exportRequest) {
        var filePath = destFolder + "/" + exportRequest.name() + "." + exportRequest.format();
        document.saveExportRequest_toFile(exportRequest, filePath);
    });
}