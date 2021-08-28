var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var pasteboard = require("../modules/Pasteboard");
    var doc = context.document;
    var selection = context.selection;

    if (selection.count() == 1 && selection.firstObject().class() == "MSSliceLayer") {

        var slice = selection.firstObject();
        var exportRequest = MSExportRequest.exportRequestsFromExportableLayer_inRect_useIDForName(
            slice, slice.absoluteInfluenceRect(), false
        ).firstObject();
        var format = exportRequest.format();
        var exporter = MSExporter.exporterForRequest_colorSpace(exportRequest, NSColorSpace.sRGBColorSpace());
        var imageData = exporter.data();
        var base64Code = imageData.base64EncodedStringWithOptions(NSDataBase64EncodingEndLineWithLineFeed);
        var base64Preview = base64Code.substr(0, 8) + "..." + base64Code.substr(-8, 8);

        switch (format + "") {
            case "png":
                base64Code = "data:image/png;base64," + base64Code;
                break;
            case "jpg":
                base64Code = "data:image/jpeg;base64," + base64Code;
                break;
            case "tif":
                base64Code = "data:image/tiff;base64," + base64Code;
                break;
            case "webp":
                base64Code = "data:image/webp;base64," + base64Code;
                break;
            case "svg":
                base64Code = "data:image/svg+xml;base64," + base64Code;
                break;
        }

        // Paste board
        pasteboard.copy(base64Code);

        doc.showMessage("The base64 code \"" + base64Preview + "\" of slice copied.");

    } else {
        doc.showMessage("Please select 1 slice layer.");
    }

};
