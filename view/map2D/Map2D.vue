<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 16:18:41
 * @LastEditTime: 2020-06-03 17:31:31
 * @LastEditors: fengbeibei
 * @Description: 地图应用主视图组件
-->
<template>
  <div class="map-2d">
    <!-- 全屏底图 -->
    <section class="base-map">
      <MapApp class="outer-map" />
    </section>
    <!-- 左侧搜索结构、点位面板 -->
    <section class="panel-search-wrap" v-if=" listenMapOuter ===1" >
       <PanelSearch  v-if=" showLeftFloorInfo " />
      <PanelSwitch @change="handleChangePanelSwitch" />
    </section>
     <section class="panel-search-wrap" v-if=" listenMapOuter ===2" >
      <PanelSearch  v-show="!listenShowAlarmFloors" v-if=" showLeftFloorInfo " />
      <PanelWarning v-show="listenShowAlarmFloors"  v-if=" showLeftFloorInfo "/>
      <PanelSwitch @change="handleChangePanelSwitch" />
    </section>
    <!-- 右上工具条 -->
    <section class="panel-Toolbars" :class="{ 'panel-Toolbars-move': isShowPanelTools }">
      <EMapTools />
    </section>
    <!-- 右侧点位详情面板-->
    <transition name="panelInfo">
      <div v-if="isShowPanelTools && !showBox">
        <PanelInfo class="panelInfo" v-if="isShowPanelTools" />
      </div>
    </transition>
    <!-- 右侧框选天气详情面板 -->
    <transition name="panelInfo">
      <div v-if="isShowPanelTools && showBox">
        <BoxSelectStatistic class="panelInfo  rightPanel" :is="currPanelToolComponent" v-if="isShowPanelTools" />
      </div>
    </transition>
  </div>
</template>
<script>
import Bus from 'assets/2DMap/Bus'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import MapApp from './baseMap/MapApp'
import { PanelSearch, PanelSwitch, PanelWarning } from './panelSearch'
import { EMapTools, Tools } from './panelTool'
import PanelInfo from './panelInfo/PanelInfo'
import BoxSelectStatistic from './panelInfo/BoxSelectStatistic'
import RealtionEquipment from './panelInfo/RealtionEquipment'
import WeatherList from './panelTool/WeatherList'
import DistrictSetting from './panelInfo/panel/DistrictSetting'
import PanelDistrict from './panelInfo/panel/PanelDistrict'
import PanelInfoImport from './panelInfo/panel/PanelInfoImport'
export default {
  name: 'map2d',
  components: {
    MapApp,
    PanelSwitch,
    PanelSearch,
    EMapTools,
    Tools,
    PanelInfo,
    BoxSelectStatistic,
    RealtionEquipment,
    WeatherList,
    PanelInfoImport,
    DistrictSetting,
    PanelDistrict,
    PanelWarning
  },
  data() {
    return {
      hide: false,
      showBox: false
    }
  },
  watch: {
    listencurrPanelToolComponent(newValue, oldValue) {
      if (
        newValue === 'WeatherList' ||
        newValue === 'BoxSelectStatistic' ||
        newValue === 'PanelDistrict' ||
        newValue === 'RealtionEquipment'
      ) {
        this.showBox = true
      } else {
        this.showBox = false
      }
    },
    alarmSetting: {
      immediate: true,
      handler(newValue, oldValue) {
        if (!newValue) {
          // 基本不存在
        } else if (!newValue.isReceive) {
          this.SET_SHOW_ALARM_FLOORS(false)
        } else if (
          !oldValue ||
          newValue.alarmFeatureIds.keyPartIds.length !== oldValue.alarmFeatureIds.keyPartIds.length ||
            newValue.alarmFeatureIds.orgIds.length !== oldValue.alarmFeatureIds.orgIds.length
        ) {
          this.checkAlarmFloors()
        }
      },
      deep: true
    },
    floorMap: {
      immediate: true,
      handler(newValue, oldValue) {
        this.checkAlarmFloors()
      },
      deep: true
    },
    isMapOuter: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.SET_SHOW_ALARM_FLOORS(false)
        }
      },
      deep: true
    }

  },
  computed: {
    ...mapState({
      showAlarmFloors: ({ map2d }) => map2d.mapIndex.showAlarmFloors, // 对应设置方法 SET_SHOW_ALARM_FLOORS
      alarmSetting: ({ map2d }) => map2d.mapIndex.alarmSetting, // 接警相关信息
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      floorsPanelObj: ({ map2d }) => map2d.mapIndex.floorsPanelObj, // 报警楼层索引对象           //调api  设置 setFloorsPanelObj           //  直接设置空 SET_FLOORS_PANEL_OBJ
      showLeftFloorInfo: ({ map2d }) => map2d.mapIndex.showLeftFloorInfo // 报警楼层索引面板是否显示     //  对应设置方法 UPDATE_SHOW_LEFT_FLOOR_INFO
    }),
    ...mapGetters('map2d/mapIndex', ['isShowPanelTools', 'currPanelToolComponent', 'setIsMapEdit']),
    listencurrPanelToolComponent() {
      return this.currPanelToolComponent
    },
    listenAlarmIsReceive() {
      return this.alarmSetting.isReceive
    },
    listenAlarmFeatureIds() {
      return this.alarmSetting.alarmFeatureIds
    },
    listenShowAlarmFloors() {
      return this.showAlarmFloors
    },
    listenMapOuter() {
      return this.isMapOuter
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['updateShowLeftFloorInfo', 'setPanelInfoStatus', 'setFloorsPanelObj']),
    ...mapMutations('map2d/mapIndex', [
      'SET_FLOORS_PANEL_OBJ',
      'UPDATE_SHOW_LEFT_FLOOR_INFO',
      'SET_SHOW_ALARM_FLOORS',
      'INIT_ALL_MAP_SET_INFO'
    ]),
    ...mapMutations('map2d/mapPanelSearch', ['SET_SELECTED_TREE_NODE_APPLY']),

    // 处理收缩按钮组件状态修改事件
    handleChangePanelSwitch(v) {
      this.updateShowLeftFloorInfo(!v)
    },
    checkAlarmFloors() {
      let nowPlace = this.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2
      if (nowPlace === 1) {
        this.SET_SHOW_ALARM_FLOORS(false)
        this.SET_FLOORS_PANEL_OBJ(null)
      } else if (nowPlace === 2 && this.listenAlarmIsReceive) {
        // 当前平面图  重点部位
        if (this.floorMap.envImageData.keyPartId) {
          if (this.listenAlarmFeatureIds.keyPartIds.includes(this.floorMap.envImageData.keyPartId)) {
            let data = {
              keyPartId: this.floorMap.envImageData.keyPartId
            }
            this.setFloorsPanelObj(data).then(suc => {
              this.SET_SHOW_ALARM_FLOORS(true)
            })
          } else {
            this.SET_FLOORS_PANEL_OBJ(null)
          }
          // 机构
        } else {
          if (this.listenAlarmFeatureIds.orgIds.includes(this.floorMap.envImageData.orgId)) {
            let data = {
              orgId: this.floorMap.envImageData.orgId,
              keyPartId: '0'
            }
            this.setFloorsPanelObj(data).then(suc => {
              this.SET_SHOW_ALARM_FLOORS(true)
            })
          } else {
            this.SET_FLOORS_PANEL_OBJ(null)
          }
        }
      } else if (nowPlace === 3 && this.listenAlarmIsReceive) {
        if (this.floorMap.floorsImageDate.keyPartId) {
          if (this.listenAlarmFeatureIds.keyPartIds.includes(this.floorMap.floorsImageDate.keyPartId)) {
            let data = {
              keyPartId: this.floorMap.floorsImageDate.keyPartId
            }
            this.setFloorsPanelObj(data).then(suc => {
              this.SET_SHOW_ALARM_FLOORS(true)
            })
          } else {
            this.SET_FLOORS_PANEL_OBJ(null)
          }
          // 机构
        } else {
          if (this.listenAlarmFeatureIds.orgIds.includes(this.floorMap.floorsImageDate.orgId)) {
            let data = {
              orgId: this.floorMap.floorsImageDate.orgId,
              keyPartId: '0'
            }
            this.setFloorsPanelObj(data).then(suc => {
              this.SET_SHOW_ALARM_FLOORS(true)
            })
          } else {
            this.SET_FLOORS_PANEL_OBJ(null)
          }
        }
      }
    }
  },
  created() {
    this.checkAlarmFloors()

    let name = this.$route.name

    if (name.indexOf('map_fireDevice') != -1) {
      sessionStorage.setItem('sessionStorage_fromPage', 'fireDevice')
    }
  },
  beforeMount() {
    // 根据用户登录设置默认机构

    // this.SET_SELECTED_TREE_NODE_APPLY({ tierType: 'org', serial: JSON.parse(sessionStorage.user).org })
    if (('sessionStorage_fromPage', sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice')) {
      this.INIT_ALL_MAP_SET_INFO({ pageType: 'fireDevice' })
    } else {
      this.INIT_ALL_MAP_SET_INFO({ pageType: 'allDevice' })
    }
  },
  mounted() {
    this.updateShowLeftFloorInfo(true)
  }
}
</script>
<style lang="less" scoped>
.map-2d {
  width: 100%;
  height: 100%;
  position: relative;
  .base-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .outer-map {
      width: 100%;
      height: 100%;
    }
  }
  // 左侧搜索导航面板
  .panel-search-wrap {
    display: flex;
    height: 100%;
    position: absolute;
    z-index: 9;
  }
  .hide {
    display: none;
  }
  // 右上角地图工具
  .panel-Toolbars {
    width: 280px;
    position: fixed;
    right: 20px;
    z-index: 999;
  }
  // 右上角地图工具
  .panel-Toolbars-move {
    right: 320px;
  }
  .panel-tools {
    display: flex;
    width: 300px;
    height: 100%;
    position: absolute;
    right: 0px;
    background: rgba(200, 200, 200, 0.35);
    .panel-info {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 8px;
    }
  }
  // 右侧面板
  .panelInfo {
    width: 300px;
    height: 100%;
    position: fixed;
    right: 0;
    z-index: 999;
  }
  .panelInfo.rightPanel {
    height: 100%;
    overflow-y: auto;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  }
  // 选择绘制类型
  .select-draw-type {
    position: absolute;
    top: 1em;
    right: 32px;
  }
}
</style>
