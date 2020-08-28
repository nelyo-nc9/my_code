### 收藏夹树
![maven](https://img.shields.io/badge/Element-2.13.1-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Vue-2.4.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Lodash-4.17.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Less-2.7.3-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Author-Song-blueviolet?style=plastic&color=E60012)
![maven](https://img.shields.io/badge/Version-V1.01-blue?&style=plastic)

- [简述](#简述)
- [传参](#传参)
- [事件](#事件)
- [方法](#方法)
- [插槽](#插槽)
- [其他](#其他)

相关接口 `http://192.168.78.101:3002/project/12/interface/api/cat_875`
基本配置类似与 `tree` 组件



### 传参
|属性|名称|类型|默认值|备注|
|:-:|:-:|:-:|:-:|:-:|
|getDataApi|获取收藏夹列表请求接口|Function|-|-|
|postDataApi|创建收藏夹列表请求接口|Function|-|-|
|searchDataApi|后端搜索收藏夹列表接口|Function|-|-|

---

### 事件
|事件|名称|参数|参数范围|参数说明|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|
|onceClick|单击返回信息|data<br>node|-|当前节点tree data<br>当前节点入参 data|-|
|dblclick|双击返回信息|data<br>node|-|当前节点tree data<br>当前节点入参 data|-|
|nodeDrop|拖拽完成时返回信息|data1<br>data2<br>position|-<br>-<br>before-之前、after-之后、inner-内|当前节点入参 data<br>被影响节点入参 data<br>位置|allowDrop 为 true 时可用|
|nodeDragEnd|拖拽结束时（可能未成功）触发的事件|data1<br>data2<br>position|-<br>-<br>before-之前、after-之后、inner-内|当前节点入参 data<br>被影响节点入参 data<br>位置|allowDrop 为 true 时可用|
|nodeExpand|节点展开/闭合 返回信息|data<br>node<br>self<br>status|-<br>-<br>-<br>open-展开 close-合并|当前节点入参 data<br>当前节点tree data<br>节点组件本身<br>状态|-|

---

### 方法
|方法|名称|入参|出参|备注|
|:-:|:-:|:-:|:-:|:-:|
|refresh|手动刷新|-|data|`1`-成功<br>`0`-失败|

---

### 插槽

> `由于需求的原因，暂时仅定义了一个匿名插槽`

|名称|说明|备注|
|:-:|:-:|:-|
|-|树节点右侧小图标，参数为 { node, data }|1、需要自行判断何时显示<br>2、需要自行计算左侧文字信息长度|

`备注`：在节点上使用了 `name` 属性，`name` 表明当前节点数据的类型

使用方式为在样式中以此当时 `.treeInfo[name='equ']` 进行筛选

---

### 其他
#### 未完成功能
1. 懒加载树 `判定节点能否被放置` 业务逻辑
1. 懒加载树 `左侧图标及title` 业务逻辑 及 图标库的引入
1. 懒加载树 `节点样式配置` 业务逻辑
1. 懒加载树 `节点文字title` 业务逻辑
1. 懒加载树 `节点` 离线样式、高亮样式 确定
