/*
 * @Author: lidongyu
 * @Date: 2020-6-28 16:18:41
 * @LastEditTime: 2020-06-28 17:39:38
 * @LastEditors: lidongyu
 * @Description: 地图配置基础控制逻辑
 */

import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
import { addGeoserverTileToMap, loadAdministrativeAreaDataToMap } from 'assets/2DMap/utils/mapInit'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import importpart from './../layers/importpart'
import layerConfig from 'assets/2DMap/meta/layer'
import highLightTrans from 'assets/2DMap/feature/edit/highLight'
import { SHAPETYPE, MAPTYPENUMBER } from 'assets/2DMap/meta/common'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import { convertStyleToSymbol } from 'assets/2DMap/feature/edit/area'
// 地图基础控制逻辑
export default {
  data() {
    return {
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
      },
      highLightLocateLayer: layerConfig.highLightLocate // 虚拟重点部位
    }
  },
  mixins: [importpart],
  computed: {
    ...mapGetters('map2d/pointMapShow', ['nowSetTimeout']),
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境信息
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      mapConfig: ({ map2d }) => map2d.pointMapShow.mapConfig,
      mapConfigDlgFormData: ({ map2d }) => map2d.mapIndex.mapConfigDlgFormData,
      highLightLocateIcons: ({ map2d }) => map2d.mapPoint.highLightLocateIconFeatures // 地图高亮定位要素
    }),
    nowMapPlace() {
      // 当前地图类型
      let nowPlace = this.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2
      // console.log('当前地图类型：', nowPlace)
      return nowPlace
    }
  },
  watch: {
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
    nowMapPlace: {
      // 监听当前地图类型变化
      handler(newPlace, oldPlace) {
        // 关闭之前地图上绘制和点位位置编辑
        this.setDrawActive({ active: false }) // 关闭点位绘制状态
        this.setEditActive(false) // 关闭要素编辑状态
        this.loadAllMapPoints() // 更新地图点位
      },
      immediate: true
    },
    environmentalScienceInformation: {
      // 监听当前环境平面图所在环境信息的变化
      handler(newData, oldData) {
        if (newData && this.nowMapPlace === MAPTYPENUMBER.hj) {
          if (!oldData || (oldData && newData.id !== oldData.id)) {
            this.setDrawActive({ active: false }) // 关闭点位绘制状态
            this.setEditActive(false) // 关闭要素编辑状态
            this.loadAllMapPoints() // 更新地图点位
          }
        }
      },
      deep: true
    },
    indoorInformation: {
      // 监听当前楼层平面图所在楼层信息的变化
      handler(newData, oldData) {
        if (newData && this.nowMapPlace === MAPTYPENUMBER.lc) {
          if (!oldData || (oldData && newData.id !== oldData.id)) {
            this.setDrawActive({ active: false }) // 关闭点位绘制状态
            this.setEditActive(false) // 关闭要素编辑状态
            this.loadAllMapPoints() // 更新地图点位
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', ['getAllTypePoint', 'setCurrentSelectResource']),
    ...mapActions('map2d/pointMapShow', ['setFeatures', 'setNowSetTimeOut']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode']),
    ...mapActions('map2d/mapIndex', ['updateMapExtent', 'updateMapMinZoom', 'setPanelInfoStatus', 'setDrawActive']),
    ...mapMutations('map2d/mapPoint', ['CLEAR_ALL_POINT_DATA']), // 清空所有点位相关数据
    bindSymbol(features) {
      return _.forEach(features, v => {
        const { type, subType, status = '0' } = v.attributes || {}
        v.symbol =
          v.symbol || Object.assign({ type, subType, status }, symbolConfig.randerFeatureStyle({ type, status }))
      })
    },
    bsMapReady(param) {
      // 全局存储map对象
      window.$context2D = param
      this.initLabelOverlay() // 初始化名称overlay
      // 如果图层类型为geoserver类型，加载地图底图
      if (this.isMapOuter === 1) {
        addGeoserverTileToMap(window.$context2D.map, window.$context2D.ol, this.mapConfigDlgFormData.serverUrl)
      }
      // 改变可见层级
      console.log('varNowZoom', this.varNowZoom)
      if (this.varNowZoom) {
        window.$context2D.map.getView().setZoom(this.varNowZoom)
      }
      // this.initArrributeOverlay() // 初始化信息标签overlay
      if (this.selectedTreeCode && this.selectedTreeCode.isPoint && this.selectedTreeCode.point) {
        // 如果有选中的已添加的点位节点数据，需要进行高亮定位并显示点位信息编辑面板
        this.showPointPanelInfo(this.selectedTreeCode.point)
      } else {
        this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [] }) // 清空高亮定位
        this.isMapOuter === 1 && this.mapFitToDistrictSetting() // 室外gis地图，地图缺省定位到默认行政区域
      }
    },
    /**
     * 加载所有的地图点位数据
     */
    loadAllMapPoints() {
      // 判断当前是图层上的需要上传对应的字段
      // floorId否 楼层id orgId否 机构id keyPartId否 重点部位id place是 点位存放位置 1-GIS地图 2-环境平面图 3-楼层平面图
      let paramCentent = {}
      paramCentent.place = this.nowMapPlace
      if (this.nowMapPlace === MAPTYPENUMBER.hj) {
        // 2-环境平面图
        // this.environmentalScienceInformation() // 最新的环境信息
        // paramCentent.orgId = this.environmentalScienceInformation.orgId
        paramCentent.envId = this.environmentalScienceInformation.id
        // if (this.environmentalScienceInformation.keyPartId) {
        //   paramCentent.keyPartId = this.environmentalScienceInformation.keyPartId
        // }
      } else if (this.nowMapPlace === MAPTYPENUMBER.lc) {
        // 3-楼层平面图
        paramCentent.floorId = this.indoorInformation.id // 最新的室内信息
      }
      // 获取所有的点位要素
      this.getAllTypePoint(paramCentent).then(res => {})
    },
    /**
     * 清空地图点位
     */
    clearAllMapPoints() {
      this.CLEAR_ALL_POINT_DATA() // 清空所有点位相关数据（ResourceArr，IconFeatures， SectorFeatures和高亮要素）
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
    /**
     * 高亮点位要素
     * @param {*} data 点位数据
     */
    highlightLocateFeature(data) {
      // 高亮点位要素
      let { id, coordinate, shapeType, level } = data
      let centerCoordinates = Array.isArray(coordinate) ? coordinate : coordinate.split(',').map(item => Number(item))
      // ---需要考虑地图形态是点、线、面
      if (shapeType) {
        if (shapeType === SHAPETYPE.LINESTRING) {
          // 线
          centerCoordinates = spaceUtil.getMultiLineStringCenter(coordinate)
        } else if (shapeType === SHAPETYPE.POLYGON) {
          // 面
          centerCoordinates = spaceUtil.getMultiPolygonCenter(coordinate)
        }
      }
      if (centerCoordinates) {
        this.highLightLocateInMapCenter(id, centerCoordinates, level) // 高亮定位到地图中心
      }
    },
    /**
     * 高亮定位
     * @param {*} id 点位唯一标识
     * @param {*} coods 点位坐标
     */
    highLightLocateInMapCenter(id, coods, zoom) {
      let feature = highLightTrans.getLocateFeature(id, coods)
      this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [feature] })
      if (this.selectedTreeCode && this.selectedTreeCode.isPoint) {
        let point = JSON.parse(JSON.stringify(this.selectedTreeCode.point))
        if (id === point.id) {
          // 选中树节点时，且当前点位时选中树节点时需要定位到地图中心
          this.locateInMapCenter(coods, zoom) // 点位到地图中心
        }
      }
    },
    /**
     * 定位到地图中心
     * @param {*} center 中心点坐标
     */
    locateInMapCenter(center, zoom) {
      // 定位到地图中心
      if (window.$context2D) {
        // 判断地图记载完成，设置地图中心
        window.$context2D.map.getView().setCenter(center)
        zoom && window.$context2D.map.getView().setZoom(zoom)
      }
    },
    // 地图缺省定位到默认行政区域
    mapFitToDistrictSetting() {
      this.getDistrictSetting({
        adcode: this.nowSelectAreaInfo.adcode
      })
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: 'error',
              message: res.message
            })
          } else if (res.data) {
            // console.log('获取样式信息', res)
            let symbol = convertStyleToSymbol(symbolConfig.administrativeAreaSymbol, res.data.areaStyle)
            loadAdministrativeAreaDataToMap(JSON.parse(JSON.stringify(this.nowSelectAreaInfo)), this, symbol)
          }
        })
        .catch(err => {
          this.$notify({ title: '警告',
            message: err,
            type: 'warning'})
        })
    },
    /**
     * 点位是否在当前地图上
     */
    isPointOnNowMap(point) {
      // 需要判断点位是否在当前地图上
      let flag = point.place === this.nowMapPlace
      if (flag) {
        // 点位地图类型与当前地图类型一致时
        if (this.nowMapPlace === MAPTYPENUMBER.hj) {
          // 环境平面图
          flag = point.envId && this.environmentalScienceInformation && point.envId === this.environmentalScienceInformation.id
        } else if (this.nowMapPlace === MAPTYPENUMBER.lc) {
          // 楼层平面图，判断点位是否在当前楼层
          flag = point.floorId && this.indoorInformation && point.floorId === this.indoorInformation.id
        }
      }
      return flag
    }
  }
}
