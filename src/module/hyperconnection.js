/**
 * @fileOverview
 *
 * 自由关联线模块 - 支持任意两个节点之间建立关联连接
 * 支持贝塞尔控制点拖拽调整曲线形状
 */

define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');
    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    /**
     * 自由关联线数据结构
     * {
     *     id: 'connection_id',
     *     from: 'nodeId1',           // 起始节点ID
     *     to: 'nodeId2',             // 目标节点ID
     *     text: '关联说明',          // 连线上的文字说明（可选）
     *     type: 'arrow',             // 连线类型：arrow(箭头), line(直线), dashed(虚线)
     *     color: '#000',             // 连线颜色（可选）
     *     strokeWidth: 2,            // 连线宽度（可选）
     *     controlPoint1: {x: 0, y: 0}, // 起点控制点偏移（相对默认位置）
     *     controlPoint2: {x: 0, y: 0}  // 终点控制点偏移（相对默认位置）
     * }
     */

    /**
     * 控制点手柄类
     */
    var ControlHandle = kity.createClass('ControlHandle', {
        base: kity.Group,

        constructor: function() {
            this.callBase();
            
            // 控制点圆点
            this.dot = new kity.Circle(6)
                .fill('#fff')
                .stroke('#4285f4', 2);
            
            // 连接线（从锚点到控制点）
            this.line = new kity.Path()
                .stroke('#999', 1)
                .setPathData(['M', 0, 0, 'L', 0, 0]);
            
            this.addShapes([this.line, this.dot]);
            
            this.setStyle('cursor', 'move');
            this.hide();
        },

        setPosition: function(x, y) {
            this.dot.setCenter(x, y);
            this.controlX = x;
            this.controlY = y;
            return this;
        },

        setLineStart: function(x, y) {
            var cx = this.controlX || 0;
            var cy = this.controlY || 0;
            this.line.setPathData(['M', x, y, 'L', cx, cy]);
            return this;
        },

        show: function() {
            this.setVisible(true);
            return this;
        },

        hide: function() {
            this.setVisible(false);
            return this;
        }
    });

    /**
     * 临时连线类（拖拽过程中显示）
     */
    var TempConnection = kity.createClass('TempConnection', {
        base: kity.Group,

        constructor: function(minder, sourceNode) {
            this.callBase();
            this.minder = minder;
            this.sourceNode = sourceNode;
            this.targetNode = null; // 当前悬停的目标节点
            
            // 创建临时连线路径
            this.path = new kity.Path()
                .stroke('#4285f4', 2)
                .setOpacity(0.6);
            this.path.node.setAttribute('stroke-dasharray', '5,5');
            // 让临时连线不响应鼠标事件，避免遮挡节点
            this.path.node.setAttribute('pointer-events', 'none');
            
            this.addShape(this.path);
        },

        setTargetNode: function(node) {
            this.targetNode = node;
            if (node) {
                this.updateToNode(node);
            }
        },

        updateEndPoint: function(x, y) {
            var sourceBox = this.sourceNode.getLayoutBox();
            var start = {
                x: sourceBox.cx,
                y: sourceBox.cy
            };
            
            // 简单的贝塞尔曲线
            var dx = x - start.x;
            var dy = y - start.y;
            var cx = start.x + dx / 2;
            
            var pathData = [
                'M', start.x, start.y,
                'Q', cx, start.y,
                x, y
            ];
            
            this.path.setPathData(pathData);
        },

        updateToNode: function(targetNode) {
            var sourceBox = this.sourceNode.getLayoutBox();
            var targetBox = targetNode.getLayoutBox();
            
            var start = {
                x: sourceBox.cx,
                y: sourceBox.cy
            };
            
            var end = {
                x: targetBox.cx,
                y: targetBox.cy
            };
            
            // 贝塞尔曲线
            var dx = end.x - start.x;
            var dy = end.y - start.y;
            var cx = start.x + dx / 2;
            
            var pathData = [
                'M', start.x, start.y,
                'Q', cx, start.y,
                end.x, end.y
            ];
            
            this.path.setPathData(pathData);
        },

        remove: function() {
            this.minder.getRenderContainer().removeShape(this);
        }
    });

    /**
     * 超连接渲染器
     */
    var HyperConnection = kity.createClass('HyperConnection', {
        base: kity.Group,

        constructor: function(minder, data) {
            this.callBase();
            this.minder = minder;
            this.data = data;
            this.isSelected = false;
            this.isDragging = false;
            
            // 创建透明的点击热区（更宽，但不可见）
            this.hitArea = new kity.Path()
                .stroke('transparent', 12) // 12px 宽的透明路径
                .fill('none');
            this.hitArea.node.setAttribute('stroke-linecap', 'round');
            this.hitArea.node.setAttribute('stroke-linejoin', 'round');
            this.addShape(this.hitArea);
            
            // 创建连线路径（可见的细线）
            this.path = new kity.Path();
            // 让可见路径不响应鼠标事件，事件穿透到下层的 hitArea
            this.path.node.setAttribute('pointer-events', 'none');
            this.addShape(this.path);

            // 创建箭头标记
            if (data.type === 'arrow') {
                this.createArrowMarker();
            }

            // 创建文字标签
            if (data.text) {
                this.createTextLabel(data.text);
            }

            // 创建控制点手柄
            this.handle1 = new ControlHandle();
            this.handle2 = new ControlHandle();
            this.addShapes([this.handle1, this.handle2]);

            // 绑定事件
            this.initEvents();
            
            this.update();
        },

        createArrowMarker: function() {
            var marker = new kity.Marker();
            var arrow = new kity.Path()
                .setPathData('M0,0 L8,4 L0,8 L2,4 Z')
                .fill(this.data.color || '#666');
            
            marker.addShape(arrow);
            marker.setRef(8, 4);
            marker.setViewBox(0, 0, 8, 8);
            marker.setWidth(8);
            marker.setHeight(8);
            
            this.arrowMarker = marker;
            this.path.setMarker(marker, 'end');
        },

        createTextLabel: function(text) {
            var self = this;
            var minder = this.minder;
            
            this.textShape = new kity.Text()
                .setContent(text)
                .setSize(12)
                .fill('#666');
            
            // 给文字添加单击事件 - 选中连接线
            this.textShape.on('click', function(e) {
                self.select();
                e.stopPropagation();
            });
                        
            // 给文字添加双击事件
            this.textShape.on('dblclick', function(e) {
                // 先选中连接线
                self.select();
                // 触发双击事件
                minder.fire('hyperconnectiondblclick', {
                    connection: self,
                    data: self.data,
                    shape: self,
                    event: e
                });
                e.stopPropagation();
                e.preventDefault();
            });
            
            this.addShape(this.textShape);
        },

        initEvents: function() {
            var self = this;
            var minder = this.minder;

            // 在透明热区上监听点击事件（更容易点击）
            this.hitArea.on('click', function(e) {
                self.select();
                e.stopPropagation();
            });

            // 双击事件 - 触发自定义事件供应用层监听
            this.hitArea.on('dblclick', function(e) {
                minder.fire('hyperconnectiondblclick', {
                    connection: self,
                    data: self.data,
                    shape: self,
                    event: e
                });
                e.stopPropagation();
                e.preventDefault();
            });

            // 控制点1的拖拽
            this.initHandleDrag(this.handle1, 1);
            
            // 控制点2的拖拽
            this.initHandleDrag(this.handle2, 2);

            // 监听画布点击，取消选中
            minder.on('paperclick', function() {
                self.deselect();
            });

            // 监听节点选中，取消连线选中
            minder.on('selectionchange', function() {
                self.deselect();
            });

            // 监听其他连接线被选中，取消自己的选中
            minder.on('hyperconnectionselect', function(e) {
                if (e.connection !== self) {
                    self.deselect();
                }
            });
        },

        initHandleDrag: function(handle, index) {
            var self = this;
            var minder = this.minder;
            var startPos = null;
            var startControlPoint = null;
            var draggingHandleIndex = null; // 记录当前拖拽的控制点索引

            handle.on('mousedown', function(e) {
                self.isDragging = true;
                draggingHandleIndex = index; // 记录是哪个控制点
                startPos = {
                    x: e.originEvent.clientX,
                    y: e.originEvent.clientY
                };
                
                // 保存当前控制点位置
                var cpKey = 'controlPoint' + index;
                startControlPoint = self.data[cpKey] || {x: 0, y: 0};
                
                e.stopPropagation();
                e.preventDefault();
            });

            // 双击控制点，等同于双击连接线
            handle.on('dblclick', function(e) {
                // 先选中连接线
                self.select();
                // 触发双击事件
                minder.fire('hyperconnectiondblclick', {
                    connection: self,
                    data: self.data,
                    shape: self,
                    event: e
                });
                e.stopPropagation();
                e.preventDefault();
            });

            // 使用document级别的事件处理拖拽
            if (typeof document !== 'undefined') {
                document.addEventListener('mousemove', function mousemove(e) {
                    // 只处理当前控制点的拖拽
                    if (self.isDragging && startPos && draggingHandleIndex === index) {
                        var dx = e.clientX - startPos.x;
                        var dy = e.clientY - startPos.y;
                        
                        // 更新控制点偏移
                        var cpKey = 'controlPoint' + index;
                        self.data[cpKey] = {
                            x: startControlPoint.x + dx,
                            y: startControlPoint.y + dy
                        };
                        
                        self.update();
                        e.preventDefault();
                    }
                });

                document.addEventListener('mouseup', function mouseup() {
                    // 只处理当前控制点的释放
                    if (self.isDragging && draggingHandleIndex === index) {
                        self.isDragging = false;
                        startPos = null;
                        startControlPoint = null;
                        draggingHandleIndex = null;
                        
                        // 触发内容变化事件
                        minder.fire('contentchange');
                    }
                });
            }
        },

        select: function() {
            // 触发连接线选中事件，其他连接线会监听并取消选中
            this.minder.fire('hyperconnectionselect', { connection: this });
            
            this.isSelected = true;
            this.showHandles();
            this.path.stroke(this.data.color || '#666', (this.data.strokeWidth || 2) + 1);
        },

        deselect: function() {
            this.isSelected = false;
            if (!this.isDragging) {
                this.hideHandles();
            }
            this.path.stroke(this.data.color || '#666', this.data.strokeWidth || 2);
        },

        showHandles: function() {
            this.handle1.show();
            this.handle2.show();
        },

        hideHandles: function() {
            this.handle1.hide();
            this.handle2.hide();
        },

        /**
         * 设置连线文字
         */
        setText: function(text) {
            this.data.text = text;
            
            if (!text) {
                // 如果文字为空，移除文字标签
                if (this.textShape) {
                    this.removeShape(this.textShape);
                    this.textShape = null;
                }
            } else {
                // 如果还没有文字标签，创建一个
                if (!this.textShape) {
                    this.createTextLabel(text);
                } else {
                    this.textShape.setContent(text);
                }
            }
            
            this.update();
            return this;
        },

        /**
         * 获取连线文字
         */
        getText: function() {
            return this.data.text || '';
        },

        update: function() {
            var minder = this.minder;
            if (!minder) return;

            var fromNode = minder.getNodeById(this.data.from);
            var toNode = minder.getNodeById(this.data.to);

            if (!fromNode || !toNode) return;

            // 获取节点的布局位置
            var fromBox = fromNode.getLayoutBox();
            var toBox = toNode.getLayoutBox();

            // 计算起点和终点（节点边缘的中心点）
            var start = this.getNodeEdgePoint(fromBox, toBox);
            var end = this.getNodeEdgePoint(toBox, fromBox);

            // 计算贝塞尔控制点
            var controlPoints = this.calculateControlPoints(start, end);
            
            // 绘制连线路径
            this.drawPath(start, end, controlPoints);

            // 更新控制点手柄位置
            this.handle1.setPosition(controlPoints.cp1.x, controlPoints.cp1.y);
            this.handle1.setLineStart(start.x, start.y);
            
            this.handle2.setPosition(controlPoints.cp2.x, controlPoints.cp2.y);
            this.handle2.setLineStart(end.x, end.y);

            // 更新文字标签位置
            if (this.textShape) {
                // 计算贝塞尔曲线中点（t=0.5时的位置）
                var t = 0.5;
                var mt = 1 - t;
                var midPoint = {
                    x: mt*mt*mt*start.x + 3*mt*mt*t*controlPoints.cp1.x + 
                       3*mt*t*t*controlPoints.cp2.x + t*t*t*end.x,
                    y: mt*mt*mt*start.y + 3*mt*mt*t*controlPoints.cp1.y + 
                       3*mt*t*t*controlPoints.cp2.y + t*t*t*end.y
                };
                this.textShape.setPosition(midPoint.x, midPoint.y - 10);
            }

            // 设置样式
            var strokeStyle = this.data.type === 'dashed' ? 'dashed' : 'solid';
            this.path.stroke(
                this.data.color || '#666',
                this.data.strokeWidth || 2
            );
            
            if (strokeStyle === 'dashed') {
                this.path.node.setAttribute('stroke-dasharray', '5,5');
            }
        },

        /**
         * 计算贝塞尔控制点（包含用户的偏移调整）
         */
        calculateControlPoints: function(start, end) {
            var dx = end.x - start.x;
            var dy = end.y - start.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            // 防止除以零
            if (dist < 1) dist = 1;

            // 默认控制点位置（自动计算）
            var defaultCp1, defaultCp2;
            var controlFactor = 0.3;  // 控制点沿连线方向的偏移比例
            var curvature = Math.min(30, dist * 0.15);  // 默认弧度，根据距离自适应
            
            // 计算垂直于连线方向的单位向量
            var perpX = dy / dist;
            var perpY = -dx / dist;
            
            // 控制点位置 = 沿连线方向偏移 + 垂直方向弧度偏移
            defaultCp1 = {
                x: start.x + dx * controlFactor + perpX * curvature,
                y: start.y + dy * controlFactor + perpY * curvature
            };
            defaultCp2 = {
                x: end.x - dx * controlFactor + perpX * curvature,
                y: end.y - dy * controlFactor + perpY * curvature
            };

            // 应用用户的偏移量
            var offset1 = this.data.controlPoint1 || {x: 0, y: 0};
            var offset2 = this.data.controlPoint2 || {x: 0, y: 0};

            return {
                cp1: {
                    x: defaultCp1.x + offset1.x,
                    y: defaultCp1.y + offset1.y
                },
                cp2: {
                    x: defaultCp2.x + offset2.x,
                    y: defaultCp2.y + offset2.y
                }
            };
        },

        /**
         * 计算从一个矩形指向另一个矩形的边缘点
         */
        getNodeEdgePoint: function(fromBox, toBox) {
            var fx = fromBox.cx;
            var fy = fromBox.cy;
            var tx = toBox.cx;
            var ty = toBox.cy;

            // 计算方向向量
            var dx = tx - fx;
            var dy = ty - fy;

            // 根据角度确定边缘点
            var point = { x: fx, y: fy };
            var hw = fromBox.width / 2;
            var hh = fromBox.height / 2;

            // 判断目标在哪个方向
            if (Math.abs(dx) * hh > Math.abs(dy) * hw) {
                // 左右方向
                if (dx > 0) {
                    point.x = fromBox.right;
                    point.y = fy;
                } else {
                    point.x = fromBox.left;
                    point.y = fy;
                }
            } else {
                // 上下方向
                if (dy > 0) {
                    point.x = fx;
                    point.y = fromBox.bottom;
                } else {
                    point.x = fx;
                    point.y = fromBox.top;
                }
            }

            return point;
        },

        /**
         * 绘制连线路径（三次贝塞尔曲线）
         */
        drawPath: function(start, end, controlPoints) {
            var pathData = [
                'M', start.x, start.y,
                'C', controlPoints.cp1.x, controlPoints.cp1.y,
                     controlPoints.cp2.x, controlPoints.cp2.y,
                     end.x, end.y
            ];

            // 透明热区和可见路径使用相同的路径数据
            this.hitArea.setPathData(pathData);
            this.path.setPathData(pathData);
        },

        getData: function() {
            return this.data;
        },

        setData: function(data) {
            this.data = utils.extend(this.data, data);
            this.update();
        }
    });

    /**
     * 启动添加关联线模式命令
     */
    var StartHyperConnectionCommand = kity.createClass('StartHyperConnectionCommand', {
        base: Command,

        execute: function(minder) {
            var selectedNode = minder.getSelectedNode();
            if (!selectedNode) {
                return false;
            }
            
            // 设置源节点
            minder._connectionSourceNode = selectedNode;
            
            // 创建临时连线
            minder._tempConnection = new TempConnection(minder, selectedNode);
            minder.getRenderContainer().addShape(minder._tempConnection);
            
            // 进入添加关联线模式
            minder.setStatus('hyperconnection');
            return true;
        },

        queryState: function(minder) {
            // 只有选中一个节点时才可执行
            return minder.getSelectedNode() ? 0 : -1;
        }
    });

    /**
     * 添加自由关联线命令
     */
    var AddHyperConnectionCommand = kity.createClass('AddHyperConnectionCommand', {
        base: Command,

        execute: function(minder, fromNode, toNode, connectionData) {
            connectionData = connectionData || {};
            
            var fromId = fromNode.getData('id');
            var toId = toNode.getData('id');
            
            if (!fromId || !toId) {
                console.error('Node missing ID!', {fromId: fromId, toId: toId});
                return;
            }
            
            // 检查是否已存在相同的连接
            var connections = minder.getHyperConnections();
            for (var i = 0; i < connections.length; i++) {
                var conn = connections[i];
                // 检查双向连接（A->B 或 B->A 都算重复）
                if ((conn.from === fromId && conn.to === toId) || 
                    (conn.from === toId && conn.to === fromId)) {
                    console.warn('Connection already exists between these nodes');
                    return false; // 返回 false 表示未执行
                }
            }
            
            var connection = {
                id: utils.guid(),
                from: fromId,
                to: toId,
                text: connectionData.text || '',
                type: connectionData.type || 'arrow',
                color: connectionData.color,
                strokeWidth: connectionData.strokeWidth,
                controlPoint1: {x: 0, y: 0},
                controlPoint2: {x: 0, y: 0}
            };

            // 存储到数据中
            connections.push(connection);

            // 渲染连线
            minder._renderHyperConnection(connection);

            minder.fire('contentchange');
            
            return connection;
        },

        queryState: function(minder, fromNode, toNode) {
            // 如果直接传入了节点参数，允许执行（拖拽创建）
            if (fromNode && toNode) {
                return 0;
            }
            
            // 如果有保存的源节点（拖拽创建过程中），允许执行
            if (minder._connectionSourceNode) {
                return 0;
            }
            
            // 在 hyperconnection 模式下，允许执行（拖拽创建）
            if (minder.getStatus() === 'hyperconnection') {
                return 0;
            }
            
            // 普通模式下，需要选中恰好两个节点
            var selectedNodes = minder.getSelectedNodes();
            return selectedNodes.length === 2 ? 0 : -1;
        }
    });

    /**
     * 删除自由关联线命令
     */
    var RemoveHyperConnectionCommand = kity.createClass('RemoveHyperConnectionCommand', {
        base: Command,

        execute: function(minder, connectionId) {
            var connections = minder.getHyperConnections();
            var index = -1;

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].id === connectionId) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                connections.splice(index, 1);
                minder._removeHyperConnectionShape(connectionId);
                minder.fire('contentchange');
            }
        }
    });

    /**
     * 在 Minder 上扩展超连接相关方法
     */
    kity.extendClass(Minder, {
        
        getHyperConnections: function() {
            if (!this._hyperConnections) {
                this._hyperConnections = [];
            }
            return this._hyperConnections;
        },

        setHyperConnections: function(connections) {
            this._hyperConnections = connections || [];
            this._renderAllHyperConnections();
        },

        _renderHyperConnection: function(connectionData) {
            var shape = new HyperConnection(this, connectionData);
            shape.setId('hyperconn_' + connectionData.id);
            
            // 添加到超连接容器
            this._hyperConnectionContainer.addShape(shape);
            
            // 更新连线位置
            shape.update();

            return shape;
        },

        _renderAllHyperConnections: function() {
            // 清空现有连线
            if (this._hyperConnectionContainer) {
                this._hyperConnectionContainer.clear();
            }

            var connections = this.getHyperConnections();
            for (var i = 0; i < connections.length; i++) {
                this._renderHyperConnection(connections[i]);
            }
        },

        _removeHyperConnectionShape: function(connectionId) {
            var shapes = this._hyperConnectionContainer.getShapes();
            var targetId = 'hyperconn_' + connectionId;
            for (var i = 0; i < shapes.length; i++) {
                if (shapes[i].getId() === targetId) {
                    this._hyperConnectionContainer.removeShape(shapes[i]);
                    break;
                }
            }
        },

        _updateAllHyperConnections: function() {
            var shapes = this._hyperConnectionContainer.getShapes();
            for (var i = 0; i < shapes.length; i++) {
                if (shapes[i].update) {
                    shapes[i].update();
                }
            }
        },

        _updateConnectionsForNode: function(nodeId) {
            var shapes = this._hyperConnectionContainer.getShapes();
            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i];
                if (shape.data && (shape.data.from === nodeId || shape.data.to === nodeId)) {
                    if (shape.update) {
                        shape.update();
                    }
                }
            }
        }
    });

    /**
     * 注册模块
     */
    Module.register('HyperConnection', {
        
        init: function() {
            // 创建超连接容器，放在普通连线之上
            this._hyperConnectionContainer = new kity.Group()
                .setId(utils.uuid('minder_hyperconnection_group'));
            this.getRenderContainer().addShape(this._hyperConnectionContainer);
            
            // 节点更新节流器
            this._nodeUpdateThrottle = {};
            
            // 拖拽创建状态
            this._connectionSourceNode = null;
            this._tempConnection = null;
            this._hoveredNode = null;
        },

        commands: {
            'StartHyperConnection': StartHyperConnectionCommand,
            'AddHyperConnection': AddHyperConnectionCommand,
            'RemoveHyperConnection': RemoveHyperConnectionCommand
        },

        events: {
            // 布局变化时更新所有超连接
            'layoutallfinish': function() {
                this._updateAllHyperConnections();
            },

            // 节点布局应用时实时更新连线（拖动过程中会触发）
            'layoutapply': function(e) {
                var self = this;
                var nodeId = e.node.getData('id');
                if (!nodeId) return;

                // 使用 requestAnimationFrame 进行节流，避免过度更新
                if (this._nodeUpdateThrottle[nodeId]) {
                    return;
                }
                
                this._nodeUpdateThrottle[nodeId] = true;
                
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(function() {
                        self._nodeUpdateThrottle[nodeId] = false;
                        self._updateConnectionsForNode(nodeId);
                    });
                } else {
                    setTimeout(function() {
                        self._nodeUpdateThrottle[nodeId] = false;
                        self._updateConnectionsForNode(nodeId);
                    }, 16);
                }
            },

            // 导入数据后重新渲染超连接
            'import': function() {
                this._renderAllHyperConnections();
            },

            // 节点删除时，移除相关的超连接
            'noderemove': function(e) {
                var nodeId = e.node.getData('id');
                var connections = this.getHyperConnections();
                var toRemove = [];

                for (var i = 0; i < connections.length; i++) {
                    if (connections[i].from === nodeId || connections[i].to === nodeId) {
                        toRemove.push(i);
                    }
                }

                // 从后往前删除，避免索引问题
                for (var i = toRemove.length - 1; i >= 0; i--) {
                    connections.splice(toRemove[i], 1);
                }

                this._renderAllHyperConnections();
            },

            // 进入/离开 hyperconnection 状态
            'statuschange': function(e) {
                var minder = this;
                
                if (e.currentStatus === 'hyperconnection') {
                    // 进入添加关联线模式
                    minder.getPaper().setStyle('cursor', 'crosshair');
                } else if (e.lastStatus === 'hyperconnection') {
                    // 离开添加关联线模式
                    minder.getPaper().setStyle('cursor', 'default');
                    
                    // ⚠️ 不要立即清空源节点，因为 mousedown 事件可能还没处理完
                    // 延迟清理，让 mousedown 有机会完成
                    setTimeout(function() {
                        if (minder._tempConnection) {
                            minder._tempConnection.remove();
                            minder._tempConnection = null;
                        }
                        minder._connectionSourceNode = null;
                        if (minder._hoveredNode) {
                            minder._hoveredNode.getRenderContainer().setOpacity(1);
                            minder._hoveredNode = null;
                        }
                    }, 5);
                }
            },

            // hyperconnection 状态下的鼠标事件
            'hyperconnection.mousemove': function(e) {
                var minder = this;
                
                if (!minder._tempConnection) return;
                
                var pos = e.getPosition(minder.getRenderContainer());
                
                // 如果已经有悬停节点，先检查是否还在该节点范围内
                if (minder._hoveredNode) {
                    var hoveredBox = minder._hoveredNode.getLayoutBox();
                    
                    // 添加一些容差，避免在节点边缘抖动
                    var margin = 10;
                    var inBox = pos.x >= hoveredBox.x - margin && 
                               pos.x <= hoveredBox.right + margin &&
                               pos.y >= hoveredBox.y - margin && 
                               pos.y <= hoveredBox.bottom + margin;
                    
                    if (inBox) {
                        // 还在节点范围内，继续吸附
                        minder._tempConnection.setTargetNode(minder._hoveredNode);
                        return;
                    } else {
                        // 真正离开了节点范围
                        minder._hoveredNode.getRenderContainer().setOpacity(1);
                        minder._hoveredNode = null;
                    }
                }
                
                // 没有悬停节点，或者已经离开了，检测新的节点
                var targetNode = e.getTargetNode();
                
                if (targetNode && targetNode !== minder._connectionSourceNode) {
                    // 鼠标在新节点上，锁定它
                    minder._hoveredNode = targetNode;
                    targetNode.getRenderContainer().setOpacity(0.7);
                    minder._tempConnection.setTargetNode(targetNode);
                } else {
                    // 没有节点，连线跟随鼠标
                    minder._tempConnection.setTargetNode(null);
                    minder._tempConnection.updateEndPoint(pos.x, pos.y);
                }
            },

            // 点击节点时创建连接（使用 mousedown 避免状态被提前改变）
            'hyperconnection.mousedown': function(e) {
                var minder = this;
                
                // ⚠️ 关键：立即阻止事件传播，防止其他模块改变状态
                e.stopPropagation();
                e.preventDefault();
                
                // 立即保存源节点和目标节点，防止状态切换时丢失
                var sourceNode = minder._connectionSourceNode;
                var targetNode = minder._hoveredNode || e.getTargetNode();
                
                // 如果点击在节点上，且不是源节点，直接创建连接
                if (sourceNode && targetNode && targetNode !== sourceNode) {
                    // 使用命令系统，支持撤销/重做
                    minder.execCommand('AddHyperConnection', 
                        sourceNode, 
                        targetNode, 
                        {
                            type: 'arrow',
                            color: '#4285f4',
                            strokeWidth: 2
                        }
                    );
                    
                    // 清理状态
                    if (minder._tempConnection) {
                        minder._tempConnection.remove();
                        minder._tempConnection = null;
                    }
                    if (minder._hoveredNode) {
                        minder._hoveredNode.getRenderContainer().setOpacity(1);
                        minder._hoveredNode = null;
                    }
                    minder._connectionSourceNode = null;
                    
                    // 退出 hyperconnection 模式
                    minder.setStatus('normal');
                }
            },

            // ESC 取消添加关联线
            'hyperconnection.keydown': function(e) {
                if (e.originEvent.keyCode === 27) { // ESC
                    this.setStatus('normal');
                    e.preventDefault();
                }
            }
        }
    });
});
