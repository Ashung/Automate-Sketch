// TODO: Module: Dialog and UI
/**
 * @param  {String} message
 * @param  {String} info
 * @param  {Array} buttons Optional, array with 1..3 strings, default is ["OK", "Cancel"].
 * @param  {Number} width Optional default is 300.
 */
function dialog (message, info, buttons, width) {
    this.views = [];
    this.message = message || "Message Text";
    this.info = info || "Informative Text";
    this.width = width || 300;
    if (buttons instanceof Array && buttons.length > 0) {
        this.buttons = buttons;
    } else {
        this.buttons = ["OK", "Cancel"];
    }
}

/**
 * @param  {NSView} view
 */
dialog.prototype.addView = function(view) {
    this.views.push(view);
}

/**
 * @return  {Object} { responseCode: 1000 | 1001 | 1002, self: NSAlert }
 */
dialog.prototype.run = function() {
    var alert = NSAlert.alloc().init();
    alert.setMessageText(this.message);
    alert.setInformativeText(this.info);
    // Icon
    var icon = NSImage.imageNamed("plugins")
    if (__command.pluginBundle() && __command.pluginBundle().alertIcon()) {
        icon = __command.pluginBundle().alertIcon();
    }
    alert.setIcon(icon);
    this.buttons.forEach(function(button) {
        alert.addButtonWithTitle(button);
    });
    // layout
    var height = 0;
    var supView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, this.width, 1));
    supView.setFlipped(true);
    this.views.forEach(function(view) {
        var currentFrame = view.bounds();
        currentFrame.origin.y = height;
        height += currentFrame.size.height + 8;
        view.setFrame(currentFrame);
        supView.addSubview(view);
    });
    var viewFrame = supView.frame();
    viewFrame.size.height = height;
    supView.setFrame(viewFrame);
    alert.setAccessoryView(supView);

    var responseCode = alert.runModal();
    return {
        responseCode: Number(responseCode),
        self: alert
    }
}

dialog.prototype.close = function() {
    NSApp.stopModal();
}

module.exports = dialog;