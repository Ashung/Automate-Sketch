
var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var util = require("util");
    var sketch = require("sketch");
    var identifier = __command.identifier();
    var document = sketch.getSelectedDocument();
    var selectedTextLayers = document.selectedLayers.layers.filter(function(layer) {
        return layer.type == "Text";
    });

    if (selectedTextLayers.length == 0) {
        sketch.UI.message("Please select at least 1 text layer.");
        return;
    }

    selectedTextLayers.forEach(function(layer) {
        var familyName = layer.style.fontFamily;
        var postscriptName = layer.sketchObject.fontPostscriptName();
        var availableMembers = util.toArray(NSFontManager.sharedFontManager().availableMembersOfFontFamily(familyName))
            .filter(function(item) {
                return /italic/i.test(item[1]) == false && /slanted/i.test(item[1]) == false && /oblique/i.test(item[1]) == false;
            })
            .map(function(item) {
                return util.toArray(item);
            });
        if (availableMembers.length > 1) {
            var order = {
                thin: 3,
                regular: 5,
                medium: 6,
                light: 4,
                bold: 9,
                hairline: 2,
                ultralight: 2,
                extralight: 2,
                semibold: 8,
                demibold: 8,
                wide: 9,
                extrabold: 10,
                heavy: 10,
                ultrabold: 11,
                black: 11
            };
            availableMembers.forEach(function(item) {
                var weightName = item[1].replace(/\s/g, '').toLowerCase();
                var weight = 5;
                for (var key in order) {
                    if (weightName.indexOf(key) >= 0) {
                        weight = order[key];
                    }
                }
                item.push(weight);
            });

            availableMembers.sort(function(a, b) {
                return a[4] > b[4];
            });

            var postscriptNames = availableMembers.map(function(item) {
                return item[0];
            });
            var currentIndex = postscriptNames.indexOf(postscriptName);
            var nextPostscriptName;
            if (identifier == "increase_font_weight") {
                if (currentIndex == postscriptNames.length - 1) {
                    nextPostscriptName = postscriptNames[0];
                } else {
                    nextPostscriptName = postscriptNames[currentIndex + 1];
                }
            }
            if (identifier == "decrease_font_weight") {
                if (currentIndex == 0) {
                    nextPostscriptName = postscriptNames[postscriptNames.length - 1];
                } else {
                    nextPostscriptName = postscriptNames[currentIndex - 1];
                }
            }
            layer.sketchObject.setFontPostscriptName(nextPostscriptName);
        }
    });

};
