var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var resetLayers = [];
    selectedLayers.forEach(layer => {
        resetBoundingBox(layer);
    });

    function resetBoundingBox(layer) {
        if (layer.type == "Group" || layer.type == "Shape") {
            layer.sketchObject.moveTransformsToChildren();
            layer.sketchObject.fixGeometryWithOptions(1);
            layer.layers.forEach(function(childLayer) {
                resetBoundingBox(childLayer);
            });
            if (layer.selected) {
                resetLayers.push(layer);
            }
        } else if (layer.type == "ShapePath") {
            var flattened = layer.sketchObject.flattenedLayer();
            var flattener = MSLayerFlattener.alloc().init();
            flattener.flattenLayer_options(flattened, 2);
            var parent = layer.sketchObject.parentGroup();
            parent.insertLayer_afterLayer(flattened, layer.sketchObject);
            if (layer.selected) {
                resetLayers.push(flattened);
            }
            parent.removeLayer(layer.sketchObject);
        }
    }

    document.selectedLayers = resetLayers;

};

