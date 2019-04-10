var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga(context, "Artboard");

    var pasteboard = require("../modules/Pasteboard");
    var util = require("util");
    var sketch = require("sketch");
    var Artboard = require("sketch/dom").Artboard;
    var SymbolMaster = require("sketch/dom").SymbolMaster;
    var Rectangle = require('sketch/dom').Rectangle;
    var document = sketch.getSelectedDocument();
    var page = document.selectedPage;
    var identifier = context.command.identifier();

    var layersFromPasteboard = pasteboard.layersFromPasteboard(context);
    if (!layersFromPasteboard) {
        sketch.UI.message("Pasteboard is empty.");
        return;
    }

    document.selectedLayers.clear();

    util.toArray(layersFromPasteboard).forEach(function(layer) {
        var layerSize = layer.frame().rect().size;
        var originForNewArtboard = page.sketchObject.originForNewArtboardWithSize(layerSize);
        layer.frame().setX(0);
        layer.frame().setY(0);
        var properties = {
            name: layer.name(),
            parent: page,
            frame: new Rectangle(originForNewArtboard.x, originForNewArtboard.y, layerSize.width, layerSize.height),
            layers: [sketch.fromNative(layer)],
            selected: true
        };
        var artboard;
        if (identifier == "paste_as_artboards") {
            artboard = new Artboard(properties);
        } else {
            artboard = new SymbolMaster(properties);
        }
        artboard.sketchObject.ungroupSingleChildDescendentGroups();

        // Fit artboard, when copy a SVG with stroke.
        artboard.sketchObject.resizeToFitChildren();
        artboard.sketchObject.frame().setX(originForNewArtboard.x);
        artboard.sketchObject.frame().setY(originForNewArtboard.y);

    });

    context.document.contentDrawView().centerSelectionInVisibleArea();

};