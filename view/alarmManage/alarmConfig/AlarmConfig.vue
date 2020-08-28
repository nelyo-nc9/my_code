<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left"
           v-show="isCollapse">
        <el-menu :default-active="combinationName"
                 class="el-menu-vertical-demo"
                 :unique-opened="true"
                 @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items"
                        :index="item.index"
                        :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items"
                              :key="val.index"
                              :index="val.index">{{val.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else
                          :index="item.index"
                          :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div @click="isCollapse = !isCollapse"
           class="isShow"
           :style="{left: isCollapse? '195px' : '0'}">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right"
           :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
        <!-- 动态组件 -->
        <component :is="componentId"></component>
      </div>
    </div>
  </div>
</template>

<script>
import AddAlarmHost from './pages/alarmHost/AddAlarmHost'
import AlarmList from './pages/alarmHost/AlarmList'
import ImportAlarmHost from './pages/alarmHost/ImportAlarmHost'
import SearchAlarmHost from './pages/alarmHost/SearchAlarmHost'
import AlarmHostRelated from './pages/alarmHostRelated/AlarmHostRelated'
import SearchAlarmHostRelated from './pages/alarmHostRelated/SearchAlarmHostRelated'
import DetectorRelated from './pages/detectorRelated/DetectorRelated'
import SearchDetectorRelated from './pages/detectorRelated/SearchDetectorRelated'
import AlarmTactics from './pages/AlarmTactics'
import AlarmLevel from './pages/AlarmLevel'
import EventReminder from './pages/EventReminder.vue'
import AlarmNonFocus from './pages/AlarmNonFocus'
import FirstLevelAlarm from './pages/alarmLinkage/FirstLevelAlarm'
import SecondLevelAlarm from './pages/alarmLinkage/SecondLevelAlarm'
import ThreeLevelAlarm from './pages/alarmLinkage/ThreeLevelAlarm'
import FourLevelAlarm from './pages/alarmLinkage/FourLevelAlarm'
import FiveLevelAlarm from './pages/alarmLinkage/FiveLevelAlarm'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    AddAlarmHost,
    AlarmList,
    ImportAlarmHost,
    SearchAlarmHost,
    AlarmHostRelated,
    DetectorRelated,
    SearchAlarmHostRelated,
    SearchDetectorRelated,
    AlarmTactics,
    AlarmLevel,
    EventReminder,
    AlarmNonFocus,
    FirstLevelAlarm,
    SecondLevelAlarm,
    ThreeLevelAlarm,
    FourLevelAlarm,
    FiveLevelAlarm
  },
  data() {
    return {
      isCollapse: true,
      menus: [
        {
          index: 'AlarmList',
          title: '报警主机配置',
          items: [
            {
              index: 'ImportAlarmHost',
              title: '导入'
            },
            {
              index: 'AddAlarmHost',
              title: '新建'
            },
            {
              index: 'AlarmList',
              title: '列表'
            },
            {
              index: 'SearchAlarmHost',
              title: '查询'
            }
          ]
        },
        {
          index: 'AlarmHostRelated',
          title: '报警主机关联配置',
          items: [
            {
              index: 'AlarmHostRelated',
              title: '列表'
            },
            {
              index: 'SearchAlarmHostRelated',
              title: '查询'
            }
          ]
        },
        {
          index: 'DetectorRelated',
          title: '探测器关联配置',
          items: [
            {
              index: 'DetectorRelated',
              title: '列表'
            },
            {
              index: 'SearchDetectorRelated',
              title: '查询'
            }
          ]
        },
        {
          index: 'AlarmTactics',
          title: '报警策略配置'
        },
        {
          index: 'AlarmLevel',
          title: '报警等级及联动录像配置'
        },
        {
          index: 'AlarmNonFocus',
          title: '报警非重点时段配置'
        },
        {
          index: 'EventReminder',
          title: '事件提醒配置'
        },
        {
          index: 'FirstLevelAlarm',
          title: '报警联动配置',
          items: [
            {
              index: 'FirstLevelAlarm',
              title: '一级报警'
            },
            {
              index: 'SecondLevelAlarm',
              title: '二级报警'
            },
            {
              index: 'ThreeLevelAlarm',
              title: '三级报警'
            },
            {
              index: 'FourLevelAlarm',
              title: '四级报警'
            },
            {
              index: 'FiveLevelAlarm',
              title: '五级报警'
            }
          ]
        }
      ],
      combinationName: 'AlarmList'
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      componentId: ({ alarm }) => alarm.componentId
    })
  },
  created() {
    this.setMenu(this.menus) // 重新赋值menus
    this.menus = this.newMenu
    this.SET_COMPONENTID(this.defaultComponent.index)
    this.combinationName = this.defaultComponent.index
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapMutations(['SET_COMPONENTID', 'SET_SKIP_NUM']),
    // changeTab(index) {
    //   if (index === 'AddAlarmHost') {
    //     this.SET_SKIP_NUM(1)
    //   }
    //   this.SET_COMPONENTID(index)
    // },
    changeTab(index) {
      // 组件切换传参
      this.changIndex(index)

      if (index === 'AddAlarmHost') {
        this.SET_SKIP_NUM(1)
      }
      this.SET_COMPONENTID(index)
    }
  }
}
</script>

<style lang="less" scoped>
.video-config-box {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    .menu-left {
      width: 195px;
      height: 100%;
      padding: 8px 0;
      background: #f5f5f5;
      /deep/ .el-menu {
        height: 100%;
        .el-menu-item-group__title {
          display: none;
        }
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
        }
        .el-submenu .el-menu-item {
          min-width: 195px;
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
    .content-right {
      width: calc(~'100% - 202px');
      height: 100%;
      padding: 5px 0;
    }
  }
}
</style>
