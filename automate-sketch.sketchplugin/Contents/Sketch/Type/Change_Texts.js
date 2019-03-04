@import "../Libraries/Google_Analytics.cocoascript";
@import "../Libraries/Preferences.cocoascript";
@import "../Libraries/UI_Controls.cocoascript";

var onRun = function(context) {

    ga(context, "Type");

    var util = require("util");
    var sketch = require("sketch");
    var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;
    var selectedTextLayers = selectedLayers.filter(function(layer) {
        return layer.type == "Text";
    });

    if (selectedTextLayers.length == 0) {
        sketch.UI.message("Please select 1 text layer.");
        return;
    }

    var dialog = UI.cosDialog(
        "Change Texts",
        "Change the text value of selected text layers use custom template."
    );

    var layoutView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
    layoutView.setFlipped(true);

    var labelView1 = UI.textLabel("Text", [0, 0, 230, 20]);
    layoutView.addSubview(labelView1);

    var nameView = UI.textField("", [0, 20, 230, 24]);
    layoutView.addSubview(nameView);

    var labelView2 = UI.textLabel("History", [240, 0, 60, 20]);
    layoutView.addSubview(labelView2);

    var histories = [];
    var maxHistory = 10;
    if (getPreferences(context, "changeTextHistories")) {
        histories = util.toArray(getPreferences(context, "changeTextHistories"));
        nameView.setStringValue(histories[histories.length - 1]);
    }

    var historyView = UI.popupButton(histories.slice().reverse(), [240, 20, 60, 24]);
    layoutView.addSubview(historyView);

    historyView.setCOSJSTargetFunction(function(sender) {
        nameView.setStringValue(sender.titleOfSelectedItem());
    });

    dialog.addAccessoryView(layoutView);

    // Templates
    var templates = [
        { label: "Text", value: "$text", position: [0, 0] },
        { label: "Style", value: "$style", position: [45, 0] },
        { label: "Font", value: "$font", position: [95, 0] },
        { label: "Size", value: "$size", position: [145, 0] },
        { label: "Font Style", value: "$fontStyle", position: [195, 0] },
        { label: "Artboard", value: "$artboard", position: [0, 30] },
        { label: "Page", value: "$page", position: [75, 30] },
        { label: "Parent", value: "$parent", position: [125, 30] },
        { label: "Name", value: "$name", position: [185, 30] },
        { label: "N", value: "$n", position: [240, 30] },
        { label: "Lorem ipsum", value: "$lorem", position: [0, 60]}
    ];

    var buttonsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 80));
    buttonsView.setFlipped(true);

    templates.forEach(function(item) {
        var rect = NSMakeRect(item.position[0], item.position[1], 0, 0);
        var button = NSButton.alloc().initWithFrame(rect);
        button.setBezelStyle(NSInlineBezelStyle);
        button.setTitle(item.label);
        button.sizeToFit();
        button.setCOSJSTargetFunction(function(sender) {
            var newText = (nameView.stringValue() + " " + item.value).trim();
            nameView.setStringValue(newText);
        });
        buttonsView.addSubview(button);
    });

    dialog.addAccessoryView(buttonsView);

    var responseCode = dialog.runModal();
    if (responseCode == 1000) {

        var customTemplate = String(nameView.stringValue());
        histories.push(customTemplate);
        histories = histories.filter(function(item, index, array) {
            return array.lastIndexOf(item) === index;
        });
        histories.splice(0, histories.length - maxHistory);

        setPreferences(context, "changeTextHistories", histories);

        selectedTextLayers.forEach(function(layer, index) {

            var keywordMapping = {
                "$text": layer.text,
                "$style": layer.sharedStyle ? layer.sharedStyle.name : "",
                "$font": layer.style.fontFamily,
                "$size": layer.style.fontSize,
                "$fontStyle": function() {
                    var fontDisplayName = layer.style.sketchObject.textStyle().attributes().NSFont.displayName();
                    var result = fontDisplayName.replace(layer.style.fontFamily, "").trim();
                    return result == "" ? "Regular" : result;
                },
                "$artboard": layer.sketchObject.parentArtboard() ? layer.sketchObject.parentArtboard().name() : "",
                "$page": layer.sketchObject.parentPage().name(),
                "$parent": layer.parent.name,
                "$name": layer.name,
                "$n": index + 1,
                "$lorem": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar enim id mollis aliquam."
            };

            var resultText = customTemplate;
            var regexKeyword = RegExp("\\$\\w+", "g");
            var match;
            while (match = regexKeyword.exec(customTemplate)) {
                var keyword = match[0];
                if (Object.keys(keywordMapping).includes(keyword)) {
                    var value = keywordMapping[keyword] || "";
                    resultText = resultText.replace(match[0], value);
                }
            }

            resultText = resultText.trim();
            if (resultText == "") {
                resultText = " ";
            }
            layer.sketchObject.setNameIsFixed(1);
            layer.text = resultText;

        });

    }
};
