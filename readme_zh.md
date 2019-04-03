
![Automate Sketch](automate-sketch.png)

# Automate Sketch

上百个功能让您的工作更高效，推荐与 [Sketch Runner](http://sketchrunner.com/) 一起使用。

如果你在使用 Sketch 中遇到繁琐问题可以在 [**此处**](https://github.com/Ashung/Automate-Sketch/issues) 提需求，通过页面下方的支付宝或微信扫码打赏者可获得相关技术支持。

## 安装方法

- 推荐在 [Sketch Runner](http://sketchrunner.com/) 的安装插件中搜索 "Automate"。
- 下载并解压 [master.zip](https://github.com/Ashung/Automate-Sketch/archive/master.zip)，然后双击 "automate-sketch.sketchplugin" 文件。
- 兼容旧版 Sketch 插件从[此处下载](http://ashung.github.io/Automate-Sketch/)。前两组数字为 Sketch 版本，后一组数字为插件发布日期。

## 所有功能

| 菜单                                                         | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Layer**                                                    | **图层**                                                     |
| Fix to Parent with Margin                                    | **带边距适配父级** 让选中图层适配父级的宽度和高度，可设置边距。 |
| Fix to Parent Width (Height) with Margin                     | **带边距适配父级宽（高）** 功能同上。                        |
| Adjust Sizes                                                 | **调整尺寸** 基于图层右侧、底部或中心，根据 "Preferences" - "Canvas" - "Nudging" 处设置的值微调图层宽或高。 |
| Bounds Layer for Every Selection                             | **为选中对象增加边界层** 为从选中图层创建透明边界图层。      |
| Divide Layer                                                 | **均分图层** 均分选中图层。                                  |
| Ungroup Shape Layer                                          | **取消形状图层组** 解决手动取消组出现的图层位置偏移。        |
| Reset Bounding Box                                           | **重设调节框** 删除选中组和形状图层的所有变形，但保存图层外观。 |
| Unlock All Layers                                            | **解锁当页所有图层**                                         |
| Toggle Layer Constrain Proportions                           | **图层比例限制开关** 锁定或解锁选中图层的比例约束。          |
| Toggle Select Group’s Content on Click                       | **点击时选择组内容开关**                                     |
| Select All Layers In Selection By Type                       | **基于类型选择选中对象内所有图层** 根据类型（组、文本、形状、位图、组件、切片、可导出图层、隐藏图层）选择图层。 |
| Select All Layers In Selection By Name                       | **基于名称选择选中对象内所有图层**                           |
| Select All Child Layers                                      | **选择选中对象内所有子图层**                                 |
| Select All Siblings Layers                                   | **选择所有兄弟图层**                                         |
| Select Parent Groups                                         | **选择父级**                                                 |
| Select Layers Below                                          | **选择下方图层** 选择同一个父级下 Y 轴小于选中图层的所有图层。 |
| Select Layers Outside of Artboard Bounds                     | **选择画板边界外的图层** 选择并显示隐藏在画板边界外的图层。  |
| Select Reverse                                               | **反选**                                                     |
| Select None                                                  | **取消选择**                                                 |
| Paste and Replace                                            | **粘贴并替换** 将选中图层替换为剪贴板上的 Sketch 图层。可用于替换不同文件的组件。 |
| Paste and Replace Setting                                    | **粘贴并替换设置** 设置新图层的位置，默认原点对齐或居中对齐。 |
| Rename Layers                                                | **重命名图层** 使用自定义模版变量修改选中的图层名。          |
| Clear Layer Name                                             | **清理图层名** 删除图层名后的 copy。                         |
| Remove Redundant Groups                                      | **删除不必要的嵌套组** 自动删除多余的嵌套组。                |
| Remove Empty Groups                                          | **清除空图层组**                                             |
| Remove Hidden Layers                                         | **清除隐藏图层**                                             |
| Remove Transparency Layers                                   | **删除透明图层** 删除完全透明的图层。                        |
| Create / Sync Link Layer                                     | **创建/同步引用图层** 从组或画板创建引用的库组件，用于解决设计中重复拷贝的组和画板，可自动更新引用库组件的内容。 |
| **Arrange**                                                  | **排列**                                                     |
| Change Places Between Two Layers                             | **两对象互换位置** 根据中点或坐标原点，两个对象交换位置。    |
| Tile Objects                                                 | **排列对象** 使用网格或任意方向排列对象，可设置按命名排列。  |
| Tile Objects by Position X (Y)                               | **水平（垂直）排列对象** 水平或垂直平铺对象。                |
| Tile Objects Horizontally (Vertically) by Index              | **据图层列表顺序水平（垂直）排列对象**                       |
| Arrange Objects                                              | **智能排列对象** 智能排列图层或画板。                        |
| Order Layers By ...                                          | **调整列表顺序据对象的...** 根据对象 X / Y 值、名称、类型，更改图层列表中的位置。 |
| Reverse Layer Order                                          | **反转列表顺序** 反转图层列表中的位置。                      |
| Collapse All Groups and Fit Canvas                           | **缩收所有组并显示全部** 在每个页面运行 “Collapse All Groups” 和 “Fit Canvas”。 |
| **Text**                                                     | **文本**                                                     |
| Change Texts                                                 | **更改文本** 使用自定义模版变量更改选择文本图层的内容。      |
| Increase / Decrease Line Height                              | **增加/减小行高** 根据 "Preferences" - "Canvas" - "Nudging" 的值，增加或减小选中文本图层的行高。 |
| Increase / Decrease Letter Spacing                           | **增加/减小字间距** 增加或减小选中文本图层的字间距，与 Sketch 内置功能一致增加或减小 0.38。 |
| Increase / Decrease / Reset Horizontally Scale               | **增加/减小/重置水平拉伸** 增加、减小或重置选中文本图层的水平拉伸，功能类似 Photoshop 的字体拉伸。 |
| Split Text Layer                                             | **拆分文本图层** 将选中文本图层按换行或空格，逗号等特殊分隔符，拆分为多个图层。 |
| Combine Text Layers                                          | **合并文本图层** 合并选中文本图层。                          |
| Capitalize                                                   | **首字大写**                                                 |
| Change Baseline offset                                       | **修改基线偏移** 调整选中文本的基线偏移。（暂时在 48+ 版本不可用） |
| Change Text Orientation                                      | **更改文本书写方向** 切换竖排或横排。                        |
| Change Typeface for Latin Character                          | **更改西文字体** 更改文本图层中西文的字体。                  |
| Add Space Between CJK and Latin Character                    | **中西文字体间增加空格** 文本图层中西文间增加空格。          |
| Replace Fonts                                                | **替换字体**                                                 |
| Replace Missing Fonts                                        | **替换缺失字体**                                             |
| Resize to Fit Text Height                                    | **自适应文本高度**                                           |
| Toggle Auto and Fixed                                        | **切换自动和固定** 切换选中文本图层的宽度自动和固定。        |
| Unfixed Layer Name                                           | **取消当页固定图层名** 取消文本图层的固定图层名，让文本的图层名跟随内容。 |
| Charater Count                                               | **字符统计**                                                 |
| **Slice**                                                    | **切片**                                                     |
| Quick Export                                                 | **快速导出** 直接使用导出预设导出选中的图层，不需要添加切片或设置可导出。 |
| Auto Slice                                                   | **自动切片** 基于图层新建切片，并自动添加切片预设，可自定义切图尺寸。 |
| Fast slice                                                   | **快速切片** 快速新建基于图层的切片，并自动添加切片预设，切片名称会根据设置修改会开发友好名称。 |
| Slice Setting                                                | **切片设置** 设置切片名称、预设和图层列表位置。              |
| Remove All Slices                                            | **清除当页所有切片**                                         |
| Clear All Exportables                                        | **清除全部可导出设置**                                       |
| Save/Load Export Presets                                     | **保存/载入导出预设** 用于不同用户或电脑之间预设共享。       |
| **Artboard**                                                 | **画板**                                                     |
| Paste as Artboards                                           | **粘贴为画板** 复制图层、图片文件或从 iOS 设备使用连续互通复制照片，然后将其粘贴为画板。 |
| Paste as Symbol Master                                       | **粘贴为组件** 复制图层、图片文件或从 iOS 设备使用连续互通复制照片，然后将其粘贴为组件母版。 |
| Artboard Form Selection                                      | **从选择对象新建画板**                                       |
| Artboard Form Group                                          | **从组新建画板**                                             |
| Artboard to Group                                            | **画板转为组**                                               |
| Select Parent Artboard                                       | **选择父级画板** 选择选中图层的父级画板。                    |
| Artboard Navigator                                           | **画板导航** 快速转到任何页面的画板，同时支持修改画板命名。  |
| Resize to Fix Height                                         | **调整画板以适配高度**                                       |
| Move Artboards to Bottom of Anther                           | **移动画板至另一画板下方** 移动画板或组件模版至另一画板下方。 |
| Export All Artboards                                         | **导出所有画板** 将所有画板导出为 PNG 或 SVG，可设置缩放比例。 |
| Export All Artboards to HTML                                 | **将所有画板导出为 HTML** 导出展示用 HTML，可搜索。当使用 SVG 格式时，可直接拖入 Sktech。 |
| **Symbol**                                                   | **组件**                                                     |
| Reset to Original Width / Height / Size                      | **重置为原始宽度/高度/尺寸**                                 |
| Replace Override Symbol                                      | **替换覆盖组件** 查找和替换选中或全文档的组件上覆盖中的组件。 |
| Reset Overrides                                              | **重置覆盖** 重置选中组件的覆盖。                            |
| Disable or Enable All Overrides                              | **禁用或启用所有覆盖** 将选中的本地组件实例或组件母版，切换禁用或启用所有覆盖。 |
| Disable Selected Overrides                                   | **禁用选中的覆盖** 将选中的本地组件实例的选中覆盖禁用。      |
| Select All Instance of Symbol                                | **选择组件的所有实例**                                       |
| Select All Instances of Imported symbol                      | **选择外部组件的所有实例** 选择导入组件（库组件）的实例。    |
| Rename Instances                                             | **重命名实例** 修改选择的实例名称，修改所有实例名称，修改按选中的组件母版的实例名称。 |
| Rename Instances Use Text Override                           | **使用文本覆盖值重命名实例** 以选择的文本覆盖值重命名实例，如果实例仅有一个文本覆盖则使用此值。 |
| Move Symbol Masters To Another Page                          | **移动组件模版至另一页** 将选中组件模版移动至其他页面。      |
| Create Symbols from Selected Layers                          | **从选中图层批量创建组件**                                   |
| Selection to Symbol Master                                   | **将选中图层直接变为组件** 将选中图层在原位置直接变为组件。  |
| Detach Unused Symbol Master                                  | **将选中的未用组件转为组**                                   |
| Remove Unused Symbols                                        | **删除未用组件** 针对 Sketch 48 以上版本的删除未使用组件，可以预览组件，并选择是否保留某些组件。 |
| Export All Symbols As PNG                                    | **将所有组件导出为 PNG** 按照 "页面/组件" 规则，将所有组件导出为 PNG。 |
| Sync Symbol Master from Sketch File                          | **基于 Symbol ID 从 Sketch 文档同步组件模版** 根据 Symbol ID，从 Sketch 文件更新组件。 |
| Replace Pages from Sketch File                               | **从 Sketch 文档替换同名页面** 强制从 Sketch 文件替换同名页面，通过修改页面名称，可以导入包含组件的页面。 |
| **Library**                                                  | **库**                                                       |
| Fix Library ID Conflict                                      | **解决库 ID 冲突** 库中存在同 ID 的文件，会导致同 ID 的库影响组件的更新。 |
| Imported Symbols Link Manage                                 | **库组件链接管理** 管理库组件和库的链接关系，可用于解决库组件更新问题，或提示找不到库。 |
| Replace Library                                              | **替换库** 将所有库组件从一个库替换链接到另一个库。          |
| Replace Symbol With Library Symbol                           | **使用库组件替换内部组件** 将选中组件替换为任意的库组件。    |
| Change symbols to Library Symbol Base Symbol ID              | **基于 Symbol ID 将内部组件转为库组件** 根据组件 ID，将选中或全部组件转为库组件。 |
| Change Local Text Style to Library Text Style                | **本地文本样式转为库样式** 将本地文本样式转为指定库中的相同样式。 |
| Change Local Layer Style to Library Layer Style              | **本地图层样式转为库样式** 将本地图层样式转为指定库中的相同样式。 |
| Import Document Assets from Library                          | **从库导入文档资源** 从库导入色彩、渐变和图案填充等文档资源， |
| Import Styles from Library                                   | **从库导入样式** 从库导入图层样式和文本样式。                |
| Add Library Preview                                          | **添加库预览图** 增加一个画板用于库的预览图。                |
| Update Selected Library Symbol                               | **更新选中的库组件** 只更新选中的库组件。                    |
| Check For Library Updates                                    | **检查库更新**                                               |
| **Styles**                                                   | **样式**                                                     |
| Select Layer by Layer / Text Style                           | **按图层/文本样式选择图层** 按图层样式、文本样式从当前页面或选择组内选择图层。 |
| Select Layers with Same Style                                | **相同共享样式选择的图层** 选择当前页面中与选中图层有相同共享样式的图层。 |
| Paste Fills / Borders / Shadows / Inner Shadows / Blur / Text Style / Text Color/ Text F0nt | **粘贴填充/描边/投影/内阴影/模糊/文本样式/文本颜色/文本字体** 在运行 "Edit" - "Copy" - "Copy Style ⌥⌘C" 或右键菜单 "Copy Style" 之后，可以分别粘贴填充、描边、投影，内阴影和模糊等到选中的图层。 |
| Add Solid Fill from CSS Color                                | **从 CSS 色值添加单色填充**                                  |
| Fill Color from Global (Document) Colors                     | **从全局（文档）色版快速填充** 从全局 (文档) 色版快速填充。  |
| Swap Fill and Border                                         | **互换填充和描边**                                           |
| Remove All Disabled Styles                                   | **清除无效样式** 删除当前页所有图层中禁用样式。              |
| Remove Unused Layer / Text Styles                            | **删除未使用图层样式/文本样式** 删除文档中未使用的图层样式或文本样式。 |
| Create Color Guide                                           | **创建色彩指南** 从文档颜色创建色彩指南。                    |
| Create Style Guide                                           | **创建样式指南** 从文档图层样式创建样式指南。                |
| Create Typography Guide                                      | **创建字体指南** 从文本样式创建字体样式指南。                |
| Import Document Assets from Sketch File                      | **从 Sketch 文档导入资源** 导入色彩、渐变及图案。            |
| Import Text Styles from Sketch File                          | **从 Sketch 文档导入文本样式**                               |
| Import Layer Styles from Sketch File                         | **从 Sketch 文档导入图层样式**                               |
| **Guides**                                                   | **辅助线**                                                   |
| Clear Guides                                                 | **清除辅助线** 清除所有辅助线。                              |
| Grid Presets                                                 | **网格预设** 常用网格预设，例如 8x8、10x10 等等。            |
| Hide or Show All Grid/Layout                                 | **显示或隐藏所有网格/布局** 隐藏或显示所有画板的网格或布局。 |
| Copy Grid/Layout/Guide                                       | **复制网格/布局/辅助线** 复制选中画板的网格、布局或辅助线信息。 |
| Paste Grid/Layout/Guide                                      | **粘贴网格/布局/辅助线** 为选中的画板添加网格、布局或辅助线，需要先运行 “Copy Grid/Layout/Guide”。 |
| **Data**                                                     | **数据**                                                     |
| Export Data From Text Layers                                 | **从文本图层导出数据** 将选中的文本图层内容导出到 TXT 文件。 |
| Export Image From Layers                                     | **从图层导出图片** 导出选中的位图或位图填充图层内的图片。    |
| Export Data From Symbol Instances                            | **从组件导出数据** 导出选中组件 override 上的文本和图片。    |
| Data - (Random) Image From Folder                            | 从图片文件夹获取图片数据，并随机或有序应用到形状图层或组件 override 上。 |
| Data - (Random) Text From File                               | 从文本文件获取文本数据，并随机或有序应用到文本图层或组件 override 上。 |
| **Prototyping**                                              | **原型**                                                     |
| Bring All Hotspot to Front                                   | **置顶所有热区**                                             |
| Reset Flow                                                   | **重置链接** 重置 flow 设置。                                |
| Remove All Hotspot                                           | **删除所有热区** 删除所有热区图层和设置。                    |
| **Development**                                              | **开发**                                                     |
| Pick Color and Copy the HEX Code                             | **屏幕取色并复制色彩代码** 从屏幕取色并负责色彩的十六进制值。 |
| Copy Slice as Base64                                         | **复制切片的 Base64** 切片图像复制为 Base64，根据切片第一项设置的格式和缩放，可以得到不同图像。 |
| Copy Selected Layer Name                                     | **复制选中图层的名称** 复制选中的图层名到剪贴板。            |
| Copy ObjectID or SymbolID                                    | **复制对象 ID 或组件 ID** 当选择图层时复制图层的 ObjectID 或 SymbolID 到剪贴板。 |
| Copy SVG Path Data                                           | **复制 SVG 路径数据** 复制选中形状图层的 SVG 路径数据代码。  |
| Show and Change Layer Info                                   | **显示和修改图层信息** 显示和修改图层的 ObjectID 或 SymbolID 等等。 |
| Script Editor Setting                                        | **脚本编辑器设置** 设置内部脚本编辑器的字体与字号。          |
| Edit Plugin Setting                                          | **外部插件编辑器设置** 预设编辑器 Atom、Sublime Text、Visual Studio Code 和 WebStorm。 |
| Reload Plugins                                               | **重新载入插件** 重载所有插件。                              |
| **Utilities**                                                | **实用工具**                                                 |
| Insert Layers from SVG Code                                  | **从 SVG 代码插入图层** 使用 SVG 代码插入图层。              |
| Insert Layer from SVG Path Data                              | **从 SVG 路径数据插入图层** 使用 SVG 路径数据代码插入图层。  |
| Export Clean Code SVG                                        | **导出代码整洁的 SVG** 导出或复制整洁代码的 SVG，可以根据类型或名称选择忽略某些图层，也可以通过 SVGO 进一步优化代码 (较慢)。 |
| SVG Export Setting                                           | **SVG 导出设置**                                             |
| Nine-Slice from Bitmap Layer                                 | **从位图创建九宫格拉伸图层** 将位图图层按用户设定位置切成 9 份，并设置可拉伸选项。 |
| Convert Sketch File to Other Version                         | **转换 Sketch 文件至其他版本** 转为 Sketch 文件为 43 以后的任意版本，可以打开高版本文件，或转为低版本，注意某些文档可能高版本特有功能在低版本打开会丢失。 |
| Open Termianl at File Folder                                 | **在终端打开** 打开终端，并切换到当前文档的目录。            |
| Switch Language                                              | **切换语言**（Sketch 45+）切换 Sketch 界面语言，默认 Sketch 自动适应系统语言，该功能用于切换到英文版，或者支持的语言直接切换。 |

## 版权声明

MIT

## 打赏

[使用支付宝或微信扫码支付](https://ashung.github.io/donate.html)
