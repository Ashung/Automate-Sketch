var onRun = function(context) {

    var ga = require("../lib/Google_Analytics");
    ga(context, "Symbol");

    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var selectedSymbolInstances = selectedLayers.filter(layer => layer.type == "SymbolInstance");
    if (selectedSymbolInstances.length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance layer.");
        return;
    }

    var selectedOverrideIds = util.toArray(document._getMSDocumentData().selectedOverrides()).map(item => {
        return String(item).substr(String(item).indexOf("#") + 1);
    });
    if (selectedOverrideIds.length == 0) {
        sketch.UI.message("Please select at least 1 override.");
        return;
    }

    selectedSymbolInstances.forEach(instance => {
        instance.overrides.filter(override => {
            return override.editable && selectedOverrideIds.includes(override.id);
        }).forEach(override => {
            var symbolMaster = instance.sketchObject.symbolMaster();
            var overridePoint = override.sketchObject.overridePoint();
            symbolMaster.setOverridePoint_editable(overridePoint, false);
        });
    });

    document.sketchObject.reloadInspector();

};
