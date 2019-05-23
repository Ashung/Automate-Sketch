var smallIncreaseWidthFromRight = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromRight(layer, nudgeDistanceSmall());
    });
};

var largeIncreaseWidthFromRight = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromRight(layer, nudgeDistanceBig());
    });
};

var smallIncreaseWidthFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromCenter(layer, nudgeDistanceSmall());
    });
};

var largeIncreaseWidthFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromCenter(layer, nudgeDistanceBig());
    });
};

var smallIncreaseHeightFromBottom = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromBottom(layer, nudgeDistanceSmall());
    });
};

var largeIncreaseHeightFromBottom = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromBottom(layer, nudgeDistanceBig());
    });
};

var smallIncreaseHeightFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromCenter(layer, nudgeDistanceSmall());
    });
};

var largeIncreaseHeightFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromCenter(layer, nudgeDistanceBig());
    });
};


var smallDecreaseWidthFromRight = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromRight(layer, nudgeDistanceSmall() * -1);
    });
};

var largeDecreaseWidthFromRight = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromRight(layer, nudgeDistanceBig() * -1);
    });
};

var smallDecreaseWidthFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromCenter(layer, nudgeDistanceSmall() * -1);
    });
};

var largeDecreaseWidthFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustWidthFromCenter(layer, nudgeDistanceBig() * -1);
    });
};

var smallDecreaseHeightFromBottom = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromBottom(layer, nudgeDistanceSmall() * -1);
    });
};

var largeDecreaseHeightFromBottom = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromBottom(layer, nudgeDistanceBig() * -1);
    });
};

var smallDecreaseHeightFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromCenter(layer, nudgeDistanceSmall() * -1);
    });
};

var largeDecreaseHeightFromCenter = function(context) {
    runActionForSelection(context, function(layer) {
        adjustHeightFromCenter(layer, nudgeDistanceBig() * -1);
    });
};


function runActionForSelection(context, action) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");
    var document = context.document;
    var selection = context.selection;
    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }
    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {
        action(layer);
    }
    document.reloadInspector();
}

function adjustWidthFromRight(layer, val) {
    layer.setConstrainProportions(false);
    var right = layer.frame().maxX();
    var result = layer.frame().width() > val * -1 ? layer.frame().width() + val : 1;
    layer.frame().setWidth(result);
    layer.frame().setMaxX(right);
}

function adjustWidthFromCenter(layer, val) {
    layer.setConstrainProportions(false);
    var center = layer.frame().midX();
    var result = layer.frame().width() > val * -1 ? layer.frame().width() + val : 1;
    layer.frame().setWidth(result);
    layer.frame().setMidX(center);
}

function adjustHeightFromBottom(layer, val) {
    layer.setConstrainProportions(false);
    var bottom = layer.frame().maxY();
    var result = layer.frame().height() > val * -1 ? layer.frame().height() + val : 1;
    layer.frame().setHeight(result);
    layer.frame().setMaxY(bottom);
}

function adjustHeightFromCenter(layer, val) {
    layer.setConstrainProportions(false);
    var center = layer.frame().midY();
    var result = layer.frame().height() > val * -1 ? layer.frame().height() + val : 1;
    layer.frame().setHeight(result);
    layer.frame().setMidY(center);
}

function nudgeDistanceBig() {
    return NSUserDefaults.standardUserDefaults().floatForKey("nudgeDistanceBig") || 10;
}

function nudgeDistanceSmall() {
    return NSUserDefaults.standardUserDefaults().floatForKey("nudgeDistanceSmall") || 1;
}
