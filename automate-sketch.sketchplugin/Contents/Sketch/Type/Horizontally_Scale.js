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

    var stepSize = 0.1;

    selectedTextLayers.forEach(function(layer) {

        var scale = layer.attributeForKey(NSExpansionAttributeName) ? layer.attributeForKey(NSExpansionAttributeName) : 0;

        if (pluginIdentifier == "increase_horizontally_scale") {
            scale = scale + stepSize;
            layer.addAttribute_value(NSExpansionAttributeName, scale);
        }

        if (pluginIdentifier == "decrease_horizontally_scale") {
            scale = scale - stepSize;
            layer.addAttribute_value(NSExpansionAttributeName, scale);
        }

        if (pluginIdentifier == "reset_horizontally_scale") {
            layer.addAttribute_value(NSExpansionAttributeName, 0);
        }

    });

});
