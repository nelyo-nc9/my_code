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
    :showRotate="true"
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
      v-for="{ layer: l, features } in layerList"
      :key="l.id"
      :id="l.id"
      :name="l.name"
      :features="features"
      :type="l.type"
      :zIndex="10"
      :extent="staticMapConfig.extent"
    />
    <!-- 绘制工具 -->
    <bs-draw
      id="draw"
      :type="currDrawType"
      :actived="drawActive"
      :drawStyle="drawStyle"
      :layerStyle="drawEndStyle"
      @drawend="handleDrawEnd"
    />
    <!-- 返回按钮 -->

    <div id="u178162" class="ax_default n-box_2" @click="gobackEnvironmentPlan">
      <div id="u178162_div" class></div>
      <div id="u178162_text" class="text">
        <p>
          <span v-if="!this.floorMap.isFloor" style="font-family:'MicrosoftYaHei', '微软雅黑';font-weight:400;"
            >环境平面图</span
          >
          <span v-else-if="this.floorMap.isFloor" style="font-family:'MicrosoftYaHei', '微软雅黑';font-weight:400;"
            >楼层平面图</span
          >
          <!-- <span style="font-family:'MicrosoftYaHei', '微软雅黑';font-weight:400;"> {{ title }}</span> -->
        </p>
      </div>
    </div>
    <div id="u178161" class="ax_default _图片" style="cursor: pointer;" @click="gobackEnvironmentPlan">
      <img id="u178161_img" class="img" src="/static/map2d/u176345.png" />
    </div>
    <div id="Attribute-tooltip">
      <PTattribute id="Attribute-tooltip-div" />
    </div>
    <showLabel v-show="isShowLabel" id="label-tooltip"></showLabel>
  </bs-staticmap>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { each, filter, cloneDeep } from 'lodash'
import drawStyleMap from '../../../assets/2DMap/meta/drawStyle'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import layer from './layers/layer'
import commonLayer from './layers/commonLayer'
import featureCtrl from './ctrl/featuresDraw'
import PTattribute from './../PTattribute/PanelAttribute'
import showLabel from './../PTattribute/showLabel'
export default {
  name: 'building-map',
  data() {
    return {
      isShowAttribute: true,
      isShowLabel: true,
      title: '环境平面图'
    }
  },
  mixins: [baseCtrl, eventCtrl, layer, commonLayer, featureCtrl],
  components: { PTattribute, showLabel },
  computed: {
    ...mapState('map2d/mapIndex', [
      // 'isMapOuter',
      'staticMapConfig',
      'currDrawType',
      'drawActive',
      'drawStyleType',
      'floorMap',
      'indoorLayerConfig',
      'outdoorLayerConfig'
    ]),
    ...mapState({
      selectedTreeNodeApply: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNodeApply, // 当前选中的树节点
      clickTreeNode: ({ map2d }) => map2d.mapIndex.clickTreeNode //  当前设置的定位 树节点
    }),
    // drawStyle() {
    //   let style = cloneDeep(this.drawStyleType)
    //   if (style && typeof style === 'object') {
    //     return style
    //   } else {
    //     return drawStyleMap[this.drawStyleType] || drawStyleMap['default']
    //   }
    // },
    // 矢量图层数据
    layerList() {
      return [
        // 上层点位
        { layer: this.cameraSectorLayer, features: this.cameraSectorFeatures }, // 摄像机扇形可视域图层
        { layer: this.associationLayer, features: this.associationFeatures }, // 关联关系
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
    }
  },
  watch: {
    // 设置上方返回按钮 处的title 文字
    // floorMap: {
    //   immediate: true,
    //   handler(newValue, oldValue) {
    //     if (newValue) {
    //       if (newValue.pointObj) {
    //         this.title = newValue.pointObj.name
    //       }
    //     }
    //   },
    //   deep: true
    // },
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
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setDrawResult',
      'setDrawActive',
      'setCurrPanelToolComponent',
      'setShowFloorInfo',
      'setIsMapOuter',
      'setIsFloorMap'
    ]),
    ...mapMutations('map2d/mapIndex', [
      'UPDATE_INDOOR_LAYER_CONFIG',
      'UPDATE_OUTDOOR_LAYER_CONFIG',
      'CLEAR_BOX_SELECTTION_ARR',
      'UPDATE_IS_REAL_DATA'
    ]),

    gobackEnvironmentPlan() {
      let data = {
        pointObj: null,
        id: '',
        isFloor: false
      }
      this.setIsFloorMap(data)
      this.setIsMapOuter(1)
      this.setShowFloorInfo(false)
      this.setClickTreeNode(null)
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
  mounted() {
    let nowThis = this
    this.getImageWidthAndHeight(
      !this.floorMap.isFloor ? this.outdoorLayerConfig.url : this.indoorLayerConfig.url,
      function(extent) {
        nowThis.UPDATE_INDOOR_LAYER_CONFIG({ key: 'extent', value: extent })
        nowThis.UPDATE_OUTDOOR_LAYER_CONFIG({ key: 'extent', value: extent })
      }
    )
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
.map-home {
  height: 100%;
  width: 100%;
}
#u178162 {
  cursor: pointer;
  border-width: 0px;
  position: absolute;
  left: 333px;
  top: 8px;
  width: 207px;
  height: 40px;
  font-family: '微软雅黑 Regular', '微软雅黑';
  font-weight: 400;
  font-style: normal;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: -1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  color: #333;
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

  border: none;
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  font-family: '微软雅黑 Regular', '微软雅黑';
  font-weight: 400;
  font-style: normal;
  color: #333;
  text-align: center;
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
#label-tooltip {
  z-index: 1000;
}
</style>
