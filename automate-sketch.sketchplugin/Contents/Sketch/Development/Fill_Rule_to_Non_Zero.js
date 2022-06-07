var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    selectedLayers.forEach(function(layer) {
        traverse(layer.sketchObject);
    });

    function traverse(layer) {
        layer.children().forEach(function(child) {
            var shapeTypes = ["MSShapeGroup", "MSRectangleShape", "MSOvalShape", "MSShapePathLayer", "MSTriangleShape", "MSStarShape", "MSPolygonShape"];
            if (shapeTypes.includes(String(child.className())) && child.parentGroup().className() != "MSShapeGroup") {
                child.style().setWindingRule(0);
                sketch.UI.message('"' + child.name() + '" fill rule change to Non-Zero.');
            }
            if (child.className() == "MSSymbolInstance") {
                if (child.symbolMaster().isForeign()) {
                    sketch.UI.message('"' + child.name() + '" is library symbol.');
                } else {
                    traverse(child.symbolMaster());
                }
            }
        });    
    }
}