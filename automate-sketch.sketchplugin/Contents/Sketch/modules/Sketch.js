var Sketch = {};

Sketch.isShapeLayer = function(layer) {
    if (MSApplicationMetadata.metadata().appVersion >= 52) {
        if (
            layer.class() == "MSShapeGroup" ||
            (
                (
                    layer.class() == "MSRectangleShape" ||
                    layer.class() == "MSOvalShape" ||
                    layer.class() == "MSShapePathLayer" ||
                    layer.class() == "MSTriangleShape" ||
                    layer.class() == "MSStarShape" ||
                    layer.class() == "MSPolygonShape"
                ) && layer.parentGroup().class() != "MSShapeGroup"
            )
        ) {
            return true;
        }
    } else {
        return layer.class() == "MSShapeGroup";
    }
    return false;
};

Sketch.isBitmapLayer = function(layer) {
    return layer.class() == "MSBitmapLayer";
};

Sketch.isTextLayer = function(layer) {
    return layer.class() == "MSTextLayer";
};

Sketch.isLayerGroup = function(layer) {
    return layer.class() == "MSLayerGroup";
};

module.exports = Sketch;