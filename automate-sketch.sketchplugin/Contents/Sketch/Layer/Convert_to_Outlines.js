var onRun = function (context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;

    var totalCount = 0;

    // Fix Sketch 45
    if (page.deselectAllLayers) {
        page.deselectAllLayers();
    } else {
        page.changeSelectionBySelectingLayers(nil);
    }

    if (selection.count() == 0) {

        selectLayersInPage(page, context, page, function (count) {
            totalCount = count;
        });

    } else {
        var loop = selection.objectEnumerator();
        while (layer = loop.nextObject()) {

            selectLayersInPage(layer, context, page, function (count) {
                totalCount;
            });
        }

    }

    if (totalCount == 0) {
        doc.showMessage(`No shape found.`);
    } else if (totalCount == 1) {
        doc.showMessage(`1 layer converted.`);
    } else {
        doc.showMessage(`Converted ${totalCount} layers.`);
    }


};

function selectLayersInPage(parent, context, page, callback) {

    var totalCount = 0;

    if (
        parent.containsLayers()
    ) {
        selectGroup(parent, context, page, function (count) {
            totalCount++;
        });
    }

    if (callback && typeof (callback) == "function") {
        callback(totalCount);
    }

}

function selectGroup(group, context, page, callback) {

    var loopChildren = group.children().objectEnumerator();
    var subGroup;
    while (subGroup = loopChildren.nextObject()) {

        if (subGroup.containsLayers() && subGroup.class() != "MSShapeGroup" && subGroup.class() != "MSPage") {

            // log(loopChildren);

            selectSubLayer(subGroup, true);
            context.document.actionsController().actionForID("MSUnionAction").doPerformAction(null);

            // Fix Sketch 45
            if (page.deselectAllLayers) {
                page.deselectAllLayers();
            } else {
                page.changeSelectionBySelectingLayers(nil);
            }

            if (callback && typeof (callback) == "function") {
                callback(1);
            }
        }
    }

}

function selectSubLayer(subGroup) {
    var layerType = require("../modules/Type");
    var loopChildren = subGroup.children().objectEnumerator();
    while (subLayer = loopChildren.nextObject()) {
        if (
            (layerType.isText(subLayer)) ||
            (layerType.isShape(subLayer))
        ) {
            subLayer.layersByConvertingToOutlines();
        }
    }
}
