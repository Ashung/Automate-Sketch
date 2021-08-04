var sketch = require("sketch");

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = context.document;
    var documentData = document.documentData();

    if (sketch.version.sketch < 48) {
        document.showMessage("😮 You have to update to Sketch 48+ to use thie feature.");
        return;
    }

    var unusedSymbols = getAllUnusedSymbols(context);

    if (unusedSymbols.count() == 0) {
        document.showMessage("👍 No unused symbols in current document.");
        return;
    }

    // Dialog
    var viewWidth = 350,
        rowHeight = 50;

    var dialog = new Dialog(
        "Remove Unused Symbols",
        "Check the symbol to remove it.",
        350
    );

    var scrollView = ui.scrollView([], [350, 300]);
    dialog.addView(scrollView);

    var selectAll = ui.checkBox(true, "Select / Deselect All Unused Symbols.");
    selectAll.setAllowsMixedState(true);
    dialog.addView(selectAll);

    var contentView = ui.view([viewWidth, unusedSymbols.count() * rowHeight + 10]);
    contentView.setFlipped(true);
    scrollView.setDocumentView(contentView);

    var checked = unusedSymbols.count();
    var unChecked = 0;

    var loopUnusedSymbols = unusedSymbols.objectEnumerator();
    var unusedSymbol;
    var i = 0;
    while (unusedSymbol = loopUnusedSymbols.nextObject()) {

        // List
        var itemView = ui.view([0, rowHeight * i, viewWidth, rowHeight]);
        itemView.setFlipped(true);

        // Checkbox
        var checkbox = ui.checkBox(true, "                " + unusedSymbol.name(), [10, (rowHeight - 30) / 2, viewWidth - 10, 30]);
        itemView.addSubview(checkbox);

        checkbox.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                checked --;
                unChecked ++;
            }
            if (sender.state() == NSOnState) {
                checked ++;
                unChecked --;
            }
            if (checked == unusedSymbols.count() && unChecked == 0) {
                selectAll.setState(NSOnState);
            } else if (checked == 0 && unChecked == unusedSymbols.count()) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });

        // Preview image
        var imageSize = rowHeight - 10;
        var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(35, 5, imageSize, imageSize));
        var layerAncestry = unusedSymbol.ancestry();
        var symbolPreviewImage = MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
            layerAncestry, CGSizeMake(imageSize * 2, imageSize * 2), NSColorSpace.sRGBColorSpace(), false
        );
        var backgroundImage = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("bg_alpha.png"));
        backgroundImage.setSize(CGSizeMake(backgroundImage.size().width / 2, backgroundImage.size().height / 2));
        imageView.setWantsLayer(true);
        imageView.setBackgroundColor(NSColor.colorWithPatternImage(backgroundImage));
        imageView.setImage(symbolPreviewImage);
        imageView.setFlipped(true);
        itemView.addSubview(imageView);

        // Library symbol icon
        if (unusedSymbol.isForeign()) {
            var iconViewWrapper = NSView.alloc().initWithFrame(NSMakeRect(55, 30, 16, 16));
            iconViewWrapper.setWantsLayer(true);
            var icon = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("icon_foreign_symbol.png"));
            var iconView = NSImageView.alloc().initWithFrame(NSMakeRect(-13, -15, 48, 48));
            iconView.setImage(icon);
            iconViewWrapper.addSubview(iconView);
            itemView.addSubview(iconViewWrapper);
        }

        // Divider line
        var divider = NSView.alloc().initWithFrame(NSMakeRect(0, rowHeight - 1, viewWidth, 1));
        divider.setWantsLayer(true);
        divider.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
        itemView.addSubview(divider);

        contentView.addSubview(itemView);

        i ++;
    }

    // Select / Deselect
    selectAll.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            checked = unusedSymbols.count();
            unChecked = 0;
            var unusedSymbolViews = contentView.subviews().objectEnumerator();
            var unusedSymbolView;
            while (unusedSymbolView = unusedSymbolViews.nextObject()) {
                var checkbox = unusedSymbolView.subviews().firstObject();
                checkbox.setState(NSOnState);
            }
        } else {
            checked = 0;
            unChecked = unusedSymbols.count();
            var unusedSymbolViews = contentView.subviews().objectEnumerator();
            var unusedSymbolView;
            while (unusedSymbolView = unusedSymbolViews.nextObject()) {
                var checkbox = unusedSymbolView.subviews().firstObject();
                checkbox.setState(NSOffState);
            }
        }
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var count = 0;
        var unusedSymbolViews = contentView.subviews().objectEnumerator();
        var unusedSymbolView;
        var unusedSymbolIndex = 0;
        while (unusedSymbolView = unusedSymbolViews.nextObject()) {
            var state = unusedSymbolView.subviews().firstObject().state();
            if (state) {
                var unusedSymbolsWillRemoved = unusedSymbols.objectAtIndex(unusedSymbolIndex);
                if (sketch.version.sketch >= 49) {
                    unusedSymbolsWillRemoved.removeFromParent();
                } else {
                    if (unusedSymbolsWillRemoved.isForeign()) {
                        documentData.removeForeignSymbol(unusedSymbolsWillRemoved.foreignSymbol());
                    } else {
                        unusedSymbolsWillRemoved.removeFromParent();
                    }
                }
                count ++;
            }
            unusedSymbolIndex ++;
        }

        if (count > 1) {
            document.showMessage("🎉 " + count + " unused symbols removed.");
        } else if (count == 1) {
            document.showMessage("😊 1 unused symbol removed.");
        }

    }

};

function getAllUnusedSymbols(context) {
    var document = context.document;
    var documentData = document.documentData();
    // In Sketch 49, unused Symbols imported from Libraries are now cleared when saving a document
    if (sketch.version.sketch >= 49) {
        var allSymbols = documentData.localSymbols();
    } else {
        var allSymbols = documentData.allSymbols();
    }
    var result = allSymbols.mutableCopy();

    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var symbolInstancesInPage = page.allSymbolInstancesInChildren().allObjects();
        var loopSymbolInstancesInPage = symbolInstancesInPage.objectEnumerator();
        var symbolInstance;
        while (symbolInstance = loopSymbolInstancesInPage.nextObject()) {
            result.removeObject(symbolInstance.symbolMaster());
            var overrideValues = symbolInstance.overrideValues();
            var loopOverrideValues = overrideValues.objectEnumerator();
            var overrideValue;
            while (overrideValue = loopOverrideValues.nextObject()) {
                if (overrideValue.overrideName().containsString("_symbolID")) {
                    result.removeObject(documentData.symbolWithID(overrideValue.value()));
                }
            }
        }
    }

    var sortByName = NSSortDescriptor.sortDescriptorWithKey_ascending("name", true);
    result.sortUsingDescriptors(NSArray.arrayWithObject(sortByName));

    var sortByType = NSSortDescriptor.sortDescriptorWithKey_ascending("isForeign", false);
    result.sortUsingDescriptors(NSArray.arrayWithObject(sortByType));

    return result;

}
