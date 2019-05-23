var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var doc = context.document;
    var page = doc.currentPage();
    var selection = context.selection;
    var count = selection.count();

    if(count > 0) {
        for(var i = 0; i < count; i ++) {
            var group = selection.objectAtIndex(i);
            var name = group.name();

            if(group.className() == "MSLayerGroup") {

                var artboard = MSArtboardGroup.alloc().init();
                    artboard.setRect(group.absoluteRect().rect());
                    artboard.frame().setConstrainProportions(false);
                    artboard.setName(name);

                page.addLayers([artboard]);

                group.moveToLayer_beforeLayer(artboard, nil);
                group.ungroup();

            }
        }
    } else {
        doc.showMessage("Please select at least 1 group.");
    }

};
