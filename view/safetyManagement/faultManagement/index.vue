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
            <span @click="changeList('DeclarationList')">故障申报</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="NewDeclaration"
                          @click="changeList('NewDeclaration')">新建</el-menu-item>
            <el-menu-item index="DeclarationList"
                          @click="changeList('DeclarationList')">列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <span @click="changeList('UnacknowledgedFaultList')">故障处理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="FaultNew"
                          @click="changeList('FaultNew')">新建</el-menu-item>
            <el-menu-item index="UnacknowledgedFaultList"
                          @click="changeList('UnacknowledgedFaultList')">未确认故障列表</el-menu-item>
            <el-menu-item index="ListConfirmedFaults"
                          @click="changeList('ListConfirmedFaults')">已确认故障列表</el-menu-item>
            <el-menu-item index="ShieldingAlarmList"
                          @click="changeList('ShieldingAlarmList')">屏蔽报警列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <span>故障查询</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="FaultQuery"
                          @click="changeList('FaultQuery')">查询</el-menu-item>
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
import {
  FaultQuery,
  NewDeclaration,
  DeclarationList,
  FaultNew,
  ListConfirmedFaults,
  ShieldingAlarmList,
  UnacknowledgedFaultList
} from './page/index'
export default {
  components: {
    FaultQuery,
    NewDeclaration,
    DeclarationList,
    FaultNew,
    ListConfirmedFaults,
    ShieldingAlarmList,
    UnacknowledgedFaultList
  },
  data() {
    return {
      openeds: ['3'],
      activeMenu: 'FaultQuery'
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
