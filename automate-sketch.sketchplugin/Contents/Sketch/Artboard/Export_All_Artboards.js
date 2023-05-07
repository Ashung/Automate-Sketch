var sketch = require("sketch")

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var util = require("util");
    var document = sketch.getSelectedDocument();
    var documentData = document._getMSDocumentData();

    if (documentData.allArtboards().count() == 0) {
        sketch.UI.message("No artboards in current document.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Export All Artboards"
    );

    dialog.addLabel("Export:");
    var typesView = ui.popupButton([
        "Artboards",
        "Symbol Masters",
        "Artboards & Symbol Masters",
        "Artboards in Current Page",
        "Symbol Masters in Current Page",
        "Artboards & Symbol Masters in Current Page",
    ]);
    dialog.addView(typesView);

    dialog.addDivider();

    var useExportPresets = ui.checkBox(false, "Use artboard export settings.");
    dialog.addView(useExportPresets);

    dialog.addLabel("Choose a Format and Scale:");
    var groupView1 = ui.view(25);
    var formatsView = ui.popupButton(["PNG", "JPG", "PDF", "SVG"], [0, 0, 100, 25]);
    var scales = [1, 1.5, 2, 2.5, 3, 4];
    var scalesView = ui.popupButton(scales.map(function(scale) {
        return scale + "x";
    }), [110, 0, 100, 25]);
    groupView1.addSubview(formatsView);
    groupView1.addSubview(scalesView);
    dialog.addView(groupView1);

    dialog.addLabel('Prefix and Suffix of Artboard:');
    var groupView2 = ui.view(25);
    var prefixView = ui.textField("", [0, 0, 100, 24]);
    var suffixView = ui.textField("", [110, 0, 100, 24]);
    groupView2.addSubview(prefixView);
    groupView2.addSubview(suffixView);
    dialog.addView(groupView2);

    dialog.addDivider();

    dialog.addLabel('Convert Asset Name to:');
    var nameFormats = [
        "No convert",
        "[prefix]group_name/layer_name[suffix]",
        "[prefix]group-name/layer-name[suffix]",
        "[prefix]group_name_layer_name[suffix]",
        "[prefix]group-name-layer-name[suffix]",
        "[prefix]layer_name[suffix]",
        "[prefix]layer-name[suffix]"
    ];
    var nameFormatsWithPage = [
        "No convert",
        "page_name/[prefix]group_name/layer_name[suffix]",
        "page-name/[prefix]group-name/layer-name[suffix]",
        "page_name_[prefix]group_name_layer_name[suffix]",
        "page-name-[prefix]group-name-layer-name[suffix]",
        "page_name/[prefix]layer_name[suffix]",
        "page-name/[prefix]layer-name[suffix]",
        "page_name_[prefix]layer_name[suffix]",
        "page-name-[prefix]layer-name[suffix]",
    ];
    var pageView = ui.checkBox(false, 'Include Page Name.');
    dialog.addView(pageView);
    var convertView = ui.popupButton(nameFormats);
    dialog.addView(convertView);

    useExportPresets.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOffState) {
            formatsView.setEnabled(true);
            scalesView.setEnabled(true);
            prefixView.setEnabled(true);
            suffixView.setEnabled(true);
        } else {
            formatsView.setEnabled(false);
            scalesView.setEnabled(false);
            prefixView.setEnabled(false);
            suffixView.setEnabled(false);
        }
    })

    pageView.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOffState) {
            ui.setItems_forPopupButton(nameFormats, convertView);
        } else {
            ui.setItems_forPopupButton(nameFormatsWithPage, convertView);
        }
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        var savePath = system.chooseFolder();
        if (savePath) {
            var exportLayers;
            var artboardsInCurrentPage = document.selectedPage.sketchObject.artboards();
            var typeIndex = typesView.indexOfSelectedItem();
            if (typeIndex == 0) {
                exportLayers = documentData.allArtboards().mutableCopy();
                exportLayers.removeObjectsInArray(documentData.localSymbols());
            } else if (typeIndex == 1) {
                exportLayers = documentData.localSymbols();
            } else if (typeIndex == 2) {
                exportLayers = documentData.allArtboards();
            } else if (typeIndex == 3) {
                var predicate = NSPredicate.predicateWithFormat("className == %@", "MSArtboardGroup");
                exportLayers = artboardsInCurrentPage.filteredArrayUsingPredicate(predicate);
            } else if (typeIndex == 4) {
                var predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolMaster");
                exportLayers = artboardsInCurrentPage.filteredArrayUsingPredicate(predicate);
            } else if (typeIndex == 5) {
                exportLayers = document.selectedPage.sketchObject.artboards();
            }
            util.toArray(exportLayers).forEach(function(layer) {
                if (useExportPresets.state() == NSOffState) {
                    var scale = scales[scalesView.indexOfSelectedItem()];
                    var format = formatsView.titleOfSelectedItem();
                    var prefix = prefixView.stringValue();
                    var suffix = suffixView.stringValue();
                    var exportFormat = MSExportFormat.alloc().init();
                    var exportRequest = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(
                        exportFormat, layer, layer.frame().rect(), false
                    );
                    exportRequest.setShouldTrim(false);
                    exportRequest.setFormat(format);
                    exportRequest.setScale(scale);

                    var nameFormat = convertView.indexOfSelectedItem();
                    var regSlash = /\s?[\/\\]+\s?/;
                    var fullPath;
                    var pathParts;
                    if (pageView.state() == NSOffState) {
                        if (nameFormat == 1) {
                            pathParts = (prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 2) {
                            pathParts = (prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 3) {
                            pathParts = (prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("_");
                        } else if (nameFormat == 4) {
                            pathParts = (prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("-");
                        } else if (nameFormat == 5) {
                            pathParts = (prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("");
                        } else if (nameFormat == 6) {
                            pathParts = (prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("");
                        } else {
                            fullPath = prefix + layer.name().trim() + suffix;
                        }
                    } else {
                        var pageName = layer.parentPage().name();
                        if (nameFormat == 1) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 2) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 3) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("_");
                        } else if (nameFormat == 4) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("-");
                        } else if (nameFormat == 5) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 6) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("/");
                        } else if (nameFormat == 7) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                            fullPath = pathParts.join("_");
                        } else if (nameFormat == 8) {
                            pathParts = (pageName + '/' + prefix + layer.name().trim().split(regSlash).pop() + suffix).split(regSlash).filter(removeEmpty).map(formatNameDash);
                            fullPath = pathParts.join("-");
                        } else {
                            fullPath = pageName + '/' + prefix + layer.name() + suffix;
                        }
                    }
                    fullPath = savePath + '/' + fullPath + '.' + format.toLowerCase();
                    document.sketchObject.saveExportRequest_toFile(exportRequest, fullPath);
                } else {
                    var exportRequests = MSExportRequest.exportRequestsFromLayerAncestry_exportFormats_inRect(
                        layer.ancestry(), layer.exportOptions().exportFormats(), layer.frame().rect()
                    );
                    if (exportRequests.count() == 0) {
                        var exportFormat = MSExportFormat.alloc().init();
                        var exportRequest = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(
                            exportFormat, layer, layer.frame().rect(), false
                        );
                        exportRequests.addObject(exportRequest);
                    }
                    util.toArray(exportRequests).forEach(function(exportRequest) {
                        var nameFormat = convertView.indexOfSelectedItem();
                        var regSlash = /\s?[\/\\]+\s?/;
                        var fullPath;
                        var pathParts;
                        if (pageView.state() == NSOffState) {
                            if (nameFormat == 1) {
                                pathParts = exportRequest.name().trim().split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 2) {
                                pathParts = exportRequest.name().trim().split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 3) {
                                pathParts = exportRequest.name().trim().split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("_");
                            } else if (nameFormat == 4) {
                                pathParts = exportRequest.name().trim().split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("-");
                            } else if (nameFormat == 5) {
                                pathParts = exportRequest.name().trim().split(regSlash).pop().split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("");
                            } else if (nameFormat == 6) {
                                pathParts = exportRequest.name().trim().split(regSlash).pop().split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("");
                            } else {
                                fullPath = exportRequest.name().trim();
                            }
                        } else {
                            var pageName = layer.parentPage().name();
                            if (nameFormat == 1) {
                                pathParts = (pageName + '/' + exportRequest.name().trim()).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 2) {
                                pathParts = (pageName + '/' + exportRequest.name().trim()).split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 3) {
                                pathParts = (pageName + '/' + exportRequest.name().trim()).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("_");
                            } else if (nameFormat == 4) {
                                pathParts = (pageName + '/' + exportRequest.name().trim()).split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("-");
                            } else if (nameFormat == 5) {
                                pathParts = (pageName + '/' + exportRequest.name().trim().split(regSlash).pop()).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 6) {
                                pathParts = (pageName + '/' + exportRequest.name().trim().split(regSlash).pop()).split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("/");
                            } else if (nameFormat == 7) {
                                pathParts = (pageName + '/' + exportRequest.name().trim().split(regSlash).pop()).split(regSlash).filter(removeEmpty).map(formatNameUnderLine);
                                fullPath = pathParts.join("_");
                            } else if (nameFormat == 8) {
                                pathParts = (pageName + '/' + exportRequest.name().trim().split(regSlash).pop()).split(regSlash).filter(removeEmpty).map(formatNameDash);
                                fullPath = pathParts.join("-");
                            } else {
                                fullPath = pageName + '/' + exportRequest.name();
                            }
                        }
                        fullPath = savePath + '/' + fullPath + '.' + exportRequest.format();
                        document.sketchObject.saveExportRequest_toFile(exportRequest, fullPath);
                    });
                }
            });
            system.showInFinder(savePath);
        }
    }
};

function removeEmpty(name) {
    return name != "";
}

function formatNameUnderLine(name) {
    return name.trim().replace(/\s+/g, "_").replace(/-/g, "_").toLowerCase();
}

function formatNameDash(name) {
    return name.trim().replace(/\s+/g, "-").replace(/_/g, "-").toLowerCase();
}
