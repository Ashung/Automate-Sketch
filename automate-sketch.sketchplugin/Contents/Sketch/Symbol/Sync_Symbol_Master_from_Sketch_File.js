var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var document = context.document;
    var documentData = document.documentData();

    // Choose the new sketch file.
    var chooseFile = system.chooseFile(["sketch"]);

    if (!chooseFile) {
        return;
    }

    // Read data from the new sketch file.
    var fileURL = NSURL.fileURLWithPath(chooseFile);
    var error = MOPointer.alloc().init();
    var newDocument = MSDocument.alloc().init();
        newDocument.readFromURL_ofType_error(fileURL, "com.bohemiancoding.sketch.drawing", error);
    if (error.value() != null) {
        document.showMessage("Can't open Sketch file. Error: " + error.value());
        return;
    }

    var newDocumentData = newDocument.documentData();
    var newDocumentSymbols = newDocumentData.localSymbols();
    if (newDocumentSymbols.count() == 0) {
        document.showMessage('No symbol masters in "' + chooseFile.URL().path() + '".');
        return;
    }

    // Filter symbols have changed
    var differentSymbols = NSMutableArray.alloc().init();
    newDocumentSymbols.forEach(function(symbol) {
        var originalSymbol = documentData.symbolWithID(symbol.symbolID());
        if (!originalSymbol) {
            differentSymbols.addObject(symbol);
        } else {
            if (!diffSymbols(symbol, originalSymbol)) {
                differentSymbols.addObject(symbol);
            }
        }
    });
    if (differentSymbols.count() == 0) {
        document.showMessage('Symbol masters are the same. No need to update.');
        return;
    }

    // Dialog
    var viewWidth = 400;
    var rowHeight = 200;

    var dialog = new Dialog(
        "Sync Symbol Master from Sketch File",
        "Replace symbol masters from file based on symbolID, and import new symbol masters.",
        viewWidth
    );

    var selectedSymbolCount = differentSymbols.count();

    var selectAll = ui.checkBox(true, "Select / Deselect all symbol masters.");
    selectAll.setAllowsMixedState(true);
    dialog.addView(selectAll);

    var scrollView = ui.scrollView([], [viewWidth, 370]);
    dialog.addView(scrollView);

    var contentView = ui.view([0, 0, viewWidth, differentSymbols.count() * rowHeight]);
    scrollView.setDocumentView(contentView);

    // Symbol list
    differentSymbols.forEach(function(symbol, i) {

        // List
        var itemView = ui.view([0, rowHeight * i, viewWidth, rowHeight]);

        // Checkbox
        var originalSymbol = documentData.symbolWithID(symbol.symbolID());
        var originalSymbolName = originalSymbol ? originalSymbol.name() : "";
        var newSymbolName = symbol.name();
        var title = newSymbolName;
        if (originalSymbol && String(originalSymbolName) != String(newSymbolName)) {
            title = originalSymbolName + " ➝ " + newSymbolName;
        }
        var checkbox = ui.checkBox(true, title, [10, 10, viewWidth - 20, 20]);
        itemView.addSubview(checkbox);

        checkbox.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                selectedSymbolCount --;
            }
            if (sender.state() == NSOnState) {
                selectedSymbolCount ++;
            }
            if (selectedSymbolCount == differentSymbols.count()) {
                selectAll.setState(NSOnState);
            } else if (selectedSymbolCount == 0) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });

        // Preview image
        var imageWidth = 180;
        var imageHeight = 150;
        if (originalSymbol) {
            var originalSymbolView = symbolThumbView(context, originalSymbol, 10, 40, imageWidth, imageHeight, "OLD");
            var newSymbolView = symbolThumbView(context, symbol, 200, 40, imageWidth, imageHeight, "NEW");
            itemView.addSubview(originalSymbolView);
        } else {
            var newSymbolView = symbolThumbView(context, symbol, 10, 40, imageWidth, imageHeight, "NEW");
        }
        itemView.addSubview(newSymbolView);

        // Divider line
        if (i < differentSymbols.count() - 1) {
            var divider = NSView.alloc().initWithFrame(NSMakeRect(0, rowHeight - 1, viewWidth, 1));
            divider.setWantsLayer(true);
            divider.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
            itemView.addSubview(divider);
        }

        contentView.addSubview(itemView);

    });

    // Select and deselect
    selectAll.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            selectedSymbolCount = differentSymbols.count();
            contentView.subviews().forEach(function(view) {
                view.subviews().firstObject().setState(NSOnState);
            });
        } else {
            selectedSymbolCount = 0;
            contentView.subviews().forEach(function(view) {
                view.subviews().firstObject().setState(NSOffState);
            });
        }
    });

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var newSymbolMastersWillAddToDocument = NSMutableArray.alloc().init();
        contentView.subviews().forEach(function(view, i) {
            var state = view.subviews().firstObject().state();
            if (state == NSOnState) {
                newSymbolMastersWillAddToDocument.addObject(differentSymbols.objectAtIndex(i));

                // Nested Symbol in new sketch file
                iterateNestedSymbols(differentSymbols.objectAtIndex(i));
                function iterateNestedSymbols(_symbolmaster) {
                    _symbolmaster.allSymbolInstancesInChildren().allObjects().forEach(function(symbolInstance) {
                        var nestedSymbolMaster = symbolInstance.symbolMaster();
                        if (
                            !newSymbolMastersWillAddToDocument.containsObject(nestedSymbolMaster) &&
                            differentSymbols.containsObject(nestedSymbolMaster)
                        ) {
                            newSymbolMastersWillAddToDocument.addObject(nestedSymbolMaster);
                        }
                        iterateNestedSymbols(nestedSymbolMaster);
                    });
                }

            }
        });


        newSymbolMastersWillAddToDocument.forEach(function(symbolMaster) {
            symbolMaster.setLayerListExpandedType(1);
            var originalSymbol = documentData.symbolWithID(symbolMaster.symbolID());
            if (originalSymbol) {
                var page = originalSymbol.parentPage();
                symbolMaster.frame().setX(originalSymbol.frame().x());
                symbolMaster.frame().setY(originalSymbol.frame().y());
                page.insertLayer_beforeLayer(symbolMaster, originalSymbol);
                originalSymbol.removeFromParent();
            } else {
                var page = documentData.layerWithID(symbolMaster.parentPage().objectID());
                if (!page || page.class() != "MSPage") {
                    page = documentData.symbolsPageOrCreateIfNecessary();
                }
                var origin = page.originForNewArtboardWithSize(symbolMaster.rect().size);
                symbolMaster.frame().setX(origin.x);
                symbolMaster.frame().setY(origin.y);
                page.addLayer(symbolMaster);
            }
        });

        // document.loadLayerListPanel();

        document.showMessage("Updated " + newSymbolMastersWillAddToDocument.count() + " symbol masters.");

    }

};

function symbolThumbView(context, symbol, x, y, imageWidth, imageHeight, label) {
    var imageViewWrap = NSView.alloc().initWithFrame(NSMakeRect(x, y, imageWidth, imageHeight));
    var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(0, 0, imageWidth, imageHeight));
    var layerAncestry = symbol.ancestry();
    var symbolPreviewImage = MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
        layerAncestry, CGSizeMake(imageWidth * 2, imageHeight * 2), NSColorSpace.sRGBColorSpace(), false
    );

    var backgroundImage = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("bg_alpha.png"));
    imageView.setWantsLayer(true);
    imageView.setBackgroundColor(NSColor.colorWithPatternImage(backgroundImage));
    imageView.setImage(symbolPreviewImage);

    var textLableView = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 20, 20));
    textLableView.setFont(NSFont.boldSystemFontOfSize(10));
    textLableView.setTextColor(NSColor.whiteColor());
    textLableView.setStringValue(label);
    textLableView.setBezeled(false);
    textLableView.setWantsLayer(true);
    textLableView.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0, 0.6, 0, 1));
    if (label == "OLD") {
        textLableView.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(0.9, 0, 0, 1));
    }
    textLableView.setEditable(false);
    textLableView.sizeToFit();

    imageViewWrap.addSubview(imageView);
    imageViewWrap.addSubview(textLableView);
    return imageViewWrap;
}

function diffSymbols(symbol1, symbol2) {
    if (symbol1.layers().count() == symbol2.layers().count()) {
        var diff = [];
        symbol1.layers().forEach(function(layer, index) {
            diff.push(layer.propertiesAreEqual_forPurpose(symbol2.layers().objectAtIndex(index), 1));
        });
        return diff.every(function(item) {
            return item == true;
        });
    } else {
        return false;
    }
}