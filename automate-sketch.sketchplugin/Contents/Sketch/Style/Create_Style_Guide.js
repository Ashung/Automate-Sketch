var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var help = require("../modules/Help");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = sketch.getSelectedDocument();
    var styles = document.sharedLayerStyles;
    var page = document.selectedPage.sketchObject;

    if (styles.length == 0) {
        sketch.UI.message("Document has no layer styles.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Create Style Guide",
        "Create style guide from layer style in document. Input the format for Palette Size like \"100\" or \"100x50\"."
    );

    var label = ui.textLabel("Palette Size");
    dialog.addView(label);
    var defaultPaletteSize = preferences.get("paletteSize") || "100x100"
    var paletteSize = ui.textField(defaultPaletteSize);
    dialog.addView(paletteSize);

    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var palettePositionX,
            palettePositionY,
            paletteWidth,
            paletteHeight,
            point,
            spaceBetweenPalettes = 24,
            spaceBetweenPaletteAndText = 8,
            textHeight = 16,
            textFontSize = 14,
            textColor = MSColor.colorWithRed_green_blue_alpha(51/255, 51/255, 51/255, 1),
            textFontName = "Monaco";

        var userInputString = paletteSize.stringValue();
        if (/^\d+$/.test(userInputString)) {
            paletteWidth = paletteHeight = parseInt(userInputString);
        }
        if (/^\d+x\d+$/i.test(userInputString)) {
            paletteWidth = parseInt(/(\d+)/.exec(userInputString)[1]);
            paletteHeight = parseInt(/x(\d+)/i.exec(userInputString)[1]);
        }
        preferences.set("paletteSize", userInputString.toString());

        if (sketch.version.sketch >= 49) {
            point = page.originForNewArtboardWithSize(CGSizeMake(paletteWidth, paletteHeight));
        } else {
            point = page.originForNewArtboard();
        }
        palettePositionX = point.x;
        palettePositionY = point.y;

        var paletteGroupLayers = [];

        styles.forEach(function(item) {
            var style = item.sketchObject;

            // Add layer group
            var paletteGroup = MSLayerGroup.alloc().init();
            paletteGroup.setName(style.name());
            paletteGroup.setRect(CGRectMake(palettePositionX, palettePositionY, paletteWidth, paletteHeight + spaceBetweenPaletteAndText + textHeight));
            page.addLayer(paletteGroup);

            palettePositionX = palettePositionX + paletteWidth + spaceBetweenPalettes;

            // Add palette layer
            var rectangle = MSRectangleShape.alloc().init();
            rectangle.setRect(CGRectMake(0, 0, paletteWidth, paletteHeight));
            var palette;
            if (sketch.version.sketch >= 52) {
                palette = rectangle;
            } else {
                palette = MSShapeGroup.shapeWithPath(rectangle);
            }
            palette.setStyle(style.style());
            if (sketch.version.sketch >= 52) {
                palette.setSharedStyleID(style.objectID());
            } else {
                palette.style().setSharedObjectID(style.objectID());
            }
            palette.setName("palette");
            paletteGroup.addLayer(palette);

            // Add text layer
            var text = MSTextLayer.alloc().init();
            text.setRect(CGRectMake(0, paletteHeight + spaceBetweenPaletteAndText, paletteWidth, textHeight));
            text.setStringValue(style.name());
            text.setLineHeight(textHeight);
            text.setFontPostscriptName(textFontName);
            text.changeTextColorTo(textColor.NSColorWithColorSpace(nil));
            text.setFontSize(textFontSize);
            text.setName("label");
            paletteGroup.insertLayer_beforeLayer(text, palette);

            paletteGroupLayers.push(paletteGroup);

        });

        help.centerMSLayers(paletteGroupLayers);

    }

};
