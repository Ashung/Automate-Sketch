var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var zoom = require("../modules/Zoom");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers;

    if (selection.length != 1) {
        sketch.UI.message("Please select 1 symbol instance.");
        return;
    }

    var instance = selection.layers[0];
    if (instance.type != "SymbolInstance") {
        sketch.UI.message("Please select 1 symbol instance.");
        return;
    }

    var sameInstancesInCurrentPage = instance.master.getAllInstances().filter(function(item) {
        return item.getParentPage().id == document.selectedPage.id;
    });

    document.selectedLayers.clear();
    document.selectedLayers.layers = sameInstancesInCurrentPage;

    zoom.toSelection();

};
