var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var appVersion = sketch.version.sketch;
    var preferences = require("../modules/Preferences");
    var help = require("../modules/Help");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = context.document;

    var documentColors;
    if (appVersion >= 69) {
        documentColors = document.documentData().sharedSwatches().swatches();
    } else if (appVersion >= 53) {
        documentColors = document.documentData().assets().colorAssets();
    } else {
        documentColors = document.documentData().assets().colors();
    }
    if (documentColors.count() == 0) {
        document.showMessage("No document colors in current document.");
        return;
    }

    var colorFormats = [
        "HEX, #FFFFFF (alpha:100%)",
        "HEX 8, #FFFFFFFF",
        "RGB, r:255 g:255 b:255 (a:100%)",
        "CSS RGB, rgb(255, 255, 255)",
        "CSS RGBA, rgba(255, 255, 255, 1)",
        "CSS HSL, hsl(360, 100%, 100%)",
        "CSS HSLA, hsla(360, 100%, 100%, 1)",
        "Android, #AARRGGBB",
        "iOS/macOS, red:1 green:1 blue:1 alpha:1"
    ];

    // Dialog
    var dialog = new Dialog(
        "Create Color Guide",
        "Create color guide from document colors."
    );

    dialog.addLabel("Palette Size:");

    var textField = ui.textField(preferences.get("paletteSize") || "");
    textField.setPlaceholderString("Input the format like \"100\" or \"100x50\"");
    dialog.addView(textField);

    dialog.addLabel("Color Format:");

    var selectBox = ui.popupButton(colorFormats);
    selectBox.selectItemAtIndex(parseInt(preferences.get("colorFormat")) || 0);
    dialog.addView(selectBox);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var page = document.currentPage();

        var point;
        if (appVersion >= 49) {
            point = page.originForNewArtboardWithSize(CGSizeMake(100,100));
        } else {
            point = page.originForNewArtboard();
        }

        var palettePositionX = point.x,
            palettePositionY = point.y,
            paletteWidth = 200,
            paletteHeight = 100,
            spaceBetweenPalettes = 24,
            spaceBetweenPaletteAndText = 8,
            textHeight = 16,
            textFontSize = 14,
            textColor = MSColor.colorWithRed_green_blue_alpha(51/255, 51/255, 51/255, 1),
            textFontName = "Monaco";

        var userInputString = textField.stringValue();
        if (/^\d+$/.test(userInputString)) {
            paletteWidth = paletteHeight = parseInt(userInputString);
        }
        if (/^\d+x\d+$/i.test(userInputString)) {
            paletteWidth = parseInt(/(\d+)/.exec(userInputString)[1]);
            paletteHeight = parseInt(/x(\d+)/i.exec(userInputString)[1]);
        }
        preferences.set("paletteSize", userInputString.toString());

        var colorFormatIndex = selectBox.indexOfSelectedItem();
        preferences.set("colorFormat", colorFormatIndex);

        var paletteGroupLayers = [];

        var loopDocumentColors = documentColors.objectEnumerator();
        var color;
        while (color = loopDocumentColors.nextObject()) {

            var mscolor;
            if (color.class() == "MSSwatch") {
                mscolor = color.color();
            } else if (color.class() == "MSColorAsset") {
                mscolor = color.color();
            } else {
                mscolor = color;
            }

            // Add layer group
            var colorName = color.name() || MSColorToHEX(color);
            var paletteGroup = MSLayerGroup.alloc().init();
            paletteGroup.setName(colorName);
            paletteGroup.setRect(CGRectMake(palettePositionX, palettePositionY, paletteWidth, paletteHeight));
            page.addLayer(paletteGroup);

            palettePositionX = palettePositionX + paletteWidth + spaceBetweenPalettes;

            // Add palette layer
            var rectangle = MSRectangleShape.alloc().init();
            rectangle.setRect(CGRectMake(0, 0, paletteWidth, paletteHeight));
            var palette;
            if (appVersion >= 52) {
                palette = rectangle;
            } else {
                palette = MSShapeGroup.shapeWithPath(rectangle);
            }
            palette.style().addStylePartOfType(0);
            palette.style().fills().firstObject().setColor(mscolor);
            if (color.class() == "MSSwatch") {
                palette.style().fills().firstObject().setColor(color.makeReferencingColor());
            }
            palette.setName(colorName);
            paletteGroup.addLayer(palette);

            // Add name layer
            var name = MSTextLayer.alloc().init();
            name.setRect(CGRectMake(0, paletteHeight + spaceBetweenPaletteAndText, paletteWidth, textHeight));
            name.setStringValue(colorName);
            name.setLineHeight(textHeight);
            name.setFontPostscriptName(textFontName);
            name.changeTextColorTo(textColor.NSColorWithColorSpace(nil));
            name.setFontSize(textFontSize);
            name.setName("name");
            paletteGroup.insertLayer_beforeLayer(name, palette);

            // Add label layer
            var text = MSTextLayer.alloc().init();
            text.setRect(CGRectMake(0, paletteHeight + textHeight + spaceBetweenPaletteAndText * 2, paletteWidth, textHeight));
            var stringValue;
            switch (colorFormatIndex) {
                case 0:
                    stringValue = MSColorToHEX(mscolor);
                    break;
                case 1:
                    stringValue = MSColorToHEX8(mscolor);
                    break;
                case 2:
                    stringValue = MSColorToRGB(mscolor);
                    break;
                case 3:
                    stringValue = MSColorToCSSRGB(mscolor);
                    break;
                case 4:
                    stringValue = MSColorToCSSRGBA(mscolor);
                    break;
                case 5:
                    stringValue = MSColorToCSSHSL(mscolor);
                    break;
                case 6:
                    stringValue = MSColorToCSSHSLA(mscolor);
                    break;
                case 7:
                    stringValue = MSColorToAndroid(mscolor);
                    break;
                case 8:
                    stringValue = MSColorToNSColor(mscolor);
                    break;
                default:
                    stringValue = MSColorToHEX(mscolor);
            }
            text.setStringValue(stringValue);
            text.setLineHeight(textHeight);
            text.setFontPostscriptName(textFontName);
            text.changeTextColorTo(textColor.NSColorWithColorSpace(nil));
            text.setFontSize(textFontSize);
            text.setName("label");
            paletteGroup.insertLayer_beforeLayer(text, palette);

            if (appVersion >= 53) {
                paletteGroup.fixGeometryWithOptions(1);
            } else {
                paletteGroup.resizeToFitChildrenWithOption(1);
            }

            paletteGroupLayers.push(paletteGroup);

        }

        help.centerMSLayers(paletteGroupLayers);

    }

};

function MSColorToHEX(mscolor) {
    var alpha = mscolor.alpha() < 1 ? " (alpha:" + Math.round(mscolor.alpha() * 100) + "%)" : "";
    return "#" + mscolor.immutableModelObject().hexValue() + alpha;
}

function MSColorToHEX8(mscolor) {
    return "#" + mscolor.immutableModelObject().hexValue() + Math.round(mscolor.alpha() * 255).toString(16).toUpperCase();
}

function MSColorToRGB(mscolor) {
    var alpha = mscolor.alpha() < 1 ? " a:" + Math.round(mscolor.alpha() * 100) + "%" : "";
    return "r:" + Math.round(mscolor.red() * 255) + " " +
        "g:" + Math.round(mscolor.green() * 255) + " " +
        "b:" + Math.round(mscolor.blue() * 255) +
        alpha;
}

function MSColorToCSSRGB(mscolor) {
    return "rgb(" + Math.round(mscolor.red() * 255) + ", " +
        Math.round(mscolor.green() * 255) + ", " +
        Math.round(mscolor.blue() * 255) + ")";
}

function MSColorToCSSRGBA(mscolor) {
    var alpha = Math.floor(mscolor.alpha()) < mscolor.alpha() ? mscolor.alpha().toFixed(2) : Math.round(mscolor.alpha());
    return "rgba(" + Math.round(mscolor.red() * 255) + ", " +
        Math.round(mscolor.green() * 255) + ", " +
        Math.round(mscolor.blue() * 255) + ", " +
        alpha + ")";
}

function MSColorToCSSHSL(mscolor) {
    var hsl = RGBToHSL(mscolor.red(), mscolor.green(), mscolor.blue());
    return "hsl(" + hsl["0"] + ", " +
        hsl["1"] + "%, " +
        hsl["2"] + "%)";
}

function MSColorToCSSHSLA(mscolor) {
    var hsl = RGBToHSL(mscolor.red(), mscolor.green(), mscolor.blue());
    var alpha = Math.floor(mscolor.alpha()) < mscolor.alpha() ? mscolor.alpha().toFixed(2) : Math.round(mscolor.alpha());
    return "hsla(" + hsl["0"] + ", " +
        hsl["1"] + "%, " +
        hsl["2"] + "%, " +
        alpha + ")";
}

function MSColorToAndroid(mscolor) {
    return "#" + Math.round(mscolor.alpha() * 255).toString(16).toUpperCase() + mscolor.immutableModelObject().hexValue();
}

function MSColorToNSColor(mscolor) {
    return "red:" + mscolor.red().toFixed(2) + " " +
        "green:" + mscolor.green().toFixed(2) + " " +
        "blue:" + mscolor.blue().toFixed(2) + " " +
        "alpha:" + mscolor.alpha().toFixed(2);
}

function RGBToHSL(r, g, b) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r : h = (g - b) / d + (g < b ? 6 : 0); break;
            case g : h = (b - r) / d + 2; break;
            case b : h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
