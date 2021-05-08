var sketch = require('sketch')

var removeTransparencyLayersHandler = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var page = document.currentPage();
    var selection = context.selection;

    var count = 0;

    if (selection.count() > 0) {

        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            removeTransparencyLayers(layer, function(_count) {
                count += _count;
            });
        }

    } else {

        removeTransparencyLayers(page, function(_count) {
            count = _count;
        });

    }

    var message;
    if (count > 1) {
        message = "🎉 " + count + " transparency layers removed.";
    } else if (count == 1) {
        message = "😊 1 transparency layer removed.";
    } else {
        message = "👍 Your document has no transparency layers.";
    }
    document.showMessage(message);

};

var selectTransparencyLayersHandler = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var page = document.currentPage();
    var selection = context.selection;

    if (selection.count() > 0) {

        // Fix Sketch 45
        if (page.deselectAllLayers) {
            page.deselectAllLayers();
        } else {
            page.changeSelectionBySelectingLayers(nil);
        }

        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {
            selectTransparencyLayers(layer);
        }

    } else {
        selectTransparencyLayers(page);
    }

};

function selectTransparencyLayers(layer) {
    if (layer.isKindOfClass(MSStyledLayer)) {
        if (layerIsTransparency(layer)) {
            // Fix Sketch 45
            if (sketch.version.sketch < 45) {
                layer.select_byExpandingSelection(true, true);
            } else {
                layer.select_byExtendingSelection(true, true);
            }
        } else {
            var loopChildren = layer.children().objectEnumerator();
            var childLayer;
            while (childLayer = loopChildren.nextObject()) {
                if (childLayer.isKindOfClass(MSStyledLayer)) {
                    if (layerIsTransparency(childLayer)) {
                        // Fix Sketch 45
                        if (sketch.version.sketch < 45) {
                            childLayer.select_byExpandingSelection(true, true);
                        } else {
                            childLayer.select_byExtendingSelection(true, true);
                        }
                    }
                }
            }
        }
    }

}

function removeTransparencyLayers(layer, callback) {

    var count = 0;

    if (layer.containsLayers() && layerIsGroup(layer)) {
        var loop = layer.children().objectEnumerator();
        var childLayer;
        while (childLayer = loop.nextObject()) {
            if (childLayer.isKindOfClass(MSStyledLayer)) {
                if (layerIsTransparency(childLayer)) {
                    childLayer.removeFromParent();
                    count ++;
                }
            }
        }
    }

    callback(count);
}

function layerIsGroup(layer) {
    if (
        layer.class() == "MSPage" ||
        layer.class() == "MSSymbolMaster" ||
        layer.class() == "MSArtboardGroup" ||
        layer.class() == "MSLayerGroup"
    ) {
        return true;
    } else {
        return false;
    }
}

function layerIsTransparency(layer) {

    var type = require("../modules/Type");

    if (layer.isKindOfClass(MSStyledLayer)) {
        if (layer.style().contextSettings().opacity() == 0) {
            return true;
        }
    }

    if (type.isShape(layer)) {
        if (
            checkingFills(layer) &&
            checkingBorders(layer) &&
            checkingShadows(layer) &&
            checkingInnerShadows(layer)
        ) {
            return true;
        }
    }

    if (type.isText(layer)) {
        if (layer.style().enabledFills().count() == 0) {
            if (
                layer.textColor().alpha() == 0 &&
                checkingBorders(layer) &&
                checkingShadows(layer) &&
                checkingInnerShadows(layer)
            ) {
                return true;
            }
        } else {
            if (
                checkingFills(layer) &&
                checkingBorders(layer) &&
                checkingShadows(layer) &&
                checkingInnerShadows(layer)
            ) {
                return true;
            }
        }

    }

    return false;

}

function checkingFills(layer) {
    if (layer.style().enabledFills().count() == 0) {
        return true;
    }
    var loopFills = layer.style().enabledFills().objectEnumerator();
    var fill;
    while (fill = loopFills.nextObject()) {
        if (fill.fillType() == 0) {
            if (fill.color().alpha() != 0) {
                return false;
            }
        }
        if (fill.fillType() == 1 || fill.fillType() == 4 || fill.fillType() == 5) {
            if (fill.contextSettings().opacity() == 0) {
               return true;
            }
        }
        if (fill.fillType() == 1) {
            var gradientStops = fill.gradient().stops();
            var loopStops = gradientStops.objectEnumerator();
            var stop;
            while (stop = loopStops.nextObject()) {
                if (stop.color().alpha() != 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

function checkingBorders(layer) {
    if (layer.style().enabledBorders().count() == 0) {
        return true;
    }
    var loopBorders = layer.style().enabledBorders().objectEnumerator();
    var borders;
    while (borders = loopBorders.nextObject()) {
        if (borders.fillType() == 0) {
            if (borders.color().alpha() != 0) {
                return false;
            }
        } else {
            if (borders.contextSettings().opacity() == 0) {
               return true;
            } else {
                var gradientStops = borders.gradient().stops();
                var loopStops = gradientStops.objectEnumerator();
                var stop;
                while (stop = loopStops.nextObject()) {
                    if (stop.color().alpha() != 0) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function checkingShadows(layer) {
    if (layer.style().enabledShadows().count() == 0) {
        return true;
    }
    var loopShadows = layer.style().enabledShadows().objectEnumerator();
    var shadow;
    while (shadow = loopShadows.nextObject()) {
        if (shadow.color().alpha() != 0) {
            return false;
        }
    }
    return true;
}

function checkingInnerShadows(layer) {
    if (layer.style().enabledInnerShadows().count() == 0) {
        return true;
    }
    var loopInnerShadows = layer.style().enabledInnerShadows().objectEnumerator();
    var innerShadows;
    while (innerShadows = loopInnerShadows.nextObject()) {
        if (innerShadows.color().alpha() != 0) {
            return false;
        }
    }
    return true;
}
