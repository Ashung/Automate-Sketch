var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var pluginIdentifier = context.command.identifier();
    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSTextLayer");
    var selectedTextLayers = selection.filteredArrayUsingPredicate(predicate);
    if (selectedTextLayers.count() == 0) {
        document.showMessage("Please select at least 1 text layer.");
        return;
    }

    var userDefaults = NSUserDefaults.standardUserDefaults();
    var stepSize = userDefaults.floatForKey("nudgeDistanceBig") / 2;

    selectedTextLayers.forEach(function(layer) {

        var defaultLineHeight = layer.defaultLineHeight(layer.immutableModelObject().createTextStorage().layoutManagers().firstObject());
        var lineHeight = layer.lineHeight() == 0 ? defaultLineHeight : layer.lineHeight();

        if (pluginIdentifier == "increase_line_height") {
            lineHeight = Math.round(lineHeight / stepSize) * stepSize + stepSize;
            layer.setLineHeight(lineHeight);
        }

        if (pluginIdentifier == "decrease_line_height") {
            lineHeight = Math.round(lineHeight / stepSize) * stepSize - stepSize;
            if (lineHeight <= stepSize) {
                lineHeight = stepSize;
            }
            layer.setLineHeight(lineHeight);
        }

    });

    document.reloadInspector();

});
