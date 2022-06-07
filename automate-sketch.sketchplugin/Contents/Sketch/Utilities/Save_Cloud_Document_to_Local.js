var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var system = require("../modules/System");

    if (!document.sketchObject.isCloudDoc()) {
        sketch.UI.message('Not cloud document.');
        return;
    }

    var shortID = document.sketchObject.cloudShare().shortID();
    var name = document.sketchObject.cloudShare().name();
    var path = NSString.alloc().initWithString(AppController.templateLibraryURL().path());
    path = path.stringByDeletingLastPathComponent();
    path = path.stringByAppendingPathComponent("CloudDocuments");
    path = path.stringByAppendingPathComponent(shortID);
    path = path.stringByAppendingPathComponent(name);
    path = path.stringByAppendingPathExtension("sketchcloud");

    var toPath = system.savePanel(name + '.sketch');
    if (toPath) {
        system.cp(path, toPath);
    }

};