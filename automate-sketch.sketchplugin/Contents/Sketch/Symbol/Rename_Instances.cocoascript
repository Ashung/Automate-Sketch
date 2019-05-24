var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var document = context.document;
    var selection = context.selection;
    var symbolInstancesInSelection = getSymbolInstancesInSelection(selection);
    var symbolMastersInSelection = getSymbolMastersInSelection(selection);

    // Rename all instances
    if (
        selection.count() == 0 ||
        (symbolInstancesInSelection.count() == 0 && symbolMastersInSelection.count() == 0)
    ) {
        var instances = NSMutableArray.alloc().init();
        var loopPages = document.pages().objectEnumerator();
        var page;
        while (page = loopPages.nextObject()) {
            instances.addObjectsFromArray(page.allSymbolInstancesInChildren().allObjects());
        }
        renameInstances(instances, "Rename All Instances", "Change the name for all symbol instances.");
    }

    // Rename all selected instances
    else if (
        symbolInstancesInSelection.count() > 0 &&
        symbolInstancesInSelection.count() >= symbolMastersInSelection.count()
    ) {
        var instances = symbolInstancesInSelection;
        renameInstances(instances, "Rename Instances", "Change the name for all selected symbol instances.");
    }

    // Rename all instances of selected symbol master
    else if (
        symbolMastersInSelection.count() > 0 &&
        symbolMastersInSelection.count() > symbolInstancesInSelection.count()
    ) {
        var instances = NSMutableArray.alloc().init();
        var loopSymbolMasterInSelection = symbolMastersInSelection.objectEnumerator();
        var symbolMaster;
        while (symbolMaster = loopSymbolMasterInSelection.nextObject()) {
            instances.addObjectsFromArray(symbolMaster.allInstances());
        }
        renameInstances(instances, "Rename Instances of Symbol Master", "Change the name for all sysmbol instances of selected symbol masters.");
    }

};

function renameInstances(instances, title, message) {

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    // Dialog
    var dialog = new Dialog(title, message);

    dialog.addLabel("Change the name to...");

    var buttonNameType = ui.popupButton([
        "Original name of symbol master.",
        "Base name of symbol master.",
        "1st group name of symbol master.",
        "2nd group name of symbol master.",
        "Custom name."
    ]);
    dialog.addView(buttonNameType);
    
    dialog.addLabel("Custom name");

    var inputCustomName = ui.textField(preferences.get("customInstanceName") || "");
    ui.disableTextField(inputCustomName, true);
    dialog.addView(inputCustomName);

    buttonNameType.setCOSJSTargetFunction(function(sender) {
        if (sender.indexOfSelectedItem() == sender.itemArray().count() - 1) {
            ui.disableTextField(inputCustomName, false);
        } else {
            ui.disableTextField(inputCustomName, true);
        }
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        preferences.set("customInstanceName", inputCustomName.stringValue());

        var loopInstances = instances.objectEnumerator();
        var instance;
        while (instance = loopInstances.nextObject()) {

            // Original name of symbol master.
            if (buttonNameType.indexOfSelectedItem() == 0) {
                instance.setName(instance.symbolMaster().name().trim());
            }

            // Base name of symbol master.
            if (buttonNameType.indexOfSelectedItem() == 1) {
                var lastIndexOfSlash = instance.symbolMaster().name().lastIndexOf("/");
                var name = instance.symbolMaster().name().substr(lastIndexOfSlash + 1).trim();
                instance.setName(name);
            }

            // 1st group name of symbol master
            if (buttonNameType.indexOfSelectedItem() == 2) {
                var name = instance.symbolMaster().name().split("/")[0].trim();
                instance.setName(name);
            }

            // 2nd group name of symbol master
            if (buttonNameType.indexOfSelectedItem() == 3) {
                var nameArray = instance.symbolMaster().name().split("/");
                var name = (nameArray.length > 1 ? nameArray[1] : nameArray[0]).trim();
                instance.setName(name);
            }

            // Custom name.
            if (buttonNameType.indexOfSelectedItem() == 4) {
                instance.setName(inputCustomName.stringValue());
            }

        }

    }
}

function getSymbolInstancesInSelection(selection) {
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    return selection.filteredArrayUsingPredicate(predicate);
}

function getSymbolMastersInSelection(selection) {
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolMaster");
    return selection.filteredArrayUsingPredicate(predicate);
}