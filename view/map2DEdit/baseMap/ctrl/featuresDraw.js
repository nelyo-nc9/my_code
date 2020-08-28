// 点位要素绘制
import { mapState, mapMutations, mapActions } from 'vuex'
import drawStyleMap from 'assets/2DMap/meta/drawStyle'
import keyPartsTrans from 'assets/2DMap/feature/edit/keyParts'
import {
  DEVICETYPE,
  VIDEOTYPEKEY,
  MPSIGNKEY,
  TREENODETYPE,
  SHAPETYPE,
  DRAWSTYLETYPE,
  ALARMDEVICETYPE,
  EnglishNamePrefix,
  MAPTYPENUMBER
} from 'assets/2DMap/meta/common'
import { convertStyleToSymbol, getDefaultStyle } from 'assets/2DMap/feature/edit/area'
import videoTrans from 'assets/2DMap/feature/edit/video'
import drawConfig from 'assets/2DMap/meta/draw'
import styleConfig from 'assets/2DMap/meta/style'
import areaUtil from 'assets/2DMap/areaUtil'
import generalTrans from 'assets/2DMap/feature/edit/general'
import { cloneDeep } from 'lodash'
import highLightTrans from 'assets/2DMap/feature/edit/highLight'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
export default {
  data() {
    return {
      pointDraw: {
        id: 'pointDrawer',
        name: 'pointDrawer'
      },
      lineStringDraw: JSON.parse(JSON.stringify(drawConfig.commonAlarmLine)), // 线绘制样式
      polygonDraw: JSON.parse(JSON.stringify(drawConfig.grid)), // 区域绘制样式
      isDrawAreaInter: false, // 绘制区域是否相交
      resMapSign: null // 地图要素类型标识 MPSIGNKEY
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['mapConfig', 'currDrawType', 'drawActive', 'drawStyleType']),
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 存在vuex中获取的机构重点部位树信息
      sectorChecked: ({ map2d }) => map2d.mapPoint.videoEditSectorChecked,
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      editSector: ({ map2d }) => map2d.mapPoint.editSector,
      areaDrawActive: ({ map2d }) => map2d.mapPoint.areaDrawActive,
      areaDrawLoc: ({ map2d }) => map2d.mapPoint.areaDrawLoc,
      drawFeatureStyle: ({ map2d }) => map2d.mapIndex.drawFeatureStyle,
      importPartIconFeatures: ({ map2d }) => map2d.mapPoint.importPartIconFeatures,
      editActive: ({ map2d }) => map2d.mapPoint.editActive
    }),
    drawStyle() {
      let style = cloneDeep(this.drawStyleType)
      if (!(style && typeof style === 'object')) {
        if ([DRAWSTYLETYPE.LINESTRING, DRAWSTYLETYPE.POLYGON].includes(style)) {
          // 线或面绘制时，根据选中资源设置绘制提示图标
          style = drawStyleMap[style]
          if (this.curSelectResourcePoint) {
            // 获取选中点位的绘制样式
            style = this.getCurSelectResourcePointDrawStyle(style)
          }
        } else {
          style = drawStyleMap[this.drawStyleType] || drawStyleMap['default']
        }
      }
      return style
    }
  },
  watch: {
    drawActive(flag) {
      // 监听点位绘制状态变化
      if (!flag) {
        // 关闭绘制时，需要清空绘制要素
        this.clearDrawAreaFeatures() // 清空绘制内容
      } else {
        // 开始绘制时
        if (this.curSelectResourcePoint) {
          // 点位编辑缩略图形态绘制时，需要清空当前选中编辑点位要素和高亮定位图标
          this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [] }) // 清空高亮定位
          // 过滤掉当前点位要素
          let { type, subType } = this.curSelectResourcePoint
          let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
          let pointTypeValue = pointTypeData[pointTypeKey]
          // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
          if (pointTypeValue && this[pointTypeValue + 'Icons']) {
            let icons = cloneDeep(this[pointTypeValue + 'Icons'])
            icons = icons.filter(item => {
              return item.attributes.id !== this.curSelectResourcePoint.id
            }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
            this.setPointIconFeatures({ type: pointTypeValue, features: icons })
          }
        }
      }
    },
    areaDrawActive(flag) {
      this.updateAreaDrawer(flag)
    },
    drawFeatureStyle(val) {
      // 绘制样式变化
      if (val) {
        let style = JSON.parse(JSON.stringify(val))
        this.updateFeatureStyle(style)
      }
    },
    selectedTreeCode: {
      // 监听选中机构、重点部位、设备、资源树节点的变化
      handler(newValue, oldValue) {
        // console.log('当前地图类型')
        // console.log('当前点位所在地图类型')
        this.setCurrentSelectResource(null) // 清空选中资源
        // this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [] }) // 清空高亮定位
        if (newValue) {
          // 新数据有效时
          if (newValue.isPoint && newValue.point) {
            /**
             * 需要判断选中的点位节点是否在当前地图上
             * 点位所在地图(place：1-室外gis，2-环境平面图，3-楼层平面图)
             * 当前地图类型（isMapOuter：1-室外gis，2-静态平面图，floorMap.isFloor:true楼层，false环境）
             */
            let { place } = newValue.point // 点位所在的地图类型(1-室外gis，2-环境平面图，3-楼层平面图)
            if (place === this.nowMapPlace) {
              // 点位所在地图类型与当前地图类型一致时，楼层平面图需要判断是否是同一楼层，是同一楼层直接高亮定位点位，不是同一楼层需要切换楼层平面图
              if (place === MAPTYPENUMBER.gis) {
                // 室外gis
                if (this.curSelectResourcePoint) {
                  // 选中点位数据有效时
                  this.revertOldSelectPointFeature(this.curSelectResourcePoint) // 还原之前选中的点位要素
                }
                this.showPointPanelInfo(newValue.point) // 显示点位面板信息
              }
              if (place === MAPTYPENUMBER.hj) {
                // 楼层平面图点位所在环境平面图与当前地图环境平面图不同时，需要更新环境平面图的图片路径
                if (
                  this.environmentalScienceInformation &&
                  this.environmentalScienceInformation.id !== newValue.point.envId
                ) {
                  this.clearAllMapPoints() // 清空地图点位
                  if (newValue.point.envId) {
                    // 获取点位所在的环境平面图数据
                    this.getCommonResourceById(newValue.point.id)
                      .then(res => {
                        if (res && Number(res.code) === 0 && res.data) {
                          let envImageData = cloneDeep(res.data.envImageData)
                          this.setenvironmentalScienceInformation(envImageData)
                          this.UPDATE_OUTDOOR_LAYER_CONFIG({
                            // 展示环境平面图
                            key: 'url',
                            value: envImageData.image
                          })
                          this.showPointPanelInfo(newValue.point) // 显示点位面板信息
                        }
                      })
                      .catch(err => {
                        console.error('跳转到环境平面图时，获取楼层信息失败！', err)
                      })
                  }
                } else {
                  if (this.curSelectResourcePoint) {
                    // 选中点位数据有效时
                    this.revertOldSelectPointFeature(this.curSelectResourcePoint) // 还原之前选中的点位要素
                  }
                  this.showPointPanelInfo(newValue.point) // 显示点位面板信息
                }
              }
              if (place === MAPTYPENUMBER.lc) {
                //
                if (this.indoorInformation && this.indoorInformation.id !== newValue.point.floorId) {
                  // 点位所在楼层与当前地图楼层不同时，需要更新楼层平面图的图片路径
                  this.clearAllMapPoints() // 清空地图点位
                  if (newValue.point.floorId) {
                    // 点位所在楼层id
                    // 获取点位所在的楼层数据
                    this.getAllFloorAKey(newValue.point.floorId)
                      .then(res => {
                        let floorData = cloneDeep(res.data)
                        this.setindoorInformation(floorData)
                        this.UPDATE_INDOOR_LAYER_CONFIG({
                          // 展示环境平面图
                          key: 'url',
                          value: floorData.image
                        })
                        this.showPointPanelInfo(newValue.point) // 显示点位面板信息
                      })
                      .catch(err => {
                        console.error('跳转到楼层平面图时，获取楼层信息失败！', err)
                      })
                  }
                } else {
                  if (this.curSelectResourcePoint) {
                    // 选中点位数据有效时
                    this.revertOldSelectPointFeature(this.curSelectResourcePoint) // 还原之前选中的点位要素
                  }
                  this.showPointPanelInfo(newValue.point) // 显示点位面板信息
                }
              }
            } else {
              this.clearAllMapPoints() // 清空地图点位
              // 点位所在地图类型与当前地图类型不一致时，需要跳转到点位所在的地图
              if (place === MAPTYPENUMBER.gis) {
                // 跳转到室外gis图：isMapOuter设置为 1 ，数据清空（environmentalScienceInformation最新的环境信息，indoorInformation最新的室内信息）
                this.setIsMapOuter(1)
                this.setenvironmentalScienceInformation(null)
                this.setindoorInformation(null)
              } else if (place === MAPTYPENUMBER.hj) {
                // 跳转到环境平面图：isMapOuter设置为 2，floorMap.isFloor设置为false，设置environmentalScienceInformation最新的环境信息和outdoorLayerConfig.url，数据清空（indoorInformation最新的室内信息）
                /**
                 * 现在没办法获取到选中点位节点所在所在机构或重点部位的点位数据（获取到机构或重点部位的环境平面图的路径）
                 * 无法获取到对应环境平面图的图片路径进行地图跳转展示，需要和后端沟通
                 */
                let keypartPoint = cloneDeep(newValue.point.envImageData) // 选中点位节点所在机构或重点部位的点位数据（获取到机构或重点部位的环境平面图的路径）
                this.setenvironmentalScienceInformation(keypartPoint)
                this.UPDATE_OUTDOOR_LAYER_CONFIG({
                  // 展示环境平面图
                  key: 'url',
                  value: keypartPoint.image
                })
                this.setindoorInformation(null)
                this.setIsFloorMap({ isFloor: false })
                this.setIsMapOuter(2)
                this.showPointPanelInfo(newValue.point) // 显示点位面板信息
              } else if (place === MAPTYPENUMBER.lc) {
                // 跳转到楼层平面图：isMapOuter设置为 2，floorMap.isFloor设置为true，设置indoorInformation最新的室内信息和indoorLayerConfig.url，数据清空（environmentalScienceInformation最新的环境信息）
                if (newValue.point.floorId) {
                  // 点位所在楼层id
                  // 获取点位所在的楼层数据
                  this.getAllFloorAKey(newValue.point.floorId)
                    .then(res => {
                      this.setenvironmentalScienceInformation(null)
                      let floorData = cloneDeep(res.data)
                      this.setindoorInformation(floorData)
                      this.UPDATE_INDOOR_LAYER_CONFIG({
                        // 展示环境平面图
                        key: 'url',
                        value: floorData.image
                      })
                      this.setIsFloorMap({ isFloor: true })
                      this.setIsMapOuter(2)
                      this.showPointPanelInfo(newValue.point) // 显示点位面板信息
                    })
                    .catch(err => {
                      console.error('跳转到楼层平面图时，获取楼层信息失败！', err)
                    })
                }
              }
            }
          }
        }
      },
      deep: true
    },
    curSelectResourcePoint: {
      // 监听选中点位数据的变化
      handler: function(newValue, oldValue) {
        this.onSelectedPointResChange(newValue, oldValue) // 处理选中点位数据的变化
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setDrawActive',
      'setIsMapOuter',
      'setIsFloorMap',
      'setindoorInformation',
      'setenvironmentalScienceInformation'
    ]),
    ...mapActions('map2d/mapPoint', [
      'getAllTypePoint',
      'setEditActive',
      'setPointResourceByType',
      'getAllFloorAKey',
      'getEnvironmental'
    ]),
    ...mapActions('map2d/mapPoint', [
      'setVideoSectorFeatures',
      'setDrawFeatureLoc',
      'setAreaDrawActive',
      'setAreaDrawLoc',
      'setPointIconFeatures',
      'updateMapCommonResourcePoint'
    ]),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode', 'setSelectedTreeCode', 'setFloorList']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']), // 楼内平面图 环境平面图
    // 清空绘制区域
    clearDrawAreaFeatures() {
      this.clearFeaturesInLayer(this.pointDraw.id)
    },
    /**
     * 处理选中点位数据的变化
     * @param {*} newValue 点位数据新值
     * @param {*} oldValue 点位数据旧值
     */
    onSelectedPointResChange(newValue, oldValue) {
      // 点击点位切换，还原旧的点位
      if (oldValue && newValue && oldValue.id !== newValue.id) {
        // 选中点位数据有效时
        this.revertOldSelectPointFeature(oldValue) // 还原之前选中的点位要素
      }
      if (newValue) {
        // 点位数据发生变化
        let point = JSON.parse(JSON.stringify(newValue))
        !this.drawActive && this.showPointFeature(point) // 显示点位要素
        this.setEditActive(true) // 激活要素编辑状态
        if (!this.drawActive) {
          this.highlightLocateFeature(point) // 高亮点位要素
          this.updateFeatureByDrawEnd()
        }
      } else if (oldValue) {
        // 取消点位选择，还原点位原来状态
        // 还原可视域
        // showVideoSectorHide
        if (oldValue.type === DEVICETYPE.video) {
          this.showVideoSectorRefresh(oldValue)
        }

        this.revertOldSelectPointFeature(oldValue) // 还原之前选中的点位要素
        this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [] }) // 清空高亮定位
        this.setEditActive(false) // 关闭要素编辑状态
      }
      // 判断是不是在切换点
      // console.log('测试', newValue)//报错问题
      // console.log('测试2', oldValue)
      if (oldValue != null && newValue != null) {
        if (newValue.id !== oldValue.id) {
          if (oldValue.type === DEVICETYPE.video) {
            this.showVideoSectorRefresh(oldValue)
          }
        } else {
        }
      }
    },
    /**
     * 获取选中点位的绘制样式
     * style 样式数据
     */
    getCurSelectResourcePointDrawStyle(style) {
      let pointDrawStyle = JSON.parse(JSON.stringify(style)) // 点位绘制样式
      if (this.curSelectResourcePoint) {
        let pointData = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        let borderStyleObj = { '1': 'solid', '2': 'dashed', '3': 'dotted' }
        let styleObj = {
          borderstyle: pointData.borderStyle ? borderStyleObj[pointData.borderStyle.toString()] : 'solid', // 边框类型
          borderwidth: pointData.borderWidth || '1', // 边框宽度
          bordercolor: pointData.borderColor || '#ff0000', // 边框颜色
          bodertransparency: pointData.borderTransparency || 100, // 边框透明度
          fillcolor: pointData.fillColor || '#ff0000', // 颜色填充
          fillcolortransparency: pointData.fillTransparency || 50, // 填充透明度
          fontcolor: pointData.fontColor || '#ff0000', // 字体颜色
          fontsize: pointData.fontSize || '12' // 字体大小
        }
        let selectedPointStyle = convertStyleToSymbol(getDefaultStyle(), styleObj) // 选中的点位样式
        // 更新选中点位样式到点位绘制样式中
        if (this.drawStyleType === DRAWSTYLETYPE.POLYGON) {
          // 绘制区域时需要设置填充颜色
          let fillColor = selectedPointStyle.fillColor || drawStyleMap[DRAWSTYLETYPE.POLYGON].fillColor
          fillColor && (pointDrawStyle.fillColor = fillColor)
        }
        selectedPointStyle.strokeStyle && (pointDrawStyle.strokeStyle = selectedPointStyle.strokeStyle)
        selectedPointStyle.textStyle &&
          selectedPointStyle.textStyle.fillColor &&
          (pointDrawStyle.textStyle.fillColor = selectedPointStyle.textStyle.fillColor)
      }
      let { type, subType } = this.curSelectResourcePoint
      let pointIconType = this.getPointDrawStyleType(type, subType) // 获取点位对应的图标绘制样式类型数据
      pointDrawStyle.iconStyle = cloneDeep(drawStyleMap[pointIconType].iconStyle)
      return pointDrawStyle
    },
    /**
     * 显示点位要素
     * point 点位数据
     */
    showPointFeature(point) {
      let { type } = point
      if ([DEVICETYPE.org, DEVICETYPE.keyPart].includes(Number(type))) {
        // 机构-1或重点部位-2
        this.showKeyPartPointFeature(point) // 显示选中机构/重点部位点位数据
      } else if (DEVICETYPE.video === Number(type)) {
        // 摄像机-3
        this.showKeyPartPointFeature_video(point)
      } else if (DEVICETYPE.videoHost === Number(type)) {
        // 录像机-4
        this.showKeyPartPointFeature_video(point)
      } else if (DEVICETYPE.alarmDevice === Number(type)) {
        // 报警设备-5
        this.showKeyPartPointFeature_video(point)
      } else if (DEVICETYPE.fireDevice === Number(type)) {
        // 消防设备-6
        this.showKeyPartPointFeature_firefighting(point)
      } else if (DEVICETYPE.intercomDevice === Number(type)) {
        // 对讲设备-7
        this.showIntercomPointFeature(point) // 显示对讲设备点位要素
      } else if (DEVICETYPE.accessControlDevice === Number(type)) {
        // 门禁设备-8
        this.showAccessControlPointFeature(point) // 显示门禁设备点位要素
      } else if (DEVICETYPE.cabin === Number(type)) {
        // 防护舱设备-9
        this.showIntercomPointFeature(point) // 显示防护舱设备点位要素
      }
    },
    /**
     * 获取点位对应的图标绘制样式类型数据
     * type 点位大类
     * subType 点位子类
     */
    getPointDrawStyleType(type, subType) {
      let pointIconType
      if ([DEVICETYPE.org, DEVICETYPE.keyPart].includes(Number(type))) {
        // 机构-1或重点部位-2
        pointIconType = this.getKeyPartPointStyleType(type, subType)
      } else {
        let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
        if (pointTypeData[pointTypeKey]) {
          pointIconType = pointTypeData[pointTypeKey] + 'Draw'
          // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
        }
      }
      return pointIconType
    },
    /**
     * 还原旧的选择点位要素
     * @param {*} point 点位数据旧值
     */
    revertOldSelectPointFeature(point) {
      // 需要判断点位是否在当前地图上
      let flag = this.isPointOnNowMap(point) // 点位是否在当前地图上
      if (flag) {
        // console.log('需要还原旧的点位数据：', JSON.parse(JSON.stringify(point)))
        if ([DEVICETYPE.org, DEVICETYPE.keyPart].includes(Number(point.type))) {
          // 机构-1或重点部位-2
          this.refreshCurrentKeyPartFeature(point)
        } else if (DEVICETYPE.video === Number(point.type)) {
          // 摄像机-3
          this.refreshCurrentKeyPartFeature_video(point)
        } else if (DEVICETYPE.videoHost === Number(point.type)) {
          // 录像机-4
          this.refreshCurrentKeyPartFeature_video(point)
        } else if (DEVICETYPE.alarmDevice === Number(point.type)) {
          // 报警设备-5
          this.refreshCurrentKeyPartFeature_video(point)
        } else if (DEVICETYPE.fireDevice === Number(point.type)) {
          // 消防设备-6
          this.refreshCurrentKeyPartFeature_firefighting(point)
        } else if (DEVICETYPE.intercomDevice === Number(point.type)) {
          // 对讲设备-7
          this.refreshCurrentIntercomFeature(point)
        } else if (DEVICETYPE.accessControlDevice === Number(point.type)) {
          // 门禁设备-8
          this.refreshCurrentKeyPartFeature_accessControl(point)
        } else if (DEVICETYPE.cabin === Number(point.type)) {
          // 防护舱设备-9
          this.refreshCurrentIntercomFeature(point)
        }
      }
    },
    /**
     * 显示点位面板信息
     * @param {*} data 点位数据
     */
    showPointPanelInfo(data) {
      let { id } = data
      // 通过接口获取单个设备信息 获取地图设备点位详情
      this.getCommonResourceById(id)
        .then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            if (this.selectedTreeNode && this.selectedTreeNode.point && this.selectedTreeNode.point.id === id) {
              // 点位是选中的机构/重点部位时
              let floorList = res.data.floors ? cloneDeep(res.data.floors) : []
              this.setFloorList(floorList) // 设置楼层列表数据
            }
            this.setShowFloorForm(false) // 楼层弹框隐藏
            this.setCurrentSelectResource(res.data)
            this.setPanelInfoStatus(true) // 打开右侧面板
            this.setCurrPanelToolComponent(null)
            this.setPanelInfoEditStatus(true) // 设置当前面板是编辑还是应用(true：可编辑,false：不可编辑)
          }
        })
        .catch(err => {
          console.log('根据id获取点位数据失败：', err)
          this.$notify({ type: 'error', message: '页面权限获取失败' })
        })
    },
    // 点位绘制完成
    handleDrawEnd(info) {
      console.log('点位绘制完成', info, cloneDeep(this.curSelectResourcePoint))
      let _this = this
      const { coods } = info
      if (!this.curSelectResourcePoint || !this.curSelectResourcePoint.isPoint) {
        // 点位未添加时
        const { tierType } = this.selectedTreeCode
        if ([TREENODETYPE.org, TREENODETYPE.loc].includes(tierType)) {
          // 机构/重点部位
          this.addImportPartFeature(coods) // 添加机构、重点部位点位
        } else {
          // 设备
          this.addAllTypeFeature(coods) // 添加各类设备
        }
      } else {
        // 点位已添加时变更点位缩略图形态（点、线、面）重新进行绘制的处理
        // this.setDrawFeatureLoc(coods.toString()) // 设置修改的点位位置
        let point = cloneDeep(this.curSelectResourcePoint)
        point.coordinate = coods.join(',')
        this.setCurrentSelectResource(cloneDeep(point))
        this.updateFeatureByDrawEnd() // 修改地图显示元素
      }
      _this.setDrawActive({ active: false }) // 关闭绘制
    },
    updateFeatureByDrawEnd() {
      let obj = cloneDeep(this.curSelectResourcePoint)
      obj.subType = Number(obj.subType)
      let {id, type, subType} = obj
      let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
      let pointTypeValue = pointTypeData[pointTypeKey]
      // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
      if (pointTypeValue && this[pointTypeValue + 'Icons']) {
        let icons = cloneDeep(this[pointTypeValue + 'Icons'])
        icons = icons.filter(item => {
          return item.attributes.id !== id
        }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
        let feature = keyPartsTrans.transOneIconFeature(obj, this[pointTypeValue + 'Layer'])
        icons.push(feature)
        this.setPointIconFeatures({ type: pointTypeValue, features: icons })
      }
    },
    /**
     * 判断设备的类型，刷新要素
     * @param {*} monitype MONITYPE中对应的资源类型
     */
    refreshResourceFeature(monitype) {
      let nowPointRes = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
      if (monitype === DEVICETYPE.video) {
      } else if (monitype === DEVICETYPE.keyPart) {
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentImportPartFeature(nowPointRes) // 在importPart图层文件中
      } else if (monitype === DEVICETYPE.videoRecorder) {
      } else if (monitype === DEVICETYPE.commonAlarm) {
      } else if (monitype === DEVICETYPE.fireAlarm) {
      } else if (monitype === DEVICETYPE.speech) {
      } else if (monitype === DEVICETYPE.doubleDoor) {
      } else if (monitype === DEVICETYPE.doorControl) {
      } else if (monitype === DEVICETYPE.protectiveTank) {
      }
    },
    /**
     * 点位添加
     * @param {*} coods 坐标
     */
    addAllTypeFeature(coods) {
      let type = this.selectedTreeCode.pointType // 设备大类
      let monitype = this.selectedTreeCode.pointSubType // 设备子类
      if (type === DEVICETYPE.video) {
        // 摄像机
        this.addVideoFeature_video(coods)
      } else if (type === DEVICETYPE.videoHost) {
        // 视频主机
        this.addDeviceFeature_video(coods)
      } else if (type === DEVICETYPE.alarmDevice) {
        // 报警设备
        monitype = Number(monitype)
        switch (
          monitype // 就用这个单词
        ) {
          // 主机
          case ALARMDEVICETYPE.telephoneHost: // 电话报警主机
          case ALARMDEVICETYPE.networkHost: // 网络报警主机
          case ALARMDEVICETYPE.eleFenceBusHost: // 电子围栏总线报警主机
          case ALARMDEVICETYPE.vibrationFiberHost: // 震动光纤报警主机
            this.addDeviceFeature_video(coods)
            break
          // 设备
          case ALARMDEVICETYPE.wallMountedDualDetector: // 壁挂双鉴探测器
          case ALARMDEVICETYPE.ceilingDoubleDetector: // 吸顶双鉴探测器
          case ALARMDEVICETYPE.atmShockDetector: // atm震动探测器
          case ALARMDEVICETYPE.treasuryVibrationDetector: // 金库震动探测器
          case ALARMDEVICETYPE.doorMagneticDetector: // 门磁探测器
          case ALARMDEVICETYPE.glassBreakDetector: // 玻璃破碎探测器
          case ALARMDEVICETYPE.photoelectricSmokeDetector: // 光电感烟探测器
          case ALARMDEVICETYPE.infraredCurtainDetectorIntrusion: // 红外幕帘探测器(入侵)
          case ALARMDEVICETYPE.temperatureDetector: // 温度探测器
          case ALARMDEVICETYPE.waterLeakDetector: // 漏水探测器
          case ALARMDEVICETYPE.emergencyButtonWithSound: // 紧急按钮(有声)
          case ALARMDEVICETYPE.emergencyButtonSilent: // 紧急按钮(无声)
          case ALARMDEVICETYPE.infraredDetector: // 红外对射探测器
          case ALARMDEVICETYPE.displacementDetector: // 位移探测器
          case ALARMDEVICETYPE.vibratingFiber: // 振动光纤
          case ALARMDEVICETYPE.electricFence: // 电子围栏
            this.addResourceFeature_video(coods)
            break
          default:
            break
        }
      } else if (type === DEVICETYPE.fireDevice) {
        // 消防设备
        this.addResourceFeature_firefighting(coods)
      } else if (type === DEVICETYPE.intercomDevice) {
        // 对讲设备
        this.addIntercomFeature(coods)
      } else if (type === DEVICETYPE.accessControlDevice) {
        // 门禁设备
        // console.log('门禁设备')
        this.addEquipmentTypeFeature(coods)
      } else if (type === DEVICETYPE.cabin) {
        // 防护舱
        this.addIntercomFeature(coods)
      }
    },
    /**
     * 开始要素编辑
     */
    editFeatureStart() {
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.type === DEVICETYPE.video) {
        this.showVideoSectorHide()
      }
      this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [] }) // 清空点位高亮要素
    },
    matchVideoType(monitype) {
      let sectorFeatures
      let sectorLayer
      let type
      let sectorResource
      monitype = Number(monitype)
      if (monitype === VIDEOTYPEKEY.boltipc) {
        // 枪机
        sectorFeatures = this.boltipcSectors
        sectorLayer = this.boltipcSectorLayer
        sectorResource = this.boltipcResource
        type = 'boltipc'
      } else if (monitype === VIDEOTYPEKEY.redBoltipc) {
        // 红外枪机
        sectorFeatures = this.redBoltipcSectors
        sectorLayer = this.redBoltipcSectorLayer
        sectorResource = this.redBoltipcResource
        type = 'redBoltipc'
      } else if (monitype === VIDEOTYPEKEY.halfBallipc) {
        // 半球
        sectorFeatures = this.halfBallipcSectors
        sectorLayer = this.halfBallipcSectorLayer
        sectorResource = this.halfBallipcResource
        type = 'halfBallipc'
      } else if (monitype === VIDEOTYPEKEY.fastBallipc) {
        // 球机
        sectorFeatures = this.fastBallipcSectors
        sectorLayer = this.fastBallipcSectorLayer
        sectorResource = this.fastBallipcResource
        type = 'fastBallipc'
      } else if (monitype === VIDEOTYPEKEY.allViewipc) {
        // 全景
        sectorFeatures = this.allViewipcSectors
        sectorLayer = this.allViewipcSectorLayer
        sectorResource = this.allViewipcResource
        type = 'allViewipc'
      } else if (monitype === VIDEOTYPEKEY.pinholeipc) {
        // 针孔
        sectorFeatures = this.pinholeipcSectors
        sectorLayer = this.pinholeipcSectorLayer
        sectorResource = this.pinholeipcResource
        type = 'pinholeipc'
      } else if (monitype === VIDEOTYPEKEY.smartIPC) {
        // 智能IPC
        sectorFeatures = this.smartIPCSectors
        sectorLayer = this.smartIPCSectorLayer
        sectorResource = this.smartIPCResource
        type = 'smartIPC'
      }

      return { sectorFeatures, sectorLayer, type, sectorResource }
    },
    /**
     * 移动图标位置时,可视域同时重新绘制
     * @param {*}
     */
    showVideoSectorHide() {
      if (this.curSelectResourcePoint && (this.isSector || this.sectorChecked)) {
        // showVideoSectorHide
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        const sectorInfo = this.matchVideoType(this.curSelectResourcePoint.subType) // monitype
        let sectorArr = sectorInfo.sectorFeatures
        // let sectorArr = sectorInfo.sectorFeatures.filter(item => {
        let result = sectorArr.filter(
          item =>
            // console.log('id对比', item.attributes.id + '-' + video.id)
            item.attributes.id !== video.id // 不能有花括号
        )
        if (this.editSector) {
          // 当移动位置时,可视域有修改,绘制已修改的可视域
          video.point = {
            ...video.point,
            ...this.editSector
          }
        }
        this.setVideoSectorFeatures({ type: sectorInfo.type, features: result })
      }
    },
    // 刷新挪动点的可视域
    showVideoSectorRefresh(curSelectResourcePoint) {
      // showVideoSectorHide
      if (this.isSector || this.sectorChecked) {
        // showVideoSectorHide
        let video = JSON.parse(JSON.stringify(curSelectResourcePoint))
        const sectorInfo = this.matchVideoType(curSelectResourcePoint.subType) // monitype
        let sectorArr = sectorInfo.sectorFeatures
        // let sectorArr = sectorInfo.sectorFeatures.filter(item => {
        let result = sectorArr.filter(
          item =>
            // console.log('id对比', item.attributes.id + '-' + video.id)
            item.attributes.id !== video.id // 不能有花括号
        )
        if (this.editSector) {
          // 当移动位置时,可视域有修改,绘制已修改的可视域
          video.point = {
            ...video.point,
            ...this.editSector
          }
        }
        // showVideoSectorHide
        const resource = sectorInfo.sectorResource
        let nowPoint = resource.filter(
          item =>
            // console.log('id对比', item.attributes.id + '-' + video.id)
            item.id === curSelectResourcePoint.id // 不能有花括号
        )
        // const sectorInfo = this.matchVideoType(curSelectResourcePoint.subType) //monitype

        // if (coods) {
        // 当移动位置时，同时移动可视域的位置
        // video.point.loc = coods.join(',')
        const coods = nowPoint[0].coordinate
        video.coordinate = coods
        let sectorFeature = videoTrans.transOneSectorFeature(video, { name: sectorInfo.type })
        result.push(sectorFeature)
        // }

        this.setVideoSectorFeatures({ type: sectorInfo.type, features: result })
      }
    },
    /**
     * 移动图标位置时,可视域同时重新绘制
     * @param {*} coods
     */
    showVideoSectorShow(coods) {
      if (this.curSelectResourcePoint && (this.isSector || this.sectorChecked)) {
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        const sectorInfo = this.matchVideoType(this.curSelectResourcePoint.subType) // monitype
        let sectorArr = sectorInfo.sectorFeatures
        if (coods) {
          // 当移动位置时，同时移动可视域的位置
          // video.point.loc = coods.join(',')
          video.coordinate = coods.join(',')
          let sectorFeature = videoTrans.transOneSectorFeature(video, { name: sectorInfo.type })
          sectorArr.push(sectorFeature)
        }

        this.setVideoSectorFeatures({ type: sectorInfo.type, features: sectorArr })
        // this.setVideoSectorFeatures({ type: sectorInfo.type, features: [] })
      }
    },
    /**
     * 结束要素编辑
     */
    editFeatureEnd(coods) {
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.type === DEVICETYPE.video) {
        this.showVideoSectorShow(coods) // 重新显示可视域，更改可视域位置
      }
      let loc = coods.toString()
      // this.setDrawFeatureLoc(loc) // 设置修改的点位位置
      let point = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
      point.coordinate = loc
      this.setCurrentSelectResource(point)
      let { id, shapeType } = point
      this.addHighLightIcon(id, shapeType, coods) // 编辑绘制结束后添加高亮图标
    },
    /**
     * 编辑绘制结束后添加高亮图标
     */
    addHighLightIcon(id, shapeType, coods) {
      let centerCoordinates = Array.isArray(coods) ? coods : coods.split(',').map(item => Number(item))
      if (shapeType) {
        if (shapeType === SHAPETYPE.LINESTRING) {
          // 线
          centerCoordinates = spaceUtil.getMultiLineStringCenter(coods.toString())
        } else if (shapeType === SHAPETYPE.POLYGON) {
          // 面
          centerCoordinates = spaceUtil.getMultiPolygonCenter(coods.toString())
        }
      }
      if (id && centerCoordinates) {
        let feature = highLightTrans.getLocateFeature(id, centerCoordinates)
        this.setPointIconFeatures({ type: this.highLightLocateLayer.name, features: [feature] })
      }
    },
    /**
     *区域绘制结束
     */
    drawPolygonEnd(param) {
      this.resMapSign = MPSIGNKEY.polygon
      let loc = areaUtil.locSwitch(param, this.areaDrawLoc)
      this.getAreaCheckParam(loc)
    },
    updateAreaDrawer(flag) {
      if (flag) {
        // 激活绘制
        let areaDraw = this.getAreaDrawerByResource(flag)
        if (areaDraw && areaDraw.actived) {
          let style = this.drawFeatureStyle ? this.drawFeatureStyle : styleConfig.defaultArea
          areaDraw.drawStyle = areaUtil.convertStyleToSymbol(areaDraw.drawStyle, JSON.parse(JSON.stringify(style)))
          areaDraw.layerStyle = areaUtil.convertStyleToSymbol(areaDraw.layerStyle, JSON.parse(JSON.stringify(style)))
          this.polygonDraw = areaDraw
        }
        if (this.isDrawAreaInter) {
          // 绘制的区域相交时
          this.redrawAreaFeatureByGeom()
        }
      } else {
        // 关闭绘制
        this.polygonDraw.actived = flag
        this.clearFeaturesInLayer(this.polygonDraw.id) // 清空绘制区域要素
        if (this.isDrawAreaInter) {
          // 绘制的区域相交时，开启区域绘制工具
          this.setAreaDrawActive(true)
        }
      }
    },
    // 根据资源获取区域绘制工具样式
    getAreaDrawerByResource(flag) {
      let areaDraw = null
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.hasOwnProperty('rType')) {
        let { rType } = this.curSelectResourcePoint
        if (rType === DEVICETYPE.keyPart) {
          // 重点部位
          areaDraw = JSON.parse(JSON.stringify(drawConfig.importPartArea))
          areaDraw.actived = flag
        }
        if (areaDraw) {
          // 鼠标提示 设置重点部位要素图标
          let iconUrl = ''
          if (iconUrl) {
            areaDraw.drawStyle.iconStyle.url = iconUrl
          }
        }
      }
      return areaDraw
    },
    // 重绘区域要素
    redrawAreaFeatureByGeom() {
      this.isDrawAreaInter = false // 改变相交状态
      let polygonDrawer = null
      let polygonDrawers = this.$refs.polygonDrawer
      if (polygonDrawers && polygonDrawers.length > 0) {
        polygonDrawer = polygonDrawers[0]
      } else {
        polygonDrawer = polygonDrawers
      }
      if (polygonDrawer && polygonDrawer.redrawFeatureByGeom) {
        polygonDrawer.redrawFeatureByGeom(this.areaDrawLoc) // 根据位置重绘区域
      }
    },
    // 获取区域检验参数并检验
    getAreaCheckParam(loc) {
      let featureArr = this.filterFeaturesByEditPage() // 需要检测的要素数组
      let obj = {
        // 参数
        id: 'add',
        loc,
        featureArr
      }
      obj && this.checkInterArea(obj)
    },
    filterFeaturesByEditPage() {
      //  根据类型过滤要素
      let featureArr = []
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.hasOwnProperty('rType')) {
        let { rType } = this.curSelectResourcePoint
        if (rType === DEVICETYPE.keyPart) {
          // 重点部位
          featureArr = this.importPartIconFeatures.filter(item => item.attributes.id !== this.curSelectResourcePoint.id)
        }
      }
      return featureArr
    },
    // 检验区域是否相交
    checkInterArea(obj) {
      const { loc, id, featureArr } = obj
      let isObj = areaUtil.checkInterArea({ loc, id, featureArr })
      if (isObj.isSelfIn || isObj.isIn || isObj.isInter) {
        console.log({
          title: '提示',
          desc: '区域有重叠，请重新绘制',
          duration: 2
        })
        this.isDrawAreaInter = true
        if (this.polygonDraw.actived) {
          this.setAreaDrawActive(false)
        }
      } else {
        this.setAreaDrawLoc(loc)
        if (this.curSelectResourcePoint) {
          // 定位要素
          let { id, point } = this.curSelectResourcePoint
          let loc = this.areaDrawLoc ? this.areaDrawLoc : point.loc
          this.drawMultiPolygonEndLocate(id, loc)
        }
      }
    },
    // 面绘制完后定位
    drawMultiPolygonEndLocate(id, loc) {
      // let centerCoordinates = spaceUtil.getMultiPolygonCenter(loc) // 获取面要素的中心点
      // if (centerCoordinates) {
      //   this.highLightLocateInMapCenter(id, centerCoordinates) // 高亮定位到地图中心
      // }
    },
    // 更新区域样式
    updateFeatureStyle(style) {
      this.polygonDraw.drawStyle = areaUtil.convertStyleToSymbol(this.polygonDraw.drawStyle, style)
      this.polygonDraw.layerStyle = areaUtil.convertStyleToSymbol(this.polygonDraw.layerStyle, style)
      this.lineStringDraw.drawStyle = areaUtil.convertStyleToSymbol(this.lineStringDraw.drawStyle, style)
      this.lineStringDraw.layerStyle = areaUtil.convertStyleToSymbol(this.lineStringDraw.layerStyle, style)
      if (this.editActive) {
        // 要素编辑时
        if (this.curSelectResourcePoint && this.curSelectResourcePoint.hasOwnProperty('rType')) {
          this.updateResourceFeatureStyle(style) // 更新资源要素样式
        } else {
          this.updateAreaFeatureStyle(style) // 更新区域要素样式
        }
      }
    },
    updateResourceFeatureStyle(style) {
      // 更新资源要素样式
      let pointRes = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
      if (pointRes.mapsign) {
        pointRes.mapsign.signtype = this.resMapSign
        let { mapsign, rType } = pointRes
        if (mapsign.signtype !== MPSIGNKEY.point) {
          pointRes.point.style = style
          pointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : pointRes.point.loc
          if (rType === DEVICETYPE.keyPart) {
            // 重点部位
            this.refreshCurrentImportPartFeature(pointRes)
          }
        }
      }
    },
    updateAreaFeatureStyle(style) {
      // 更新区域要素样式
      if (!this.mapEditRightPage || this.mapEditRightPage.page) {
        return
      }
      let rightPage = this.mapEditRightPage.page
      if (this.currentGrid && rightPage === 'gridEditPage') {
        // 右侧是网格编辑面板时
        let nowGrid = JSON.parse(JSON.stringify(this.currentGrid))
        nowGrid.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowGrid.loc
        nowGrid.style = style
        this.refreshCurrentGridFeature(nowGrid)
      } else if (this.isMapOuter && this.currentBuilding && rightPage === 'buildEditPage') {
        // 右侧是楼宇编辑面板时
        let nowBuilding = JSON.parse(JSON.stringify(this.currentBuilding))
        nowBuilding.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowBuilding.loc
        nowBuilding.style = style
        this.refreshCurrentBuildingFeature(nowBuilding)
      }
    },
    refreshCurrentImportPartFeature(importPart) {
      // 还原当前普通报警要素
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.hasOwnProperty('rType')) {
        let { rType } = this.curSelectResourcePoint
        if (rType === DEVICETYPE.keyPart) {
          // 过滤掉当前数据
          let alarmArr = this.importPartIconFeatures.filter(item => item.attributes.id !== importPart.id)
          // 当前数据是当前地图选中的数据时，添加当前重点部位要素
          if (importPart.id === this.curSelectResourcePoint.id) {
            let alarmFeature = generalTrans.transOneFeature(importPart, this.importPartLayer)
            alarmFeature && alarmArr.push(alarmFeature)
          }
          this.setPointIconFeatures(alarmArr)
        }
      }
    }
  }
}
