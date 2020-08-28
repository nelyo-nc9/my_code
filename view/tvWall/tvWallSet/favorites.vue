<template>
  <div class="layWrap_organization">
    <treeBox :getDataApi="getfavoritesApi"
             searchType="filter"
             :allowDrop="'true'"
             :showCreate="showCreate"
             @nodeDragEnd="nodeDrop"
             treeLazyToggle
             iconToggle>
    </treeBox>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import treeBox from '@src/components/collectTree'
import { getfavoritesApi } from '../../../http/tvWall/tvWallmanage.api'
export default {
  components: {
    treeBox
  },
  data() {
    return {
      showCreate: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    ...mapMutations(['SET_NODEDROP_DATA', 'SET_NODEDROP_STATE', 'SET_NODEDROP_WHERE']),
    getfavoritesApi(params) {
      return getfavoritesApi(params)
    },
    // 拖拽
    nodeDrop(node) {
      node['type'] = 1
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
  margin-left: 10px;
  width: 270px;
}
.layWrap_organization /deep/ .el-input__suffix {
  right: 60px;
  top: 1px;
}
</style>
