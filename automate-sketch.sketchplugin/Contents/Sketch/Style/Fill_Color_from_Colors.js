var fillColorFromGlobalColors = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var globalColors;
    if (MSApplicationMetadata.metadata().appVersion >= 53) {
        globalColors = NSMutableArray.alloc().init();
        MSPersistentAssetCollection.sharedGlobalAssets().colorAssets().forEach(function(item) {
            globalColors.addObject(item.color());
        });
    } else {
        globalColors = NSApp.delegate().globalAssets().colors();
    }

    fillColorFromColors(context, globalColors, "You have no colors in Global Colors.");
};

var fillColorFromDocumentColors = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");
    var documentColors;
    if (MSApplicationMetadata.metadata().appVersion >= 53) {
        documentColors = NSMutableArray.alloc().init();
        context.document.documentData().assets().colorAssets().forEach(function(item) {
            documentColors.addObject(item.color());
        });
    } else {
        documentColors = context.document.documentData().assets().colors();
    }
    fillColorFromColors(context, documentColors, "You have no colors in Document Colors.");
};

function fillColorFromColors(context, colors, alertMessage) {
    var doc = context.document;

    var Sketch = require("../modules/Sketch");

    if (colors.count() == 0) {
        doc.showMessage(alertMessage);
        return false;
    }

    var selection = context.selection;

    if (selection.count() == 0) {
        doc.showMessage("Please select 1 Shape or Text layer.");
        return;
    }

    for (var i = 0; i < selection.count(); i++) {
        var layer = selection.objectAtIndex(i);
        if (
            Sketch.isShapeLayer(layer) ||
            layer.class() == "MSTextLayer" ||
            layer.class() == "MSBitmapLayer"
        ) {
            var index = colors.indexOfObject(getFillColor(layer));
            if (index == 9.223372036854776e+18 || index == colors.count() - 1) {
                index = 0;
            } else {
                index ++;
            }
            setFillColor(layer, colors.objectAtIndex(index));
        }
    }

    doc.reloadInspector();

}

function getFillColor(layer) {
    var Sketch = require("../modules/Sketch");
    if (Sketch.isShapeLayer(layer) || layer.class() == "MSBitmapLayer") {
        var fills = layer.style().enabledFills();
        if (fills.count() > 0) {
            if (fills.lastObject().fillType() == 0) {
                return fills.lastObject().color();
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    if (layer.class() == "MSTextLayer") {
        return layer.textColor();
    }
}

function setFillColor(layer, color) {
    var Sketch = require("../modules/Sketch");
    if (Sketch.isShapeLayer(layer) || layer.class() == "MSBitmapLayer") {
        var fills = layer.style().enabledFills();
        if (fills.count() > 0 && fills.lastObject().fillType() == 0) {
            fills.lastObject().setColor(color);
        } else {
            var fill = layer.style().addStylePartOfType(0);
            fill.setFillType(0);
            fills.lastObject().setColor(color);
        }
    }
    if (layer.class() == "MSTextLayer") {
        layer.changeTextColorTo(color.NSColorWithColorSpace(nil));
    }
}
