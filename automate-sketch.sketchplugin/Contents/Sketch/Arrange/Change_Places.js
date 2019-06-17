var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Arrange");

    var doc = context.document;
    var selection = context.selection;
    var pluginIdentifier = context.command.identifier();

    if (selection.count() != 2) {
        doc.showMessage("Please select 2 objects.");
        return;
    }

    var layer1Artboard, layer1ParentGroup, layer1BeforeLayer, layer1Frame, 
        layer2Artboard, layer2ParentGroup, layer2BeforeLayer, layer2Frame;
    if (selection[0].parentArtboard()) {
        layer1Artboard = selection[0].parentArtboard();
        layer1ParentGroup = selection[0].parentGroup();
        layer1Frame = selection[0].frame();
        layer1BeforeLayer = (layer1ParentGroup.layers().count() == layer1ParentGroup.indexOfLayer(selection[0]) + 1) ? nil : layer1ParentGroup.layers().objectAtIndex(layer1ParentGroup.indexOfLayer(selection[0]) + 1);
        selection[0].moveToLayer_beforeLayer(selection[0].parentPage(), nil);
    }

    if (selection[1].parentArtboard()) {
        layer2Artboard = selection[1].parentArtboard();
        layer2ParentGroup = selection[1].parentGroup();
        layer2Frame = selection[1].frame();
        layer2BeforeLayer = (layer2ParentGroup.layers().count() == layer2ParentGroup.indexOfLayer(selection[1]) + 1) ? nil : layer2ParentGroup.layers().objectAtIndex(layer2ParentGroup.indexOfLayer(selection[1]) + 1);
        selection[1].moveToLayer_beforeLayer(selection[1].parentPage(), nil);
    }

    var x1 = selection[0].frame().x(),
        y1 = selection[0].frame().y(),
        midX1 = selection[0].frame().midX(),
        midY1 = selection[0].frame().midY(),
        x2 = selection[1].frame().x(),
        y2 = selection[1].frame().y(),
        midX2 = selection[1].frame().midX(),
        midY2 = selection[1].frame().midY();

    // Change places base top-left
    if (pluginIdentifier == "change_layer_places") {
        selection[0].frame().x = x2;
        selection[0].frame().y = y2;
        selection[1].frame().x = x1;
        selection[1].frame().y = y1;
    }

    // Change places base middle-center
    if (pluginIdentifier == "change_layer_places_center") {
        selection[0].frame().midX = midX2;
        selection[0].frame().midY = midY2;
        selection[1].frame().midX = midX1;
        selection[1].frame().midY = midY1;
    }

    if (layer1Artboard) {
        selection[1].moveToLayer_beforeLayer(layer1ParentGroup, layer1BeforeLayer);
        if (layer2Frame) {
            selection[1].setFrame(layer2Frame);
        }
    }

    if (layer2Artboard) {
        selection[0].moveToLayer_beforeLayer(layer2ParentGroup, layer2BeforeLayer);
        if (layer1Frame) {
            selection[0].setFrame(layer1Frame);
        }
    }

    // Resize group to fit children
    var loopSelection = selection.objectEnumerator();
    var selectedLayer;
    while (selectedLayer = loopSelection.nextObject()) {
        if (selectedLayer.parentGroup().class() == "MSLayerGroup") {
            if (MSApplicationMetadata.metadata().appVersion >= 53) {
                selectedLayer.parentGroup().fixGeometryWithOptions(1);
            } else {
                selectedLayer.parentGroup().resizeToFitChildrenWithOption(1);
            }
        }
    }

};
