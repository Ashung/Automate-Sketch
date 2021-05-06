var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var type = require("../modules/Type");
    var sketch = require("sketch");
    var doc = context.document;
    var selection = context.selection;
    var pluginIdentifier = context.command.identifier();

    if (selection.count() == 0) {
        doc.showMessage("Please select at least 1 layer.");
        return;
    }

    var pasteboard = NSPasteboard.generalPasteboard();
    var pasteboardItems = pasteboard.pasteboardItems();
    if (pasteboardItems.count() > 0) {
        var pasteboardItem = pasteboardItems.firstObject();
        var pasteboardTypes = pasteboardItem.types();

        // Style: dyn.ah62d4rv4gu8y4y4xsv6023nukm10c6xenv61a3k
        // TextStyle: dyn.ah62d4rv4gu8y4y4yqz6hky5ytf0gnyccr7u1e3cytf2gn
        // Sketch Metadata: dyn.ah62d4rv4gu8y4y4ftb2g86xym72hk4ptr33zauxtqf3gkzd3sbwu
        if (
            pasteboardTypes.objectAtIndex(0) == "dyn.ah62d4rv4gu8y4y4xsv6023nukm10c6xenv61a3k" &&
            pasteboardTypes.objectAtIndex(1) == "dyn.ah62d4rv4gu8y4y4yqz6hky5ytf0gnyccr7u1e3cytf2gn" &&
            pasteboardTypes.objectAtIndex(2) == "dyn.ah62d4rv4gu8y4y4ftb2g86xym72hk4ptr33zauxtqf3gkzd3sbwu"
        ) {

            // Get the style JSON
            var archiveJSONString = pasteboardItem.stringForType("dyn.ah62d4rv4gu8y4y4xsv6023nukm10c6xenv61a3k");
            var archiveJSON = JSON.parse(archiveJSONString);
            var styleJSON = archiveJSON.root.style;
            var decoded = MSJSONDictionaryUnarchiver.alloc().initForReadingFromDictionary(styleJSON).decodeRoot();

            // Fills
            if (pluginIdentifier == "paste_style_fills") {
                if (styleJSON.fills) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (
                            type.isShape(layer) ||
                            type.isText(layer) ||
                            type.isBitmap(layer)
                        ) {
                            var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                            layer.style().setFills(style.fills());
                        } else {
                            doc.showMessage("Can not apply fill.");
                        }
                    }
                } else {
                    doc.showMessage("Style does not include fills.");
                }
            }

            // Borders
            if (pluginIdentifier == "paste_style_borders") {
                if (styleJSON.borders) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (
                            type.isShape(layer) ||
                            type.isText(layer) ||
                            type.isBitmap(layer)
                        ) {
                            var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                            layer.style().setBorders(style.borders());
                        } else {
                            doc.showMessage("Can not apply border.");
                        }
                    }
                } else {
                    doc.showMessage("Style does not include borders.");
                }
            }

            // Shadows
            if (pluginIdentifier == "paste_style_shadows") {
                if (styleJSON.shadows) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (
                            type.isShape(layer) ||
                            type.isText(layer) ||
                            type.isBitmap(layer) ||
                            type.isSymbolInstance(layer) ||
                            type.isGroup(layer)
                        ) {
                            var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                            layer.style().setShadows(style.shadows());
                        } else {
                            doc.showMessage("Can not apply shadow.");
                        }
                    }
                } else {
                    doc.showMessage("Style does not include shadows.");
                }
            }

            // Inner Shadows
            if (pluginIdentifier == "paste_style_innershadows") {
                if (styleJSON.innerShadows) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (
                            type.isShape(layer) ||
                            type.isText(layer) ||
                            type.isBitmap(layer)
                        ) {
                            var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                            layer.style().setInnerShadows(style.innerShadows());
                        } else {
                            doc.showMessage("Can not apply inner shadow.");
                        }
                    }
                } else {
                    doc.showMessage("Style does not include inner shadows.");
                }
            }

            // Blur
            if (pluginIdentifier == "paste_style_blur") {
                if (styleJSON.blur) {
                    var blurType = styleJSON.blur.type;
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {

                        if (Sketch.isShapeLayer(layer)) {
                            if (sketch.version.sketch >= 52) {
                                var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                                layer.style().setBlur(style.blur());
                            } else {
                                // Sketch < 52, Shape layer except line, can apply all blur.
                                if (layer.isLine() == false) {
                                    var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                                    layer.style().setBlur(style.blur());
                                }
                            }
                        }
                        // Text and bitmap layer can not apply background blur.
                        else if (
                            (type.isText(layer) || type.isBitmap(layer)) &&
                            blurType != 3
                        ) {
                            var style = MSStyle.alloc().initWithImmutableModelObject(decoded);
                            layer.style().setBlur(style.blur());
                        } else {
                            switch (blurType) {
                                case 3:
                                    doc.showMessage("Can not apply background blur.");
                                    break;
                                case 2:
                                    doc.showMessage("Can not apply zoom blur.");
                                    break;
                                case 1:
                                    doc.showMessage("Can not apply motion blur.");
                                    break;
                                case 0:
                                    doc.showMessage("Can not apply gaussian blur.");
                                    break;
                                default:
                                    doc.showMessage("Can not apply blur.");
                            }
                        }
                    }
                } else {
                    doc.showMessage("Style does not include blur.");
                }
            }

            // Text style without text color
            if (pluginIdentifier == "paste_text_style") {
                if (styleJSON.textStyle) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (type.isText(layer)) {
                            var textStyle = MSTextStyle.alloc().initWithImmutableModelObject(decoded.textStyle());
                            var textColor = layer.textColor();
                            layer.style().setTextStyle(textStyle);
                            layer.setTextColor(textColor);
                        }
                    }
                }
            }

            // Text color
            if (pluginIdentifier == "paste_text_color") {
                if (styleJSON.textStyle) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (type.isText(layer)) {
                            var textColor = decoded.textStyle().attributes().objectForKey("MSAttributedStringColorAttribute").newMutableCounterpart();
                            layer.setTextColor(textColor);
                        }
                    }
                }
            }

            // Text font family
            if (pluginIdentifier == "paste_text_font") {
                if (styleJSON.textStyle) {
                    var loopSelection = selection.objectEnumerator();
                    var layer;
                    while (layer = loopSelection.nextObject()) {
                        if (type.isText(layer)) {
                            var textStyle = MSTextStyle.alloc().initWithImmutableModelObject(decoded.textStyle());
                            var font = textStyle.fontPostscriptName();
                            layer.setFontPostscriptName(font);
                        }
                    }
                }
            }

            doc.reloadInspector();

        } else {
            doc.showMessage('You need to copy style first, with "Edit" - "Copy" - "Copy Style ⌥⌘C".');
        }
    } else {
        doc.showMessage('You need to copy style first, with "Edit" - "Copy" - "Copy Style ⌥⌘C".');
    }

};
