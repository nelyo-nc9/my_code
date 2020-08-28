import { post, get, put, remove } from '../base'
/**
 * @description: 获取地图设备点位详情
 * @param {String} id 设备id
 */
export const getCommonResourceByIdApi = id => {
  const param = {
    url: `/map/v1/point/${id}`
  }
  return get(param)
}

/**
 * @description: 新增地图设备点位
 * @param {String} payload 点位信息
 */
export const addMapCommonResourcePointApi = payload => {
  const param = {
    url: '/map/v1/point',
    body: payload
  }
  return post(param)
}

/**
 * @description: 修改地图设备点位
 * @param {String} payload 点位信息
 */
export const updateMapCommonResourcePointApi = payload => {
  const param = {
    url: '/map/v1/point',
    body: payload
  }
  return put(param)
}

// export const deleteAlarmHostApi = ids => {
//   const param = {
//     url: 'alarm-manage/v1/alarm-host'
//   }
//   return remove(param, {data: {ids}})
// }
// 删除设备资源点位
export const deleteMapCommonResourcePointApi = ids => {
  const param = {
    url: '/map/v1/point'
  }
  // console.log('删除接口', param)
  return remove(param, { data: { ids } })
}
// 删除机构重点部位点位 deleteMapCommonOrgKeyPartId
export const deleteMapCommonOrgKeyPartIdApi = id => {
  const param = {
    url: '/map/v1/point/org-keyPart'
  }
  // console.log('删除接口', param)
  return remove(param, { data: { id } })
}
/**
 * @description: 新增楼层
 * @param {String} payload 楼层id数组
 */
export const addFloorAKeyApi = payload => {
  const param = {
    url: '/map/v1/floor',
    body: payload
  }
  return post(param)
}
/**
 * @description: 修改楼层
 * @param {String} payload 楼层id数组
 */
export const updateFloorAKeyApi = payload => {
  const param = {
    url: '/map/v1/floor',
    body: payload
  }
  return put(param)
}
/**
 * @description: 删除楼层
 * @param {String} ids 楼层id数组
 */
export const deleteFloorAKeyApi = ids => {
  const param = {
    url: '/map/v1/floor',
    body: ids
  }
  return remove(param, { data: { ids } })
}
/**
 * @description: 根据楼层id获取楼层详情
 * @param {String} id 楼层id
 */
export const getAllFloorAKeyApi = id => {
  const param = {
    url: `/map/v1/floor/${id}`
  }
  return get(param)
}
/**
 * @description: 创建环境平面图
 */
export const addEnvironmentalApi = payload => {
  const param = {
    url: '/map/v1/env-image',
    body: payload
  }
  return post(param)
}

/**
 * @description: 根据id查询环境平面图
 */

export const getEnvironmentalApi = id => {
  const param = {
    url: `/map/v1/env-image/${id}`
  }
  return get(param)
}
/**
 * @description: 修改环境平面图
 */
export const updateEnvironmentalApi = payload => {
  const param = {
    url: '/map/v1/env-image',
    body: payload
  }
  return put(param)
}
/**
 * @description: 批量删除环境平面图
 */
export const deleteEnvironmentalApi = ids => {
  const param = {
    url: '/map/v1/env-image',
    body: ids
  }
  return remove(param, { data: { ids } })
}

/**
 * @description: 获取所有已经添加的设备点位
 */
export const getAllTypePointApi = payload => {
  const param = {
    url: '/map/v1/point/select/type-or-subtype',
    query: payload
  }
  return get(param)
}
/**
 * @description: 框选结果统计
 * @param {String} payload 框选信息
 */
export const getBoxSelectionApi = payload => {
  const param = {
    url: '/map/v1/point/frame-selection',
    body: payload
  }
  return post(param)
}

/**
 * @description: 删除所有点位信息
 * @param {String} payload 参数
 */
export const deleteAllResourceInfo = payload => {
  const param = {
    url: '/map/v1/point/init'
  }
  return remove(param)
}

/**
 * @description: 获取指定点位关联关系信息
 * @param {String} payload 参数
 */
export const getPointRelationInfo = payload => {
  const param = {
    url: '/map/v1/point/linkage/' + payload.id
  }
  return get(param)
}

/**
 * @description: 获取所有有关联关系的点位
 * @param {String} payload 参数
 */
export const getAllRelationPointInfo = payload => {
  const param = {
    url: '/map/v1/point/exists/has-linkage'
  }
  return get(param)
}
