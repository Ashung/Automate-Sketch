var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var Page = require('sketch/dom').Page;
    var Artboard = require("sketch/dom").Artboard;
    var Rectangle = require('sketch/dom').Rectangle;
    var document = sketch.getSelectedDocument();

    var page = new Page({
        name: "Library Preview"
    });
    document.pages.unshift(page);

    var artboard = new Artboard({
        name: "Library Preview",
        parent: page,
        frame: new Rectangle(0, 0, 200, 200),
        background: {
            enabled: true,
            includeInExport: true,
            color: "#FFFFFF"
        }
    });

    document.centerOnLayer(artboard);

};
