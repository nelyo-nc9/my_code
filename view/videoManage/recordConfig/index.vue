<template>
  <div class="record-config">
    <!-- 左侧导航 -->
    <div class="menu-left" v-show="isCollapse">
      <el-menu :default-active="combinationName" class="el-menu-vertical-demo" :unique-opened="true" @select="changeTab">
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{ val.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <!-- 按钮 -->
    <div class="isShow" :class="{isCollapse: !isCollapse}">
      <span @click="isCollapse = !isCollapse">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </span>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 动态组件 -->
      <component :is="parentComponent" @modelChange="modelChange" :key="componentKey"></component>
    </div>
  </div>
</template>

<script>
// 中心录像计划配置
import storagePathConfig from './pages/recordHost/storagePathConfig'
import recordPlaneSearch from './pages/recordHost/recordSearch'
import recordPlaneList from './pages/recordHost/recordList'
import recordPlaneInfo from './pages/recordHost/planeInfo'
import recordPlaneShow from './pages/recordHost/planeShow'
import {
  mapActions,
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import common from './pages/common'

export default {
  name: 'recordConfig',
  components: {
    recordPlaneInfo,
    recordPlaneShow,
    recordPlaneList,
    storagePathConfig,
    recordPlaneSearch
  },
  mixins: [common],
  data() {
    return {
      isCollapse: true,
      menus: [
        {
          index: 'recordList',
          title: '中心录像计划配置',
          items: [
            { index: 'recordPlaneInfo', title: '录像计划配置' },
            { index: 'recordPlaneList', title: '录像计划列表' },
            { index: 'storagePathConfig', title: '存储路径配置' },
            { index: 'recordPlaneSearch', title: '录像计划查询' }
          ]
        }
      ],
      parentComponent: 'recordPlaneInfo', // 右侧显示那个组件
      combinationName: 'recordPlaneInfo', // 左侧显示高亮
      componentKey: 0 // component的key
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn'])
  },
  created() {
    // 初始化tab列表
    this.setMenu(this.menus)
    // 重新赋值menus
    this.menus = this.newMenu
    // 初始化时默认页面从第一个开始
    this.parentComponent = this.changComponent
    this.combinationName = this.changComponent
    this.getBaseData()
  },
  methods: {
    ...mapActions('videoManage', ['getBaseData', 'getStorageServer']),
    ...mapMutations('videoManage', ['SET_PATTERN']),
    ...mapActions('login', ['setMenu', 'changIndex']), // setMenu      初始化menu方法     // changIndex   获取组件切换方法
    changeTab(index) {
      // 组件切换传参
      this.changIndex(index)
      this.CLEAR_CHANGE_COMPONENT_DATA()
      this.SET_PATTERN(1)
      this.componentKey += 1
      this.parentComponent = index
      this.combinationName = index
      // this.getStorageServer() // 获取中心存储设备data
    },
    // 程序跳转
    modelChange() {
      this.componentKey += 1
      this.parentComponent = this.changeComponent.to
      if (this.menus.some(e => e.items.some(f => f.index === this.changeComponent.to))) {
        this.combinationName = this.changeComponent.to
      }
    }
  },
  beforeDestroy() {
    this.CLEAR_CHANGE_COMPONENT_DATA()
  }
}
</script>

<style lang="less" scoped>
.record-config {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    width: 200px;
    height: 100%;
    padding-top: 5px;
    /deep/ .el-menu {
      height: 100%;
      .el-collapse-item__header {
        background: #eee;
      }
      .el-collapse-item__content {
        padding-bottom: 1px;
      }
      .el-submenu {
        .el-menu-item {
          min-width: 170px;
        }
        .el-menu-item,
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
        }
      }
      .el-menu-item-group .el-menu-item-group__title {
        display: none;
      }
    }
    .menu-nav {
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      background: #f5f4f4;
      border-bottom: 1px solid #fff;
    }
  }
  .content-right {
    width: calc(~'100% - 202px');
    height: 100%;
    padding-top: 5px;
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 16px');
    left: 200px;
    width: 18px;
    height: 55px;
    z-index: 10;
    overflow: hidden;
    span {
      cursor: pointer;
      border-width: 20px;
      border-color: #e6e6e6;
      border-style: solid;
      display: block;
      position: absolute;
      transform: rotate(45deg);
      top: calc(~'50% - 19px');
      left: calc(~'50% - 29px');
    }
    i {
      transform: rotate(-45deg);
      color: #666;
      position: absolute;
      top: -9px;
      left: -1px;
      // cursor: pointer;
    }
    &.isCollapse {
      left: 0;
      & + .content-right {
        width: 100%;
        // overflow: hidden;
      }
    }
  }
}
</style>
