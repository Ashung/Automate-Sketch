var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var preferences = require("../modules/Preferences");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();

    var selectedArtboard = document.selectedLayers.layers.find(function(layer) {
        return layer.type == "Artboard" || layer.type == "SymbolMaster";
    });

    if (!selectedArtboard) {
        sketch.UI.message("Please select 1 artboard or symbol master.");
        return;
    }

    var dialog = new Dialog("New Guide Layout");

    var columnsCheckbox = ui.checkBox(preferences.get("guideLayoutColumns") || true, "Columns");
    dialog.addView(columnsCheckbox);

    var columnsViews = ui.view([0, 0, 300, 50]);
    var columnNumberLabel = ui.textLabel("Number", [0, 0, 50, 25]);
    var columnNumberView = ui.numberStepper(preferences.get("guideLayoutColumnNumber") || 8, 1, 100, [0, 20, 90, 25]);
    var columnWidthLabel = ui.textLabel("Width", [100, 0, 50, 25]);
    var columnWidthView = ui.numberField(preferences.get("guideLayoutColumnWidth") || 0, [100, 20, 80, 25]);
    var columnGutterLabel = ui.textLabel("Gutter", [200, 0, 50, 25]);
    var columnGutterView = ui.numberField(preferences.get("guideLayoutColumnGutter") || 8, [200, 20, 80, 25]);
    columnsViews.addSubview(columnNumberLabel);
    columnsViews.addSubview(columnNumberView.view);
    columnsViews.addSubview(columnWidthLabel);
    columnsViews.addSubview(columnWidthView);
    columnsViews.addSubview(columnGutterLabel);
    columnsViews.addSubview(columnGutterView);
    dialog.addView(columnsViews);

    var centerHorizontalCheckbox = ui.checkBox(preferences.get("guideLayoutColumnCenter") || false, "Center Horizontal Guides.");
    dialog.addView(centerHorizontalCheckbox);

    var div1 = ui.divider();
    dialog.addView(div1);

    var rowsCheckbox = ui.checkBox(preferences.get("guideLayoutRows") || false, "Rows");
    dialog.addView(rowsCheckbox);

    var rowsViews = ui.view([0, 0, 300, 50]);
    var rowNumberLabel = ui.textLabel("Number", [0, 0, 50, 25]);
    var rowNumberView = ui.numberStepper(preferences.get("guideLayoutRowNumber") || 8, 1, 100, [0, 20, 90, 25]);
    var rowWidthLabel = ui.textLabel("Height", [100, 0, 50, 25]);
    var rowWidthView = ui.numberField(preferences.get("guideLayoutRowWidth") || 0, [100, 20, 80, 25]);
    var rowGutterLabel = ui.textLabel("Gutter", [200, 0, 50, 25]);
    var rowGutterView = ui.numberField(preferences.get("guideLayoutRowGutter") || 8, [200, 20, 80, 25]);
    rowsViews.addSubview(rowNumberLabel);
    rowsViews.addSubview(rowNumberView.view);
    rowsViews.addSubview(rowWidthLabel);
    rowsViews.addSubview(rowWidthView);
    rowsViews.addSubview(rowGutterLabel);
    rowsViews.addSubview(rowGutterView);
    dialog.addView(rowsViews);

    var centerVerticalCheckbox = ui.checkBox(preferences.get("guideLayoutRowCenter") || false, "Center Vertical Guides.");
    dialog.addView(centerVerticalCheckbox);

    var div2 = ui.divider();
    dialog.addView(div2);

    var marginCheckbox = ui.checkBox(preferences.get("guideLayoutMargin") || false, "Margin");
    dialog.addView(marginCheckbox);

    var marginViews = ui.view([0, 0, 300, 50]);
    var marginTopLabel = ui.textLabel("Top", [0, 0, 65, 25]);
    var marginBottomLabel = ui.textLabel("Bottom", [75, 0, 65, 25]);
    var marginLeftLabel = ui.textLabel("Left", [150, 0, 65, 25]);
    var marginRightLabel = ui.textLabel("Right", [225, 0, 65, 25]);
    var marginTopView = ui.numberField(preferences.get("guideLayoutMarginTop") || 0, [0, 20, 65, 25]);
    var marginBottomView = ui.numberField(preferences.get("guideLayoutMarginBottom") || 0, [75, 20, 65, 25]);
    var marginLeftView = ui.numberField(preferences.get("guideLayoutMarginLeft") || 0, [150, 20, 65, 25]);
    var marginRightView = ui.numberField(preferences.get("guideLayoutMarginRight") || 0, [225, 20, 65, 25]);
    marginViews.addSubview(marginTopLabel);
    marginViews.addSubview(marginBottomLabel);
    marginViews.addSubview(marginLeftLabel);
    marginViews.addSubview(marginRightLabel);
    marginViews.addSubview(marginTopView);
    marginViews.addSubview(marginBottomView);
    marginViews.addSubview(marginLeftView);
    marginViews.addSubview(marginRightView);
    dialog.addView(marginViews);

    var div3 = ui.divider();
    dialog.addView(div3);

    var refreshButton = ui.button("Preview");
    dialog.addView(refreshButton);

    var artboard = selectedArtboard;
    var nativeArtboard = selectedArtboard.sketchObject;

    var originalGuides = [
        nativeArtboard.horizontalRulerData().guides(),
        nativeArtboard.verticalRulerData().guides()
    ];

    showRuler(document.sketchObject);

    refreshButton.setCOSJSTargetFunction(function(sender) {
        drawGuides();
    });

    drawGuides();

    var responseCode = dialog.run();
    if (responseCode == 1000 || responseCode == 1001) {

        drawGuides();

        preferences.set("guideLayoutColumns", columnsCheckbox.state() == NSOnState ? true : false);
        preferences.set("guideLayoutColumnNumber", columnNumberView.stepper.integerValue());
        preferences.set("guideLayoutColumnWidth", parseInt(columnWidthView.stringValue()));
        preferences.set("guideLayoutColumnGutter", parseInt(columnGutterView.stringValue()));
        preferences.set("guideLayoutColumnCenter", centerHorizontalCheckbox.state() == NSOnState ? true : false);

        preferences.set("guideLayoutRows", rowsCheckbox.state() == NSOnState ? true : false);
        preferences.set("guideLayoutRowNumber", rowNumberView.stepper.integerValue());
        preferences.set("guideLayoutRowWidth", parseInt(rowWidthView.stringValue()));
        preferences.set("guideLayoutRowGutter", parseInt(rowGutterView.stringValue()));
        preferences.set("guideLayoutRowCenter", centerVerticalCheckbox.state() == NSOnState ? true : false);

        preferences.set("guideLayoutMarginTop", parseInt(marginTopView.stringValue()));
        preferences.set("guideLayoutMarginBottom", parseInt(marginBottomView.stringValue()));
        preferences.set("guideLayoutMarginLeft", parseInt(marginLeftView.stringValue()));
        preferences.set("guideLayoutMarginRight", parseInt(marginRightView.stringValue()));

    }

    if (responseCode == 1001) {
        removeGuides(nativeArtboard);

        nativeArtboard.horizontalRulerData().setGuides(originalGuides[0]);
        nativeArtboard.verticalRulerData().setGuides(originalGuides[1]);
    }

    function drawGuides() {
        removeGuides(nativeArtboard);
        var values1 = getGuideValues(
            artboard.frame.width,
            columnNumberView.stepper.integerValue(),
            parseInt(columnWidthView.stringValue()),
            parseInt(columnGutterView.stringValue()),
            marginCheckbox.state() == NSOnState ? true : false,
            marginCheckbox.state() == NSOnState ? parseInt(marginLeftView.stringValue()) : 0,
            marginCheckbox.state() == NSOnState ? parseInt(marginRightView.stringValue()) : 0,
            centerHorizontalCheckbox.state() == NSOnState ? true : false
        );
        var values2 = getGuideValues(
            artboard.frame.height,
            rowNumberView.stepper.integerValue(),
            parseInt(rowWidthView.stringValue()),
            parseInt(rowGutterView.stringValue()),
            marginCheckbox.state() == NSOnState ? true : false,
            marginCheckbox.state() == NSOnState ? parseInt(marginTopView.stringValue()) : 0,
            marginCheckbox.state() == NSOnState ? parseInt(marginBottomView.stringValue()) : 0,
            centerVerticalCheckbox.state() == NSOnState ? true : false
        );
        if (columnsCheckbox.state() == NSOnState) {
            addGuides(nativeArtboard, 0, values1);
        }
        if (rowsCheckbox.state() == NSOnState) {
            addGuides(nativeArtboard, 1, values2);
        }
    }

};

function getGuideValues(total, count, width, gutter, margin, margin1, margin2, center) {
    var values = [];
    if (width == 0) {
        width = Math.floor((total - margin1 - margin2 - gutter * (count - 1)) / count);
    }
    var flag = margin1;
    for (var i = 0; i < count; i++) {
        if (center && i == 0) {
            var offset = Math.floor((total - margin1 - margin2 - (width * count + gutter * (count - 1))) / 2) + margin1;
            flag += offset;
        }
        values.push(flag);
        flag += width;
        values.push(flag);
        flag += gutter;
        if (i != count - 1) {
            values.push(flag);
        }
    }

    if (margin == true) {
        values.push(margin1);
        if (flag < total) {
            values.push(total - margin2);
        }
    }

    return values;
}

function addGuides(artboard, orientation, values) {
    var rulerData;
    if (orientation == 0) {
        rulerData = artboard.horizontalRulerData();
    } else {
        rulerData = artboard.verticalRulerData();
    }
    rulerData.setGuides(values);
}

function removeGuides(artboard) {
    artboard.horizontalRulerData().removeAllGuides();
    artboard.verticalRulerData().removeAllGuides();
}

function showRuler(document) {
    if (!document.isRulersVisible()) {
        var toggleRulersAction = document.actionsController().actionForID("MSToggleRulersAction");
        if(toggleRulersAction.validate()) {
            toggleRulersAction.performAction(nil);
        }
    }
}
