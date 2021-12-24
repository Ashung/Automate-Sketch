var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();
    var pasteboard = require("../modules/Pasteboard");

    var layers = document.selectedLayers.layers;
    if (layers.length != 1) {
        sketch.UI.message('Please select 1 layer.');
        return;
    }

    var layer = layers[0];
    if (layer.style.fills.length == 0) {
        sketch.UI.message('No fills.');
        return;
    }

    var fill = layer.style.fills[0];
    if (fill.fillType != "Color") {
        sketch.UI.message('No a color fill.');
        return;
    }

    var color = fill.color;

    if (identifier == "copy_color_as_css_hex") {
        var code = color.substring(0, 7).toUpperCase();
        pasteboard.setText(code);
    }

    if (identifier == "copy_color_as_css_hex8") {
        var code = color.toUpperCase();
        pasteboard.setText(code);
    }

    if (identifier == "copy_color_as_css_rgb") {
        var r = parseInt(color.substring(1, 3), 16);
        var g = parseInt(color.substring(3, 5), 16);
        var b = parseInt(color.substring(5, 7), 16);
        var a = parseInt(color.substring(7, 9), 16);
        var code = '';
        if (a == 255) {
            code = `rgb(${r}, ${g}, ${b})`;
        } else {
            code = `rgba(${r}, ${g}, ${b}, ${Math.round((a/255)*100)/100})`;
        }
        pasteboard.setText(code);
    }

    if (identifier == "copy_color_as_css_hsl") {
        
    }
    

    sketch.UI.message('Copied.');
}

// #000000
// rgba(0, 0, 0, 1.00)
// hsla(0, 0, 0, 1.00)
// [NSColor colorWithSRGBRed:0.000 green:0.000 blue:0.000 alpha:1.00]
// NSColor(srgbRed:0.000, green:0.000, blue:0.000, alpha:1.00)
// [UIColor colorWithRed:0.000 green:0.000 blue:0.000 alpha:1.00]
// UIColor(red:0.000, green:0.000, blue:0.000, alpha:1.00)

// Color.valueOf(0xffff0000)