var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");
    
    var util = require("util");
    var document = require("sketch/dom").getSelectedDocument();
    var selectedLayers = document.selectedLayers.layers;

    selectedLayers.forEach(function(layer) {
        if (layer.type == "SymbolInstance") {
            var name;
            var editableTextOverrides = layer.overrides.filter(function(item) {
                return item.editable == true && item.property == "stringValue";
            });

            if (editableTextOverrides.length > 1) {
                var selectedOverrides = util.toArray(layer.sketchObject.overrideContainer().selectedOverrides()).map(function(item) {
                    return item.availableOverride();
                });
                var selectedEditableTextOverrides = editableTextOverrides.filter(function(item) {
                    return selectedOverrides.includes(item.sketchObject);
                });
                if (selectedEditableTextOverrides.length > 0) {
                    name = selectedEditableTextOverrides[0].value;
                } else {
                    name = editableTextOverrides[0].value;
                }
            }
            else if (editableTextOverrides.length == 1) {
                name = editableTextOverrides[0].value;
            }

            if (name) {
                layer.name = name;
            }

        }

    });

};
