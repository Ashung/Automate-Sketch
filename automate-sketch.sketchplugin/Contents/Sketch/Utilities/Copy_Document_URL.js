var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var pasteboard = require("../modules/Pasteboard");
    var zoom = require("../modules/Zoom");
    var selection = document.selectedLayers.layers;

    if (document.sketchObject.isCloudDoc()) {
        // console.log(document.sketchObject.cloudShare().class())
        // sketch://sketch.cloud/s/<shortId>
        // sketch://sketch.com/s/<shortId>
        var shortId = document.sketchObject.UIMetadata().document.cloudShare.shortId;
        var isPrivate = document.sketchObject.UIMetadata().document.cloudShare.shortId;
        var url = "sketch://sketch.com/s/" + shortId;
        if (selection.length == 1) {
            url += "?centerOnLayer=" + (selection[0].id);
            url += "&zoom=" + zoom.zoomValue.toFixed(1);
        }
        pasteboard.copy(url);
        if (isPrivate) {
            sketch.UI.message('Document URL copied. This is a private document.');
        } else {
            sketch.UI.message('Document URL copied. You can use it in web page or other app to open this document in Sketch.');
        }
    } else {
        // sketch://path/to/file.sketch?centerOnLayer=LAYER_ID&zoom=ZOOM_LEVEL
        if (document.path) {
            var url = "sketch://" + document.path;
            if (selection.length == 1) {
                url += "?centerOnLayer=" + (selection[0].id);
                url += "&zoom=" + zoom.zoomValue.toFixed(1);
            }
            pasteboard.copy(url);
            sketch.UI.message('Document URL copied. You can use it in web page or other app to open this document in Sketch.');
        } else {
            sketch.UI.message("Save document first.");
        }
    }
    
};
