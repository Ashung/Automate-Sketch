var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var System = require("../modules/System");
    var document = context.document;
    var selection = context.selection;

    var predicate = NSPredicate.predicateWithFormat("className == %@", "MSTextLayer");
    var textLayers = selection.filteredArrayUsingPredicate(predicate);

    if (textLayers.count() == 0) {
        document.showMessage("Please select at least 1 text layer.")
    }

    var content = "";
    textLayers.forEach(function(layer) {
        content += layer.stringValue() + "\n";
    });

    var filePath = System.savePanel("data.txt");
    if (filePath) {
        System.writeStringToFile(content, filePath);
        System.showInFinder(filePath);
    }

};
