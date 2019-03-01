@import "../Libraries/Google_Analytics.cocoascript";
@import "../Libraries/Preferences.cocoascript";
@import "../Libraries/UI_Controls.cocoascript";

var onRun = function(context) {

    ga(context, "Layer");

    var util = require("util");
    var sketch = require("sketch");

    var dialog = UI.cosDialog(
        "Rename Layers",
        "Rename selected layers use custom template."
    );

    var layoutView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
    layoutView.setFlipped(true);

    var labelView1 = UI.textLabel("Name", [0, 0, 230, 20]);
    layoutView.addSubview(labelView1);

    var nameView = UI.textField("", [0, 20, 230, 24]);
    layoutView.addSubview(nameView);

    var labelView2 = UI.textLabel("History", [240, 0, 60, 20]);
    layoutView.addSubview(labelView2);


    var histories = [];
    if (getPreferences(context, "renameLayerHistories")) {
        histories = util.toArray(getPreferences(context, "renameLayerHistories"));
    }

    nameView.setStringValue(histories[histories.length - 1]);

    var historyView = UI.popupButton(histories.slice().reverse(), [240, 20, 60, 24]);
    layoutView.addSubview(historyView);

    historyView.setCOSJSTargetFunction(function(sender) {
        nameView.setStringValue(sender.titleOfSelectedItem());
    });

    dialog.addAccessoryView(layoutView);

    // Templates
    var templates = [
        { label: "Type", value: "${type}", position: [0, 0] },
        { label: "Symbol", value: "${symbol}", position: [50, 0] },
        { label: "Style", value: "${style}", position: [115, 0] },
        { label: "Text", value: "${text}", position: [165, 0] },
        { label: "Name", value: "${name}", position: [210, 0] },
        { label: "N", value: "${n}", position: [265, 0] },
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

    dialog.addAccessoryView(buttonsView);

    var responseCode = dialog.runModal();
    if (responseCode == 1000) {

        var selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;

        var customTemplate = String(nameView.stringValue());
        histories.push(customTemplate);
        histories = histories.filter(function(item, index, array) {
            return array.lastIndexOf(item) === index;
        });
        histories.splice(0, histories.length - 5);

        setPreferences(context, "renameLayerHistories", histories);

        selectedLayers.forEach(function(layer, index) {

            var keywordMapping = {
                "${type}": layer.type,
                "${symbol}": (layer.type == "SymbolInstance") ? layer.sketchObject.symbolMaster().name() : "",
                "${style}": layer.sharedStyle ? layer.sharedStyle.name : "",
                "${text}": (layer.type == "Text") ? layer.text : "",
                "${name}": layer.name,
                "${n}": index + 1
            };

            var resultName = customTemplate;
            var regexKeyword = RegExp("\\${\\w+}", "g");
            var match;
            while (match = regexKeyword.exec(customTemplate)) {
                var keyword = match[0];
                var value = keywordMapping[keyword] || "";
                resultName = resultName.replace(match[0], value);
            }

            resultName = resultName.trim();
            if (resultName == "") {
                resultName = " ";
            }
            layer.name = resultName;

        });

    }
};
