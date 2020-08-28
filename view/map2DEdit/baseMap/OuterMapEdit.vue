<!--
 * @Author: yubeixin
 * @Date: 2020-05-28 11:40:26
 * @LastEditTime: 2020-06-08 20:30:17
 * @LastEditors: yubeixin
 * @Description: 地图基础组件 - 地图编辑
-->

<template>
  <bs-map
    class="map-edit-home"
    :projection="mapConfig.projection"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :minZoom="mapConfig.minZoom"
    :panFactor="mapConfig.panFactor"
    @ready="bsMapReady"
    :showRotate="true"
    @singleclick="handleMapClick"
    @dblclick="handleMapDBClick"
    @zoom="handleMapZoomChange"
    @mousemove="handkeMapMouseMove"
  >
    <!-- arcgis mapServer-->
    <bs-arcgislayer
      v-if="mapConfigDlgFormData.tileType === 2"
      :url="mapConfig.url"
      :showOverView="true"
      :showScale="true"
      @overViewMapReady="handleOverViewMapReady"
    ></bs-arcgislayer>
    <bs-arcgislayer
      v-if="mapConfig.childAreaUrl !== '' && isRealData"
      :url="mapConfig.childAreaUrl"
      :showOverView="true"
      :showScale="true"
      @overViewMapReady="handleOverViewMapReady"
    ></bs-arcgislayer>
    <!-- 导航缩放工具 -->
    <bs-navzoombar :navZoomStyle="navZoomStyle"></bs-navzoombar>
    <!-- 行政区划矢量图层 -->
    <bs-layer
      v-for="{ layer: l, features } in layerList"
      :key="l.id"
      :id="l.id"
      :name="l.name"
      :features="features"
      :type="l.type"
      :zIndex="l.zIndex"
    />
    <!-- 点位资源矢量图层 -->
    <bs-layer
      v-for="item in layerArr"
      :key="item.key.id"
      :id="item.key.id"
      :name="item.key.name"
      :features="item.value"
      :type="item.key.type"
      :zIndex="item.key.zIndex"
    ></bs-layer>
    <!-- 点位要素绘制 -->
    <bs-draw
      :id="pointDraw.id"
      :name="pointDraw.name"
      :type="currDrawType"
      :actived="drawActive"
      :drawStyle="drawStyle"
      @drawend="handleDrawEnd"
    />
    <!-- 要素编辑 -->
    <bs-edit
      :actived="editActive"
      :features="currentEditFeature"
      @modifystart="editFeatureStart"
      @modifyend="editFeatureEnd"
    ></bs-edit>
    <!-- <div id="Attribute-tooltip">
      <PTattribute id="Attribute-tooltip-div" />
    </div> -->
    <showLabel id="label-tooltip" />
    <!-- 全局变量监听展示 -->
    <section>
      <GlobalVarTable />
    </section>
  </bs-map>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureCtrl from './ctrl/featuresDraw'
import videoLayer from './layers/video'
import keyPartsLayer from './layers/keyParts'
import fireFightingLayer from './layers/firefighting'
import interComLayer from './layers/interCom'
import accessControlLayer from './layers/accessControl'
import generalLayers from './layers/generalLayers'
import importpart from './layers/importpart'
import symbolConfig from '../../../assets/2DMap/meta/SymbolConfig'
// 子组件
// import PTattribute from './../../map2D/PTattribute/PanelAttribute'
import showLabel from './../../map2D/PTattribute/showLabel'
// 全局变量监听组件
import GlobalVarTable from './components/GlobalVarTable'
export default {
  name: 'outer-map-edit',
  data() {
    return {
      currentEditFeature: null, // 当前编辑的要素
      showJur: true
    }
  },
  mixins: [
    baseCtrl, // 基础控制
    eventCtrl, // 地图事件
    featureCtrl, // 要素绘制
    fireFightingLayer, // 消防设备
    videoLayer, // 摄像机，录像机，报警设备

    generalLayers, //
    accessControlLayer, // 门禁设备和互锁门
    importpart, //
    keyPartsLayer, // 机构和重点部位
    interComLayer // 对讲设备和防护舱
  ],
  components: { showLabel, GlobalVarTable },
  computed: {
    ...mapState('map2d/mapIndex', [
      'mapConfig',
      'isEditPanelTools',
      'mapConfigDlgFormData',
      'nowSelectAreaInfo',
      'isMapEdit',
      'isRealData',
      'varNowZoom'
    ]),
    showFloorForm: ({ map2d }) => map2d.mapPanelSearch.showFloorForm, // 设置修改楼层弹框是否展示
    ...mapState({
      editActive: ({ map2d }) => map2d.mapPoint.editActive
    }),
    layerList() {
      return [
        // 下层区域(为表层级关系区域非点位图层均预先渲染)
        { layer: this.administrativeAreaLayer, features: this.administrativeAreaFeatures } // 行政区划
      ]
    },
    layerArr() {
      // 变量混入来自 baseMap/layers 下定义的各种图层
      return [
        // ------机构相关图层------
        { key: this.headLevelLayer, value: this.headLevelIcons }, // 总行
        { key: this.oneLevelLayer, value: this.oneLevelIcons }, // 一级分行
        { key: this.twoLevelLayer, value: this.twoLevelIcons }, // 二级分行
        { key: this.countyLevelLayer, value: this.countyLevelIcons }, // 县级行
        { key: this.directlyLevelLayer, value: this.directlyLevelIcons }, // 直属支行
        // ------重点部位相关图层------
        { key: this.businessOutletsLayer, value: this.businessOutletsIcons }, // 营业网点
        { key: this.vaultLayer, value: this.vaultIcons }, // 金库
        { key: this.computerRoomLayer, value: this.computerRoomIcons }, // 计算机房
        { key: this.officeBuildingLayer, value: this.officeBuildingIcons }, // 办公楼
        { key: this.selfServiceBankLayer, value: this.selfServiceBankIcons }, // 自助银行
        { key: this.selfServiceEquipmentLayer, value: this.selfServiceEquipmentIcons }, // 自助设备
        { key: this.selfServiceSilverLayer, value: this.selfServiceSilverIcons }, // 自助银亭
        { key: this.privateBankLayer, value: this.privateBankIcons }, // 私人银行
        { key: this.safeDepositLayer, value: this.safeDepositIcons }, // 保险箱库
        { key: this.archivesCenterLayer, value: this.archivesCenterIcons }, // 档案室
        { key: this.remoteControlCenterLayer, value: this.remoteControlCenterIcons }, // 远程监控中心
        { key: this.fiveGSmartBankingLayer, value: this.fiveGSmartBankingIcons }, // 5G + 智能银行
        { key: this.fortuneCenterLayer, value: this.fortuneCenterIcons }, // 财富中心
        { key: this.otherKeyPartsLayer, value: this.otherKeyPartsIcons }, // 其他重点部位
        { key: this.xuniLayer, value: this.xuniIcons }, // 虚拟重点部位
        // ------视频相关图层------
        { key: this.boltipcLayer, value: this.boltipcIcons }, // 视频-枪机
        { key: this.boltipcSectorLayer, value: this.boltipcSectors },
        { key: this.redBoltipcLayer, value: this.redBoltipcIcons }, // 视频-红外枪机
        { key: this.redBoltipcSectorLayer, value: this.redBoltipcSectors },
        { key: this.halfBallipcLayer, value: this.halfBallipcIcons }, // 视频-半球
        { key: this.halfBallipcSectorLayer, value: this.halfBallipcSectors },
        { key: this.fastBallipcLayer, value: this.fastBallipcIcons }, // 视频-快球
        { key: this.fastBallipcSectorLayer, value: this.fastBallipcSectors },
        { key: this.allViewipcLayer, value: this.allViewipcIcons }, // 视频-全景
        { key: this.allViewipcSectorLayer, value: this.allViewipcSectors },
        { key: this.pinholeipcLayer, value: this.pinholeipcIcons }, // 视频-针孔
        { key: this.pinholeipcSectorLayer, value: this.pinholeipcSectors },
        { key: this.smartIPCLayer, value: this.smartIPCIcons }, // 视频-智能IPC
        { key: this.smartIPCSectorLayer, value: this.smartIPCSectors },
        // ------视频主机相关图层------
        { key: this.videoRecorderLayer, value: this.videoRecorderIcons }, // 录像机
        // ------门禁相关图层------
        { key: this.doorControlLayer, value: this.doorControlIcons }, // 门禁主机
        { key: this.doorControlChannelLayer, value: this.doorControlChannelIcons }, // 门禁通道
        { key: this.doubleDoorLayer, value: this.doubleDoorIcons }, // 互锁门主机
        { key: this.doubleDoorChannelLayer, value: this.doubleDoorChannelIcons }, // 互锁门通道
        { key: this.importPartLayer, value: this.importPartIcons }, // 重点部位

        // { key: this.commonAlarmLayer, value: this.commonAlarmIcons }, // 报警主机 ------------------废弃
        // { key: this.detectorAlarmLayer, value: this.detectorAlarmIcons }, // 报警探测器 --------------------废弃
        // ------报警主机-报警主机相关图层------
        { key: this.telAlarmHostLayer, value: this.telAlarmHostIcons }, // 电话报警主机
        { key: this.networkAlarmHostLayer, value: this.networkAlarmHostIcons }, // 网络报警主机
        { key: this.fenceAlarmHostLayer, value: this.fenceAlarmHostIcons }, // 电子围栏总线报警主机
        { key: this.shakeAlarmHostLayer, value: this.shakeAlarmHostIcons }, // 震动光纤报警主机
        { key: this.electronicFenceLayer, value: this.electronicFenceIcons }, // 电子围栏总线报警主机
        // ------报警设备-报警设备相关图层------
        { key: this.wallDetectorLayer, value: this.wallDetectorIcons }, // 壁挂双鉴探测器
        { key: this.ceilingDetectorLayer, value: this.ceilingDetectorIcons }, // 吸顶双鉴探测器
        { key: this.atmShakeDetectorLayer, value: this.atmShakeDetectorIcons }, // ATM震动探测器
        { key: this.vaultShakeDetectorLayer, value: this.vaultShakeDetectorIcons }, // 金库震动探测器
        { key: this.doorMagneticDetectorLayer, value: this.doorMagneticDetectorIcons }, // 门磁探测器
        { key: this.glassBrokenDetectorLayer, value: this.glassBrokenDetectorIcons }, // 玻璃破碎探测器
        { key: this.smokeDetectorLayer, value: this.smokeDetectorIcons }, // 光电烟感探测器
        { key: this.pirCurtainDetectorLayer, value: this.pirCurtainDetectorIcons }, // 红外幕帘探测器
        { key: this.temperatureDetectorLayer, value: this.temperatureDetectorIcons }, // 温度探测器
        { key: this.leakDetectorLayer, value: this.leakDetectorIcons }, // 漏水探测器
        { key: this.voicedDangerButtonLayer, value: this.voicedDangerButtonIcons }, // 紧急按钮 (有声)
        { key: this.silentDangerButtonLayer, value: this.silentDangerButtonIcons }, // 紧急按钮 无声
        { key: this.correlationDetectorLayer, value: this.correlationDetectorIcons }, // 红外对射探测器
        { key: this.offsetDetectorLayer, value: this.offsetDetectorIcons }, // 位移探测器
        { key: this.shakeOpticalLayer, value: this.shakeOpticalIcons }, // 振动光纤
        // ------消防设备-报警设备相关图层------  功能预留位置,取消注释即可-shen

        { key: this.userInfoTransmissionDeviceLayer, value: this.userInfoTransmissionDeviceIcons }, //
        { key: this.firePumpMonitorLayer, value: this.firePumpMonitorIcons }, //
        { key: this.hydraulicSensorLayer, value: this.hydraulicSensorIcons }, //
        { key: this.liquidLevelSensorLayer, value: this.liquidLevelSensorIcons }, //
        { key: this.smokePreventionMonitorLayer, value: this.smokePreventionMonitorIcons }, //
        { key: this.gasMonitorLayer, value: this.gasMonitorIcons }, //
        { key: this.fireSeparationMonitorLayer, value: this.fireSeparationMonitorIcons }, //
        { key: this.electricalFireDetectorLayer, value: this.electricalFireDetectorIcons }, //
        // { key: this.residualCurrentTransformerLayer, value: this.residualCurrentTransformerIcons }, //
        // { key: this.currentTransformerLayer, value: this.currentTransformerIcons }, //
        // { key: this.temperatureSensorLayer, value: this.temperatureSensorIcons }, //
        // { key: this.faultArcDetectorLayer, value: this.faultArcDetectorIcons }, //
        { key: this.independentSmokeDetectorLayer, value: this.independentSmokeDetectorIcons }, //
        { key: this.independentTemperatureSensorLayer, value: this.independentTemperatureSensorIcons }, //
        { key: this.independentCombustibleGasDetectorLayer, value: this.independentCombustibleGasDetectorIcons }, //
        // ------对讲相关图层------
        { key: this.speechLayer, value: this.speechIcons }, // 对讲主机
        { key: this.speechChannelLayer, value: this.speechChannelIcons }, // 对讲通道
        // ------防护舱相关图层------
        { key: this.cabinLayer, value: this.protectiveCabinIcons }, // 防护舱
        { key: this.cabinChannelLayer, value: this.protectiveCabinChanneIcons }, // 防护舱通道
        // ------高亮定位图层------
        { key: this.highLightLocateLayer, value: this.highLightLocateIcons } // 高亮定位
      ]
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setNowSelectWKTAreaInfo',
      'setIsMapEdit',
      'getDistrictSetting',
      'setPanelInfoStatus'
    ]),
    ...mapActions('map2d/pointMapShow', ['setFeatures', 'setNowSetTimeOut']),
    ...mapActions('map2d/mapPanelSearch', ['setShowFloorForm']),
    initArrributeOverlay() {
      // let featureElement = document.getElementById('Attribute-tooltip')
      // window.$context2D.nowOverlayArrribute = new window.$context2D.ol.Overlay({
      //   id: 'overlay0_' + new Date().getTime(),
      //   element: featureElement,
      //   offset: [-170, 240],
      //   position: [12971547.26829515, 48596082.86922005]
      // })
    },
    initLabelOverlay() {
      let featureElementLabel = document.getElementById('label-tooltip')
      window.$context2D.nowOverlayLabel = new window.$context2D.ol.Overlay({
        id: 'overlay1_' + new Date().getTime(),
        element: featureElementLabel,
        offset: [-75, 25],
        position: [12971547.26829515, 48596082.86922005]
      })
      window.$context2D.map.addOverlay(window.$context2D.nowOverlayLabel)
    },
    showJurisdiction() { // 获取点位详情权限设置
      this.showJur = false
    }
  },
  mounted() {
  },
  created() {
    this.showJurisdiction() // 获取点位详情权限设置
    this.setIsMapEdit(true)
    this.setPanelInfoStatus(false)
  },
  beforeDestroy() {
    this.clearAllMapPoints() // 清空地图点位
    this.setDrawActive({ active: false }) // 关闭绘制状态
    this.setEditActive(false) // 关闭要素编辑状态
  }
}
</script>
<style lang="less" scoped>
#Attribute-tooltip {
  width: 340px;
  height: 250px;
}
#Attribute-tooltip-div {
  position: absolute;
  bottom: 10px;
}
.map-edit-home {
  width: 100%;
  height: 100%;
  // 地图比例尺样式
  /deep/ .ol-scale-line {
    left: 304px;
  }
  // 地图指北针
  /deep/.hmap-rotate-control {
    left: 312px;
    right: unset;
    top: 60px;
    bottom: unset;
  }
}
</style>
