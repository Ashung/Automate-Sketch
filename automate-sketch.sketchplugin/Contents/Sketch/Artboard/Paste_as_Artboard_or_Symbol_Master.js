var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var pasteboard = require("../modules/Pasteboard");
    var zoom = require("../modules/Zoom");

    var util = require("util");
    var sketch = require("sketch/dom");
    var message = require("sketch/ui").message;
    var Artboard = sketch.Artboard;
    var SymbolMaster = sketch.SymbolMaster;
    var Rectangle = sketch.Rectangle;
    var document = sketch.getSelectedDocument();
    var page = document.selectedPage;
    var identifier = __command.identifier();

    var layersFromPasteboard = pasteboard.getLayers(context);
    if (!layersFromPasteboard) {
        message("Pasteboard is empty.");
        return;
    }

    document.selectedLayers.clear();

    util.toArray(layersFromPasteboard).forEach(function(layer) {
        var layerInfluenceRect = layer.absoluteInfluenceRect();
        var layerRect = layer.rect();
        var originForNewArtboard = page.sketchObject.originForNewArtboardWithSize(layerInfluenceRect.size);
        layer.frame().setX(Math.round(layerRect.origin.x) - layerInfluenceRect.origin.x);
        layer.frame().setY(Math.round(layerRect.origin.y) - layerInfluenceRect.origin.y);
        var properties = {
            name: layer.name(),
            parent: page,
            frame: new Rectangle(
                originForNewArtboard.x,
                originForNewArtboard.y,
                layerInfluenceRect.size.width,
                layerInfluenceRect.size.height
            ),
            selected: true
        };
        if (layer.className() == "MSArtboardGroup" || layer.className() == "MSSymbolMaster") {
            properties.layers = util.toArray(layer.layers()).map(function(item) {
                return sketch.fromNative(item);
            })
        } else {
            properties.layers = [sketch.fromNative(layer)];
        }
        var artboard;
        if (identifier == "paste_as_artboards") {
            artboard = new Artboard(properties);
        } else {
            artboard = new SymbolMaster(properties);
        }
        artboard.sketchObject.ungroupSingleChildDescendentGroups();
    });

    zoom.toSelection();

};