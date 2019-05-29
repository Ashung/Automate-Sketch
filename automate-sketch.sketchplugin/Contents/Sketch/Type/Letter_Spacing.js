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

    var stepSize = 0.38;

    selectedTextLayers.forEach(function(layer) {

        if (pluginIdentifier == "increase_letter_spacing") {
            var kerning = layer.kerning() + stepSize;
            layer.setKerning(kerning)
        }

        if (pluginIdentifier == "decrease_letter_spacing") {
            var kerning = layer.kerning() - stepSize;
            layer.setKerning(kerning)
        }

    });

    document.reloadInspector();

});
