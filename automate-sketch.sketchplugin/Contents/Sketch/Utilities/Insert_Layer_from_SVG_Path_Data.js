@import "../Libraries/Google_Analytics.cocoascript";
@import "../Libraries/UI_Controls.cocoascript";

var onRun = function(context) {

    ga(context, "Utilities");

    var sketch = require("sketch");
    var ShapePath = require("sketch/dom").ShapePath;
    var document = sketch.getSelectedDocument();

    var dialog = UI.cosDialog(
        "Insert Layer from SVG Path Data"
    );

    var input = UI.textField("", [300, 50]);
    dialog.addAccessoryView(input);

    var responseCode = dialog.runModal();
    if (responseCode == 1000) {

        var pathData = String(input.stringValue());
        var layer = ShapePath.fromSVGPath(pathData);
        layer.style.fills.push({ color: "#000000" });
        document.selectedPage.layers.push(layer);
        document.selectedLayers = [layer];
        document.centerOnLayer(layer);

    }

};