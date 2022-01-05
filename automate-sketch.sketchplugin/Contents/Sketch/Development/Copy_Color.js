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
        var _r = parseInt(color.substring(1, 3), 16) / 255;
        var _g = parseInt(color.substring(3, 5), 16) / 255;
        var _b = parseInt(color.substring(5, 7), 16) / 255;
        var _a = parseInt(color.substring(7, 9), 16) / 255;
        var max = Math.max(_r, _g, _b);
        var min = Math.min(_r, _g, _b);
        var d = max - min;
        var h, s, l;
        l = (max + min) / 2;
        if (d == 0) {
            h = 0;
            s = 0;
        } else {
            s = d / (1 - Math.abs(2 * l - 1));
            switch(max) {
                case _r:
                    h = ((_g - _b) / d) % 6;
                    break;
                case _g:
                    h = (_b - _r) / d + 2;
                    break;
                case _b:
                    h = (_r - _g) / d + 4;
                    break;
            }
        }
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        var code = '';
        if (_a == 1) {
            code = `hsl(${h}, ${s}%, ${l}%)`;
        } else {
            code = `hsla(${h}, ${s}%, ${l}%, ${Math.round(_a*100)/100})`;
        }
        pasteboard.setText(code);
    }

    if (
        identifier == "copy_color_as_nscolor_objective_c" ||
        identifier == "copy_color_as_nscolor_swift" ||
        identifier == "copy_color_as_uicolor_objective_c" ||
        identifier == "copy_color_as_uicolor_swift"
    ) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        var a = color.substring(7, 9);
        [r, g, b, a] = [r, g, b, a].map(function(v) {
            return (parseInt(v, 16) / 255).toFixed(3);
        })
        var code = "";
        if (identifier == "copy_color_as_uicolor_objective_c") {
            code = `[UIColor colorWithRed:${r} green:${g} blue:${b} alpha:${a}]`;
        } else if (identifier == "copy_color_as_uicolor_swift") {
            code = `UIColor(red:${r}, green:${g}, blue:${b}, alpha:${a})`;
        } else {
            // P3 sRGB Unmanaged
            var colorSpace = document.colorSpace;
            if (colorSpace == "Unmanaged") {
                switch (identifier) {
                    case "copy_color_as_nscolor_objective_c":
                        code = `[NSColor colorWithRed:${r} green:${g} blue:${b} alpha:${a}]`;
                        break;
                    case "copy_color_as_nscolor_swift":
                        code = `NSColor(red:${r}, green:${g}, blue:${b}, alpha:${a})`;
                        break;
                }
            } else if (colorSpace == "sRGB") {
                switch (identifier) {
                    case "copy_color_as_nscolor_objective_c":
                        code = `[NSColor colorWithSRGBRed:${r} green:${g} blue:${b} alpha:${a}]`;
                        break;
                    case "copy_color_as_nscolor_swift":
                        code = `NSColor(srgbRed:${r}, green:${g}, blue:${b}, alpha:${a})`;
                        break;
                }
            } else if (colorSpace == "P3") {
                switch (identifier) {
                    case "copy_color_as_nscolor_objective_c":
                        code = `[NSColor colorWithDisplayP3Red:${r} green:${g} blue:${b} alpha:${a}]`;
                        break;
                    case "copy_color_as_nscolor_swift":
                        code = `NSColor(displayP3Red:${r}, green:${g}, blue:${b}, alpha:${a})`;
                        break;
                }
            }
        }
        pasteboard.setText(code);
    }
    
    if (identifier == "copy_color_as_android_xml") {
        var code = ("#" + color.substring(7, 9) + color.substring(1, 7)).toUpperCase();
        pasteboard.setText(code);
        console.log(code)
    }

    sketch.UI.message('Copied.');
}