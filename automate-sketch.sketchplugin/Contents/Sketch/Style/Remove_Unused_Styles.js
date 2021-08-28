var sketch = require("sketch");
var document = sketch.getSelectedDocument()
var page = document.selectedPage;

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var document = context.document;
    var documentData = document.documentData();

    if (context.command.identifier() == "remove_unused_layer_styles") {

        if (documentData.layerStyles().numberOfSharedStyles() == 0) {
            document.showMessage("Document has no layer styles.");
            return;
        }

        createDialog(context, 0);

    }

    if (context.command.identifier() == "remove_unused_text_styles") {

        if (documentData.layerTextStyles().numberOfSharedStyles() == 0) {
            document.showMessage("Document has no text styles.");
            return;
        }

        createDialog(context, 1);

    }

};

function createDialog(context, type) {

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    var documentData = document.documentData();
    var styles = (type == 0) ? documentData.layerStyles() : documentData.layerTextStyles();
    var stylesCopy = styles.objectsSortedByName().mutableCopy();

    var loopPages = document.pages().objectEnumerator();
    var page;
    while (page = loopPages.nextObject()) {
        var predicate;
        if (type == 0) {
            if (sketch.version.sketch >= 52) {
                predicate = NSPredicate.predicateWithFormat('className != "MSTextLayer" && sharedStyle.objectID != nil');
            } else {
                predicate = NSPredicate.predicateWithFormat('className != "MSTextLayer" && style.sharedObjectID != nil')
            }
        }
        if (type == 1) {
            if (sketch.version.sketch >= 52) {
                predicate = NSPredicate.predicateWithFormat('className == "MSTextLayer" && sharedStyle.objectID != nil');
            } else {
                predicate = NSPredicate.predicateWithFormat('className == "MSTextLayer" && style.sharedObjectID != nil')
            }
        }
        var layers = page.children().filteredArrayUsingPredicate(predicate);
        var loopLayers = layers.objectEnumerator();
        var layer;
        while (layer = loopLayers.nextObject()) {
            var style;
            if (sketch.version.sketch >= 52) {
                style = styles.sharedObjectWithID(layer.sharedStyleID());
            } else {
                style = styles.sharedObjectWithID(layer.style().sharedObjectID());
            }
            stylesCopy.removeObject(style);
        }

        // Style in override
        var predicateSymbolInstance = NSPredicate.predicateWithFormat('className == "MSSymbolInstance"');
        var symbolInstances = page.children().filteredArrayUsingPredicate(predicateSymbolInstance);
        var loopInstances = symbolInstances.objectEnumerator();
        var instance;
        while (instance = loopInstances.nextObject()) {
            MSAvailableOverride.flattenAvailableOverrides(instance.availableOverrides()).forEach(function(override) {
                if (override.overridePoint().isStyleOverride()) {
                    var style = styles.sharedObjectWithID(override.currentValue());
                    stylesCopy.removeObject(style);
                }
            });
        }

    }

    if (stylesCopy.count() == 0) {
        document.showMessage("👍 Document has no unused " + ((type == 0) ? "layer" : "text") + " styles.");
        return;
    }

    // Dialog
    var title = (type == 0) ? "Remove Unused Layer Styles" : "Remove Unused Text Styles";
    var dialog = new Dialog(
        title,
        "You can remove unused styles from list, deselect styles to keep them."
    );

    var selectAllView = ui.checkBox(true, "Select / Deselect All.");
    selectAllView.setAllowsMixedState(true);
    dialog.addView(selectAllView);

    var scrollView = ui.scrollView([], 300);
    dialog.addView(scrollView);

    var checked = stylesCopy.count();
    var unChecked = 0;

    if (type == 0) {
        var contentView = createDataView(stylesCopy, 0, selectAllView, [checked, unChecked]);
    }
    if (type == 1) {
        var contentView = createDataView(stylesCopy, 1, selectAllView, [checked, unChecked]);
    }
    scrollView.setDocumentView(contentView);

    // Select / Deselect
    selectAllView.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            checked = stylesCopy.count();
            unChecked = 0;
            var styleItemViews = contentView.subviews().objectEnumerator();
            var styleItemView;
            while (styleItemView = styleItemViews.nextObject()) {
                var checkbox = styleItemView.subviews().firstObject();
                checkbox.setState(NSOnState);
            }
        } else {
            checked = 0;
            unChecked = stylesCopy.count();
            var styleItemViews = contentView.subviews().objectEnumerator();
            var styleItemView;
            while (styleItemView = styleItemViews.nextObject()) {
                var checkbox = styleItemView.subviews().firstObject();
                checkbox.setState(NSOffState);
            }
        }
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var subViews = contentView.subviews();
        var loopSubViews = subViews.objectEnumerator();
        var view;
        var count = 0;
        while (view = loopSubViews.nextObject()) {
            var index = subViews.indexOfObject(view);
            var checkbox = view.subviews().firstObject();
            if (checkbox.state()) {
                styles.removeSharedObject(stylesCopy.objectAtIndex(index));
                count ++;
            }
        }

        var message;
        if (count > 1) {
            message = "🎉 " + count + ((type == 0) ? " layer" : " text") + " styles removed.";
        } else if (count == 1) {
            message = "😊 1 " + ((type == 0) ? " layer" : " text") + " style removed.";
        }
        document.showMessage(message);

    }

};

function createDataView(items, type, selectAll, checkedStatus) {

    var itemHeight = 40;

    var itemsCount = items.count();
    var contentView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, (itemsCount + 0.5) * itemHeight));
    contentView.setFlipped(true);

    var loopItems = items.objectEnumerator();
    var item;
    while (item = loopItems.nextObject()) {

        var index = items.indexOfObject(item);
        var itemView = NSView.alloc().initWithFrame(NSMakeRect(0, itemHeight * index, 300, itemHeight));
        itemView.setFlipped(true);

        // Title
        var checkbox = NSButton.alloc().initWithFrame(NSMakeRect(10, 0, 300, itemHeight));
        checkbox.setButtonType(NSSwitchButton);
        checkbox.setState(NSOnState);
        itemView.addSubview(checkbox);

        if (type == 0) {
            checkbox.setTitle("         " + item.name());

            // Preview image
            var layerStyleTempLayer = MSArtboardGroup.alloc().init();
            layerStyleTempLayer.frame().setWidth(24);
            layerStyleTempLayer.frame().setHeight(24);
            var rectangle = MSRectangleShape.alloc().init();
            rectangle.setRect(CGRectMake(2, 2, 20, 20));
            rectangle.setStyle(item.style());
          
            layerStyleTempLayer.addLayer(rectangle);
            page.sketchObject.addLayer(layerStyleTempLayer);

            var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(32, 8, 24, 24));
            var layerAncestry = layerStyleTempLayer.ancestry();
            var previewImage = MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
                layerAncestry, CGSizeMake(48, 48), NSColorSpace.sRGBColorSpace(), false
            );

            imageView.setImage(previewImage);
            itemView.addSubview(imageView);

            layerStyleTempLayer.removeFromParent();
        }

        if (type == 1) {
            checkbox.setTitle("");

            // Preview image
            var textStyleTempLayer = MSTextLayer.alloc().init();
            textStyleTempLayer.setStringValue(item.name());
            textStyleTempLayer.setStyle(item.style());
            var textLayerWidth = textStyleTempLayer.frame().width();
            var textLayerHeight = textStyleTempLayer.frame().height();
            var textStyleTempArtboard = MSArtboardGroup.alloc().init();
            textStyleTempArtboard.frame().setWidth(textLayerWidth);
            textStyleTempArtboard.frame().setHeight(textLayerHeight);
            textStyleTempLayer.moveToLayer_beforeLayer(textStyleTempArtboard, nil);

            page.sketchObject.addLayer(textStyleTempArtboard);
            var layerAncestry = textStyleTempArtboard.ancestry();
            var previewImage = MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
                layerAncestry, CGSizeMake(textLayerWidth * 2, textLayerHeight * 2), NSColorSpace.sRGBColorSpace(), false
            );
            if (textLayerWidth <= 260 || textLayerHeight <= itemHeight) {
                var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(35, (itemHeight - textLayerHeight)/2, textLayerWidth, textLayerHeight));
            } else {
                var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(35, 0, 260, itemHeight));
            }
            imageView.setImage(previewImage);
            imageView.setWantsLayer(true);

            // Add gray background color
            var textColor = MSColor.alloc().initWithImmutableObject(textStyleTempLayer.textColor());
            if (textColor.fuzzyIsEqualExcludingAlpha(MSColor.whiteColor())) {
                imageView.setBackgroundColor(NSColor.grayColor());
            } else {
                imageView.setBackgroundColor(NSColor.whiteColor());
            }

            itemView.addSubview(imageView);

            textStyleTempArtboard.removeFromParent();
        }

        checkbox.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                checkedStatus[0] --;
                checkedStatus[1] ++;
            }
            if (sender.state() == NSOnState) {
                checkedStatus[0] ++;
                checkedStatus[1] --;
            }
            if (checkedStatus[0] == itemsCount && checkedStatus[1] == 0) {
                selectAll.setState(NSOnState);
            } else if (checkedStatus[0] == 0 && checkedStatus[1] == itemsCount) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });

        var divider = NSView.alloc().initWithFrame(NSMakeRect(0, itemHeight - 1, 300, 1));
        divider.setWantsLayer(1);
        divider.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
        itemView.addSubview(divider);

        contentView.addSubview(itemView);
    }

    return contentView;
}
