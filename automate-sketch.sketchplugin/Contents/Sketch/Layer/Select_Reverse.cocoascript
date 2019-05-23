var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Layer");

    var document = context.document;
    var selection = context.selection;

    if (selection.count() == 0) {
        document.showMessage("Please select at least 1 layer.");
        return;
    }

    var parents = [];
    var parentsHavePage = false;
    selection.forEach(function(layer) {
        var parent = layer.parentGroup();
        if (parents.indexOf(parent) == -1) {
            parents.push(parent);
        }
        if (parent.class() == "MSPage") {
            parentsHavePage = true;
        }
    });

    if (parentsHavePage) {
        var currentPage = document.currentPage();
        currentPage.layers().forEach(function(layer) {
            selectReverse(layer);
        });
    }
    else {
        parents.forEach(function(parent) {
            parent.layers().forEach(function(layer) {
                selectReverse(layer);
            });
        });
    }

};

function selectReverse(layer) {
    if (layer.isSelected()) {
        layer.select_byExpandingSelection(false, true);
    }
    else {
        layer.select_byExpandingSelection(true, true);
    }
}
