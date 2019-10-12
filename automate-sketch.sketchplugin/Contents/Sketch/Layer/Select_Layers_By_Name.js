var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var toast = require("sketch").UI.message;
    var util = require("util");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preferences = require("../modules/Preferences");

    var dialog = new Dialog(
        'Select Layers by Name',
        'Input string like "123" or Regular Expression like "\d+".'
    );

    var defaultUserInputString = preferences.get("selectLayersByName") || "";
    var userInputStringView = ui.textField(defaultUserInputString);
    dialog.addView(userInputStringView);

    var selectLayersByNameMatchCase = preferences.get("selectLayersByNameMatchCase") || false;
    var matchCaseView = ui.checkBox(selectLayersByNameMatchCase, "Match Case");
    dialog.addView(matchCaseView);

    var selectLayersByNameMatchAll = preferences.get("selectLayersByNameMatchAll") || false;
    var matchAllView = ui.checkBox(selectLayersByNameMatchAll, "Match Whole Word");
    dialog.addView(matchAllView);

    var selectLayersByNameRegExp = preferences.get("selectLayersByNameRegExp") || false;
    var regExpView = ui.checkBox(selectLayersByNameRegExp, "Use Regular Expression");
    dialog.addView(regExpView);

    var defaultSelectLayersFrom = preferences.get("selectLayersFrom") || 0;
    var selectLayersFromLabel = ui.textLabel("Select Layers From:");
    dialog.addView(selectLayersFromLabel);
    var layersFrom = [
        "Current Page",
        "Selection",
        "Children Layers in Selection"
    ];
    var layersFromView = ui.popupButton(layersFrom);
    layersFromView.selectItemAtIndex(defaultSelectLayersFrom);
    dialog.addView(layersFromView);

    var defaultSelectLayersType = preferences.get("selectLayersType") || 0;
    var layerTypeLabel = ui.textLabel("Layer type:");
    dialog.addView(layerTypeLabel);
    var layerTypes = [
        "All",
        "Artboard",
        "Symbol Master",
        "Symbol Instance",
        "Bitmap",
        "Text",
        "Shape",
        "Group",
        "Slice",
        "Hotspot"
    ];
    var layerTypeView = ui.popupButton(layerTypes);
    layerTypeView.selectItemAtIndex(defaultSelectLayersType);
    dialog.addView(layerTypeView);

    dialog.focus(userInputStringView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {

        // Save preferences
        preferences.set("selectLayersByName", userInputStringView.stringValue());
        preferences.set("selectLayersByNameMatchCase", Boolean(matchCaseView.state()));
        preferences.set("selectLayersByNameMatchAll", Boolean(matchAllView.state()));
        preferences.set("selectLayersByNameRegExp", Boolean(regExpView.state()));
        preferences.set("selectLayersFrom", layersFromView.indexOfSelectedItem());
        preferences.set("selectLayersType", layerTypeView.indexOfSelectedItem());

        // Filter layers
        var currentPage = context.document.currentPage();
        var layers = NSMutableArray.alloc().init();
        if (layersFromView.indexOfSelectedItem() == 0) {
            layers.addObjectsFromArray(currentPage.children());
            layers.removeObject(currentPage);
        } else if (layersFromView.indexOfSelectedItem() == 1) {
            layers.addObjectsFromArray(context.selection);
        } else if (layersFromView.indexOfSelectedItem() == 2) {
            context.selection.forEach(function(item) {
                var _layer = item.children();
                _layer.removeObject(item);
                layers.addObjectsFromArray(_layer);
            });
        }

        var predicate;
        if (layerTypeView.indexOfSelectedItem() == 1) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSArtboardGroup");
        } else if (layerTypeView.indexOfSelectedItem() == 2) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolMaster");
        } else if (layerTypeView.indexOfSelectedItem() == 3) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSSymbolInstance");
        } else if (layerTypeView.indexOfSelectedItem() == 4) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSBitmapLayer");
        } else if (layerTypeView.indexOfSelectedItem() == 5) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSTextLayer");
        } else if (layerTypeView.indexOfSelectedItem() == 6) {
            predicate = NSPredicate.predicateWithFormat(
                "className IN %@",
                ["MSRectangleShape", "MSOvalShape", "MSShapePathLayer", "MSTriangleShape", "MSStarShape", "MSPolygonShape", "MSShapeGroup"]
            );
        } else if (layerTypeView.indexOfSelectedItem() == 7) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSLayerGroup");
        } else if (layerTypeView.indexOfSelectedItem() == 8) {
            predicate = NSPredicate.predicateWithFormat("className == %@", "MSSliceLayer");
        } else if (layerTypeView.indexOfSelectedItem() == 9) {
            predicate = NSPredicate.predicateWithFormat("flow != null");
        }
        if (layerTypeView.indexOfSelectedItem() > 0) {
            layers = layers.filteredArrayUsingPredicate(predicate);
        }

        if (layers.count() == 0) {
            if (layerTypeView.indexOfSelectedItem() == 0) {
                toast("Not any layer.");
            } else {
                toast("Not any " + layerTypeView.titleOfSelectedItem() + " layer.");
            }
            return;
        }

        var rexExpFlag = Boolean(matchCaseView.state()) ? "g" : "gi";
        var regExpPrefix = Boolean(matchAllView.state()) ? "^" : "";
        var regExpSuffix = Boolean(matchAllView.state()) ? "$" : "";
        var regExpPattern = Boolean(regExpView.state())
            ? regExpPrefix + toRegExp(userInputStringView.stringValue()) + regExpSuffix
            : regExpPrefix + escapeRegExp(userInputStringView.stringValue()) + regExpSuffix;

        var matchLayers = [];
        util.toArray(layers).forEach(function(layer) {
            var regExp = new RegExp(regExpPattern, rexExpFlag);
            if (regExp.test(layer.name())) {
                matchLayers.push(layer);
            }
        });

        if (matchLayers.length == 0) {
            toast("Not any layer.");
            return;
        }

        currentPage.changeSelectionBySelectingLayers(matchLayers);
        toast("Select " + matchLayers.length + " layer.");

    }
};

function toRegExp(string) {
    return String(string).replace(/\\/g,"\\");
}

function escapeRegExp(string) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
