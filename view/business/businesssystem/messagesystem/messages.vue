<template>
  <div class="warnPetition-container">
    <!-- 左侧菜单导航 -->
    <div class="menu-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <!-- <el-menu
          default-active="Messagebutt"
          class="el-menu-vertical-demo"
          :default-openeds="openeds"
          :unique-opened="true"
          @open="handleOpen"
          @close="handleClose"> -->
          <!-- <el-submenu index="1">
            <template slot="title">
              <span>短信平台对接</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="Messagebutt" @click="riskfrom('Messagebutt')">95533平台配置</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <el-menu
            :default-active="componentId"
            :default-openeds="openeds"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            @select="changeTab"
          >
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
              <template v-for="val in item.items">
                <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
              </template>
            </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
    </div>

    <div @click="isOpenMenu = !isOpenMenu" class="isShow" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>

    <!-- 右侧主体 -->
    <div class="content">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import { Messagebutt } from '../../index'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      menus: [
        {
          index: 'Messagebutt',
          title: '短信平台对接',
          items: [
            {
              index: 'Messagebutt',
              title: '95533平台配置',
            }
          ]
        }
      ],
      isOpenMenu: true, // 左侧导航是否显示
      openeds: ['1'],
      componentId: 'Messagebutt',
    }
  },
  computed:{
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.componentId=this.changComponent
  },
  components: {
    Messagebutt
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.componentId = index
      this.changIndex(index)
    },
    // riskfrom(componentName) {
    //   this.componentId = componentName;
    // },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // }
  }  
}
</script>

<style scoped lang="less">
   .warnPetition-container{
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
    // float: left;
    flex: 1;
    overflow: hidden;
  }
    // 菜单收缩栏样式(关闭时)
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
</style>