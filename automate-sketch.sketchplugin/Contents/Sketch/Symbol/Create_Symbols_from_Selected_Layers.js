var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    var selection = context.selection;
    var documentData = document.documentData();

    if (selection.count() == 0) {
        document.showMessage("Please select a layer.");
        return;
    }

    var layers = NSMutableArray.alloc().init();;
    selection.forEach(function(layer) {
        if (
            layer.class() != "MSArtboardGroup" &&
            layer.class() != "MSSymbolMaster"
        ) {
            layers.addObject(layer);
        }
    });

    if (layers.count() == 0) {
        document.showMessage("Selected layer must not be an artboard or symbol master.");
        return;
    }

    var currentPage = document.currentPage();
    var symbolPage = documentData.symbolsPage();
    var targetPage;
    if (currentPage != symbolPage) {
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
                if (MSApplicationMetadata.metadata().appVersion < 54) {
                    document.pageTreeLayoutDidChange();
                }
            }
            else {
                targetPage = currentPage;
            }
        }
    }
    else {
        targetPage = symbolPage;
    }

    if (targetPage) {
        layers.forEach(function(layer) {
            var parent = layer.parentGroup();

            var tmplayer = MSLayer.alloc().init();
            parent.addLayer(tmplayer);
            tmplayer.moveToLayer_beforeLayer(parent, layer);

            var frame = layer.frame().rect();
            var symbolmaster = MSSymbolMaster.alloc().initWithFrame(frame);
            symbolmaster.setName(layer.name());
            layer.moveToLayer_beforeLayer(symbolmaster, nil);
            layer.frame().setX(0);
            layer.frame().setY(0);
            var position = targetPage.originForNewArtboardWithSize(frame.size);
            targetPage.addLayer(symbolmaster);
            symbolmaster.frame().setX(position.x);
            symbolmaster.frame().setY(position.y);

            var instance = symbolmaster.newSymbolInstance();
            parent.addLayer(instance);
            instance.frame().setX(frame.origin.x);
            instance.frame().setY(frame.origin.y);
            instance.moveToLayer_beforeLayer(parent, tmplayer);

            tmplayer.removeFromParent();
        });
    }

};
