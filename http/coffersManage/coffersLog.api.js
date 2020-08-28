/*
 * @Author: yanglei
 * @Date: 2020-07-10 16:37:05
 * @LastEditTime: 2020-07-20 22:34:22
 * @LastEditors: yanglei
 * @Description:
 * @FilePath: \CCB\client\src\http\coffersManage\coffersLog.api.js
 */
import { post, put, get } from '../base'

// 记录日志信息接口
export const recordLogApi = (payload) => {
  let params = {
    url: 'coffer/v1/log',
    body: payload
  }
  return put(params)
}

// 查询金库日志信息接口
export const queryCoffersLogApi = (payload) => {
  let params = {
    url: 'coffer/v1/log',
    body: payload
  }
  return post(params)
}

// 金库日志表格信息导出接口
export const exportTableDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/exportlog',
    body: payload
  }
  return post(params)
}

// 根据机构ID获取对应所有用户数据
export const getUserApi = (payload) => {
  let params = {
    url: 'user/v1/orgUser',
    body: payload
  }
  return post(params)
}

// 根据机构ID获取机构详情
export const getOrgInfoApi = (payload) => {
  let params = {
    url: 'organizational/v1/org/information',
    body: payload
  }
  return post(params)
}

// 获取门禁设备
export const getGuardDevApi = (payload) => {
  let params = {
    // url: 'resource/v1/guard/host/distinct',
    url: 'resource/v1/guard/vault/channel',
    query: payload
  }
  return get(params)
}

// 根据门禁设置获取门禁通道
export const getGuardChannelApi = (payload) => {
  let params = {
    url: 'resource/v1/guard/channel/distinct',
    query: payload
  }
  return get(params)
}

// 获取对讲面板数据
export const getAudioApi = (payload) => {
  let params = {
    url: 'resource/v1/audio/channel',
    query: payload
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
