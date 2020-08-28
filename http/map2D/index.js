import { post, get, put } from '../base'
const uroPrefix = '/organizational/v1/key-part'
/**
 * @description: 获取地图配置详情
 * @param {String}
 */
export const getMapConfigDlgFormDataApi = payload => {
  const param = {
    url: 'map/v1/map-config',
    query: payload
  }
  return get(param)
}

/**
 * @description: 新增地图配置
 * @param {String} payload 配置信息
 */
export const addMapConfigDlgFormDataApi = payload => {
  const param = {
    url: 'map/v1/map-config',
    body: payload
  }
  return post(param)
}

/**
 * @description: 修改地图配置
 * @param {String} payload 配置信息
 */
export const editMapConfigDlgFormDataApi = payload => {
  const param = {
    url: 'map/v1/map-config',
    body: payload
  }
  return put(param)
}
// 懒加载树搜索接口
export const getLoadingTreeSearchApi = playload => {
  let params = {
    url: uroPrefix + 'loading-tree/search',
    query: playload
  }
  return get(params)
}
/**
 * @description: // 机构重点部位树接口
 * @param {String} payload 配置信息
 */
export const getTreeApi = playload => {
  const params = {
    url: '/map/v1/tree/orgResourceTree',
    // url: '/map/v1/tree/orgResourceTree',
    query: playload
  }
  return get(params)
}
/**
 * @description: // 机构树树的模糊查询
 * @param {String} payload 配置信息
 */
export const getSearchOrgTreeApi = playload => {
  const params = {
    url: '/map/v1/tree/org-keyPart/search',
    query: playload
  }
  return get(params)
}

/**
 * @description: // 资源树树的模糊查询
 * @param {String} payload 配置信息
 */
export const getSearchTreeApi = playload => {
  const params = {
    url: '/map/v1/tree/mists/search',
    query: playload
  }
  return get(params)
}

/**
 * @description: // 获取所有省份信息
 * @param {String} payload 配置信息
 */
export const getTreeApiArea = playload => {
  const params = {
    url: 'map/v1/area/provinces',
    query: playload
  }
  return get(params)
}

/**
 * @description: // 获取子行政区域信息
 * @param {String} payload 配置信息
 */
export const getTreeApiSubaArea = playload => {
  const params = {
    url: 'map/v1/area/sub-area',
    query: playload
  }
  return get(params)
}

/**
 * @description: // 模糊查询行政区域信息
 * @param {String} payload 配置信息
 */
export const getVagueTreeApiSubaArea = playload => {
  const params = {
    url: 'map/v1/area/search',
    query: playload
  }
  return get(params)
}

/**
 * @description: // 获取天气信息
 * @param {String} payload 配置信息
 */
export const getWeatherApiSubInfo = playload => {
  const params = {
    url: 'map/v1/weather/today',
    query: playload
  }
  return get(params)
}
// 消防  统计数量接口
export const findCountApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency/count',
    query: payload
  }
  return get(param)
}
// 安防报警统计信息
export const getAlarmCountApi = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-log/count',
    query: payload
  }
  return get(param)
}
// 报警统计颜色
export const getAlarmColorApi = () => {
  let param = {
    url: '/alarm-manage/v1/alarm-host/strategy'
    // query: payload
  }
  return get(param)
}
/**
 * @description: // 获取应用报警配置信息
 * @param {String} payload 配置信息
 */
export const getAlarmSettingApi = playload => {
  const params = {
    url: 'map/v1/alarm-config',
    query: playload
  }
  return get(params)
}
/**
 * @description: //修改报警配置信息
 * @param {String} payload 配置信息
 */
export const updateAlarmSettingApi = playload => {
  const params = {
    url: 'map/v1/alarm-config',
    body: playload
  }
  return put(params)
}
/**
 * @description: // 增加报警配置信息
 * @param {String} payload 配置信息
 */
export const addAlarmSettingApi = playload => {
  const params = {
    url: 'map/v1/alarm-config',
    query: playload
  }
  return get(params)
}
/**
 * @description: // 获取行政区配置样式
 * @param {String} payload 配置信息
 */
export const getDistrictSettingApi = playload => {
  const params = {
    url: 'map/v1/area/detail',
    query: playload
  }
  return get(params)
}
/**
 * @description: // 修改行政区配置样式
 * @param {String} payload 配置信息
 */
export const saveDistrictSettingApi = playload => {
  const params = {
    url: 'map/v1/area/style',
    body: playload
  }
  return put(params)
}

/**
 * @description: // 获取关联关系
 * @param {String} payload 配置信息
 */
export const getRelationsInfoApi = playload => {
  const params = {
    url: `resource/v1/video/linkage/${playload.id}`,
    body: playload
  }
  return get(params)
}
// 设备 ip ping功能检测
export const checkPingAPI = payload => {
  const params = {
    url: '/systemOpsManager/v1/systemOpsManager/ipIsping',
    query: payload
  }
  return get(params)
}
/**
 * @description: 根据orgId 查询楼层索引面板 与对应name
 * @param {String} payload 参数
 */
export const getFloorsByOrgIdApi = payload => {
  const param = {
    url: '/map/v1/floor',
    query: payload
  }
  return get(param)
}
