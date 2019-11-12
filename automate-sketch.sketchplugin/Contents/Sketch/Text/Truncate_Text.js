var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    var selectedTextLayers = document.selectedLayers.layers.filter(function(layer) {
        return layer.type == "Text";
    });

    if (selectedTextLayers.length == 0) {
        sketch.UI.message("Please select at least 1 text layer.");
        return;
    }

    selectedTextLayers.forEach(function(layer) {
        var msLayer = layer.sketchObject;
        var paragraphStyle = msLayer.paragraphStyle();
        switch (String(identifier)) {
            case "truncate_text_not":
                paragraphStyle.setLineBreakMode(null);
                break;
            case "truncate_text_at_start":
                paragraphStyle.setLineBreakMode(NSLineBreakByTruncatingHead);
                break;
            case "truncate_text_at_middle":
                paragraphStyle.setLineBreakMode(NSLineBreakByTruncatingMiddle);
                break;
            case "truncate_text_at_end":
                paragraphStyle.setLineBreakMode(NSLineBreakByTruncatingTail);
                break;
            default:
                paragraphStyle.setLineBreakMode(null);
        }
        paragraphStyle.setAllowsDefaultTighteningForTruncation(false);
        paragraphStyle.setTighteningFactorForTruncation(0);
        msLayer.addAttribute_value(NSParagraphStyleAttributeName, paragraphStyle);
    });
};