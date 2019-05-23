var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSTextLayer");
    var selectedTextLayers = selection.filteredArrayUsingPredicate(predicate);
    if (selectedTextLayers.count() == 0) {
        document.showMessage("Place select a text layer.");
        return;
    }

    selectedTextLayers.forEach(function(layer) {
        if (layer.textBehaviour() == 0) {
            layer.setTextBehaviour(1);
        } else {
            layer.setTextBehaviour(0);
        }
    });

};