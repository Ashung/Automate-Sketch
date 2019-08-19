var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var doc = context.document;

    if (doc.artboards().count() > 0) {

        // Dialog
        var dialog = new Dialog(
            "Export All Artboards to HTML",
            "Choose the image format.\nArtboards beginning with \".\" will be ignored."
        );

        // Radio buttons
        var buttonFormat = NSButtonCell.alloc().init();
            buttonFormat.setButtonType(NSRadioButton);
        var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
            NSMakeRect(0, 0, 300, 50),
            NSRadioModeMatrix,
            buttonFormat,
            2,
            1
        );
        matrixFormat.setCellSize(CGSizeMake(300, 25));
        var cells = matrixFormat.cells();
            cells.objectAtIndex(0).setTitle("PNG, recommend for UI desigin.");
            cells.objectAtIndex(1).setTitle("SVG, recommend for icon design.");
        dialog.setView(matrixFormat);

        var responseCode = dialog.run();
        if (responseCode == 1000) {

            var savePath = system.chooseFolder();
            if (savePath) {

                var htmlTemplatePath = context.plugin.urlForResourceNamed("Export_All_Artboards_to_HTML.html").path();
                var htmlTemplate = NSString.stringWithContentsOfFile_encoding_error_(
                    htmlTemplatePath, NSUTF8StringEncoding, nil
                );
                var htmlContent = "";
                var htmlTitle = doc.displayName().replace(/\.sketch$/, "");

                var selectedRadioIndex = matrixFormat.cells().indexOfObject(matrixFormat.selectedCell());

                switch (selectedRadioIndex) {
                    case 0:
                        var imageFormat = "png";
                        break;
                    case 1:
                        var imageFormat = "svg";
                        break;
                    default:
                        var imageFormat = "png";
                }

                var assetsPath = savePath + "/assets";
                var htmlPath = savePath + "/index.html";
                // Remove "assets" folder
                if (NSFileManager.defaultManager().fileExistsAtPath_(assetsPath)) {
                    NSFileManager.defaultManager().removeItemAtPath_error_(assetsPath, nil);
                }

                var loopArtboards = doc.artboards().objectEnumerator();
                var artboard;
                while (artboard = loopArtboards.nextObject()) {

                    if (!/^\./.test(artboard.name())) {

                        var name = artboard.name().replace(/[<>\\\|:""*\?]/g, "_").substring(0, 255);

                        var exportFormat = MSExportFormat.alloc().init();
                        var exportRequest = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(
                            exportFormat, artboard, artboard.frame().rect(), false
                        );

                        exportRequest.setShouldTrim(false);
                        exportRequest.setFormat(imageFormat);
                        exportRequest.setScale(2);

                        // Artboard background color
                        if (selectedRadioIndex == 0) {
                            exportRequest.setBackgroundColor(artboard.backgroundColor());
                        }

                        doc.saveExportRequest_toFile(exportRequest, savePath + "/assets/" + name + "." + imageFormat);

                        // HTML
                        var imgWidth = artboard.frame().width();
                        var imgHeight = artboard.frame().height();
                        htmlContent += '<li class="item"><div class="image"><img alt="" src="assets/' + name + '.' + imageFormat + '" width="' + imgWidth + '" height="' + imgHeight + '"></div><div class="title">' + name + '</div></li>\n';

                    }
                }

                htmlTemplate = htmlTemplate.replace(/{{content}}/, htmlContent);
                htmlTemplate = htmlTemplate.replace(/{{title}}/g, htmlTitle);

                NSString.stringWithString(htmlTemplate).writeToFile_atomically_encoding_error_(
                    htmlPath, true, NSUTF8StringEncoding, null
                );

                system.showInFinder(savePath);
            }
        }

    } else {
        doc.showMessage("No artboards in current document.");
    }

};
