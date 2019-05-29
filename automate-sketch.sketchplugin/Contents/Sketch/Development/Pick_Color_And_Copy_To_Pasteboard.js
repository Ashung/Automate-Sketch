var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Development");

    var document = context.document;

    coscript.pushAsCurrentCOScript();
    coscript.setShouldKeepAround(true);

    var button = BCMagnifierButton.alloc().initWithFrame(NSZeroRect);
    button.setCOSJSTargetFunction(function(obj) {

        var pickColor;
        if (MSApplicationMetadata.metadata().appVersion >= 52) {
            pickColor = obj.color();
        } else {
            pickColor = obj.chosenColor();
        }
        var color = MSColor.colorWithRed_green_blue_alpha(pickColor.red(), pickColor.green(), pickColor.blue(), 1);
        var hexValue = "#" + color.immutableModelObject().hexValue();

        // log(hexValue)

        var pboard = NSPasteboard.generalPasteboard();
        pboard.clearContents();
        pboard.setString_forType_(hexValue, NSStringPboardType);

        document.showMessage("Color code \"" + hexValue + "\" copied.");

        coscript.setShouldKeepAround(false);

    });
    button.performClick(null);

};
