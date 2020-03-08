var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var identifier = __command.identifier();

    var styles;
    if (identifier == "merge_layer_styles_with_same_name") {
        styles = document.sharedLayerStyles;
    } else {
        styles = document.sharedTextStyles;
    }

    // Local styles
    styles = styles.filter(function(style) {
        return !style.getLibrary();
    });

    if (styles.length == 0) {
        sketch.UI.message("This document have not any local style.");
        return;
    }

    // Group styles with same name.
    var stylesWithSameName = [];
    var _styles = styles.slice();
    while(_styles.length > 0) {
        var base = _styles.shift();
        var group = [base];
        var offset = 0;
        var _temp = _styles.slice();
        for (var i = 0; i < _temp.length; i++) {
            if (_temp[i].name == base.name) {
                group.push(_temp[i]);
                _styles.splice(i - offset, 1);
                offset ++;
            }
        }
        if (group.length > 1) {
            stylesWithSameName.push(group);
        }
    }

    if (stylesWithSameName.length == 0) {
        sketch.UI.message("This document have not any local style with same name.");
        return;
    }

    // Dialog
    var dialogTitle;
    var dialogDescription = "Select a style you want to keep it.";
    if (identifier == "merge_layer_styles_with_same_name") {
        dialogTitle = "Merge Local Layer Styles with Same Name";
    } else {
        dialogTitle = "Merge Local Text Styles with Same Name";
    }
    var dialog = new Dialog(dialogTitle, dialogDescription, 400, ["Close"]);

    var scrollView = ui.scrollView([], [400, 150]);
    dialog.addView(scrollView);

    var current = 1;
    var view = ui.view([400, 30]);
    var previousButton = ui.button("<", [0, 0, 40, 25]);
    var nextButton = ui.button(">", [40, 0, 40, 25]);
    var mergeButton = ui.button("Merge", [300, 0, 100, 25]);
    var navText = ui.textLabel("1 / " + stylesWithSameName.length, [90, 2, 100, 25]);
    view.addSubview(previousButton);
    view.addSubview(nextButton);
    view.addSubview(mergeButton);
    view.addSubview(navText);
    dialog.addView(view);

    ui.scrollViewSetContent(scrollView, styleViews(stylesWithSameName[current - 1]));

    previousButton.setCOSJSTargetFunction(function(sender) {
        if (stylesWithSameName.length > 0) {
            current = Math.max(current - 1, 1);
            navText.setStringValue(current + " / " + stylesWithSameName.length);
            ui.scrollViewSetContent(scrollView, styleViews(stylesWithSameName[current - 1]));
        }
    });

    nextButton.setCOSJSTargetFunction(function(sender) {
        if (stylesWithSameName.length > 0) {
            current = Math.min(current + 1, stylesWithSameName.length);
            navText.setStringValue(current + " / " + stylesWithSameName.length);
            ui.scrollViewSetContent(scrollView, styleViews(stylesWithSameName[current - 1]));
        }
    });

    mergeButton.setCOSJSTargetFunction(function(sender) {
        var checkBoxViews = [];
        scrollView.documentView().subviews().forEach(function(subview1) {
            subview1.subviews().forEach(function(subview2) {
                if (subview2.class() == "NSButton") {
                    checkBoxViews.push(subview2);
                }
            });
        });
        var unSelected = checkBoxViews.every(function(item) {
            return item.state() == NSOffState;
        });
        if (unSelected) {
            if (stylesWithSameName.length > 0) {
                sketch.UI.alert(dialogTitle, dialogDescription);
            }
        } else {

            // Merge styles
            var selectedIndex = checkBoxViews.findIndex(function(item) {
                return item.state() == NSOnState;
            });
            var selectedStyle = stylesWithSameName[current - 1][selectedIndex];
            var removedStyleIds = [];
            stylesWithSameName[current - 1].forEach(function(style, index) {
                if (index != selectedIndex) {
                    style.getAllInstancesLayers().forEach(function(layer) {
                        layer.style = selectedStyle.style;
                        layer.sharedStyleId = (selectedStyle.id);
                    });
                    removedStyleIds.push(style.id);

                    // Remove style
                    var indexInDocument = styles.indexOf(style);
                    if (identifier == "merge_layer_styles_with_same_name") {
                        document.sharedLayerStyles.splice(indexInDocument, 1);
                    } else {
                        document.sharedTextStyles.splice(indexInDocument, 1);
                    }
                }
            });

            // Replace style use in override
            sketch.find("SymbolInstance").forEach(function(instance) {
                instance.overrides.filter(function(override) {
                    if (identifier == "merge_layer_styles_with_same_name") {
                        return override.property == "layerStyle";
                    } else {
                        return override.property == "textStyle";
                    }
                }).forEach(function(override) {
                    if (removedStyleIds.includes(override.value)) {
                        override.value = (selectedStyle.id);
                    }
                });
            });

            // Refresh scrollView content
            stylesWithSameName.splice(current - 1, 1);
            current = Math.max(current - 1, 1);
            if (stylesWithSameName.length > 0) {
                navText.setStringValue(current + " / " + stylesWithSameName.length);
                ui.scrollViewSetContent(scrollView, styleViews(stylesWithSameName[current - 1]));
            } else {
                navText.setStringValue("0 / 0");
                ui.scrollViewSetContent(scrollView, []);
            }

        }
    });

    function styleViews(styles) {
        var views = [];
        styles.forEach(function(style) {
            var itemView = ui.view([400, 40]);
            var label = "        " + style.name + " (" + style.getAllInstancesLayers().length + ")";
            var checkbox = ui.checkBox(false, label, [10, 0, 380, 40]);
            var image;
            if (style.style.styleType == "Layer") {
                image = preview.layerStyle(style.sketchObject);
            }
            if (style.style.styleType == "Text") {
                image = preview.textStyleSmall(style.sketchObject);
            }
            var imageView = ui.image(image, [30, 8, 24, 24]);
            itemView.addSubview(checkbox);
            itemView.addSubview(imageView);
            views.push(itemView);

            checkbox.setCOSJSTargetFunction(function(sender) {
                var parent = sender.superview().superview();
                parent.subviews().forEach(function(subview1) {
                    subview1.subviews().forEach(function(subview2) {
                        if (subview2.class() == "NSButton") {
                            subview2.setState(NSOffState);
                        }
                    });
                });
                sender.setState(NSOnState);
            });
        });
        return views;
    }

    dialog.run();

};