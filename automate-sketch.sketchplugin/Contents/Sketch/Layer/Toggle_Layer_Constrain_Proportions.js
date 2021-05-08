var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var version = sketch.version.sketch;
    var document = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }

    var lockConstrainProportionsLayerCount = 0;
    selection.forEach(function(layer){
        if (version >= 72) {
            if (layer.shouldConstrainProportions()) {
                lockConstrainProportionsLayerCount ++;
            }
        } else {
            if (layer.constrainProportions()) {
                lockConstrainProportionsLayerCount ++;
            }
        }
    });

    var doLock = lockConstrainProportionsLayerCount < selection.count() / 2;

    if (doLock) {
        selection.forEach(function(layer){
            if (version >= 72) {
                layer.setShouldConstrainProportions(true);
            } else {
                layer.setConstrainProportions(true);
            }
        });
        document.showMessage("Layer constrain proportions set to LOCK");
    }
    else {
        selection.forEach(function(layer){
            if (version >= 72) {
                layer.setShouldConstrainProportions(false);
            } else {
                layer.setConstrainProportions(false);
            }
        });
        document.showMessage("Layer constrain proportions set to UNLOCK");
    }
};
