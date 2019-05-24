var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var appVersion = MSApplicationMetadata.metadata().appVersion;
    var doc = context.document;
    var selection = context.selection;

    // Get current symbolMaster
    var currentSymbolMaster;
    if (selection.count() > 0) {
        var layer = selection.firstObject();
        getCurrentSymbolMasterFromLayer(layer, function(_symbolMaster) {
            currentSymbolMaster = _symbolMaster
        });
    } else {
        doc.showMessage("Please select 1 local symbol.");
    }

    if (!currentSymbolMaster) {
        doc.showMessage("Please select 1 local symbol.");
    } else {

        var allInstancesOfCurrentSymbolMaster = 0;
        var pagesHasInstances = [];
        var pagesName = [];

        for (var i = 0; i < doc.pages().count(); i++) {
            var page = doc.pages().objectAtIndex(i);

            // Count
            var instancesOfCurrentSymbolMasterInCurretPage = 0;
            for (var j = 0; j < page.children().count(); j ++) {
                var layer = page.children().objectAtIndex(j);
                if (layer.class() == "MSSymbolInstance") {
                    if (String(layer.symbolID()) == String(currentSymbolMaster.symbolID())) {
                        instancesOfCurrentSymbolMasterInCurretPage ++;
                        allInstancesOfCurrentSymbolMaster ++;
                    }
                }
            }

            // Data for select box
            if (instancesOfCurrentSymbolMasterInCurretPage > 0 && pagesHasInstances.indexOf(page) == -1) {
                pagesHasInstances.push(page);
                pagesName.push(page.name() + " (" + instancesOfCurrentSymbolMasterInCurretPage + ")");
            }

        }

        if (allInstancesOfCurrentSymbolMaster == 0) {
            doc.showMessage("The symbol master has no instances.");
            return;
        }

        // Dialog
        var dialog = new Dialog(
            "Select All Instances of Symbol",
            "Pages that contain instance of \"" + currentSymbolMaster.name() + "\".\nClick OK to select all instances in page."
        );

        dialog.addLabel("Choose a page");

        var selectBox = ui.popupButton(pagesName);
        dialog.addView(selectBox);

        var responseCode = dialog.run();
        if (responseCode == 1000) {

            // go to selected page
            var selectPage = selectBox.indexOfSelectedItem();
            var currentPage = pagesHasInstances[selectPage];
            doc.setCurrentPage(currentPage);

            // Select all instances
            // Fix Sketch 45
            if (currentPage.deselectAllLayers) {
                currentPage.deselectAllLayers();
            } else {
                currentPage.changeSelectionBySelectingLayers(nil);
            }

            for (var j = 0; j < currentPage.children().count(); j ++) {
                var layer = currentPage.children().objectAtIndex(j);
                if (layer.class() == "MSSymbolInstance") {
                    if (String(layer.symbolID()) == String(currentSymbolMaster.symbolID())) {

                        // Fix Sketch 45
                        if (appVersion < 45) {
                            layer.select_byExpandingSelection(true, true);
                        } else {
                            layer.select_byExtendingSelection(true, true);
                        }

                        // if instance is invisible make it visible.
                        if (layer.isVisible() == false) {
                            layer.setIsVisible(true);
                        }
                    }
                }
            }

            // Same as CMD + 2
            NSApp.sendAction_to_from("zoomToSelection:", nil, doc);

        }
    }

};

function getCurrentSymbolMasterFromLayer(layer, callback) {
    if (layer.class() == "MSSymbolMaster") {
        callback(layer);
    }
    if (layer.class() == "MSSymbolInstance") {
        if (layer.symbolMaster().isForeign()) {
            return;
        } else {
            callback(layer.symbolMaster());
        }
    }
    if (layer.parentGroup().class() != "MSPage") {
        getCurrentSymbolMasterFromLayer(layer.parentGroup(), callback);
    } else {
        return;
    }
}
