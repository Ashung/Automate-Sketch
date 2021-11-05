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
| Fit to Artboard with Margin                                  | Fit the width and height to the parent artboard with a margin. |
| Fit to Parent with Margin                                    | Fit the width and height to the parent, and set the margins. |
| Fit to Parent Width (Height) with Margin                     | Fit the width or height to the parent, and set the margins.  |
| Swap Width and Height                                        | Swap width and height for all selected layers.               |
| Resize With Ratio                                            | Resize selected layers with an aspect ratio.                 |
| Adjust Sizes                                                 | Increase/decrease width/height for selected layers from right/bottom/center origin, the increase/decrease value can be changed in "Preferences" - "Nudging". |
| Bounds Layer for Every Selection                             | Create a bounds layer from the selected layer.               |
| Divide Layer                                                 | Split Layer.                                                 |
| Ungroup Shape Layer                                          | Ungroup shape layer.                                         |
| Reset Bounding Box                                           | Remove all transform for selected group and shape layers, but not change the appearance. |
| Unlock All Layers                                            | Unlock all layers.                                           |
| Show All Layers                                              | Show all layers in current page or selected group, artboard. |
| Toggle Layer Constrain Proportions                           | Lock or unlock constrain proportions for selected layers.    |
| Toggle Select Group’s Content on Click                       | Toggle "select group’s content on click" option.             |
| Select All Layers In Selection By Type                       | Select all groups, text, shapes, bitmaps, symbol instances, slices, exportable layers, hidden layers. |
| Select Layers By Name                                        | Select all layers match by layer name.                       |
| Select All Child Layers                                      | Select all sub-layers.                                       |
| Select All Siblings Layers                                   | Select all siblings layers.                                  |
| Select Parent Groups                                         | Select parent groups.                                        |
| Select Layers Below                                          | Select layers that in some group and position y less then selected layer. |
| Select Layers Outside of Artboard Bounds                     | Select and reveal layers which is outside of the artboard bounds. |
| Select Reverse                                               | Select reverse.                                              |
| Select None                                                  | Select none.                                                 |
| Paste into Artboard                                          | Paste layers into selected artboards.                        |
| Paste and Replace                                            | Paste and replace, replace the selected layer with the Sketch layer on the clipboard. |
| Paste and Replace Setting                                    | Change the position of new layer relative to the old one.    |
| Copy / Paste Layer Position and Size                         | Copy and paste the position and size of selected layer.      |
| Remove Redundant Groups                                      | Remove redundant nested groups.                              |
| Remove Empty Groups                                          | Remove empty group.                                          |
| Remove All Groups                                            | Ungroup all groups in artboard.                              |
| Remove Hidden Layers                                         | Remove hidden layers.                                        |
| Remove Transparency Layers                                   | Remove transparency layers.                                  |
| Rename Layers                                                | Rename selected layers use custom template.                  |
| Find and Replace Layer Name                                  | Find and replace layer name.                                 |
| Clear Layer Name                                             | Clears the layer name and removes the "copy" after the layer name. |
| Union Layer                                                  | Union layers in artboard.                                    |
| Convert to Outlines                                          | Convert layers to outline in artboard.                       |
| Toggle Mask for Selected Layers                              | Toggle mask or unmask for selected layers.                   |
| Create / Sync Link Layer                                     | Create a link symbol layer from select group or artboard, and update the link symbol layers. |
| **Arrange**                                                  |                                                              |
| Change Places Between Two Layers                             | Change two objects positions based on midpoint or coordinate origin. |
| Tile Objects                                                 | Tile objects with grid or any orientations.                  |
| Tile Objects by Position X (Y)                               | Horizontal or vertical tiling objects.                       |
| Tile Objects Horizontally (Vertically) by Index              | Horizontal or vertical tile based on layer list location.    |
| Distribute Layers Horizontally/Vertically and Fit Width/Height | Distribute select layers with same width/height and space to fit select bound. |
| Arrange Objects                                              | Arrange selected layers or artboard.                         |
| Order Layers By ...                                          | Change the position in the layer list based on the object X / Y value, name, type. |
| Reverse Layer Order                                          | Invert the position in the layer list.                       |
| Collapse All Groups and Fit Canvas                           | Run "Collapse All Groups" and "Fit Canvas" for all pages.    |
| **Text**                                                     |                                                              |
| Change Texts                                                 | Change text of selected layers use custom template.          |
| Paste as Alphabetical Order Text                             | Copy texts and paste as alphabetical order.                  |
| Increase / Decrease Line Height                              | Increase and decrease line height for all selected text layers.  Plus or minus half of the value that you move objects while using Shift-Arrow key, you can change the value in Preferences - Canvas - Nudging. |
| Increase / Decrease Letter Spacing                           | Increase and decrease 0.38 letter spacing for all selected text layers. |
| Increase / Decrease / Reset Horizontally Scale               | Increase, decrease and reset horizontally scale for all selected text layers. |
| Not Truncate Text                                            | Remove the truncate text setting.                            |
| Truncate Text at Start / Middle / End                        | Add a ellipsis at the start / middle / end of text, when text is overflow the layer bound. |
| Split Text Layer                                             | Split selected text layers to multiple layer, use new line and a separator. |
| Combine Text Layers                                          | Combine selected layers to one layer.                        |
| Capitalize                                                   | Capitalize.                                                  |
| Change Text Orientation                                      | Change Text Orientation for CJK text layout.                 |
| Change Typeface for Latin Character                          | Change the typeface for latin-character in the text layer.   |
| Add Space Between CJK and Latin Character                    | Add space between Chinese and Western.                       |
| Increase/Decrease Font Weight                                | Increase or decrease font weight for selected layers.        |
| Replace Fonts                                                | Replace Fonts.                                               |
| Resize to Fit Text Height                                    | Resize text layer to fit text field height.                  |
| Toggle Auto and Fixed                                        | Toggle selected text layers auto and fixed.                  |
| Fixed / Unfixed Layer Name                                   | Cancels the fixed layer name of the text layer so that the layer name of the text follows the content. |
| Charater Count                                               | Charater cout from selected text layer or select range.      |
| **Slice**                                                    |                                                              |
| Export Layer                                                 | Export selected layer.                                       |
| Export Layer Setting                                         | Settings from export selected layer.                         |
| Quick Export                                                 | Direct export selected layers use export perset, not need to add slice or exportable. |
| Auto Slice                                                   | Create a slice based on layer with export preset.            |
| Fast slice                                                   | Create a URL-friendly slice based on layer with export preset, without modal window. |
| Slice Setting                                                | Setting the name, layer order and export option of new slice layer. |
| Remove All Slices                                            | Clear all slices.                                            |
| Clear All Exportables                                        | Clear all Exportable settings.                               |
| Divide Slice                                                 | Divide slice.                                                |
| Save/Load Export Presets                                     | Save and load export presets.                                |
| **Artboard**                                                 |                                                              |
| Paste as Artboards                                           | Copy layers, image files or photos from iOS devices via Handoff, then paste them as artboards. |
| Paste as Symbol Master                                       | Copy layers, image files or photos from iOS devices via Handoff, then paste them as symbol masters. |
| Artboard Form Selection                                      | Create a new artboard from the selection object.             |
| Artboard Form Group                                          | Create a new artboard from group.                            |
| Artboard to Group                                            | Artboard to group.                                           |
| Select Parent Artboard                                       | Select parent artboard for selected layers.                  |
| Artboard Navigator                                           | Quickly go to artboard and rename it.                        |
| Resize to Fix Height / Width                                 | Adjusts the artboard to fit the height or width.             |
| Toggle Adjust Content on Resize                              | Turn on/off for all selected artboard and symbol master.     |
| Move Artboards to Bottom of Anther                           | Move selected artboards or symbol masters to the bottom of another one. |
| Move to Page                                                 | Move selected artboards or symbol masters to another page.   |
| Group Selected Layers in Each Artboard                       | Group selected layers in each artboard.                      |
| Export all Artboards                                         | Export all artboards, symbols to PNG / SVG.                  |
| Export all Artboards to HTML                                 | Export show with HTML, searchable. When using SVG format, you can drag directly into Sketch. |
| **Symbol**                                                   |                                                              |
| Reset to Original Width / Height / Size                      | Reset to original width / height / Size.                     |
| Shrink Instance to Fit Content                               | Shrink Instance to Fit Content.                              |
| Find and Replace Symbol                                      | Find and replace symbol layer and override.                  |
| Reset Overrides                                              | Reset symbol overrides in selection.                         |
| Disable or Enable All Overrides                              | Toggle disable or enable all override for selected local symbol instances or symbol masters. |
| Disable Selected Overrides                                   | Disable selected overrides for selected local symbol instances. |
| Select All Instance of Symbol                                | Select all instances of the symbol.                          |
| Select Same Instances in Current Page                        | Select all instances of selected symbol in current page.     |
| Rename Instances                                             | Rename all instances,  rename selection instances, rename instance by symbol master. |
| Rename Instances Use Text Override                           | Rename seleted symbol instances with the vaule of selected text override, if instance have only one text override rename the instance with this value. |
| Create Symbols from Selected Layers                          | Create symbol masters from selected layers.                  |
| Selection to Symbol Master                                   | Change the selected layer directly into the symbol in its original position. |
| Convert Artboards to Symbols                                 | Batch convert selected artboards to symbol master.           |
| Detach All Symbols in Page or Artboard                       | Detach all symbol instances in current page or artboard.     |
| Detach Unused Symbol Master                                  | Converts unused symbol templates to groups.                  |
| Remove Unused Symbols                                        | Remove unused symbols, for Sketch 48+, with symbol preview.  |
| Export all Symbols As PNG                                    | Export all symbols as PNG according to the "Page / symbol" rule. |
| Insert Symbols                                               | Insert local symbols that name match the regular expression. |
| Sync Symbol Master from Sketch File                          | Synchronize symbols from Sketch files base on symbol ID.     |
| Replace Pages from Sketch File                               | Forcing the replacement of the same name from the Sketch file, you can import the page containing the symbol by modifying the page name. |
| **Library**                                                  |                                                              |
| Fix Library ID Conflict                                      | Fix library file with same document ID.                      |
| Imported Symbols Link Manage                                 | Link imported symbols to another library, or fix the library not found error. |
| Replace Library                                              | Swap all foreign symbols, styles from one library to another. |
| Fix Broken Library Symbols by Name                           | Fix library symbol can't sync from library, replace with symbol have a same name. |
| Replace Symbol With Library Symbol                           | Replace symbol with any library symbol.                      |
| Change Local Symbols to Library Symbol                       | Change local symbols to library symbol with same symbol id or name. |
| Change Library Symbols to Local Symbol                       | Change library symbols to local symbol, batch make local.    |
| Swap Color Variables Used in Document With Those From Library | Swap color variables used in the current document with matching ones from a chosen library. |
| Swap Text Styles Used in Document With Those From Library    | Swap text styles used in the current document with matching ones from a chosen library. |
| Swap Layer Styles Used in Document With Those From Library   | Swap layer styles used in the current document with matching ones from a chosen library. |
| Change Library Layer Style to Local Layer Style              | Make library layer style to local.                           |
| Change Library Text Style to Local Text Style                | Make library text style to local.                            |
| Import Document Assets from Library                          | Import document assets like colors, gradients and images from any library. |
| Import Styles from Library                                   | Import text styles and layer styles from any library.        |
| Add Library Preview                                          | Add a artboard for library preview image.                    |
| Insert Symbols From Library                                  | Insert symbol that name match the regular expression from the choose library. |
| Insert Artboard from Library                                 | Insert a artboad from library, symbols in the artboard will became library symbol. |
| Update Selected Library Symbol                               | Only update the selected library symbols.                    |
| Update Selected Symbol Overrides                             | Update selected symbol overrides.                            |
| Check For Library Updates                                    | Check for library updates.                                   |
| Update Imported Objects from Library                         | Sync library symbols, styles in a library.                   |
| **Styles**                                                   |                                                              |
| Select Layer by Layer / Text Style                           | Select layer by layer or text style in curret page, selected layer groups. |
| Select Layers with Same Style                                | Select layers in current page with same shared style of selected layer. |
| Paste Fills / Borders / Shadows / Inner Shadows / Blur / Text Style / Text Color / Text Font | After run "Edit" - "Copy" - "Copy Style ⌥⌘C", you can paste the fills, borders, shadows, inner shadows, blur to selected layers. |
| Add Solid Fill from CSS Color                                | Fill from CSS color code.                                    |
| Swap Fill and Border                                         | Swap fills and borders.                                      |
| Remove All Disabled Styles                                   | Remove disabled styles in all layers of the current page.    |
| Remove Unused Layer / Text Styles                            | Remove unused layer styles and text styles.                  |
| Update Style for Selected Layers                             | Update style for selected layers.                            |
| Reset Style for Selected Layers                              | Reset style for selected layers.                             |
| Reset All Layer / Text Styles                                | Reset all layer or text styles in document.                  |
| Find and Replace Layer/Text Style                            | Find and replace layer or text style (include overrides) in current page, document or selected layers. |
| Merge Local Layer/Text Style with Same Name                  | Merge local styles with same name.                           |
| Change Layer Blend Mode                                      | Change blend mode for selected layers.                       |
| Create Color Guide                                           | Create a color guide from document colors.                   |
| Create Style Guide                                           | Greate style guide from layer styles in current document.    |
| Create Typography Guide                                      | Create typography style guide from text styles in current document. |
| Convert to Color Variable                                    | Convert fill, tint, text and override colors from selected layers to color variables with same value in document or library. |
| Add Styles from Selected Layers                              | Create styles from selected layers, use layer name as style name. |
| Add Colors or Gradients from Selected Layers to Document     | Create document colors or gradients from selected layers.    |
| Import Document Assets from Sketch File                      | Import resources (colors, gradients, and patterns) from Sketch files. |
| Import Text Styles from Sketch File                          | Import text styles from Sketch files.                        |
| Import Layer Styles from Sketch File                         | Import a layer style from Sketch file.                       |
| **Guides**                                                   |                                                              |
| Clear Guides                                                 | Clear all guides.                                            |
| Grid Presets                                                 | Common Grid Presets, like 8x8, 10x10 etc.                    |
| Hide or Show All Grid/Layout                                 | Hide or show all grid or layout of artboard.                 |
| Remove Layouts                                               | Reset the layout in selected artboards.                      |
| Copy Grid/Layout/Guide                                       | Copy the grid/layout/guide from seleted artboard.            |
| Paste Grid/Layout/Guide                                      | Apply the grid/layout/guide for seleted artboards, you must run Copy Grid/Layout/Guide first. |
| New Guide                                                    | Create new guides.                                           |
| New Guide Layout                                             | Create a guide layout.                                       |
| New Guides From Layer                                        | Create guides base selected layers.                          |
| **Data**                                                     |                                                              |
| Copy Text from Layer/Override                                | Copy text from selected text layer or text override in symbol instance. |
| Export Data From Text Layers                                 | Export text file from the content of selected text layers.   |
| Export Image From Layers                                     | Export images from selected bitmap or image-fill layers.     |
| Export Data From Symbol Instances                            | Export override texts and images from selected symbol instances. |
| Data - Calendar                                              | Insert year, month, day, week day ... to text layer or override. |
| Data - (Random) Image From Folder                            | Apply image data to shape layer or overrides from image folder. |
| Data - (Random) Text From File                               | Apply text data to text layer or overrides from text file.   |
| **Prototyping**                                              |                                                              |
| Bring All Hotspot to Front                                   | Bring all hotspot layer to front.                            |
| Reset Flow                                                   | Reset flow.                                                  |
| Remove All Hotspot                                           | Remove all hotspot layer.                                    |
| Remove Hotspot in Selected Artboards                         | Remove hotspot in selected artboards or symbol masters.      |
| **Development**                                              |                                                              |
| Copy as PNG, PNG @2x, SVG                                    | Copy seleceted layer as png, 2x png, svg.                    |
| Copy SVG Path Data                                           | Copy SVG path data code from a selected shape layer.         |
| Copy Slice as SVG Code                                       | Copy SVG Code from selected slice layer.                     |
| Copy SVG Code (URL-encoded)                                  | Copy URL-encoded SVG Code from selected slice layer for CSS background image. |
| Copy Slice as Base64                                         | The slice image is copied to Base64, depending on the format and scale of the first item of the slice, you can get a different image. |
| Export Artboard to ICNS File                                 | Export selected artboard to icns file.                       |
| Pick Color and Copy the HEX Code                             | Pick a color from screen and copy the HEX code.              |
| Copy Selected Layer Name                                     | Copy the selected layer name to the clipboard.               |
| Copy ObjectID or SymbolID                                    | When you select a layer, copy the ObjectID or SymbolID of the layer to the clipboard. |
| Show and Change Layer Info                                   | Show and change layer's objectID, symbolID etc.              |
| Change Document ID                                           | Show and change document ID.                                 |
| Plugin Dev Setting                                           | Some environment configs for Sketch plugin development.      |
| Reload Plugins                                               | Reload all plugins.                                          |
| **Utilities**                                                |                                                              |
| Copy Document URL                                            | Use this url to open local document or publich cloud document in Sketch. |
| Shortcuts Manager                                            | A shortcuts manager.                                         |
| Insert Layers from SVG Code                                  | Insert shape layers from SVG code.                           |
| Insert Layer from SVG Path Data                              | Insert a shape layer from SVG path data code.                |
| Export Clean Code SVG                                        | Export or copy selected layers to clean code SVG, it can ignore layers by name or type, and optimize with SVGO. |
| SVG Export Setting                                           | SVG export settings.                                         |
| Nine-Slice from Bitmap Layer                                 | Crop a bitmap layer to 9 part with resizing constraint settings. |
| Convert Sketch File to Other Version                         | Go to Sketch File for any later version of 43, you can open a high version file or go to a lower version. |
| Open Terminal at File Folder                                 | Open the terminal and switch to the directory of the current document. |
| Switch Language                                              | Switch Language for Sketch 45+.                              |

## License

MIT

## Donate

[Buy me a coffee](https://www.buymeacoffee.com/ashung) or donate [$2.00](https://www.paypal.me/ashung/2)  [$5.00](https://www.paypal.me/ashung/5) [$10.00](https://www.paypal.me/ashung/10)  via PayPal.
