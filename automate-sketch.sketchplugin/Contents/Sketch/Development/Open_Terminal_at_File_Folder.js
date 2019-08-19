var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Development");
    var doc = context.document;
    if (!doc.fileURL()) {
        NSWorkspace.sharedWorkspace().openFile_withApplication_(nil, "Terminal");
    } else {
        var fileFolder = doc.fileURL().path().stringByDeletingLastPathComponent();
        NSWorkspace.sharedWorkspace().openFile_withApplication_(fileFolder, "Terminal");
    }
};
