<template>
  <div class="treeSearch">
    <el-tree ref="tree" :node-key="nodeKey" :data="treeData" highlight-current default-expand-all :indent="10" :props="treeProps" :show-checkbox="checkboxToggle" :current-node-key="currentNodeKey" :allow-drag="allowDrag" :allow-drop="allowDrop" :filter-node-method="filterNode" @node-click="nodeClick" @check="handleCheckChange" @node-drop="nodeDrop" @node-drag-end="nodeDragEnd" @node-expand="(data, node, self) => {nodeExpand(data, node, self, 'open')}" @node-collapse="(data, node, self) => {nodeExpand(data, node, self, 'close')}">
      <div class="treeInfo" :name="data.tierType" :class="[nodeStyle(data), setCustomizeClassName(data)]" @dblclick="dblclick(node, data)" slot-scope="{ node, data }">
        <!-- 左侧图标 -->
        <span class="treeIcon leftIcon">
          <i class="iconfont" :class="[getNodeIcon(data).class]" :title="getNodeIcon(data).title"></i>
        </span>
        <!-- 文字 -->
        <span class="treeText" :title="data | filterTitle">{{ node.label }}</span>
        <span class="treeIcon rightIcon" v-show="isActive === node || showSlotIcon">
          <slot :data="data" :node="node"></slot>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script>
import treeComm from './treeComm'
import { getNodeIcon } from './iconMethods.js'

export default {
  name: 'treeSearch',
  mixins: [treeComm],
  props: {
    showSlotIcon: Boolean, // 是否一直显示插槽图标
    filterNode: Function, // 数据过滤函数
    disabledTreeItem: Function, // 复选框禁用方法函数
    customizeClassName: Function, // 节点自定义类名
    treeId: String, // 树的唯一键值
    getApi: Function, // 请求api
    searchVal: String, // 搜索内容
    checkboxToggle: Boolean, // 是否显示复选框
    currentNodeKey: [String, Number], // 当前选中的节点的nodeKey
    handleNodeKeys: Array, // 外部传入的nodeKeys
    checkboxDisabled: Object, // 复选框禁用项
    treeType: [String, Number], // 机构树类型
    verifyLastNode: Object // 自定义最后子节点校验
  },
  created() {
    this.nodeKey = this.treeId
    // this.getTreeData = this.$lodash.throttle(this._getTreeData, 1000)
  },
  data() {
    return {
      // 机构树节点基本配置
      treeProps: {
        children: 'children', // 指定子树为节点对象的某个属性值  类型：string, function(data, node)
        label: 'name', // 指定节点标签为节点对象的某个属性值   类型：string, function(data, node)
        isLeaf: data => this.isLeafTreeItem(data),
        disabled: data => this.disabledTreeItem(data) // 是否禁用
      },
      treeData: [], // 机构树数据
      nodeKey: '', // 树的唯一键值key
      initdata: {}, // 返回的数据
      isActive: {}, // 点中的节点
      timer: null // 解决双击时触发单击方法2次的问题
    }
  },
  watch: {
    checkboxToggle() {
      // 时时改变 复选框时，bug
      this.nodeKey = ''
      setTimeout(() => {
        this.nodeKey = 'nodeKey'
      })
    },
    isActive(val) {
      this.$emit('clickNode', this.$lodash.cloneDeep(val))
    },
    initdata(val) {
      this.$emit('clickData', this.$lodash.cloneDeep(val))
    }
    // searchVal(val) {
    //   this.getTreeData(val)
    // }
  },
  methods: {
    // 后端数据请求 封装
    async _getTreeData(val) {
      if (!val) { return }
      const param = {
        type: this.treeType,
        search: val // 搜索内容
      }
      let params = []
      try {
        if (!this.getApi) {
          const massage = '没有接口'
          throw massage
        } else {
          await this.getApi(param)
            .then(res => {
              if (res.data.code !== 0) {
                throw res.data.message
              } else {
                const k = Object.keys(res.data.data)
                if (!k.length || !Array.isArray(res.data.data[k[0]]) || !res.data.data[k[0]].length) {
                  params = []
                } else {
                  params = this.$lodash.cloneDeep(res.data.data[k[0]])
                  this.$emit('rootId', (params[0] && params[0].id) || '')
                }
              }
            })
            .catch(err => {
              throw err
            })
        }
      } catch (error) {
        console.log('error', error)
      }
      this.treeData = this.$lodash.cloneDeep(params)
    },
    // 单击
    nodeClick(data, node) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log('传递给 data 属性的数组中该节点所对应的对象', data)
        // console.log('当前节点的 Node 对象', node)
        this.initdata = JSON.parse(JSON.stringify(data))
        this.isActive = node
        this.$emit('nodeClick', data, node)
      }, 300)
    },
    // 双击
    dblclick(node, data) {
      clearTimeout(this.timer)
      // console.log('node', node)
      // console.log('data', data)
      this.initdata = JSON.parse(JSON.stringify(data))
      this.isActive = node
      this.$emit('dblclick', data, node)
    },
    // 复选框点击
    handleCheckChange(data, status) {
      // 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
      // console.log('传递给 data 属性的数组中该节点所对应的对象', data, status)
      // console.log('树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性', status)
      this.$emit('checkclick', JSON.parse(JSON.stringify(status.checkedNodes)), JSON.parse(JSON.stringify(data)), JSON.parse(JSON.stringify(status)))
    },
    // 拖拽结束时（可能未成功）触发的事件
    nodeDragEnd(node1, node2, position, event) {
      // console.log('被拖拽节点对应的 Node', node1)
      // console.log('结束拖拽时最后进入的节点（可能为空）', node2)
      // console.log('被拖拽节点的放置位置', position)
      // console.log('event', event)
      this.$emit('nodeDragEnd', JSON.parse(JSON.stringify(node1.data)), node2 && JSON.parse(JSON.stringify(node2.data)), position)
    },
    // 拖拽 allowDrop 为 true 时可用
    nodeDrop(node1, node2, position, event) {
      // console.log('被拖拽节点对应的 Node', node1)
      // console.log('结束拖拽时最后进入的节点', node2)
      // console.log('被拖拽节点的放置位置', position)
      // console.log('event', event)
      this.$emit('nodeDrop', JSON.parse(JSON.stringify(node1.data)), JSON.parse(JSON.stringify(node2.data)), position)
    },
    // 判定节点能否被拖拽
    allowDrag(node) {
      return true
    },
    // 判定节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      // console.log('draggingNode', '放置在目标节点前', draggingNode)
      // console.log('dropNode', '插入至目标节点', dropNode)
      // console.log('type', '放置在目标节点后', type)
      return false
    },
    // 机构树自身搜索
    filterNodes(value, data, node) { // 此函数废弃
      // console.log('要搜索的数据', value)
      // console.log('当前节点的数据', data)
      // console.log('当前节点的 Node 对象', node)
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    // 节点展开/闭合
    nodeExpand(value, data, node, status) {
      this.$emit('nodeExpand', value, data, node, status)
    },
    // 左侧图标及title
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    // 节点样式配置
    nodeStyle(data) {
      if (['org', 'loc'].includes(data.tierType)) { return '' } // 过滤非资源节点
      if (this.handleNodeKeys.length && this.handleNodeKeys.includes(data[this.nodeKey])) {
        return 'highlight'
      } else {
        return data.status // online/offline
      }
    },
    /**
     * 设置节点自定义className
     * @param { Object } data 节点data
     * @param { Function } customizeClassName 自定义节点className方法
     * @returns { String } 返回className
     */
    setCustomizeClassName(data) {
      if (typeof this.customizeClassName !== 'function') {
        return ''
      }
      const res = this.customizeClassName(data)
      if (Array.isArray(res) && res.length) {
        return res.join(' ')
      }
      if ((res instanceof String || typeof res === 'string') && res) {
        return res
      }
      return ''
    },
    /**
     * 获取选中项data
     * @param leafOnly 是否只是叶子节点
     * @param includeHalfChecked 是否包含半选节点
     * @returns 返回目前被选中的节点所组成的数组
     */
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    /**
     * 获取选中项data
     * @returns 返回目前被选中的节点所组成的数组
     */
    setCheckedKeys(nodeKeys) {
      return this.$refs.tree.setCheckedKeys(nodeKeys)
    },
    /**
     * 设置某个节点的当前选中状态，(nodekey) 待被选节点的 nodekey，若为 null 则取消当前高亮的节点
     * @params nodekey 选中节点的 nodekey
     */
    setCurrentKey(nodeKey) {
      return this.$refs.tree.setCurrentKey(nodeKey)
    },
    // 复选框禁用配置
    // disabledTreeItem(data) {
    //   if ([this.nodeKey, 'tierType'].includes(this.checkboxDisabled.type)) {
    //     return this.checkboxDisabled.data.includes(data[this.checkboxDisabled.type])
    //   }
    //   return false
    // },
    // 最后子节点校验
    isLeafTreeItem(data) {
      let status = false
      switch (this.treeType % 10) {
        case 0:
          status = data.tierType === 'res'
          break
        case 1:
          status = data.tierType === 'equ'
          break
        case 2:
          status = data.tierType === 'loc'
          break
        case 3:
          status = data.tierType === 'res'
          break
        default:
          break
      }
      // 自定义最后子节点校验
      if (this.$lodash.isPlainObject(this.verifyLastNode)) {
        for (let e in this.verifyLastNode) {
          if (data.hasOwnProperty(e) && !status) {
            status = data[e] === this.verifyLastNode[e]
          }
        }
      }
      return status
    },
    // 获取当前节点node
    getNode(id) {
      return this.$refs.tree.getNode(id)
    }
  },
  filters: {
    // 过滤节点名称
    filterTitle(val) {
      return val.name
    }
  }
}
</script>

<style lang="less" scoped>
.treeSearch {
  /* 树的背景颜色 */
  background: transparent;
  /deep/ .el-tree {
    .is-current > .el-tree-node__content .treeInfo .treeText,
    .el-tree-node__content:hover {
      .treeText {
        color: #2d72d3;
      }
      .rightIcon i {
        color: #758ebb;
      }
    }
    .rightIcon > i:hover {
      color: #2d72d3 !important;
    }
  }
  // 机构树内容
  .treeInfo {
    width: calc(~'100% - 24px');
    height: 100%;
    line-height: 40px;
    position: relative;
    /deep/ .treeText {
      max-width: calc(~'100% - 20px');
    }
    // 机构树图标
    & > .treeIcon {
      // 机构树左图标
      // &.leftIcon {}
      // 机构树右图标
      &.rightIcon {
        position: absolute;
        right: 2px;
        // & > i:hover {
        //   color: #2d72d3;
        // }
      }
    }
    // 机构树文字信息
    .treeText {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
    // 高亮
    &.highlight {
      & > .leftIcon > i,
      .treeText {
        color: #2d72d3;
      }
    }
    // 离线
    &.offline {
      & > .leftIcon > i,
      .treeText {
        color: #c0c4cc;
      }
    }
  }
}
</style>
