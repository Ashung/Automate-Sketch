var doc = null
var libSymbolReferences = {}
var sketch = require('sketch')

var onRun = function (context) {

    var ga = require("../modules/Google_Analytics");
    ga("Symbol");

    var Dialog = require("../modules/Dialog").dialog;
    var ui = require("../modules/Dialog").ui;
    var system = require("../modules/System");
    var document = context.document
    doc = sketch.fromNative(document)
    var updatedCounter = 0

    doc.pages.forEach(page => {
        const nativeLayers = page.sketchObject.children();
        nativeLayers.forEach(function (sl) {
            const l = sketch.fromNative(sl)
            if ("SymbolInstance" != l.type) return
            //
            updatedCounter += handleInstance(l)
        })
    })

    document.showMessage("Updated " + updatedCounter + " symbol instances.")
};
function handleInstance(l) {
    const masterName = l.master.name
    const masterID = l.symbolId
    const lib = l.master.getLibrary()
    if (!lib) return
    // Try to get symbol references from cache
    var symbolReferences = libSymbolReferences[lib.name]
    if (!(symbolReferences)) {
        // Load symbol references and put them into case
        libSymbolReferences[lib.name] = lib.getImportableSymbolReferencesForDocument(doc)
        symbolReferences = libSymbolReferences[lib.name]
    }
    //
    let foundRefs = symbolReferences.filter(s => s.id == masterID)
    // If symbol master can not be found by ID in the same library
    if (0 == foundRefs.length) {
        log("Can not found master by ID for " + l.name)
        foundRefs = symbolReferences.filter(s => s.name == masterName)
        if (0 == foundRefs.length) {
            log(" Is not found by name -> can not be relinked")
        } else {
            const newMaster = foundRefs[0].import()
            l.sketchObject.changeInstanceToSymbol(newMaster.sketchObject)
            log(" Found new symbol master by the same name  and re-linked to instance")
            return 1
        }
        ///
    } else {
    }
    return 0
}