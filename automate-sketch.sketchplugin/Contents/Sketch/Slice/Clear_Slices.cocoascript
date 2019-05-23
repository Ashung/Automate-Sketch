var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var doc = context.document;

    var exportableLayers = doc.currentPage().exportableLayers();
    var count = 0;

    for(var i = 0; i < exportableLayers.count(); i++) {
        var exportableLayer = exportableLayers[i];
        if (exportableLayer.class() == "MSSliceLayer") {
            exportableLayer.removeFromParent();
            count ++;
        }
    }

    var message;
    if (count > 1) {
        message = count + " slices removed in current page.";
    } else if (count == 1) {
        message = "1 slice removed in current page.";
    } else {
        message = "No slices found in current page.";
    }
    doc.showMessage(message);

};
