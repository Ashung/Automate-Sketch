var onRun = function(context) {
    var document = require('sketch/dom').getSelectedDocument();
    var Text = require('sketch/dom').Text;
    var pasteboard = require("../modules/Pasteboard");
    var texts = pasteboard.getTextsNsArray();
    var predicate = NSPredicate.predicateWithFormat("SELF != ''");
    texts = texts.filteredArrayUsingPredicate(predicate);
    if (texts.count() == 0) {
        return;
    }
    texts = texts.sortedArrayUsingSelector("localizedStandardCompare:");

    var textsToString = texts.componentsJoinedByString('\n');
    pasteboard.copy(textsToString);

    var layer = new Text({
        text: String(textsToString),
        parent: document.selectedPage
    });

    // center of canvas
    var contentDrawView = document.sketchObject.contentDrawView();
    var midX = Math.round((contentDrawView.frame().size.width/2 - contentDrawView.horizontalRuler().baseLine())/contentDrawView.zoomValue() - layer.frame.width / 2);
    var midY = Math.round((contentDrawView.frame().size.height/2 - contentDrawView.verticalRuler().baseLine())/contentDrawView.zoomValue() - layer.frame.height / 2);
    layer.sketchObject.absoluteRect().setRulerX(midX);
    layer.sketchObject.absoluteRect().setRulerY(midY);

};