<template>
  <div class="relevance-common">
    <div class="transfer-box">
      <div class="tab-content">
        <div class="left-tree-box">
          <div style="text-align:center;">源</div>
          <div class="tree-box">
            <treeBox ref="treebox"
              :lazyTreeApi="getTreeApi"
              searchType="filter"
              :treeType="treeType"
              :disabledTreeItem="disabledTreeItem"
              treeLazyToggle iconToggle checkboxToggle
              :customizeQuery="customizeQuery">
            </treeBox>
          </div>
        </div>
        <div class="icon-box">
          <i class="el-icon-right" @click="addLinks"></i>
          <i class="el-icon-back" @click="reduceLinks"></i>
        </div>
        <div style="flex:1">
          <div style="text-align:center;">目标</div>
          <div class="tree-box">
            <el-tree ref="righttree" node-key="id" :data="targetData" :props="treeProps" @node-click="handleNodeClick" :current-node-key="currentNodeKey" highlight-current>
              <div class="treeInfo" slot-scope="{ node, data }"                >
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
      <div style="text-align:center;">
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
    customizeQuery: { // 请求源数据时候的树需要的自定义参数
      type: Object,
      default: () => {
        return {}
      }
    },
    gplotData: { // 拓扑图需要的数据
      type: Array,
      default: () => {
        return []
      }
    },
    targetData: { // 目标树的数据
      type: Array,
      default: () => {
        return []
      }
    },
    treeProps: { // 目标树的默认展示条件，参考element tree api
      type: Object,
      default: () => {
        return {
          label: 'name'
        }
      }
    },
    disabledTreeItem: { // 源树的禁用条件
      type: Function,
      required: true
    }
  },
  components: {
    Gplot,
    treeBox
  },
  data () {
    return {
      treeType: 0
    }
  },
  computed: {
    currentNodeKey() {
      return (this.targetData[0] && this.targetData[0].id) || ''
    }
  },
  methods: {
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    handleNodeClick(data, node) { // 目标树点击事件
      this.$emit('handleNodeClick', data, node)
    },
    save() {
      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    },
    addLinks() { // 右移
      this.$emit('addLinks')
    },
    reduceLinks() { // 左移
      this.$emit('reduceLinks')
    }
  }
}

</script>
<style lang='less' scoped>
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
        border: 1px solid #E1E1E1;
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
  }
}
</style>
