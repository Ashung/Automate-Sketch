var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = context.document;
    var documentData = document.documentData();
    var selection = context.selection;

    var predicate;
    if (sketch.version.sketch >= 52) {
        predicate = NSPredicate.predicateWithFormat("sharedStyle.objectID != nil");
    } else {
        predicate = NSPredicate.predicateWithFormat("style.sharedObjectID != nil");
    }
    var selectedLayerWithSharedStyle = selection.filteredArrayUsingPredicate(predicate);
    var count = selectedLayerWithSharedStyle.count();

    if (selection.count() == 0 || count == 0) {
        document.showMessage("Please select a layer with a shared style.");
        return;
    }

    selectedLayerWithSharedStyle.forEach(function(layer) {
        var sharedStyleName;
        // Local shared style
        if (layer.sharedObject()) {
            sharedStyleName = layer.sharedObject().name();
        }
        // Foreign shared style
        else {
            var sharedStyleId;
            if (sketch.version.sketch >= 52) {
                sharedStyleId = layer.sharedStyle().objectID();
            } else {
                sharedStyleId = layer.style().sharedObjectID();
            }
            var foreignSharedStyles = documentData.foreignTextStyles();
            if (layer.class() != "MSTextLayer") {
                foreignSharedStyles = documentData.foreignLayerStyles();
            }
            var predicateStyleId = NSPredicate.predicateWithFormat("localShareID == %@", sharedStyleId);
            var foreignSharedStyle = foreignSharedStyles.filteredArrayUsingPredicate(predicateStyleId).firstObject();
            sharedStyleName = foreignSharedStyle.localObject().name();
        }
        layer.setName(sharedStyleName);
    });

    document.showMessage(`Rename ${count} layer${count > 1 ? "s" : ""} to it's shared style name.`);

};
