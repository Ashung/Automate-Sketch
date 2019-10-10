var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Slice");

    var pasteboard = require("../modules/Pasteboard");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;
    var identifier = __command.identifier();

    if (selectedLayers.length != 1 || selectedLayers[0].type != "Slice") {
        sketch.UI.message("Please select 1 slice layer.")
        return;
    }

    var slice = selectedLayers[0];
    var options = {
        formats: "svg",
        output: false
    }
    var svgCode = sketch.export(slice, options).toString();
    
    svgCode = svgCode.replace(/\n/g, "")
        .replace(/>\s+</g, "><")
        .replace(/<!--.*-->/g, "")
        .replace(/<title>.*<\/title>/g, "")
        .replace(/<desc>.*<\/desc>/g, "")
        .replace(/<\?xml.*\?>/g, "")
        .replace(/\s?version="1.1"/g, "")
        // .replace(/\s?xmlns="http:\/\/www.w3.org\/2000\/svg"/g, "")
        .replace(/\s?xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/g, "")
    
    if (identifier == "copy_svg_code") {
        pasteboard.pbcopy(svgCode);
        sketch.UI.message("SVG code copied.");
    }

    if (identifier == "copy_svg_code_url_encoded") {
        var code = "data:image/svg+xml," + encodeURIComponent(svgCode);
        code = code.replace(/%20/g, " ")
            .replace(/%22/g, "'")
            .replace(/%2C/g, ",")
            .replace(/%3D/g, "=")
            .replace(/%3A/g, ":")
            .replace(/%2F/g, "/");
        pasteboard.pbcopy(code);
        sketch.UI.message("URL-encoded SVG code copied.");
    }

};