var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Type");

    var util = require("util");
    var sketch = require("sketch");
    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;
    var selectedTextLayers = selectedLayers.filter(function(layer) {
        return layer.type == "Text";
    });

    if (selectedTextLayers.length == 0) {
        sketch.UI.message("Please select 1 text layer.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Change Texts",
        "Change the text value of selected text layers use custom template, use {{nnn}} for 001, {{nnn10}} for 010. {{N}} for desc order."
    );

    var layoutView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
    layoutView.setFlipped(true);

    var labelView1 = ui.textLabel("Text", [0, 0, 230, 20]);
    layoutView.addSubview(labelView1);

    var nameView = ui.textField("", [0, 20, 230, 24]);
    layoutView.addSubview(nameView);

    var labelView2 = ui.textLabel("History", [240, 0, 60, 20]);
    layoutView.addSubview(labelView2);

    var histories = [];
    var maxHistory = 10;
    if (preferences.get("changeTextHistories")) {
        histories = util.toArray(preferences.get("changeTextHistories"));
        nameView.setStringValue(histories[histories.length - 1]);
    }

    var historyView = ui.popupButton(histories.slice().reverse(), [240, 20, 60, 24]);
    layoutView.addSubview(historyView);

    historyView.setCOSJSTargetFunction(function(sender) {
        nameView.setStringValue(sender.titleOfSelectedItem());
    });

    dialog.addView(layoutView);

    // Templates
    var templates = [
        { label: "text", value: "{{text}}", position: [0, 0] },
        { label: "style", value: "{{style}}", position: [45, 0] },
        { label: "font", value: "{{font}}", position: [95, 0] },
        { label: "size", value: "{{size}}", position: [145, 0] },
        { label: "fontStyle", value: "{{fontStyle}}", position: [195, 0] },
        { label: "artboard", value: "{{artboard}}", position: [0, 30] },
        { label: "page", value: "{{page}}", position: [75, 30] },
        { label: "parent", value: "{{parent}}", position: [125, 30] },
        { label: "name", value: "{{name}}", position: [185, 30] },
        { label: "n", value: "{{n}}", position: [240, 30] },
        { label: "loremIpsum", value: "{{loremIpsum}}", position: [0, 60]},
        { label: "color", value: "{{color}}", position: [90, 60]},
        { label: "N", value: "{{N}}", position: [140, 60] }
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

    dialog.addView(buttonsView);

    dialog.focus(nameView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        var customTemplate = String(nameView.stringValue());
        histories.push(customTemplate);
        histories = histories.filter(function(item, index, array) {
            return array.lastIndexOf(item) === index;
        });
        histories.splice(0, histories.length - maxHistory);

        preferences.set("changeTextHistories", histories);

        selectedTextLayers.forEach(function(layer, index) {

            var keywordMapping = {
                "{{text}}": layer.text,
                "{{style}}": layer.sharedStyle ? layer.sharedStyle.name : "",
                "{{font}}": layer.style.fontFamily,
                "{{size}}": layer.style.fontSize,
                "{{artboard}}": layer.sketchObject.parentArtboard() ? layer.sketchObject.parentArtboard().name() : "",
                "{{page}}": layer.sketchObject.parentPage().name(),
                "{{parent}}": layer.parent.name,
                "{{name}}": layer.name,
                "{{loremIpsum}}": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar enim id mollis aliquam.",
                "{{fontStyle}}": function() {
                    var fontDisplayName = layer.style.sketchObject.textStyle().attributes().NSFont.displayName();
                    var result = fontDisplayName.replace(layer.style.fontFamily, "").trim();
                    return result == "" ? "Regular" : result;
                },
                "{{color}}": function() {
                    var color = layer.style.textColor;
                    if (color.length == 9 && color.slice(-2) == "ff") {
                        return color.slice(0, -2);
                    } else {
                        return color;
                    }
                }
            };

            var resultText = customTemplate;
            var regexKeyword = RegExp("{{\\w+}}", "g");
            var match;
            while (match = regexKeyword.exec(customTemplate)) {
                var keyword = match[0];
                if (/{{n+\d*}}/.test(keyword)) {
                    var length = keyword.match(/n/g).length;
                    var begin = keyword.match(/\d+/g) == null ? 1 : parseInt(keyword.match(/\d+/g)[0]);
                    var value = formatNumber(index + begin, length);
                    resultText = resultText.replace(match[0], value);
                }
                if (/{{N+\d*}}/.test(keyword)) {
                    var length = keyword.match(/N/g).length;
                    var begin = keyword.match(/\d+/g) == null ? selectedLayers.length : parseInt(keyword.match(/\d+/g)[0]);
                    var value = formatNumber(begin - index, length);
                    resultText = resultText.replace(match[0], value);
                }
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

function formatNumber(num, length) {
    if (String(num).length < length) {
        return "0".repeat(length - String(num).length) + String(num);
    } else {
        return String(num);
    }
}