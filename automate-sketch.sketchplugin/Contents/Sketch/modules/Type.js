var version = require("sketch").version.sketch;

module.exports.isShape = function(layer) {
    if (version >= 52) {
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

module.exports.isBitmap = function(layer) {
    return layer.class() == "MSBitmapLayer";
};

module.exports.isText = function(layer) {
    return layer.class() == "MSTextLayer";
};

module.exports.isGroup = function(layer) {
    return layer.class() == "MSLayerGroup";
};

module.exports.isArtboard = function(layer) {
    return layer.class() == "MSArtboardGroup";
};

module.exports.isSymbolMaster = function(layer) {
    return layer.class() == "MSSymbolMaster";
};

module.exports.isSymbolInstance = function(layer) {
    return layer.class() == "MSSymbolInstance";
};

module.exports.isSlice = function(layer) {
    return layer.class() == "MSSliceLayer";
};
