![Automate Sketch](automate-sketch.png)

Make your workflow more efficient.

[**中文说明**](readme_zh.md)

## Installation

- Search "Automate Sketch" from [Sketch Runner](http://sketchrunner.com/).
- Download [master.zip](https://github.com/Ashung/Automate-Sketch/archive/master.zip), unzip it, then double-click the "automate-sketch.sketchplugin".
- [Download](http://ashung.github.io/Automate-Sketch/) for older version Sketch.

## All Features

**[Feature Request](https://github.com/Ashung/Automate-Sketch/issues/new)**

| Menu                                                         | Notes                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Layer**                                                    |                                                              |
| Fix to Parent with Margin                                    | Fix the width and height of the parent, and set the margins. |
| Fix to Parent Width (Height) with Margin                     | Fix the width or height of the parent, and set the margins.  |
| Bounds Layer for Every Selection                             | Create a bounds layer from the selected layer.               |
| Divide Layer                                                 | Split Layer.                                                 |
| Ungroup Shape Layer                                          | Ungroup shape layer.                                         |
| Unlock All Layers                                            | Unlock all layers.                                           |
| Toggle Layer Constrain Proportions                           | Lock or unlock constrain proportions for selected layers.    |
| Select All Layers In Selection By Type                       | Select all groups, text, shapes, bitmaps, symbol instances, slices, exportable layers, hidden layers. |
| Select All Layers In Selection By Name                       | Select all layers match by layer name.                       |
| Select All Child Layers                                      | Select all sub-layers.                                       |
| Select All Siblings Layers                                   | Select all siblings layers.                                  |
| Select Parent Groups                                         | Select parent groups.                                        |
| Select Layers Outside of Artboard Bounds                     | Select and reveal layers which is outside of the artboard bounds. |
| Select Reverse                                               | Select reverse.                                              |
| Paste and Replace                                            | Paste and replace, replace the selected layer with the Sketch layer on the clipboard. |
| Clear Layer Name                                             | Clears the layer name and removes the "copy" after the layer name. |
| Remove Redundant Groups                                      | Remove redundant nested groups.                              |
| Remove Empty Groups                                          | Remove empty group.                                          |
| Remove Hidden Layers                                         | Remove hidden layers.                                        |
| Remove Transparency Layers                                   | Remove transparency layers.                                  |
| Create / Sync Link Layer                                     | Create a link symbol layer from select group or artboard, and update the link symbol layers. |
| **Arrange**                                                  |                                                              |
| Change Places Between Two Layers                             | Change two objects positions based on midpoint or coordinate origin. |
| Tile Objects                                                 | Tile objects with grid or any orientations.                  |
| Tile Objects by Position X (Y)                               | Horizontal or vertical tiling objects.                       |
| Tile Objects Horizontally (Vertically) by Index              | Horizontal or vertical tile based on layer list location.    |
| Arrange Objects                                              | Arrange selected layers or artboard.                         |
| Order Layers By ...                                          | Change the position in the layer list based on the object X / Y value, name, type. |
| Reverse Layer Order                                          | Invert the position in the layer list.                       |
| **Text**                                                     |                                                              |
| Increase / Decrease Line Height                              | Increase and decrease line height for all selected text layers.  Plus or minus half of the value that you move objects while using Shift-Arrow key, you can change the value in Preferences - Canvas - Nudging. |
| Increase / Decrease Letter Spacing                           | Increase and decrease 0.38 letter spacing for all selected text layers. |
| Increase / Decrease / Reset Horizontally Scale               | Increase, decrease and reset horizontally scale for all selected text layers. |
| Split Text Layer                                             | Split selected text layers to multiple layer, use new line and a separator. |
| Combine Text Layers                                          | Combine selected layers to one layer.                        |
| Capitalize                                                   | Capitalize.                                                  |
| Change Baseline offset                                       | Change Baseline Offset for selected range of text layer.     |
| Change Text Orientation                                      | Change Text Orientation for CJK text layout.                 |
| Change Typeface for Latin Character                          | Change the typeface for latin-character in the text layer.   |
| Add Space Between CJK and Latin Character                    | Add space between Chinese and Western.                       |
| Replace Fonts                                                | Replace Fonts.                                               |
| Replace Missing Fonts                                        | Replace missing fonts.                                       |
| Resize to Fit Text Height                                    | Resize text layer to fit text field height.                  |
| Unfixed Layer Name                                           | Cancels the fixed layer name of the text layer so that the layer name of the text follows the content. |
| **Slice**                                                    |                                                              |
| Auto Slice                                                   | Create a slice based on layer with export preset.            |
| Fast slice, Fast slice Setting                               | Create a URL-friendly slice based on layer with export preset, without modal window. |
| Remove All Slices                                            | Clear all slices.                                            |
| Clear All Exportables                                        | Clear all Exportable settings.                               |
| Save/Load Export Presets                                     | Save and load export presets.                                |
| **Artboard**                                                 |                                                              |
| Artboard Form Selection                                      | Create a new artboard from the selection object.             |
| Artboard Form Group                                          | Create a new artboard from group.                            |
| Artboard to Group                                            | Artboard to group.                                           |
| Select Parent Artboard                                       | Select parent artboard for selected layers.                  |
| Artboard Navigator                                           | Quickly go to artboard and rename it.                        |
| Resize to Fix Height                                         | Adjusts the artboard to fit the height.                      |
| Move Artboards to Bottom of Anther                           | Move artboards or symbol masters to the bottom of another one. |
| Export all Artboards                                         | Export all artboards, symbols to PNG / SVG.                  |
| Export all Artboards to HTML                                 | Export show with HTML, searchable. When using SVG format, you can drag directly into Sketch. |
| **Symbol**                                                   |                                                              |
| Reset to Original Width / Height                             | Reset to original width / height.                            |
| Reset Overrides                                              | Reset symbol overrides in selection.                         |
| Select All Instance of Symbol                                | Select all instances of the symbol.                          |
| Select All Instances of Imported symbol                      | Select all instances of imported symbol (library symbol).    |
| Rename Instances                                             | Rename all instances,  rename selection instances, rename instance by symbol master. |
| Move Symbol Masters To Another Page                          | Move selected symbol masters to anthoer page.                |
| Create Symbols from Selected Layers                          | Create symbol masters from selected layers.                  |
| Selection to Symbol Master                                   | Change the selected layer directly into the symbol in its original position. |
| Detach Unused Symbol Master                                  | Converts unused symbol templates to groups.                  |
| Remove Unused Symbols                                        | Remove unused symbols, for Sketch 48+, with symbol preview.  |
| Export all Symbols As PNG                                    | Export all symbols as PNG according to the "Page / symbol" rule. |
| Sync Symbol Master from Sketch File                          | Synchronize symbols from Sketch files base on symbol ID.     |
| Replace Pages from Sketch File                               | Forcing the replacement of the same name from the Sketch file, you can import the page containing the symbol by modifying the page name. |
| **Library**                                                  |                                                              |
| Fix Library ID Conflict                                      | Fix library file with same document ID.                      |
| Imported Symbols Link Manage                                 | Link imported symbols to another library, or fix the library not found error. |
| Replace Library                                              | Swap all foreign symbols from one library to another.        |
| Replace Symbol With Library Symbol                           | Replace symbol with any library symbol.                      |
| Change symbols to Library Symbol Base Symbol ID              | Change the selected/all symbols to library symbol base on symbol ID. |
| Change Local Text Style to Library Text Style                | Change local text styles to same library text style from selected library. |
| Change Local Layer Style to Library Layer Style              | Change local layer styles to same library layer style from selected library. |
| Import Document Assets from Library                          | Import document assets like colors, gradients and images from any library. |
| Import Styles from Library                                   | Import text styles and layer styles from any library.        |
| Add Library Preview                                          | Add a artboard for library preview image.                    |
| Check For Library Updates                                    | Check for library updates.                                   |
| **Styles**                                                   |                                                              |
| Select Layer by Layer / Text Style                           | Select layer by layer or text style in curret page, selected layer groups. |
| Rename Layer to Style Name                                   | Rename selected layer to it's shared style name.             |
| Paste Fills / Borders / Shadows / Inner Shadows / Blur / Text Style / Text Color | After run "Edit" - "Copy" - "Copy Style ⌥⌘C", you can paste the fills, borders, shadows, inner shadows, blur to selected layers. |
| Add Solid Fill from CSS Color                                | Fill from CSS color code.                                    |
| Fill Color from Global (Document) Colors                     | Fill from the global (document) color fast.                  |
| Swap Fill and Border                                         | Swap fills and borders.                                      |
| Remove All Disabled Styles                                   | Remove disabled styles in all layers of the current page.    |
| Remove Unused Layer / Text Styles                            | Remove unused layer styles and text styles.                  |
| Create Color Guide                                           | Create a color guide from document color.                    |
| Create Typography Guide                                      | Create a font style guide from a text style.                 |
| Import Document Assets from Sketch File                      | Import resources (colors, gradients, and patterns) from Sketch files. |
| Import Text Styles from Sketch File                          | Import text styles from Sketch files.                        |
| Import Layer Styles from Sketch File                         | Import a layer style from Sketch file.                       |
| **Guides**                                                   |                                                              |
| Clear Guides                                                 | Clear all guides.                                            |
| Grid Presets                                                 | Common Grid Presets, like 8x8, 10x10 etc.                    |
| Hide All Grid/Layout                                         | Hide all grid or layout.                                     |
| Copy Grid/Layout/Guide                                       | Copy the grid/layout/guide from seleted artboard.            |
| Paste Grid/Layout/Guide                                      | Apply the grid/layout/guide for seleted artboards, you must run Copy Grid/Layout/Guide first. |
| **Prototyping**                                              |                                                              |
| Bring All Hotspot to Front                                   | Bring all hotspot layer to front.                            |
| **Development**                                              |                                                              |
| Pick Color and Copy the HEX Code                             | Pick a color from screen and copy the HEX code.              |
| Copy Slice as Base64                                         | The slice image is copied to Base64, depending on the format and scale of the first item of the slice, you can get a different image. |
| Copy Selected Layer Name                                     | Copy the selected layer name to the clipboard.               |
| Copy ObjectID or SymbolID                                    | When you select a layer, copy the ObjectID or SymbolID of the layer to the clipboard. |
| Show and Change Layer Info                                   | Show and change layer's objectID, symbolID etc.              |
| Script Editor Setting                                        | Script editor font and font size settings.                   |
| Edit Plugin Setting                                          | Set up external plugin editor, default editor Atom, Sublime Text, Visual Studio Code and WebStorm. |
| Reload Plugins                                               | Reload all plugins.                                          |
| **Utilities**                                                |                                                              |
| Export Clean Code SVG                                        | Export or copy selected layers to clean code SVG, it can ignore layers by name or type, and optimize with SVGO. |
| SVG Export Setting                                           | SVG export settings.                                         |
| Nine-Slice from Bitmap Layer                                 | Crop a bitmap layer to 9 part with resizing constraint settings. |
| Convert Sketch File to Other Version                         | Go to Sketch File for any later version of 43, you can open a high version file or go to a lower version. |
| Show File in Finder                                          | Open the current document in the Finder.                     |
| Open Terminal at File Folder                                 | Open the terminal and switch to the directory of the current document. |

## License

MIT

## Donate

[Buy me a coffee](https://www.buymeacoffee.com/ashung) or donate [$2.00](https://www.paypal.me/ashung/2)  [$5.00](https://www.paypal.me/ashung/5) [$10.00](https://www.paypal.me/ashung/10)  via PayPal.
