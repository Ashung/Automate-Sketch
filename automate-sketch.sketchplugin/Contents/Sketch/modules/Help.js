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
    var rect = { x: 0, y: 0, width: 0, height: 0 };
    if (layers.length === 1) {
        rect = {...layers[0].frame}; 
    }
    if (layers.length > 1) {
        rect = {...layers[0].frame};
        var right = rect.x + rect.width;
        var bottom = rect.y + rect.height;
        for (var i = 1; i < layers.length; i++) {
            var _rect = {...layers[i].frame};
            var _right = _rect.x + _rect.width;
            var _bottom = _rect.y + _rect.height;
            rect = {
                x: Math.min(rect.x, _rect.x),
                y: Math.min(rect.y, _rect.y),
                width: Math.max(right, _right) - Math.min(rect.x, _rect.x),
                height: Math.max(bottom, _bottom) - Math.min(rect.y, _rect.y)
            }
        } 
    }
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
