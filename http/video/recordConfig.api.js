import { get, post, put, remove } from '../base'
import axios from 'axios'
/* **** 基础接口 **** */

// 获取存储服务器下拉框数据   废弃了
export const getStorageServersApi = () => {
  const params = {
    url: '/video/v1/data/storageservers'
  }
  return get(params)
}
// 获取存储位置
export const getStorageLocApi = (playload) => {
  const params = {
    url: '/systemOpsManager/v1/systemOpsManager/getStoreServerList',
    query: playload
  }
  return get(params)
}

// 获取视频资源类型
export const getClassApi = playload => {
  const params = {
    url: 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: playload
  }
  return post(params)
}

// 获取时间模板列表
export const getTimeTemplateListApi = () => {
  const params = {
    url: '/systemOpsManager/v1/systemOpsManager/getTimeTemplateList'
  }
  return get(params)
}

// 机构下拉选 懒加载机构树接口
export const getOrganizationalApi = playload => {
  const params = {
    url: '/organizational/v1/org/loading-tree',
    query: playload
  }
  return get(params)
}

// 机构、重点部位模糊查询
export const getSearchOrgApi = playload => {
  const params = {
    url: '/organizational/v1/org/fuzzy-search',
    query: playload
  }
  return get(params)
}

/* **** 中心录像计划配置 **** */
// 存储路径配置列表表格数据zp
export const getRecordPathApi = playload => {
  const params = {
    url: '/video/v1/plan/channel/linkages',
    body: playload
  }
  return post(params)
}
// 存储路径配置列表修改存储位置zp
export const putRecordPathApi = playload => {
  const params = {
    url: '/video/v1/plan/channel/linkages',
    body: playload
  }
  return put(params)
}
// 获取录像计划列表（定时/事件）
export const getRecordPlanApi = playload => {
  const params = {
    url: '/video/v1/plans',
    query: playload
  }
  return get(params)
}

// 搜索录像计划查询列表（定时/事件）
export const getSearchRecordPlanApi = playload => {
  const params = {
    url: '/video/v1/plans',
    body: playload
  }
  return post(params)
}

// 添加录像计划（定时/事件）
export const postRecordPlanApi = playload => {
  const params = {
    url: '/video/v1/plan',
    body: playload
  }
  return post(params)
}
// 查询录像计划预览与详情（定时/事件）
export const getRecordPlanDetailApi = playload => {
  const params = {
    url: `/video/v1/plan/${playload}`,
    body: playload
  }
  return get(params)
}
// 删除录像计划（定时/事件）
export const deleteRecordPlanApi = playload => {
  const params = {
    url: '/video/v1/plans'
  }
  const config = {
    data: playload
  }
  return remove(params, config)
}

// 修改录像计划（定时/事件）
export const putRecordPlanApi = playload => {
  const params = {
    url: '/video/v1/plan',
    body: playload
  }
  return put(params)
}

// 修改多个录像计划（定时/事件）
export const putRecordPlansApi = playload => {
  const params = {
    url: '/video/v1/plans',
    body: playload
  }
  return put(params)
}

/* **** 存储服务器管理 **** */

// 添加存储服务器
export const postStorageServerApi = playload => {
  const params = {
    url: '/video/v1/storageserver',
    body: playload
  }
  return post(params)
}

// 删除存储服务器
export const deleteStorageServerApi = playload => {
  const params = {
    url: '/video/v1/storageservers'
  }
  const config = {
    data: playload
  }
  return remove(params, config)
}

// 修改存储服务器
export const putStorageServerApi = playload => {
  const params = {
    url: '/video/v1/storageserver',
    body: playload
  }
  return put(params)
}

// 获取存储服务器列表
export const getStorageServerApi = playload => {
  const params = {
    url: '/video/v1/storageservers',
    query: {
      page: playload.page || 0,
      limit: playload.limit || 20
    }
  }
  return get(params)
}
