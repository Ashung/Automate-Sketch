var onRun = function(context) {

    var ga = require("../modules/Google_Analytics");
    ga("Data");

    var system = require("../modules/System");
    var sketch = require("sketch");
    var document = sketch.getSelectedDocument();
    var ui = require("sketch/ui");
    var images = {};

    if (document.selectedLayers.isEmpty) {
        ui.message('Please select at least 1 layer.');
        return;
    }

    var json = [];
    for (var i = 0; i < document.selectedLayers.length; i++) {
        var layer = document.selectedLayers.layers[i];
        var data = getData(layer);
        if (data && Object.keys(data).length > 0) {
            json.push(data);
        }
    }

    if (json.length === 0) {
        ui.message('No data found.');
        return;
    }

    let exportFolder = system.chooseFolder();
    if (exportFolder) {
        system.writeStringToFile(JSON.stringify(json, null, 2), exportFolder + "/data.json");
        var imagesData = Object.values(images);
        if (imagesData.length > 0) {
            system.mkdir(exportFolder + "/images");
            imagesData.forEach(function(image) {
                system.exportImageDataAsJpg(image, exportFolder + "/images/" + String(image.id) + ".jpg", 0.9);
            });
        }
        system.showInFinder(exportFolder);
    }

    function getData(layer) {
        var data = {};
        if (layer.type == "SymbolInstance") {
            var overrides = layer.overrides.filter(function(o) {
                return o.editable && ["symbolID", "stringValue", "image"].includes(o.property);
            });
            var dataGroupByPath = { "": data };
            for (const o of overrides) {
                var pathComponents = o.path.split("/");
                pathComponents.pop();
                var parentPath = pathComponents.join("/");
                if (o.property == "symbolID") {
                    dataGroupByPath[o.path] = {};
                    if (dataGroupByPath[parentPath]) {
                        dataGroupByPath[parentPath][o.affectedLayer.name] = dataGroupByPath[o.path];
                    }
                    continue;
                }
                if (o.property == "image") {
                    var key = String(o.value.id);
                    if (!images[key]) {
                        images[key] = o.value;
                    }
                    dataGroupByPath[parentPath][o.affectedLayer.name] = 'images/' + key + '.jpg';
                } else {
                    dataGroupByPath[parentPath][o.affectedLayer.name] = o.value;
                }
            }
        }
        else if (layer.type == "Group") {
            for (const l of Array.from(layer.layers).reverse()) {
                if (l.type == "Group" || l.type == "SymbolInstance") {
                    data[l.name] = getData(l);
                } else if (l.type == "Text") {
                    data[l.name] = l.text;
                } else if (l.type == "Image") {
                    var key = String(l.image.id);
                    if (!images[key]) {
                        images[key] = l.image;
                    }
                    data[l.name] = 'images/' + key + '.jpg';
                } else {
                    var imageFill = l.style?.fills.reduce((prev, curr) => {
                        if (curr.fillType !== 'Pattern') return prev;
                        return curr.pattern.image;
                    }, null);
                    if (!imageFill) break;
                    var key = String(imageFill);
                    if (!images[key]) {
                        images[key] = imageFill;
                    }
                    data[l.name] = 'images/' + key + '.jpg';
                }
            }
        }
        else {
            return null;
        }
        data = removeEmptyNodes(data);
        return data;
    }

    function removeEmptyNodes(obj) {
        let hasEmptyNodes = false;
        Object.entries(obj).forEach(([key, value]) => {
            if (Object.keys(value).length === 0) {
                delete obj[key];
                hasEmptyNodes = true;
            } else if (typeof value === 'object') {
                obj[key] = removeEmptyNodes(value);
            }
        })
        return hasEmptyNodes ? removeEmptyNodes(obj) : obj;
    }

}
