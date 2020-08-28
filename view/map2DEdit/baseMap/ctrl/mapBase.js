import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'

import { DEVICETYPE } from 'assets/2DMap/meta/common'
export default {
  data() {
    return {
      floorOneData: {
        center: [],
        extent: [],
        mapUrl: ''
      },
      keyTypes: {},
      context: null,
      count: 0,
      twinkFlag: false,
      twinkleCounter: 0 // 闪烁计数器
    }
  },
  computed: {
    ...mapState({
      // floorData: ({ tdFloor }) => tdFloor.floorData,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 三维地图和楼层平面图切换的标识
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式---
      buildingArr: ({ tdPoint }) => tdPoint.buildingArr,
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap // 图层设置map(key: 图层名称， value: 图层设置信息)
    })
  },
  watch: {
    twinkFlag(val) {
      if (val) {
        this.alarmTwink3D(this.buildingArr)
      } else {
        this.alarmTwink3D([])
      }
    },
    // 监听楼层数据的变化切换楼层地图
    floorData(val) {
      if (val) {
        let width = 200
        let height = 100
        let floor = JSON.parse(JSON.stringify(val))
        if (floor.picture.size) {
          width = floor.picture.size.width
          height = floor.picture.size.height
        }
        this.floorOneData.center = floor.bid.center.split(',').map(item => Number(item))
        let levelExtent = utils.getExtent(this.floorOneData.center, [width, height])
        this.floorOneData.extent = levelExtent
        this.floorOneData.mapUrl = '/api/upload?id=' + floor.picture.id
        // 加载楼层中点位控制列表默认要显示的点位-----
        this.displayAllFloorResourcePoint()
      }
    }
  },
  methods: {
    ...mapActions('map2d/pointMapShow', ['setFeatures', 'setNowSetTimeOut']),
    bindSymbol(features) {
      return _.forEach(features, v => {
        const { type, subType, status = '0' } = v.attributes || {}
        v.symbol =
          v.symbol || Object.assign({ type, subType, status }, symbolConfig.randerFeatureStyle({ type, status }))
      })
    },

    adjustSceneByLayerSettings() {
      // 根据图层设置信息调整场景
      let scene = this.$context.viewer.scene
      for (const settings of this.layerSettingsMap.values()) {
        let layer = scene.layers.find(settings.name)
        if (layer) {
          // 图层
          layer.selectedColor = settings.selected
            ? settings.selectedColor
              ? this.$context.Cesium.Color.fromCssColorString(settings.selectedColor)
              : this.$context.Cesium.Color.FUCHSIA
            : this.$context.Cesium.Color.WHITE
          layer.hue = settings.hue
          layer.saturation = settings.saturation
          layer.brightness = settings.brightness
        } else if (settings.name === 'viewer') {
          // 视图
          let skyAtmosphere = scene.skyAtmosphere
          if (skyAtmosphere) {
            skyAtmosphere.hueShift = settings.hue
            skyAtmosphere.saturationShift = settings.saturation
            skyAtmosphere.brightnessShift = settings.brightness
          }
        }
      }
    },
    handleScenePostUpdate(scene, time) {
      if (this.twinkleCounter > mapUtils.RESOURCESTATUS.twinkleStep) {
        this.twinkleCounter = 0
        for (const item of this.allAlarmEntities) {
          // 有报警实体时，改变实体状态
          let { id, existModel } = item
          if (!existModel) {
            let alarmingEntity = this.context.viewer.entities.getById(id) // 获取当前实体对象
            if (alarmingEntity) {
              alarmingEntity.model.colorBlendAmount =
                alarmingEntity.model.colorBlendAmount._value === 0 ? mapUtils.RESOURCESTATUS.colorAmount : 0
            }
          }
        }
        if (this.buildingArr) {
          // 有楼内报警时，改变楼宇闪烁状态
          this.twinkFlag = !this.twinkFlag
        }
      } else {
        this.twinkleCounter++
      }
    },
    displayAllResourcePoint() {
      console.log(this.modeType, 'this.modeType')
      // 获取辅助杆列表
      this.getAssistHoleList()
        .then(res => {
          res.forEach(res => {
            res.type = mapUtils.CHANNELTYPE.assist
          })
          utils.addEntitysToMap(this.keyTypes.pole, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log('获取辅助杆列表数据失败：', err)
        })
      switch (this.modeType) {
        case 'alarmProcessing':
          this.changeShow({ type: 'isAlarm', val: true })
          this.changeShow({ type: 'isAlarmBox', val: true })
          this.changeShow({ type: 'isAlarmPillar', val: true })
          this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.commonAlarm }).then(res => {
            utils.addEntitysToMap(this.keyTypes.commonAlarm, res, this.mapMode, this.context, false)
          })
          this.loadDefaultMapResourcePoint({
            tab: mapUtils.TABTYPE.alarmHelp,
            channelTypes: mapUtils.pointTypes.vedio
          }).then(res => {
            let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmBoxResource)
            utils.addEntitysToMap(this.keyTypes.alarmBox, result, this.mapMode, this.context, false)
          })
          this.loadDefaultMapResourcePoint({
            tab: mapUtils.TABTYPE.alarmHelp,
            channelTypes: mapUtils.pointTypes.vedio
          }).then(res => {
            let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmColumnResource)
            utils.addEntitysToMap(this.keyTypes.alarmColumn, result, this.mapMode, this.context, false)
          })
          break
        case 'fireAlarm':
          this.changeShow({ type: 'isFire', val: true })
          this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.fireAlarm }).then(res => {
            utils.addEntitysToMap(this.keyTypes.fireAlarm, res, this.mapMode, this.context, false)
          })
          break
        case 'patrol':
          this.changeShow({ type: 'isSinglePawn', val: true })
          this.changeShow({ type: 'isKeepWatch', val: true })
          this.getAllPatrolPoint().then(res => {
            utils.addEntitysToMap(this.keyTypes.patrol, res, this.mapMode, this.context, false)
          })
          break
        default:
          break
      }
    },
    async loadDefaultMapResourcePoint(param) {
      let result = []
      result = await this.getResourcePointsByChannelType(param)
      return result
    },
    // 楼层平面图点位闪烁调用的方法---胡红勋添加
    alarmingTwinkEvt() {
      // if (this.alarmingFeatureList.length > 0) {
      //     this.index = this.index >= 120 ? 0 : this.index;
      //     let num = this.index % 30;
      //     if (num < 5) {
      //         // this.setAlarmingList([])
      //         this.allAlarmingFeatureList = [];
      //     } else {
      //         this.allAlarmingFeatureList = this.$lodash.cloneDeep(this.alarmingFeatureList);
      //     }
      //     this.index++;
      //     this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render();
      // }
    },
    getStaticMap(param) {
      console.log(param)
      param.map.set('multiWorld', false)
      window.$context2D = param
      console.log(symbolConfig.ambientImportPartSymbol)
      // 请求图层数据-重点部位
      const importPartFeatures = [
        {
          geom: { type: 'Point', points: '0,0' },
          attributes: {
            id: '120',
            isouter: false,
            name: '总行',
            type: 'importPart',
            subType: 'headOffice',
            rType: DEVICETYPE['headOffice']
          },
          symbol: symbolConfig.ambientImportPartSymbol
        }
      ]
      this.bindSymbol(importPartFeatures) // 追加绑定图标样式
      this.setFeatures({ type: 'importPart', features: importPartFeatures }) // 请求加载要素
      // 请求图层数据-重点部位
      const cameraFeatures = [
        {
          geom: { type: 'Point', points: '120,30' },
          attributes: {
            id: '121',
            isouter: false,
            name: '总行',
            type: 'camera',
            subType: 'boltipc',
            rType: DEVICETYPE['boltipc']
          },
          symbol: symbolConfig.ambientImportPartSymbol
        }
      ]
      this.bindSymbol(cameraFeatures) // 追加绑定图标样式
      this.setFeatures({ type: 'camera', features: cameraFeatures }) // 请求加载要素
    },
    // 单击楼层平面地图的回调方法
    mapClickEvt(evt) {
      console.log(window.$context.map.getView().getZoom())
      console.log('鼠标单击事件', evt)
      if (this.drawActive) {
        console.log(evt)
        return
      } // 绘制状态时单击无效
      const { feature } = evt
      // 判断是否存在feature(要素)
      // this.setPanelInfoEditStatus(false);
      if (feature) {
      }
      // if (this.measureLayer.actived) { // 室内量算时，阻止点击事件冒泡
      //     return;
      // }
      // let attributes = evt.attributes;
      // if (attributes && attributes.id) { // 选中要素
      //     if (this.attrInfo && this.attrInfo.data && this.attrInfo.data._id !== attributes.id) {
      //         this.setHighLightList([]); // 清空高亮要素
      //         this.setHighLightLabelList(null);
      //     } else if (attributes && attributes.mapsign && (attributes.mapsign.signtype === 1 || attributes.mapsign.signtype === 2)) {
      //         this.highLightSelectedAreaFeature(attributes);
      //     } else {
      //         this.highLightSelectedFeature(attributes);
      //     }
      //     let attrType = attributes.hasOwnProperty('rType') ? attributes.rType : attributes.type;
      //     // 根据点位类型切换属性面板，显示点位的属性--------
      //     this.switchDetailPage(attributes.id, attrType);
      // } else { // 未选中要素时，显示楼层属性面板信息
      //     this.$emit('sendEvent', { type: 'floor', data: JSON.parse(JSON.stringify(this.floorData)) });
      // }
    }
  },
  mounted() {
    // this.keyTypes = mapUtils.getKeyType();
    // this.getMap3DParamConfig();
    // this.getLayerSettingsList(); // 获取图层设置信息
  }
}
