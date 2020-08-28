<!--
 * @Author: your name
 * @Date: 2020-06-12 11:17:37
 * @LastEditTime: 2020-06-22 08:30:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement.vue
-->
<template>
<!-- 服务器管理 -->
  <div class="server-management-box">
    <div class="menu-left">
      <el-menu :default-active="defaultMenu" class="el-menu-vertical-demo" :unique-opened="true" @select="changeTab">
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.label}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="val in item.items">
                <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
                <el-submenu v-else :key="val.index" :index="val.index">
                  <template>
                    <span slot="title">{{val.title}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-for="v in val.items" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="content-right">
      <div class="creat" v-if="defaultMenu === 'creat'">
        <!-- 查询组件 -->
        <ServerManageCreat :defaultMenu="defaultMenu" @changeMenu="changeMenu" ref="Creat"></ServerManageCreat>
      </div>
      <div class="list" v-if="defaultMenu === 'list'">
        <ServerManageList :defaultMenu="defaultMenu" @changeMenu="changeMenu" ref="List"></ServerManageList>
      </div>
      <div class="search" v-if="defaultMenu === 'search'">
        <ServerManageSearch ref="Search"></ServerManageSearch>
      </div>
      <div class="list" v-if="defaultMenu === 'storageList'">
        <storageServerManageList ref="storageServerList"></storageServerManageList>
      </div>
      <div class="search" v-if="defaultMenu === 'storageSearch'">
        <storageServerManageSearch ref="storageServerSearch"></storageServerManageSearch>
      </div>
    </div>
  </div>
</template>

<script>
import ServerManageCreat from './pages/ServerManageCreat.vue'
import ServerManageList from './pages/ServerManageList.vue'
import ServerManageSearch from './pages/ServerManageSearch.vue'
import storageServerManageList from './pages/storageServerManageList.vue'
import storageServerManageSearch from './pages/storageServerManageSearch'
export default {
  name: 'serverManagement',
  components: {
    ServerManageCreat,
    ServerManageList,
    ServerManageSearch,
    storageServerManageList,
    storageServerManageSearch
  },
  data() {
    return {
      // 默认导航栏
      defaultMenu: 'list',
      menus: [
        {
          index: 'serverManagement',
          label: '服务器管理',
          items: [
            {
              index: 'creat',
              title: '新建'
            },
            {
              index: 'list',
              title: '列表'
            },
            {
              index: 'search',
              title: '查询'
            }
          ]
        },
        {
          index: ' storageServerManagement',
          label: '存储服务器管理',
          items: [
            {
              index: 'storageList',
              title: '列表'
            },
            {
              index: 'storageSearch',
              title: '查询'
            }
          ]
        }
      ]
    }
  },
  created() {
  },
  methods: {
    changeTab(index) {
      this.defaultMenu = index
      if (index === 'creat') {
        this.$nextTick(() => {
          this.$refs.Creat.getTreeApiFuc()
        })
      }
    },
    changeMenu(menu) {
      if (menu === 'edit') {
        this.defaultMenu = 'creat'
        return
      }
      this.defaultMenu = menu
    }
  }
}
</script>

<style lang="less" scoped>
.server-management-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  overflow-x: hidden;
  justify-content: flex-start;
  .menu-left {
    height: calc(~'100% - 25px');
    padding: 5px 10px;
    background: #F5F5F5;
    .arrow {
      font-size: 14px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    .el-menu-vertical-demo {
      width: 200px;
    }
    /deep/ .el-menu {
      border-right: none;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .content-right {
    width: 100%;
    min-width: 1600px;
    height: 100%;
    padding: 5px 0;
    .creat,
    .list,
    .search {
      height: 100%;
    }
  }
}
</style>
