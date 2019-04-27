var System = {};
// TODO: NSOKButton -> 1000
System.chooseFile = function() {
    var panel = NSOpenPanel.openPanel();
    panel.setCanChooseDirectories(false);
    panel.setCanChooseFiles(true);
    panel.setCanCreateDirectories(false);
    panel.setAllowedFileTypes(["txt"]);
    if (panel.runModal() == NSOKButton) {
        return panel.URL().path();
    }
};

System.chooseFolder = function() {
    var panel = NSOpenPanel.openPanel();
    panel.setCanChooseDirectories(true);
    panel.setCanChooseFiles(false);
    panel.setCanCreateDirectories(true);
    if (panel.runModal() == NSOKButton) {
        return panel.URL().path();
    }
};

System.savePanel = function(defaultName) {
    var panel = NSSavePanel.savePanel();
    if (defaultName) {
        panel.setNameFieldStringValue(defaultName);
    }
    panel.setCanCreateDirectories(true);
    if (panel.runModal() == NSOKButton) {
        return panel.URL().path();
    }
};

System.textsFromFile = function(path) {
    var contents = NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, nil);
    var data = contents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet());
    var texts = [];
    var loopData = data.objectEnumerator();
    var item;
    while (item = loopData.nextObject()) {
        if (item.length() > 0) {
            texts.push(String(item));
        }
    }
    return texts;
};

System.imagesFromFolder = function(path) {
    var images = [];
    var supportFormats = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "webp", "bmp"];
    var fileManager = NSFileManager.defaultManager();
    var fileList = fileManager.contentsOfDirectoryAtPath_error(path, nil);
    fileList = fileList.sortedArrayUsingSelector("localizedStandardCompare:");
    fileList.forEach(function(file) {
        if (supportFormats.indexOf(String(file.pathExtension().lowercaseString())) != -1) {
            images.push(path + "/" + file);
        }
    });
    return images;
};

System.textsFromChooseFile = function() {
    var textFile = System.chooseFile();
    if (textFile == nil) {
        return [];
    } else {
        return System.textsFromFile(textFile);
    }
}

System.imagesFromChooseFolder = function() {
    var imageFolder = System.chooseFolder();
    if (imageFolder == nil) {
        return [];
    } else {
        return System.imagesFromFolder(imageFolder);
    }
}

System.writeStringToFile = function(content, filePath) {
    NSString.stringWithString(content).writeToFile_atomically_encoding_error_(
        filePath, true, NSUTF8StringEncoding, nil
    );
};

System.showInFinder = function(filePath) {
    var err = MOPointer.alloc().init();
    var fileManager = NSFileManager.defaultManager();
    var result = fileManager.attributesOfItemAtPath_error(filePath, err);
    if (result.isDirectory()) {
        NSWorkspace.sharedWorkspace().openFile_withApplication(filePath, "Finder");
    } else {
        NSWorkspace.sharedWorkspace().selectFile_inFileViewerRootedAtPath(filePath, nil);
    }
};

System.mkdir = function(filePath) {
    return NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error_(
        filePath, true, nil, nil
    );
};

System.getSubFolders = function(path) {
    var fileManager = NSFileManager.defaultManager();
    var paths = fileManager.contentsOfDirectoryAtPath_error(path, nil);
    var result = [];
    for (var i = 0; i < paths.count(); i++) {
        result.push(String(paths.objectAtIndex(i)));
    }
    return result;
}

System.getAppPath = function() {
    return String(NSBundle.mainBundle().bundlePath());
}

module.exports = System;