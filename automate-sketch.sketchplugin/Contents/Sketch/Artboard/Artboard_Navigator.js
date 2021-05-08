var sketch = require('sketch');

var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Artboard");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;

    var document = context.document;
    var currentPage = document.currentPage();
    var allPages = getAllPagesHaveArtboards(document);
    var allArtboards = document.documentData().allArtboards();

    if (allArtboards.count() == 0) {
        document.showMessage("No artboards in current document.");
        return;
    }

    // Dialog
    var dialog = new Dialog(
        "Artboard Navigator",
        "Click the title to select and show the artboard, click the edit icon to rename artboard.",
        300,
        ["Close"]
    );

    if (allPages.count() > 1) {
        var pageLabelView = ui.textLabel("Choose Page");
        dialog.addView(pageLabelView);

        var pageNames = [];
        allPages.forEach(function(page) {
            pageNames.push(page.name());
        });
        var choosePageView = ui.popupButton(pageNames, 200);
        dialog.addView(choosePageView);

        if (allPages.containsObject(currentPage)) {
            choosePageView.selectItemAtIndex(allPages.indexOfObject(currentPage));
        }
    }

    var scrollView = ui.scrollView([], 260);
    dialog.addView(scrollView);

    // Init
    if (allPages.containsObject(currentPage)) {
        loadData(context, scrollView, currentPage);
    }
    else {
        loadData(context, scrollView, allPages.firstObject());
    }

    if (allPages.count() > 1) {
        choosePageView.setCOSJSTargetFunction(function(sender) {
            var page = allPages.objectAtIndex(sender.indexOfSelectedItem());
            document.setCurrentPage(page);
            loadData(context, scrollView, page);
        });
    }

    // Run
    dialog.run();

};

function loadData(context, scrollView, page) {
    var zoom = require("../modules/Zoom");
    var ui = require("../modules/Dialog").ui;
    var artboards = page.artboards().reverseObjectEnumerator().allObjects().mutableCopy();
    var sortDescriptor = NSSortDescriptor.sortDescriptorWithKey_ascending_selector(
        "name", true, "localizedStandardCompare:"
    );
    artboards = artboards.sortedArrayUsingDescriptors([sortDescriptor]);

    var itemsCount = artboards.count();
    var itemHeight = 40;
    var contentView = ui.view([0, 0, 300, itemsCount * itemHeight + 10]);

    artboards.forEach(function(item, index) {
        var itemView = ui.view([0, itemHeight * index, 300, itemHeight]);

        var iconView = NSImageView.alloc().initWithFrame(NSMakeRect(4, 12, 16, 16));
        var icon = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("icon_artboard.png"));
        if (item.class() == "MSSymbolMaster") {
            icon = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("icon_symbol.png"));
        }
        iconView.setImage(icon);
        itemView.addSubview(iconView);

        var nameButton = NSButton.alloc().initWithFrame(NSMakeRect(24, 0, 300, itemHeight));
        nameButton.setButtonType(NSMomentaryChangeButton);
        nameButton.setBezelStyle(nil);
        nameButton.setBordered("NO");
        nameButton.setAlignment(NSTextAlignmentLeft);
        nameButton.setTitle(item.name());
        itemView.addSubview(nameButton);

        nameButton.setCOSJSTargetFunction(function(sender) {
            var currentPage = context.document.currentPage();
            currentPage.changeSelectionBySelectingLayers([item]);
            zoom.toSelection();
        });

        var editIcon = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("icon_edit.png"));
        editIcon.setSize(CGSizeMake(16, 16));
        var renameButton = ui.imageButton(editIcon, [300 - itemHeight, 0, itemHeight, itemHeight]);
        itemView.addSubview(renameButton);

        renameButton.setCOSJSTargetFunction(function(sender) {
            sketch.UI.getInputFromUser("Rename Artboard", { initialValue: item.name() }, function(err, value) {
                if (err) {
                    return;
                }
                item.setName(value);
                loadData(context, scrollView, page);
            });
        });

        var divider = ui.divider([0, itemHeight - 1, 300, 1]);
        itemView.addSubview(divider);

        contentView.addSubview(itemView);
    });
    scrollView.setDocumentView(contentView);
}

function getAllPagesHaveArtboards(document) {
    var pages = NSMutableArray.alloc().init();
    document.pages().forEach(function(page) {
        if (page.artboards().count() > 0) {
            pages.addObject(page);
        }
    });
    return pages;
}
