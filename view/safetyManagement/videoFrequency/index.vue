<template>
  <div class="faultManagement">
    <div class="menuList">
      <el-menu :default-active="activeMenu"
               :default-openeds='openeds'
               class="el-menu-vertical-demo"
               :unique-opened='true'
               @open="handleOpen"
               @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <span @click="changeList('PatrolParameterConfiguration')">巡检参数配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="ParameterConfiguration"
                          @click="changeList('PatrolParameterConfiguration')">巡检参数配置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <span @click="changeList('CheckTaskList')">巡检任务管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="NewlyBuild"
                          @click="changeList('PatrolTaskManagement')">新建巡检任务</el-menu-item>
            <el-menu-item index="TaskList"
                          @click="changeList('CheckTaskList')">巡检任务列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <span @click="changeList('PatrolRecordQuery')">巡检记录查询</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="NewlyBuild"
                          @click="changeList('PatrolRecordQuery')">巡检记录查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="content">
      <component :is="activeMenu"></component>
    </div>
  </div>
</template>
<script>
import { CheckTaskList, PatrolParameterConfiguration, PatrolRecordQuery, PatrolTaskManagement } from './page/index'
export default {
  components: {
    CheckTaskList,
    PatrolParameterConfiguration,
    PatrolRecordQuery,
    PatrolTaskManagement
  },
  data() {
    return {
      openeds: ['1'],
      activeMenu: 'PatrolRecordQuery'
    }
  },
  methods: {
    changeList(componentName) {
      this.activeMenu = componentName
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.faultManagement {
  width: 100%;
  height: 100%;
  display: flex;
  .menuList {
    width: 200px;
    height: 100%;
    .el-menu {
      height: 100%;
      width: 100%;
      .el-submenu {
        .el-submenu__title {
          span {
            font-size: 14px;
            color: #000;
          }
        }
        .el-menu {
          .el-menu-item-group {
            /deep/ .el-menu-item-group__title {
              display: none;
            }
            ul {
              .el-menu-item {
                font-size: 13px;
              }
            }
          }
        }
      }
    }
  }
  .content {
    width: calc(~'100% - 200px');
    height: 100%;
  }
}
</style>
