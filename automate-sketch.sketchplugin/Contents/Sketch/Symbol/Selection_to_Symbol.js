var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var selection = context.selection;
    var version = sketch.version.sketch;

    var loopSelection = selection.objectEnumerator();
    var layer;
    while (layer = loopSelection.nextObject()) {

        var symbolProperties = {
            x: layer.frame().x(),
            y: layer.frame().y(),
            width: layer.frame().width(),
            height: layer.frame().height()
        };
        var layers;
        if (version >= 84) {
            layers = [layer];
        } else {
            layers = MSLayerArray.arrayWithLayers([layer]);
        }
        if (layer.class() == "MSArtboardGroup") {
            symbolProperties.hasBackgroundColor = layer.hasBackgroundColor();
            symbolProperties.backgroundColor = layer.backgroundColor();
            symbolProperties.includeInExport = layer.includeBackgroundColorInExport();
            symbolProperties.adjustContentOnResize = layer.resizesContent();

            // Add a temp layer
            var rectangle = MSRectangleShape.alloc().init();
            rectangle.setRect(CGRectMake(0, 0, symbolProperties.width, symbolProperties.height));
            var tempLayer;
            if (sketch.version.sketch >= 52) {
                tempLayer = rectangle;
            } else {
                tempLayer = MSShapeGroup.shapeWithPath(rectangle);
            }
            layer.addLayer(tempLayer);

            if (version >= 84) {
                layers = layer.layers();
            } else {
                layers = MSLayerArray.arrayWithLayers(layer.layers());
            }
            layer.ungroup();
        }

        if (MSSymbolCreator.canCreateSymbolFromLayers(layers)) {
            var symbolName = layer.name();
            var symbolInstance = MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(layers, symbolName, false);
            var symbolMaster = symbolInstance.symbolMaster();

            if (layer.class() == "MSLayerGroup") {
                var layerGroup = symbolMaster.layers().firstObject();
                if (layerGroup.class() == "MSLayerGroup") {
                    layerGroup.ungroup();
                }
            }

            if (layer.class() == "MSArtboardGroup") {
                symbolMaster.layers().lastObject().removeFromParent();
                symbolMaster.setHasBackgroundColor(symbolProperties.hasBackgroundColor);
                symbolMaster.setBackgroundColor(symbolProperties.backgroundColor);
                symbolMaster.setIncludeBackgroundColorInExport(symbolProperties.includeInExport);
                symbolMaster.setResizesContent(symbolProperties.adjustContentOnResize);
                symbolMaster.setIncludeBackgroundColorInInstance(true);
            }

            symbolMaster.setRect(CGRectMake(symbolProperties.x, symbolProperties.y, symbolProperties.width, symbolProperties.height));
            symbolMaster.setLayerListExpandedType(1);
            symbolInstance.removeFromParent();
        }

    }

};
