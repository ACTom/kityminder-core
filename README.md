TyMinder Core
==========

## 简介

TyMinder 是基于 [KityMinder Core](https://github.com/fex-team/kityminder-core) 修改的脑图可视化/编辑工具核心库。

### 原项目

KityMinder 是由百度 FEX 团队开发并维护的强大脑图工具。

### TyMinder 改进

在 KityMinder Core 的基础上，TyMinder 增强了以下功能：

* **自由关联线**：支持任意两个节点之间建立关联连接


### 核心功能

本仓库是 TyMinder 的核心实现部分：

* 包括脑图数据的可视化展示（Json 格式）
* 包括简单的编辑功能（节点创建、编辑、删除）
* 增强的自由关联线功能
* 不包含第三方格式（FreeMind、XMind、MindManager）的支持
* 不包含文件存储的支持，需要自行实现存储

## 使用示例

可以参考 [dev.html](dev.html)、[example.html](example.html) 查看完整示例。

## 技术栈

- **图形引擎**：[Kity](https://github.com/fex-team/kity) - 基于 SVG 的矢量图形库
- **模块加载**：SeaJS
- **数据格式**：JSON

## 浏览器兼容性

TyMinder 基于 SVG 技术实现，支持主流的 HTML5 浏览器：

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Internet Explorer 10+

## 开发说明

### 环境要求

1. 安装 [Node.js](https://nodejs.org/)
2. 安装 [bower](http://bower.io/#install-bower)

### 开发步骤

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 dev.html 查看效果
```

### 项目结构

```
src/
├── connect/          # 连接线样式
├── core/             # 核心功能
├── layout/           # 布局算法
├── module/           # 功能模块
│   └── hyperconnection.js  # 自由关联线模块 ⭐️
├── protocol/         # 数据协议
├── template/         # 主题模板
└── theme/            # 主题样式
```

## 致谢

感谢百度 FEX 团队开源的 [KityMinder](https://github.com/fex-team/kityminder-core) 项目，为本项目提供了坚实的基础。

## 许可证

基于原项目的许可证。
