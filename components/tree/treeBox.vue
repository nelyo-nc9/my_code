<template>
  <div class="treeBox">
    <!-- 按钮栏 -->
    <div class="btnGroup" v-if="btnToggle">
      <el-button-group>
        <el-button class="btn" title="添加" size="mini"><i class="iconfont icon-add"></i></el-button>
        <el-button class="btn" title="编辑" size="mini"><i class="iconfont icon-edit1"></i></el-button>
        <el-button class="btn" title="删除" size="mini"><i class="iconfont icon-delete"></i></el-button>
        <el-button class="btn" title="上移" size="mini"><i class="iconfont icon-move-up"></i></el-button>
        <el-button class="btn" title="下移" size="mini"><i class="iconfont icon-move-down"></i></el-button>
        <el-button class="btn" title="刷新" size="mini"><i class="iconfont icon-shuaxin"></i></el-button>
      </el-button-group>
    </div>
    <!-- 输入框 -->
    <div class="input" v-if="searchType">
      <el-input placeholder="请输入内容" v-model="searchVal" size="mini" autofocus :maxlength="64" @input="inputSearch">
        <i class="el-icon-search el-input__icon" slot="suffix" style="cursor: pointer;" @click="inputSearch"></i>
      </el-input>
    </div>
    <!-- 机构树-懒加载 -->
    <div class="tree" :style="{height: treeHeight}" v-if="treeLazyToggle" v-show="!searchModalToggle">
      <treeLazy ref="lazyTree" :default-checked-keys="defaultCheckedKeys" :getApi="lazyTreeApi" :defaultExpandedKeys="defaultExpandedKeys" :showSlotIcon="showSlotIcon" :disabledTreeItem="disabledTreeItem" :expandLevel="expandLevel" :filterNode="filterNode" :checkApi="lazyTreeCheckApi" :currentNodeKey="currentNodeKey" :handleNodeKeys="handleNodeKeys" :verifyLastNode="verifyLastNode" :checkboxToggle="checkboxToggle" :checkRecursionToggle="checkRecursionToggle" :checkboxDisabled="checkboxDisabled" :treeType="treeType" :treeId="treeId" :customizeQuery="customizeQuery"  :customizeClassName="customizeClassName" @clickNode="clickNode" @clickData="clickData" @rootId="rootId" @nodeClick="nodeClick" @dblclick="dblclick" @checkclick="checkclick" @nodeDrop="nodeDrop" @nodeExpand="nodeExpand" @nodeDragEnd="nodeDragEnd" :iconList="iconList" :iconNum="iconNum" iconToggle>
        <template slot-scope="{data, node}">
          <slot :data="data" :node="node"></slot>
        </template>
      </treeLazy>
    </div>
    <!-- 机构树-搜索树 -->
    <div class="tree" :style="{height: treeHeight}" v-if="searchTreeToggle" v-show="searchModalToggle">
      <treeSearch ref="searchTree" :getApi="lazyTreeSearchApi" :showSlotIcon="showSlotIcon" :searchVal="searchVal" :disabledTreeItem="disabledTreeItem" :filterNode="filterNode" :currentNodeKey="currentNodeKey" :handleNodeKeys="handleNodeKeys" :verifyLastNode="verifyLastNode" :checkboxToggle="checkboxToggle" :checkboxDisabled="checkboxDisabled" :treeType="treeType" :treeId="treeId" :customizeClassName="customizeClassName" @clickNode="clickNode" @clickData="clickData" @rootId="rootId" @nodeClick="nodeClick" @dblclick="dblclick" @checkclick="checkclick" @nodeDrop="nodeDrop" @nodeExpand="nodeExpand" @nodeDragEnd="nodeDragEnd">
        <template slot-scope="{data, node}">
          <slot :data="data" :node="node"></slot>
        </template>
      </treeSearch>
    </div>
  </div>
</template>

<script>
import treeLazy from './treeLazy'
import treeSearch from './treeSearch'
import treeComm from './treeComm'

export default {
  name: 'treeBox',
  mixins: [treeComm],
  created() {
    this.refresh = this.$lodash.throttle(this._refresh, 1000)
    this.insideRefreshs = this.$lodash.throttle(this._insideRefreshs, 1000)
    this.inputSearch = this.$lodash.debounce(this._inputSearch, 800)
  },
  components: {
    treeLazy,
    treeSearch
  },
  props: {
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    defaultExpandedKeys: { // 默认展开的节点数组
      type: Array,
      default: () => []
    },
    showSlotIcon: { // 是否一直显示插槽图标
      type: Boolean,
      default: false
    },
    // 默认展开层级
    expandLevel: {
      type: Number,
      default: 1
    },
    // 过滤方法
    filterNode: {
      type: Function,
      default: (value, data, node) => {
        if (!value) {
          return true
        }
        return data.name.indexOf(value) !== -1
      }
    },
    // 懒加载数据请求接口
    lazyTreeApi: {
      type: Function
    },
    // 懒加载树搜索数据请求接口
    lazyTreeSearchApi: {
      type: Function
    },
    // 懒加载树复选框加载数据请求接口
    lazyTreeCheckApi: {
      type: Function
    },
    // 树的唯一键值
    treeId: {
      type: String,
      default: 'nodeKey'
    },
    // 按钮栏 开关
    btnToggle: {
      type: Boolean,
      default: false
    },
    // 搜索栏类型 开关
    searchType: {
      type: String,
      default: '' // filter-内置搜索;search-后端过滤
    },
    // 懒加载树 开关
    treeLazyToggle: {
      type: Boolean,
      default: false
    },
    // 复选框 开关
    checkboxToggle: {
      type: Boolean,
      default: false
    },
    // 复选框递归获取数据 开关
    checkRecursionToggle: {
      type: Boolean,
      default: true
    },
    // 双向数据绑定（选中特定的节点）
    currentNodeKey: {
      type: [String, Number],
      default: ''
    },
    // 机构树类型
    treeType: {
      type: [String, Number],
      default: 0 // 0: 机构-重点部位-设备-资源树、1: 机构-重点部位-设备树、2: 机构-重点部位树、3: 机构树
    },
    // 外部传入的nodekeys
    handleNodeKeys: {
      type: Array,
      default: () => []
    },
    // 复选框禁用项
    checkboxDisabled: {
      type: Object,
      default: () => {
        return {
          type: null,
          data: []
        }
      }
    },
    // 自定义查询字段
    customizeQuery: {
      type: Object,
      default: () => {
        return {
          keywords: [], // 关键字
          params: {} // 静态参数
        }
      }
    },
    // 自定义最后子节点校验
    verifyLastNode: {
      type: Object,
      default: () => {}
    },
    // 图标 开关---废弃
    iconToggle: {
      type: Boolean,
      default: false
    },
    // 按钮显示项---废弃
    iconList: {
      type: Array,
      default: () => [] // edit-编辑,collection-收藏,info-详情,poll-轮询,expand-一键展开
    },
    // 图标数量---废弃
    iconNum: {
      type: Object,
      default: () => {
        return {
          equ: 0, // 设备级图标
          res: 0 // 资源级图标
        }
      }
    },
    // 复选框禁用方法
    disabledTreeItem: {
      type: Function,
      default: function(data) {
        if ([this.nodeKey, 'tierType'].includes(this.checkboxDisabled.type)) {
          return this.checkboxDisabled.data.includes(data[this.checkboxDisabled.type])
        }
        return false
      }
    },
    // 节点自定义类名
    customizeClassName: {
      type: Function,
      default: function(data) {
        return []
      }
    }
  },
  data() {
    return {
      searchVal: '' // 搜索栏参数
    }
  },
  computed: {
    // 计算机构树高度
    treeHeight: function() {
      let h = 0
      if (this.searchType) {
        h += 32
      }
      if (this.btnToggle) {
        h += 34
      }
      return `calc(100% - ${h}px)`
    },
    // 搜索树 开关
    searchTreeToggle: function() {
      return this.searchType === 'search'
    },
    // 搜索模式
    searchModalToggle: function() {
      return this.searchTreeToggle && this.searchVal.length
    },
    // 自动切换ref指向
    refTree: function() {
      return this.searchModalToggle ? this.$refs.searchTree : this.$refs.lazyTree
    }
  },
  methods: {
    // 点击 input 图标
    _inputSearch() {
      if (this.searchType === 'search') {
        this.$refs.searchTree._getTreeData(this.searchVal)
      } else if (this.searchType === 'filter') {
        this.filterText(this.searchVal)
      }
      this.$emit('searchVal', this.searchVal)
    },
    /**
     * 点击节点返回节点Node信息
     * @params node 当前节点tree data
     */
    clickNode(node) {
      this.$emit('clickNode', node)
    },
    /**
     * 点击节点返回节点data信息
     * @params data 当前节点入参 data
     */
    clickData(data) {
      this.$emit('clickData', data)
    },
    /**
     * 返回根节点id
     * @params id 根节点id
     */
    rootId(id) {
      this.$emit('rootId', id)
    },
    /**
     * 返回内置刷新状态
     * @params status 刷新状态 success-成功;error-失败
     */
    // refreshPrompt(status) {
    //   this.$emit('refreshPrompt', status)
    // },
    /**
     * 单击返回信息
     * @params data 当前节点入参 data
     * @params node 当前节点tree data
     */
    nodeClick(data, node) {
      this.$emit('onceClick', data, node)
    },
    /**
     * 双击返回信息
     * @params data 当前节点入参 data
     * @params node 当前节点tree data
     */
    dblclick(data, node) {
      this.$emit('dblclick', data, node)
    },
    /**
     * 复选框点击返回信息
     * @params data 当前节点入参 data
     * @params node 当前节点tree data
     * @params status 树目前的选中状态对象 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性'
     */
    checkclick(node, data, status) {
      this.$emit('checkclick', data, node, status)
    },
    /**
     * 拖拽结束时（可能未成功）触发的事件
     * allowDrop 为 true 时可用
     * @params data1 当前节点入参 data
     * @params data2 被影响节点入参 data
     * @params position 位置 before、after、inner
     */
    nodeDragEnd(data1, data2, position) {
      this.$emit('nodeDragEnd', data1, data2, position)
    },
    /**
     * 拖拽完成时返回信息
     * allowDrop 为 true 时可用
     * @params data1 当前节点入参 data
     * @params data2 被影响节点入参 data
     * @params position 位置 before、after、inner
     */
    nodeDrop(data1, data2, position) {
      this.$emit('nodeDrop', data1, data2, position)
    },
    /**
     * 节点展开/闭合 返回信息
     * @params data 当前节点入参 data
     * @params node 当前节点tree data
     * @params self 节点组件本身
     * @params status 状态 open-展开;close-合并
     */
    nodeExpand(data, node, self, status) {
      this.$emit('nodeExpand', data, node, self, status)
    },
    // 刷新
    _refresh() {
      this.searchVal = ''
      return this.$refs.lazyTree.refresh()
    },
    // 内置刷新
    _insideRefreshs() {
      if (this.searchModalToggle) {
        // searchtree
        this._inputSearch()
      } else {
        // lazytree
        this.$refs.lazyTree.insideRefreshs()
      }
    },
    /**
     * 获取【懒加载树】的选中事件
     * @param leafOnly 是否只是叶子节点
     * @param includeHalfChecked 是否包含半选节点
     * @returns 返回目前被选中的节点所组成的数组
     */
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      // return this.$refs.lazyTree.getCheckedNodes(leafOnly, includeHalfChecked)
      return this.refTree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    /**
     * 设置【懒加载树】的选中事件
     * @params nodekeys 勾选节点的 nodekey 的数组
     */
    setCheckedKeys(nodekeys) {
      this.$refs.lazyTree.setCheckedKeys(nodekeys)
      if (this.searchTreeToggle) {
        this.$refs.searchTree.setCheckedKeys(nodekeys)
      }
    },
    /**
     * 设置某个节点的当前选中状态，(nodekey) 待被选节点的 nodekey，若为 null 则取消当前高亮的节点
     * @params nodekey 选中节点的 nodekey
     */
    setCurrentKey(nodeKey) {
      return this.refTree.setCurrentKey(nodeKey)
    },
    /**
     * 获取机构树节点 node 数据
     * @params id 机构树 nodeKey
     * @returns 机构树 Node
     */
    getNode(id) {
      // return this.$refs.lazyTree.getNode(id)
      return this.refTree.getNode(id)
    },
    /**
     * 需要过滤的参数
     * @param { String } val
     */
    filterText(val) {
      this.$refs.lazyTree.filterText(val)
    }
  }
}
</script>

<style lang="less" scoped>
.treeBox {
  height: 100%;
  width: 100%;
  position: relative;
  padding: 4px;
  // 按钮栏
  .btnGroup {
    margin-bottom: 4px;
    width: 100%;
    .el-button-group {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
    }
    /* 按钮样式*/
    .btn {
      // background-color: #3c5073;
      // border-color: #5676a9;
      // color: #fff;
      border-width: 1px;
      border-style: solid;
      flex: auto;
      width: 100%;
      .iconfont {
        font-size: 14px;
      }
      &:hover {
        background: #4699f9;
      }
      &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
  // 输入框
  .input {
    margin-bottom: 4px;
  }
  // 机构树
  .tree {
    overflow: auto;
  }
}
</style>
