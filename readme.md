
![Automate Sketch](automate-sketch.png)

# Automate Sketch

Make your workflow more efficient.

[中文说明](readme_zh.md)

## Installation

- Search "Automate Sketch" from [Sketch Runner](http://sketchrunner.com/),  [Sketchpacks](https://sketchpacks.com/) or [Sketch Toolbox](http://sketchtoolbox.com/).
- Download [master.zip](https://github.com/Ashung/Automate-Sketch/archive/master.zip), unzip it, then double-click the "automate-sketch.sketchplugin".
- [Download](https://github.com/Ashung/Automate-Sketch/releases) for older version of Sketch.

## Features

| Menu                                     | Notes                                    |
| ---------------------------------------- | ---------------------------------------- |
| **Layer**                                |                                          |
| Fix to Parent Width (Height) with Margin | Fix the width or height of the parent, and set the margins. |
| Bounds Layer for Every Selection         | Create a bounds layer from the selected layer. |
| Divide Layer                             | Split Layer.                             |
| Unlock All Layers                        | Unlock all layers.                       |
| Click Through On (Off)                   | Trun on/off the click through.           |
| Select All Layers In Selection By ...    | Select all groups, text, shapes, bitmaps, symbol instances, slices, exportable layers, hidden layers, or match by layer name. |
| Select All Child Layers                  | Select all sub-layers.                   |
| Select Parent Groups                     | Select parent groups.                    |
| Paste and Replace                        | Paste and replace, replace the selected layer with the Sketch layer on the clipboard. |
| Clear Layer Name                         | Clears the layer name and removes the "copy" after the layer name. |
| Remove Redundant Groups                  | Remove redundant nested groups.          |
| Remove Hidden Layers                     | Remove hidden layers.                    |
| Delete Empty Groups                      | Delete empty group.                      |
| Create / Sync Include Layer              | Create and synchronize reference layers, automatically synchronize the copied layers into a group. |
| **Arrange**                              |                                          |
| Change Places Between Two Layers         | Change two objects positions based on midpoint or coordinate origin. |
| Tile Layers by Position X (Y)            | Horizontal or vertical tiling objects.   |
| Tile Layers Horizontally (Vertically) by Index | Horizontal or vertical tile based on layer list location. |
| Arrange Objects                          | Arrange selected layers or artboard.     |
| Order Layers By ...                      | Change the position in the layer list based on the object X / Y value, name, type. |
| Reverse Layer Order                      | Invert the position in the layer list.   |
| **Type**                                 |                                          |
| Capitalize                               | Capitalize.                              |
| Change Baseline offset                   | Change Baseline Offset for selected range of text layer. |
| Change Text Orientation                  | Change Text Orientation for CJK text layout. |
| Change Typeface for Latin Character      | Change the typeface for latin-character in the text layer. |
| Add Space Between CJK and Latin Character | Add space between Chinese and Western.   |
| Replace Fonts                            | Replace Fonts.                           |
| Replace Missing Fonts                    | Replace missing fonts.                   |
| Resize to Fit Text Height                | Resize text layer to fit text field height. |
| Unfixed Layer Name                       | Cancels the fixed layer name of the text layer so that the layer name of the text follows the content. |
| **Slice**                                |                                          |
| New Layer Base Slice                     | Create a new slice based on a layer.     |
| New Layer Base Slice for ...             | Create a new slice based on a layer,  iOS, Android and Web presets. |
| Remove All Slices                        | Clear all slices.                        |
| Clear All Exportables                    | Clear all Exportable settings.           |
| **Artboard**                             |                                          |
| Artboard Form Selection                  | Create a new artboard from the selection object. |
| Artboard Form Group                      | Create a new artboard from group.        |
| Artboard to Group                        | Artboard to group.                       |
| Resize to Fix Height                     | Adjusts the artboard to fit the height.  |
| Export all Artboards to PNG              | Export all artboards to PNG to set the zoom ratio. |
| Export all Artboards to HTML             | Export show with HTML, searchable. When using SVG format, you can drag directly into Sketch. |
| **Symbol**                               |                                          |
| Set to Original Width / Height           | Set to original width / height.          |
| Select All Instance of Symbol            | Select an instance of the symbol.        |
| Rename Instances                         | Reset the instance name to the component (symbol master) full name. |
| Custom Instances Name                    | Change all instances of the selected page of the current page, artboard, or document to a custom name, symbol name, or symbol full name. |
| Move Symbol Masters to Bottom of Anther  | Move to the bottom of another symbol master. |
| Selection to Symbol Master               | Change the selected layer directly into the symbol in its original position. |
| Detach Unused Symbol Master              | Converts unused symbol templates to groups. |
| Remove Unused Symbols                    | Remove unused symbols.                   |
| Export all Symbols As PNG                | Export all symbols as PNG according to the "Page / symbol" rule. |
| Sync Symbol Master from Sketch File      | Synchronize symbols from Sketch files based on Symbol ID. |
| Replace Pages from Sketch File           | Forcing the replacement of the same name from the Sketch file, you can import the page containing the symbol by modifying the page name. |
| **Styles**                               |                                          |
| Add Solid Fill from CSS Color            | Fill from CSS color code.                |
| Fill Color from Global (Document) Colors | Fill from the global (document) color fast. |
| Swap Fill and Border                     | Swap fills and borders.                  |
| Reflection                               | Show the hidden reflection style.        |
| Remove All Unused Styles                 | Delete unused styles in all layers of the current page. |
| Create Color Guide                       | Create a color guide from document color. |
| Create Typography Guide                  | Create a font style guide from a text style. |
| Import Document Assets from Sketch File  | Import resources (colors, gradients, and patterns) from Sketch files. |
| Import Text Styles from Sketch File      | Import text styles from Sketch files.    |
| Import Layer Styles from Sketch File     | Import a layer style from Sketch file.   |
| **Guides**                               |                                          |
| Clear Guides                             | Clear all guides.                        |
| Grid Presets                             | Common Grid Presets, like 8x8, 10x10 etc. |
| Hide All Grid/Layout                     | Hide all grid or layout.                 |
| Copy Grid/Layout/Guide                   | Copy the grid/layout/guide from seleted artboard. |
| Paste Grid/Layout/Guide                  | Apply the grid/layout/guide for seleted artboards, you must run Copy Grid/Layout/Guide first. |
| **Development**                          |                                          |
| Copy ObjectID or SymbolID                | When you select a layer, copy the ObjectID or SymbolID of the layer to the clipboard. |
| Copy Slice as Base64                     | The slice image is copied to Base64, depending on the format and scale of the first item of the slice, you can get a different image. |
| Copy Selected Layer Name                 | Copy the selected layer name to the clipboard. |
| Show File in Finder                      | Open the current document in the Finder. |
| Open Terminal at File Folder             | Open the terminal and switch to the directory of the current document. |
| Script Editor Setting                    | Script editor font and font size settings. |
| Edit Plugin Setting                      | Set up external plugin editor, default editor Atom, Sublime Text, Visual Studio Code and WebStorm. |
| Reload Plugins                           | Reload all plugins.                      |
| **Utilities**                            |                                          |
| SVG Export Setting                       | SVG export settings.                     |
| Nudge Distance Setting                   | Setting to move layers with the arrow keys (also supported in latest version of Sketch) |
| Convert Sketch File to Other Version     | Go to Sketch File for any later version of 43, you can open a high version file or go to a lower version. |

## License

CC BY-SA 4.0

[![cc-by-sa-4.0](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](http://creativecommons.org/licenses/by-sa/4.0/)

### Donate

Donate [$1.00](https://www.paypal.me/ashung/1)  [$2.00](https://www.paypal.me/ashung/2)  [$5.00](https://www.paypal.me/ashung/5) via PayPal.
