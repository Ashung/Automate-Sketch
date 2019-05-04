/**
 * @param  {MSSymbolMaster} symbolMaster
 * @param  {Number} size Optional
 * @return  {NSImage}
 */
module.exports.symbol = function(symbolMaster, size) {
    size = size || Math.max(symbolMaster.frame().width(), symbolMaster.frame().height());
    return artboardPreviewGenerator(symbolMaster, size * 2, size * 2);
}

/**
 * @param  {MSArtboard} artboard
 * @param  {Number} size Optional
 * @return  {NSImage}
 */
module.exports.artboard = function(artboard, size) {
    return this.symbol(artboard, size);
}

/**
 * @param  {MSAssetLibrary} library
 * @return  {NSImage}
 */
module.exports.library = function(library) {
    var documentReader = MSDocumentReader.readerForDocumentAtURL(library.locationOnDisk());
    if (documentReader.containsLibraryPreviewImage()) {
        return documentReader.libraryPreviewImage();
    }
    return NSImage.imageNamed("prefs_remotelibrary_placeholder");
}

/**
 * @param  {MSDocument} document
 * @return  {NSImage}
 */
module.exports.document = function(document) {
    var documentReader = MSDocumentReader.readerForDocumentAtURL(document.fileURL());
    if (documentReader.containsPreviewImage()) {
        return documentReader.previewImage();
    }
}

/**
 * @param  {MSShareStyle} textStyle
 * @return  {NSImage}
 */
module.exports.textStyle = function(textStyle) {
    var textLayer = MSTextLayer.alloc().init();
    textLayer.setStringValue(textStyle.name());
    textLayer.setStyle(textStyle.style());
    var width = textLayer.frame().width();
    var height = textLayer.frame().height();
    var artboard = artboardWithLayer(width, height, textLayer);
    var textColor = MSColor.alloc().initWithImmutableObject(textLayer.textColor());
    if (textColor.fuzzyIsEqualExcludingAlpha(MSColor.whiteColor())) {
        artboard.setHasBackgroundColor(true);
        artboard.setBackgroundColor(MSColor.colorWithRed_green_blue_alpha(0.67, 0.67, 0.67, 1));
    }
    return artboardPreviewGenerator(artboard, width * 2, height * 2);
}

/**
 * @param  {MSShareStyle} layerStyle
 * @return  {NSImage}
 */
module.exports.layerStyle = function(layerStyle) {
    var rectangle = MSRectangleShape.alloc().init();
    rectangle.setRect(CGRectMake(2, 2, 20, 20));
    rectangle.setStyle(layerStyle.style());
    rectangle.points().forEach(function(curvePoint) {
        curvePoint.setCornerRadius(2);
    });
    var artboard = artboardWithLayer(24, 24, rectangle);
    return artboardPreviewGenerator(artboard, 48, 48);
}

/**
 * @param  {MSColor} color
 * @return  {NSImage}
 */
module.exports.color = function(color) {
    return previewFill(0, color);
}

/**
 * @param  {MSGradient} gradient
 * @return  {NSImage}
 */
module.exports.gradient = function(gradient) {
    return previewFill(1, gradient);
}

function previewFill(fillType, fillContent) {
    var oval = MSOvalShape.alloc().init();
    oval.setRect(CGRectMake(0, 0, 20, 20));
    var image = oval.style().addStylePartOfType(0);
    image.setFillType(4);
    image.setImage(MSImageData.alloc().initWithImage(NSImage.imageNamed("checkerboard")));
    image.setPatternFillType(0);
    image.setPatternTileScale(0.35);
    var fill = oval.style().addStylePartOfType(0);
    fill.setFillType(fillType);
    fill.setColor(fillContent);
    var innerShadow = oval.style().addStylePartOfType(3);
    innerShadow.setColor(MSColor.colorWithRed_green_blue_alpha(0, 0, 0, 0.2));
    innerShadow.setOffsetX(0);
    innerShadow.setOffsetY(0);
    innerShadow.setBlurRadius(0);
    innerShadow.setSpread(1);
    var artboard = artboardWithLayer(20, 20, oval);
    return artboardPreviewGenerator(artboard, 40, 40);
}

function artboardWithLayer(width, height, layer) {
    var artboard = MSArtboardGroup.alloc().init();
    artboard.frame().setWidth(width);
    artboard.frame().setHeight(height);
    artboard.addLayer(layer);
    return artboard;
}

function artboardPreviewGenerator(artboard, width, height) {
    return MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
        artboard.ancestry(), CGSizeMake(width, height), NSColorSpace.sRGBColorSpace(), false
    );
} 