var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var currentPage = document.selectedPage;

    var allSelectedLayersIsArtboard = selectedLayers.every(function(layer) {
        return layer.type == "Artboard";
    });
    if (selectedLayers.length > 0 && allSelectedLayersIsArtboard) {
        var allInstances = [];
        selectedLayers.forEach(function(layer) {
            var instancesInArtboard = sketch.find("[type='SymbolInstance']", layer);
            allInstances = allInstances.concat(instancesInArtboard);
        });
        allInstances.forEach(function(layer) {
            layer.detach({recursively: true});
        });
        sketch.UI.message("Detach " + allInstances.length + " symbol(s) in selected artboards.");
    } else {
        var instances = sketch.find("[type='SymbolInstance']", currentPage);
        instances.forEach(function(layer) {
            layer.detach({recursively: true});
        });
        sketch.UI.message("Detach " + instances.length + " symbol(s) in current page.");
    }

};
