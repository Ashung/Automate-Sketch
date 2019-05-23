var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Prototyping");

    var document = context.document;
    var selection = context.selection;
    var layer = selection.firstObject();

    var showMessage = false;
    if (selection.count() != 1) {
        showMessage = true;
    }
    else {
        if (layer.flow()) {
            layer.resetFlow();
            var addFlowAction = document.actionsController().actionForID("MSAddFlowAction");
            if (addFlowAction.validate()) {
                addFlowAction.performAction(null);
            }
        }
        else {
            showMessage = true;
        }
    }

    if (showMessage) {
        document.showMessage("Please select 1 hotspot layer or layer with a link.");
    }

};
