<!--
 * @Author: your name
 * @Date: 2020-06-12 17:52:46
 * @LastEditTime: 2020-06-24 21:58:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\preventDrowsy.vue
-->
<template>
<!-- 防瞌睡 -->
  <div class="prevent-drowsy-box">
    <div class="content-left">
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
      <div class="list" v-if="defaultMenu === 'logList'">
        <PreventDrowsyLogList></PreventDrowsyLogList>
      </div>
      <div v-if="defaultMenu === 'configuration'">
        <PreventDrowsyRemindConfiguration></PreventDrowsyRemindConfiguration>
      </div>
      <div class="search" v-if="defaultMenu === 'logSearch'">
        <PreventDrowsyLogSearch></PreventDrowsyLogSearch>
      </div>
    </div>
  </div>
</template>

<script>
import PreventDrowsyLogList from './pages/PreventDrowsyLogList.vue'
import PreventDrowsyRemindConfiguration from './pages/PreventDrowsyRemindConfiguration.vue'
import PreventDrowsyLogSearch from './pages/PreventDrowsyLogSearch.vue'
export default {
  name: 'preventDrowsy',
  components: {
    PreventDrowsyLogList,
    PreventDrowsyLogSearch,
    PreventDrowsyRemindConfiguration
  },
  data() {
    return {
      // 默认导航栏
      defaultMenu: 'logList',
      menus: [
        {
          index: 'preventDrowsy',
          label: '防瞌睡',
          items: [
            {
              index: 'configuration',
              title: '配置'
            },
            {
              index: 'logList',
              title: '日志列表'
            },
            {
              index: 'logSearch',
              title: '日志查询'
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
    }
  }
}
</script>

<style lang="less" scoped>
.prevent-drowsy-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  .content-left {
    height: calc(~'100% - 25px');
    padding: 5px 10px;
    background: #F5F5F5;
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
    .search,
    .list {
      height: 100%;
    }
  }
}
</style>
