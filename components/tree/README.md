## 机构树 说明文档

![maven](https://img.shields.io/badge/Element-2.13.1-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Vue-2.4.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Lodash-4.17.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Less-2.7.3-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Author-Song-blueviolet?style=plastic&color=E60012)
![maven](https://img.shields.io/badge/Version-V1.57-blue?&style=plastic)

该 tree 以 `element-ui `的 tree 为基础，进行二次开发
- [简述](#简述)
- [传参](#传参)
- [事件](#事件)
- [方法](#方法)
- [插槽](#插槽)
- [图标说明](#图标说明)
- [其他](#其他)
  - [示例1-懒加载树一般使用方式](#示例1)
  - [示例2-懒加载树后端参数返回数据结构](#示例2)
  - [示例3-懒加载树后端搜索](#示例3)
  - [示例4-懒加载树复选框勾选嵌套](#示例4)
  - [未完成功能](#未完成功能)

---

### 简述
> 该组件树调用文件为 `treeBox.vue`；分为 `懒加载树`、`搜索树` 两个部分(搜索树未完成)
> 
> 内置新增、修改、删除、移动、刷新功能按钮组(未交互)
>
> 配有勾选、单击、双击、拖拽等事件
>
> 获取选中事件、设置选中事件、刷新等方法

> 配有 2 种搜索模式:
>
> 1. 后端搜索（查询数据库）
> 2. 前端搜索（查询已加载的数据）
>
> `注意：`暂定该机构树唯一值为 `nodeKey`,由 节点id(`id`) + 节点类型(`tierType`) 拼接而成。

---

### 传参
|属性|名称|类型|默认值|可选值|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|
|treeId|树的唯一键值|String|`nodeKey`|-|该值为机构树唯一索引|
|lazyTreeApi|懒加载数据请求接口|Function|-|-|入参为组件传参|
|lazyTreeSearchApi|懒加载树搜索数据请求接口|Function|-|-|入参为组件传参|
|lazyTreeCheckApi|懒加载树复选框加载数据请求接口|Function|-|-|入参为组件传参|
|filterNode|数据过滤函数|Function|默认过滤节点名|-|入参为节点data; 出参`true`显示;`false`隐藏|
|disabledTreeItem|复选框禁用方法函数|Function|-|-|返回true该节点复选框禁用|
|customizeClassName|自定义节点ClassName|Function|-|-|返回`Array` \|\| `String`，用于标识当前节点|
|expandLevel|默认展开层级|Number|1|-|0为不展开|
|showSlotIcon|是否一直显示插槽图标|Boolean|`false`|`true` / `false`|false时需要点击该节点才会显示插槽图标|
|btnToggle|按钮栏开关|Boolean|`false`|`true` / `false`|-|
|treeLazyToggle|懒加载树开关|Boolean|`false`|`true` / `false`|-|
|checkboxToggle|复选框开关|Boolean|`false`|`true` / `false`|-|
|checkRecursionToggle|复选框递归获取数据开关|Boolean|`true`|`true` / `false`|checkboxToggle开启有效，勾选节点时默认自动获取节点下数据|
|searchType|搜索栏类型|String|`''`|`search` / `filter`|`search`使用搜索树 <br> `filter`使用懒加载内置搜索|
|currentNodeKey|当前选中的节点|String \|\| Number|`''`|-|为nodeKey|
|handleNodeKeys|进行高亮的项的nodeKeys|Array|`[]`|-|-|
|checkboxDisabled|复选框禁用项|Object|`{type: null, data: [] }`|type为`nodeKey`时,data为禁用项的 nodeKey 组成的数组<br>type为`tierType`时,data为禁用项的类型 org、loc、equ、res |`checkboxToggle` 为 `false` 时无效|
|treeType|机构树类型|Number \|\| String|`0`|`0`: 机构-重点部位-设备-资源树<br>`1`: 机构-重点部位-设备树<br>`2`: 机构-重点部位树<br>`3`: 机构树|-|
|customizeQuery|自定义查询字段|Object|`{keywords:[], params:{}}`|`keywords`-动态参数，即可根据接口返回值改变的参数，为该参数的 `key`<br>`params`-静态参数,即与参数接口返回参数无关的特殊参数|`动态参数`暂不支持深层嵌套|
|verifyLastNode|自定义最后子节点校验|Object|`{}`|`key`-为校验`data`中的 `key`<br>`value`-为`data[key]`所对应的`value`|`默认根据节点tierType和treeType`<br>校验一致时，视为最后子节点|
|iconToggle|节点右侧图标|Boolean|`false`|`true` / `false`|`废弃`|
|iconList|按钮显示项|Array|`[]`|`edit`-编辑<br>`collection`-收藏<br>`info`-详情<br>`poll`-轮询<br>`expand`-一键展开|`废弃`|
|iconNum|图标数量|Object|`{ equ: 0, res: 0 }`|-|`废弃`<br> `equ`-设备级图标数量<br>`res`-资源级图标数量|
|defaultExpandedKeys|默认展开的节点数组|Array|`[]`|-|-|
---

### 事件
|事件|名称|参数|参数范围|参数说明|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|
|clickNode|点击节点返回节点Node信息|node|-|当前节点tree data|-|
|clickData|点击节点返回节点data信息|data|-|当前节点入参 data|-|
|rootId|返回根节点id|id|-|根节点id|-|
|onceClick|单击返回信息|data<br>node|-|当前节点tree data<br>当前节点入参 data|-|
|dblclick|双击返回信息|data<br>node|-|当前节点tree data<br>当前节点入参 data|-|
|checkclick|复选框点击返回信息|data<br>node<br>status|-|当树所选中的所有项的 data<br>当前节点入参 data<br>树目前的选中状态对象 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性'|-|
|nodeDrop|拖拽完成时返回信息|data1<br>data2<br>position|-<br>-<br>before-之前、after-之后、inner-内|当前节点入参 data<br>被影响节点入参 data<br>位置|allowDrop 为 true 时可用|
|nodeDragEnd|拖拽结束时（可能未成功）触发的事件|data1<br>data2<br>position|-<br>-<br>before-之前、after-之后、inner-内|当前节点入参 data<br>被影响节点入参 data<br>位置|allowDrop 为 true 时可用|
|nodeExpand|节点展开/闭合 返回信息|data<br>node<br>self<br>status|-<br>-<br>-<br>open-展开 close-合并|当前节点入参 data<br>当前节点tree data<br>节点组件本身<br>状态|-|
|refreshPrompt|返回内置刷新状态|status|success-成功<br>error-失败|刷新状态|`废弃`|
|searchVal|返回搜索input框值|searchVal|-|搜索内容|-|
---

### 方法
|方法|名称|入参|出参|备注|
|:-:|:-:|:-:|:-:|:-:|
|refresh|手动刷新|-|data|`1`-成功<br>`0`-失败|
|insideRefreshs|程序刷新|-|-|-|
|filterText|手动过滤方法|需要过滤的字符串|-|需要配合`filterNode`方法使用|
|getCheckedNodes|获取【懒加载树】的选中项|`leafOnly`<br>`includeHalfChecked`|返回目前被选中的节点所组成的数组|1.是否只是叶子节点，默认值为 false<br>2.是否包含半选节点，默认值为 false|
|setCheckedKeys|设置【懒加载树】的选中项|所有选中项`nodeKey`所组成的数组|-|-|
|setCurrentKey|设置某个节点的当前选中状态|选中项`nodeKey`|-|`nodekey` 待被选节点的 `nodekey`，若为 null 则取消当前高亮的节点|
|getNode|获取机构树当前节点node|所有选中项`nodeKey`|`node`|-|
---

### 插槽

> `由于需求的原因，暂时仅定义了一个匿名插槽`

|名称|说明|备注|
|:-:|:-:|:-|
|-|树节点右侧小图标，参数为 { node, data }|1、需要自行判断何时显示<br>2、需要自行计算左侧文字信息长度|

`备注`：在节点上使用了 `name` 属性，`name` 表明当前节点数据的类型

使用方式为在样式中以此当时 `.treeInfo[name='equ']` 进行筛选

---
### 图标说明 icon
> ORG(机构)`(1-9)`：总行-`1`；一级分行-`2`；二级-`3`；二+级机构（支行/分理处）-`4`；
> 
> LOC(重点部位)`(10-19; LOC_10-LOC_19)`：营业网点-`10`；金库-`11`;计算机房-`12`;办公楼-`13`;自助银行-`14`;自助设备-`15`;自助银亭-`16`;私人银行-`17`;保险箱库-`18`;档案室-`19`;远程监控中心-`'LOC_10'`;5G智能银行-`'LOC_11'`；财富中心-`'LOC_12'`;其他重点部位-`'LOC_13'`
>
> 录像机`(20-29)`：NVR-`20`；预留到-`29`
>
> 摄像头`(30-39)`：枪机-`30`；红外枪击-`31`；半球-`32`；快球-`33`；全景-`34`；球机-`35`；针孔-`36`；智能IPC-`37`; 视频主机设备-`38`
>
> 报警`(40-49)`：报警主机-`40`； 报警输入-`41`； 报警输出-`42`；探测器-`43`;门磁-`44`;紧急按钮-`45`
>
> 门禁`(50-59)`：门禁主机设备-`50`；门禁通道-`51`；读头-`52`，输入-`53`；闸机-`54`
> 
> 文件夹`(60-69)`：默认-`60`；
>
> 对讲主机设备`(70-79)`：对讲主机设备-`70`；对讲通道-`71`;
>
> 防护舱主机设备`(80-89)`: 防护舱主机设备-`80`; 防护舱通道-`81`; 
>
> 停车场`(90-99)`:停车场-`90`; 出入口通道-`91`;
>
> 拼控解码一体机`(100-109)`:拼控解码一体机-`100`;解码器通道-`101`;本地电视输入通道-`102`
>
> 火灾报警主机`(110-119)`:火灾报警主机-`110`;手动报警按钮-`111`;感烟探测器-`112`;感温探测器-`113`;总线隔离模块-`114`;
>
> 喷淋泵`(120-129)`:喷淋泵-`120`;末端排水装置-`121`;末端试水装置-`122`;湿式报警阀组-`123`;
>
> 室内消火栓`(130-139)`:室内消火栓-`130`;消防水池-`131`;高位水箱-`132`;稳压泵-`133`;消火栓泵-`134`;
>
> 防排烟系统`(140-149)`:防排烟系统-`140`
>
> 固定消防炮灭火系统`(150-159)`:固定消防炮灭火系统-`150`
>
> 系统主机`(160-169)`:系统主机-`160`
>
> 防火分隔设施`(170-179)`:防火分隔设施-`170`
>
> 电气火灾监测系统`(180-189)`:电气火灾监测系统-`180`
>
> NB独立探测器`(190-199)`:NB独立探测器-`190`
>
>



### 其他

#### 示例1

> 懒加载树一般使用方式

```
<template>
  <treeBox :lazyTreeApi="getTreeApi" searchType="filter" treeLazyToggle iconToggle>
    <template slot-scope="{data, node}">
      <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconEqu(data)" @click="clickIcon(data, node)"></i>
      <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconEqu(data)"></i>
      <i class="iconfont icon-polling" title="开启轮询" v-if="iconList.includes('poll') && filterIconEqu(data)"></i>
      <i class="iconfont icon-collection" title="快速收藏" v-if="iconList.includes('collection') && filterIconRes(data)"></i>
      <i class="iconfont icon-biaoqian" title="详细信息" v-if="iconList.includes('info') && (filterIconRes(data) || filterIconEqu(data))"></i>
    </template>
  </treeBox>
  ...
</template>

<script>
  import treeBox from '@src/components/tree/treeBox'
  import { getTreeApi } from '@src/http/***/***.api.js'
  export default {
    data() {
      return {
        iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
        ...
    },
    methods: {
      // 机构树懒加载数据接口
      getTreeApi(params) {
        return getTreeApi(params)
      },
      // 设备按钮开关
      filterIconEqu(val) {
        return val.tierType === 'equ'
      },
      // 资源按钮开关
      filterIconRes(val) {
        return val.tierType === 'res'
      },
      // 点击图标
      clickIcon(data,node) {
        console.log(data,node)
      }
      ...
  }
</script>

<style lang="less" scoped>
  ...
    /deep/ .treeBox .treeInfo{
      &[name="equ"] span.treeText {
        max-width: calc(~'100% - 94px');
      }
      &[name="res"] span.treeText {
        max-width: calc(~'100% - 58px');
      }
    }
    ...
</style>
```

#### 示例2

> 懒加载树后端参数返回数据结构  
> `注意：`有效数据在根节点下的`data`对象中。仅获取`data`对象下第一个字段所包的数据。该数据类型为 `Array`

1. 根节点

```
{
  "code": 0,
  "message": "success",
  "data": {
    "nodes": [
      {
        "isRoot": true,
        "tierType": "org",
        "order": 1,
        "icon": 1,
        "id": "1",
        "name": "陕西省建设银行",
        "nodeKey": "1org",
        ...
      }
    ]
  }
}
```

2. 其他节点

```
{
  "code": 0,
  "message": "success",
  "data": {
    "nodes": [
      {
        "isRoot": false,
        "tierType": "org",
        "order": 2,
        "icon": 1,
        "id": "2",
        "status": "online",
        "name": "西安市建设银行",
        "nodeKey": "2org",
        ...
      },
      ...
    ]
  }
}
```

3. 无参数时

```
{
  "code": 0,
  "message": "success",
  "data": {
    "nodes": []
  }
}
```

#### 示例3

> 后端搜索入参
```
{
  "type": 1, // 机构树类型 见 treeType
  "search": "", // 搜索内容
  ... // 自定义传参 见 customizeQuery
}
```

> 后端搜索出参(`一般情况`)
```
{
  "code": 0, 
  "message": "success", 
  "data": {
    "nodes": [
      {
        "id": "1", 
        "name": "陕西省中心银行", 
        "order": 1, 
        "status": "online", 
        "icon": 1, 
        "tierType": "org", 
        "nodeKey": "1org",
        ...
      },
      ...
    ]
  }
}
```

> 后端搜索出参(`数据嵌套`)
```
{
  "code": 0, 
  "message": "success", 
  "data": {
    "nodes": [
      {
        "id": "1", 
        "name": "陕西省中心银行", 
        "order": 1, 
        "status": "online", 
        "icon": 1, 
        "tierType": "org", 
        "nodeKey": "1org",
        "children": [ // 子级标识字段
          {
            "id": "2", 
            "name": "西安市分行", 
            "order": 5, 
            "status": "online", 
            "icon": 1, 
            "tierType": "org", 
            "nodeKey": "2org",
            ...
          },
          ...
        ],
        ...
      },
      ...
    ]
  }
}
```

#### 示例4

> 懒加载树`勾选递归查询`  
> `注意`: 该功能必须开启勾选模式

> 入参
```
{
  "type": 1, // 机构树类型 见 treeType
  "id": "", // 节点id 同懒加载树 id配置方式 oId-机构id kpId-重点部位id dId-设备id
  ... // 自定义传参 见 customizeQuery
}
```

> 出参
```
{
  "code": 0, 
  "message": "success", 
  "data": {
    "tree": [
      {
        "id": "1", 
        "name": "陕西省中心银行", 
        "order": 1, 
        "status": "online", 
        "icon": 1, 
        "tierType": "org", 
        "nodeKey": "1org",
        "children": [ // 子级标识字段
          {
            "id": "2", 
            "name": "西安市分行", 
            "order": 5, 
            "status": "online", 
            "icon": 1, 
            "tierType": "org", 
            "nodeKey": "2org",
            ...
          },
          ...
        ],
        ...
      },
      ...
    ]
  }
}
```

---

#### 未完成功能
1. 搜索机构树及配套功能
1. 按钮栏事件及配套功能
1. 懒加载树 `判定节点能否被拖拽` 业务逻辑
1. 懒加载树 `判定节点能否被放置` 业务逻辑
1. 懒加载树 `左侧图标及title` 业务逻辑 及 图标库的引入
1. 懒加载树 `节点样式配置` 业务逻辑
1. 懒加载树 `节点文字title` 业务逻辑
1. 懒加载树 `节点` 离线样式、高亮样式 确定
1. 树组件 `公共功能` 抽取

