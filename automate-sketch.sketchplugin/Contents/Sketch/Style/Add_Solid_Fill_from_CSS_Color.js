var colorKeywords = {
    "black": "#000000",
    "silver": "#c0c0c0",
    "gray": "#808080",
    "white": "#ffffff",
    "maroon": "#800000",
    "red": "#ff0000",
    "purple": "#800080",
    "fuchsia": "#ff00ff",
    "green": "#008000",
    "lime": "#00ff00",
    "olive": "#808000",
    "yellow": "#ffff00",
    "navy": "#000080",
    "blue": "#0000ff",
    "teal": "#008080",
    "aqua": "#00ffff",
    "orange": "#ffa500",
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "blanchedalmond": "#ffe4c4",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "oldlace": "#fdf5e6",
    "olivedrab": "#6b8e23",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "whitesmoke": "#f5f5f5",
    "yellowgreen": "#9acd32",
    "rebeccapurple": "#663399"
};

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var type = require("../modules/Type");
    var sketchUI = require("sketch/ui");

    var doc = context.document;
    var selection = context.selection;

    if (selection.count() > 0) {

        var rgba = [0, 0, 0, 1];

        // Create a random color
        var randomColors = [];

        var colorKeywordsKeys = Object.keys(colorKeywords);
        var randomKeyword = colorKeywordsKeys[Math.round(Math.random() * (colorKeywordsKeys.length - 1))]
        randomColors.push(randomKeyword);

        var hexNumber = "0123456789abcdef";
        var randomHex = "#"
        for (var i = 0; i < 6; i++) {
            randomHex += hexNumber.substr(Math.round(Math.random() * (hexNumber.length - 1)), 1);
        }
        randomColors.push(randomHex);

        var randomRgb = "rgb(" + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + ")";
        randomColors.push(randomRgb);

        var randomHsl = "hsl(" + Math.round(Math.random()*360) + "," + Math.round(Math.random()*100) + "%," + Math.round(Math.random()*100) + "%)";
        randomColors.push(randomHsl);

        var defaultRandomColor = randomColors[Math.round(Math.random() * (randomColors.length - 1))];

        var cssCode;
        sketchUI.getInputFromUser(
            "Add Solid Fill from CSS Color",
            {
                initialValue: defaultRandomColor,
                description: "hex, rgb, rgba, hsl, hsla, keywords"
            },
            function (err, value) {
                if (err) return;
                cssCode = value;
            }
        );
        cssCode = cssCode.replace(/\s+/g, "").toLowerCase();

        switch (true) {
            // #rrggbb
            case (/^#?[0-9a-f]{6}$/.test(cssCode)):
                rgba = [
                    parseInt(cssCode.substr(cssCode.length-6, 2), 16),
                    parseInt(cssCode.substr(cssCode.length-4, 2), 16),
                    parseInt(cssCode.substr(cssCode.length-2, 2), 16),
                    1
                ];
                // log("#RRGGBB: " + cssCode + " > " + rgba.toString());
                break;
            // #rgb
            case (/^#?[0-9a-f]{3}$/.test(cssCode)):
                rgba = [
                    parseInt(cssCode.substr(cssCode.length-3, 1).repeat(2), 16),
                    parseInt(cssCode.substr(cssCode.length-2, 1).repeat(2), 16),
                    parseInt(cssCode.substr(cssCode.length-1, 1).repeat(2), 16),
                    1
                ];
                // log("#RGB: " + cssCode + " > " + rgba.toString());
                break;
            // rgb/rgba
            case (/^rgba?\(\d+,\d+,\d+(,0?\.?[0-9]+)?\)$/.test(cssCode)):
                var match = cssCode.match(/^rgba?\((\d+),(\d+),(\d+)(,(0?\.?[0-9]+))?\)$/);
                rgba = [
                    match[1],
                    match[2],
                    match[3],
                    match[5] ? parseFloat(match[5]) : 1
                ];
                // log("RGBA: " + cssCode + " > " + rgba.toString());
                break;
            // hsl/hsla
            case (/^hsla?\(\d+,\d+%,\d+%(,0?\.?[0-9]+)?\)$/.test(cssCode)):
                var match = cssCode.match(/^hsla?\((\d+),(\d+%),(\d+%)(,(0?\.?[0-9]+))?\)$/);
                var rgb = HSLtoRGB(match[1], parseInt(match[2]), parseInt(match[3]));
                rgba = [
                    rgb[0],
                    rgb[1],
                    rgb[2],
                    match[5] ? parseFloat(match[5]) : 1
                ];
                // log("HSLA: " + cssCode + " > " + rgba.toString());
                break;
            // Keyword
            case (/^#[0-9a-f]{6}$/i.test(colorKeywords[cssCode])):
                rgba = [
                    parseInt(colorKeywords[cssCode].substr(1, 2), 16),
                    parseInt(colorKeywords[cssCode].substr(3, 2), 16),
                    parseInt(colorKeywords[cssCode].substr(5, 2), 16),
                    1
                ];
                // log("keywords: " + cssCode + " > " + rgba.toString());
                break;
            // transparent
            case (cssCode == "transparent"):
                rgba = [0, 0, 0, 0];
                break;
            default:
                rgba = [0, 0, 0, 1];
        }

        var color = MSColor.alloc().init();
            color.setRed(rgba[0]/255);
            color.setGreen(rgba[1]/255);
            color.setBlue(rgba[2]/255);
            color.setAlpha(rgba[3]);

        var loopSelection = selection.objectEnumerator();
        var layer;
        while (layer = loopSelection.nextObject()) {

            if (
                type.isShape(layer) ||
                type.isBitmap(layer)
            ) {
                if (layer.style().enabledFills().count() == 0) {
                    var fill = layer.style().addStylePartOfType(0); // fill
                    fill.setFillType(0); // solid color
                }
                layer.style().enabledFills().lastObject().setColor(color);
            }

            if (type.isText(layer)) {
                layer.changeTextColorTo(color.NSColorWithColorSpace(nil));
            }

            doc.reloadInspector();

            // Fix Sketch 45
            if (sketch.version.sketch < 45) {
                layer.select_byExpandingSelection(true, true);
            } else {
                layer.select_byExtendingSelection(true, true);
            }

        }

    } else {
        doc.showMessage("Please select 1 shape layer.");
    }

};

function HSLtoRGB(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    var r, g, b;
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
}
