<template>
  <div class="layWrap_organization">
    <treeBox :lazyTreeApi="getTreeApi"
             searchType="search"
             :treeType="treeType"
             :lazyTreeSearchApi="getLazyTreeSearchApi"
             :allowDrop="'true'"
             :customizeQuery="customizeQuery"
             @nodeDragEnd="nodeDrop"
             treeLazyToggle
             iconToggle>
    </treeBox>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, searchTreeApi } from '../../../http/tvWall/tvWallmanage.api'
export default {
  components: {
    treeBox
  },
  data() {
    return {
      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0',
          channelType: '1'
        }
      },
      treeType: 0
    }
  },
  computed: {},
  watch: {},
  methods: {
    ...mapMutations(['SET_NODEDROP_DATA', 'SET_NODEDROP_STATE', 'SET_NODEDROP_WHERE']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 7,
        key: params.search
      }
      return searchTreeApi(params)
    },
    // 拖拽
    nodeDrop(node) {
      console.log(node)
      // debugger
      this.SET_NODEDROP_STATE(true)
      this.SET_NODEDROP_DATA(node)
      this.SET_NODEDROP_WHERE('资源')
    }
  },
  created() { }
}
</script>
<style scoped lang="less">
.layWrap_organization {
  padding-top: 10px;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
}
.layWrap_organization /deep/ .el-tree {
  background: #f2f2f2;
}
.layWrap_organization /deep/ .el-input--mini .el-input__inner {
  width: 270px;
  margin-left: 10px;
}
.layWrap_organization /deep/ .el-input__suffix {
  right: 60px;
  top: 1px;
}
</style>
