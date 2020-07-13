var createLinkLayer = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var selection = context.selection;

    if (
        selection.count() != 1 ||
        (
            selection.count() == 1 &&
            (
                selection.firstObject().className() != "MSLayerGroup" &&
                selection.firstObject().className() != "MSArtboardGroup"
            )
        )
    ) {
        document.showMessage("Place select a layer group or artboard.");
        return;
    }

    // Create library symbol from selected group
    var group = selection.firstObject();
    var foreignSymbol;
    if (findForeignSymbolFromGroup(context, group)) {
        foreignSymbol = findForeignSymbolFromGroup(context, group);
    } else {
        foreignSymbol = foreignSymbolFromGroup(context, group);
    }

    // Insert symbol instance.
    try {
        var symbolRef = MSSymbolMasterReference.referenceForShareableObject(foreignSymbol.symbolMaster());
        var insertAction = document.actionsController().actionForID("MSInsertSymbolAction");
        var tempMenuItem = NSMenuItem.alloc().init();
        tempMenuItem.setRepresentedObject([symbolRef]);
        insertAction.doPerformAction(tempMenuItem);
    } catch(error) {
        document.showMessage("Error: " + error.message);
    }

};

var syncLinkLayers = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var documentData = document.documentData();

    var predicate = NSPredicate.predicateWithFormat("libraryID == %@", documentData.objectID());
    var linkLayers = documentData.foreignSymbols().filteredArrayUsingPredicate(predicate);

    var loopLinkLayers = linkLayers.objectEnumerator();
    var foreignSymbol;
    while (foreignSymbol = loopLinkLayers.nextObject()) {
        var targetGroup = documentData.layerWithID(foreignSymbol.sourceLibraryName());
        if (targetGroup) {

            // Update foreign symbol
            var allInstances = foreignSymbol.symbolMaster().allInstances();
            var loopAllInstances = allInstances.objectEnumerator();
            var instance;
            while (instance = loopAllInstances.nextObject()) {
                var newForeignSymbol = foreignSymbolFromGroup(context, targetGroup);
                instance.changeInstanceToSymbol(newForeignSymbol.symbolMaster());
            }

        } else {

            // Link layer miss
            var allInstances = foreignSymbol.symbolMaster().allInstances();
            var loopAllInstances = allInstances.objectEnumerator();
            var instance;
            while (instance = loopAllInstances.nextObject()) {
                instance.setName("👻 " + instance.symbolMaster().name() + " (Linked layer is miss you need to recreate one.)");
            }

        }
    }

};

function foreignSymbolFromGroup(context, group) {
    var document = context.document;
    var documentData = document.documentData();
    var rect = group.frame().rect();
    var symbolMaster = MSSymbolMaster.alloc().initWithFrame(rect);
    symbolMaster.setName("_linked" + "/" + group.name());
    group.layers().forEach(function(layer) {
        layer.copy().moveToLayer_beforeLayer(symbolMaster, nil);
        symbolMaster.layers().lastObject().frame().setX(layer.frame().x());
        symbolMaster.layers().lastObject().frame().setY(layer.frame().y());
    });
    var foreignSymbol = MSForeignSymbol.alloc().init();
    foreignSymbol.setLocalObject(symbolMaster);
    foreignSymbol.setOriginalObject(symbolMaster);
    foreignSymbol.setLibraryID(documentData.objectID());
    foreignSymbol.setSourceLibraryName(group.objectID());
    documentData.addForeignSymbol(foreignSymbol);
    return foreignSymbol;
}

function findForeignSymbolFromGroup(context, group) {
    var document = context.document;
    var documentData = document.documentData();
    var predicate = NSPredicate.predicateWithFormat("libraryID == %@ && sourceLibraryName == %@", documentData.objectID(), group.objectID());
    var foreignSymbols = documentData.foreignSymbols().filteredArrayUsingPredicate(predicate);
    if (foreignSymbols.count() > 0) {
        return foreignSymbols.firstObject();
    } else {
        return nil;
    }
}
