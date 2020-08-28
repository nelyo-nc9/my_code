<!--
 * @Author: fengbeibei
 * @Date: 2020-06-01 09:25:50
 * @LastEditors: fengbeibei
 * @LastEditTime: 2020-06-05 18:33:34
 * @Description: 环境平面图及室内平面图
-->
<template>
  <bs-staticmap
    class="map-home"
    :projection="mapConfig.projection"
    :url="staticMapConfig.mapUrl"
    :center="staticMapConfig.center"
    :extent="staticMapConfig.extent"
    :minZoom="2"
    :maxZoom="28"
    ref="mapFloorContainer"
    @ready="bsMapReady"
    @singleclick="handleMapClick"
    @dblclick="handleMapDBClick"
    @zoom="handleMapZoomChange"
    @mousemove="handkeMapMouseMove"
  >
    <!-- 环境平面图 -->
    <bs-staticlayer
      ref="outdoorLayer"
      v-if="!floorMap.isFloor"
      :url="outdoorLayerConfig.url"
      :extent="outdoorLayerConfig.extent"
    />
    <!-- 室内平面图 -->
    <bs-staticlayer
      ref="indoorLayer"
      v-else-if="floorMap.isFloor"
      :url="indoorLayerConfig.url"
      :extent="indoorLayerConfig.extent"
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
    <!-- <showLabel id="label-tooltip" /> -->
    <!-- 返回按钮 -->
    <div id="u178162" class="ax_default n-box_2">
      <div id="u178162_div" class></div>
      <div id="u178162_text" class="text">
        <p>
          <span v-if="!this.floorMap.isFloor" style="font-family:'MicrosoftYaHei', '微软雅黑';font-weight:400;"
            >环境平面图</span
          >
          <span v-else-if="this.floorMap.isFloor" style="font-family:'MicrosoftYaHei', '微软雅黑';font-weight:400;"
            >楼层平面图</span
          >
        </p>
      </div>
    </div>
    <div id="u178161" class="ax_default _图片" style="cursor: pointer;" @click="gobackEnvironmentPlan">
      <img id="u178161_img" class="img" src="/static/map2d/u176345.png" />
    </div>
    <showLabel id="label-tooltip" />
  </bs-staticmap>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { each, filter, cloneDeep } from 'lodash'
// import { insidePolygon } from '../utils'
import drawStyleMap from '../../../assets/2DMap/meta/drawStyle'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureCtrl from './ctrl/featuresDraw'
import videoLayer from './layers/video'
import fireFightingLayer from './layers/firefighting'
import keyPartsLayer from './layers/keyParts'
import interComLayer from './layers/interCom'
import accessControlLayer from './layers/accessControl'
import generalLayers from './layers/generalLayers'
import importpart from './layers/importpart'
import showLabel from './../../map2D/PTattribute/showLabel'
export default {
  name: 'building-map',
  data() {
    return {
      currentEditFeature: null // 当前编辑的要素
    }
  },
  components: { showLabel },
  mixins: [
    baseCtrl, // 基础控制
    eventCtrl, // 地图事件
    featureCtrl, // 要素绘制
    videoLayer, // 摄像机，录像机，报警设备
    fireFightingLayer, // 消防设备
    generalLayers, //
    accessControlLayer, // 门禁设备和互锁门
    importpart, //
    keyPartsLayer, // 机构和重点部位
    interComLayer // 对讲设备和防护舱
  ],
  computed: {
    ...mapState('map2d/mapIndex', [
      'staticMapConfig',
      'currDrawType',
      'drawActive',
      'drawStyleType',
      'floorMap',
      'indoorLayerConfig',
      'outdoorLayerConfig'
    ]),
    showFloorForm: ({ map2d }) => map2d.mapPanelSearch.showFloorForm, // 设置修改楼层弹框是否展示
    ...mapState('map2d/mapPoint', [
      'curSelectResourcePoint' // 当前点位信息
    ]),
    ...mapState('map2d/mapPanelSearch', [
      'selectedTreeCode' // 当前点位信息
    ]),
    drawStyle() {
      let style = cloneDeep(this.drawStyleType)
      if (style && typeof style === 'object') {
        return style
      } else {
        return drawStyleMap[this.drawStyleType] || drawStyleMap['default']
      }
    },
    // 矢量图层数据
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

        { key: this.userInfoTransmissionDeviceLayer, value: this.userInfoTransmissionDeviceIcons }, // 用户信息传输装置
        { key: this.firePumpMonitorLayer, value: this.firePumpMonitorIcons }, // 消防泵监测仪
        { key: this.hydraulicSensorLayer, value: this.hydraulicSensorIcons }, // 液压传感器
        { key: this.liquidLevelSensorLayer, value: this.liquidLevelSensorIcons }, // 液位传感器
        { key: this.smokePreventionMonitorLayer, value: this.smokePreventionMonitorIcons }, // 防排烟监测仪
        { key: this.gasMonitorLayer, value: this.gasMonitorIcons }, // 气体监测仪
        { key: this.fireSeparationMonitorLayer, value: this.fireSeparationMonitorIcons }, // 防火分隔监测仪
        { key: this.electricalFireDetectorLayer, value: this.electricalFireDetectorIcons }, // 电气火灾探测器
        { key: this.independentSmokeDetectorLayer, value: this.independentSmokeDetectorIcons }, // 独立烟感探测器
        { key: this.independentTemperatureSensorLayer, value: this.independentTemperatureSensorIcons }, // 独立温感探测器
        { key: this.independentCombustibleGasDetectorLayer, value: this.independentCombustibleGasDetectorIcons }, // 独立可燃气体探测器
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
      'setDrawResult',
      'setDrawActive',
      'setCurrPanelToolComponent',
      'setShowFloorInfo',
      'setIsMapOuter',
      'setIsFloorMap',
      'setindoorInformation', // 楼层平面图最新信息
      'setenvironmentalScienceInformation'
    ]),
    ...mapActions('map2d/mapPoint', [
      'setCurrentSelectResource' // 当前点位信息
    ]),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode', 'setShowFloorForm']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG', 'BUILDING_DIRECTORY' // 楼层索引现因控制 机构重点部位树下面的
    ]),
    // 处理绘制完成
    handleDrawEnd11(v) {
      // const { coods } = v || {}
      const result = {} // 绘制筛选结果
      this.setDrawResult(result) // 保存筛选结果
      this.setCurrPanelToolComponent('BoxSelectStatistic') // 设置右侧面板为筛选统计面板
      this.setPanelInfoStatus(true) // 显示右侧面板
      setTimeout(() => {
        this.setDrawActive({ active: false }) // 关闭绘制
      }, 300) // 延迟关闭绘制功能
    },
    gobackEnvironmentPlan() {
      this.curSelectResourcePoint && this.setCurrentSelectResource(null) // 清空当前选中编辑的点位信息
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setindoorInformation(null) // 楼层平面图最新信息
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      if (this.floorMap.isFloor) {
        this.BUILDING_DIRECTORY(false) // 楼层索引现因控制 机构重点部位树下面的
        this.setShowFloorInfo(true) // 如果是楼层平面图 跳转到地图
        this.setIsMapOuter(1)
      } else if (this.isMapOuter === 2) {
        this.setIsMapOuter(1) // 如果是环境平面图 跳转到地图
        this.setShowFloorInfo(true)
      }
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
    getImageWidthAndHeight(imageUrl, callback) {
      const img_url = imageUrl
      let img = new Image()
      img.src = img_url
      img.onload = function() {
        let img_width = img.width === 0 ? 0.00001 : img.width
        let img_height = img.height === 0 ? 0.00001 : img.height
        if (img_width / img_height > 2) {
          img_height = (img_height / img_width) * 180
          img_width = 180
        } else {
          img_width = (img_width / img_height) * 90
          img_height = 90
        }
        callback([-img_width, -img_height, img_width, img_height])
      }
    }
  },
  beforeMount() {
    this.setCurrentSelectResource(null)
  },
  mounted() {
    let nowThis = this
    console.log('进入地图', this)
    this.getImageWidthAndHeight(
      !this.floorMap.isFloor ? this.outdoorLayerConfig.url : this.indoorLayerConfig.url,
      function(extent) {
        console.log(extent)
        nowThis.UPDATE_INDOOR_LAYER_CONFIG({ key: 'extent', value: extent })
        nowThis.UPDATE_OUTDOOR_LAYER_CONFIG({ key: 'extent', value: extent })
      }
    )
  },
  beforeDestroy() {
    this.clearAllMapPoints() // 清空地图点位
    this.setDrawActive({ active: false }) // 关闭绘制状态
    this.setEditActive(false) // 关闭要素编辑状态
  }
}
</script>
<style lang="less" scoped>
.map-home {
  height: 100%;
  width: 100%;
}
#u178162 {
  border-width: 0px;
  position: absolute;
  left: 333px;
  top: 8px;
  width: 207px;
  height: 40px;
  font-family: '微软雅黑 Regular', '微软雅黑';
  font-weight: 400;
  font-style: normal;
  color: #3482F0;
  text-align: center;
}

#u178162_div {
  border-width: 0px;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 207px;
  height: 40px;
  background: inherit;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.26);
  border: none;
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  font-family: '微软雅黑 Regular', '微软雅黑';
  font-weight: 400;
  font-style: normal;
  color: #ffffff;
  text-align: center;
  border-radius: 2px;
}
#u178162_text {
  border-width: 0px;
  position: absolute;
  left: 2px;
  top: 12px;
  width: 203px;
  word-wrap: break-word;
}

#u178161 {
  border-width: 0px;
  position: absolute;
  left: 342px;
  top: 22px;
  width: 7px;
  height: 12px;
}

#u178161_img {
  border-width: 0px;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 7px;
  height: 12px;
}
</style>
