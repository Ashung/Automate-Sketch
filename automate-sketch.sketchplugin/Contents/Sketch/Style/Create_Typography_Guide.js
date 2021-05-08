var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var help = require("../modules/Help");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = sketch.getSelectedDocument();
    var textStyles = document.sharedTextStyles;

    if (textStyles.length == 0) {
        sketch.UI.message("No text styles in current document.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Create Typography Guide",
        "Create typography guide from document text styles. \n\nIf your want to use style name as preview text, leave the option blank."
    );

    dialog.addLabel("Choose Text Styles for Guide:");

    var styleGroups = [];
    textStyles.forEach(function(item) {
        var nameParts = item.name.split(/(\/)/);
        if (nameParts.length > 1) {
            if (!styleGroups.includes(nameParts[0])) {
                styleGroups.push(nameParts[0]);
            }
        }
    });
    styleGroups.sort();
    styleGroups.unshift("All Styles in this Document");

    var styleGroupsView = ui.popupButton(styleGroups);
    dialog.addView(styleGroupsView);

    dialog.addLabel("Preview Text:");

    var textField = ui.textField(preferences.get("previewText") || "");
    dialog.addView(textField);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var page = document.sketchObject.currentPage();

        var point;
        if (sketch.version.sketch >= 49) {
            point = page.originForNewArtboardWithSize(CGSizeMake(100,100));
        } else {
            point = page.originForNewArtboard();
        }

        var typographyPositionX = point.x,
            typographyPositionY = point.y,
            spaceBetweenTypographies = 32,
            spaceBetweenTypographyAndText = 8,
            textHeight = 16,
            textFontSize = 14,
            textColor = MSColor.colorWithRed_green_blue_alpha(153/255, 153/255, 153/255, 1),
            textFontName = "HelveticaNeue";

        var previewText = textField.stringValue();
        preferences.set("previewText", previewText);

        var typographyGroupLayers = [];

        for (var i = 0; i < textStyles.length; i++) {

            var item = textStyles[i]
            if (styleGroupsView.indexOfSelectedItem() > 0) {
                var nameParts = item.name.split(/(\/)/);
                if (nameParts[0] != styleGroupsView.titleOfSelectedItem()) {
                    continue;
                }
            }

            var textStyle = item.sketchObject;

            // Add layer group
            var typographyGroup = MSLayerGroup.alloc().init();
            typographyGroup.setName(textStyle.name());
            typographyGroup.setRect(CGRectMake(typographyPositionX, typographyPositionY, 100, 10));
            page.addLayer(typographyGroup);

            // Add typography layer
            var typography = MSTextLayer.alloc().init();
            typography.setName("preview");
            if (previewText == "") {
                typography.setStringValue(textStyle.name().replace(/^.*(\/)/i, ""));
            } else {
                typography.setStringValue(previewText);
            }
            typography.setStyle(textStyle.style());
            if (sketch.version.sketch >= 52) {
                typography.setSharedStyleID(textStyle.objectID());
            } else {
                typography.style().setSharedObjectID(textStyle.objectID());
            }
            typography.frame().setX(0);
            typography.frame().setY(0);
            typographyGroup.addLayer(typography);

            // Add text layer
            var text = MSTextLayer.alloc().init();
            text.setStringValue(textStyle.name());
            text.setLineHeight(textHeight);
            text.setFontPostscriptName(textFontName);
            text.changeTextColorTo(textColor.NSColorWithColorSpace(nil));
            text.setFontSize(textFontSize);
            text.setName("label");
            text.frame().setX(0);
            text.frame().setY(typography.frame().height() + spaceBetweenTypographyAndText);
            typographyGroup.insertLayer_beforeLayer(text, typography);

            if (sketch.version.sketch >= 53) {
                typographyGroup.fixGeometryWithOptions(1);
            } else {
                typographyGroup.resizeToFitChildrenWithOption(1);
            }
            typographyPositionY = typographyPositionY + spaceBetweenTypographies + typographyGroup.frame().height();

            typographyGroupLayers.push(typographyGroup);

        };

        help.centerMSLayers(typographyGroupLayers);

    }
};