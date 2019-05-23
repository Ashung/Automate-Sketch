var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var util = require("util");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var selectedSymbolInstances = selectedLayers.filter(layer => {
        return layer.type == "SymbolInstance" && !layer.master.sketchObject.isForeign();
    });
    if (selectedSymbolInstances.length == 0) {
        sketch.UI.message("Please select at least 1 local symbol instance layer.");
        return;
    }

    var selectedOverrideIds = {};
    util.toArray(document._getMSDocumentData().selectedOverrides()).forEach(item => {
        var [instanceId, overrideId] = String(item).split("#");
        if (!selectedOverrideIds[instanceId]) {
            selectedOverrideIds[instanceId] = [];
        }
        selectedOverrideIds[instanceId].push(overrideId);
    });
    if (Object.keys(selectedOverrideIds).length == 0) {
        sketch.UI.message("Please select at least 1 symbol instance layer.");
        return;
    }

    selectedSymbolInstances.forEach(instance => {
        instance.overrides.forEach(override => {
            if (selectedOverrideIds[instance.id].includes(override.id)) {
                var symbolMaster = instance.sketchObject.symbolMaster();
                var overridePoint = override.sketchObject.overridePoint();
                symbolMaster.setOverridePoint_editable(overridePoint, false);
            }
        });
    });

    document.sketchObject.reloadInspector();

};
