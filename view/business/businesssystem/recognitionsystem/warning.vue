// 信访识别预警
<template>
  <div class="warnPetition-container">
    <!-- 左侧菜单导航 -->
    <div
      class="menu-left"
      :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}"
    >
      <!-- <el-menu
          :default-active="defaultMenu"
          class="el-menu-vertical-demo"
          :default-openeds="openeds"
          :unique-opened="true"
          @open="handleOpen"
      @close="handleClose">-->
      <!-- <el-submenu index="1">
            <template slot="title">
              <span>信访平台预警</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="Allocation" @click="recognfrom('Allocation')">RSSM设置</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="报警推送策略">
              <template slot="title">推送策略</template>
              <el-menu-item index="Newpush" @click="recognfrom('Newpush')">新建</el-menu-item>
              <el-menu-item index="Pushlist" @click="recognfrom('Pushlist')">列表</el-menu-item>
              <el-menu-item index="Pushquery" @click="recognfrom('Pushquery')">查询</el-menu-item>
            </el-submenu>
            <el-submenu index="报警推送日志">
              <template slot="title">推送日志</template>
              <el-menu-item index="Thirlists" @click="recognfrom('Thirlists')">列表</el-menu-item>
              <el-menu-item index="Thirquerys" @click="recognfrom('Thirquerys')">查询</el-menu-item>
            </el-submenu>
      </el-submenu>-->
      <el-menu
        :default-active="defaultMenu"
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
                <el-submenu v-else :key="val.index" :index="val.index">
                  <template>
                    <p slot="title" @click="changeTab(val.index)">{{val.title}}</p>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-for="v in val.items" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- <div @click="isOpenMenu = !isOpenMenu" class="isShow" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>-->

    <!-- 右侧主体 -->
    <!-- <div class="content">
      <component :is="componentId"  @changeComponent="changeComponent"></component>
    </div>-->
    <div
      @click="isOpenMenu = !isOpenMenu"
      class="isShow"
      :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}"
    >
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content">
      <!-- 动态组件 -->
      <component
        :isData="isData"
        :titleDa="titleDa"
        :is="componentId"
        :componentTitle="componentTitle"
        :nodeData="nodeData"
        :parentData="parentData"
        :editData="editData"
        :isrowda="isrowda"
        :rowdata="rowdata"
        @changComponent="changComponent"
        @defaultComponent="defaultComponent"
      ></component>
    </div>
  </div>
</template>

<script>
// import {
//   Allocation,
//   Newpush,
//   Pushlist,
//   Pushquery,
//   Thirlists,
//   Thirquerys
// } from '../../index'
import Allocation from './allocation/allocation'
import Newpush from './pushstrategy/newpush'
import Pushlist from './pushstrategy/pushlist'
import Pushquery from './pushstrategy/pushquery'
import Thirlists from './pushDirs/thirlists'
import Thirquerys from './pushDirs/thirquerys'
import { mapState, mapActions, mapGetters } from 'vuex'
import { linkHostApi } from '../../../../http/protectiveCabin/channe.api'
export default {
  // name: 'petitionletter',
  components: {
    Allocation,
    Newpush,
    Pushlist,
    Pushquery,
    Thirlists,
    Thirquerys,
  },
  data() {
    return {
      isData: [],
      titleDa:'',
      isrowda:'',
      rowdata:[],
      menus: [
        {
          index: 'petitionletter',
          title: '信访平台预警',
          items: [
            {
              index: 'Allocation',
              title: 'RSSM设置',
            },
            {
              index: 'strategy',
              title: '推送策略',
              items: [
                {
                  index: 'Newpush',
                  title: '新建',
                },
                {
                  index: 'Pushlist',
                  title: '列表',
                },
                {
                  index: 'Pushquery',
                  title: '查询',
                },
              ],
            },
            {
              index: 'log',
              title: '推送日志',
              items: [
                {
                  index: 'Thirlists',
                  title: '列表',
                },
                {
                  index: 'Thirquerys',
                  title: '查询',
                },
              ],
            },
          ],
        },
      ],
      isOpenMenu: true, // 左侧导航是否显示
      openeds: ['1', '2'],
      componentId: 'Allocation',
      defaultMenu: 'Allocation',
      componentTitle: '新建机构',
      nodeData: {}, // 当前树节点信息
      parentData: {}, // 当前树节点的父节点信息
      editData: {}, // 需要编辑的数据
    }
  },
  components: {
    Allocation,
    Newpush,
    Pushlist,
    Pushquery,
    Thirlists,
    Thirquerys,
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent']),
    ...mapState({
      defaultmoent: ({login}) => login.changComponent
    }),
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.componentId=this.defaultmoent
    this.defaultMenu=this.defaultmoent
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.defaultMenu = index
      this.componentId = index
      
      if (index == 'strategy') {
        this.componentId = 'Pushlist'
      }
      if (index == 'log') {
        this.componentId = 'Thirlists'
      }
      this.changIndex(index)
    },
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu
    },
    // recognfrom(componentName) {
    //   this.componentId = componentName;
    //   this.defaultMenu = componentName;
    // },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   //console.log(key, keyPath);
    // },

    // 切换子组件
    changComponent(index, isData, data) {
      
      this.componentId = index
      this.isData = isData
      this.titleDa = data
      this.isrowda = isData
      this.rowdata = data
      // this.componentTitle = title;
      if (
        index == 'Newpush' ||
        index == 'Pushlist' ||
        index == 'Pushquery' ||
        index == 'Thirlists' ||
        index == 'Thirquerys'
      ) {
        this.defaultMenu = index
      }
    },

    onceClick(data, node) {
      console.log(data, 'data')
      console.log(node, 'node')
      this.nodeData = data
      if (node.parent.data) {
        this.parentData.id = node.parent.data.id
        this.parentData.name = node.parent.data.name
        this.parentData.serial = node.parent.data.serial
      }
    },
  },
}
</script>

<style scoped lang="less">
.warnPetition-container {
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
  background: #f5f5f5;
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
  border-left: 18px solid #e6e6e6;
  z-index: 10;
  cursor: pointer;
  i {
    color: #666;
    position: absolute;
    left: -15px;
    top: 9.5px;
  }
}

.content {
  // float: left;
  flex: 1;
  overflow: hidden;
}
// 菜单收缩栏样式(关闭时)
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>