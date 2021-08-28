var sketch = require("sketch");
var document = sketch.getSelectedDocument();

module.exports.getCGRectFromMSLayers = function (layers) {
    var rect = CGRectMake(0, 0, 0, 0);
    for (var i = 0; i < layers.count(); i++) {
        rect = NSUnionRect(rect, layers[i].rect());
    }
    return rect;
};

module.exports.getMSRectFromMSLayers = function (layers) {
    var rect = CGRectMake(0, 0, 0, 0);
    if (!!layers.count) {
        for (var i = 0; i < layers.count(); i++) {
            rect = NSUnionRect(rect, layers[i].rect());
        }
    } else {
        for (var i = 0; i < layers.length; i++) {
            rect = NSUnionRect(rect, layers[i].rect());
        }
    }
    return MSRect.rectWithRect(rect);
};

module.exports.getRectFromLayers = function (layers) {
    var cgRect = CGRectMake(0, 0, 0, 0);
    for (var i = 0; i < layers.length; i++) {
        cgRect = NSUnionRect(cgRect, layers[i].sketchObject.rect());
    }
    var rect = { x: cgRect.origin.x, y: cgRect.origin.y, width: cgRect.size.width, height: cgRect.size.height };
    return rect;
};

module.exports.centerMSLayers = function (layers) {
    var rect = this.getMSRectFromMSLayers(layers);
    var contentDrawView = document._object.contentDrawView();
    contentDrawView.centerRect(rect.rect());
};

module.exports.centerLayers = function (layers) {
    var rect = this.getRectFromLayers(layers);
    var contentDrawView = document._object.contentDrawView();
    contentDrawView.centerRect(CGRectMake(rect.x, rect.y, rect.width, rect.height));
};

module.exports.midXOfRect = function (rect) {
    if (!!rect.class && rect.class() == "MSRect") {
        return NSMidX(rect.rect());
    } else {
        return rect.x + rect.width / 2;
    }
};

module.exports.midYOfRect = function (rect) {
    if (!!rect.class && rect.class() == "MSRect") {
        return NSMidY(rect.rect());
    } else {
        return rect.y + rect.height / 2;
    }
};

module.exports.maxXOfRect = function (rect) {
    if (!!rect.class && rect.class() == "MSRect") {
        return NSMaxX(rect.rect());
    } else {
        return rect.x + rect.width;
    }
};

module.exports.maxYOfRect = function (rect) {
    if (!!rect.class && rect.class() == "MSRect") {
        return NSMaxY(rect.rect());
    } else {
        return rect.y + rect.height;
    }
};
