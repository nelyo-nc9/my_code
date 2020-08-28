<!--
 * @Author: fengbeibei
 * @Date: 2020-05-21 13:30:49
 * @LastEditTime: 2020-06-05 11:38:00
 * @LastEditors: fengbeibei
 * @Description: 地图外壳组件
-->
<template>
  <div style="width: 100%; height: 100%;">
    <bs-map
      class="map-home"
      :projection="mapConfig.projection"
      :center="mapConfig.center"
      :zoom="mapConfig.zoom"
      :minZoom="mapConfig.minZoom"
      :maxZoom="mapConfig.maxZoom"
      :panFactor="mapConfig.panFactor"
      @ready="bsMapReady"
      :showRotate="true"
      @singleclick="handleMapClick"
      @dblclick="handleMapDBClick"
      @zoom="handleMapZoomChange"
      @mousemove="handkeMapMouseMove"
      @moveend="moveend"
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
      <bs-layer
        v-for="{ layer: l, features } in layerList"
        :key="l.id"
        :id="l.id"
        :name="l.name"
        :features="features"
        :type="l.type"
        :zIndex="l.zIndex"
      />
      <!-- 导航缩放工具 -->
      <bs-navzoombar :navZoomStyle="navZoomStyle"></bs-navzoombar>
      <!-- 绘制工具 -->
      <bs-draw
        id="draw"
        :type="currDrawType"
        :actived="drawActive"
        :drawStyle="drawStyle"
        :layerStyle="drawEndStyle"
        @drawend="handleDrawEnd"
      />
      <!-- 面积测量 -->
      <bs-measure id="measure" :type="currMeasureType" :actived.sync="measureActived" :clear.sync="clear" />
      <!-- 信息提示框  -->
      <bs-infowindow
        class="feature-infoPanel"
        v-if="!isInfoPanelFixed && showMapResourceAttributes"
        :position="mapResourceAttributes.position"
      >
        <component :is="mapResourceAttributes.type"></component>
      </bs-infowindow>

      <!-- 初始不显示的组件，零散弹框面板 -->
      <div id="Attribute-tooltip">
        <PTattribute id="Attribute-tooltip-div" />
      </div>

      <showLabel v-show="isShowLabel" id="label-tooltip"></showLabel>
      <weatherTooltip v-show="isShowWeather" id="weather-tooltip"></weatherTooltip>
      <el-button id="el-button" size="mini" round @click="updateIsRealData">切换数据</el-button>
    </bs-map>
  </div>
</template>
<script>
import { cloneDeep, each, find, filter, map } from 'lodash'
import { getBoxSelectionApi } from '@src/http/map2D/point.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import drawStyleMap from '../../../assets/2DMap/meta/drawStyle'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureCtrl from './ctrl/featuresDraw'
import layer from './layers/layer'
import poiLayer from './layers/poiLayer'
import commonLayer from './layers/commonLayer'
import AttrAlarm from '../PTattribute/attributes/AttrAlarm'
import AttrDoorControl from '../PTattribute/attributes/AttrDoorControl'
import AttrVideo from '../PTattribute/attributes/AttrVideo'
import { insidePolygon } from '../utils'
import { loadWeatherAreaDataToMap, aaa } from '@src/assets/2DMap/utils/mapInit'
import PTattribute from './../PTattribute/PanelAttribute'
import weatherTooltip from './../PTattribute/weatherTooltip'
import showLabel from './../PTattribute/showLabel'
import { getpoiTypeAll } from '../../../assets/2DMap/meta/poiTypeAll'
import { getTestDataFeatures, addPoiPointsDataByCode } from '../../../assets/2DMap/utils/poiInitUtil'
import { EnglishNamePrefix } from 'assets/2DMap/meta/common'
import {
  DEVICETYPE,
  KEYPARTTYPE,
  VIDEOTYPEKEY,
  ALARMDEVICETYPE,
  ACCESSDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  AllRESOURCEARR,
  SUBTYPEOBJ,
  SUBTYPEOBJTRANSATE
} from '../../../assets/2DMap/meta/common'
import symbolConfig from '../../../assets/2DMap/meta/SymbolConfig'
export default {
  name: 'outer-map',
  data() {
    return {
      isDistrict: false,
      isShowLabel: true,
      isShowWeather: true,
      overlay: null,
      result: {},
      selectArr: [],
      clear: true,
      indoorLayerConfig: {
        extent: []
      },
      nowSelectPoiIsUse: true, // 当前请求兴趣点是否被锁定
      nowSelectPoiIsSave: false // 当前请求兴趣点是否保存操作
    }
  },
  components: { AttrAlarm, AttrDoorControl, AttrVideo, PTattribute, weatherTooltip, showLabel },
  mixins: [baseCtrl, eventCtrl, layer, poiLayer, commonLayer, featureCtrl],
  computed: {
    ...mapState('map2d/mapIndex', [
      'mapConfig',
      'currDrawType',
      'drawActive',
      'currMeasureType',
      'measureActive',
      'drawStyleType',
      'drawResult',
      'mapConfigDlgFormData',
      'nowSelectAreaInfo',
      'administrativeAreaInfo',
      'nowSelectWeatherAreaInfo',
      'nowSelectAreaWKTInfo',
      'routePlanInfo',
      'isMapEdit',
      'isRealData',
      'mapToolbarStatus',
      'selectPoiPoint'
    ]),
    ...mapGetters('map2d/mapIndex', ['boxSelectionArr', 'checkedEquipments']),
    ...mapGetters('map2d/pointMapShow', ['isInfoPanelFixed', 'showMapResourceAttributes', 'mapResourceAttributes']),
    // 矢量图层数据
    layerList() {
      return [
        // 下层区域(为表层级关系区域非点位图层均预先渲染)
        { layer: this.administrativeAreaLayer, features: this.administrativeAreaFeatures }, // 行政区划
        { layer: this.routePlanLayer, features: this.routePlanFeatures }, // 线路规划
        { layer: this.associationLayer, features: this.associationFeatures }, // 线路规划

        { layer: this.poi_cy_11Layer, features: this.poi_cy_11Features }, // 餐饮
        // { layer: this.poi_cy_12Layer, features: this.poi_cy_12Features }, // 住、宿
        // { layer: this.poi_cy_13Layer, features: this.poi_cy_13Features }, // 批发、零售
        // { layer: this.poi_cy_14Layer, features: this.poi_cy_14Features }, // 汽车销售及服务
        // { layer: this.poi_cy_15Layer, features: this.poi_cy_15Features }, // 金融、保险
        // { layer: this.poi_cy_16Layer, features: this.poi_cy_16Features }, // 教育、文化
        // { layer: this.poi_cy_17Layer, features: this.poi_cy_17Features }, // 卫生、社保
        // { layer: this.poi_cy_18Layer, features: this.poi_cy_18Features }, // 运动、休闲
        // { layer: this.poi_cy_19Layer, features: this.poi_cy_19Features }, // 公共设施
        // { layer: this.poi_cy_20Layer, features: this.poi_cy_20Features }, // 商业设施、商务服务
        // { layer: this.poi_cy_21Layer, features: this.poi_cy_21Features }, // 居民服务
        // { layer: this.poi_cy_22Layer, features: this.poi_cy_22Features }, // 公司企业
        // { layer: this.poi_cy_23Layer, features: this.poi_cy_23Features }, // 交通运输、仓储
        // { layer: this.poi_cy_24Layer, features: this.poi_cy_24Features }, // 科研及技术服务
        // { layer: this.poi_cy_25Layer, features: this.poi_cy_25Features }, // 农林牧渔业
        // { layer: this.poi_cy_26Layer, features: this.poi_cy_26Features }, // 自然地物\地名

        { layer: this.weatherAreaLayer, features: this.weatherAreaEndFeatures }, // 天气
        { layer: this.cameraSectorLayer, features: this.cameraSectorFeatures }, // 摄像机扇形可视域图层
        { layer: this.importPartLayer, features: this.importPartFeatures }, // 机构
        { layer: this.keyPartsLayer, features: this.keyPartsFeatures }, // 重点部位
        { layer: this.cameraLayer, features: this.cameraFeatures }, // 摄像机

        { layer: this.recorderLayer, features: this.recorderFeatures }, // 录像机
        { layer: this.alarmLayer, features: this.alarmFeatures }, // 报警设备
        { layer: this.alarmRangeLayer, features: this.alarmRangeFeatures }, // 报警设备探测范围
        { layer: this.fireFightingLayer, features: this.fireFightingFeatures }, // 消防设备
        { layer: this.intercomLayer, features: this.intercomFeatures }, // 对讲设备
        { layer: this.accessLayer, features: this.accessFeatures }, // 门禁设备
        { layer: this.protectedCabinLayer, features: this.protectedCabinFeatures } // 防护舱
      ]
    },
    // 子组件内部修改通过父组件传入的store值
    measureActived: {
      get() {
        return this.measureActive
      },
      set(v) {
        this.setMeasureActive({ active: v })
      }
    }
    // drawStyle() {
    //   let style = cloneDeep(this.drawStyleType)
    //   if (style && typeof style === 'object') {
    //     return style
    //   } else {
    //     return drawStyleMap[this.drawStyleType] || drawStyleMap['default']
    //   }
    // }
  },
  watch: {
    // state.drawActive状态监听
    drawActive(newValue, oldValue) {
      if (newValue) {
        // 如果激活绘制先清除绘制图层
        const { map } = window.$context2D
        const layers = map.getLayers().getArray()
        const drawLayer = find(layers, l => l.get('id') === 'draw')
        if (drawLayer) {
          drawLayer.getSource().clear()
        }
      }
    },
    currDrawType(newValue, oldValue) {
      let obj = {
        access: [],
        alarm: [],
        camera: [],
        fireFighting: [],
        importPart: [],
        intercom: [],
        keyParts: [],
        protectedCabin: [],
        recorder: []
      }
      if (newValue !== 'Point' && oldValue !== 'Point') {
        this.setDrawResult(obj)
      }
    },
    '$store.state.map2d.mapIndex.mapToolbarStatus.measureControl'(newVlue) {
      console.log('mapToolbarStatus', newVlue, this)
      this.clear = !newVlue
    },
    '$store.state.map2d.mapIndex.nowSelectAreaWKTInfo'(newObj, oldObj) {
      this.isDistrict = true
      console.log('监听点击行政区域')
    },
    '$store.state.map2d.mapIndex.nowSelectWeatherAreaInfo'(newValue, oldValue) {
      console.log('地图点击天气区域改变', newValue)
      if (!this.mapToolbarStatus.weatherControl) {
        return
      }
      if (newValue.level === 3 || newValue.adcode === 810000 || newValue.adcode === 820000) {
        loadWeatherAreaDataToMap(cloneDeep([newValue]), this)
      } else if (newValue.childData) {
        loadWeatherAreaDataToMap(cloneDeep(newValue.childData), this)
      } else {
        this.getTreeApiSubaAreaInfo({ adcode: newValue.adcode })
          .then(res => {
            console.log('res', res)
            if (res.data && res.data.areas) {
              loadWeatherAreaDataToMap(cloneDeep(res.data.areas), this)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    '$store.state.map2d.mapIndex.mapToolbarStatus.weatherControl'(newValue, oldValue) {
      console.log('检测改变1', newValue, oldValue)
      if (!newValue) {
        // 不加载天气
        this.setPanelInfoStatus(false) // 隐藏右侧面板
        this.setFeatures({ type: 'weatherArea', features: [] }) // 请求加载要素
      }
      this.listenPageOrSelectAreaChange()
    },
    // '$store.state.map2d.mapIndex.nowSelectRealtionInfo'(newValue, oldValue) {
    //   console.log('检测到关联关系设备的结果', newValue, oldValue)
    //   if (newValue) {
    //     // 查看关联关系的设备
    //     this.setPanelInfoStatus(true) // 显示右侧面板
    //     this.setCurrPanelToolComponent('RealtionEquipment')
    //   } else {
    //     this.setPanelInfoStatus(false) // 隐藏右侧面板
    //   }
    // },
    '$store.state.map2d.mapIndex.selectPoiPoint'(newValue, oldValue) {
      // console.log(newValue, oldValue)
      this.updatePoiRequestData()
    },
    // '$store.state.map2d.mapIndex.mapToolbarStatus.selectionControl'(newValue, oldValue) {
    //   if (!newValue && oldValue) {
    //     this.CLEAR_BOX_SELECTTION_ARR()
    //     let obj = {
    //       access: [],
    //       alarm: [],
    //       camera: [],
    //       fireFighting: [],
    //       importPart: [],
    //       intercom: [],
    //       keyParts: [],
    //       protectedCabin: [],
    //       recorder: []
    //     }
    //     this.setDrawResult(obj)
    //   }
    // },
    '$store.state.map2d.mapIndex.alarmSetting.alarmPushInfo'(newValue, oldValue) {
      // 开启报警功能
      if (newValue && newValue.length !== 0 && newValue.length > oldValue.length && this.alarmSetting.isLocation) {
        this.inFloorByPointId(newValue[newValue.length - 1].pointId)
      }
    }
  },
  beforeMount() {
    // this.SET_SHOW_ALARM_FLOORS(false)
    this.UPDATE_NOW_ZOOM(10)
  },
  mounted() {
    console.log('EnglishNamePrefix', EnglishNamePrefix)
    this.setDrawActive({ active: false, type: 'Point', styleType: null })
    this.setFeatures({ type: 'weatherArea', features: [] }) // 请求加载要素
    if (!this.$store.state.map2d.mapIndex.isRealData) {
      // 如果是假数据，使用此编码
      let poiArr = getpoiTypeAll()
      console.log('poiArr', poiArr)
      let poiLayers = getTestDataFeatures(poiArr, this)
      console.log('poiLayers', poiLayers)
      for (let item in poiLayers) {
        this.setFeatures({ type: item, features: poiLayers[item] })
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setDrawResult',
      'setDrawActive',
      'setMeasureActive',
      'setCurrPanelToolComponent',
      'setNowSelectWeatherAreaInfo',
      'getTreeApiSubaAreaInfo',
      'setNowSelectWKTAreaInfo',
      'setRoutePlanInfo',
      'setIsMapEdit',
      'getDistrictSetting',
      'setPanelInfoStatus',
      'setCheckedEquipments',
      'setMapToolbarStatus'
    ]),
    ...mapMutations('map2d/mapIndex', ['CLEAR_BOX_SELECTTION_ARR', 'UPDATE_IS_REAL_DATA', 'SET_SHOW_ALARM_FLOORS']),
    ...mapActions('map2d/pointMapShow', ['setFeatures', 'setNowSetTimeOut']),
    ...mapActions('map2d/mapIndex', ['getBoxSelection']),
    updatePoiRequestData() {
      // 如果是建行测试环境，则加载兴趣点数据
      if (!this.$store.state.map2d.mapIndex.isRealData && window.$context2D.map.getView().getZoom() < 15) {
        return
      }
      let selectPoiPoint = cloneDeep(this.selectPoiPoint)
      let poiArr = []
      selectPoiPoint.forEach(item => {
        if (item.value && item.id.length === 6) {
          poiArr.push(item.id)
        }
      })
      if (poiArr.length === 0) {
        this.setFeatures({ type: `poi_cy_11`, features: [] })
        return
      }
      // 判断当前请求是否解决，如果没有保存操作
      if (!this.nowSelectPoiIsUse) {
        this.nowSelectPoiIsSave = true
        return
      }
      let _this = this
      // 如果当前请求3秒内没有结束，设置请求结束
      setTimeout(() => {
        _this.nowSelectPoiIsUse = true
        // 释放保存操作
        if (_this.nowSelectPoiIsSave) {
          _this.updatePoiRequestData()
          _this.nowSelectPoiIsSave = false
        }
      }, 3000)
      _this.nowSelectPoiIsUse = false // 锁定兴趣点请求
      _this.nowSelectPoiIsSave = false // 释放保存操作
      addPoiPointsDataByCode(this.nowSelectAreaInfo.adcode.toString(), poiArr, this, function() {
        console.log('兴趣点加载完成，回调函数调用')
        _this.nowSelectPoiIsUse = true
        // 释放保存操作
        if (_this.nowSelectPoiIsSave) {
          _this.updatePoiRequestData()
          _this.nowSelectPoiIsSave = false
        }
      })
    },
    listenPageOrSelectAreaChange() {
      console.log('检测到改变', this.$store.state.map2d.mapIndex.isMapOuter, this.nowSelectAreaInfo)
      if (this.mapToolbarStatus.weatherControl) {
        console.log('请求区域信息并加载天气子区域')
        this.setPanelInfoStatus(true) // 显示右侧面板
        this.setCurrPanelToolComponent('WeatherList')
        this.setNowSelectWeatherAreaInfo(cloneDeep(this.nowSelectAreaInfo))
      } else {
        this.setFeatures({ type: 'weatherArea', features: [] }) // 请求加载要素
      }
    },
    updateIsRealData() {
      this.UPDATE_IS_REAL_DATA()
    },
    changeShowModel() {
      console.log('changeShowModel')
    },
    currentPopupTop() {}
  },
  created() {
    this.setIsMapEdit(false)
    this.setPanelInfoStatus(false)
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
#el-button {
  position: absolute;
  left: 380px;
  top: 10px;
}
.map-home {
  width: 100%;
  height: 100%;
  // 地图比例尺样式
  /deep/.ol-scale-line {
    left: 374px;
  }
  // 地图指北针
  /deep/.hmap-rotate-control {
    left: 372px;
    right: unset;
    top: 60px;
    bottom: unset;
  }
}
</style>
