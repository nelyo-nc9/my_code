<template>
  <div class="collectTree">
    <!-- 搜索栏 -->
    <el-input v-model="searchVal" placeholder="请输入内容" @input="inputSearch" size="mini" autofocus :maxlength="255">
      <i class="el-icon-search el-input__icon" slot="suffix" style="cursor: pointer;" @click="inputSearch"></i>
    </el-input>
    <!-- 树 -->
    <div class="tree">
      <el-tree ref="tree" :data="treeData" highlight-current :indent="10" :props="treeProps" :show-checkbox="checkboxToggle" @node-click="nodeClick" :filter-node-method="filterNode" draggable :allow-drop="allowDrop" :allow-drag="allowDrag" @node-drop="nodeDrop" @node-drag-end="nodeDragEnd" @node-expand="(data, node, self) => {nodeExpand(data, node, self, 'open')}" @node-collapse="(data, node, self) => {nodeExpand(data, node, self, 'close')}">
        <div class="treeInfo" :name="data.tierType" :class="[nodeStyle(data)]" @dblclick="dblclick(node, data)" slot-scope="{ node, data }">
          <!-- 左侧图标 -->
          <span class="treeIcon leftIcon">
            <i class="iconfont" :class="[getNodeIcon(data).class]" :title="getNodeIcon(data).title"></i>
          </span>
          <!-- 文字 -->
          <span class="treeText" :style="{width: isActive === node && data.tierType === 'node' ? 'calc(100% - 100px)' : 'calc(100% - 35px)'}" :title="data | filterTitle">{{ node.label }}</span>
          <span class="treeIcon rightIcon" v-show="isActive === node">
            <slot :data="data" :node="node"></slot>
          </span>
        </div>
      </el-tree>
      <!-- 新建项 -->
      <div class="setUp" v-if="showCreate">
        <el-button type="text" @click="setUpClick" v-if="setUpToggel"><i class="el-icon-circle-plus-outline"></i>新建一个收藏夹</el-button>
        <el-input ref="input" size="mini" v-model="setUpVal" autofocus :maxlength="255" v-else suffix-icon="el-icon-check" @blur="blurSelect" :disabled="disabledInput"></el-input>
        <span class="error-box" v-if="groupError">{{groupError}}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-throw-literal */
import { getNodeIcon } from './tree/iconMethods.js'

export default {
  name: 'collectTree',
  props: {
    getDataApi: { // 获取收藏夹列表
      type: Function
    },
    postDataApi: { // 创建收藏夹列表
      type: Function
    },
    searchDataApi: { // 后端搜索收藏夹列表
      type: Function
    },
    showCreate: { // 是否显示新建项
      type: Boolean,
      default: true
    },
    checkboxToggle: Boolean // 是否显示复选框
  },
  data() {
    return {
      // 机构树节点基本配置
      treeProps: {
        children: 'children', // 指定子树为节点对象的某个属性值  类型：string, function(data, node)
        label: 'combinationName' // 指定节点标签为节点对象的某个属性值   类型：string, function(data, node)
      },
      searchVal: '', // 搜索内容
      setUpVal: '', // 新增节点名称
      disabledInput: false, // 新增节点按钮 是否禁用
      refreshPrompt: -1, // 刷新提示 0-失败;1-成功
      setUpToggel: true, // 添加收藏夹 开关
      treeData: [], // 机构树数据
      initdata: {}, // 返回的数据
      isActive: {}, // 点中的节点
      timer: null, // 解决双击时触发单击方法2次的问题
      groupError: ''
    }
  },
  created() {
    this.inputSearch = this.$lodash.debounce(this._inputSearch, 800, { leading: true })
    this.getTreeData(this.searchVal)
  },
  watch: {
    isActive(val) {
      this.$emit('clickNode', this.$lodash.cloneDeep(val))
    },
    initdata(val) {
      this.$emit('clickData', this.$lodash.cloneDeep(val))
    }
  },
  methods: {
    // 获取
    getTreeData(keyword = '') {
      try {
        this.treeData = []
        if (!this.getDataApi) {
          throw '没有获取收藏夹接口'
        }
        this.getDataApi({ keyword })
          .then(res => {
            if (!res.data.code) {
              this.refreshPrompt = 1
              let params = []
              res['data']['data']['results'].forEach(e => {
                let children = []
                if (e.channelWithHostList) {
                  for (let i = 0; i < e.channelWithHostList.length; i++) {
                    let data = e.channelWithHostList[i]
                    children.push({
                      deviceName: data.deviceName,
                      tierType: 'res',
                      status: data.status,
                      id: data.channelId,
                      keyPartName: data.keyPartName,
                      orgName: data.orgName,
                      channel: data.serise,
                      dId: data.deviceId,
                      devIp: data.ip,
                      devCport: data.cport,
                      devDport: data.dport,
                      streamType: data.stream,
                      channelName: data.channelName,
                      name: data.channelName,
                      combinationName: data.channelName + '/' + data.deviceName + '/' + data.keyPartName + '/' + data.orgName,
                      deviceType: data.deviceType
                    })
                  }
                }
                params.push({
                  combinationName: e.name,
                  name: e.name,
                  isPolling: e.isPolling,
                  pollingTime: e.pollingTime,
                  owner: e.owner,
                  tierType: 'node',
                  id: e.id,
                  children
                })
              })
              this.treeData = params
            } else {
              throw res.data.message
            }
          })
          .catch(err => {
            this.refreshPrompt = 0
            console.log(err)
            this.$messageError('获取收藏夹失败，请稍后尝试')
          })
      } catch (error) {
        throw error
      }
    },
    // 收藏夹树 搜索
    _inputSearch(val) {
      this.$refs.tree.filter(this.searchVal)
    },
    // 机构树自身过滤
    filterNode(value, data, node) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
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
    // 刷新
    async refresh() {
      this.refreshPrompt = -1
      await this.getTreeData(this.keyword)
      return new Promise(resolve => {
        const t = setInterval(() => {
          if (this.refreshPrompt + 1) {
            clearInterval(t)
            resolve(this.refreshPrompt)
          }
        }, 200)
      })
    },
    // 添加一个收藏夹
    setUpClick() {
      this.setUpToggel = !this.setUpToggel
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 添加一个收藏夹 失去焦点时
    blurSelect() {
      if (!this.setUpVal.toString()) {
        this.setUpToggel = !this.setUpToggel
        return
      }
      this.validateStr64(this.setUpVal)
      if (this.groupError) {
        return
      }
      this.disabledInput = true
      const params = {
        name: this.setUpVal + '',
        isPolling: false,
        pollingTime: 0
      }
      if (!this.postDataApi) {
        throw '没有创建收藏夹接口'
      }
      this.postDataApi(params)
        .then(res => {
          if (!res.data.code) {
            this.setUpToggel = !this.setUpToggel
            this.setUpVal = ''
            this.treeData.push({
              ...params,
              owner: [],
              tierType: 'node',
              children: []
            })
            this.$messageSuccess('添加收藏夹成功')
            this.refresh()
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
          console.log(err)
          this.$messageError('创建收藏夹失败，请稍后尝试')
        })
        .then(() => {
          this.disabledInput = false
        })
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
      return node.data.tierType === 'res'
    },
    // 判定节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      // console.log('draggingNode', '放置在目标节点前', draggingNode)
      // console.log('dropNode', '插入至目标节点', dropNode)
      // console.log('type', '放置在目标节点后', type)
      return false
    },
    // 节点样式配置
    nodeStyle(data) {
      if (data.tierType !== 'res') { return '' } // 过滤非资源节点
      return data.status // online/offline
    },
    // 左侧图标及title
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    // 节点展开/闭合
    nodeExpand(value, data, node, status) {
      this.$emit('nodeExpand', value, data, node, status)
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
    // 新增校验
    validateStr64(value) {
      if (value.trim().length) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        this.groupError = strlen > 128 ? '名称为0-128个字符或0-64中文' : ''
      } else {
        this.groupError = '不能为空'
      }
    }
  },
  filters: {
    // 过滤节点名称
    filterTitle(val) {
      let arr = val.combinationName.split('/')
      let str = ''
      for (let i = arr.length - 1; i >= 0; i--) {
        if (i === 0) {
          str += arr[i]
        } else {
          str += arr[i] + '/'
        }
      }
      return str
    }
  }
}
</script>

<style lang="less" scope>
.collectTree {
  height: 100%;
  width: 100%;
  .el-input {
    margin-bottom: 16px;
  }
  .tree {
    /* 树的背景颜色 */
    height: calc(~'100% - 44px');
    overflow-y: auto;
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
        max-width: calc(~'100% - 35px');
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
    .setUp {
      margin-left: 16px;
      i {
        padding-right: 5px;
        color: #409eff;
      }
      .error-box {
        font-size: 12px;
        color: #f56c6c;
      }
    }
  }
}
</style>
