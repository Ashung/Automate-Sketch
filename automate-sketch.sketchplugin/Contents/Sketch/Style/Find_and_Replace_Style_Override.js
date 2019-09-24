var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Style");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var currentPage = document.selectedPage;
    var identifier = __command.identifier();

    var styles = [];
    if (identifier == "find_and_replace_layer_style_override") {
        styles = document.sharedLayerStyles;
    } else {
        styles = document.sharedTextStyles;
    }
    styles.forEach(style => {
        log(style.name);

        // s.sketchObject.foreignObject() == null

        //         log(style.foreignObject());
        // log(style.objectID());
        // log(style.getLibrary());

        //         log(style.name)
        // log(style.id)

    })


    // Dialog
    var dialogTitle;
    var dialogMessage;
    var dialog = new Dialog(
        "Find and Replace Layer Style Override",
        "."
    );

    var responseCode = dialog.run();
    if (responseCode == 1000) {

    }

};