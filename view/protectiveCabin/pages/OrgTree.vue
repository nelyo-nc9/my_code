<template>
  <div class="host-org-tree">
    <div class="search-box">
      <el-input v-model="filterText" placeholder="请输入..." suffix-icon="el-icon-search" size="mini"></el-input>
    </div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree"></el-tree>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'OrgTree',
  data() {
    return {
      data: [
       
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
 
  methods: {


    handleNodeClick(data) {
      console.log(data)
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    }
  },
  
}
</script>

<style lang="less" scoped>
.host-org-tree {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  .search-box {
    margin: 5px;
  }
}
</style>
