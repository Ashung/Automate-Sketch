var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var sketch = require("sketch");
    var util = require("util");
    var document = context.document;
    var selection = context.selection;
    var documentData = document.documentData();

    var layers = util.toArray(selection).filter(function(layer) {
        return layer.class() != "MSSymbolMaster";
    });
    if (layers.length == 0) {
        document.showMessage("Please select at least 1 layer except symbol master.");
        return;
    }

    var currentPage = document.currentPage();
    var symbolPage = documentData.symbolsPage();
    var targetPage;
    if (currentPage != symbolPage) {
        var Dialog = require("../modules/Dialog").dialog;
        var ui = require("../modules/Dialog").ui;
    
        var dialog = new Dialog(
            "Create Symbols from Selected Layers"
        );

        var symbolPageName = symbolPage ? symbolPage.name() : "Symbols";
        var sendToSymbolPage = ui.checkBox(true, `Send Symbols to "${symbolPageName}" page.`);
        dialog.addView(sendToSymbolPage);

        var responseCode = dialog.run();
        if (responseCode == 1000) {
            if (sendToSymbolPage.state() == NSOnState) {
                targetPage = documentData.symbolsPageOrCreateIfNecessary();
                if (sketch.version.sketch < 54) {
                    document.pageTreeLayoutDidChange();
                }
            } else {
                targetPage = currentPage;
            }
        }
    } else {
        targetPage = symbolPage;
    }

    if (targetPage) {
        layers.forEach(function(layer) {

            var parent = layer.parentGroup();

            if (currentPage != documentData.symbolsPage()) {
                var tempLayer = MSLayer.alloc().init();
                parent.addLayer(tempLayer);
                tempLayer.moveToLayer_beforeLayer(parent, layer);
            }

            var frame = layer.frame().rect();
            var position = targetPage.originForNewArtboardWithSize(frame.size);

            var symbolMaster;
            if (layer.class() == "MSArtboardGroup") {
                symbolMaster = MSSymbolMaster.convertArtboardToSymbol(layer);
                symbolMaster.moveToLayer_beforeLayer(targetPage, nil);
            } else {
                symbolMaster = MSSymbolMaster.alloc().initWithFrame(frame);
                symbolMaster.setName(layer.name());
                layer.moveToLayer_beforeLayer(symbolMaster, nil);
                layer.frame().setX(0);
                layer.frame().setY(0);
                targetPage.addLayer(symbolMaster);
            }

            if (currentPage != documentData.symbolsPage()) {

                symbolMaster.frame().setX(position.x);
                symbolMaster.frame().setY(position.y);

                var instance = symbolMaster.newSymbolInstance();
                parent.addLayer(instance);
                instance.frame().setX(frame.origin.x);
                instance.frame().setY(frame.origin.y);
                instance.moveToLayer_beforeLayer(parent, tempLayer);

                tempLayer.removeFromParent();
            }
        });
    }
};
