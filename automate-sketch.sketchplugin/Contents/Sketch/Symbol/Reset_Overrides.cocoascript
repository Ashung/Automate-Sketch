var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var document = context.document;
    var selection = context.selection;
    var symbolInstancesInSelection = getSymbolInstancesInSelection(selection);

    if (selection.count() == 0 || symbolInstancesInSelection.count() == 0) {
        document.showMessage("Please select at least 1 symbol instance.");
        return;
    }

    var loopSymbolInstancesInSelection = symbolInstancesInSelection.objectEnumerator();
    var symbolInstance;
    while (symbolInstance = loopSymbolInstancesInSelection.nextObject()) {
        symbolInstance.setOverrides(nil);
    }

};


function getSymbolInstancesInSelection(selection) {
    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
    return selection.filteredArrayUsingPredicate(predicate);
}
