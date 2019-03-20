var onRun = function(context) {

    var ga = require("../lib/Google_Analytics");
    ga(context, "Layer");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    var supportedTypes = ["ShapePath", "Shape", "Group"];


// layer.sketchObject.moveTransformsToChildren()
// layer.sketchObject.fixGeometryWithOptions(1)

//layer.sketchObject.flattenedLayer()
// var flattened = layer.sketchObject.flattenedLayer();   // Converts custom shapes into MSShapePathLayer
//       
// var flattener = MSLayerFlattener.alloc().init()
// flattener.flattenLayer_options(flattened, 2);// includes removing duplicate points
//       
// var group = layer.sketchObject.parentGroup()
// group.insertLayer_afterLayer(flattened, layer.sketchObject)
// group.removeLayer(layer.sketchObject)


};