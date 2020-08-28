<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '220px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs" :style="{ minWidth: isOpenPanel ? '220px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <el-menu
          :default-active="combinationName"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          @select="changeTab"
        >
          <template v-for="item in tabs">
            <el-submenu v-if="item.items" :index="item.index" :key="item.id">
              <template>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{
                  val.title
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="right-content" :style="{ maxWidth: isOpenPanel ? '89%' : '100%' }">
      <components :is="isNewFile" @modelChange="modelChange" :optType="optType" :deviceData="deviceModel"></components>
    </div>
  </div>
</template>

<script>
import fireFightingSubsystemManagement from './page/CombustibleGasAlarm'
import FireAlarm from './page/FireAlarm'
import importList from './page/importList'
import assessmentRanking from './page/assessmentRanking'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    FireAlarm,
    fireFightingSubsystemManagement,
    importList,
    assessmentRanking
  },
  data() {
    return {
      combinationName: 'FireAlarm-FireAlarm',
      item: [
        {
          index: 'importList',
          title: '导入'
        },
        {
          index: 'fireFightingSubsystemManagement',
          title: '新建'
        },
        {
          index: 'FireAlarm',
          title: '列表'
        },
        {
          index: 'assessmentRanking',
          title: '查询'
        }
      ],
      tabs: [
        {
          index: 'FireAlarm',
          title: '火灾自动报警系统',
          id: 1
        },
        {
          index: 'CombustibleGasAlarm',
          title: '可燃气体报警系统',
          id: 2
        },
        {
          index: 'AutomaticSprinkler',
          title: '自动喷水灭火系统',
          id: 3
        },

        {
          index: 'FireWaterSupplyAndHydrant',
          title: '消防给水及消防栓系统',
          id: 4
        },
        {
          index: 'WaterSprayFireExtinguishing',
          title: '水喷雾灭火系统',
          id: 5
        },
        {
          index: 'WaterMistFireFighting',
          title: '细水雾灭火系统',
          id: 6
        },
        {
          index: 'FixedFireMonitorForFireFighting',
          title: '固定消防炮灭火系统',
          id: 7
        },

        {
          index: 'SmokeControl',
          title: '防排烟系统',
          id: 8
        },

        {
          index: 'GasExtinguishing',
          title: '气体灭火系统',
          id: 9
        },
        {
          index: 'FireSeparationFacilities',
          title: '防火分隔设施系统',
          id: 10
        },
        {
          index: 'ElectricalFireMonitoring',
          title: '电气火灾监测系统',
          id: 11
        },
        {
          index: 'autonomousDevice',
          title: 'NB独立探测器',
          id: 12
        }
      ],

      isOpenPanel: true, // 显示隐藏左侧菜单
      deviceModel: '', // 选中列表数据
      optType: '' // 判断新建还是编辑
    }
  },
  created() {
    this.tabs.map(item => {
      item.items = []
      // let id = item.index
      this.item.map((child, index) => {
        item.items.push({ id: item.id, index: item.index + '-' + child.index, title: child.title })
      })
    })
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    this.SET_IS_NEW_FILE(this.defaultComponent.index.split('-')[1])
    this.tabs.map(item => {
      if (item.index === this.defaultComponent.index.split('-')[0]) {
        this.SET_SIDEBAR_ACTIVE(item.title)
        this.SET_SIDEBAR_ACTIVE_ID(item.id)
        this.SET_SIDEBAR_ACTIVE_FIELD(item.index)
      }
    })
  },
  watch: {
    isNewFile: function(newVale, oldValue) {
      if (newVale) {
        this.SET_COMPONENT_ID(newVale)
      }
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    ...mapState('equipmentManagement', {
      componentId: 'componentId',
      isNewFile: 'isNewFile',
      sidebarActive: 'sidebarActive',
      sidebarActiveId: 'sidebarActiveId',
      sidebarActiveField: 'sidebarActiveField'
    })
    // ...mapState({
    //   componentId: ({ alarm }) => alarm.componentId
    // })
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    // ...mapMutations(['SET_COMPONENTID', 'SET_SKIP_NUM']),
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID',
      SET_SIDEBAR_ACTIVE: 'SET_SIDEBAR_ACTIVE',
      SET_SIDEBAR_ACTIVE_ID: 'SET_SIDEBAR_ACTIVE_ID',
      SET_SIDEBAR_ACTIVE_FIELD: 'SET_SIDEBAR_ACTIVE_FIELD'
    }),

    // 切换菜单
    changeTab(val, path) {
      let vals = val.split('-')[1]
      if (vals === 'fireFightingSubsystemManagement') {
        this.modelChange({}, 'creat')
      }
      this.SET_IS_NEW_FILE()
      this.$nextTick(function() {
        this.SET_IS_NEW_FILE(vals)
      })

      this.tabs.map(item => {
        if (item.index === path[0]) {
          this.SET_SIDEBAR_ACTIVE(item.title)
          this.SET_SIDEBAR_ACTIVE_ID(item.id)
          this.SET_SIDEBAR_ACTIVE_FIELD(item.index)
        }
      })
    },
    modelChange(obj, type) {
      if (obj && type) {
        this.deviceModel = obj
        this.optType = type
      } else {
        this.deviceModel = {}
        this.optType = 'creat'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-main {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  .left-tabs {
    overflow-y: auto;
    .arrow {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    .menu-content {
      width: 100%;
      font-size: 14px;
      .el-menu {
        height: 100%;
        .el-menu-item {
          min-width: 100px;
        }
      }
      dt {
        background: #f2f2f2;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background: #dff5fc;
        }
      }
      dd {
        background: #f8f8f8;
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        margin-inline-start: 0px;
        border-top: 1px solid #ffffff;
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
      .active {
        color: #538bda;
        border-left: 2px solid #2d72d3;
      }
    }
  }
  .right-content {
    flex: 1;
    height: 100%;
    background: #fff;
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
  .el-menu {
    background-color: #eee;
  }
}
</style>
