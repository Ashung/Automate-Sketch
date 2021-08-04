var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var toast = sketch.UI.message;
    var util = require("util");
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");
    var identifier = __command.identifier();

    var libraryStyles;
    var dialogTitle = '';
    if (identifier == "change_library_layer_style_to_local_layer_style") {
        libraryStyles = document.sharedLayerStyles.filter(function(style) {
            return style.getLibrary() && style.getAllInstancesLayers().length;
        });
        if (libraryStyles.length == 0) {
            toast('No library layer style.');
            return;
        }
        dialogTitle = "Change Library Layer Style to Local";
    }
    if (identifier == "change_library_text_style_to_local_text_style") {
        libraryStyles = document.sharedTextStyles.filter(function(style) {
            return style.getLibrary() && style.getAllInstancesLayers().length;
        });
        if (libraryStyles.length == 0) {
            toast('No library text style.');
            return;
        }
        dialogTitle = "Change Library Text Style to Local";
    }

    // Dialog
    var dialog = new Dialog(dialogTitle);

    var selectAll = ui.checkBox(true, "Select / Deselect all styles.");
    selectAll.setAllowsMixedState(true);
    dialog.addView(selectAll);

    var stylesWillMakeLocal = libraryStyles.slice(0);
    var views = [];
    libraryStyles.forEach(function(style) {
        var wrapper = ui.view([300, 50]);
        var checkBox = ui.checkBox(true, " ".repeat(10) + style.name, [5, 0, 300, 50]);
        var image;
        if (identifier == "change_library_layer_style_to_local_layer_style") {
            image = ui.image(preview.layerStyle(style.sketchObject), [30, 12, 24, 24]);
        }
        if (identifier == "change_library_text_style_to_local_text_style") {
            image = ui.image(preview.textStyleSmall(style.sketchObject), [30, 12, 24, 24]);
        }
        wrapper.addSubview(checkBox);
        wrapper.addSubview(image);
        views.push(wrapper);

        checkBox.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                var index = stylesWillMakeLocal.findIndex(function(item) {
                    return item.id == style.id && item.name == style.name;
                });
                stylesWillMakeLocal.splice(index, 1);
            }
            if (sender.state() == NSOnState) {
                stylesWillMakeLocal.push(style);
            }
            if (stylesWillMakeLocal.length == libraryStyles.length) {
                selectAll.setState(NSOnState);
            } else if (stylesWillMakeLocal.length == 0) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });
    });
    var scrollView = ui.scrollView(views, [300, 300]);
    dialog.addView(scrollView);

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        stylesWillMakeLocal.forEach(function(style) {
            style.unlinkFromLibrary();
        });
        toast(`${stylesWillMakeLocal.length} style${stylesWillMakeLocal.length > 1 ? 's': ''} have been change to local style.`)
    }

};