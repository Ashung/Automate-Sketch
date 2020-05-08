var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var Group = require("sketch/dom").Group;

    var groups = {};
    selectedLayers.forEach(function(layer) {
        var id = layer.getParentArtboard() ? layer.getParentArtboard().id : "none";
        if (!groups[id]) {
            groups[id] = [];
        }
        groups[id].push(layer);
    });

    for (var group in groups) {
        var layers = groups[group];
        var newGroup = new Group({
            name: layers[layers.length - 1].name,
            layers
        });
        var parent = group == "none" ? document.selectedPage : document.getLayerWithID(group);
        parent.layers.push(newGroup);
    }
};