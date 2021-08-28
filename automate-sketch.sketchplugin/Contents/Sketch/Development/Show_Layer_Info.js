var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var document = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }

    var layer = selection.firstObject();

    // Dialog
    var dialogWidth = 400;
    var dialog = new Dialog(
        "Show and Change Layer Info",
        "You current select layer \"" + layer.name() + "\". You can change ID to a new one or input a ID.",
        400,
        ["Save", "Cancel"]
    );

    // Views
    var views = [];

    var labelClass = labelView("layer.className()");
    views.push(labelClass);
    var textFieldClass = textFieldView(layer.class(), false);
    views.push(textFieldClass);

    var labelObjectID = labelView("layer.objectID()");
    views.push(labelObjectID);
    var groupObjectID = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, 25));
    groupObjectID.setFlipped(true);
    var textFieldObjectID = textFieldView(layer.objectID());
    groupObjectID.addSubview(textFieldObjectID);
    var buttonCopyObjectID = NSButton.alloc().initWithFrame(NSMakeRect(270, 0, 60, 28));
    buttonCopyObjectID.setBezelStyle(NSRoundedBezelStyle);
    buttonCopyObjectID.setTitle("Copy");
    buttonCopyObjectID.setCOSJSTargetFunction(function(sender) {
        copyToPasteboard(textFieldObjectID.stringValue());
    });
    groupObjectID.addSubview(buttonCopyObjectID);
    var buttonChangeObjectID = NSButton.alloc().initWithFrame(NSMakeRect(325, 0, 80, 28));
    buttonChangeObjectID.setBezelStyle(NSRoundedBezelStyle);
    buttonChangeObjectID.setTitle("Change");
    buttonChangeObjectID.setCOSJSTargetFunction(function(sender) {
        textFieldObjectID.setStringValue(NSUUID.UUID().UUIDString());
    });
    groupObjectID.addSubview(buttonChangeObjectID);
    views.push(groupObjectID);

    if (layer.class() == "MSSymbolInstance") {
        if (layer.symbolMaster().isForeign()) {
            var labelRemoteSymbolID = labelView("layer.symbolMaster().foreignObject().remoteSymbolID()");
            views.push(labelRemoteSymbolID);
            var groupRemoteSymbolID = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, 25));
            groupRemoteSymbolID.setFlipped(true);
            var textFieldRemoteSymbolID = textFieldView(layer.symbolMaster().foreignObject().remoteSymbolID());
            groupRemoteSymbolID.addSubview(textFieldRemoteSymbolID);
            var buttonCopyRemoteSymbolID = NSButton.alloc().initWithFrame(NSMakeRect(270, 0, 60, 28));
            buttonCopyRemoteSymbolID.setBezelStyle(NSRoundedBezelStyle);
            buttonCopyRemoteSymbolID.setTitle("Copy");
            buttonCopyRemoteSymbolID.setCOSJSTargetFunction(function(sender) {
                copyToPasteboard(textFieldRemoteSymbolID.stringValue());
            });
            groupRemoteSymbolID.addSubview(buttonCopyRemoteSymbolID);
            var buttonChangeRemoteSymbolID = NSButton.alloc().initWithFrame(NSMakeRect(325, 0, 80, 28));
            buttonChangeRemoteSymbolID.setBezelStyle(NSRoundedBezelStyle);
            buttonChangeRemoteSymbolID.setTitle("Change");
            buttonChangeRemoteSymbolID.setCOSJSTargetFunction(function(sender) {
                textFieldRemoteSymbolID.setStringValue(NSUUID.UUID().UUIDString());
            });
            groupRemoteSymbolID.addSubview(buttonChangeRemoteSymbolID);
            views.push(groupRemoteSymbolID);

            var labelLibraryID = labelView("layer.symbolMaster().foreignObject().libraryID()");
            views.push(labelLibraryID);
            var groupLibraryID = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, 25));
            groupLibraryID.setFlipped(true);
            var textFieldLibraryID = textFieldView(layer.symbolMaster().foreignObject().libraryID());
            groupLibraryID.addSubview(textFieldLibraryID);
            var buttonCopyLibraryID = NSButton.alloc().initWithFrame(NSMakeRect(270, 0, 60, 28));
            buttonCopyLibraryID.setBezelStyle(NSRoundedBezelStyle);
            buttonCopyLibraryID.setTitle("Copy");
            buttonCopyLibraryID.setCOSJSTargetFunction(function(sender) {
                copyToPasteboard(textFieldLibraryID.stringValue());
            });
            groupLibraryID.addSubview(buttonCopyLibraryID);
            var buttonChangeLibraryID = NSButton.alloc().initWithFrame(NSMakeRect(325, 0, 80, 28));
            buttonChangeLibraryID.setBezelStyle(NSRoundedBezelStyle);
            buttonChangeLibraryID.setTitle("Change");
            buttonChangeLibraryID.setCOSJSTargetFunction(function(sender) {
                textFieldLibraryID.setStringValue(NSUUID.UUID().UUIDString());
            });
            groupLibraryID.addSubview(buttonChangeLibraryID);
            views.push(groupLibraryID);
        }
    }

    if (layer.class() == "MSSymbolInstance" || layer.class() == "MSSymbolMaster") {
        var labelTips = labelView("DANGER AREA");
        labelTips.setTextColor(NSColor.redColor());
        views.push(labelTips);
        var labelSymbolID = labelView("layer.symbolID()");
        views.push(labelSymbolID);
        var groupSymbolID = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, 25));
        groupSymbolID.setFlipped(true);
        var textFieldSymbolID = textFieldView(layer.symbolID());
        groupSymbolID.addSubview(textFieldSymbolID);
        var buttonCopySymbolID = NSButton.alloc().initWithFrame(NSMakeRect(270, 0, 60, 28));
        buttonCopySymbolID.setBezelStyle(NSRoundedBezelStyle);
        buttonCopySymbolID.setTitle("Copy");
        buttonCopySymbolID.setCOSJSTargetFunction(function(sender) {
            copyToPasteboard(textFieldSymbolID.stringValue());
        });
        groupSymbolID.addSubview(buttonCopySymbolID);
        var buttonChangeSymbolID = NSButton.alloc().initWithFrame(NSMakeRect(325, 0, 80, 28));
        buttonChangeSymbolID.setBezelStyle(NSRoundedBezelStyle);
        buttonChangeSymbolID.setTitle("Change");
        buttonChangeSymbolID.setCOSJSTargetFunction(function(sender) {
            textFieldSymbolID.setStringValue(NSUUID.UUID().UUIDString());
        });
        groupSymbolID.addSubview(buttonChangeSymbolID);
        views.push(groupSymbolID);
    }

    dialog.views = views;
    // Run
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var idRegExp = new RegExp("[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}");

        if (idRegExp.test(textFieldObjectID.stringValue())) {
            layer.setObjectID(textFieldObjectID.stringValue());
        }

        if (layer.class() == "MSSymbolInstance" || layer.class() == "MSSymbolMaster") {
            if (idRegExp.test(textFieldSymbolID.stringValue())) {
                layer.setSymbolID(textFieldSymbolID.stringValue());
            }
        }

        if (layer.class() == "MSSymbolInstance") {
            if (layer.symbolMaster().isForeign()) {
                if (idRegExp.test(textFieldRemoteSymbolID.stringValue())) {
                    layer.symbolMaster().foreignObject().originalMaster().setSymbolID(textFieldRemoteSymbolID.stringValue());
                }
                if (idRegExp.test(textFieldLibraryID.stringValue())) {
                    layer.symbolMaster().foreignObject().setLibraryID(textFieldLibraryID.stringValue())
                }
            }
        }

    }

};

function labelView(text) {
    var textView = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 400, 16)));
    textView.setStringValue(text);
    textView.setFont(NSFont.boldSystemFontOfSize(12));
    textView.setTextColor(NSColor.blackColor());
    textView.setBezeled(false);
    textView.setDrawsBackground(false);
    textView.setEditable(false);
    textView.setSelectable(false);
    return textView;
}

function textFieldView(text, editable) {
    var textView = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 270, 25)));
    textView.setStringValue(text);
    textView.setFont(NSFont.fontWithName_size("Monaco", 12));
    if (editable == false) {
        textView.setEditable(false);
    }
    return textView;
}

function copyToPasteboard(content) {
    var ui = require("sketch/ui");
    var pasteboard = require("../modules/Pasteboard");
    pasteboard.copy(content);
    ui.message("ID \"" + content + "\" copied.");
}
