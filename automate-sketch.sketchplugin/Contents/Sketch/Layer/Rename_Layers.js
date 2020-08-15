var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var util = require("util");
    var sketch = require("sketch");
    var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;

    if (selectedLayers.length == 0) {
        sketch.UI.message("Please select 1 layer.");
        return;
    }

    var dialog = new Dialog(
        "Rename Layers",
        "Rename selected layers use custom template, use {{nnn}} for 001, {{nnn10}} for 010. {{N}} for reverse order."
    );

    var layoutView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
    layoutView.setFlipped(true);

    var labelView1 = ui.textLabel("Name", [0, 0, 230, 20]);
    layoutView.addSubview(labelView1);

    var nameView = ui.textField("", [0, 20, 230, 24]);
    layoutView.addSubview(nameView);

    var labelView2 = ui.textLabel("History", [240, 0, 60, 20]);
    layoutView.addSubview(labelView2);

    var histories = [];
    var maxHistory = 10;
    if (preferences.get("renameLayerHistories")) {
        histories = util.toArray(preferences.get("renameLayerHistories"));
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
        { label: "type", value: "{{type}}", position: [0, 0] },
        { label: "symbol", value: "{{symbol}}", position: [50, 0] },
        { label: "style", value: "{{style}}", position: [115, 0] },
        { label: "text", value: "{{text}}", position: [165, 0] },
        { label: "name", value: "{{name}}", position: [210, 0] },
        { label: "n", value: "{{n}}", position: [265, 0] },
        { label: "artboard", value: "{{artboard}}", position: [0, 30] },
        { label: "page", value: "{{page}}", position: [75, 30] },
        { label: "parent", value: "{{parent}}", position: [130, 30] },
        { label: "library", value: "{{library}}", position: [190, 30] },
        { label: "N", value: "{{N}}", position: [250, 30] },
    ];

    var buttonsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
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
        // Remove duplicate items
        histories = histories.map(function(item) {
            return String(item);
        }).filter(function(item, index, arr) {
            return arr.lastIndexOf(item) == index;
        });
        // Last 10 item
        histories.splice(0, histories.length - maxHistory);

        preferences.set("renameLayerHistories", histories);

        selectedLayers.forEach(function(layer, index) {

            var keywordMapping = {
                "{{type}}": layer.type,
                "{{symbol}}": (layer.type == "SymbolInstance") ? layer.sketchObject.symbolMaster().name() : "",
                "{{style}}": layer.sharedStyle ? layer.sharedStyle.name : "",
                "{{text}}": (layer.type == "Text") ? layer.text : "",
                "{{name}}": layer.name,
                "{{artboard}}": layer.sketchObject.parentArtboard() ? layer.sketchObject.parentArtboard().name() : "",
                "{{page}}": layer.sketchObject.parentPage().name(),
                "{{parent}}": layer.parent.name,
                "{{library}}": function() {
                    if (layer.type == "SymbolInstance" && layer.master.getLibrary()) {
                        return layer.master.getLibrary().name;
                    }
                    if (layer.sharedStyle && layer.sharedStyle.getLibrary()) {
                        return layer.sharedStyle.getLibrary().name;
                    }
                    return "";
                }
            };

            var resultName = customTemplate;
            var regexKeyword = RegExp("{{\\w+}}", "g");
            var match;
            while (match = regexKeyword.exec(customTemplate)) {
                var keyword = match[0];
                if (/{{n+\d*}}/.test(keyword)) {
                    var length = keyword.match(/n/g).length;
                    var begin = keyword.match(/\d+/g) == null ? 1 : parseInt(keyword.match(/\d+/g)[0]);
                    var value = formatNumber(index + begin, length);
                    resultName = resultName.replace(match[0], value);
                }
                if (/{{N+\d*}}/.test(keyword)) {
                    var length = keyword.match(/N/g).length;
                    var begin = keyword.match(/\d+/g) == null ? selectedLayers.length : selectedLayers.length + parseInt(keyword.match(/\d+/g)[0]) - 1;
                    var value = formatNumber(begin - index, length);
                    resultName = resultName.replace(match[0], value);
                }
                if (Object.keys(keywordMapping).includes(keyword)) {
                    var value = keywordMapping[keyword] || "";
                    resultName = resultName.replace(match[0], value);
                }
            }

            resultName = resultName.trim();
            if (resultName == "") {
                resultName = " ";
            }
            layer.name = resultName;

            if (layer.type == 'Text') {
                layer.sketchObject.setNameIsFixed(1);
            }

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
