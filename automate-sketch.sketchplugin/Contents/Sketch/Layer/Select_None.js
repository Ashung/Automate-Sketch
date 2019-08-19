var onRun = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Layer");
    var document = require("sketch/dom").getSelectedDocument();
    var selection = document.selectedLayers;
    selection.clear()
};
