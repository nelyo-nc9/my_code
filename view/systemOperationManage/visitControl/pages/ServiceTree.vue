<template>
  <div class="tree-main">
    <div class="search-box">
      <el-input
        v-model="keyWord"
        placeholder="请输入..."
        suffix-icon="el-icon-search"></el-input>
    </div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
export default {
  name: 'ServiceTree',
  data() {
    return {
      data: [
        {
          label: '河北省分行',
          children: [
            {
              label: '保定分行',
              children: [
                {
                  label: 'xxx金库'
                }, {
                  label: '融汇支行'
                }, {
                  label: '城建支行',
                  children: [
                    {
                      label: 'xxx自助银行',
                      children: [
                        {
                          label: '硬盘录像机1-填钞区域'
                        }
                      ]
                    }
                  ]
                }, {
                  label: '东风中路支行'
                }, {
                  label: '高开区支行'
                }, {
                  label: '定州支行',
                  children: [
                    {
                      label: 'xxx保管箱',
                      children: [{
                        label: '硬盘录像机1-保管箱室'
                      }]
                    }, {
                      label: 'xxx自助银行'
                    }, {
                      label: '住房城建支行'
                    }, {
                      label: '中兴路分理处',
                      children: [{
                        label: 'xxx自助银亭'
                      }]
                    }, {
                      label: '西城分理处'
                    }
                  ]
                }, {
                  label: '涿州物探支行'
                }, {
                  label: '徐水支行'
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
      keyWord: ''
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.tree-main {
  width: 280px;
  height: 100%;
  border: 1px solid #ddd;
  .search-box {
    width: 80%;
    height: 40px;
    line-height: 40px;
    margin: 5px auto;
  }
}
</style>
