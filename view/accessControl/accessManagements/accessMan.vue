<template>
  <div class="video-config-box">
    <div class="menu-left">
      <el-menu
        :default-active="combinationName"
        class="el-menu-vertical-demo"
        :unique-opened="false"
        @select="changeTab"
      >
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.label}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="val in item.items"
                :key="val.index"
                :index="val.index"
              >{{val.title}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="tree">
      <div class="treeLeft">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" suffix-icon="el-icon-search"></el-input>
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        ></el-tree>
      </div>
    </div>
    <div class="content-right">
      <tabMenu :tabList="tabList" />
      <component :is="parentComponent" :child="child"></component>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
    tabMenu: () => import('./components/tabMenu'),
    accessList: () => import('./accessList/index'),
    accessCreate: () => import('./accessCreate/index')
    // accessImport: () => import('./accessImport/index')
  },
  data() {
    return {
      tabList: ['智慧安防'],
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      menus: [
        {
          index: 'accessList',
          label: '门禁平台配置',
          items: [
            {
              index: 'accessList-Create',
              title: '新建'
            },
            {
              index: 'accessList-List',
              title: '列表'
            },
            {
              index: 'accessList-Import',
              title: '导入'
            }
          ]
        },
        {
          index: 'accessCreate',
          label: '门禁设备配置',
          items: [
            {
              index: 'CameraRelate-List',
              title: '列表'
            },
            {
              index: 'CameraRelate-Search',
              title: '查询'
            }
          ]
        },
        {
          index: 'accessImport',
          label: '门禁主机关联配置',
          items: [
            {
              index: 'VideoHostIO-List',
              title: '列表'
            },
            {
              index: 'VideoHostIO-Search',
              title: '查询'
            }
          ]
        },
        {
          index: 'VideoHostRelate',
          label: '门禁通道关联配置',
          items: [
            {
              index: 'VideoHostRelate-List',
              title: '列表'
            },
            {
              index: 'VideoHostRelate-Search',
              title: '查询'
            }
          ]
        },
        {
          index: 'VideoHostRelates',
          label: '报警输入关联配置',
          items: [
            {
              index: 'VideoHostRelate-Lists',
              title: '列表'
            },
            {
              index: 'VideoHostRelate-Searchs',
              title: '查询'
            }
          ]
        }
      ],
      parentComponent: 'accessList',
      // '', //默认显示的动态组件
      combinationName: 'access-List',
      child: 'List' //默认显示列表页
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeTab(index) {
      console.log(index)
      this.combinationName = index
      this.parentComponent = index.split('-')[0]

      this.child = index.split('-')[1]
      console.log(this.parentComponent, this.child)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  watch: {
    filterText(searchVal) {
      this.$refs.tree.filter(searchVal)
    }
  },
  mounted() {
    this.tabList.push(this.$route.meta.menu)
  }
}
</script>
<style lang="less" scope>
.video-config-box {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    width: 200px;
    height: 100vh;
    padding: 5px 10px;
    /deep/ .el-menu {
      height: 100%;
    }
    /deep/ .el-collapse-item__header {
      background: #eee;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 1px;
    }
    /deep/ .el-submenu {
      .el-menu-item {
        min-width: 170px;
      }
    }
    .menu-nav {
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      background: #f5f4f4;
      border-bottom: 1px solid #fff;
    }
  }
  .tree {
    border-right: 1px solid #e6e6e6;
    .treeLeft {
      width: 250px;
    }
  }
  .content-right {
    width: calc(~'100% - 452px');
    height: 100%;
    padding: 10px;
    border: 1px solid red;
  }
}
</style>