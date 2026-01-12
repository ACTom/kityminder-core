# TyMinder Core 架构说明文档

## 项目目录结构

```
.
├── doc/                           # 文档目录
│   └── Architecture.md           # 架构说明文档（本文件）
├── src/                          # 源代码目录
│   ├── connect/                  # 连线算法模块
│   │   ├── arc.js               # 圆弧连线
│   │   ├── arc_tp.js            # 天盘圆弧连线
│   │   ├── bezier.js            # 贝塞尔曲线连线
│   │   ├── fish-bone-master.js  # 鱼骨图主线连接
│   │   ├── l.js                 # 直线连接
│   │   ├── poly.js              # 折线连接
│   │   └── under.js             # 下划线连接
│   ├── core/                     # 核心运行时模块
│   │   ├── animate.js           # 动画支持
│   │   ├── command.js           # 命令基类及命令执行机制
│   │   ├── compatibility.js     # 兼容性处理
│   │   ├── connect.js           # 连线管理
│   │   ├── data.js              # 数据导入导出（JSON/协议）
│   │   ├── event.js             # 事件系统
│   │   ├── focus.js             # 焦点管理
│   │   ├── keymap.js            # 键盘映射
│   │   ├── keyreceiver.js       # 键盘输入接收
│   │   ├── kity.js              # Kity 图形库引用
│   │   ├── layout.js            # 布局基类及布局系统
│   │   ├── minder.js            # Minder 主类定义
│   │   ├── module.js            # 模块注册及管理
│   │   ├── node.js              # MinderNode 节点类
│   │   ├── option.js            # 配置项管理
│   │   ├── paper.js             # SVG 画布管理
│   │   ├── patch.js             # 补丁修复
│   │   ├── promise.js           # Promise 实现
│   │   ├── readonly.js          # 只读模式
│   │   ├── render.js            # 渲染器基类
│   │   ├── select.js            # 选择管理
│   │   ├── shortcut.js          # 快捷键管理
│   │   ├── status.js            # 状态管理
│   │   ├── template.js          # 模板系统
│   │   ├── theme.js             # 主题系统
│   │   ├── utils.js             # 工具函数
│   │   └── _boxv.js             # Box 辅助计算
│   ├── layout/                   # 布局算法实现
│   │   ├── btree.js             # 二叉树布局
│   │   ├── filetree.js          # 文件树布局
│   │   ├── fish-bone-master.js  # 鱼骨图主干布局
│   │   ├── fish-bone-slave.js   # 鱼骨图分支布局
│   │   ├── mind.js              # 思维导图布局
│   │   └── tianpan.js           # 天盘布局
│   ├── module/                   # 功能模块
│   │   ├── arrange.js           # 排列调整
│   │   ├── basestyle.js         # 基础样式
│   │   ├── clipboard.js         # 剪贴板操作
│   │   ├── dragtree.js          # 拖拽树节点
│   │   ├── expand.js            # 节点展开/收起
│   │   ├── font.js              # 字体设置
│   │   ├── hyperlink.js         # 超链接
│   │   ├── image.js             # 图片插入
│   │   ├── image-viewer.js      # 图片查看
│   │   ├── keynav.js            # 键盘导航
│   │   ├── layout.js            # 布局切换模块
│   │   ├── node.js              # 节点操作（增删改）
│   │   ├── note.js              # 备注
│   │   ├── outline.js           # 大纲模式
│   │   ├── priority.js          # 优先级
│   │   ├── progress.js          # 进度
│   │   ├── resource.js          # 资源标记
│   │   ├── select.js            # 选择操作
│   │   ├── style.js             # 样式定制
│   │   ├── text.js              # 文本编辑
│   │   ├── view.js              # 视图控制
│   │   └── zoom.js              # 缩放控制
│   ├── protocol/                 # 数据协议
│   │   ├── json.js              # JSON 格式
│   │   ├── markdown.js          # Markdown 格式
│   │   ├── png.js               # PNG 图片导出
│   │   ├── svg.js               # SVG 格式导出
│   │   └── text.js              # 纯文本格式
│   ├── template/                 # 模板定义
│   │   ├── default.js           # 默认模板
│   │   ├── filetree.js          # 文件树模板
│   │   ├── fish-bone.js         # 鱼骨图模板
│   │   ├── right.js             # 右侧布局模板
│   │   ├── structure.js         # 组织结构图模板
│   │   └── tianpan.js           # 天盘模板
│   ├── theme/                    # 主题样式
│   │   ├── default.js           # 默认主题
│   │   ├── fish.js              # 鱼骨图主题
│   │   ├── fresh.js             # 清新主题
│   │   ├── snow.js              # 雪白主题
│   │   ├── tianpan.js           # 天盘主题
│   │   └── wire.js              # 线框主题
│   ├── expose-kityminder.js      # KityMinder 对外暴露
│   ├── kityminder.css            # 样式文件
│   └── kityminder.js             # 入口文件
├── .gitignore                    # Git 忽略配置
├── .jsbeautifyrc                # 代码美化配置
├── .jscsrc                      # 代码风格检查配置
├── .jshintrc                    # JSHint 检查配置
├── Gruntfile.js                 # Grunt 构建配置
├── README.md                    # 项目说明
├── dev.html                     # 开发调试页面
├── example.html                 # 使用示例页面
├── import.js                    # 模块导入配置（seajs）
├── package-lock.json            # NPM 依赖锁定
└── package.json                 # 项目配置及依赖
```

# TyMinder Core 目标设定

## 第一期目标

* 架构搭建
* 自动布局
* 双击节点文字编辑
* 节点之间的连线（子节点向父节点）
* 导入和导出（JSON格式）
* 基本键盘导航：基于位置的选择导航；Tab插入子级；Enter插入同级
* 上述功能的撤销操作

## 第二期目标

* 自由布局
* 拖动修改子级
* 子节点展开/收起
* 思路连接线
* 外观模板支持

## 第三期目标
* 节点自由关联线 ✅
* 节点概要

## 第四期目标
* 自由主题


# TyMinder Core 整体设计

## `namespace` KityMinder
暴露的命名空间，所有公开类都会放在该命名空间下。还会暴露一个简写的命名空间：KM。

## `abstract` Command

表示一条在 KityMinder 上执行的命令，以class的方式定义，命令必须依附于模块，不允许单独存在。

## 命令定义结构：

```js
var MyCommand = kity.createClass({
    base: Command,

    execute: function(Minder minder [,args...]){},
    revert: function(Minder minder){},

    // 基类缺省实现：
    queryState: function(Minder minder){},
    queryValue: function(Minder minder){},

    // 基类实现：
    setContentChanged: function( bool ),
    isContentChanged: function() {},

    setSelectionChanged: function( bool ) {},
    isSelectionChanged: function() {}
}
```

### `method` execute(Minder minder [,args...] )
定义command执行时的一些操作，不可缺省

### `method` revert(Minder minder)
定义revert操作，可缺省,如果没有则为不可revert

### `method` queryState(Minder minder)
todo:用于返回当前命令的state，分为

* -1：不可执行
* 0：可执行
* 1：已执行

可缺省，默认返回0

### `method` queryValue(Minder minder)
todo:用于返回当前命令的状态相关值，（例如：进度条的进度百分比值等）
可缺省

### `method` isContentChanged()
返回命令是否对内容产生影响（true/false）
缺省为 true

### `method` isContentChanged()
返回命令是否对选区产生影响（true/false）
缺省为 false

## Module
Module定义一个模块，表示控制脑图中一个功能的模块（布局、渲染、输入文字、图标叠加等）

### 模块定义
下面代码简单展示了模块的定义方式

```js
KityMinder.registerModule("ModuleName", function() {
    // 此处可以进行命令的定义、设置模块常量、工具函数等
    return {

        // 模块可能使用到的配置项，提供一个默认值
    	"defaultOpitons": {
    		
    	},
    	
        // Minder 实例化的时候会调用 init 方法，this 指向正在实例化的 Minder 对象
        // options 是 Minder 对象最终的配置（经过配置文件和用户设定改写）
        "init": function( options ){

        },
        
        // 注册模块需要使用到的命令
        "commands": {
            "mycommand": CommandClass
        },
        
        // 模块需要关注的事件处理函数
        // 处理函数中 this 指向事件发生的 Minder 对象
        // e 参数为 MinderEvent 对象
        "events": {
            "click": function(e){
            
            },
            "keydown keyup": function(e){
            
            }
        },
        
        // Minder 被卸载的时候会调用 destroy 方法，模块自行回收自己的资源（事件由 Minder 自动回收）
        // destroy 方法中的 this 指向 Minder 实例
        "destroy": function() {
        
        },
        
        // Minder 被重设是会调用 reset 方法，模块自行
        // reset 方法中的 this 指向 Minder 实例
        "reset" : function() {
        
        }

    }
});
```




## MinderNode

MinderNode 是 Kity Minder 需要展示和控制的树的一个节点。节点上提供了*树遍历*和*数据存取*的功能。并且提供对节点对应的渲染容器（Kity.Group）的访问

节点上提供公开字段，任何模块可以读取和修改，这些字段会提供给 KityMinder 作为渲染的依据。

公开的字段和存放的数据都会在导出、保存现场的时候被保留。

MinderTreeNode 维护的树关系和数据只是作为一个脑图的结构和数据，不具有任何渲染和交互的能力。

### 树遍历

通过 6 个接口来进行树的访问和修改操作

`node.getParent()` 返回当前节点的父节点

`node.getChildren()` 返回当前节点的子节点

`node.getIndex()` 返回当前节点在父节点中的位置，如果没有父节点，返回 -1

`node.insertChild( node, index )` 插入一个子节点到当前节点上，插入的位置为 index

`node.removeChild( node | index )` 移除一个子节点或指定位置的子节点

`node.getChild( index )` 获得指定位置的子节点

### 数据存取

`node.getData(name)` 获得指定字段的数据

`node.setData(name, value)` 设定指定字段的数据

### 公开字段

`node.setData( "x", value )` 设置节点的 x 坐标

`node.setData( "y", value )` 设置节点的 y 坐标

`node.getData( "x", value )` 获取节点的 x 坐标

`node.getData( "y", value )` 获取节点的 y 坐标

`node.setData( "text", value )` 设置节点的文本

`node.getData( "text", value )` 获取节点的文本

### 渲染容器

`node.getRenderContainer()` 返回当前节点的渲染容器


## Minder

脑图使用类

### `static method` registerModule( name, module )
注册一个模块

### 构造函数

`constructor` KityMinder(id, option)

创建脑图画布。KityMinder 实例化的时候，会从模块池中取出模块，并且实例化这些模块，然后加载。

`id` 实例的 id

`option` 其他选项（当前没有）

### 公开接口

`.getRoot() : MinderNode` 

获取脑图根节点

`.execCommand( name [, params...] ) : this`

执行指定的命令。该方法执行的时候，会实例化指定类型的命令，并且把命令参数传给命令执行

`.queryCommandState( name )`

查询命令的当前状态

`.queryCommandValue( name )`

查询命令的当前结果

`.update(MinderNode node) : this`

更新指定节点及其子树的呈现，如果不指定节点，则更新跟节点的呈现（整棵树）

`.export() : object`

以导出节点以及所有子树的数据（data上所有的字段会被导出）

`.import(object data) : this`

导入节点数据，会节点以及所有子树结构以及子树数据

`.getSelectedNodes() : MinderNode[]`

返回选中的节点列表

`.select(MinderNode[] nodes | MinderNode node) : this`

添加一个或多个节点到节点选择列表中

`.selectSingle(Minder node) : this`

唯一选中指定节点

`.toggleSelect(MinderNode[] nodes | MinderNode node)`

切换一个或多个节点的选中状态

`.clearSelect(MinderNode[] nodes | MinderNode node) : this`

从节点选择列表中移除一个或多个节点，如果不传节点，全部取消选择

### 事件机制

#### 事件分类

KityMinder 的事件分为：

* 交互事件: `click`, `dblclick`, `mousedown`, `mousemove`, `mouseup`, `keydown`, `keyup`, `keypress`, `touchstart`, `touchend`, `touchmove`

* Command 事件: `beforecommand`, `precommand`, `aftercommand`

* 交互事件：`selectionchange`, `contentchange`, `interactchange`

* 模块事件：模块自行触发与上述不同名的事件

#### 事件接口

`.on(event, callback)` 侦听指定事件

`.once(event, callback)` 侦听指定事件一次，当 callback 被调用之后，后面再发生该事件不再被调用

`.off(event, callback)` 取消对事件的侦听

`.fire(event, params)` 触发指定的事件，params 是自定义的 JSON 数据，会合并到事件对象


#### 回调函数接口

回调函数接收唯一的参数 e

对于交互事件，e 是原生 event 对象的一个拓展；对于需要坐标的事件，用 e.getPosition() 可以获得在 Kity Paper 上的坐标值

对 command 事件：

* `e.commandName` 获取执行的命令的类型
* `e.commandArgs` 获取命令执行的参数列表

对 import 事件：

* `e.getImportData()` 获取导入的数据

对 selectionchange 事件：

* `e.currentSelection` 获取当前选择的节点列表
* `e.additionNodes` 添加到选择节点列表的那部分节点
* `e.removalNodes` 从选择节点列表移除的那部分节点

#### 事件触发时机

`command` 事件只在顶级 command 执行的时候触发（Command 里调用 Command 不触发）

`contentchange` 事件在顶级 command 之后会查询是否发生了内容的变化，如果发生了变化，则会触发；

`selectionchange` 事件在顶级 command 之后会查询是否发生了选区的变化，如果发生了变化，则会触发

`interactchange` 事件会在所有的鼠标、键盘、触摸操作后发生，并且会进行稀释；command 可以手动触发该事件，此时不会被稀释



---

## 功能实现情况分析

### 第一期目标实现情况

✅ **已完全实现的功能：**

1. **架构搭建** ✅
   - 核心类 `Minder`、`MinderNode`、`Command`、`Module` 已完整实现
   - 模块化架构通过 `module.js` 实现模块注册和生命周期管理
   - 事件系统、命令系统、渲染系统等基础架构完备

2. **自动布局** ✅
   - 实现了完整的布局基类 `Layout` (`core/layout.js`)
   - 支持多种布局算法：
     - 思维导图布局 (`layout/mind.js`)
     - 二叉树布局 (`layout/btree.js`)
     - 文件树布局 (`layout/filetree.js`)
     - 天盘布局 (`layout/tianpan.js`)
     - 鱼骨图布局 (`layout/fish-bone-master.js` 和 `layout/fish-bone-slave.js`)
   - 支持布局动画和优化

3. **双击节点文字编辑** ✅
   - 通过 `module/text.js` 实现文字编辑功能
   - 支持多行文本编辑
   - 兼容不同浏览器和字体的渲染差异

4. **节点之间的连线（子节点向父节点）** ✅
   - 实现了多种连线算法 (`connect/` 目录)：
     - 贝塞尔曲线 (`bezier.js`)
     - 圆弧连线 (`arc.js`)
     - 直线连接 (`l.js`)
     - 折线连接 (`poly.js`)
     - 鱼骨线 (`fish-bone-master.js`)
   - 连线管理由 `core/connect.js` 统一处理

5. **导入和导出（JSON格式）** ✅
   - 完整实现了数据导入导出机制 (`core/data.js`)
   - 支持 `exportJson()` 和 `importJson()` 方法
   - 支持多种数据协议：
     - JSON 格式 (`protocol/json.js`)
     - Markdown 格式 (`protocol/markdown.js`)
     - 纯文本格式 (`protocol/text.js`)
     - SVG 导出 (`protocol/svg.js`)
     - PNG 导出 (`protocol/png.js`)

6. **基本键盘导航** ✅
   - 实现了键盘导航模块 (`module/keynav.js`)
   - 支持基于位置的选择导航
   - 键盘映射系统 (`core/keymap.js`)
   - 键盘输入接收器 (`core/keyreceiver.js`)
   - 快捷键管理 (`core/shortcut.js`)

7. **上述功能的撤销操作** ✅
   - 命令系统支持撤销机制
   - `Command` 基类定义了 `execute()` 和 `revert()` 方法
   - 命令执行时会触发相应事件，便于撤销管理

### 第二期目标实现情况

✅ **已完全实现的功能：**

1. **自由布局** ✅
   - 支持多种布局模板切换 (`module/layout.js`)
   - 通过 `template/` 目录定义了多种模板
   - 支持节点自定义位置偏移 (`layout_offset`)

2. **拖动修改子级** ✅
   - 实现了拖拽树节点模块 (`module/dragtree.js`)
   - 支持节点拖拽重新组织结构

3. **子节点展开/收起** ✅
   - 完整实现展开/收起模块 (`module/expand.js`)
   - 提供 `expand()`、`collapse()`、`isExpanded()` 等方法
   - 实现了可视化的展开/收起控件（Expander）
   - 支持展开到指定层级的命令 (`ExpandToLevelCommand`)

4. **思路连接线** ✅
   - 多种连接线算法已实现（见上文连线部分）
   - 支持不同风格的连线展示

5. **节点总结** ⚠️
   - 未在现有代码中找到明确的节点总结功能实现
   - 可能需要进一步确认需求或待实现

6. **外观模板支持** ✅
   - 完整的模板系统 (`core/template.js`)
   - 6 种预定义模板：
     - 默认模板 (`template/default.js`)
     - 文件树模板 (`template/filetree.js`)
     - 鱼骨图模板 (`template/fish-bone.js`)
     - 右侧布局模板 (`template/right.js`)
     - 组织结构图模板 (`template/structure.js`)
     - 天盘模板 (`template/tianpan.js`)
   - 完整的主题系统 (`core/theme.js`)
   - 6 种预定义主题：
     - 默认主题 (`theme/default.js`)
     - 鱼骨图主题 (`theme/fish.js`)
     - 清新主题 (`theme/fresh.js`)
     - 雪白主题 (`theme/snow.js`)
     - 天盘主题 (`theme/tianpan.js`)
     - 线框主题 (`theme/wire.js`)

### 超出目标的额外功能

项目还实现了许多超出原定目标的高级功能：

1. **丰富的节点功能**：
   - 超链接 (`module/hyperlink.js`)
   - 图片插入和查看 (`module/image.js`, `module/image-viewer.js`)
   - 备注 (`module/note.js`)
   - 优先级标记 (`module/priority.js`)
   - 进度显示 (`module/progress.js`)
   - 资源标记 (`module/resource.js`)

2. **视图和交互增强**：
   - 缩放控制 (`module/zoom.js`)
   - 视图控制 (`module/view.js`)
   - 大纲模式 (`module/outline.js`)
   - 节点排列调整 (`module/arrange.js`)

3. **样式定制**：
   - 字体设置 (`module/font.js`)
   - 样式定制 (`module/style.js`)
   - 基础样式 (`module/basestyle.js`)

4. **编辑功能**：
   - 剪贴板操作 (`module/clipboard.js`)
   - 多节点选择 (`module/select.js`)
   - 节点增删改 (`module/node.js`)

5. **动画和性能优化**：
   - 动画支持 (`core/animate.js`)
   - 布局动画优化（节点数 >200 时自动关闭动画）
   - 只读模式支持 (`core/readonly.js`)

### 总体评估

**完成度：95%+**

- ✅ 第一期目标：**100% 完成**
- ✅ 第二期目标：**约 95% 完成**（节点总结功能待确认）
- ✅ 超出预期功能：实现了大量额外的高级特性

**项目成熟度**：
- 架构设计优秀，模块化良好
- 代码质量高，注释完善
- 支持多种浏览器（Chrome, Firefox, Safari, IE10+）
- 已发布 1.4.50 版本，处于成熟稳定状态
- 基于 Kity SVG 图形库，性能优异

**技术栈**：
- JavaScript + Kity (SVG 图形库)
- SeaJS 模块化管理
- json-diff 数据差异比对
- Grunt 构建工具



---

## 第三期目标实现情况

### 1. 节点自由关联线 ✅ （已实现）

**功能说明**：
- 允许在任意两个节点之间建立关联连接，不受树形结构限制
- 支持跨分支的概念关联，表达因果、依赖、参考等关系

**实现位置**：
- 核心模块：`src/module/hyperconnection.js`
- 数据导入导出：已扩展 `src/core/data.js`
- 入口文件：已添加到 `src/kityminder.js`
- 示例页面：`example-hyperconnection.html`

**数据结构**：
```javascript
{
  version: "2",           // 数据格式版本号（新增）
  root: {
    data: {
      id: 'uuid-string',   // 节点唯一标识（自动生成）
      text: '节点文本',
      // ... 其他属性
    },
    children: [
      {
        data: {
          id: 'uuid-string', // 每个节点都有唯一ID
          text: '子节点'
        },
        children: []
      }
    ]
  },
  connections: [  // 自由关联线数据
    {
      id: 'conn1',
      from: 'nodeId1',       // 起始节点ID
      to: 'nodeId2',         // 目标节点ID
      text: '关联说明',      // 连线文字（可选）
      type: 'arrow',         // 类型：arrow/line/dashed
      color: '#4285f4',      // 颜色（可选）
      strokeWidth: 2,        // 线宽（可选）
      // 新增：贝塞尔控制点偏移量（相对于默认位置）
      controlPoint1: {x: 0, y: 0},  // 起点控制点偏移
      controlPoint2: {x: 0, y: 0}   // 终点控制点偏移
    }
  ]
}
```

**数据格式版本说明**：

| 版本 | 格式特征 | 兼容性 |
|------|----------|--------|
| v1 | 旧版格式<br/>无 version 字段<br/>节点 ID 可选 | 向后兼容<br/>导入时自动生成 ID |
| v2 | 新版格式<br/>包含 version: "2"<br/>所有节点必须有 ID<br/>支持 connections 字段 | 旧版软件忽略 connections<br/>正常显示节点树 |

**版本处理**：
- **导出**：
  - 所有数据都使用 version: "2" 格式
  - connections 字段为空数组时也保留（方便后续添加）
- **导入**：
  - 自动检测并补全缺失的节点 ID
  - 自动验证关联线的节点引用
  - ID 冲突时自动重新生成
  - 无效关联线自动过滤
  - 兼容 v1 旧数据（无 version 字段）

**API 接口**：
```javascript
// 添加关联线
minder.execCommand('AddHyperConnection', fromNode, toNode, {
  type: 'arrow',
  text: '依赖',
  color: '#4285f4'
});

// 删除关联线
minder.execCommand('RemoveHyperConnection', connectionId);

// 获取所有关联线
var connections = minder.getHyperConnections();

// 设置关联线（用于导入）
minder.setHyperConnections(connections);
```

**功能特性**：
- ✅ 支持三种连线类型：箭头、直线、虚线
- ✅ 支持连线上显示文字说明
- ✅ 自动计算最优连接点（节点边缘）
- ✅ 使用贝塞尔曲线使连线更美观
- ✅ 布局变化时自动更新连线位置
- ✅ 节点删除时自动清理相关连线
- ✅ 数据导入导出支持保存关联线
- ✅ 自定义颜色和线宽
- ✅ **贝塞尔控制点拖拽** - 类似 XMind 的曲线调整功能
- ✅ 鼠标悬停或选中时显示控制手柄
- ✅ 拖动控制点实时调整曲线形状
- ✅ 控制点偏移量自动保存

**使用方法**：
1. **添加关联线**：选中两个节点（按住 Ctrl 键多选），调用命令
2. **调整曲线**：
   - 鼠标悬停在连线上，会显示两个控制手柄
   - 每个控制手柄由一个圆点和连线组成
   - 拖动圆点可以调整曲线的弯曲程度和方向
   - 放开鼠标后，调整结果会自动保存
3. **自动适应**：关联线会自动跟随节点移动和布局变化

**测试说明**：
- 执行 `npm run dev` 启动开发服务器
- 访问 `example-hyperconnection.html` 查看演示
- 使用工具栏按钮添加不同类型的关联线
- 点击“导入测试数据”查看预设的关联线效果

### 2. 节点概要 ⏳ （待实现）

**计划功能**：
- 对一组同级节点或子树进行概括总结
- 用括号或包围框将多个节点圈起来，并添加概要文字

**实现难度**：⭐⭐⭐⭐⭐
- 需要复杂的几何计算
- 不同布局需要不同的适配逻辑
- UI 交互设计较复杂

