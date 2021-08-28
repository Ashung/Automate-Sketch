var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Library");

    var sketch = require("sketch/dom");
    var UI = require("sketch/ui");
    var document = sketch.getSelectedDocument();
    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var preview = require("../modules/Preview");

    var librarySymbols = document.getSymbols().filter(function(symbol) {
        return symbol.getLibrary();
    });

    if (librarySymbols.length == 0) {
        UI.message("Not library symbol in current document.");
        return;
    }

    var dialog = new Dialog(
        "Change Library Symbols to Local"
    );

    var selectAll = ui.checkBox(true, "Select / Deselect all symbols.");
    selectAll.setAllowsMixedState(true);
    dialog.addView(selectAll);

    var symbolsWillMakeLocal = librarySymbols.slice(0);
    var views = [];
    librarySymbols.forEach(function(symbol) {
        var wrapper = ui.view([300, 50]);
        var checkBoxSymbol = ui.checkBox(true, "            " + symbol.name, [5, 0, 300, 50]);
        var imageSymbol = ui.imageButton(preview.symbol(symbol.sketchObject, 40), [30, 10, 30, 30]);
        wrapper.addSubview(checkBoxSymbol);
        wrapper.addSubview(imageSymbol);
        views.push(wrapper);

        checkBoxSymbol.setCOSJSTargetFunction(function(sender) {
            if (sender.state() == NSOffState) {
                removeSymbol(symbolsWillMakeLocal, symbol);
            }
            if (sender.state() == NSOnState) {
                symbolsWillMakeLocal.push(symbol);
            }
            if (symbolsWillMakeLocal.length == librarySymbols.length) {
                selectAll.setState(NSOnState);
            } else if (symbolsWillMakeLocal.length == 0) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });
        imageSymbol.setCOSJSTargetFunction(function(sender) {
            var checkBox = sender.superview().subviews().firstObject();
            checkBox.setState(checkBox.state() == NSOnState ? NSOffState : NSOnState);
            if (checkBox.state() == NSOffState) {
                removeSymbol(symbolsWillMakeLocal, symbol);
            }
            if (checkBox.state() == NSOnState) {
                symbolsWillMakeLocal.push(symbol);
            }
            if (symbolsWillMakeLocal.length == librarySymbols.length) {
                selectAll.setState(NSOnState);
            } else if (symbolsWillMakeLocal.length == 0) {
                selectAll.setState(NSOffState);
            } else {
                selectAll.setState(NSMixedState);
            }
        });
    });
    var scrollView = ui.scrollView(views, [300, 300]);
    dialog.addView(scrollView);

    selectAll.setCOSJSTargetFunction(function(sender) {
        if (sender.state() == NSOnState || sender.state() == NSMixedState) {
            sender.setState(NSOnState);
            symbolsWillMakeLocal = librarySymbols;
            selectedItemsCount = librarySymbols.length;
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOnState);
            });
        } else {
            symbolsWillMakeLocal = [];
            selectedItemsCount = 0;
            scrollView.documentView().subviews().forEach(function(view) {
                view.subviews().objectAtIndex(0).setState(NSOffState);
            });
        }
    });

    var responseCode = dialog.run();
    if (responseCode == 1000) {
        symbolsWillMakeLocal.forEach(function(symbol) {
            symbol.unlinkFromLibrary();
        });
        UI.message(`${symbolsWillMakeLocal.length} symbol${symbolsWillMakeLocal.length > 1 ? 's' : ''} have been make local.`);
    }
};

function removeSymbol(all, symbol) {
    var index = all.findIndex(function(item) {
        return item.symbolId == symbol.symbolId;
    });
    all.splice(index, 1);
}