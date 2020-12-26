var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");
    var system = require("../modules/System");
    var identifier = __command.identifier();
    var util = require("util");
    var sketch = require("sketch");

    var exportPresets = MSExportPreset.allExportPresets();
    if (exportPresets.count() == 0) {
        sketch.UI.message('No preset, go to "Preferences" - "Presets" to restore defaults or add a preset.');
        return;
    }

    var presetDefaultIndex = 0;
    var preset1Index = preferences.get("quickExportPreset1") || 1;
    var preset2Index = preferences.get("quickExportPreset2") || 2;
    var nameFormatIndex = preferences.get("nameFormatIndex") || 0;
    var isShowInFinder = preferences.get("quickExportShowInFinder");

    var exportPresetsTitles = [];
    util.toArray(exportPresets).forEach(function(item, index) {
        if (item.shouldApplyAutomatically()) {
            presetDefaultIndex = index;
        }
        var title = item.name() + (item.shouldApplyAutomatically() ? "*" : "");
        exportPresetsTitles.push(title);
    });

    // Setting
    if (identifier == "quick_export_setting") {

        if (exportPresets.count() == 1) {
            sketch.UI.message('Go to "Preferences" - "Presets" to add more preset.');
            return;
        }

        var dialog = new Dialog(
            "Quick Export Setting",
            'You can go to "Preferences" - "Presets" to add more export preset. The default preset end with a "*" sign.'
        );

        dialog.addLabel("Preset 1");
        var preset1 = ui.popupButton(exportPresetsTitles, 300);
        dialog.addView(preset1);

        dialog.addLabel("Preset 2");
        var preset2 = ui.popupButton(exportPresetsTitles, 300);
        dialog.addView(preset2);

        dialog.addLabel("Asset Name Format");
        var nameFormats = ui.popupButton([
            "Default",
            "group_name_base_name",
            "group-name-base-name",
            "base_name",
            "base-name"
        ]);
        dialog.addView(nameFormats);

        var showInFinder = ui.checkBox(isShowInFinder == null ? true : isShowInFinder, "Show in Finder after export.");
        dialog.addView(showInFinder);

        if (preset1Index < exportPresets.count()) {
            preset1.selectItemAtIndex(preset1Index);
        }
        if (preset2Index < exportPresets.count()) {
            preset2.selectItemAtIndex(preset2Index);
        }
        nameFormats.selectItemAtIndex(nameFormatIndex);

        var responseCode = dialog.run();
        if (responseCode == 1000) {
            preferences.set("quickExportPreset1", preset1.indexOfSelectedItem());
            preferences.set("quickExportPreset2", preset2.indexOfSelectedItem());
            preferences.set("nameFormatIndex", nameFormats.indexOfSelectedItem());
            preferences.set("quickExportShowInFinder", showInFinder.state() == NSOnState ? true : false);
        }

        return;
    }

    // Export
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers;

    var presetIndex;
    if (identifier == "quick_export_default") {
        presetIndex = presetDefaultIndex;
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
        exportLayer(document.sketchObject, layer.sketchObject, destFolder, nameFormatIndex, preset);
    });

    if (isShowInFinder == true || isShowInFinder == null) {
        system.showInFinder(destFolder);
    }

    sketch.UI.message('Export layer use "' + preset.name() + '" preset.');

};

function exportLayer(document, layer, destFolder, nameFormat, preset) {
    preset.exportFormats().forEach(function(exportFormat) {
        var exportRequest = MSExportRequest.exportRequestFromLayerAncestry_exportFormat_inRect(
            layer.ancestry(),
            exportFormat,
            layer.absoluteInfluenceRect()
        );
        var filePath = "";
        if (nameFormat == 1) {
            filePath += nameParts(layer.name()).map(formatNameUnderLine).join("_");
        } else if (nameFormat == 2) {
            filePath += nameParts(layer.name()).map(formatNameDash).join("-");
        } else if (nameFormat == 3) {
            filePath = formatNameUnderLine(nameParts(layer.name()).pop());
        } else if (nameFormat == 4) {
            filePath = formatNameDash(nameParts(layer.name()).pop());
        } else {
            filePath += layer.name();
        }
        if (exportFormat.namingScheme() == 0) {
            filePath += exportFormat.name();
        } else {
            filePath = exportFormat.name() + filePath;
        }
        filePath = destFolder + "/" + filePath + "." + exportRequest.format();
        document.saveExportRequest_toFile(exportRequest, filePath);
    });
}

function nameParts(name) {
    var regSlash = /\s?[\/\\]+\s?/;
    return name.trim().split(regSlash).filter(function(item) {
        return item != "";
    });
}

function formatNameUnderLine(name) {
    return name.trim().replace(/\s+/g, "_").replace(/-/g, "_").toLowerCase();
}

function formatNameDash(name) {
    return name.trim().replace(/\s+/g, "-").replace(/_/g, "-").toLowerCase();
}