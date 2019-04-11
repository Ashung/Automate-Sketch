
var UI = {

    rect : function(size) {
        if (Array.isArray(size)) {
            switch (size.length) {
                case 4:
                    return NSMakeRect(size[0], size[1], size[2], size[3]);
                    break;
                case 3:
                    return NSMakeRect(0, size[0], size[1], size[2]);
                    break;
                case 2:
                    return NSMakeRect(0, 0, size[0], size[1]);
                    break;
                case 1:
                    return NSMakeRect(0, 0, size[0], 20);
                    break;
                default:
                    return NSMakeRect(0, 0, size[0], 20);
            }
        } else if (parseInt(size) >= 0){
            return NSMakeRect(0, 0, size, 20);
        } else {
            return NSMakeRect(0, 0, 300, 20);
        }
    },

    cosDialog : function(title, info, buttons) {
        var dialog = COSAlertWindow.alloc().init();
        dialog.setMessageText(title);
        if (info) {
            dialog.setInformativeText(info);
        }
        if (!buttons || !buttons instanceof Array) {
            dialog.addButtonWithTitle("OK");
            dialog.addButtonWithTitle("Cancel");
        } else {
            buttons.forEach(function(button) {
                dialog.addButtonWithTitle(button);
            });
        }
        return dialog;
    },

    checkBox : function(status, title, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 20]);
        }
        var view = NSButton.alloc().initWithFrame(frame);
        view.setButtonType(NSSwitchButton);
        view.setTitle(title);
        if (status == true) {
            view.setState(NSOnState);
        } else {
            view.setState(NSOffState);
        }
        return view;
    },

    groupLabel : function(text, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 16]);
        }
        var view = NSTextField.alloc().initWithFrame(frame);
        view.setStringValue(text.toUpperCase());
        view.setFont(NSFont.boldSystemFontOfSize(11));
        view.setTextColor(NSColor.blackColor());
        view.setBezeled(false);
        view.setDrawsBackground(false);
        view.setEditable(false);
        view.setSelectable(false);
        return view;
    },

    textLabel : function(text, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 16]);
        }
        var view = NSTextField.alloc().initWithFrame(frame);
        view.setStringValue(text);
        view.setBezeled(false);
        view.setDrawsBackground(false);
        view.setEditable(false);
        view.setSelectable(false);
        return view;
    },

    textField : function(text, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 24]);
        }
        var view = NSTextField.alloc().initWithFrame(frame);
        view.setStringValue(text);
        return view;
    },

    numberField : function(defaultNumber, min, max, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 50, 25]);
        }
        var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 25));
        var input = NSTextField.alloc().initWithFrame(frame);
        var formatter = NSNumberFormatter.alloc().init().autorelease();
        input.setStringValue(String(defaultNumber));
        input.setFormatter(formatter);
        var stepper = NSStepper.alloc().initWithFrame(NSMakeRect(frame.size.width + 2, 0, 16, 25));
        stepper.setMaxValue(max);
        stepper.setMinValue(min);
        stepper.setValueWraps(false);
        stepper.setAutorepeat(true);
        stepper.setIntegerValue(defaultNumber);
        stepper.setCOSJSTargetFunction(function(sender) {
            var value = sender.integerValue();
            input.setStringValue(String(value));
        });
        view.addSubview(input);
        view.addSubview(stepper);
        return {
            view: view,
            value: stepper.integerValue()
        };
    },

    disableTextField: function(view, bool) {
        if (bool == false) {
            view.setEditable(true);
            view.setTextColor(NSColor.blackColor());
        } else {
            view.setEditable(false);
            view.setTextColor(NSColor.grayColor());

        }
    },

    popupButton : function(items, size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 24]);
        }
        var view = NSPopUpButton.alloc().initWithFrame(frame);
        items.forEach(function(item) {
            view.addItemWithTitle("");
            view.lastItem().setTitle(item);
        });
        return view;
    },

    divider : function(size) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 300, 1]);
        }
        var view = NSView.alloc().initWithFrame(frame);
        view.setWantsLayer(true);
        view.layer().setBackgroundColor(CGColorCreateGenericRGB(0, 0, 0, 0.1));
        return view;
    },

    gap : function(length) {
        length = length || 1;
        var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 10, length * 4));
        return view;
    },

    scrollView : function(height) {
        var view = NSScrollView.alloc().initWithFrame(NSMakeRect(0, 0, 300, height));
        view.setHasVerticalScroller(true);
        view.setBorderType(NSBezelBorder);
        return view;
    },

    colorPicker : function(size, hexColor) {
        if (size && Array.isArray(size)) {
            var frame = this.rect(size);
        } else {
            var frame = this.rect([0, 0, size || 40, 20]);
        }
        var view = NSColorWell.alloc().initWithFrame(frame);
        if (hexColor) {
            var r = parseInt(hexColor.substr(1,2), 16) / 255;
            var g = parseInt(hexColor.substr(3,2), 16) / 255;
            var b = parseInt(hexColor.substr(5,2), 16) / 255;
            var color = NSColor.colorWithRed_green_blue_alpha(r, g, b, 1);
        } else {
            var color = NSColor.blackColor();
        }
        view.setColor(color);
        return view;
    }
};

module.exports = UI;
