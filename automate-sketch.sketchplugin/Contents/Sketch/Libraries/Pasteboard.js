
module.exports.pbcopy = function(text) {
    var pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();
    pasteboard.setString_forType(text, NSStringPboardType);
};
