var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var selection = context.selection;

    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSLayerGroup");
    var selectedGroups = selection.filteredArrayUsingPredicate(predicate);
    if (selectedGroups.count() == 0) {
        document.showMessage("Please select at least 1 layer group.");
        return;
    }

    selectedGroups.forEach(function(group) {
        if (group.hasClickThrough()) {
            group.setHasClickThrough(false);
        } else {
            group.setHasClickThrough(true);
        }
    });

};
