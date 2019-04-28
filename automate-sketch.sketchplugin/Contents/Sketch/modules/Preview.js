// TODO: Module: preview text style, layer style, color, gradient
/**
 * @param  {MSSymbolMaster} symbolMaster
 * @param  {Number} size Optional
 * @return  {NSImage}
 */
module.exports.symbol = function(symbolMaster, size) {
    size = size || Math.max(symbolMaster.frame().width(), symbolMaster.frame().height());
    return MSSymbolPreviewGenerator.imageForSymbolAncestry_withSize_colorSpace_trimmed(
        symbolMaster.ancestry(), CGSizeMake(size * 2, size * 2), NSColorSpace.sRGBColorSpace(), false
    );
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
module.exports.document= function(document) {
    var documentReader = MSDocumentReader.readerForDocumentAtURL(document.fileURL());
    if (documentReader.containsPreviewImage()) {
        return documentReader.previewImage();
    }
}