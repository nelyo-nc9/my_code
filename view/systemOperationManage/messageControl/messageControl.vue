<!--
 * @Author: your name
 * @Date: 2020-06-13 14:36:09
 * @LastEditTime: 2020-06-13 14:39:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\messageControl.vue
-->
<template>
<!-- 短信管理 -->
  <div class="message-control-box">
    <div class="menu-left">
      <el-menu :default-active="defaultMenu" class="el-menu-vertical-demo" :unique-opened="false" @select="changeTab">
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
      <div v-if="defaultMenu === 'creat'">
        <MessageControlCreat @changeMenu="changeMenu"></MessageControlCreat>
      </div>
      <div class="list" v-if="defaultMenu === 'list'">
        <MessageControlList @changeMenu="changeMenu"></MessageControlList>
      </div>
      <div class="search" v-if="defaultMenu === 'search'">
        <MessageControlSearch></MessageControlSearch>
      </div>
    </div>
  </div>
</template>

<script>
import MessageControlCreat from './pages/MessageControlCreat'
import MessageControlSearch from './pages/MessageControlSearch'
import MessageControlList from './pages/MessageControlList'
export default {
  name: 'messageControl',
  components: {
    MessageControlSearch,
    MessageControlList,
    MessageControlCreat
  },
  data() {
    return {
      // 默认导航栏
      defaultMenu: 'list',
      menus: [
        {
          index: 'serverManagement',
          label: '短信管理',
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
        }
      ]
    }
  },
  created() {
  },
  methods: {
    changeTab(index) {
      this.defaultMenu = index
    },
    changeMenu(menu) {
      this.defaultMenu = menu
    }
  }
}
</script>

<style lang="less" scoped>
.message-control-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
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
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
    .list,
    .search {
      height: 100%;
    }
  }
}
</style>
