<template>
  <div class="relevance-common">
    <div class="transfer-box">
      <div class="tab-content">
        <div class="left-tree-box">
          <div style="text-align:center;">源</div>
          <div class="tree-box">
            <treeBox
              ref="treebox"
              :lazyTreeApi="getTreeApi"
              searchType="filter"
              :treeType="treeType"
              :disabledTreeItem="disabledTreeItem"
              treeLazyToggle
              iconToggle
              checkboxToggle
              :customizeQuery="customizeQuery"
            ></treeBox>
          </div>
        </div>
        <div class="icon-box">
          <i class="el-icon-right" @click="addLinks"></i>
          <i class="el-icon-back" @click="reduceLinks"></i>
        </div>
        <div style="flex:1">
          <div style="text-align:center;">目标</div>
          <div class="tree-box">
            <el-tree
              v-if="reload && targetData.length"
              ref="righttree"
              node-key="id"
              accordion
              auto-expand-parent
              :data="targetData"
              :props="treeProps"
              @node-click="handleNodeClick"
              :default-expanded-keys="defaultExpendNode"
              :current-node-key="currentNodeKey"
              highlight-current
            >
              <div class="treeInfo" slot-scope="{ node, data }">
                <span class="treeText" :title="node.label">{{ node.label }}</span>
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:24px">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="gplot">
      <p @click="print" class="printFn" style="float:right;font-size:14px">
        <i class="el-icon-printer" style="font-size:16px"></i>
        打印
      </p>

      <div id="gplotPrint" style="text-align:center;">
        <gplot :gplotData="gplotData" ref="gplot"></gplot>
      </div>
    </div>
  </div>
</template>

<script>
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import Gplot from './gplot'

export default {
  name: 'RelevanceComm',
  props: {
    customizeQuery: {
      // 请求源数据时候的树需要的自定义参数
      type: Object,
      default: () => {
        return {}
      }
    },
    gplotData: {
      // 拓扑图需要的数据
      type: Array,
      default: () => {
        return []
      }
    },
    targetData: {
      // 目标树的数据
      type: Array,
      default: () => {
        return []
      }
    },
    treeProps: {
      // 目标树的默认展示条件，参考element tree api
      type: Object,
      default: () => {
        return {
          label: 'name'
        }
      }
    },
    disabledTreeItem: {
      // 源树的禁用条件
      type: Function,
      required: true
    }
  },
  components: {
    Gplot,
    treeBox
  },
  data() {
    return {
      selectedRootNode: '',
      selectedRootData: '',
      reload: true,
      treeType: 0,
      nextSelectedId: '',
      currentNodeKey: '',
      defaultExpendNode: []
    }
  },
  watch: {
    targetData: {
      handler() {
        if (this.nextSelectedId == '' && this.targetData[0]) {
          this.currentNodeKey = this.targetData[0].id
          this.nextSelectedId = this.targetData[0].id
          this.defaultExpendNode = [this.targetData[0].id]
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // currentNodeKey() {
    //   console.log(this.targetData[0])
    //   return (this.targetData[0] && this.targetData[0].id) || ''
    // }
  },
  created() {},
  mounted() {},
  methods: {
    print() {
      printJS({ printable: 'gplotPrint', type: 'html' })
    },
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    handleNodeClick(data, node) {
      // 目标树点击事件
      //点击后的根节点node和data
      if (node.level == 1) {
        this.selectedRootNode = node
        this.selectedRootData = data
      } else {
        this.selectedRootNode = node.parent
        this.selectedRootData = node.parent.data
      }
      this.$emit('handleNodeClick', data, node)
      // 判断是否需要重新绘制图
      if (node.level == 2 && node.parent.data.id != this.nextSelectedId) {
        this.$emit('handleNodeClick', this.selectedRootData, node)
        this.$emit('createGplot', this.selectedRootData)
      }
      // 判断左移或者右移后需要高亮选中的根节点
      if (node.parent.data instanceof Array) {
        for (let i = 0; i < node.parent.data.length; i++) {
          let itm = node.parent.data[i]
          if (data.id == itm.id) {
            this.nextSelectedId = itm.id
            return
          } else if (i == node.parent.data.length - 1) {
            this.nextSelectedId = node.parent.data[0].id
          }
        }
      } else {
        this.nextSelectedId = node.parent.data.id
      }
    },
    save() {
      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    },
    addLinks() {
      // 右移
      //当前选中节点和默认展开的节点
      this.currentNodeKey = this.nextSelectedId
      this.defaultExpendNode = [this.nextSelectedId]
      // 选中子级别情况下左移回执当前选项的根节点
      if (this.selectedRootData != '' && this.selectedRootNode != '') {
        this.handleNodeClick(this.selectedRootData, this.selectedRootNode)
      }
      this.$emit('addLinks')
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    reduceLinks() {
      // 左移
      this.$emit('reduceLinks')
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
      this.currentNodeKey = this.nextSelectedId
      this.defaultExpendNode = [this.nextSelectedId]
      if (this.selectedRootData != '' && this.selectedRootNode != '') {
        this.$emit('handleNodeClick', this.selectedRootData, this.selectedRootNode)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.relevance-common {
  width: 100%;
  height: 100%;
  display: flex;
  .transfer-box {
    width: 600px;
    height: 100%;
    padding: 10px;
    border: 1px solid #333;
    .tab-content {
      width: 100%;
      height: 100%;
      display: flex;
      .left-tree-box {
        flex: 1;
      }
      .tree-box {
        width: 276px;
        height: 500px;
        overflow-y: auto;
        border: 1px solid #e1e1e1;
        .treeInfo {
          width: calc(~'100% - 24px');
          .treeText {
            width: 100%;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
          }
        }
      }
      .icon-box {
        width: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        i {
          cursor: pointer;
        }
      }
    }
  }
  .gplot {
    width: calc(~'100% - 600px');
    margin-left: 10px;
    border: 1px solid #333;
    padding: 10px;
    position: relative;
    .printFn {
      position: absolute;
      z-index: 100;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>
