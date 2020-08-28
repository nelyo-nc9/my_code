<template>
  <div class="left-tree">
      <Tree ref="tree" :lazyTreeApi="getTree" searchType="filter" :customizeQuery="customizeQuery" :checkRecursionToggle="false" :defaultExpandedKeys="defaultExpandedKeys"
      @checkclick="handleCheck" @clickData="clickData" @dblclick="checkEmit" treeLazyToggle :checkboxToggle="true"></Tree>
      <!--  -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Tree from '@src/components/tree/treeBox'
import { orgTreeApi, orgLazyTreeApi, videoTreeApi, videoLazyTreeApi } from '@src/http/systemMaintain/roleManage.api.js'
export default {
  name: 'PowerTree',
  components: { Tree },
  props: ['defaultExpandedKeys'],
  data() {
    return {
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      }
    }
  },
  computed: {
    ...mapState('roleManage', ['currentId', 'roleTitle', 'resourceData', 'lastCheckOver', 'setLeft', 'lastCheckedKeys', 'lastHalfCheckedKeys', 'openKey'])
  },
  created() {
    if (this.roleTitle !== '编辑') {
      this.setState({ type: 'SET_STATE', key: 'setLeft', value: [] })
    }
  },
  mounted() {
    // console.log(this.$refs.tree, this.$refs.tree.$refs.lazyTree, this.$refs.tree.$refs.lazyTree.$refs.tree)

    // this.$refs.tree.$refs.lazyTree.$refs.tree.defaultExpandedKeys = this.setLeft[1]
    // this.setCheck()
    // if (this.setLeft[0] && this.setLeft[0].length > 0) {
    //   this.setCheckedKeys([...this.setLeft[0]])
    // }
  },
  methods: {
    ...mapActions('roleManage', ['setState']),
    ...mapMutations('roleManage', ['SET_STATE']),
    getTree(params) {
      let {currentId} = this
      if (currentId === '1') {
        params.type = 2
        return this.wrapTree(orgTreeApi, params)
      } else {
        this.customizeQuery.params.subSystem = currentId.slice(2)
        return this.wrapTree(videoTreeApi, params)
      }
    },
    getLazyTree(params) {
      let {currentId} = this
      if (currentId === '1') {
        params.type = 2
        return orgLazyTreeApi(params)
      } else {
        this.customizeQuery.params.subSystem = currentId.slice(2)
        this.customizeQuery.params.isRecursion = '0'
        return videoLazyTreeApi(params)
      }
    },
    wrapTree(callback, params) {
      return new Promise((resolve, reject) => {
        callback(params).then(res => {
          resolve(res)
        }).then(_ => {
          // console.log(this.currentId, this.openKey)
          this.setCheck()
          // if (this.setLeft[0] && this.setLeft[0].length > 0) {
          //   this.setCheckedKeys([...this.setLeft[0]])
          // }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取当前节点node
    getNode(id) {
      return this.$refs.tree.getNode(id)
    },
    setCheck() {
      // console.log(this.currentId, this.openKey)
      if (this.setLeft.length > 0) {
        // console.log(this.currentId, this.openKey)
        if (this.currentId === this.openKey) {
          setTimeout(() => {
            if (this.setLeft[1]) { this.$refs.tree.$refs.lazyTree.$refs.tree.defaultExpandedKeys = this.setLeft[1] }
          }, 0)
          // if (this.setLeft[1].includes('org')) {
          //   this.$refs.tree.$refs.lazyTree.$refs.tree.defaultExpandedKeys = this.setLeft[0]
          // }
          this.setCheckedKeys([...this.setLeft[0]])
        }
      }
    },
    checkEmit(val) {
      console.log(val)
    },
    // leftTree
    handleCheck() {
      this.setState({ type: 'SET_STATE', key: 'checkNode', value: [...arguments].filter(item => item.checkedNodes)[0] })
      // console.log(arguments, [...arguments].filter(item => item.checkedNodes))
    },
    flagArr(a, b) {
      let c = [...a, ...b]
      let d = new Set(c)
      let e = Array.from(d)
      let f = [...e.filter(_ => !a.includes(_)), ...e.filter(_ => !b.includes(_))]
      return f
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
      if (data && data.serial) {
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
      if (data && data.isRoot) {
        // console.log(data.nodeKey)
        this.setState({ type: 'SET_STATE', key: 'rootNodeKey', value: data.nodeKey })
      }
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
      // console.log(nodekeys)
      return this.$refs.tree.setCheckedKeys(nodekeys)
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.left-tree {
  width: 100%;
  height: 100%;
}
</style>
