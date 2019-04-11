var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga(context, "Utilities");

    var ui = require("../modules/ui");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = context.command.identifier();

    var dialog = ui.cosDialog(
        "Insert Layers from SVG Code"
    );
    var input = ui.textField("", [300, 100]);

    if (identifier == "insert_layer_from_svg_path_data") {
        dialog = ui.cosDialog(
            "Insert Layer from SVG Path Data"
        );
        input = ui.textField("", [300, 50]);
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
            // center of canvas
            var contentDrawView = document.sketchObject.contentDrawView();
            var midX = Math.round((contentDrawView.frame().size.width/2 - contentDrawView.horizontalRuler().baseLine())/contentDrawView.zoomValue() - layer.frame.width / 2);
            var midY = Math.round((contentDrawView.frame().size.height/2 - contentDrawView.verticalRuler().baseLine())/contentDrawView.zoomValue() - layer.frame.height / 2);
            layer.frame.x = midX;
            layer.frame.y = midY;
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
