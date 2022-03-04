var DataSupplier = require("sketch/data-supplier");
var System = require("../modules/System");

var onStartup = function() {
    DataSupplier.registerDataSupplier("public.text", "Text From File", "SupplyTextFromFile");
    DataSupplier.registerDataSupplier("public.image", "Image From Folder", "SupplyImageFromFolder");
    DataSupplier.registerDataSupplier("public.text", "Random Text From File", "SupplyRandomTextFromFile");
    DataSupplier.registerDataSupplier("public.image", "Random Image From Folder", "SupplyRandomImageFromFolder");
    DataSupplier.registerDataSupplier('public.text', 'Calendar', 'SupplyCalendar');
};

var onShutdown = function() {
    DataSupplier.deregisterDataSuppliers();
};

var onSupplyTextFromFile = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var texts = System.textsFromChooseFile();
    if (texts.length > 0) {
        supplyOrderedData(context, texts);
    }
};

var onSupplyImageFromFolder = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var images = System.imagesFromChooseFolder();
    if (images.length > 0) {
        supplyOrderedData(context, images);
    }
};

var onSupplyRandomTextFromFile = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var texts = System.textsFromChooseFile();
    if (texts.length > 0) {
        supplyRandomData(context, texts);
    }
};

var onSupplyRandomImageFromFolder = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");
    var images = System.imagesFromChooseFolder();
    if (images.length > 0) {
        supplyRandomData(context, images);
    }
};

var onSupplyCalendar = function(context) {
    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var dialog = new Dialog("Calendar");
    dialog.addLabel("Start Date:");
    var dateView = ui.view([0, 0, 300, 24]);
    var datePicker = ui.datePicker();
    var resetButton = ui.button("Reset", [120, 0, 80, 24]);
    dateView.addSubview(datePicker);
    dateView.addSubview(resetButton);
    dialog.addView(dateView);
    dialog.addLabel("Insert:");
    var insertTypeView = ui.popupButton([
        `Year`, // 0 y
        `Month: numerical`, // 1 M
        `Month: 2 numerical`, // 2 MM
        `Month: 1 letter`, // 3 MMMMM
        `Month: 3 letters`, // 4 MMMM*
        `Month: full name`, // 5 MMMM
        `Day`, // 6 d
        `Day: 2 numerical`, // 7 dd
        `Week day: 1 letter`, // 8 EEEEE
        `Week day: 2 letters`, // 9 EEEEEE
        `Week day: 3 letters`, // 10 E
        `Week day: full`, // 11 EEEE
        `几月`, // 12 MMM
        `星期几`, // 13 EEEE
        `周几`, // 14 E
        `星期简化`, // 15 EEEEE
        `农历月`, // 16 MMMM
        `农历日`, // 17 d
        `农历日 (将 "初一" 改为某月)`, // 18 d
        `甲子`, // 19 U
    ], 200);
    dialog.addView(insertTypeView);

    resetButton.setCOSJSTargetFunction(function(sender) {
        datePicker.setDateValue(NSDate.date());
    });
    
    var responseCode = dialog.run();
    if (responseCode == 1000) {
        for (var i = 0; i < context.data.requestedCount; i++) {
            var increaseYear = 0;
            var increaseMonth = 0;
            var increaseDay = 0;
            var calendarIdentifier = NSCalendarIdentifierGregorian;
            var localeIdentifier = "en-US";
            var dateFormat = "";
            var textLength;
            var insertType = insertTypeView.indexOfSelectedItem();
            if (insertType == 0) {
                increaseYear = 1;
                dateFormat = "y";
            } else if (insertType == 1) {
                increaseMonth = 1;
                dateFormat = "M";
            } else if (insertType == 2) {
                increaseMonth = 1;
                dateFormat = "MM";
            } else if (insertType == 3) {
                increaseMonth = 1;
                dateFormat = "MMMMM";
            } else if (insertType == 4) {
                increaseMonth = 1;
                dateFormat = "MMMM";
                textLength = 3;
            } else if (insertType == 5) {
                increaseMonth = 1;
                dateFormat = "MMMM";
            } else if (insertType == 6) {
                increaseDay = 1;
                dateFormat = "d";
            } else if (insertType == 7) {
                increaseDay = 1;
                dateFormat = "dd";
            } else if (insertType == 8) {
                increaseDay = 1;
                dateFormat = "EEEEE";
            } else if (insertType == 9) {
                increaseDay = 1;
                dateFormat = "EEEEEE";
            } else if (insertType == 10) {
                increaseDay = 1;
                dateFormat = "E";
            } else if (insertType == 11) {
                increaseDay = 1;
                dateFormat = "EEEE";
            } else if (insertType == 12) {
                increaseMonth = 1;
                dateFormat = "MMM";
                localeIdentifier = "zh_Hans";
            } else if (insertType == 13) {
                increaseDay = 1;
                dateFormat = "EEEE";
                localeIdentifier = "zh_Hans";
            } else if (insertType == 14) {
                increaseDay = 1;
                dateFormat = "E";
                localeIdentifier = "zh_Hans";
            } else if (insertType == 15) {
                increaseDay = 1;
                dateFormat = "EEEEE";
                localeIdentifier = "zh_Hans";
            } else if (insertType == 16) {
                increaseMonth = 1;
                dateFormat = "MMMM";
                calendarIdentifier = NSCalendarIdentifierChinese;
                localeIdentifier = "zh_Hans";
            } else if (insertType == 17 || insertType == 18) {
                increaseDay = 1;
                dateFormat = "d";
                calendarIdentifier = NSCalendarIdentifierChinese;
                localeIdentifier = "zh_Hans";
            } else if (insertType == 19) {
                increaseYear = 1;
                dateFormat = "U";
                calendarIdentifier = NSCalendarIdentifierChinese;
                localeIdentifier = "zh_Hans";
            }

            var dateComponents = NSDateComponents.alloc().init();
            dateComponents.setYear(increaseYear * i);
            dateComponents.setMonth(increaseMonth * i);
            dateComponents.setDay(increaseDay * i);
            let formatter = NSDateFormatter.alloc().init();
            let locale = NSLocale.alloc().initWithLocaleIdentifier(localeIdentifier);
            let calendar = NSCalendar.alloc().initWithCalendarIdentifier(calendarIdentifier);
            formatter.setLocale(locale);
            formatter.setCalendar(calendar);
            formatter.setDateFormat(dateFormat);
            let newNsDate = calendar.dateByAddingComponents_toDate_options(dateComponents, datePicker.dateValue(), nil);
            let text = String(formatter.stringFromDate(newNsDate));
            if (insertType == 18 || insertType == 19) {
                if (insertType == 19 && text == 1) {
                    formatter.setDateFormat("MMMM");
                    text = String(formatter.stringFromDate(newNsDate));
                } else {
                    text = [
                        "初一","初二","初三","初四","初五","初六","初七","初八","初九","初十",
                        "十一","十二","十三","十四","十五","十六","十七","十八","十九","廿十",
                        "廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"
                    ][text - 1];
                }
            }
            if (textLength) {
                text = text.substr(0, textLength);
            }
            DataSupplier.supplyDataAtIndex(context.data.key, text, i);
        }
    }
};

function supplyOrderedData(context, data) {
    var sketch = require("sketch");
    var version = sketch.version.sketch;
    for (var i = 0; i < context.data.requestedCount; i++) {
        var dataIndex;
        if (context.data.isSymbolInstanceOverride == 1) {
            var selection;
            if (version >= 84) {
                selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers();
            } else {
                selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers().layers();
            }
            dataIndex = selection.indexOfObject(context.data.items.objectAtIndex(i).symbolInstance());
        } else {
            dataIndex = i;
        }
        DataSupplier.supplyDataAtIndex(context.data.key, data[dataIndex % data.length], i);
    }
}

function supplyRandomData(context, data) {
    for (var i = 0; i < context.data.requestedCount; i++) {
        DataSupplier.supplyDataAtIndex(context.data.key, data[Math.floor(Math.random() * data.length)], i);
    }
}