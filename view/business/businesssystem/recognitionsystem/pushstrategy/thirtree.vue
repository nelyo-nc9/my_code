<template>
  <div>
    <treeBox
      :lazyTreeApi="getTree"
      :customizeQuery="customizeQuery"
      ref="tree"
      :treeType="0"
      searchType="filter"
      @checkclick="onceClick"
      treeLazyToggle
      :checkboxToggle="true"
      :checkRecursionToggle="false"
      iconToggle
    ></treeBox>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/businessLinkage/business.api.js'
export default {
  components: {
    treeBox
  },
  data() {
    return {
      customizeQuery: {
        params: {
          subSystem: '1',
          channelType: '1',
          isRecursion: '0',
          // resClass: 206,
          clickdata: []
        }
      }
    }
  },
  methods: {
    // 机构数
    getTree(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      console.log(data, node)
      let nodeData = []
      node.map((item, index) => {
        if (item.devIp) {
          nodeData.push(item)
        }
      })
      this.clickdata = nodeData
      this.$emit('clickdata', this.clickdata)
    }
  }
}
</script>

<style></style>
