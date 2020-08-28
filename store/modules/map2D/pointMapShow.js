/*
 * @Author: fengbeibei
 * @Date: 2020-05-28 14:36:05
 * @LastEditTime: 2020-06-04 17:26:28
 * @LastEditors: fengbeibei
 * @Description: 点位状态信息管理-地图应用
 */

import { point } from '@turf/helpers'
import { MPSIGNKEY, RESOURCETYPE, PROJ } from 'assets/2DMap/meta/common'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
import indexModule from './index'
import { toMercator } from '@turf/projection'
import { getCommonResourceByIdApi } from '../../../http/map2D/point'
import { cloneDeep } from 'lodash'
const state = {
  administrativeAreaFeatures: [], //行政区划集合
  weatherAreaFeatures: [], //天气查看集合
  weatherAreaEndFeatures: [],
  routePlanFeatures: [], //线路规划集合
  associationFeatures: [], //关联关系图层
  ambientImportPartFeatures: [], //选中重点部位要素集合
  insideBuildFeatures: [], //楼内地图元素要素集合
  importPartFeatures: [], // 机构要素集合
  keyPartsFeatures: [], //重点部位要素集合
  cameraFeatures: [], // 摄像机要素集合
  cameraSectorFeatures: [], // 摄像机可视域要素集合
  recorderFeatures: [], // 录像机要素集合
  alarmFeatures: [], // 报警设备要素集合
  alarmRangeFeatures: [], // 报警设备报警范围要素集合
  fireFightingFeatures: [], // 消防设备要素集合
  intercomFeatures: [], // 对讲设备要素集合
  accessFeatures: [], // 门禁设备要素集合
  mutualLockDoorFeatures: [], // 互锁门要素集合
  protectedCabinFeatures: [], // 防护舱要素集合

  poi_cy_11Features: [], // 餐饮
  poi_cy_12Features: [], // 住、宿
  poi_cy_13Features: [], //批发、零售
  poi_cy_14Features: [], // 汽车销售及服务
  poi_cy_15Features: [], // 金融、保险
  poi_cy_16Features: [], // 教育、文化
  poi_cy_17Features: [], // 卫生、社保
  poi_cy_18Features: [], // 运动、休闲
  poi_cy_19Features: [], // 公共设施
  poi_cy_20Features: [], // 商业设施、商务服务
  poi_cy_21Features: [], // 居民服务
  poi_cy_22Features: [], // 公司企业
  poi_cy_23Features: [], // 交通运输、仓储
  poi_cy_24Features: [], // 科研及技术服务
  poi_cy_25Features: [], // 农林牧渔业
  poi_cy_26Features: [], // 自然地物\地名

  isInfoPanelFixed: true, // 信息面板位置是否是固定，默认固定
  showMapResourceAttributes: true, // 是否显示属性面板
  mapResourceAttributes: {
    // 属性面板信息内容字段
    // 点位信息
    type: 'AttrAlarm', // 枚举， 'AttrAlarm','AttrAlarmHelp','AttrBuilding', 'AttrModel', 'AttrPatrol', 'AttrSinglePawn', 'AttrVideo'
    position: {}, // 经纬度位置
    name: '',
    vendor: '',
    contacts: '',
    telContacts: 0,
    tempName: '',
    resourceId: ''
  },
  nowSetTimeout: undefined
}
const getters = {
  cameraFeatures: state => state.cameraFeatures, //
  nowSetTimeout: state => state.nowSetTimeout, //区域时间定时器
  isInfoPanelFixed: state => state.isInfoPanelFixed, // 获取悬浮或者固定
  showMapResourceAttributes: state => state.showMapResourceAttributes, // 获取点位属性面板是否显示
  mapResourceAttributes: state => state.mapResourceAttributes // 获取点位属性面板信息内容
}
const mutations = {
  SET_FEATURES(state, { type, features = [] }) {
    state[`${type}Features`] = features
  },
  CLEAR_FEATURES(state) {
    for (let name in state) {
      if (name.substring(name.length - 8) === 'Features') state[name] = []
    }
  },
  SET_NOW_TIME_OUT(state, { timeout }) {
    state['nowSetTimeout'] = timeout
  },
  CLOSE_MAP_RESOURCE_ATTRIBUTES(state) {
    state.showMapResourceAttributes = false // 显示资源属性
    state.isInfoPanelFixed = true // 悬浮面板
  },
  SET_MAP_RESOURCE_ATTRIBUTES(state, features) {
    // 设置地图资源信息
    let data = null
    let params = features.res
    console.log('选中资源信息：', params && params.data)
    switch (features.type) {
      case 0: // 视频
        data = {
          type: 'AttrVideo',
          rType: features.type,
          name: params.data.name || '',
          position: { lon: params.data.points[0], lat: params.data.points[1] }, // params.data.point && params.data.point.loc ? { lon: Number(params.data.point.loc.split(',')[0]), lat: Number(params.data.point.loc.split(',')[1]) } : { lon: 0, lat: 0 },
          vendor: (params.data.eid && params.data.eid.manufacturer) || '',
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
                return {
                  contacts: v.name || '',
                  telContacts: v.mobile || ''
                }
              })
            : [],
          videoInfo: params.data, // 视频组件所需信息
          isOnline: params.data.status // 0：不在线 1：在线
        }
        break
      case 1:
      case 11:
      case 9: // 报警
      case 12:
        data = {
          type: 'AttrAlarm',
          rType: features.type,
          name: params.data.name || '',
          level: params.data.level || '',
          position: { lon: params.data.points[0], lat: params.data.points[1] },
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
                return {
                  contacts: v.name || '',
                  telContacts: v.mobile || ''
                }
              })
            : [],
          resourceId: params.data._id || '',
          alarmtemplate: params.data.alarmtemplate || ''
        }
        break
      case 4: // 门禁
        data = {
          type: 'AttrDoorControl',
          rType: features.type,
          name: params.data.name || '',
          vendor: (params.data.eid && params.data.eid.manufacturer) || '',
          position:
            params.data.point && params.data.point.loc
              ? { lon: Number(params.data.point.loc.split(',')[0]), lat: Number(params.data.point.loc.split(',')[1]) }
              : { lon: 0, lat: 0 },
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
                return {
                  contacts: v.name || '',
                  telContacts: v.mobile || ''
                }
              })
            : []
        }
        break
    }
    state.mapResourceAttributes = data // 当前点位属性信息内容
    state.showMapResourceAttributes = true // 显示资源属性
    state.isInfoPanelFixed = false // 悬浮面板
  }
}
const actions = {
  // 设置要素数据(根据类型)
  setFeatures({ commit }, { type, features }) {
    //console.log(type, features)
    commit('SET_FEATURES', { type, features })
  },
  clearFeatures({ commit }) {
    commit('CLEAR_FEATURES')
  },
  setNowSetTimeOut({ commit }, { timeout }) {
    commit('SET_NOW_TIME_OUT', { timeout })
  },
  getCommonResourceById({ commit }, { type, points }) {
    return new Promise((resolve, reject) => {
      console.log(type)
      let res = {
        data: {
          type: type,
          name: 'dsadasdsa',
          status: 0,
          points: points,
          level: 1
        }
      }
      commit('SET_MAP_RESOURCE_ATTRIBUTES', { res, type: type }) // 存储当前点位属性信息
      /* getCommonResourceByIdApi(id).then(res => {
        let type = res.data.type
        commit('SET_MAP_RESOURCE_ATTRIBUTES', {res, type}) // 存储当前点位属性信息
        resolve(res.data)
      }, err => {
        reject(err)
      }) */
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
