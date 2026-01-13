# API参考

<cite>
**本文档中引用的文件**  
- [minder.js](file://src/core/minder.js)
- [node.js](file://src/core/node.js)
- [command.js](file://src/core/command.js)
- [module.js](file://src/core/module.js)
- [event.js](file://src/core/event.js)
- [data.js](file://src/core/data.js)
- [paper.js](file://src/core/paper.js)
- [render.js](file://src/core/render.js)
- [text.js](file://src/module/text.js)
- [node.js](file://src/module/node.js)
- [layout.js](file://src/module/layout.js)
</cite>

## 目录
1. [Minder类API](#minder类api)
2. [MinderNode类API](#mindernode类api)
3. [Command基类接口](#command基类接口)
4. [Module系统API](#module系统api)
5. [事件系统](#事件系统)

## Minder类API

Minder类是kityminder-core库的核心类，作为暴露在window上的唯一变量，负责管理脑图的整个生命周期和功能。

### getRoot方法
获取脑图的根节点。

**返回值**
- {MinderNode} 脑图的根节点

**Section sources**
- [minder.js](file://src/core/minder.js#L318-L320)

### execCommand方法
执行指定的命令。

**参数**
- name {string} 要执行的命令名称
- args {any} 传递给命令的其他参数

**返回值**
- {any} 命令执行结果，如果命令不存在或不可用则返回false

**说明**
该方法会触发一系列事件，包括beforeExecCommand、preExecCommand、execCommand等，确保命令执行过程的可监听性。

**Section sources**
- [command.js](file://src/core/command.js#L118-L164)

### queryCommandState方法
查询指定命令的状态。

**参数**
- name {string} 要查询的命令名称

**返回值**
- {number}
  - -1: 命令不存在或当前不可用
  - 0: 命令可用
  - 1: 命令当前可用并且已经执行过

**Section sources**
- [command.js](file://src/core/command.js#L87-L88)

### import方法
使用指定的数据协议导入脑图数据，覆盖当前实例的脑图。

**参数**
- protocol {string} 用于解析数据的数据协议
- data {any} 要导入的数据
- option {any} 可选参数

**返回值**
- {Promise} 解析为JSON数据的Promise对象

**说明**
支持多种数据协议，包括json、text、markdown、svg和png等。

**Section sources**
- [data.js](file://src/core/data.js#L353-L378)

### export方法
使用指定的数据协议导出脑图数据。

**参数**
- protocol {string} 指定的数据协议
- option {any} 可选参数

**返回值**
- {Promise} 包含导出数据的Promise对象

**说明**
导出前会触发beforeexport事件，允许在导出前进行数据处理。

**Section sources**
- [data.js](file://src/core/data.js#L319-L340)

## MinderNode类API

MinderNode类表示一个脑图节点，提供树结构操作、数据存取和渲染容器访问等方法。

### 树遍历方法

#### preTraverse方法
先序遍历当前节点树。

**参数**
- fn {Function} 遍历函数
- excludeThis {boolean} 是否排除当前节点

**说明**
遍历函数会被传入每个节点作为参数。

**Section sources**
- [node.js](file://src/core/node.js#L167-L173)

#### postTraverse方法
后序遍历当前节点树。

**参数**
- fn {Function} 遍历函数
- excludeThis {boolean} 是否排除当前节点

**说明**
默认的traverse方法即为此方法。

**Section sources**
- [node.js](file://src/core/node.js#L179-L185)

#### getChildren方法
获取节点的子节点列表。

**返回值**
- {Array} 子节点数组

**Section sources**
- [node.js](file://src/core/node.js#L191-L193)

#### insertChild方法
在指定位置插入子节点。

**参数**
- node {MinderNode} 要插入的节点
- index {number} 插入位置索引

**说明**
如果节点已有父节点，会先从原父节点中移除。

**Section sources**
- [node.js](file://src/core/node.js#L199-L210)

### 数据存取方法

#### getData方法
获取节点的数据。

**参数**
- key {string} 数据键名

**返回值**
- 如果提供key参数，返回对应数据值；否则返回整个数据对象

**Section sources**
- [node.js](file://src/core/node.js#L130-L132)

#### setData方法
设置节点的数据。

**参数**
- key {string|Object} 数据键名或数据对象
- value {any} 数据值（当key为字符串时）

**返回值**
- {MinderNode} 当前节点实例，支持链式调用

**Section sources**
- [node.js](file://src/core/node.js#L134-L145)

#### getText方法
获取节点的文本数据。

**返回值**
- {string|null} 节点文本，如果不存在则返回null

**Section sources**
- [node.js](file://src/core/node.js#L159-L161)

#### setText方法
设置节点的文本数据。

**参数**
- text {string} 文本数据

**返回值**
- {string} 设置的文本数据

**Section sources**
- [node.js](file://src/core/node.js#L151-L153)

### 渲染容器访问方法

#### getRenderContainer方法
获取节点的渲染容器。

**返回值**
- {kity.Group} 渲染容器图形对象

**说明**
渲染容器用于在画布上显示节点的视觉表现。

**Section sources**
- [node.js](file://src/core/node.js#L241-L243)

#### getRenderBox方法
获取节点的渲染边界框。

**参数**
- rendererType {string} 渲染器类型
- refer {string|kity.Shape} 参照坐标系

**返回值**
- {kity.Box} 渲染边界框

**Section sources**
- [render.js](file://src/core/render.js#L252-L257)

## Command基类接口

Command基类定义了命令的接口规范，所有具体命令都应继承此类。

### execute方法
执行命令的抽象方法。

**参数**
- minder {Minder} 命令执行的Minder实例
- args {any} 命令参数

**说明**
子类必须实现此方法，否则会抛出异常。

**Section sources**
- [command.js](file://src/core/command.js#L21-L23)

### queryState方法
查询命令状态。

**参数**
- km {Minder} Minder实例

**返回值**
- {number} 命令状态值

**说明**
默认返回COMMAND_STATE_NORMAL(0)，表示命令可用。

**Section sources**
- [command.js](file://src/core/command.js#L41-L43)

### queryValue方法
查询命令的当前执行值。

**参数**
- km {Minder} Minder实例

**返回值**
- {any} 命令的当前值

**说明**
不同命令具有不同的返回值，具体取决于命令的实现。

**Section sources**
- [command.js](file://src/core/command.js#L45-L47)

### setContentChanged方法
设置命令是否改变内容。

**参数**
- val {boolean} 是否改变内容

**说明**
用于标识命令执行后是否需要更新内容状态。

**Section sources**
- [command.js](file://src/core/command.js#L25-L27)

### isContentChanged方法
检查命令是否改变内容。

**返回值**
- {boolean} 是否改变内容

**Section sources**
- [command.js](file://src/core/command.js#L29-L31)

## Module系统API

Module系统用于扩展Minder功能，通过注册模块来添加命令、事件处理器和渲染器。

### registerModule方法
注册一个模块。

**参数**
- name {string} 模块名称
- module {Object|Function} 模块定义

**说明**
模块可以是一个对象或返回模块定义的函数。

**Section sources**
- [module.js](file://src/core/module.js#L9-L11)

### 模块定义结构

模块定义对象包含以下可选属性：

#### commands
命令映射，将命令名称映射到命令类。

**示例**
```javascript
commands: {
    'text': TextCommand
}
```

**Section sources**
- [text.js](file://src/module/text.js#L280-L281)

#### renderers
渲染器配置，指定不同位置的渲染器。

**示例**
```javascript
renderers: {
    center: TextRenderer
}
```

**Section sources**
- [text.js](file://src/module/text.js#L283-L284)

#### events
事件处理器映射，将事件类型映射到处理函数。

**示例**
```javascript
events: {
    'contentchange': function(e) { /* 处理函数 */ }
}
```

**Section sources**
- [module.js](file://src/core/module.js#L90-L94)

#### commandShortcutKeys
命令快捷键配置。

**示例**
```javascript
commandShortcutKeys: {
    'appendsiblingnode': 'normal::Enter'
}
```

**Section sources**
- [node.js](file://src/module/node.js#L143-L147)

## 事件系统

事件系统提供了完整的事件处理机制，支持事件监听、触发和移除。

### on方法
监听事件。

**参数**
- name {string} 事件名称，支持空格分隔的多个事件
- callback {Function} 事件处理函数

**返回值**
- {Minder} 当前实例，支持链式调用

**说明**
支持状态限定的事件监听，如"normal.click"。

**Section sources**
- [event.js](file://src/core/event.js#L232-L237)

### once方法
监听一次性事件。

**参数**
- name {string} 事件名称
- callback {Function} 事件处理函数

**返回值**
- {Minder} 当前实例，支持链式调用

**说明**
事件处理函数在执行一次后会自动移除。

**Section sources**
- [event.js](file://src/core/event.js#L232-L237)

### off方法
移除事件监听。

**参数**
- name {string} 事件名称
- callback {Function} 要移除的事件处理函数

**说明**
如果不提供callback参数，则移除该事件的所有监听器。

**Section sources**
- [event.js](file://src/core/event.js#L240-L257)

### fire方法
触发事件。

**参数**
- type {string} 事件类型
- params {Object} 事件参数

**返回值**
- {Minder} 当前实例，支持链式调用

**说明**
会创建MinderEvent实例并触发所有监听器。

**Section sources**
- [event.js](file://src/core/event.js#L261-L264)

### 支持的事件类型

#### 生命周期事件
- paperrender: 画布渲染完成
- finishInitHook: 初始化钩子完成
- import: 数据导入完成
- contentchange: 内容发生变化
- interactchange: 交互状态发生变化

#### 节点相关事件
- nodecreate: 节点创建
- noderemove: 节点移除
- nodeattach: 节点附加到画布
- nodedetach: 节点从画布分离
- beforerender: 节点渲染前
- noderender: 节点渲染完成

#### 命令相关事件
- beforeExecCommand: 命令执行前
- preExecCommand: 命令预执行
- execCommand: 命令执行
- layout: 布局更新
- layoutfinish: 布局完成

#### 用户交互事件
- click: 点击
- dblclick: 双击
- mousedown: 鼠标按下
- mouseup: 鼠标释放
- mousemove: 鼠标移动
- mousewheel: 鼠标滚轮
- contextmenu: 右键菜单
- focus: 获得焦点
- blur: 失去焦点

**Section sources**
- [event.js](file://src/core/event.js#L146-L147)
- [event.js](file://src/core/event.js#L261-L264)
- [minder.js](file://src/core/minder.js#L29)
- [data.js](file://src/core/data.js#L299)