<template>
  <div class="alarm-main">
    <div class="left-tabs"
         :style="{width: isOpenPanel ? '240px' : '28px'}"
        >
      <div class="arrow"><i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
           @click="togglePanel"></i></div>
      <div class="menu-content"
           v-show="isOpenPanel">
        <dl v-for="item in tabs"
            :key="item.index">
          <dt v-if="!item.items"
              :class="{active: sidebarActive === item.label}"
              @click="changeTab(item.label)">{{item.label}}</dt>
          <div v-else>
            <dt>{{item.label}}</dt>
            <dd v-for="val in item.items"
                :key="val.index"
                :class="{active: sidebarActive === val.label}"
                @click="changeTab(val.label)">{{val.label}}</dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="right-content">
      <component :is="isNewFile"></component>
    </div>
  </div>
</template>

<script>
import fireFightingSubsystemManagement from './page/fireFightingSubsystemManagement'
import fireFightingList from './page/fireFightingList'
import importList from './page/importList'
import assessmentRanking from './page/assessmentRanking'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  components: {
    fireFightingSubsystemManagement,
    fireFightingList,
    importList,
    assessmentRanking
  },
  data() {
    return {
      tabs: [{
        index: 'fireFightingList',
        label: '火警自动报警'
        // items: [{
        //     index: 'fireFightingSubsystemManagement',
        //     label: '用户信息传输装置'
        // }, {
        //     index: 'fireFightingList',
        //     label: '水系统'
        // }, {
        //     index: 'ImportAlarmHost',
        //     label: '液压'
        // }, {
        //     index: 'SearchAlarmHost',
        //     label: '液位'
        // }, {
        //     index: 'SearchAlarmHost1',
        //     label: '消防泵监测仪'
        // }]
      }, {
        index: 'AlarmHostRelated',
        label: '水系统'
      }, {
        index: 'DetectorRelated',
        label: '电气火灾监测'
      }, {
        index: 'AlarmTactics',
        label: '可燃气体监测'
      }, {
        index: 'AlarmLevel',
        label: 'NB烟感'
      }, {
        index: 'AlarmNonFocus',
        label: '其他类'
      }],
      isOpenPanel: true
    }
  },
  created() {
    this.SET_IS_NEW_FILE('fireFightingList')
    this.SET_SIDEBAR_ACTIVE('火警自动报警')
  },
  watch: {
    isNewFile: function(newVale, oldValue) {
      if (newVale) {
        console.log(newVale)
        this.SET_COMPONENT_ID(newVale)
      }
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      componentId: 'componentId',
      isNewFile: 'isNewFile',
      sidebarActive: 'sidebarActive'
    })
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID',
      SET_SIDEBAR_ACTIVE: 'SET_SIDEBAR_ACTIVE'
    }),
    changeTab(index) {
      this.SET_SIDEBAR_ACTIVE(index)
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
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
            height: 100%;
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
                font-size: 14px;
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
        .el-menu {
            background-color: #eee;
        }
    }
</style>
