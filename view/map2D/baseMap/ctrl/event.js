/*
 * @Author: fengbeibei
 * @Date: 2020-05-20 16:18:41
 * @LastEditTime: 2020-06-09 17:41:08
 * @LastEditors: yubeixin
 * @Description: 地图事件统一处理
 */
import { cloneDeep } from 'lodash'
import { DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE, FEATUREARR } from 'src/assets/2DMap/meta/common'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import { getCenterByPolygonFeature } from 'assets/2DMap/spaceAnalysisUtil'
import { getpoiTypeAll } from '../../../../assets/2DMap/meta/poiTypeAll'
import { convertStyleToSymbol, getDefaultStyle } from 'assets/2DMap/feature/edit/area'
// 地图事件处理逻辑
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      drawActive: ({ map2d }) => map2d.mapIndex.drawActive,
      resourceLists: ({ map2d }) => map2d.mapPanelSearch.resourceLists,
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      showAllPointIds: ({ map2d }) => {
        let ids = []
        map2d.mapPoint.showAllPoint.forEach(item => {
          ids.push(item.id)
        })
        return ids
      }
    }),
    ...mapGetters('map2d/mapIndex', [
      'administrativeAreaInfo',
      'getAlarmSetting',
      'addAlarmSetting',
      'updateAlarmSetting',
      'isMapEdit',
      'isMapOuter'
    ]),
    ...mapState('map2d/mapIndex', [
      'drawActive',
      'measureActive',
      'administrativeAreaInfo',
      'nowSelectWeatherAreaInfo',
      'nowSelectAreaWKTInfo',
      'nowPointerWeatherAreaInfo',
      'drawStyleType',
      'currDrawType',
      'routePlanInfo',
      'videoPlayInfo',
      'alarmSetting',
      'boxSelectionArr',
      'drawResult',
      'nowSelectRealtionInfo'
    ]),
    ...mapState('map2d/pointMapShow', ['weatherAreaFeatures'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setCurrFeature',
      'setPanelInfoStatus',
      'setCurrPanelToolComponent',
      'setPanelInfoEditStatus',
      'setShowFloorInfo',
      'setIsMapOuter',
      'setIsFloorMap',
      'setNowSelectWeatherAreaInfo',
      'setNowPointerWeatherAreaInfo',
      'setRoutePlanInfo',
      'setOverFlowFeature',
      'setClickTreeNode',
      'getRelationsInfoApiByUrl'
    ]),
    ...mapActions('map2d/mapPoint', [
      'setCurrentSelectResource',
      'getCommonResourceById',
      'setEditActive',
      'getAllFloorAKey'
    ]),
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES']),
    ...mapMutations('map2d/mapIndex', [
      'SET_VIDEO_PLAY_INFO',
      'SET_ALARM_SETTING',
      'UPDATE_NOW_ZOOM',
      'UPDATE_INDOOR_LAYER_CONFIG',
      'UPDATE_NOW_SELECT_REALTION_INFO_POINT_ID',
      'UPDATE_NOW_SELECT_CAMERA_POINT_ID',
      'UPDATE_OUTDOOR_LAYER_CONFIG'
    ]),
    ...mapActions('map2d/mapIndex', [
      'getBoxSelection', // 获取框选结果
      'updateShowAlarmVideoInfo'
    ]),
    // 根据id 过滤框选点位是否push
    commentsPost(post, comments) {
      return comments.find(function(item) {
        return item.id === post.id
      })
    },
    // 根据type 判断是否是显示跟随面板
    commentsType(type, arrs) {
      return arrs.find(function(item) {
        return item === type
      })
    },
    // 地图单击事件
    handleMapClick(e) {
      const { feature, attributes } = e
      // 如果是绘制状态 返回
      if (this.drawActive || this.measureActive) {
        return
      }
      // 地图框选功能
      if (this.mapToolbarStatus.selectionControl && this.currDrawType === 'Point') {
        let staticResult = cloneDeep(this.drawResult)
        if (attributes) {
          if (this.commentsPost(attributes, staticResult[attributes.type])) {
            this.setDrawResult(staticResult)
          } else {
            staticResult[attributes.type].push(attributes)
            this.setDrawResult(staticResult)
          }
        }
        this.setCurrPanelToolComponent('BoxSelectStatistic') // 设置右侧面板为筛选统计面板
        this.setPanelInfoStatus(true) // 显示右侧面板
        return
      }

      // 线路规划选取兴趣点
      if (
        this.routePlanInfo &&
        this.routePlanInfo.nowSelect &&
        feature &&
        (attributes.type.split('poi_cy').length !== 1 ||
          attributes.type === 'importPart' ||
          attributes.type === 'keyParts')
      ) {
        console.log('进入线路规划功能')
        let typeMap = ['selectStartPoint', 'selectChannelPoint', 'selectEndPoint']
        let arr = typeMap.filter(item => {
          return item === this.routePlanInfo.nowSelect
        })
        let nowRoutePlanInfo = cloneDeep(this.routePlanInfo)
        if (arr && arr.length === 1) {
          nowRoutePlanInfo[this.routePlanInfo.nowSelect] = {
            attributes: attributes,
            points: feature.getGeometry().getCoordinates()
          }
          let poiArr = getpoiTypeAll()
          let arr1 = poiArr.filter(item => {
            return item.poiCode === feature.get('attributes').rType
          })
          if (arr1.length === 1) {
            nowRoutePlanInfo[this.routePlanInfo.nowSelect].poiInfo = arr1[0]
          } else {
            nowRoutePlanInfo[this.routePlanInfo.nowSelect].poiInfo = {
              threeType: attributes.name
            }
          }
          this.setRoutePlanInfo(nowRoutePlanInfo)
        }
        return // 绘制状态单击无效
      }
      // && e.type === 'Point'
      // 点击元素 存储根据id查询的点位详情，非兴趣点
      // DEVICETYPETRANSATE
      if (e.type && this.commentsType(attributes.type, FEATUREARR) && attributes.type.split('poi_cy').length === 1) {
        let attr = cloneDeep(attributes)
        this.editResourceInfo(attr) // 显示资源编辑面板
        this.setEditActive(false) // 要素编辑是否激活
        this.setCurrPanelToolComponent(null) // 设置为空 map2d 与map2dedit 显示点位详情面板
      }
      if (!feature && !this.mapToolbarStatus.weatherControl && !this.mapToolbarStatus.correlationControl) {
        this.setPanelInfoEditStatus(false) // 收起右侧详情面板
        this.setCurrentSelectResource(null)
        this.setPanelInfoStatus(false)
      }

      // 点击非feature隐藏tooltip
      if (!feature && window.$context2D.nowOverlayArrribute) {
        window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
      }
      if (feature) {
        console.log('要素点击', feature, feature.get('attributes'))
        const attributes = feature.get('attributes')

        // 天气区域下钻功能
        if (attributes && attributes.type === 'weatherArea' && attributes.id.split('text').length === 1) {
          // 点击天气信息,判断是否地图下钻
          let areaInfo = attributes.areaInfo
          if (areaInfo && areaInfo.adcode !== this.nowSelectWeatherAreaInfo.adcode && areaInfo.level !== 3) {
            this.setNowSelectWeatherAreaInfo(areaInfo)
          } // 点击区域不同
          this.setCurrPanelToolComponent('WeatherList') // 显示天气右侧面板
          this.setPanelInfoStatus(true) // 显示右侧面板
          return
        } else if (
          this.alarmSetting.isReceive &&
          attributes.now_feature_status === 3 &&
          attributes &&
          (attributes.type === 'importPart' || attributes.type === 'keyParts')
        ) {
          // 进入楼层
          let pointId
          for (let i = this.alarmSetting.alarmPushInfo.length - 1; i >= 0; i--) {
            if (
              (attributes.type === 'importPart' && attributes.orgId === this.alarmSetting.alarmPushInfo[i].orgId) ||
              (attributes.type === 'keyParts' && attributes.keyPartId === this.alarmSetting.alarmPushInfo[i].keyPartId)
            ) {
              pointId = this.alarmSetting.alarmPushInfo[i].pointId
              break
            }
          }
          if (pointId) {
            this.inFloorByPointId(pointId)
          }
          return
        } else if (attributes && attributes.type === 'administrativeArea') {
          let data = {
            place: 1,
            wkt: this.nowSelectAreaWKTInfo
          }
          this.getBoxSelection(data).then(suc => {
            this.setDrawResult(suc.data)
            this.setPanelInfoStatus(true)
            this.setCurrPanelToolComponent('PanelDistrict')
          })

          // // 行政区地图高亮域点击事件
          // if (this.isMapEdit === true) {
          //   // 编辑页面出行政域设置   应用页面出行政域统计
          //   this.setCurrPanelToolComponent('DistrictSetting')
          //   this.setPanelInfoStatus(true) // 显示右侧面板
          // } else if (this.isMapEdit === false) {
          //   this.setCurrPanelToolComponent('PanelDistrict')
          //   this.setPanelInfoStatus(true) // 显示右侧面板
          // }
          // alert('点击区域');
        } else if (
          this.alarmSetting.isReceive &&
          attributes &&
          this.alarmSetting.alarmFeatureIds.pointIds.includes(attributes.id)
        ) {
          console.log('clickVideoResourceAddRelation')
          let coords = feature.getGeometry().getCoordinates()
          this.clickVideoResourceAddRelation(attributes.id, coords)
          return
        } else if (
          this.mapToolbarStatus.correlationControl &&
          attributes &&
          attributes.type.split('poi_cy').length === 1
        ) {
          console.log('clickVideoResourceAddRelation')
          let coords = feature.getGeometry().getCoordinates()
          this.clickVideoResourceAddRelation(attributes.id, coords)
          return
        } else if (attributes && attributes.type.split('poi_cy').length === 1) {
          //
          let coords = feature.getGeometry().getCoordinates()
          console.log('点击非兴趣点图标', coords)
          if (coords.length !== 2) {
            console.log('getPolygonCenter', coords, getCenterByPolygonFeature(coords))
            coords = getCenterByPolygonFeature(coords)
          }
          this.setOverFlowFeature(attributes)
          this.setClickTreeNode(attributes)
          // window.$context2D.map.getView().setCenter(coords)
          // window.$context2D.map.getView().setZoom(10)
          if (window.$context2D.nowOverlayArrribute) {
            window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
          }
          window.$context2D.nowOverlayArrribute.setPosition(coords)
          window.$context2D.nowOverlayArrribute.setOffset([-170, -260])
          window.$context2D.map.addOverlay(window.$context2D.nowOverlayArrribute)
          return
        }
        console.log('处理地图单击事件，选中的数据：', attributes)
      } else {
      }
    },
    inFloorByPointId(pointId) {
      this.setCurrentSelectResource(null)
      let obj = {}
      let getPointFun = this.getCommonResourceById
      getPointFun(pointId).then(suc => {
        if (suc.code === 0) {
          this.setCurrentSelectResource(suc.data)
          let data = suc.data
          obj = {
            id: pointId,
            type: DEVICETYPETRANSATE[`${data.type}`],
            subType: SUBTYPEOBJTRANSATE[`${data.type}`][`${data.subType}`],
            level: data.level
          }
          this.setMapType({ point: data })
        }
      })
    },
    // 判断是否切换地图
    setMapType(data) {
      let { place, floorId, envId } = data.point
      // 点位所在地图类型与当前地图类型不一致时，需要跳转到点位所在的地图
      if (place === 1) {
        // 跳转到室外gis图：isMapOuter设置为 1 ，数据清空（environmentalScienceInformation最新的环境信息，indoorInformation最新的室内信息）
        this.setIsMapOuter(1)
        this.setIsFloorMap({
          envImageData: null,
          floorsImageDate: null,
          isFloor: false, // ture 室内 false 环境
          id: '',
          envId: ''
        })
      } else if (place === 2) {
        this.UPDATE_OUTDOOR_LAYER_CONFIG({
          key: 'url',
          value: data.point.envImageData.image
        })
        this.setIsFloorMap({
          envImageData: data.point.envImageData,
          floorsImageDate: null,
          isFloor: false, // ture 室内 false 环境
          id: '',
          envId: data.point.envId
        })
        this.setIsMapOuter(2)
      } else if (place === 3) {
        // 跳转到楼层平面图：isMapOuter设置为 2，floorMap.isFloor设置为true，设置indoorInformation最新的室内信息和indoorLayerConfig.url，数据清空（environmentalScienceInformation最新的环境信息）
        if (data.point.floorId) {
          // 点位所在楼层id
          // 获取点位所在的楼层数据
          this.getAllFloorAKey(data.point.floorId)
            .then(res => {
              let floorData = cloneDeep(res.data)
              this.setIsFloorMap({
                envImageData: null,
                floorsImageDate: floorData,
                isFloor: true, // ture 室内 false 环境
                id: floorData.id,
                envId: ''
              })
              this.UPDATE_INDOOR_LAYER_CONFIG({
                // 展示环境平面图
                key: 'url',
                value: floorData.image
              })
              this.setIsMapOuter(2)
            })
            .catch(err => {
              console.error('跳转到楼层平面图时，获取楼层信息失败！', err)
            })
        }
      }
    },
    moveend(e) {
      // const extent = window.$context2D.map.getView().calculateExtent(window.$context2D.map.getSize())
      // console.log('地图移动事件', e, extent)
      if (this.isMapOuter === 1) {
        this.updatePoiRequestData()
      }
    },
    // 地图双击事件
    handleMapDBClick(e) {
      const { lon, lat, feature } = e
      //  console.log('地图双击', e, [lon, lat].join(','))
      const attributes = feature ? feature.get('attributes') : null
      if (feature && attributes) {
        //  console.log(attributes)
        if (this.alarmSetting.isReceive && this.alarmSetting.alarmFeatureIds.pointIds.includes(attributes.id)) {
          let coords = feature.getGeometry().getCoordinates()
          let alarmInfo = {}
          this.alarmSetting.alarmPushInfo.forEach(item => {
            if (item.pointId === attributes.id) {
              alarmInfo = {
                id: attributes.id,
                ...item
              }
            }
          })
          if (window.$context2D.nowOverlayLabel) {
            window.$context2D.map.removeOverlay(window.$context2D.nowOverlayLabel)
          }
          this.clickVideoResourceAddRelation(attributes.id, coords, true, alarmInfo)
        } else if (attributes.type === 'camera') {
          this.showVideo(attributes, 5)
          // let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
          // for (let i = 1; i < 5; i++) {
          //   if (
          //     (nowVideoPlayInfo['video' + i].isShowPlayBack || nowVideoPlayInfo['video' + i].isShowPreview) &&
          //     nowVideoPlayInfo['video' + i].playInfo &&
          //     nowVideoPlayInfo['video' + i].playInfo.id === attributes.id
          //   ) {
          //     return
          //   }
          // }
          // for (let i = 1; i < 5; i++) {
          //   if (!nowVideoPlayInfo['video' + i].isShowPlayBack && !nowVideoPlayInfo['video' + i].isShowPreview) {
          //     nowVideoPlayInfo['video' + i].isShowPreview = true
          //     nowVideoPlayInfo['video' + i].playInfo = attributes
          //     this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
          //     return
          //   }
          // }
          // this.$notify({
          //   type: 'error',
          //   message: '已超过同时播放上限！'
          // })
        }
      }
    },
    // 打开视频播放窗口
    showVideo(data, max) {
      let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
      for (let i = 1; i < max; i++) {
        if (
          (nowVideoPlayInfo['video' + i].isShowPlayBack || nowVideoPlayInfo['video' + i].isShowPreview) &&
          nowVideoPlayInfo['video' + i].playInfo &&
          nowVideoPlayInfo['video' + i].playInfo.id === data.id
        ) {
          return
        }
      }
      for (let i = 1; i < max; i++) {
        if (!nowVideoPlayInfo['video' + i].isShowPlayBack && !nowVideoPlayInfo['video' + i].isShowPreview) {
          nowVideoPlayInfo['video' + i].isShowPreview = true
          nowVideoPlayInfo['video' + i].playInfo = data
          this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
          return
        }
      }
      this.$notify({
        title: '失败',
        type: 'error',
        message: '已超过同时播放上限！'
      })
    },
    // zoom层级变化
    handleMapZoomChange(e) {
      // console.log('zoom改变:' + e.zoom)
      this.UPDATE_NOW_ZOOM(e.zoom)
    },
    // 鼠标移动事件
    handkeMapMouseMove(e) {
      const { feature } = e
      // 判断是否存在feature(要素)
      if (!feature || !feature.get('attributes')) {
        this.UPDATE_NOW_SELECT_CAMERA_POINT_ID('')
        // 鼠标悬停到非feature地图区域，隐藏feature的overlay
        if (window.$context2D.nowOverlayWeather) {
          window.$context2D.map.removeOverlay(window.$context2D.nowOverlayWeather)
        }
        if (window.$context2D.nowOverlayLabel) {
          window.$context2D.map.removeOverlay(window.$context2D.nowOverlayLabel)
        }
        // 鼠标悬停到非feature区域，开始报警闪烁
        if (this.alarmSetting.isReceive && this.alarmSetting.nowAlarmStatus !== 1) {
          if (this.alarmSetting.alarmFeatureIds.pointIds.includes(this.alarmSetting.nowSelectFeatureId)) {
            this.setFeatures({ type: 'association', features: [] })
          }
          let obj = cloneDeep(this.alarmSetting)
          obj.nowAlarmStatus = 1
          obj.nowSelectFeatureId = ''
          this.SET_ALARM_SETTING(obj)
          this.UPDATE_NOW_SELECT_REALTION_INFO_POINT_ID('')
        }
        return
      }
      // 鼠标移入显示labelName
      const attributes = feature.get('attributes')
      if (
        attributes.type === 'administrativeArea' ||
        (attributes.subType && attributes.subType.indexOf('_sector') != '-1')
      ) {
        return
      }

      // 鼠标悬停天气，显示天气tooltip
      if (attributes.type === 'weatherArea' && attributes.id.split('text').length === 1) {
        // 当前指针初次指向地图区域或者指针指向其他区域，对指向天气区域重新赋值
        if (!this.nowPointerWeatherAreaInfo || this.nowPointerWeatherAreaInfo.adcode !== attributes.areaInfo.adcode) {
          this.setNowPointerWeatherAreaInfo(cloneDeep(attributes.areaInfo))
        }
        // 天气区域改变颜色
        let newFeatures = cloneDeep(this.weatherAreaFeatures)
        for (let i = 0; i < newFeatures.length; i++) {
          if (
            newFeatures[i].attributes.id === attributes.id &&
            newFeatures[i].attributes.id.split('text').length === 1
          ) {
            newFeatures[i].symbol = symbolConfig.weatherAreaHeightSymbol
          } else if (newFeatures[i].attributes.id.split('text').length === 1) {
            newFeatures[i].symbol = convertStyleToSymbol(
              getDefaultStyle(),
              newFeatures[i].attributes.areaInfo.areaStyle
            ) // symbolConfig.weatherAreaSymbol
          }
        }
        this.setFeatures({ type: 'weatherArea', features: newFeatures })
        // 鼠标移入添加overlay
        if (window.$context2D.nowOverlayWeather) {
          window.$context2D.nowOverlayWeather.setPosition([e.lon, e.lat])
          window.$context2D.map.removeOverlay(window.$context2D.nowOverlayWeather)
          window.$context2D.map.addOverlay(window.$context2D.nowOverlayWeather)
        }
      } else if (this.alarmSetting.isReceive && this.alarmSetting.nowAlarmStatus !== 2) {
        // 鼠标移入报警图标，停止闪烁
        let obj = cloneDeep(this.alarmSetting)
        obj.nowAlarmStatus = 2
        obj.nowSelectFeatureId = attributes.id
        this.SET_ALARM_SETTING(obj)
      } else if (attributes) {
        // 鼠标移入普通图标添加overlay,
        let coords = feature.getGeometry().getCoordinates()
        if (!attributes.name) {
          return
        }
        coords = coords.length !== 2 ? getCenterByPolygonFeature(coords) : coords
        this.setOverFlowFeature(attributes)
        if (window.$context2D.nowOverlayLabel) {
          window.$context2D.nowOverlayLabel.setPosition(coords)
          window.$context2D.map.removeOverlay(window.$context2D.nowOverlayLabel)
          window.$context2D.map.addOverlay(window.$context2D.nowOverlayLabel)
        }
        if (attributes.type === 'camera') {
          this.UPDATE_NOW_SELECT_CAMERA_POINT_ID(attributes.id)
        }
      }
    },
    // 点击视频点位加载关联关系信息
    clickVideoResourceAddRelation(id, coords, isDoubleClick, alarmInfo) {
      this.getRelationsInfoApiByUrl({ id: id, ref: 2, isDoubleClick, alarmInfo })
        .then(res => {
          console.log('获取关联关系', res)
          if (isDoubleClick) {
            return
          }
          let obj = res.data
          if (!obj) {
            return
          }
          let points = []
          if (obj.video) {
            obj.video.forEach(item => {
              if (item.point) {
                points.push(item.point)
              }
            })
          }
          if (obj.audio) {
            obj.audio.forEach(item => {
              if (item.point) {
                points.push(item.point)
              }
            })
          }
          if (obj.guard) {
            obj.guard.forEach(item => {
              if (item.point) {
                points.push(item.point)
              }
            })
          }
          if (obj.output) {
            obj.output.forEach(item => {
              if (item.point) {
                points.push(item.point)
              }
            })
          }
          let lineFeatures = []
          points.forEach((item, index) => {
            let points = coords.join(',') + ',' + item.coordinate
            console.log('showAllPointIds', this.showAllPointIds, item)
            if (this.showAllPointIds.includes(item.id)) {
              lineFeatures.push({
                geom: { type: 'LineString', points },
                attributes: {
                  id: item.id,
                  name: 'association',
                  type: 'association',
                  subType: 'association',
                  rType: 0
                },
                symbol: symbolConfig.associationLineSymbol
              })
            }
          })
          console.log('lineFeatures', lineFeatures)
          this.setFeatures({ type: 'association', features: lineFeatures })
        })
        .catch(err => {
          console.log('请求关联关系失败！', err)
        })
    },
    // 根据点击点位设置右侧面板
    editResourceInfo(attr) {
      // 显示资源编辑面板
      // let { rType } = attr;
      // console.log(rType);
      // let resource = [];
      let getPointFun = this.getCommonResourceById
      // 通过接口获取单个设备信息
      let id = ''
      if (attr.id.indexOf('_') == '-1') {
        id = attr.id
      } else {
        id = attr.id.split('_')[1]
      }
      getPointFun(id).then(suc => {
        this.setCurrentSelectResource(suc.data)
        console.log(suc)
        if (suc && suc.data && suc.data.floors) {
          console.log('设置楼层列表', suc.data.floors)
        }
        console.log('获取单个点位信息', suc)
      })
      // // // 设置当前面板是编辑还是应用
      this.setPanelInfoEditStatus(false)
    }
  }
}
