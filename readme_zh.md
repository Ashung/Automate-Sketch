
![Automate Sketch](automate-sketch.png)

# Automate Sketch

让工作更高效。

## 安装方法

- 从各种插件管理应用中搜索 "Automate Sketch"，现支持  [Sketch Runner](http://sketchrunner.com/)、[Sketchpacks](https://sketchpacks.com/) 和 [Sketch Toolbox](http://sketchtoolbox.com/)。
- 下载并解压 [master.zip](https://github.com/Ashung/Automate-Sketch/archive/master.zip)，然后双击 "automate-sketch.sketchplugin" 文件。
- 旧版 Sketch 兼容插件从此[下载](https://github.com/Ashung/Automate-Sketch/releases)。

## 功能

| 菜单                                       | 备注                                       |
| ---------------------------------------- | ---------------------------------------- |
| **Layer**                                | **图层**                                   |
| Fix to Parent Width (Height) with Margin | 适配父级的宽度或高度，可设置边距。                        |
| Bounds Layer for Every Selection         | 为从选中图层创建边界图层。                            |
| Divide Layer                             | 均分图层。                                    |
| Unlock All Layers                        | 解锁所有图层。                                  |
| Click Through On (Off)                   | 点击穿透开关。                                  |
| Select All Layers In Selection By ...    | 选择所有组、文本、形状、位图、组件、切片、可导出图层、隐藏图层、图层名。     |
| Select All Child Layers                  | 选择所有子图层。                                 |
| Select Parent Groups                     | 选择所有父级图层。                                |
| Paste and Replace                        | 粘贴并替换，将选中图层替换为剪贴板上的 Sketch 图层。可用于替换不同文件的组件。 |
| Clear Layer Name                         | 清理图层名，删除图层名后的 copy。                      |
| Remove Redundant Groups                  | 删除多余的嵌套组。                                |
| Remove Hidden Layers                     | 删除隐藏图层。                                  |
| Delete Empty Groups                      | 删除空组。                                    |
| Create / Sync Include Layer              | 创建和同步引用图层，自动同步复制图层到某个组内。                 |
| **Arrange**                              | **排列**                                   |
| Change Places Between Two Layers         | 根据中点或坐标原点，两个对象交换位置。                      |
| Tile Layers by Position X (Y)            | 水平或垂直平铺对象。                               |
| Tile Layers Horizontally (Vertically) by Index | 根据图层列表位置水平或垂直平铺图层。                       |
| Arrange Objects                          | 智能排列图层或画板。                               |
| Order Layers By ...                      | 根据对象 X / Y 值、名称、类型，更改图层列表中的位置。           |
| Reverse Layer Order                      | 反转图层列表中的位置。                              |
| **Type**                                 | **文本**                                   |
| Capitalize                               | 首字大写。                                    |
| Change Baseline offset                   | 调整选中文本的基线偏移。                             |
| Change Text Orientation                  | 更改文本书写方向，竖排或横排。                          |
| Change Typeface for Latin Character      | 更改文本图层中西文的字体。                            |
| Add Space Between CJK and Latin Character | 文本图层中西文间增加空格。                            |
| Replace Fonts                            | 替换字体。                                    |
| Replace Missing Fonts                    | 替换缺失字体。                                  |
| Resize to Fit Text Height                | 自适应文本高度。                                 |
| Unfixed Layer Name                       | 取消文本图层的固定图层名，让文本的图层名跟随内容。                |
| **Slice**                                | **切片**                                   |
| New Layer Base Slice                     | 基于图层新建切片。                                |
| New Layer Base Slice for ...             | 同上, 带 iOS、Android 和 Web 预设。              |
| Remove All Slices                        | 清除所有切片。                                  |
| Clear All Exportables                    | 清除全部 Exportables 设置。                     |
| **Artboard**                             | **画板**                                   |
| Artboard Form Selection                  | 从选择对象新建画板。                               |
| Artboard Form Group                      | 从组新建画板。                                  |
| Artboard to Group                        | 画板转为组。                                   |
| Resize to Fix Height                     | 调整画板以适配高度。                               |
| Export All Artboards to PNG              | 将所有画板导出为 PNG，可设置缩放比例。                    |
| Export All Artboards to HTML             | 导出展示用 HTML，可搜索。当使用 SVG 格式时，可直接拖入 Sktech。 |
| **Symbol**                               | **组件**                                   |
| Set to Original Width / Height           | 设为原始宽度 / 高度。                             |
| Select All Instance of Symbol            | 选择组件的实例。                                 |
| Rename Instances                         | 重置实例名称为组件完整名。                            |
| Custom Instances Name                    | 将当前页、画板或文档的选中元件的所有实例改为自定义名、组件名或组件完整名。    |
| Move Symbol Masters to Bottom of Anther  | 移动至另一组件模版下方。                             |
| Selection to Symbol Master               | 将选中图层在原位置直接变为组件。                         |
| Detach Unused Symbol Master              | 将未使用的组件模版转为组。                            |
| Remove Unused Symbols                    | 删除未使用组件。                                 |
| Export All Symbols As PNG                | 按照 "页面/组件" 规则，将所有组件导出为 PNG。              |
| Sync Symbol Master from Sketch File      | 根据 Symbol ID，从 Sketch 文件同步组件。            |
| Replace Pages from Sketch File           | 强制从 Sketch 文件替换同名页面，通过修改页面名称，可以导入包含组件的页面。 |
| **Styles**                               | **样式**                                   |
| Add Solid Fill from CSS Color            | 从 CSS 色彩代码添加填充。                          |
| Fill Color from Global (Document) Colors | 从全局 (文档) 色版快速填充。                         |
| Swap Fill and Border                     | 互换填充和描边。                                 |
| Reflection                               | 显示隐藏的倒影样式。                               |
| Remove All Unused Styles                 | 删除当前页所有图层中未使用样式。                         |
| Create Color Guide                       | 从文档颜色创建色彩指南。                             |
| Create Typography Guide                  | 从文本样式创建字体样式指南。                           |
| Import Document Assets from Sketch File  | 从 Sketch 文件导入资源 (色彩、渐变及图案)。              |
| Import Text Styles from Sketch File      | 从 Sketch 文件导入文本样式。                       |
| Import Layer Styles from Sketch File     | 从 Sketch 文件导入图层样式。                       |
| **Guides**                               | **辅助线**                                  |
| Clear Guides                             | 清除所有辅助线。                                 |
| Grid Presets                             | 常用网格预设，例如 8x8、10x10等等。                   |
| Hide All Grid/Layout                     | 隐藏所有网格或布局。                               |
| Copy Grid/Layout/Guide                   | 复制选中画板的网格、布局或辅助线信息。                      |
| Paste Grid/Layout/Guide                  | 为选中的画板添加网格、布局或辅助线，需要先运行 “Copy Grid/Layout/Guide”。 |
| **Development**                          | **开发**                                   |
| Copy ObjectID or SymbolID                | 当选择图层时复制图层的 ObjectID 或 SymbolID到剪贴板。     |
| Copy Slice as Base64                     | 切片图像复制为 Base64，根据切片第一项设置的格式和缩放，可以得到不同图像。 |
| Copy Selected Layer Name                 | 复制选中的图层名到剪贴板。                            |
| Show File in Finder                      | 在 Finder 中打开当前文档。                        |
| Open Termianl at File Folder             | 打开终端，并切换到当前文档的目录。                        |
| Script Editor Setting                    | 脚本编辑器的字体与字号设置。                           |
| Edit Plugin Setting                      | 设置外部插件编辑器，预设编辑器 Atom、Sublime Text、Visual Studio Code 和 WebStorm。 |
| Reload Plugins                           | 重载所有插件。                                  |
| **Utilities**                            | **实用工具**                                 |
| SVG Export Setting                       | SVG 导出设置。                                |
| Nudge Distance Setting                   | 方向键移动距离设置。                               |
| Convert Sketch File to Other Version     | 转为 Sketch 文件为 43 以后的任意版本，可以打开高版本文件，或转为低版本。 |

部分功能，当有选中元素时，将只操作元素内的图层。

## 声明

CC BY-SA 4.0

[![cc-by-sa-4.0](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](http://creativecommons.org/licenses/by-sa/4.0/)

### 捐款

[使用支付宝与微信打赏](https://ashung.github.io/donate.html)