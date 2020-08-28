<template>
  <div class="pageContent">
    <div class="menuList" v-show="isCollapse">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="openeds"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-submenu index="1">
          <template slot="title">
            <span @click="changeList('EquipmentInspection')">巡检参数配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="EquipmentInspection"
              @click="changeList('EquipmentInspection')"
            >巡检参数配置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <span @click="changeList('NewTask')">巡检任务管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="NewTask" @click="changeList('NewTask')">新建巡检任务</el-menu-item>
            <el-menu-item index="TaskList" @click="changeList('TaskList')">巡检任务列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <span>巡检任务查询</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="TaskQuery" @click="changeList('TaskQuery')">巡检任务查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div
      @click="isCollapse = !isCollapse"
      class="isShow"
      :style="{left: isCollapse? '200px' : '0'}"
    >
      <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content" :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
      <component :is="activeMenu" @giveValue="giveValue" :titleDa="titleDa" :isViews="isViews" :isData="isData" :isIds="isId" :key="activeMenu"></component>
    </div>
  </div>
</template>
<script>
import { EquipmentInspection, NewTask, TaskList, TaskQuery } from './page/index'
import { getOneItem } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'

export default {
  components: {
    EquipmentInspection,
    NewTask,
    TaskList,
    TaskQuery
  },
  data() {
    return {
      isCollapse: true,
      openeds: ['0'],
      activeMenu: 'EquipmentInspection',
      titleDa: '',
      isViews: true,
      isData: {},
      tableData: [],
      isId: ''
    }
  },
  methods: {
    changeList(componentName) {
      this.activeMenu = componentName
      if (componentName === 'NewTask') {
        this.giveValue('创建', true, {})
      }
      if (this.titleDa === '新建') {
        this.titleDa = ''
        this.isData = {}
        this.isId = ''
      }
    },
    giveTableData(data) {
      this.tableData = data
    },
    giveValue(data, val, isData, isIds) {
      this.titleDa = data
      this.isId = isIds
      if (isIds) {
        getOneItem(isIds).then(res => {
          this.isData = this.$lodash.cloneDeep(res.data.data.task)
          this.isData['isInspectVideo'] = this.isData.isInspectVideo === 'T'
          this.isData['isInspectDisk'] = this.isData.isInspectDisk === 'T'
          this.isData['isOnline'] = this.isData.isOnline === 'T'
          this.isViews = val
          // this.changeList('NewTask')
          this.activeMenu = 'NewTask'
        }).catch(() => {
          this.$messageError('修改失败')
        })
      } else {
        this.isViews = val
        // let userInfo = JSON.parse(window.sessionStorage.getItem('user'))
        this.isData = {
          inspectName: '',
          subSystemId: 1,
          deviceType: 1,
          inspectPeriod: '',
          inspectAt: '',
          status: '',
          isOnline: '',
          isInspectVideo: '',
          isInspectDisk: '',
          updatedAt: '', // 录入时间
          updatedBy: '', // 录入人
          updatedDept: '' // 录入机构
        }
      }
    },
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    }
  }
}
</script>
<style lang="less" scoped>
.pageContent {
  width: 100%;
  height: 100%;
  display: flex;
  .menuList {
    overflow: auto;
    width: 200px;
    height: 100%;
    background: #f5f5f5;
    .el-menu {
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
            .el-menu-item {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 6px;
    }
  }
  .content {
    width: calc(~'100% - 202px');
    height: 100%;
    overflow: auto;
    padding: 5px 0;
  }
}
</style>
