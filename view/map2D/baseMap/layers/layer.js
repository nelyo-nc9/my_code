/*
 * @Author: fengbeibei
 * @Date: 2020-05-27 13:47:45
 * @LastEditTime: 2020-06-04 20:30:23
 * @LastEditors: fengbeibei
 * @Description: 地图图层配置及要素
 */
import { map, filter, cloneDeep, clone } from 'lodash'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import layerMap from 'assets/2DMap/meta/layerMapShow'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import highLightTrans from 'assets/2DMap/feature/edit/highLight'
import areaUtil from 'assets/2DMap/areaUtil'
export default {
  data() {
    return {
      importPartLayer: layerMap['importPart'], // 机构
      keyPartsLayer: layerMap['keyParts'], // 重点部位
      cameraLayer: layerMap['camera'], // 摄像机
      cameraSectorLayer: layerMap['cameraSector'], // 摄像机可视域
      recorderLayer: layerMap['recorder'], // 录像机
      alarmLayer: layerMap['alarm'], // 报警设备
      alarmRangeLayer: layerMap['alarmRange'], // 报警设备探测范围
      fireFightingLayer: layerMap['fireFighting'], // 消防设备
      intercomLayer: layerMap['intercom'], // 对讲设备
      accessLayer: layerMap['access'], // 门禁设备
      mutualLockDoorLayer: layerMap['mutualLockDoor'],
      protectedCabinLayer: layerMap['protectedCabin'], // 防护舱
      associationLayer: layerMap['association'], // 关联关系
      cameraSectorFeatures: [] //摄像机可视域
    }
  },
  watch: {},
  computed: {
    ...mapGetters('map2d/mapIndex', [
      'checkedEquipmentsApply',
      'administrativeArea',
      'nowSelectAreaInfo',
      'mapToolbarStatus',
      'boxSelectionArr',
      'alarmSetting',
      'floorMap',
      'clickTreeNode',
      'nowSelectRealtionInfoIds',
      'allRelationPointIds',
      'nowSelectRealtionInfoPointId',
      'nowSelectCameraPointId',
      'mapConfig'
    ]),
    ...mapState('map2d/pointMapShow', {
      importPartFeatures(state) {
        return this.filterFeatures(state.importPartFeatures, 'importPart')
      }, // 机构
      keyPartsFeatures(state) {
        return this.filterFeatures(state.keyPartsFeatures, 'keyParts')
      }, // 重点部位
      cameraFeatures(state) {
        let features = this.filterFeatures(state.cameraFeatures, 'camera')
        let endCameraSectorFeatures = this.getSectorFeaturesByCameraFeatures(state.cameraSectorFeatures, features)
        return features.concat(endCameraSectorFeatures)
      }, // 摄像机
      recorderFeatures(state) {
        return this.filterFeatures(state.recorderFeatures, 'recorder')
      }, // 录像机
      alarmFeatures(state) {
        return this.filterFeatures(state.alarmFeatures, 'alarm')
      }, // 报警设备
      alarmRangeFeatures(state) {
        return this.filterFeatures(state.alarmRangeFeatures, 'alarm')
      }, // 报警设备探测范围
      fireFightingFeatures(state) {
        return this.filterFeatures(state.fireFightingFeatures, 'fireFighting')
      }, // 消防设备
      intercomFeatures(state) {
        return this.filterFeatures(state.intercomFeatures, 'intercom')
      }, // 对讲设备
      accessFeatures(state) {
        return this.filterFeatures(state.accessFeatures, 'access')
      }, // 门禁设备
      mutualLockDoorFeatures(state) {
        return this.filterFeatures(state.mutualLockDoorFeatures, 'mutualLockDoor')
      },
      protectedCabinFeatures(state) {
        return this.filterFeatures(state.protectedCabinFeatures, 'protectedCabin')
      }, // 防护舱
      associationFeatures(state) {
        return this.filterAssociationFeatures(state.associationFeatures)
      } // 关联关系
    })
  },
  methods: {
    ...mapMutations('map2d/mapIndex', ['SET_ALARM_SETTING']),
    ...mapActions('map2d/mapIndex', ['setClickTreeNode']),
    //关联关系连线数组
    filterAssociationFeatures(features = []) {
      return filter(features, v => this.nowSelectRealtionInfoIds.includes(v.attributes.id))
    },
    filterFeatures(features = [], type) {
      const itemArray = map(this.checkedEquipmentsApply[type] || {}, (o, k) => ({ key: k, ...o })) // 转换为数组
      const checkedItem = filter(itemArray, { value: true }) // 提取选中项
      const checkedKeys = map(checkedItem, 'key') // 提取选中key
      checkedKeys.push(type) // 保证设备子类型于设备主类型相同的要素保持显示
      if (this.mapToolbarStatus.weatherControl) {
        return [] // 加载天气隐藏所有点位信息
      } else if (this.mapToolbarStatus.selectionControl) {
        // 框选
        let features1 = checkedKeys.length ? filter(features, v => checkedKeys.includes(v.attributes.subType)) : [] // 过滤已选中类型要素
        if (this.isMapOuter === 1) {
          features1 = filter(features1, v => v.attributes.level <= this.mapConfig.nowZoom)
        }

        // 取出框选所有点位id
        let endBoxSelectionArr = this.boxSelectionArr ? this.boxSelectionArr : []
        let ids = endBoxSelectionArr.map(obj => {
          return obj.id
        })
        let features2 = filter(features, v => ids.includes(v.attributes.id)) // 过滤已选中类型要素
        let features3 = filter(features1, v => !ids.includes(v.attributes.id.toString())) // 框选点位
        let endFeatures = features2.concat(features3)
        // 鼠标选中点位，标记点位信息
        if (this.clickTreeNode && this.clickTreeNode.type === type) {
          this.addClickListToMap(features, endFeatures)
        }
        return this.mergeAlarmInformation(features, endFeatures)
      } else if (this.mapToolbarStatus.correlationControl) {
        // 显示关联关系信息
        let endFeatures = checkedKeys.length
          ? filter(features, v => this.allRelationPointIds.includes(v.attributes.id))
          : [] // 过滤已选中类型要素
        if (this.clickTreeNode && this.clickTreeNode.type === type) {
          this.addClickListToMap(features, endFeatures)
        } // 鼠标选中点位，标记点位信息
        endFeatures = this.showRelationBySelectPoint(endFeatures, features) //同时显示选中关联关系关联的关联点位
        return this.mergeAlarmInformation(features, endFeatures)
      } else {
        // 正常情况
        let endFeatures = checkedKeys.length ? filter(features, v => checkedKeys.includes(v.attributes.subType)) : [] // 过滤已选中类型要素
        if (this.isMapOuter === 1) {
          endFeatures = filter(endFeatures, v => v.attributes.level <= this.mapConfig.nowZoom)
        }
        if (this.clickTreeNode && this.clickTreeNode.type === type) {
          this.addClickListToMap(features, endFeatures)
        } // 鼠标选中点位，标记点位信息
        return this.mergeAlarmInformation(features, endFeatures)
      }
    },
    mergeAlarmInformation(features, endFeatures) {
      if (!this.alarmSetting.isReceive) return endFeatures
      // 报警
      let alarmFeatures = filter(
        features,
        v =>
          this.alarmSetting.alarmFeatureIds.pointIds.includes(v.attributes.id) ||
          (v.attributes.type === 'keyParts' &&
            this.alarmSetting.alarmFeatureIds.keyPartIds.includes(v.attributes.keyPartId)) ||
          (v.attributes.type === 'importPart' && this.alarmSetting.alarmFeatureIds.orgIds.includes(v.attributes.orgId))
      )
      alarmFeatures = cloneDeep(alarmFeatures)
      // 切换报警图标样式
      alarmFeatures.forEach(item => {
        if (item.symbol.iconStyle && item.symbol.iconStyle.url)
          item.symbol.iconStyle.url = item.symbol.iconStyle.url.replace('_1.png', '_3.png').replace('_2.png', '_3.png')
        if (item.symbol.fillColor) item.symbol.fillColor = 'rgba(255,0,0,0.5)'
        if (item.symbol.strokeStyle) item.symbol.strokeStyle.outLineColor = 'rgba(255,0,0,0.9)'
        item.attributes.now_feature_status = 3
        return item
      }) // 切换为报警图标

      if (
        !this.mapToolbarStatus.selectionControl &&
        this.alarmSetting.alarmFeatureIds.pointIds.includes(this.nowSelectRealtionInfoPointId)
      ) {
        let relationFeatureArr = filter(features, v => this.nowSelectRealtionInfoIds.includes(v.attributes.id))
        endFeatures = this.mergeTwoFeaturesArr(relationFeatureArr, endFeatures)
      }
      endFeatures = this.mergeFeatureArrayBaojing(endFeatures, alarmFeatures)
      return endFeatures
    },
    // 过滤楼内楼外图层
    filterOuterAndIn(endFeatures, isMapOuter, type) {
      endFeatures = filter(endFeatures, v => v.attributes.isouter === (isMapOuter === 1)) // 过滤楼内楼外图标
      if (!this.floorMap.isFloor && isMapOuter === 2) {
        endFeatures = filter(endFeatures, v => type === 'importPart' || type === 'keyparts')
      } // 环境平面图过滤
      if (this.floorMap.isFloor && isMapOuter === 2) {
        endFeatures = filter(endFeatures, v => type !== 'importPart' && type !== 'keyparts')
      } // 室内平面图过滤
    },
    mergeTwoFeaturesArr(arr1, arr2) {
      //把arr2里面没有的从arr1中取出加入进去
      let arr3 = []
      for (let i = 0; i < arr1.length; i++) {
        let isHave = false
        for (let k = 0; k < arr2.length; k++) {
          if (arr1[i].attributes.id === arr2[k].attributes.id) {
            isHave = true
            break
          }
        }
        if (!isHave) arr3.push(arr1[i])
      }
      return arr2.concat(arr3)
    },
    // 显示点击设备关联关系
    showRelationBySelectPoint(endFeatures, features) {
      if (this.nowSelectRealtionInfoIds.length === 0) {
        return endFeatures
      }
      let ids = this.nowSelectRealtionInfoIds
      let allFeatures = filter(features, v => ids.includes(v.attributes.id))
      allFeatures.forEach(item => {
        let isKind = false
        for (let i = 0; i < endFeatures.length; i++) {
          if (endFeatures[i].attributes.id === item.attributes.id) {
            isKind = true
            break
          }
        }
        if (!isKind) {
          endFeatures.push(item)
        }
      })
      return endFeatures
    },
    // 获取可视域显示
    getSectorFeaturesByCameraFeatures(sectorFeatures, features) {
      let ids = features.map(obj => {
        return obj.attributes.id
      })
      if (this.checkedEquipmentsApply.camera.sector.value) {
        return filter(sectorFeatures, v => ids.includes(v.attributes.id.split('_sector_')[1]))
      } else {
        return filter(
          sectorFeatures,
          v =>
            this.nowSelectCameraPointId !== '' && v.attributes.id.split('_sector_')[1] === this.nowSelectCameraPointId
        )
      }
    },
    // 鼠标选中点位，标记点位信息
    addClickListToMap(features, endFeatures) {
      features.forEach(item => {
        if (item.attributes.id === this.clickTreeNode.id) {
          endFeatures.push(item)
          let center
          if (item.geom.type === 'LineString') {
            let arr = item.geom.points.split(',')
            center =
              arr.length === 4
                ? (parseFloat(arr[0]) / 2 + parseFloat(arr[2]) / 2).toString() +
                  ',' +
                  (parseFloat(arr[1]) / 2 + parseFloat(arr[3]) / 2).toString()
                : areaUtil.getMultiPExtentAndCenter(item.geom.points + ',' + arr[0] + ',' + arr[1]).center
          } else {
            center =
              item.geom.points.split(',').length > 2
                ? areaUtil.getMultiPExtentAndCenter(item.geom.points).center
                : item.geom.points
          }

          endFeatures.push(
            highLightTrans.getLocateFeature(
              'locationPoint_' + item.attributes.id,
              center,
              item.geom.points.split(',').length > 2
            )
          )
          if (!this.clickTreeNode.feature) {
            let obj = cloneDeep(this.clickTreeNode)
            obj.feature = cloneDeep(item)
            this.setClickTreeNode(obj)
            this.updateSelectTooltipInfo(item)
          }
        }
      })
    },
    // 添加普通点位到报警点位数组里面（去重），arr1 普通点位数组  arr2 报警点位数组
    mergeFeatureArrayBaojing(arr1, arr2) {
      let noKindArr = []
      for (let i = 0; i < arr1.length; i++) {
        let isKind = false
        for (let k = 0; k < arr2.length; k++) {
          if (arr1[i].attributes.id === arr2[k].attributes.id) {
            isKind = true
            continue
          }
        }
        if (!isKind) {
          noKindArr.push(arr1[i])
        }
      }
      if (this.alarmSetting.isKwinKel) {
        arr2.forEach(item => {
          if (item.attributes.id === this.alarmSetting.nowSelectFeatureId) {
            noKindArr.push(item)
          }
        })
        return noKindArr
      }
      return arr2.concat(noKindArr)
    },
    // 更新选中toolTIP信息
    updateSelectTooltipInfo(feature) {
      let coords = feature.geom.points.split(',')
      if (coords.length !== 2) {
        return
      }
      window.$context2D.nowOverlayArrribute.setPosition([Number(coords[0]), Number(coords[1])])
      if (window.$context2D.nowOverlayArrribute) {
        window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
      }
      window.$context2D.map.addOverlay(window.$context2D.nowOverlayArrribute)
    }
  }
}
