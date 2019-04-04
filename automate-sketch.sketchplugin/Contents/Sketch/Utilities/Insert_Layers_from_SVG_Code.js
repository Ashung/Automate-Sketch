@import "../Libraries/Google_Analytics.cocoascript";
@import "../Libraries/UI_Controls.cocoascript";

var onRun = function(context) {

    ga(context, "Utilities");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = context.command.identifier();

    var dialog = UI.cosDialog(
        "Insert Layers from SVG Code"
    );
    var input = UI.textField("", [300, 100]);

    if (identifier == "insert_layer_from_svg_path_data") {
        dialog = UI.cosDialog(
            "Insert Layer from SVG Path Data"
        );
        input = UI.textField("", [300, 50]);
    }

    dialog.addAccessoryView(input);

    var responseCode = dialog.runModal();
    if (responseCode == 1000) {

        if (!input.stringValue()) {
            return;
        }

        var svgString = input.stringValue();

        if (identifier == "insert_layer_from_svg_path_data") {
            svgString = NSString.stringWithFormat('<svg><path d="%@"></path></svg>', svgString);
        }

        var svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
        var svgImporter = MSSVGImporter.svgImporter();
        svgImporter.prepareToImportFromData(svgData);
        var svgLayer = svgImporter.importAsLayer();
        svgLayer.setName("SVG");

        var layer = sketch.fromNative(svgLayer);
        if (document.selectedLayers.isEmpty) {
            document.selectedPage.layers.push(layer);
            document.centerOnLayer(layer);
        } else {
            var selectedLayer = document.selectedLayers.layers[0];
            if (["Artboard", "Group", "SymbolMaster"].includes(selectedLayer.type)) {
                selectedLayer.layers.push(layer);
            } else {
                selectedLayer.parent.layers.push(layer);
                layer.frame.x = selectedLayer.frame.x;
                layer.frame.y = selectedLayer.frame.y;
            }
        }
        document.selectedLayers = [layer];

    }

};
