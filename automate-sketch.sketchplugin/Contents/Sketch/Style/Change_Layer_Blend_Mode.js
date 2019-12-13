var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;

    var blendModes = [
        "Normal",
        "Darken",
        "Multiply",
        "Color Burn",
        "Lighten",
        "Screen",
        "Color Dodge",
        "Overlay",
        "Soft Light",
        "Hard Light",
        "Difference",
        "Exclusion",
        "Hue",
        "Saturation",
        "Color",
        "Luminosity",
        "Plus Darker",
        "Plus Lighter"
    ];

    selectedLayers.forEach(function(layer) {
        var blendModeIndex = layer.sketchObject.style().contextSettings().blendMode();
        var nextBlendModeIndex = blendModeIndex == blendModes.length - 1 ? 0 : blendModeIndex + 1;
        layer.sketchObject.style().contextSettings().setBlendMode(nextBlendModeIndex);
        sketch.UI.message('Layer "' + layer.name + '" change blend mode to ' + blendModes[nextBlendModeIndex] + '.');
    });

};
