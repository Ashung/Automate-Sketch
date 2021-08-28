@import "../Layer/Select_or_Remove_All_Transparency_Layers.js";

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Utilities");

    var sketch = require("sketch");
    var type = require("../modules/Type");
    var svgConfigPath = context.plugin.urlForResourceNamed("svgo_config.json").path();

    var runCommand = require("../modules/Run_Command");
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var pasteboard = require("../modules/Pasteboard");
    var document = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Place select a layer to export.");
        return;
    }

    // Dialog
    var buttons = ["Save", "Cancel"];
    if (selection.count() == 1) {
        buttons.push("Copy");
    }
    var dialog = new Dialog(
        "Export Clean Code SVG",
        "Export clean code SVG files from symbol masters, groups, without making a copy and remove layers.",
        300,
        buttons
    );

    var optionsBasic = ui.groupLabel("Basic Options");
    dialog.addView(optionsBasic);

    var fileNameLabel = ui.textLabel("Change export file path to ...");
    dialog.addView(fileNameLabel);

    var fileNameTypes = [
        "group/name.svg",
        "group_name.svg",
        "name.svg"
    ];
    if (selection.count() == 1) {
        fileNameTypes.shift();
    }

    var nameType = ui.popupButton(fileNameTypes, 200);
    ui.selectItemWithTitle_forPopupButton(preferences.get("exportSVGFileNameType") || fileNameTypes[0], nameType);
    dialog.addView(nameType);

    var divider1 = ui.divider(300);
    dialog.addView(divider1);

    var ignoreBitmap = ui.checkBox(true, "Ignore bitmap and image fill layers.");
    ignoreBitmap.setState(preferences.get("exportSVGIgnoreBitmap") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreBitmap);

    var ignoreText = ui.checkBox(true, "Ignore text layers.");
    ignoreText.setState(preferences.get("exportSVGIgnoreText") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreText);

    var ignoreSymbol = ui.checkBox(true, "Ignore symbol instances.");
    ignoreSymbol.setState(preferences.get("exportSVGIgnoreSymbol") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreSymbol);

    var ignoreTransparency = ui.checkBox(true, "Ignore transparency layers except mask.");
    ignoreTransparency.setState(preferences.get("exportSVGIgnoreTransparency") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreTransparency);

    var ignoreMask = ui.checkBox(true, "Release clipping mask.");
    ignoreMask.setState(preferences.get("exportSVGIgnoreMask") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreMask);

    var divider2 = ui.divider(300);
    dialog.addView(divider2);

    var ignoreLayerName = ui.checkBox(false, "Ignore layer with following names.");
    ignoreLayerName.setState(preferences.get("exportSVGIgnoreLayerName") == true ? NSOnState : NSOffState);
    dialog.addView(ignoreLayerName);

    var defaultIgnoreLayerName = preferences.get("ignoreLayerName") || "#";
    var ignoreLayerNames = ui.textField(defaultIgnoreLayerName);
    ui.disableTextField(ignoreLayerNames);
    dialog.addView(ignoreLayerNames);

    var optionsAdvanced = ui.groupLabel("Advanced Options");
    dialog.addView(optionsAdvanced);

    var ungroup = ui.checkBox(false, "Ungroup all layer group inside.");
    ungroup.setState(preferences.get("exportSVGUngroup") == true ? NSOnState : NSOffState);
    dialog.addView(ungroup);

    var flattenAllLayer = ui.checkBox(false, "Flatten all layers.");
    flattenAllLayer.setState(preferences.get("exportSVGFlatten") == true ? NSOnState : NSOffState);
    dialog.addView(flattenAllLayer);

    var changeFillRule = ui.checkBox(false, "Change path fill rule to Non-Zero.");
    changeFillRule.setState(preferences.get("exportSVGFillRule") == true ? NSOnState : NSOffState);
    dialog.addView(changeFillRule);

    var colorView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 20));
    var changeColor = ui.checkBox(false, "Change path fill / border color to ...");
    changeColor.setState(preferences.get("exportSVGChangeColor") == true ? NSOnState : NSOffState);
    colorView.addSubview(changeColor);
    var colorPicker = ui.colorPicker([240, 0, 40, 20]);
    var defaultColorValue = preferences.get("exportSVGFillColor") || "#000000";
    colorPicker.setColor(hexValueToNSColor(defaultColorValue));
    colorView.addSubview(colorPicker);
    dialog.addView(colorView);

    var useSVGO = ui.checkBox(false, "Optimizing SVG code with SVGO (slowly).");
    useSVGO.setState(preferences.get("exportSVGOptimise") == true ? NSOnState : NSOffState);
    dialog.addView(useSVGO);

    dialog.addLabel("Choose a JSON for SVGO config. (Optional)");
    var customSVGOConfigFileView = ui.view([0, 0, 300, 25]);
    var customSVGOConfigFileText = ui.textField("", [0, 0, 210, 25]);
    var customSVGOConfigFilePath = preferences.get("exportSVGConfigFilePath");
    if (customSVGOConfigFilePath) {
        if (system.fileExists(customSVGOConfigFilePath)) {
            customSVGOConfigFileText.setStringValue(customSVGOConfigFilePath);
        }
    }
    ui.disableTextField(customSVGOConfigFileText);

    var customSVGOConfigFileButton = ui.button("Choose", [220, 0, 80, 25]);
    customSVGOConfigFileButton.setEnabled(preferences.get("exportSVGOptimise") == true ? true : false);
    customSVGOConfigFileView.addSubview(customSVGOConfigFileText);
    customSVGOConfigFileView.addSubview(customSVGOConfigFileButton);
    dialog.addView(customSVGOConfigFileView);

    ignoreLayerName.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState) {
            ui.disableTextField(ignoreLayerNames, false);
        } else {
            ui.disableTextField(ignoreLayerNames, true);
        }
    });

    useSVGO.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState) {
            customSVGOConfigFileButton.setEnabled(true);
        } else {
            customSVGOConfigFileButton.setEnabled(false);
        }
    });

    customSVGOConfigFileButton.setCOSJSTargetFunction(function(sender) {
        var filePath = system.chooseFile(["json"]);
        if (filePath) {
            customSVGOConfigFileText.setStringValue(filePath);
            svgConfigPath = filePath;
        }
    });

    // Run
    var responseCode = dialog.run();

    if (responseCode) {
        preferences.set("exportSVGFileNameType", nameType.titleOfSelectedItem())
        preferences.set("exportSVGIgnoreBitmap", ignoreBitmap.state() == NSOnState ? true : false);
        preferences.set("exportSVGIgnoreText", ignoreText.state() == NSOnState ? true : false);
        preferences.set("exportSVGIgnoreSymbol", ignoreSymbol.state() == NSOnState ? true : false);
        preferences.set("exportSVGIgnoreTransparency", ignoreTransparency.state() == NSOnState ? true : false);
        preferences.set("exportSVGIgnoreMask", ignoreMask.state() == NSOnState ? true : false);
        preferences.set("exportSVGIgnoreLayerName", ignoreLayerName.state() == NSOnState ? true : false);
        preferences.set("ignoreLayerName", ignoreLayerNames.stringValue());
        preferences.set("exportSVGUngroup", ungroup.state() == NSOnState ? true : false);
        preferences.set("exportSVGFlatten", flattenAllLayer.state() == NSOnState ? true : false);
        preferences.set("exportSVGFillRule", changeFillRule.state() == NSOnState ? true : false);
        preferences.set("exportSVGChangeColor", changeColor.state() == NSOnState ? true : false);
        preferences.set("exportSVGFillColor", nsColorToHexValue(colorPicker.color()));
        preferences.set("exportSVGOptimise", useSVGO.state() == NSOnState ? true : false);
        preferences.set("exportSVGConfigFilePath", customSVGOConfigFileText.stringValue());
    }

    if (responseCode == 1000 || responseCode == 1002) {

        if (useSVGO.state() == NSOnState) {
            var svgo = "";
            runCommand("/bin/bash", ["-l", "-c", "which svgo"], function(status, msg) {
                if (status && msg != "") {
                    svgo += msg;
                    svgo = svgo.replace(/\s*$/g, "");
                }
            });
            if (svgo == "") {
                document.showMessage("You have to install SVGO.");
                return;
            }
        }

        var ignoreLayerNamesArray = [];
        if (ignoreLayerName.state() == NSOnState) {
            ignoreLayerNamesArray = ignoreLayerNames.stringValue().split(/\s*,\s*/);
        }

        var savePanel;
        var savePath;
        if (responseCode == 1000) {
            if (selection.count() == 1) {
                var fileName = fixedLayerName(selection.firstObject().name(), nameType.indexOfSelectedItem() + 1);
                savePanel = NSSavePanel.savePanel();
                savePanel.setTitle("Save as SVG");
                savePanel.setShowsTagField(false);
                savePanel.setNameFieldStringValue(fileName);
                savePanel.setCanCreateDirectories(true);
            } else {
                savePanel = NSOpenPanel.openPanel();
                savePanel.setMessage("Export selected layers as SVG");
                savePanel.setCanChooseDirectories(true);
                savePanel.setCanChooseFiles(false);
                savePanel.setCanCreateDirectories(true);
            }
            if (savePanel.runModal() == NSModalResponseOK) {
                savePath = savePanel.URL().path();
            }
        }

        var exportedSVGFiles = NSMutableArray.alloc().init();
        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {

            var layerCopy = layer.duplicate();

            if (ungroup.state() == NSOnState) {
                var groupsInChild = layerCopy.children().filteredArrayUsingPredicate(NSPredicate.predicateWithFormat('className == "MSLayerGroup"'));
                var loopGroups = groupsInChild.reverseObjectEnumerator();
                var group;
                while (group = loopGroups.nextObject()) {
                    group.ungroup();
                }
            }

            var children = layerCopy.children();
            var predicate = NSPredicate.predicateWithFormat('\
                className == "MSShapeGroup" || \
                className == "MSBitmapLayer" || \
                className == "MSLayerGroup" || \
                className == "MSTextLayer" || \
                className == "MSSymbolInstance" ||\
                className == "MSRectangleShape" || \
                className == "MSOvalShape" || \
                className== "MSShapePathLayer" || \
                className == "MSTriangleShape" || \
                className == "MSStarShape" || \
                className == "MSPolygonShape"'
            );
            var predicate = NSPredicate.predicateWithFormat('className == "MSRectangleShape"')
            var children = children.filteredArrayUsingPredicate(predicate);

            var loopChildren = children.objectEnumerator();
            var children;
            while (children = loopChildren.nextObject()) {

                // Basic Options
                if (
                    (ignoreBitmap.state() == NSOnState && type.isBitmap(children)) ||
                    (ignoreText.state() == NSOnState && type.isText(children)) ||
                    (ignoreSymbol.state() == NSOnState && type.isSymbolInstance(children)) ||
                    (ignoreTransparency.state() == NSOnState && layerIsTransparency(children) && !children.hasClippingMask()) ||
                    (ignoreLayerName.state() == NSOnState && ignoreLayerNamesArray.indexOf(children.name()) >= 0)
                ) {
                    children.removeFromParent();
                }

                if (ignoreBitmap.state() == NSOnState && type.isShape(children)) {
                    if (children.style().enabledFills().count() > 0) {
                        if (
                            children.style().enabledFills().lastObject().fillType() == 4 ||
                            children.style().enabledFills().lastObject().fillType() == 5
                        ) {
                            children.removeFromParent();
                        }
                    }
                }

                if (ignoreMask.state() == NSOnState && children.hasClippingMask()) {
                    children.setHasClippingMask(false);
                    if (children.style().enabledFills().count() == 0) {
                        var fill = children.style().addStylePartOfType(0);
                        fill.setFillType(0);
                        fill.setColor(MSColor.blackColor());
                    }
                }

                // Advanced Options
                if (changeFillRule.state() == NSOnState && type.isShape(children)) {
                    if (sketch.version.sketch >= 51) {
                        children.style().setWindingRule(0);
                    }
                    else {
                        children.setWindingRule(0);
                    }
                }

                if (flattenAllLayer.state() == NSOnState && type.isShape(children)) {
                    if (children.canFlatten() && children.class() == "MSShapeGroup") {
                        children.flatten();
                    }
                }

                if (changeColor.state() == NSOnState && type.isShape(children)) {
                    var color = colorPicker.color();
                    if (children.style().enabledFills().count() > 0) {
                        children.style().enabledFills().lastObject().setColor(MSColor.colorWithNSColor(color));
                    }
                    if (children.style().enabledBorders().count() > 0) {
                        children.style().enabledBorders().lastObject().setColor(MSColor.colorWithNSColor(color));
                    }
                }

            }

            var ancestry = layerCopy.ancestry();
            var exportRequest = MSExportRequest.exportRequestsFromLayerAncestry(ancestry).firstObject();
            exportRequest.setFormat("svg");
            var exporter = MSExporter.exporterForRequest_colorSpace(exportRequest, NSColorSpace.sRGBColorSpace());
            var svgData = exporter.data();
            var svgCode = NSString.alloc().initWithData_encoding(svgData, NSUTF8StringEncoding);

            svgCode = svgCode.replace(/\s+<!--.*-->/, "")
                .replace(/\s+<title>.*<\/title>/, "")
                .replace(/\s+<desc>.*<\/desc>/, "")
                .replace(/\s+<defs><\/defs>/, "");

            if (useSVGO.state() == NSOnState) {

                var config = require(svgConfigPath);
                runCommand(
                    "/bin/bash",
                    ["-l", "-c", svgo + " --config='" + JSON.stringify(config) + "' -s '" + svgCode + "'"],
                    function(status, msg) {
                        if (status && msg != "") {
                            svgCode = msg;
                            svgCode = svgCode.replace(/\s*$/g, "");
                        }
                    }
                );

            }

            layerCopy.removeFromParent();

            if (responseCode == 1002 && selection.count() == 1) {
                pasteboard.copy(svgCode);
            }

            if (savePath) {
                var svgPath;
                if (selection.count() == 1) {
                    if (savePath.pathExtension() != "svg") {
                        svgPath = savePath.stringByAppendingString(".svg");
                    } else {
                        svgPath = savePath;
                    }
                } else {
                    var layerName = fixedLayerName(layer.name(), nameType.indexOfSelectedItem());
                    var fileName = NSString.stringWithString(layerName);
                    if (fileName.pathExtension() != "svg") {
                        fileName = fileName.stringByAppendingString(".svg");
                    }
                    svgPath = savePath.stringByAppendingPathComponent(fileName);
                }
                writeContentToFile(svgPath, svgCode);
                exportedSVGFiles.addObject(NSURL.fileURLWithPath(svgPath));
            }
        }

        if (exportedSVGFiles.count() > 0) {
            NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs(exportedSVGFiles);
        }

    }

};

function writeContentToFile(filePath, content) {
    var fileManager = NSFileManager.defaultManager();
    var parentDir = NSString.stringWithString(filePath).stringByDeletingLastPathComponent();
    if (!fileManager.fileExistsAtPath(parentDir)) {
        fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(
            parentDir, true, nil, nil
        );
    }
    content = NSString.stringWithString(content);
    content.writeToFile_atomically_encoding_error_(
        filePath, true, NSUTF8StringEncoding, nil
    );
}

function fixedLayerName(layerName, type) {
    var result;
    if (!type || type == 0) {
        result = layerName.replace(/\s*\/\s*/g, "/").trim();
    }
    if (type == 1) {
        result = layerName.replace(/\s*\/\s*/g, "_").trim();
    }
    if (type == 2) {
        result = layerName.replace(/.*(\/)/, "").trim();
    }
    result = result.replace(/\s+/g, "_").toLowerCase();
    return result;
}

function hexValueToNSColor(hexValue) {
    return MSImmutableColor.colorWithSVGString(hexValue).NSColorWithColorSpace(nil);
}

function nsColorToHexValue(nsColor) {
    var msColor = MSColor.colorWithNSColor(nsColor);
    var hexValue = "#" + msColor.immutableModelObject().hexValue();
    if (msColor.alpha() != 1) {
        var alphaHex = Math.round(msColor.alpha() * 255).toString(16);
        if (alphaHex.length == 1) {
            alphaHex = "0" + alphaHex;
        }
        hexValue += alphaHex;
    }
    return hexValue;
}
