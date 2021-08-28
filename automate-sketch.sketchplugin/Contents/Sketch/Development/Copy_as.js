var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var identifier = __command.identifier();
    var pasteboard = require("../modules/Pasteboard");

    if (selectedLayers.length != 1) {
        sketch.UI.message("Please select 1 layer.");
        return;
    }

    var layer = selectedLayers[0];
    var option = {
        scales: "1",
        formats: "png",
        trimmed: false,
        output: false
    };
    
    var buffer;
    if (identifier == "copy_as_png") {
        buffer = sketch.export(layer, option);
        pasteboard.setImage(buffer.toNSData());
        sketch.UI.message("PNG copied.");
    }

    if (identifier == "copy_as_png_2x") {
        option.scales = "2";
        buffer = sketch.export(layer, option);
        pasteboard.setImage(buffer.toNSData());
        sketch.UI.message("PNG @2x copied.");
    }

    if (identifier == "copy_as_svg") {
        option.formats = "svg";
        buffer = sketch.export(layer, option);
        var svgCode = buffer.toString();
        svgCode = cleanSVG(svgCode);
        pasteboard.setText(svgCode);
        sketch.UI.message("SVG code copied.");
    }

    if (identifier == "copy_as_svg_url_encoded") {
        option.formats = "svg";
        buffer = sketch.export(layer, option);
        var svgCode = buffer.toString();
        svgCode = cleanSVG(svgCode);
        var code = "data:image/svg+xml," + encodeURIComponent(svgCode);
        code = code.replace(/%20/g, " ")
            .replace(/%22/g, "'")
            .replace(/%2C/g, ",")
            .replace(/%3D/g, "=")
            .replace(/%3A/g, ":")
            .replace(/%2F/g, "/");
        pasteboard.copy(code);
        sketch.UI.message("URL-encoded SVG code copied.");
    }

    if (identifier == "copy_as_path_data") {
        if (!["Shape", "ShapePath"].includes(layer.type)) {
            sketch.UI.message("Please select 1 shape layer.");
            return;
        }
        var bezierPath = NSBezierPath.bezierPathWithPath(layer.sketchObject.pathInBounds());
        var pathData = String(bezierPath.svgPathAttribute()).replace(/^d="/, "").replace(/"$/, "");
        pasteboard.copy(pathData);
        sketch.UI.message("SVG path data copied.");
    }

    if (identifier == "copy_as_base64") {
        var base64Code;
        if (layer.type == "Slice") {
            option.formats = layer.exportFormats[0].fileFormat;
            var size = layer.exportFormats[0].size;
            if (/(\d+(\.\d+)?)w/i.test(size)) {
                option.scales = parseFloat(size) / layer.frame.width;
            } else if (/(\d+(\.\d+)?)h/i.test(size)) {
                option.scales = parseFloat(size) / layer.frame.height;
            } else {
                option.scales = parseFloat(size);
            }
        }

        buffer = sketch.export(layer, option);
        if (option.formats == "svg") {
            var svgCode = cleanSVG(buffer.toString());
            var Buffer = require("buffer").Buffer;
            base64Code =  Buffer.from(svgCode).toString("base64");
        } else {
            base64Code = buffer.toString("base64");
        }
        var base64Preview = base64Code.substr(0, 8) + "..." + base64Code.substr(-8, 8);
        switch (option.formats) {
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
            default:
                base64Code = "data:image/png;base64," + base64Code;
        }

        pasteboard.copy(base64Code);
        sketch.UI.message("The base64 code \"" + base64Preview + "\" of slice copied.");
    }

};

function cleanSVG(svg) {
    return svg.replace(/\n/g, "")
        .replace(/>\s+</g, "><")
        .replace(/<!--.*-->/g, "")
        .replace(/<title>.*<\/title>/g, "")
        .replace(/<desc>.*<\/desc>/g, "")
        .replace(/<\?xml.*\?>/g, "");
}