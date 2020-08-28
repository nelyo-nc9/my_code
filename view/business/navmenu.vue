<template>
  <div class="navmenu">
    <div class="menu-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <el-menu
        :default-active="defaultMenu"
        :default-openeds="openeds"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        @open="handleOpen"
        @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <span>风险RAD系统对接</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="RiskSystemic" @click="riskfrom('RiskSystemic')">RSSM配置</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="报警推送策略">
            <template slot="title">报警推送策略</template>
            <el-menu-item index="New" @click="riskfrom('New')">新建</el-menu-item>
            <el-menu-item index="Liststyle" @click="riskfrom('Liststyle')">列表</el-menu-item>
            <el-menu-item index="Query" @click="riskfrom('Query')">查询</el-menu-item>
          </el-submenu>
          <el-submenu index="AI任务管理">
            <template slot="title">AI任务管理</template>
            <el-menu-item index="News" @click="riskfrom('News')">新建</el-menu-item>
            <el-menu-item index="Liststyles" @click="riskfrom('Liststyles')">列表</el-menu-item>
            <el-menu-item index="Querys" @click="riskfrom('Querys')">查询</el-menu-item>
          </el-submenu>
          <el-submenu index="报警推送日志">
            <template slot="title">报警推送日志</template>
            <el-menu-item index="Thirlist" @click="riskfrom('Thirlist')">列表</el-menu-item>
            <el-menu-item index="Thirquery" @click="riskfrom('Thirquery')">查询</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <div @click="isOpenMenu = !isOpenMenu" class="isShow" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>

    <div class="content">
      <component :is="ridkMenu" @changeComponent="changeComponent"></component>
    </div>
  </div>
</template>

<script>
import {
  RiskSystemic,
  New,
  Liststyle,
  Query,
  News,
  Liststyles,
  Querys,
  Thirlist,
  Thirquery
}from './index'
export default {
  data(){
    return{
      isOpenMenu: true, // 左侧导航是否显示
      
      openeds: ['1','2'],
      ridkMenu: 'RiskSystemic',
      defaultMenu:'ridkMenu'
    }
  },
  components: {
    RiskSystemic,
    New,
    Liststyle,
    Query,
    News,
    Liststyles,
    Querys,
    Thirlist,
    Thirquery
  },
  methods: {
    riskfrom(componentName) {
      this.ridkMenu = componentName;
      this.defaultMenu = componentName;
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // 切换子组件
    changeComponent(index) {
    
      this.ridkMenu = index;
      console.log()
      if(index=='RiskSystemic' || index=='New' || index=='Liststyle' || index=='Query' || index=='News' || index=='Liststyles' || index=='Querys' || index=='Thirlist' || index=='Thirquery' ){
        this.defaultMenu = index;
      }
    },
  }
}
</script>

<style scoped lang="less">

.navmenu{
  width: 100%;
  min-height: 100%;
  padding: 10px 0px 8px 0;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
}
 .menu-left {
    min-height: 100%;
    flex-shrink: 0;
    background: #F5F5F5;
    .menu-left-main {
      width: 200px;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }

   .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 15px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 18px solid #E6E6E6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 9.5px;
    }
  }
.content{
  flex: 1;
  overflow: hidden;
}
  // 菜单收缩栏样式(关闭时)
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
}
</style>