var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Guide");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    var selection = context.selection;
    var predicate = NSPredicate.predicateWithFormat("className IN %@", ["MSArtboardGroup", "MSSymbolMaster"]);
    var selectedArtboards = selection.filteredArrayUsingPredicate(predicate);

    if (selectedArtboards.count() == 0) {
        document.showMessage("Please select an artboard or symbol master.");
        return;
    }

    var dialog = new Dialog(
        "Grid Preset",
        "Choose the grid setting preset for selected artboards.",
        300,
        ["Close"]
    );

    var presets = [
        {
            title: "1 x 8",
            gridSize: 1,
            thickGridTimes: 8
        },
        {
            title: "8 x 1 (Layout grid)",
            gridSize: 8,
            thickGridTimes: 1
        },
        {
            title: "1 x 10",
            gridSize: 1,
            thickGridTimes: 10
        },
        {
            title: "1 x 12 (For 24px icon design)",
            gridSize: 1,
            thickGridTimes: 12
        },
        {
            title: "2 x 8",
            gridSize: 2,
            thickGridTimes: 8
        },
        {
            title: "2 x 10",
            gridSize: 2,
            thickGridTimes: 10
        },
        {
            title: "4 x 8",
            gridSize: 4,
            thickGridTimes: 8
        },
        {
            title: "8 x 8",
            gridSize: 8,
            thickGridTimes: 8
        }
    ];
    var presetTitles = presets.map(function(item){
        return item.title;
    });
    var preset = ui.popupButton(presetTitles, 200);
    dialog.addView(preset);

    var gridSize = presets[0].gridSize;
    var thickGridTimes = presets[0].thickGridTimes;
    setGrid(selectedArtboards, gridSize, thickGridTimes)

    preset.setCOSJSTargetFunction(function(sender) {
        var presetIndex = sender.indexOfSelectedItem();
        var gridSize = presets[presetIndex].gridSize;
        var thickGridTimes = presets[presetIndex].thickGridTimes;
        setGrid(selectedArtboards, gridSize, thickGridTimes)
    });

    dialog.run();

};

function setGrid(artboards, gridSize, thickGridTimes) {
    var loopArtboard = artboards.objectEnumerator();
    var artboard;
    while (artboard = loopArtboard.nextObject()) {
        var grid = MSSimpleGrid.alloc().init();
        grid.setThickGridTimes(thickGridTimes);
        grid.setGridSize(gridSize);
        artboard.setGrid(grid);
        artboard.grid().setIsEnabled(true);
    }
}
