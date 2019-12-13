var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = context.command.identifier();

    var dialog = new Dialog(
        "Insert Layers from SVG Code"
    );
    var input = ui.textField("", [300, 100]);

    if (identifier == "insert_layer_from_svg_path_data") {
        dialog = new Dialog(
            "Insert Layer from SVG Path Data"
        );
        input = ui.textField("", [300, 50]);
    }

    dialog.addView(input);

    dialog.focus(input);

    var responseCode = dialog.run();
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
            layer.sketchObject.absoluteRect().setRulerX(midX);
            layer.sketchObject.absoluteRect().setRulerY(midY);
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
