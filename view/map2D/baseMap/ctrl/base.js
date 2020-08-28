/*
 * @Author: fengbeibei
 * @Date: 2020-05-20 16:18:41
 * @LastEditTime: 2020-06-09 17:39:38
 * @LastEditors: yubeixin
 * @Description: 地图基础控制逻辑
 */
import _, { reject, cloneDeep } from 'lodash'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import {
  addGeoserverTileToMap,
  addGeoserverIGNTileToMap,
  loadAdministrativeAreaDataToMap
} from 'assets/2DMap/utils/mapInit'
import { DEVICETYPE, AllRESOURCEARR, DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE } from 'assets/2DMap/meta/common'
import { generateCameraSectorFeatures, generateAlarmRangeFeatures } from '../../utils'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { convertStyleToSymbol, getDefaultStyle } from 'assets/2DMap/feature/edit/area'
import {
  getAllTypePointApi // 获取所有已经添加的设备点位
} from 'http/map2D/point'
export default {
  data() {
    return {
      AllTypePointArr: {},
      navZoomStyle: {
        // 地图导航缩放工具位置
        nav: {
          // 上下左右
          top: '120px',
          left: '374px',
          right: 'unset',
          bottom: 'unset'
        },
        zoom: {
          // + - 按钮
          top: '174px',
          left: '396px',
          right: 'unset',
          bottom: 'unset'
        }
      }
    }
  },
  watch: {
    // '$store.state.map2d.mapIndex.floorMap'(newValue, oldValue) {
    //   console.log(newValue)
    // },
    // '$store.state.map2d.pointMapShow.cameraFeatures'(newValue, oldValue) {
    //   // console.log(newValue)
    //   // console.log('摄像机图层加载改变')
    //   let cameraSectorFeatures = []
    //   newValue.forEach(item => {
    //     cameraSectorFeatures = cameraSectorFeatures.concat(
    //       generateCameraSectorFeatures([item], { subType: item.attributes.subType + '_sector' })
    //     )
    //   })
    //   this.setFeatures({ type: 'cameraSector', features: cameraSectorFeatures }) // 请求加载要素
    // },
    '$store.state.map2d.mapIndex.nowSelectRealtionInfo'(newValue, oldValue) {
      console.log('检测到关联关系设备的结果', newValue, oldValue)
      if (newValue) {
        // 查看关联关系的设备
        this.setPanelInfoStatus(true) // 显示右侧面板
        this.setCurrPanelToolComponent('RealtionEquipment')
      } else {
        this.setPanelInfoStatus(false) // 隐藏右侧面板
      }
    },
    '$store.state.map2d.mapIndex.showLeftFloorInfo'(newValue, oldValue) {
      console.log('navZoomStyle变化', newValue, oldValue)
      this.navZoomStyle.nav.left = newValue ? '374px' : '74px'
      this.navZoomStyle.zoom.left = newValue ? '396px' : '96px'
      let odiv = document.getElementsByClassName('hmap-rotate-control')
      for (let i = 0; i < odiv.length; i++) {
        odiv[i].style.left = newValue ? '372px' : '72px' // 改变宽度ol-scale-line
      }

      let odiv1 = document.getElementsByClassName('ol-scale-line')
      for (let i = 0; i < odiv1.length; i++) {
        odiv1[i].style.left = newValue ? '374px' : '74px' // 改变宽度
      }
    },
    '$store.state.map2d.mapIndex.mapToolbarStatus.selectionControl'(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.CLEAR_BOX_SELECTTION_ARR()
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
        this.setDrawResult(obj)
      }
    },
    clickTreeNode: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          if (newValue.location) {
            window.$context2D.map.getView().setCenter(newValue.location)
            if (newValue.level) {
              window.$context2D.map.getView().setZoom(newValue.level)
            } else {
              window.$context2D.map.getView().setZoom(10)
            }
            // 设置跟随面板
            if (window.$context2D.nowOverlayArrribute) {
              window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
            }
            window.$context2D.nowOverlayArrribute.setPosition(newValue.location)
            window.$context2D.map.addOverlay(window.$context2D.nowOverlayArrribute)
          }
        }
      },
      deep: true
    },
    floorMap: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.reLoadAllPoints()
          // 清空框选
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
          this.setDrawResult(obj)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('map2d/pointMapShow', ['nowSetTimeout']),
    ...mapState('map2d/mapIndex', [
      'mapConfig',
      'mapConfigDlgFormData',
      'showFloorInfo',
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
      'mapToolbarStatus'
    ]),
    ...mapGetters({
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      // cameraFeatures: ({ map2d }) => map2d.pointMapShow.cameraFeatures, // 摄像机
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境信息
      clickTreeNode: ({ map2d }) => map2d.mapIndex.clickTreeNode //  当前设置的定位 树节点
    }),
    nowMapPlace() {
      // 当前地图类型
      let nowPlace = this.$store.state.map2d.mapIndex.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2
      // console.log('当前地图类型：', nowPlace)
      return nowPlace
    }
  },
  methods: {
    ...mapMutations(['SET_FEATURES']),
    ...mapActions('map2d/mapPoint', ['getAllTypePoint']),
    ...mapActions('map2d/mapIndex', [
      'getBoxSelection',
      'setDrawResult',
      'setDrawActive',
      'setCurrPanelToolComponent',
      'setPanelInfoStatus'
    ]),
    ...mapMutations('map2d/mapPoint', ['SET_ALL_SHOW_POINT']),
    ...mapMutations('map2d/mapIndex', ['CLEAR_BOX_SELECTTION_ARR', 'UPDATE_IS_REAL_DATA']),
    ...mapMutations('map2d/pointMapShow', ['CLEAR_FEATURES']),
    ...mapActions('map2d/pointMapShow', ['setFeatures', 'setNowSetTimeOut', 'clearFeatures']),
    ...mapActions('map2d/mapIndex', ['updateMapExtent', 'updateMapMinZoom', 'getAllRelationPointInfoByUrl']),
    bindSymbol(features) {
      return _.forEach(features, v => {
        let { type, subType, status } = v.attributes || {}
        if (type === 'importPart' || type === 'keyParts') {
          status = 1
        } else {
          if (status === 2) {
            status = 1
          } else {
            status = 2
          }
        }
        v.symbol =
          v.symbol ||
          Object.assign({ type, subType, status }, symbolConfig.randerFeatureStyle({ type, subType, status }))
        if (v.symbol && v.symbol.iconStyle) {
          const angle = v.attributes.viewshedAngle || 0
          v.symbol.iconStyle.rotation = angle // 设置旋转角度
        }
        if (v.geom.points.split(',').length > 2) {
          v.symbol = convertStyleToSymbol(getDefaultStyle(), v.attributes)
        }
      })
    },
    //
    updatePolygonFeatureStyle(features) {
      features.forEach(item => {
        if (item.geom.points.split(',').length > 2) {
          item.symbol = convertStyleToSymbol(getDefaultStyle(), item.attributes)
        }
      })
      return features
    },
    bsMapReady(param) {
      // debugger
      // 全局存储map对象
      window.$context2D = param
      console.log('地图加载OK', param)
      this.initArrributeOverlay()
      this.initLabelOverlay()
      this.clearFeatures()
      // 改变可见层级
      // console.log('curSelectResourcePoint', this.curSelectResourcePoint)
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.level) {
        window.$context2D.map.getView().setZoom(this.curSelectResourcePoint.level)
      }
      // 如果图层类型为geoserver类型，加载地图底图
      if (this.mapConfigDlgFormData.tileType === 1) {
        addGeoserverTileToMap(window.$context2D.map, window.$context2D.ol, this.mapConfigDlgFormData.serverUrl)
      }
      // if (this.$store.state.map2d.mapIndex.isMapOuter === 1) {
      //   this.initWeatherOverlay()
      // }
      if (this.$store.state.map2d.mapIndex.isMapOuter === 1 && !(this.clickTreeNode && this.clickTreeNode.location)) {
        // 室外gis地图图，没有选中有点位的树节点时
        this.mapFitToDistrictSetting() // 地图缺省定位到默认行政区域
      }
      this.showGetAllRelationPointInfo()
      this.reLoadAllPoints()
      this.$forceUpdate()
    },
    // 底图切换 从新查询所有点位
    reLoadAllPoints() {
      this.CLEAR_FEATURES() // 清空图层所有设备、机构重点部位、兴趣点图层数据
      let paramCentent = {}
      let isMapOuter = cloneDeep(this.$store.state.map2d.mapIndex.isMapOuter)
      if (isMapOuter === 1) {
        // 1-GIS地图
        this.initWeatherOverlay()
        paramCentent.place = 1
      } else if (isMapOuter === 2 && this.floorMap.isFloor === false) {
        // 2-环境平面图
        paramCentent.place = 2
        paramCentent.envId = this.floorMap.envId
      } else if (isMapOuter === 2 && this.floorMap.isFloor === true) {
        // 3-楼层平面图
        paramCentent.place = 3
        paramCentent.floorId = this.floorMap.id // 最新的室内信息
      }

      // 请求图层数据-
      let _this = this
      this.showGetAllTypePoint(paramCentent, function() {
        _this.AllTypePointArr = _this.formatPoiData(_this.AllTypePointArr, AllRESOURCEARR)
        console.log('_this.AllTypePointArr', _this.AllTypePointArr, AllRESOURCEARR)
        _this.formatFeatures(_this.AllTypePointArr, AllRESOURCEARR)
      })
    },
    //  获取所有关联关系信息
    showGetAllRelationPointInfo() {
      let paramCentent = {}
      let isMapOuter = cloneDeep(this.$store.state.map2d.mapIndex.isMapOuter)
      if (isMapOuter === 1) {
        // 1-GIS地图
        this.initWeatherOverlay()
        paramCentent.place = 1
      } else if (isMapOuter === 2 && this.floorMap.isFloor === false) {
        // 2-环境平面图
        paramCentent.place = 2
        paramCentent.envId = this.floorMap.envId
      } else if (isMapOuter === 2 && this.floorMap.isFloor === true) {
        // 3-楼层平面图
        paramCentent.place = 3
        paramCentent.floorId = this.floorMap.id // 最新的室内信息
      }
      return new Promise((resolve, reject) => {
        this.getAllRelationPointInfoByUrl()
          .then(res => {})
          .catch(err => {
            reject(err)
          })
      })
    },
    // // 获取已添加的所有设备点位
    showGetAllTypePoint(data, callback) {
      return new Promise((resolve, reject) => {
        getAllTypePointApi(data)
          .then(res => {
            this.SET_ALL_SHOW_POINT(res.data.data.points)
            this.AllTypePointArr = res.data.data.points
            callback()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 处理每条points 对象
    formatGeom(item) {
      let shapeType = ''
      if (item.shapeType === 1) {
        shapeType = 'Point'
      } else if (item.shapeType === 2) {
        shapeType = 'Polygon'
      } else if (item.shapeType === 3) {
        shapeType = 'LineString'
      }
      let attributes = cloneDeep(item)
      attributes.type = DEVICETYPETRANSATE[`${item.type}`]
      attributes.subType = SUBTYPEOBJTRANSATE[`${item.type}`][`${item.subType}`]
      attributes.Features = DEVICETYPETRANSATE[`${item.type}`] + 'Features'
      attributes.rType = item.type
      attributes.subType = attributes.subType ? attributes.subType : 'add'
      let object = { geom: { type: shapeType, points: item.coordinate }, attributes: attributes }
      return object
    },
    // 循环所有点元素
    formatPoiData(arr, ResourceArr) {
      let newArr = []
      if (!arr || !ResourceArr) {
        return newArr
      }
      arr.forEach(item => {
        var pointObj = {}
        pointObj = this.formatGeom(item)
        if (newArr[item.type]) {
          newArr[item.type].push(pointObj)
        } else {
          newArr[item.type] = []
          newArr[item.type].push(pointObj)
        }
      })
      return newArr
    },

    // 循环绑定Features
    formatFeatures(poinArr, ResourceArr) {
      for (let k in poinArr) {
        ResourceArr.forEach(item => {
          if (k == item.type) {
            this.bindSymbol(poinArr[k]) // 追加绑定图标样式
            if (item.FeaturesType === 'camera') {
              let cameraSectorFeatures = []
              poinArr[k].forEach(item => {
                cameraSectorFeatures = cameraSectorFeatures.concat(
                  generateCameraSectorFeatures([item], { subType: item.attributes.subType + '_sector' })
                )
              })
              //   console.log('cameraSectorFeatures', cloneDeep(cameraSectorFeatures))
              this.setFeatures({ type: 'cameraSector', features: cameraSectorFeatures }) // 请求加载要素
            }
            this.setFeatures({ type: item.FeaturesType, features: poinArr[k] })
          }
        })
      }
    },

    handleOverViewMapReady(overview) {
      // 处理缩略图加载完成
      let targets = document.getElementsByClassName(overview.className)
      for (let target of targets) {
        target.style.right = this.toolVisible ? '64px' : '0px'
        target.style.bottom = '0px'
      }
    },
    /**
     * 删除图层内的要素
     * @param {*} layerId
     */
    clearFeaturesInLayer(layerId) {
      let layer = this.getLayerById(layerId)
      layer && layer.getSource().clear()
    },
    /**
     * 根据id获取图层
     * @param {*} layerId
     * @returns
     */
    getLayerById(layerId) {
      let targetLayer = null
      if (window.$context2D) {
        // 判断地图记载完成,获取指定图层
        const { map } = window.$context2D
        let layers = map.getLayers().getArray()
        for (const layer of layers) {
          let id = layer.get('id')
          if (id === layerId) {
            targetLayer = layer
          }
        }
      }
      return targetLayer
    },
    // 框选绘制完成
    handleDrawEnd(v) {
      // console.log('绘制完成', v, this.drawStyleType)
      let isMapOuter = cloneDeep(this.$store.state.map2d.mapIndex.isMapOuter)
      let nowPlace = isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2
      const data = {
        place: nowPlace,
        wkt: v.wkt
      }
      if (nowPlace === 1) {
      } else if (nowPlace === 3) {
        data.floorId = this.floorMap.id
      } else if (nowPlace === 2) {
        data.envId = this.floorMap.envId
      }
      this.getBoxSelection(data).then(res => {
        this.showKuangSel(res.data)
        this.setCurrPanelToolComponent('BoxSelectStatistic') // 设置右侧面板为筛选统计面板
        this.setPanelInfoStatus(true) // 显示右侧面板
      })
      setTimeout(() => {
        this.setDrawActive({ type: this.currDrawType, styleType: this.drawStyleType, active: false }) // 关闭绘制
      }, 300)
    },

    // 框选依赖的方法函数
    // 框选结果 数组去重进行添加
    mergeFeatureArray(arr1, arr2) {
      let noKindArr = []
      for (let i = 0; i < arr1.length; i++) {
        let isKind = false
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].id === arr2[j].id) {
            isKind = true
            continue
          }
        }
        if (!isKind) {
          noKindArr.push(arr1[i])
        }
      }
      return arr2.concat(noKindArr)
    },
    showKuangSel(data) {
      const selectTypeMap = {
        importPart: 'org',
        keyParts: 'keyPart',
        camera: 'video',
        recorder: 'videoHost',
        alarm: 'alarmDevice',
        fireFighting: 'fireDevice',
        intercom: 'intercomDevice',
        access: 'accessControlDevice',
        protectedCabin: 'cabin'
      }
      let selectArray = {}
      let stateboxStaticObj = cloneDeep(this.drawResult)
      for (let k in selectTypeMap) {
        selectArray[k] = data[selectTypeMap[`${k}`]]
        selectArray[k] = this.mergeFeatureArray(selectArray[k], stateboxStaticObj[k])
      }
      this.setDrawResult(selectArray)
    },
    initArrributeOverlay() {
      let featureElement = document.getElementById('Attribute-tooltip')
      window.$context2D.nowOverlayArrribute = new window.$context2D.ol.Overlay({
        id: 'overlay0_' + new Date().getTime(),
        element: featureElement,
        offset: [-170, -260],
        position: [12971547.26829515, 48596082.86922005]
      })
    },
    initLabelOverlay() {
      let featureElementLabel = document.getElementById('label-tooltip')
      window.$context2D.nowOverlayLabel = new window.$context2D.ol.Overlay({
        id: 'overlay1_' + new Date().getTime(),
        element: featureElementLabel,
        offset: [-75, 25],
        position: [12971547.26829515, 48596082.86922005]
      })
    },
    initWeatherOverlay() {
      let featureElementWeather = document.getElementById('weather-tooltip')
      window.$context2D.nowOverlayWeather = new window.$context2D.ol.Overlay({
        id: 'overlay2_' + new Date().getTime(),
        element: featureElementWeather,
        offset: [10, -60],
        position: [12971547.26829515, 48596082.86922005]
      })
      window.$context2D.map.addOverlay(window.$context2D.nowOverlayWeather)
    },
    // 地图缺省定位到默认行政区域
    mapFitToDistrictSetting() {
      this.getDistrictSetting({
        adcode: this.nowSelectAreaInfo.adcode
      })
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          } else if (res.data) {
            console.log('获取样式信息', res)
            let symbol = convertStyleToSymbol(symbolConfig.administrativeAreaSymbol, res.data.areaStyle)
            console.log(symbol)
            loadAdministrativeAreaDataToMap(cloneDeep(this.nowSelectAreaInfo), this, symbol)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
