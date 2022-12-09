var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var sketch = require("sketch");
    var Style = require("sketch/dom").Style;
    var ShapePath = require("sketch/dom").ShapePath;
    var Rectangle = require("sketch/dom").Rectangle;
    var Image = require("sketch/dom").Image;
    var document = sketch.getSelectedDocument();
    var selection = document.selectedLayers;
    var selectedLayers = selection.layers;
    var identifier = __command.identifier();

    if (identifier == "bitmap_to_pattern_fill") {
        var selectedBitmapLayers = selectedLayers.filter(function(layer) {
            return layer.type == "Image";
        });
        if (selectedBitmapLayers.length == 0) {
            sketch.UI.message("Please select at least 1 bitmap layer.");
            return;
        }
        selection.clear();
        var shapes = [];
        selectedBitmapLayers.forEach(function(layer) {
            var shape = new ShapePath({
                name: layer.name,
                parent: layer.parent,
                frame: layer.frame,
                shapeType: ShapePath.ShapeType.Rectangle,
                style: {
                    fills: [
                        { 
                            fillType: Style.FillType.Pattern, 
                            pattern: {
                                patternType: Style.PatternFillType.Fill,
                                image: layer.image
                            }
                        }
                    ],
                    borders: []
                }
            });
            shapes.push(shape);
            layer.remove();
        });
        selection.layers = shapes;
    }

    if (identifier == "pattern_fill_to_bitmap") {
        var bitmaps = [];
        var removeLayers = [];

        selectedLayers.forEach(function(layer) {
            var hasPattern = false;
            layer.style.fills.forEach(function(fill) {
                if (fill.fillType == Style.FillType.Pattern) {
                    hasPattern = true;
                    bitmaps.push({
                        layer: layer,
                        image: fill.pattern.image
                    });
                }
            });
            if (hasPattern) {
                removeLayers.push(layer);
            }
        });

        if (bitmaps.length == 0) {
            sketch.UI.message("Please select at least 1 layer with pattern fill.");
            return;
        }

        bitmaps.forEach(function(bitmap) {
            new Image({
                name: bitmap.layer.name,
                frame: new Rectangle(bitmap.layer.frame.x, bitmap.layer.frame.y, bitmap.image.size.width / 2, bitmap.image.size.height / 2),
                image: bitmap.image,
                parent: bitmap.layer.parent
            });
        });

        removeLayers.forEach(function(layer) {
            layer.remove();
        });
    }

}