var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    
    document.swatches.forEach(function(color) {
        color.name = color.name.replace(/^\d+\.\s/, '')
    });
}