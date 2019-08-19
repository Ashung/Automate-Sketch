var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var Dialog = require("../modules/Dialog").dialog;

    var document = context.document;
    var selection = context.selection;
    var layer = selection.firstObject();
    if (!layer) {
        document.showMessage("Please select a bitmap layer.");
        return;
    } else {
        if (layer.class() != "MSBitmapLayer") {
            document.showMessage("Please select a bitmap layer.");
            return;
        }
    }

    var image = layer.NSImage();
    var imageWidth = image.size().width;
    var imageHeight = image.size().height;
    var layerWidth = layer.frame().width();
    var layerHeight = layer.frame().height();
    var layerScale = layerWidth / imageWidth;

    // Dialog
    var dialog = new Dialog(
        "Nine-Slice from Bitmap Layer",
        "Crop bitmap layer to 9 part with resizing constraint settings."
    );

    var thumbWidth = 200;
    var thumbHeight = Math.round(200 * imageHeight / imageWidth);
    if (imageHeight > imageWidth) {
        thumbWidth = Math.round(200 * imageWidth / imageHeight);
        thumbHeight = 200;
    }
    var thumbScale = thumbWidth / imageWidth;

    // Resize NSImage
    var originalImage = image.copy();
    var thumbSize = CGSizeMake(thumbWidth, thumbHeight);
    originalImage.setScalesWhenResized(true);
    var resizedImage = NSImage.alloc().initWithSize(thumbSize);
    resizedImage.lockFocus();
    originalImage.setSize(thumbSize);
    NSGraphicsContext.currentContext().setImageInterpolation(NSImageInterpolationNone);
    originalImage.drawAtPoint_fromRect_operation_fraction(NSZeroPoint, CGRectMake(0, 0, thumbSize.width, thumbSize.height), NSCompositeCopy, 1);
    resizedImage.unlockFocus();

    // Thumb view
    var imageWrapper = NSView.alloc().initWithFrame(NSMakeRect(0, 0, thumbWidth, thumbHeight));
    imageWrapper.setFlipped(true);
    var imageView = NSImageView.alloc().initWithFrame(NSMakeRect(0, 0, thumbWidth, thumbHeight));
    var backgroundImage = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("bg_alpha.png"));
    imageView.setWantsLayer(true);
    imageView.setBackgroundColor(NSColor.colorWithPatternImage(backgroundImage));
    imageView.setImage(resizedImage);

    // Add red lines
    var lineLeft = lineView(Math.round(thumbWidth / 3), 0, 1, thumbHeight);
    var lineRight = lineView(Math.round(thumbWidth / 3 * 2), 0, 1, thumbHeight);
    var lineTop = lineView(0, Math.round(thumbHeight / 3), thumbWidth, 1);
    var lineBottom = lineView(0, Math.round(thumbHeight / 3 * 2), thumbWidth, 1);
    imageWrapper.addSubview(imageView);
    imageWrapper.addSubview(lineLeft);
    imageWrapper.addSubview(lineRight);
    imageWrapper.addSubview(lineTop);
    imageWrapper.addSubview(lineBottom);
    dialog.addView(imageWrapper);

    // Slidebars
    var slideBarLeft = sliderBarView("Left: " + Math.round(imageWidth / 3), imageWidth, Math.round(imageWidth / 3));
    var slideBarRight = sliderBarView("Right: " + Math.round(imageWidth / 3 * 2), imageWidth, Math.round(imageWidth / 3 * 2));
    var slideBarTop = sliderBarView("Top: " + Math.round(imageHeight / 3), imageHeight, Math.round(imageHeight / 3));
    var slideBarBottom = sliderBarView("Bottom: " + Math.round(imageHeight / 3 * 2), imageHeight, Math.round(imageHeight / 3 * 2));
    dialog.addView(slideBarLeft.container);
    dialog.addView(slideBarRight.container);
    dialog.addView(slideBarTop.container);
    dialog.addView(slideBarBottom.container);

    slideBarLeft.slider.setCOSJSTargetFunction(function(sender) {
        restrictValue(sender, 0, slideBarRight.slider.intValue());
        slideBarLeft.label.setStringValue(`Left: ${sender.intValue()}`);
        lineLeft.setFrameOrigin(CGPointMake(Math.round(sender.intValue() * thumbScale), 0));
    });
    slideBarRight.slider.setCOSJSTargetFunction(function(sender) {
        restrictValue(sender, slideBarLeft.slider.intValue(), imageWidth);
        slideBarRight.label.setStringValue(`Right: ${sender.intValue()}`);
        lineRight.setFrameOrigin(CGPointMake(Math.round(sender.intValue() * thumbScale), 0));
    });
    slideBarTop.slider.setCOSJSTargetFunction(function(sender) {
        restrictValue(sender, 0, slideBarBottom.slider.intValue());
        slideBarTop.label.setStringValue(`Top: ${sender.intValue()}`);
        lineTop.setFrameOrigin(CGPointMake(0, Math.round(sender.intValue() * thumbScale)));
    });
    slideBarBottom.slider.setCOSJSTargetFunction(function(sender) {
        restrictValue(sender, slideBarTop.slider.intValue(), imageHeight);
        slideBarBottom.label.setStringValue(`Bottom: ${sender.intValue()}`);
        lineBottom.setFrameOrigin(CGPointMake(0, Math.round(sender.intValue() * thumbScale)));
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        //     L   R      resizingConstraint
        //   1 | 2 | 3    9  | 10 | 12
        // T ---------    ------------
        //   4 | 5 | 6    17 | 18 | 20
        // B ---------    ------------
        //   7 | 8 | 9    33 | 34 | 36

        var left = slideBarLeft.slider.intValue(),
            right = slideBarRight.slider.intValue(),
            top = slideBarTop.slider.intValue(),
            bottom = slideBarBottom.slider.intValue();

        var group = MSLayerGroup.alloc().initWithFrame(layer.frame().rect());

        var part1Image = crop(image, 0, 0, left, top);
        var part1Rect = CGRectMake(0, 0, Math.round(left * layerScale), Math.round(top * layerScale));
        var part1Layer = MSBitmapLayer.alloc().initWithFrame_image(part1Rect, part1Image);
        group.addLayer(part1Layer);
        part1Layer.setName("1");
        part1Layer.setResizingConstraint(9);

        var part2Image = crop(image, left, 0, right - left, top);
        var part2Rect = CGRectMake(Math.round(left * layerScale), 0, Math.round((right - left) * layerScale), Math.round(top * layerScale));
        var part2Layer = MSBitmapLayer.alloc().initWithFrame_image(part2Rect, part2Image);
        group.addLayer(part2Layer);
        part2Layer.setName("2");
        part2Layer.setResizingConstraint(10);

        var part3Image = crop(image, right, 0, imageWidth - right, top);
        var part3Rect = CGRectMake(Math.round(right * layerScale), 0, Math.round((imageWidth - right) * layerScale), Math.round(top * layerScale));
        var part3Layer = MSBitmapLayer.alloc().initWithFrame_image(part3Rect, part3Image);
        group.addLayer(part3Layer);
        part3Layer.setName("3");
        part3Layer.setResizingConstraint(12);

        var part4Image = crop(image, 0, top, left, bottom - top);
        var part4Rect = CGRectMake(0, Math.round(top * layerScale), Math.round(left * layerScale), Math.round((bottom - top) * layerScale));
        var part4Layer = MSBitmapLayer.alloc().initWithFrame_image(part4Rect, part4Image);
        group.addLayer(part4Layer);
        part4Layer.setName("4");
        part4Layer.setResizingConstraint(17);

        var part5Image = crop(image, left, top, right - left, bottom - top);
        var part5Rect = CGRectMake(Math.round(left * layerScale), Math.round(top * layerScale), Math.round((right - left) * layerScale), Math.round((bottom - top) * layerScale));
        var part5Layer = MSBitmapLayer.alloc().initWithFrame_image(part5Rect, part5Image);
        group.addLayer(part5Layer);
        part5Layer.setName("5");
        part5Layer.setResizingConstraint(18);

        var part6Image = crop(image, right, top, imageWidth - right, bottom - top);
        var part6Rect = CGRectMake(Math.round(right * layerScale), Math.round(top * layerScale), Math.round((imageWidth - right) * layerScale), Math.round((bottom - top) * layerScale));
        var part6Layer = MSBitmapLayer.alloc().initWithFrame_image(part6Rect, part6Image);
        group.addLayer(part6Layer);
        part6Layer.setName("6");
        part6Layer.setResizingConstraint(20);

        var part7Image = crop(image, 0, bottom, left, imageHeight - bottom);
        var part7Rect = CGRectMake(0, Math.round(bottom * layerScale), Math.round(left * layerScale), Math.round((imageHeight - bottom) * layerScale));
        var part7Layer = MSBitmapLayer.alloc().initWithFrame_image(part7Rect, part7Image);
        group.addLayer(part7Layer);
        part7Layer.setName("7");
        part7Layer.setResizingConstraint(33);

        var part8Image = crop(image, left, bottom, right - left, imageHeight - bottom);
        var part8Rect = CGRectMake(Math.round(left * layerScale), Math.round(bottom * layerScale), Math.round((right - left) * layerScale), Math.round((imageHeight - bottom) * layerScale));
        var part8Layer = MSBitmapLayer.alloc().initWithFrame_image(part8Rect, part8Image);
        group.addLayer(part8Layer);
        part8Layer.setName("8");
        part8Layer.setResizingConstraint(34);

        var part9Image = crop(image, right, bottom, imageWidth - right, imageHeight - bottom);
        var part9Rect = CGRectMake(Math.round(right * layerScale), Math.round(bottom * layerScale), Math.round((imageWidth - right) * layerScale), Math.round((imageHeight - bottom) * layerScale));
        var part9Layer = MSBitmapLayer.alloc().initWithFrame_image(part9Rect, part9Image);
        group.addLayer(part9Layer);
        part9Layer.setName("9");
        part9Layer.setResizingConstraint(36);

        layer.parentGroup().addLayer(group);

        group.select_byExtendingSelection(true, false);

    }

};

function lineView(x, y, w, h) {
    var view = NSView.alloc().initWithFrame(NSMakeRect(x, y, w, h));
    view.setWantsLayer(true);
    view.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 0, 0, 0.8));
    return view;
}

function sliderBarView(lebal, maxValue, initValue) {
    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 20));

    var sliderView = NSSlider.alloc().initWithFrame(NSMakeRect(0, 0, 200, 20));
    sliderView.setMaxValue(maxValue);
    sliderView.setMinValue(0);
    sliderView.setIntValue(initValue);

    var textView = NSTextField.alloc().initWithFrame(NSMakeRect(210, 0, 90, 20));
    textView.setStringValue(lebal);
    textView.setTextColor(NSColor.blackColor());
    textView.setBezeled(false);
    textView.setDrawsBackground(false);
    textView.setEditable(false);
    textView.setSelectable(false);

    view.addSubview(textView);
    view.addSubview(sliderView);

    return { container: view, label: textView, slider: sliderView };
}

function restrictValue(sliderView, minValue, maxValue) {
    var value = sliderView.intValue();
    if (value <= minValue) {
        value = minValue + 1;
    }
    if (value >= maxValue) {
        value = maxValue - 1;
    }
    sliderView.setIntValue(value);
}

function crop(nsimage, x, y, w, h) {
    var originalImage = nsimage.copy();
    var image = NSImage.alloc().initWithSize(NSMakeSize(w, h));
    image.lockFocus();
    originalImage.drawInRect_fromRect_operation_fraction(
        NSMakeRect(0, 0, w, h),
        NSMakeRect(x, originalImage.size().height - h - y, w, h),
        NSCompositeCopy,
        1.0
    );
    image.unlockFocus();
    return MSImageData.alloc().initWithImage(image);
}
