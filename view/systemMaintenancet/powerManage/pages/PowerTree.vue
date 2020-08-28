<template>
  <div class="tree-main">
    <Tree ref="tree" :lazyTreeApi="getTree" searchType="filter" @clickData="clickData" @dblclick="checkEmit" @onceClick="onceClick"  treeLazyToggle></Tree>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tree from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/basicInfoManage/orgManage.api'
export default {
  name: 'PowerTree',
  components: { Tree },
  data() {
    return {}
  },
  methods: {
    ...mapActions('powerManage', ['setState']),
    getTree(params) {
      return getTreeApi(params)
    },
    checkEmit(val) {
      console.log(val)
    },
    onceClick(node) {
      console.log(node, 'node')
      // this.oid = node.id
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
      if (data.serial && data.serial) {
        this.setState({ type: 'SET_STATE', key: 'orgId', value: data.serial })
        this.setState({ type: 'SET_STATE', key: 'orgName', value: data.name })
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
      // if (data && !this.nodeData.id) { // 返回机构树加载根节点信息
      //   this.nodeData = data
      // }
    },
    /**
     * 获取【懒加载树】的选中事件
     * @param leafOnly 是否只是叶子节点
     * @param includeHalfChecked 是否包含半选节点
     * @returns 返回目前被选中的节点所组成的数组
     */
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    /**
     * 设置【懒加载树】的选中事件
     * @params nodekeys 勾选节点的 nodekey 的数组
     */
    setCheckedKeys(nodekeys) {
      console.log(nodekeys)
      this.$refs.tree.setCheckedKeys(nodekeys)
    }
  }
}
</script>

<style lang="less" scoped>
.tree-main {
  width: 280px;
  height: 100%;
  border: 1px solid #f7f7f7;
}
</style>
