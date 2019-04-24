// TODO: Dialog and UI
function Dialog (title, info, buttons, width) {
    this._views = [];
    this._title = title;
    this._info = info;
    this._buttons = buttons;
    this._width = width;
  }
  
  Dialog.prototype.addSubviews = function(view) {
    this._views.push(view);
  }
  
  Dialog.prototype.runModal = function() {
      var dialog = NSAlert.alloc().init();
      dialog.setMessageText(this._title);
      dialog.setInformativeText(this._info);
      if (!this._buttons || !this._buttons instanceof Array) {
          dialog.addButtonWithTitle("OK");
          dialog.addButtonWithTitle("Cancel");
      } else {
          this._buttons.forEach(function(button) {
              dialog.addButtonWithTitle(button);
          });
      }
      return dialog.runModal();
  }