var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var zoom = require("../modules/Zoom");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    
    var symbolMaster = document.selectedLayers.layers.find(function(layer) {
        return (layer.type == "SymbolInstance" || layer.type == "SymbolMaster");
    });
    if (!symbolMaster) {
        sketch.UI.message("Please select 1 symbol.");
        return;
    }
    if (symbolMaster.type == "SymbolInstance") {
        symbolMaster = symbolMaster.master;
    }

    // { id: { name, count }}
    var pagesHaveInstances = {};
    var instances = symbolMaster.getAllInstances();
    instances.forEach(function(instance) {
        var pageId = instance.getParentPage().id;
        if (!pagesHaveInstances[pageId]) {
            pagesHaveInstances[pageId] = {
                name: instance.getParentPage().name,
                count: 1
            }
        } else {
            pagesHaveInstances[pageId]['count'] += 1;
        }
    });

    // Dialog
    var dialog = new Dialog(
        "Select All Instances of Symbol",
        "Pages that contain instance of \"" + symbolMaster.name + "\".\nClick OK to select all instances in page."
    );

    dialog.addLabel("Choose a page");

    var pageNames = Object.values(pagesHaveInstances).map(function(item) {
        return item.name + " (" + item.count + ")";
    });
    var selectBox = ui.popupButton(pageNames);
    dialog.addView(selectBox);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var targetPageId = Object.keys(pagesHaveInstances)[selectBox.indexOfSelectedItem()];
        var targetPage = document.pages.find(function(page) {
            return page.id == targetPageId;
        });

        document.selectedPage = targetPage;

        document.selectedLayers.clear();

        var selectedInstances = instances.filter(function(instance) {
            return instance.getParentPage().id == targetPageId;
        });

        document.selectedLayers.layers = selectedInstances;

        zoom.toSelection();

    }
};