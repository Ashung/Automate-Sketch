var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var userDefaults = NSUserDefaults.standardUserDefaults();

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var dialog = new Dialog(
        "SVG Export Setting",
        "The setting for Sketch to export SVG files."
    );

    var svgExportCompact = ui.checkBox(true, "Disable add metadata to SVG.");
    if (userDefaults.boolForKey("svgExportCompact")) {
        svgExportCompact.setState(NSOnState);
    } else {
        svgExportCompact.setState(NSOffState);
    }
    dialog.addView(svgExportCompact);

    var svgExportSkipAssignIdToLayerName = ui.checkBox(true, "Disable use the name of the layer for the id field \nof the layer in SVG.", [300, 40]);
    if (userDefaults.boolForKey("svgExportSkipAssignIdToLayerName")) {
        svgExportSkipAssignIdToLayerName.setState(NSOnState);
    } else {
        svgExportSkipAssignIdToLayerName.setState(NSOffState);
    }
    dialog.addView(svgExportSkipAssignIdToLayerName);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var _svgExportCompact = svgExportCompact.state(),
            _svgExportSkipAssignIdToLayerName = svgExportSkipAssignIdToLayerName.state();

        if (_svgExportCompact != userDefaults.boolForKey("svgExportCompact")) {
            userDefaults.setBool_forKey(Boolean(_svgExportCompact), "svgExportCompact");
            userDefaults.synchronize();
        }

        if (_svgExportSkipAssignIdToLayerName != userDefaults.boolForKey("svgExportSkipAssignIdToLayerName")) {
            userDefaults.setBool_forKey(Boolean(_svgExportSkipAssignIdToLayerName), "svgExportSkipAssignIdToLayerName");
            userDefaults.synchronize();
        }

    }

}
