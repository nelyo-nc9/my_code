<template>
  <div class="host-org-tree">
    <div class="search-box">
      <el-input v-model="filterText"
                placeholder="请输入..."
                suffix-icon="el-icon-search"
                size="mini"></el-input>
    </div>
    <el-tree :data="data"
             :props="defaultProps"
             @node-click="handleNodeClick"
             :filter-node-method="filterNode"
             ref="tree"></el-tree>
  </div>
</template>

<script>
export default {
  name: 'OrgTree',
  data() {
    return {
      data: [
        {
          label: '河北省分行',
          children: [
            {
              label: '石家庄分行',
              children: [
                {
                  label: '创业路支行',
                  children: [
                    {
                      label: '创业路营业网点',
                      children: [
                        {
                          label: '报警控制主机'
                        }
                      ]
                    }
                  ]
                },
                {
                  label: '丰收路支行',
                  children: [
                    {
                      label: '丰收路办公楼',
                      children: [
                        {
                          label: '振动光纤报警主机'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              label: '保定分行',
              children: [
                {
                  label: '融汇支行'
                },
                {
                  label: '五四西路支行'
                },
                {
                  label: '五四中路支行'
                }
              ]
            }
          ]
        }
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
  }
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
