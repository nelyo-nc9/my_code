/*
 * @Author: fengbeibei
 * @Date: 2020-05-21 13:30:49
 * @LastEditTime: 2020-06-05 11:43:48
 * @LastEditors: fengbeibei
 * @Description: 地图通用业务相关状态管理(电子地图-地图应用)
 */

import {
  getMapConfigDlgFormDataApi,
  addMapConfigDlgFormDataApi,
  editMapConfigDlgFormDataApi,
  getTreeApiSubaArea,
  getTreeApiArea,
  getWeatherApiSubInfo,
  getAlarmSettingApi,
  updateAlarmSettingApi,
  addAlarmSettingApi,
  saveDistrictSettingApi,
  getDistrictSettingApi,
  getVagueTreeApiSubaArea,
  getAlarmCountApi,
  getAlarmColorApi,
  getFloorsByOrgIdApi,
  findCountApi
} from 'http/map2D/index'
import { getAllRelationPointInfo } from 'http/map2D/point'
import { getBoxSelectionApi, getPointRelationInfo } from 'http/map2D/point' // 框选结果统计
import { POITYPEALL } from 'assets/2DMap/meta/common'
import { cloneDeep, min, reject } from 'lodash'
import indexObj from './indexObj'
const state = {
  refreshTreeList: false, // 机构重点部位树节点刷新 状态
  refreshTreeListBox: false, // 机构重点部位树节点刷新 状态
  isRealData: false, // 当前使用是否是建行真实数据
  environmentalScienceInformation: null, // 最新的环境信息
  indoorInformation: null, // 最新的室内信息
  isMapOuter: 1, // 1:动态地图，2：静态地图
  floorMap: {
    pointObj: null,
    envImageData: null,
    floorsImageDate: null,
    // 楼内地图对象
    isFloor: false, // ture 室内 false 环境
    id: '0',
    envId: ''
  },
  // 楼内平面图
  indoorLayerConfig: {
    extent: [-180, -90, 180, 90],
    url: '/static/map2d/temp/lnpmt.jpg'
  },
  // 环境平面图
  outdoorLayerConfig: {
    extent: [-180, -90, 180, 90],
    url: '/static/map2d/temp/hjpmt.jpg'
  },
  isMapEdit: false, // true配置  false 应用
  routePlanInfo: {}, // 路网规划信息
  ConfigurationApplication: true, // true地图应用，false地图配置  废弃
  measureActive: false, // 测量功能激活状态
  currMeasureType: null, // 当前测量类型
  drawActive: false, // 绘制功能激活状态
  currDrawType: '', // 当前绘制类型
  drawStyleType: null, // 当前绘制样式类型
  infoWindowPosition: null, // 地图信息框经纬度
  currFeature: null, // 当前选中要素
  overFlowFeature: { name: '' }, // 当前鼠标悬停选中要素
  buildingDirectory: false, // 楼层索引现因控制 机构重点部位树下面的
  drawResult: {
    access: [],
    alarm: [],
    camera: [],
    fireFighting: [],
    importPart: [],
    intercom: [],
    keyParts: [],
    protectedCabin: [],
    recorder: []
  }, // 绘制结果
  drawResultCallback: null, // 绘制结果回调
  varNowZoom: '', // 点击树保存的可见层级
  mapConfig: {
    mapId: '110000',
    projection: 'EPSG:3857',
    center: [12971547.26829515, 4859682.86922005],
    zoom: 7,
    extent: [12848875.338142732, 4785292.759869763, 13081663.540343883, 5021313.790468693],
    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer', // 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
    childAreaUrl: '', // 显示省级地图底图
    panFactor: 5000,
    nowZoom: 7,
    minZoom: 5,
    maxZoom: 20
  },
  staticMapConfig: {
    center: [0, 0],
    extent: [-180, -90, 180, 90],
    mapUrl: ''
  },
  // 地图配置页右上角工具开关
  mapToolbarStatus: {
    setShowFloorInfo: true, // 默认显示机构树
    equipmentControl: false, // 设备/要素显隐控制
    markControl: true, // 设备标注
    correlationControl: false, // 关联关系
    adminAreaControl: false, // 行政区设置
    mapConfigControl: false, // 地图配置
    selectionControl: false, // 框选工具
    routeControl: false, // 路线规划
    measureControl: false, // 测量尺
    weatherControl: false, // 实时天气
    policeControl: false // 报警配置
  },
  mapConfigDlgFormData: null,
  selectPoiPoint: [], // 勾选的兴趣点
  administrativeArea: {
    Highlight: { label: '高亮区域', value: true }
  },
  ambientImportPart: {
    ambientImport: { label: '重点区域选中', value: true }
  },
  insideBuild: {
    common: { label: '通用标签', value: false }
  },
  checkedEquipments: indexObj.checkedEquipments, // 地图配置
  checkedEquipmentsApply: indexObj.checkedEquipmentsApply, // 地图应用
  videoPlayInfo: {
    // 视频展示模块显隐控制
    video1: {
      isShowPlayBack: false,
      isShowPreview: false,
      playInfo: null
    },
    video2: {
      isShowPlayBack: false,
      isShowPreview: false,
      playInfo: null
    },
    video3: {
      isShowPlayBack: false,
      isShowPreview: false,
      playInfo: null
    },
    video4: {
      isShowPlayBack: false,
      isShowPreview: false,
      playInfo: null
    }
  },
  boxSelectionArr: null, // 框选到的资源数据
  boxStaticObj: null, // 框选到的要统计的 明细对象
  showLeftFloorInfo: true, // 默认显示左侧面板
  showAlarmFloors: false,
  showFloorInfo: false, // 默认是否展示左侧下方 平面图信息 楼层面板
  isShowPanelTools: false, // 控制右侧详情面板显隐
  isEditPanelTools: false, // 控制右侧详情面板是否可编辑
  currPanelToolComponent: null, // 当前右侧信息面板组件
  drawFeatureStyle: null, // 绘制要素的样式
  drawDistrictStyle: null, // 行政区绘制样式
  alarmSetting: indexObj.alarmSetting, // 报警设置
  showAlarmVideoInfo: {
    isShowAlarmVideo: false, // 是否显示警告视频播放弹框
    showAlarmVideoRelationArr: [], // 报警点位关联关系视频列表信息
    nowShowAlarmDetailInfo: null // 当前显示报警点位详情信息
  },
  floorsPanelObj: null,
  nowSelectCameraPointId: '', // 当前鼠标悬停摄像机点位id
  clickTreeNode: null, // 点击的当前树节点保存的点位
  clickTreeNodeDetailsInfo: [], // 点击当前树节点，获取所有相关点位详细
  importFormData: null, // 重点部位详细信息
  administrativeAreaInfo: [], // 所有行政区划信息
  nowSelectAreaInfo: null, // 当前选中区域信息
  selectDistrictName: null, // 当前选中行政
  nowSelectAreaWKTInfo: null, // 当前选中区域几何信息
  nowSelectWeatherAreaInfo: null, // 当前选中天气信息
  nowPointerWeatherAreaInfo: null, // 当前指针指向的天气信息
  nowWeatherListInfo: [], // 当前请求天气列表信息
  nowSelectRealtionInfo: null, // 当前请求关联关系信息
  nowSelectRealtionInfoIds: [], // 当前选中关联关系关联点位id
  allRelationPointIds: [], // 所有关联关系点位id
  nowSelectRealtionInfoPointId: '' // 当前选择关联关系点位编码
}
const getters = {
  showAlarmFloors: state => state.showAlarmFloors,
  // mapGoBack: state => state.mapGoBack, // 地图回退状态保存
  floorsPanelObj: state => state.floorsPanelObj, // 报警状态下左侧楼层索引面板   name  list
  clickTreeNode: state => state.clickTreeNode, // 点击树存储的节点    id   type   subTYpe
  boxSelectionArr: state => state.boxSelectionArr, // 框选到的资源数据
  boxStaticObj: state => state.boxStaticObj, // 框选绘制后统计的对象
  overFlowFeature: state => state.overFlowFeature, // 鼠标悬停选中
  isMapEdit: state => state.isMapEdit, // 当前组件是否是再编辑页面中引用
  refreshTreeList: state => state.refreshTreeList, // 点击是否刷新当前树
  refreshTreeListBox: state => state.refreshTreeListbox, // 点击是否刷新当前树
  alarmSetting: state => state.alarmSetting, // 报警设置
  mapConfig: state => state.mapConfig, // 地图配置信息
  varNowZoom: state => state.varNowZoom, // 点击树保存的可见层级
  routePlanInfo: state => state.routePlanInfo, // 路网规划数据
  administrativeAreaInfo: state => state.administrativeAreaInfo, // 所有行政区划信息
  nowSelectAreaInfo: state => state.nowSelectAreaInfo, // 当前选中区域信息
  selectDistrictName: state => state.selectDistrictName,
  nowSelectWeatherAreaInfo: state => state.nowSelectWeatherAreaInfo, // 当前选中区域信息
  nowPointerWeatherAreaInfo: state => state.nowPointerWeatherAreaInfo, // 当前鼠标悬停区域信息
  environmentalScienceInformation: state => state.environmentalScienceInformation, // 最新的环境平面图信息
  setindoorInformation: state => state.setindoorInformation, // 最新的环境平面图信息
  isMapOuter: state => state.isMapOuter, // 获取当前地图是否是楼外地图
  floorMap: state => state.floorMap, // 楼内地图
  showFloorInfo: state => state.showFloorInfo, // 左侧下方显示楼层信息
  mapToolbarStatus: state => state.mapToolbarStatus,
  // drawActive: state => state.drawActivem, // 激活绘制功能(原来的感觉有问题)
  drawActive: state => state.drawActive, // 激活绘制功能
  drawFeatureStyle: state => state.drawFeatureStyle, // 绘制要素的样式
  drawDistrictStyle: state => state.drawDistrictStyle, // 绘制行政区的样式
  drawResult: state => state.drawResult,
  importFormData: state => state.importFormData,
  administrativeArea: state => state.administrativeArea,
  checkedEquipments: state => state.checkedEquipments,
  checkedEquipmentsApply: state => state.checkedEquipmentsApply,
  selectPoiPoint: state => state.selectPoiPoint,
  isShowPanelTools: state => state.isShowPanelTools,
  isEditPanelTools: state => state.isEditPanelTools,
  currPanelToolComponent: state => state.currPanelToolComponent,
  videoPlayInfo: state => state.videoPlayInfo,
  nowSelectRealtionInfo: state => state.nowSelectRealtionInfo,
  nowSelectRealtionInfoIds: state => state.nowSelectRealtionInfoIds,
  allRelationPointIds: state => state.allRelationPointIds,
  showAlarmVideoInfo: state => state.showAlarmVideoInfo,
  nowSelectRealtionInfoPointId: state => state.nowSelectRealtionInfoPointId,
  nowSelectCameraPointId: state => state.nowSelectCameraPointId
}
const mutations = {
  INIT_ALL_MAP_SET_INFO(state, data) {
    let obj = indexObj.updateSetInfoByLocalStorage({
      checkedEquipmentsApply: state.checkedEquipmentsApply,
      checkedEquipments: state.checkedEquipments,
      alarmSetting: state.alarmSetting,
      pageType: data.pageType
    })
    console.log('获取设置结果', obj)
    state.checkedEquipmentsApply = obj.checkedEquipmentsApply
    state.checkedEquipments = obj.checkedEquipments
    state.alarmSetting = obj.alarmSetting
  },
  SET_FLOORS_PANEL_OBJ(state, data) {
    state.floorsPanelObj = data
  },
  SET_SHOW_ALARM_FLOORS(state, data) {
    state.showAlarmFloors = data
  },
  UPDATE_SHOW_ALARM_VIDEO_RELATION_ARR(state, data) {
    const { audio, guard, video, output, deviceName, name, orgName, keyPartName, subType } = data.resData.data
    state.showAlarmVideoInfo.showAlarmVideoRelationArr = video
    state.showAlarmVideoInfo.isShowAlarmVideo = true
    state.showAlarmVideoInfo.nowShowAlarmDetailInfo = {
      ...data.alarmInfo
    }
  },
  UPDATE_NOW_SELECT_REALTION_INFO_POINT_ID(state, data) {
    state.nowSelectRealtionInfoPointId = data
  },
  UPDATE_SHOW_ALARM_VIDEO_INFO(state, data) {
    for (let name in data) {
      state.showAlarmVideoInfo[name] = data[name]
    }
  },
  UPDATE_NOW_SELECT_REALTION_INFO(state, data) {
    const { audio, guard, video, output } = data.data
    //  暂时不要 outout
    state.nowSelectRealtionInfo = audio.concat(guard, video)
    // state.showAlarmVideoInfo.showAlarmVideoRelationArr = video
    let obj = data.data
    if (!obj) {
      state.nowSelectRealtionInfoIds = []
    }
    let ids = []
    if (obj.video) {
      obj.video.forEach(item => {
        if (item.point) {
          ids.push(item.point.id)
        }
      })
    }
    if (obj.audio) {
      obj.audio.forEach(item => {
        if (item.point) {
          ids.push(item.point.id)
        }
      })
    }
    if (obj.guard) {
      obj.guard.forEach(item => {
        if (item.point) {
          ids.push(item.point.id)
        }
      })
    }
    if (obj.output) {
      obj.output.forEach(item => {
        if (item.point) {
          ids.push(item.point.id)
        }
      })
    }
    state.nowSelectRealtionInfoIds = ids
  },
  CLEAR_NOW_SELECT_REALTION_INFO(state, data = null) {
    state.nowSelectRealtionInfo = data
    state.nowSelectRealtionInfoIds = []
  },
  // nowSelectCameraPointId
  UPDATE_NOW_SELECT_CAMERA_POINT_ID(state, data) {
    state.nowSelectCameraPointId = data
  },
  UPDATE_ALL_RELATION_POINT_ID(state, data) {
    state.allRelationPointIds = data
  },
  UPDATE_INDOOR_LAYER_CONFIG(state, data) {
    state.indoorLayerConfig[data.key] = data.value
  },
  UPDATE_OUTDOOR_LAYER_CONFIG(state, data) {
    state.outdoorLayerConfig[data.key] = data.value
  },
  UPDATE_SHOW_LEFT_FLOOR_INFO(state, isShow) {
    state.showLeftFloorInfo = isShow
  },
  UPDATE_NOW_ZOOM(state, nowZoom) {
    state.mapConfig.nowZoom = nowZoom
  },
  // varNowZoom 点击树保存的可见层级
  VAR_NOW_ZOOM(state, data) {
    state.varNowZoom = data
  },
  UPDATE_IS_REAL_DATA(state) {
    // 测试数据和建行数据切换
    state.isRealData = !state.isRealData
  },
  //  设置存储点击的当前树节点
  SET_CLICK_TREE_NODE(state, data) {
    state.clickTreeNode = data // id   type   subType
  },
  // buildingDirectory // 楼层索引现因控制 机构重点部位树下面的
  BUILDING_DIRECTORY(state, data) {
    state.buildingDirectory = data
  },

  SET_BOX_STATIC_OBJ(state, data) {
    const selectTypeMap = {
      importPart: 'org',
      keyParts: 'keyPart',
      camera: 'video',
      recorder: 'videoHost',
      alarm: 'alarmDevice',
      fireFighting: 'fireDevice',
      intercom: 'intercomDevice',
      access: 'accessControlDevice',
      mutualLockDoor: 'lockingDoor',
      protectedCabin: 'cabin'
    }
    if (state.boxStaticObj === null) {
      state.boxStaticObj = data
    } else {
      let stateboxStaticObj = state.boxStaticObj
      for (let k in selectTypeMap) {
        stateboxStaticObj[k] = stateboxStaticObj[k].concat(data[k])
        let obj = {}
        stateboxStaticObj[k] = stateboxStaticObj[k].reduce((cur, next) => {
          obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
          return cur
        }, [])
      }
      state.boxStaticObj = stateboxStaticObj
    }
  },
  // 设置框选后台返回得资源数据   图层数据使用
  SET_BOX_SELECTTION_ARR(state, allArr = null) {
    let endArr = []
    let stateBoxSelectionArr = state.boxSelectionArr ? state.boxSelectionArr : []
    for (let i = 0; i < allArr.length; i++) {
      let isKind = false
      for (let k = 0; k < stateBoxSelectionArr.length; k++) {
        if (stateBoxSelectionArr[k].id === allArr[i].id) {
          isKind = true
          break
        }
      }
      if (!isKind) {
        endArr.push(allArr[i])
      }
    }
    state.boxSelectionArr = allArr /// stateBoxSelectionArr.concat(endArr)
  },
  SET_NOW_WEATHER_LIST_INFO(state, data = null) {
    state.nowWeatherListInfo = data
  },
  CLEAR_BOX_SELECTTION_ARR(state) {
    console.log('清空数组')
    state.boxSelectionArr = []
  },
  SET_VIDEO_PLAY_INFO(state, data = null) {
    state.videoPlayInfo = data
  },
  SET_ROUTE_PLAN_INFO(state, data = null) {
    state.routePlanInfo = data
  },
  SET_ADMINISTRATIVE_AREA_INFO(state, data = null) {
    state.administrativeAreaInfo = data
  },
  SET_SELECT_AREA_INFO(state, data = null) {
    state.nowSelectAreaInfo = data
  },
  SET_SELECT_DISTRICT_NAME(state, data = null) {
    state.selectDistrictName = data
  },
  SET_SELECT_AREA_WKT_IND(state, data = null) {
    state.nowSelectAreaWKTInfo = data
  },
  SET_SELECT_WEATHER_AREA_INFO(state, data = null) {
    state.nowSelectWeatherAreaInfo = data
  },
  SET_POINTER_WEATHER_AREA_INFO(state, data = null) {
    console.log('指针指向天气区域对象改变', data)
    state.nowPointerWeatherAreaInfo = data
  },
  ENVIRONMENTAL_SCIENCEN_INFORMATION(state, data = null) {
    // 最新的环境平面图信息
    state.environmentalScienceInformation = data
  },
  INDOOR_INFORMATION(state, data = null) {
    // 最新的室内信息
    state.indoorInformation = data
  },
  SET_IS__Floor_Map(state, data = null) {
    state.floorMap = data
  },
  SET_IS_MAP_OUTER(state, flag) {
    state.pointVideoList = []
    state.isMapOuter = flag
  },
  // SET_MAP_GO_BACK(state, flag) {
  //   state.mapGoBack = flag
  // },
  SET_MEASURE_ACTIVE(state, data = false) {
    state.measureActive = data
  },
  SET_IS_MAP_EDIT(state, data = false) {
    state.isMapEdit = data
  },
  REFRESH_TREE_LIST(state, data) {
    state.refreshTreeList = data
  },
  REFRESH_TREE_LIST_BOX(state, data) {
    state.refreshTreeListBox = data
  },
  SET_MEASURE_TYPE(state, data = null) {
    state.currMeasureType = data
  },
  SET_DRAW_STYLE_TYPE(state, data = null) {
    state.drawStyleType = data
  },
  SET_DRAW_RESULT_CB(state, data = null) {
    state.drawResultCallback = data
  },
  SET_DRAW_RESULT(state, data) {
    state.drawResult = data
  },
  SET_DRAW_TYPE(state, data = null) {
    state.currDrawType = data
  },
  SET_DRAW_ACTIVE(state, data = false) {
    state.drawActive = data
  },
  SET_INFO_WINDOW_POSITION(state, data = null) {
    state.infoWindowPosition = data
  },
  SET_CURR_FEATURE(state, data = null) {
    state.currFeature = data
  },
  SET_OVER_FLOW_FEATURE(state, data = null) {
    state.overFlowFeature = data
  },
  SET_MAP_TOOLBAR_STATUS(state, data) {
    if (state.mapToolbarStatus.correlationControl) {
      state.nowSelectRealtionInfo = null
      state.nowSelectRealtionInfoIds = []
    }
    if (!state.mapToolbarStatus[data]) {
      for (let st in state.mapToolbarStatus) {
        state.mapToolbarStatus[st] = false
      }
    }
    state.mapToolbarStatus[data] = !state.mapToolbarStatus[data]
  },
  SET_MAP_TOOLBAR_STATUS_FALSE(state) {
    state.nowSelectRealtionInfo = null
    state.nowSelectRealtionInfoIds = []
    for (let st in state.mapToolbarStatus) {
      state.mapToolbarStatus[st] = false
    }
  },
  SET_MAPCONFIG_DIG_DATA(state, data) {
    state.mapConfigDlgFormData = data
  },
  SET_CHECKED_EQUIPMENT(state, data = null) {
    state.checkedEquipments = _.cloneDeep(data)
    indexObj.updateLocalStorageBySetInfo(state.checkedEquipments, 'checkedEquipments')
  },
  SET_CHECKED_EQUIPMENT_APPLY(state, data = null) {
    state.checkedEquipmentsApply = _.cloneDeep(data)
    console.log(state.checkedEquipmentsApply)
    indexObj.updateLocalStorageBySetInfo(state.checkedEquipmentsApply, 'checkedEquipmentsApply')
  },
  SET_SELECT_POIPOINT(state, data = null) {
    console.log('兴趣点改变', cloneDeep(state.selectPoiPoint), cloneDeep(data))
    state.selectPoiPoint = _.cloneDeep(data)
    indexObj.updateLocalStorageBySetInfo(state.selectPoiPoint, 'selectPoiPoint')
    // if (state.selectPoiPoint.length === 0) {
    //   let obj = indexObj.updateSetPoiInfoByLocalStorage({ selectPoiPoint: data })
    //   console.log('兴趣点改变', obj)
    //   state.selectPoiPoint = _.cloneDeep(obj.selectPoiPoint)
    // } else {
    //   state.selectPoiPoint = _.cloneDeep(data)
    //   indexObj.updateLocalStorageBySetInfo(state.selectPoiPoint, 'selectPoiPoint')
    // }
  },
  CLEAR_SELECT_POIPOINT(state) {
    state.selectPoiPoint.forEach(item => {
      item.value = false
    })
  },
  // 设置左侧面板的显隐
  SET_SHOW_FlOOR_INFO(state, data) {
    state.showFloorInfo = data
  },
  // 设置右侧面板的显隐
  SET_PANEL_INFO_STATUS(state, data) {
    state.isShowPanelTools = data
  },
  // 设置右侧面板是否可编辑
  SET_PANEL_INFO_EDIT_STATUS(state, data) {
    state.isEditPanelTools = data
  },
  SET_CURR_PANEL_TOOL_COMPONENT(state, data = null) {
    state.currPanelToolComponent = data
  },
  SET_DRAW_FEATURE_STYLE(state, data) {
    // 设置绘制要素的样式
    state.drawFeatureStyle = data
  },
  SET_DRAW_DISTRICT_STYLE(state, data) {
    // 设置行政域绘制的样式
    state.drawDistrictStyle = data
  },
  SET_ALARM_SETTING(state, data) {
    // console.log('bbd1', cloneDeep(data))
    if (
      state.alarmSetting.isReceive !== data.isReceive ||
      state.alarmSetting.isCount !== data.isCount ||
      state.alarmSetting.isLocation !== data.isLocation
    ) {
      state.alarmSetting = data
      indexObj.updateLocalStorageBySetInfo(state.alarmSetting, 'alarmSetting')
    } else {
      state.alarmSetting = data
    }
  },
  SET_ALARM_SETTING_AREA_INFO(state, data) {
    // 设置绘制要素的样式
    state.alarmSetting.areaInfo = data
  },
  SET_IMPORT_FORM_DATA(state, data) {
    state.importFormData = data
  },
  // 更新地图ID
  UPDATE_MAP_IP(state, id) {
    state.mapConfig.mapId = id
  },
  // 更新地图显示范围
  UPDATE_MAP_EXTENT(state, extent) {
    state.mapConfig.extent = extent
  },
  // 更新地图显示底图
  UPDATE_MAP_URL(state, url) {
    state.mapConfig.url = url
  },
  // 更新地图显示子级区域底图
  UPDATE_MAP_CHILD_AREA_URL(state, childAreaUrl) {
    state.mapConfig.childAreaUrl = childAreaUrl
  },
  // 更新地图显示底图
  UPDATE_MAP_MINZOOM(state, minZoom) {
    state.mapConfig.minZoom = minZoom
  },
  UPDATE_LAYER_CHECKBOX(state, checkboxInfo) {
    const lable = checkboxInfo.lable
    const checked = checkboxInfo.checked
  }
}

const actions = {
  updateShowAlarmVideoInfo({ commit }, data) {
    commit('UPDATE_SHOW_ALARM_VIDEO_INFO', data)
  },
  setBoxStaticObj({ commit }, data) {
    commit('SET_BOX_STATIC_OBJ', data)
  },
  setClickTreeNode({ commit }, data) {
    commit('SET_CLICK_TREE_NODE', data)
  },
  updateShowLeftFloorInfo({ commit }, data) {
    commit('UPDATE_SHOW_LEFT_FLOOR_INFO', data)
  },
  setRoutePlanInfo({ commit }, data) {
    commit('SET_ROUTE_PLAN_INFO', data)
  },
  setAdministrativeAreaInfo({ commit }, data) {
    commit('SET_ADMINISTRATIVE_AREA_INFO', data)
  },
  setNowSelectAreaInfo({ commit }, data) {
    commit('SET_SELECT_AREA_INFO', data)
  },
  setSelectDistrictName({ commit }, data) {
    commit(' SET_SELECT_DISTRICT_NAME', data)
  },
  setNowSelectWKTAreaInfo({ commit }, data) {
    commit('SET_SELECT_AREA_WKT_IND', data)
  },
  setNowSelectWeatherAreaInfo({ commit }, data) {
    console.log(data)
    commit('SET_SELECT_WEATHER_AREA_INFO', data)
  },
  setNowPointerWeatherAreaInfo({ commit }, data) {
    commit('SET_POINTER_WEATHER_AREA_INFO', data)
  },
  setenvironmentalScienceInformation({ commit }, data) {
    // 最新的环境平面图信息
    commit('ENVIRONMENTAL_SCIENCEN_INFORMATION', data)
  },
  setindoorInformation({ commit }, data) {
    // 最新的室内信息
    commit('INDOOR_INFORMATION', data)
  },
  setIsFloorMap({ commit }, status, flag) {
    // 楼内地图切换
    commit('SET_IS__Floor_Map', status, flag)
  },
  setIsMapOuter({ commit }, flag) {
    // 地图 跟平面图切换
    commit('SET_IS_MAP_OUTER', flag)
  },
  // setMapGoBack({ commit }, flag) {
  //   //  地图回退状态
  //   commit('SET_MAP_GO_BACK', flag)
  // },
  setIsMapEdit({ commit }, flag) {
    // 应用 配置 页面组件切换
    commit('SET_IS_MAP_EDIT', flag)
  },
  setRefreshTreeList({ commit }, flag) {
    // 应用 配置 页面组件切换
    commit('REFRESH_TREE_LIST', flag)
  },
  setRefreshTreeListBox({ commit }, flag) {
    // 应用 配置 页面组件切换
    commit('REFRESH_TREE_LIST_BOX', flag)
  },
  //  varNowZoom 点击树保存的可见层级
  setVarNowZoom({commit, state}, data) {
    commit('VAR_NOW_ZOOM', data)
  },
  // 设置绘制结果(含执行结果回调)
  setDrawResult({ commit, state }, data) {
    commit('SET_DRAW_RESULT', data)
    state.drawResultCallback instanceof Function && state.drawResultCallback(data)
    console.log('11122' + state.drawResult)
  },
  // 设置测量状态
  setMeasureActive({ commit }, { active, type }) {
    commit('SET_MEASURE_ACTIVE', active)
    commit('SET_MEASURE_TYPE', active ? type : null)
  },
  // 设置绘制活动状态(包含结果回调)
  setDrawActive({ commit }, { active, type, styleType, callback }) {
    commit('SET_DRAW_ACTIVE', active) // 激活绘制功能
    commit('SET_DRAW_TYPE', type) // 配置绘制类型
    commit('SET_DRAW_STYLE_TYPE', styleType) // 配置绘制样式
    commit('SET_DRAW_RESULT_CB', callback) // 配置绘制回调
  },
  // 设置信息框位置
  setInfoWindowPosition({ commit }, data) {
    commit('SET_INFO_WINDOW_POSITION', data)
  },
  // 设置当前地图选中要素
  setCurrFeature({ commit }, data) {
    commit('SET_CURR_FEATURE', data)
  },
  // 当前鼠标悬停选中要素
  setOverFlowFeature({ commit }, data) {
    commit('SET_OVER_FLOW_FEATURE', data)
  },
  // 设置工具条工具开关
  setMapToolbarStatus({ commit }, data) {
    commit('SET_MAP_TOOLBAR_STATUS', data)
  },

  // 获取地图配置弹框表单数据
  getMapConfigDlgFormData({ commit }, data) {
    return new Promise((resolve, reject) => {
      getMapConfigDlgFormDataApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取所有省份信息
  getAllTreeApiData({ commit }, data) {
    return new Promise((resolve, reject) => {
      getTreeApiArea(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  //  // 获取统计
  findCount({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findCountApi(payload)
        .then(res => {
          // this.SET_ALARM_DEAL_TABLE_DATA(res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 安防获取报警统计信息
  getAlarmCount({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAlarmCountApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取报警信息的楼层索引面板
  setFloorsPanelObj({ commit }, data) {
    return new Promise((resolve, reject) => {
      getFloorsByOrgIdApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          commit('SET_FLOORS_PANEL_OBJ', res.data.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取报警统计颜色
  getAlarmColor() {
    return new Promise((resolve, reject) => {
      getAlarmColorApi()
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  getTreeApiSubaAreaInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      getTreeApiSubaArea(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  saveDistrictSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      saveDistrictSettingApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDistrictSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      getDistrictSettingApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          commit('SET_DRAW_DISTRICT_STYLE', res.data.data.areaStyle)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警配置
  getAlarmSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAlarmSettingApi(data)
        .then(res => {
          console.log('获取报警配置信息', res.data.data)
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          commit('SET_ALARM_SETTING_AREA_INFO', res.data.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警配置
  addAlarmSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      addAlarmSettingApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警配置
  updateAlarmSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateAlarmSettingApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 设置地图配置弹框表单数据
  setMapConfigDlgFormData({ commit }, data) {
    commit('SET_MAPCONFIG_DIG_DATA', data)
  },
  // 保存地图配置弹框表单数据
  addMapConfigDlgFormData({ commit }, data) {
    return new Promise((resolve, reject) => {
      addMapConfigDlgFormDataApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 编辑地图配置弹框表单数据
  editMapConfigDlgFormData({ commit }, data) {
    return new Promise((resolve, reject) => {
      editMapConfigDlgFormDataApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getWeatherApiSubInfoByUrl({ commit }, data) {
    return new Promise((resolve, reject) => {
      getWeatherApiSubInfo(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取框选结果
  getBoxSelection({ commit }, data) {
    return new Promise((resolve, reject) => {
      getBoxSelectionApi(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          let allPoint = res.data.data
          console.log(allPoint)
          let allArr = []
          for (let k in allPoint) {
            allPoint[k].forEach(item => {
              allArr.push(item)
            })
          }
          console.log('arr', allArr)
          commit('SET_BOX_SELECTTION_ARR', allArr)
          // commit('SET_BOX_STATIC_OBJ', res.data.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getVagueTreeApiSubaAreaByUrl({ commit }, data) {
    return new Promise((resolve, reject) => {
      getVagueTreeApiSubaArea(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getRelationsInfoApiByUrl({ commit }, data) {
    return new Promise((resolve, reject) => {
      getPointRelationInfo(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          }
          if (data.isDoubleClick) {
            console.log('UPDATE_SHOW_ALARM_VIDEO_RELATION_ARR', data)
            commit('UPDATE_SHOW_ALARM_VIDEO_RELATION_ARR', { resData: res.data, alarmInfo: data.alarmInfo })
          } else {
            commit('UPDATE_NOW_SELECT_REALTION_INFO_POINT_ID', data.id)
            commit('UPDATE_NOW_SELECT_REALTION_INFO', res.data)
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getAllRelationPointInfoByUrl({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAllRelationPointInfo(data)
        .then(res => {
          if (!res.data) {
            this.$notify({
              title: '失败',
              type: 'error',
              message: res.message
            })
          } else if (res && res.data && res.data.data) {
            let arr = []
            res.data.data.forEach(item => {
              arr.push(item.id)
            })
            commit('UPDATE_ALL_RELATION_POINT_ID', arr)
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 更新地图ID
  updateMapId({ commit }, payload) {
    commit('UPDATE_MAP_IP', payload)
  },
  // 更新地图显示范围
  updateMapExtent({ commit }, payload) {
    commit('UPDATE_MAP_EXTENT', payload)
  },
  // 更新地图显示底图
  updateMapUrl({ commit }, payload) {
    commit('UPDATE_MAP_URL', payload)
  }, // 更新地图显示子级省份底图
  updateMapChildAreaUrl({ commit }, payload) {
    commit('UPDATE_MAP_CHILD_AREA_URL', payload)
  },
  // 更新地图最小显示级别
  updateMapMinZoom({ commit }, payload) {
    commit('UPDATE_MAP_MINZOOM', payload)
  },
  // 改变选中的设备要素
  setCheckedEquipments({ commit }, data) {
    commit('SET_CHECKED_EQUIPMENT', data)
  },
  // 改变应用模块选中的设备要素
  setCheckedEquipmentsApply({ commit }, data) {
    commit('SET_CHECKED_EQUIPMENT_APPLY', data)
  },
  // 改变勾选的兴趣点
  setSelectPoiPoint({ commit }, data) {
    commit('SET_SELECT_POIPOINT', data)
  },
  // 控制右侧详情面板显隐
  setPanelInfoStatus({ commit }, payload) {
    commit('SET_PANEL_INFO_STATUS', payload)
  },
  // 控制左侧详情面板显隐
  setShowFloorInfo({ commit }, payload) {
    commit('SET_SHOW_FlOOR_INFO', payload)
  },
  // 控制右侧详情面板是否可编辑
  setPanelInfoEditStatus({ commit }, payload) {
    commit('SET_PANEL_INFO_EDIT_STATUS', payload)
  },
  // 设置当前右侧信息面板组件
  setCurrPanelToolComponent({ commit }, payload) {
    commit('SET_CURR_PANEL_TOOL_COMPONENT', payload)
  },
  // 设置绘制要素的样式
  setDrawFeatureStyle({ commit }, data) {
    commit('SET_DRAW_FEATURE_STYLE', data)
  },
  // 设置绘制行政域样式
  setDrawDistrictStyle({ commit }, data) {
    commit('SET_DRAW_DISTRICT_STYLE', data)
  },
  // 设置报警配置
  setAlarmSetting({ commit }, data) {
    commit('SET_ALARM_SETTING', data)
  },
  // 设置重点部位详细数据
  setPanelInfoFormData({ commit }, data) {
    commit('SET_IMPORT_FORM_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
