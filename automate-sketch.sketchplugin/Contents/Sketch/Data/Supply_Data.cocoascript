var DataSupplier = require("sketch/data-supplier");
var System = require("../modules/System");

var onStartup = function() {
    DataSupplier.registerDataSupplier("public.text", "Text From File", "SupplyTextFromFile");
    DataSupplier.registerDataSupplier("public.image", "Image From Folder", "SupplyImageFromFolder");
    DataSupplier.registerDataSupplier("public.text", "Random Text From File", "SupplyRandomTextFromFile");
    DataSupplier.registerDataSupplier("public.image", "Random Image From Folder", "SupplyRandomImageFromFolder");
};

var onShutdown = function() {
    DataSupplier.deregisterDataSuppliers();
};

var onSupplyTextFromFile = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var texts = System.textsFromChooseFile();
    if (texts.length > 0) {
        supplyOrderedData(context, texts);
    }
};

var onSupplyImageFromFolder = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var images = System.imagesFromChooseFolder();
    if (images.length > 0) {
        supplyOrderedData(context, images);
    }
};

var onSupplyRandomTextFromFile = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var texts = System.textsFromChooseFile();
    if (texts.length > 0) {
        supplyRandomData(context, texts);
    }
};

var onSupplyRandomImageFromFolder = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var images = System.imagesFromChooseFolder();
    if (images.length > 0) {
        supplyRandomData(context, images);
    }
};

function supplyOrderedData(context, data) {
    for (var i = 0; i < context.data.requestedCount; i++) {
        var dataIndex;
        if (context.data.isSymbolInstanceOverride == 1) {
            var selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers().layers();
            dataIndex = selection.indexOfObject(context.data.items.objectAtIndex(i).symbolInstance())
        } else {
            dataIndex = i;
        }
        DataSupplier.supplyDataAtIndex(context.data.key, data[dataIndex % data.length], i);
    }
}

function supplyRandomData(context, data) {
    for (var i = 0; i < context.data.requestedCount; i++) {
        DataSupplier.supplyDataAtIndex(context.data.key, data[Math.floor(Math.random() * data.length)], i);
    }
}