<template>
  <div class="pageContent">
    <div class="menuList" v-show="isCollapse">
      <el-menu :default-active="activeMenu" :default-openeds='openeds' class="el-menu-vertical-demo" :unique-opened='true' @open="handleOpen" @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <span @click="changeList('EquipmentTiming')">系统校时</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="ParameterConfiguration" @click="changeList('ParameterConfiguration')">参数配置</el-menu-item>
            <el-menu-item index="EquipmentTiming" @click="changeList('EquipmentTiming')">设备校时</el-menu-item>
            <el-menu-item index="TripartitePlatform" @click="changeList('TripartitePlatform')">第三方平台</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <span @click="changeList('TaskList')">校时任务</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="NewlyBuild" @click="changeList('NewlyBuild')">新建</el-menu-item>
            <el-menu-item index="TaskList" @click="changeList('TaskList')">列表</el-menu-item>
            <el-menu-item index="TimingResult" @click="changeList('TimingResult')">校时结果查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div @click="isCollapse = !isCollapse" class="isShow" :style="{left: isCollapse? '200px' : '0px'}">
      <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content" :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
      <component :is="activeMenu" @giveValue="giveValue" :titleDa="titleDa" :isViews="isViews" :isData="isData"></component>
    </div>>
  </div>
</template>
<script>
import {
  EquipmentTiming,
  NewlyBuild,
  ParameterConfiguration,
  TaskList,
  TimingResult,
  TripartitePlatform
} from './page/index'
export default {
  components: {
    EquipmentTiming,
    NewlyBuild,
    ParameterConfiguration,
    TaskList,
    TimingResult,
    TripartitePlatform
  },
  data() {
    return {
      isCollapse: true,
      openeds: ['1'],
      activeMenu: 'EquipmentTiming',
      titleDa: '',
      isViews: true,
      isData: {}
    }
  },
  methods: {
    changeList(componentName) {
      this.activeMenu = componentName
      if (componentName === 'NewlyBuild') {
        this.isViews = true,
        this.titleDa = '',
        this.isData = {}
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    giveValue(data, val, isData) {
      console.log(data, val, isData);
      this.titleDa = data
      this.isViews = val
      this.isData = isData
      console.log(this.titleDa);
      console.log(this.isViews);
      console.log(this.isData);//选中的校时任务中的数据
    },
  }
}
</script>
<style lang="less" scoped>
.pageContent {
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
    // height: 100%;
    overflow: auto;
    padding: 5px 0;
    overflow: hidden;
  }
}
</style>
