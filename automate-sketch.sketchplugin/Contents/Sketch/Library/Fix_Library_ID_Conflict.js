var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var sketch = require("sketch");
    var document = context.document;

    if (sketch.version.sketch < 48) {
        document.showMessage("😮 You have to update to Sketch 48+ to use this feature.");
        return;
    }

    var libraries = librariesWithConflictID();

    if (!libraries) {
        document.showMessage("You have no libraries.");
        return;
    }

    if (libraries.count() == 0) {
        document.showMessage("😀 You have no libraries with conflict ID.");
        return;
    }

    // Dialog
    var viewWidth = 550,
        viewHeight = 400,
        padding = 10,
        previewImageWidth = 100,
        previewImageHeight = 80;

    var dialog = new Dialog(
        "Fix Library ID Conflict",
        "Change the library ID, will cause symbol's auto update to break.",
        viewWidth,
        ["Close"]
    );

    var scrollView = ui.scrollView([], [0, 0, viewWidth, viewHeight]);
    dialog.addView(scrollView);

    var contentView = ui.view([0, 0, viewWidth, libraries.count() * (previewImageHeight + padding * 2) + 10]);

    var loopLibraries = libraries.objectEnumerator();
    var library;
    var i = 0;
    while (library = loopLibraries.nextObject()) {

        // List
        var itemHeight = previewImageHeight + padding * 2;
        var itemView = ui.view([0, itemHeight * i, viewWidth, itemHeight]);

        // Library full path
        var libraryPath = library.locationOnDisk().path();
        var fullPathView = ui.textLabel(libraryPath, [0, 0, 0, 0]);
        itemView.addSubview(fullPathView);

        var libraryInAppBundle = false;
        var regexBundle = new RegExp("^" + NSBundle.mainBundle().bundlePath().replace(/(\/)/g, "\\/"), "gi");
        if (regexBundle.test(libraryPath)) {
            libraryInAppBundle = true;
        }

        // Preview image
        var imageView = NSView.alloc().initWithFrame(NSMakeRect(padding, padding, previewImageWidth, previewImageHeight));
        imageView.setWantsLayer(true);
        imageView.setCornerRadius(3);
        imageView.layer().setBackgroundColor(CGColorCreateGenericRGB(1, 1, 1, 1));
        imageView.layer().setBorderWidth(1);
        imageView.layer().setBorderColor(CGColorCreateGenericRGB(0, 0, 0, 0.05));
        var imageSrc = NSImageView.alloc().initWithFrame(NSMakeRect(0, 0, previewImageWidth, previewImageHeight));
        var libraryDocument = MSDocumentReader.readerForDocumentAtURL(library.locationOnDisk());
        var image = libraryDocument.libraryPreviewImage();
        imageSrc.setImage(image);
        imageView.addSubview(imageSrc);
        itemView.addSubview(imageView);

        // Open button
        var openButtonView = NSButton.alloc().initWithFrame(NSMakeRect(padding, padding, previewImageWidth, previewImageHeight));
        openButtonView.setButtonType(NSMomentaryChangeButton);
        openButtonView.setBezelStyle(nil);
        openButtonView.setBordered("NO");
        openButtonView.setTitle("");

        if (library.libraryType() == 1 && !libraryInAppBundle) {
            openButtonView.setCOSJSTargetFunction(function(sender) {
                var targetLibraryPath = sender.superview().subviews().objectAtIndex(0).stringValue();
                var targetLibraryURL = NSURL.fileURLWithPath(targetLibraryPath);
                NSApp.stopModal();
                var welcomeWindow = MSWelcomeWindowController.alloc().init();
                welcomeWindow.openDocumentAtURL(targetLibraryURL);
            });
        } else {
            openButtonView.setCOSJSTargetFunction(function(sender) {
                document.showMessage("You can't edit this file.");
            });
        }

        itemView.addSubview(openButtonView);

        // Title
        var titleView = NSTextField.alloc().initWithFrame(NSMakeRect(previewImageWidth + padding * 2, 20, viewWidth - previewImageWidth - 100 + padding * 3, 20));
        titleView.setStringValue(library.name());
        if (!library.enabled()) {
            titleView.setStringValue(library.name() + " 🙈");
        }
        titleView.setFont(NSFont.boldSystemFontOfSize(14));
        titleView.setTextColor(NSColor.blackColor());
        titleView.setBezeled(false);
        titleView.setDrawsBackground(false);
        titleView.setEditable(false);
        titleView.setSelectable(false);
        itemView.addSubview(titleView);

        // Library ID
        var idView = NSTextField.alloc().initWithFrame(NSMakeRect(previewImageWidth + padding * 2, 40, viewWidth - previewImageWidth - 100 + padding * 3, 20));
        idView.setStringValue(library.libraryID());
        idView.setFont(NSFont.monospacedDigitSystemFontOfSize_weight(12, NSFontWeightRegular));
        idView.setTextColor(NSColor.blackColor());
        idView.setBezeled(false);
        idView.setDrawsBackground(false);
        idView.setEditable(false);
        idView.setSelectable(false);
        itemView.addSubview(idView);

        // Library URL
        var locationView = NSTextField.alloc().initWithFrame(NSMakeRect(previewImageWidth + padding * 2, 60, 100, 20));
        locationView.setTextColor(NSColor.grayColor());
        locationView.setBezeled(false);
        locationView.setDrawsBackground(false);
        locationView.setEditable(false);
        locationView.setSelectable(false);
        if (library.libraryType() == 0 || libraryInAppBundle) {
            locationView.setStringValue("Internal Library");
        }
        if (library.libraryType() == 1 && !libraryInAppBundle) {
            var libraryDir = libraryPath.stringByDeletingLastPathComponent();
            var regexHome = new RegExp("^" + NSHomeDirectory().replace(/(\/)/g, "\\/"), "gi");
            libraryDir = libraryDir.replace(regexHome, "~")
            locationView.setStringValue(libraryDir);
        }
        locationView.sizeToFit();
        itemView.addSubview(locationView);

        // Button
        if (library.libraryType() == 1 && !libraryInAppBundle) {
            var changeButton = NSButton.alloc().initWithFrame(NSMakeRect(viewWidth - 110, 35, 90, 30));
            changeButton.setBezelStyle(NSRoundedBezelStyle);
            changeButton.setTitle("Change ID");
            changeButton.setCOSJSTargetFunction(function(sender) {
                var targetLibraryPath = sender.superview().subviews().objectAtIndex(0).stringValue();
                var newID = changeDocumentID(document, targetLibraryPath);
                if (newID) {
                    var idView = sender.superview().subviews().objectAtIndex(4);
                    idView.setStringValue(newID);
                } else {
                    document.showMessage("Error: can't read data from file. You can open library file and run Development - Change Document ID");
                }
            });
            itemView.addSubview(changeButton);
        }

        var divider = NSView.alloc().initWithFrame(NSMakeRect(0, itemHeight - 1, viewWidth, 1));
        divider.setWantsLayer(true);
        divider.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
        itemView.addSubview(divider);

        contentView.addSubview(itemView);

        i ++;
    }

    scrollView.setDocumentView(contentView);

    dialog.run();

};

function librariesWithConflictID() {

    var assetLibraryController = AppController.sharedInstance().librariesController();
    var libraries = assetLibraryController.libraries();

    if (libraries.count() == 0) {
        return nil;
    }

    // Sort by library ID
    var librariesCopy = libraries.mutableCopy();
    var sortByID = NSSortDescriptor.sortDescriptorWithKey_ascending("libraryID", true);
    librariesCopy.sortUsingDescriptors(NSArray.arrayWithObject(sortByID));

    var librariesCopy2 = librariesCopy.mutableCopy();
    librariesCopy2.forEach(function(library, index) {
        if (library.libraryID()) {
            if (index == 0) {
                if (!library.libraryID().isEqual(librariesCopy2[index + 1].libraryID())) {
                    librariesCopy.removeObject(library);
                }
            } else if (index == librariesCopy2.count() - 1) {
                if (!library.libraryID().isEqual(librariesCopy2[index - 1].libraryID())) {
                    librariesCopy.removeObject(library);
                }
            } else {
                if (
                    !library.libraryID().isEqual(librariesCopy2[index + 1].libraryID()) &&
                    !library.libraryID().isEqual(librariesCopy2[index - 1].libraryID())
                ) {
                    librariesCopy.removeObject(library);
                }
            }
        } else {
            librariesCopy.removeObject(library);
        }
    });

    return librariesCopy;
}

function changeDocumentID(document, documentPath) {
    var newID = NSUUID.UUID().UUIDString();
    var documentController = NSDocumentController.sharedDocumentController();
    var fileURL = NSURL.fileURLWithPath(documentPath);

    // If library document is opened
    var libraryDocument = documentController.documentForURL(fileURL);
    if (libraryDocument) {
        libraryDocument.documentData().setObjectID(newID);
        libraryDocument.saveDocument(nil);
        return newID;
    } else {
        var error = MOPointer.alloc().init();
        var newDocument = MSDocument.alloc().init();
        newDocument.setDisplayName(documentPath.slice(documentPath.lastIndexOf("/") + 1));
        var type = "com.bohemiancoding.sketch.drawing";
        newDocument.readFromURL_ofType_error(fileURL, type, error);

        if (error.value() != null) {
            document.showMessage("Error: " + error.value());
            return;
        }

        if (newDocument.documentData().documentIsEmpty()) {
            return;
        }

        newDocument.documentData().setObjectID(newID);

        // Hack
        newDocument.addBlankPage();
        newDocument.documentData().removePage(document.pages().lastObject());

        var error2 = MOPointer.alloc().init();
        var writeToNewDocument = newDocument.writeToURL_ofType_forSaveOperation_originalContentsURL_error(
            fileURL, type, NSSaveOperation, nil, error2
        );

        if (error2.value() != null) {
            document.showMessage("Error: " + error2.value());
            return;
        }

        if (writeToNewDocument) {
            return newID;
        } else {
            return nil;
        }
    }
}
