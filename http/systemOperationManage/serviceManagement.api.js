import { get, post, put } from '../base'

// 获取服务列表
export const getServiceListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/ServiceManager/getList',
    query: payload
  }
  return get(param)
}

// 查询服务
export const queryServiceManagerApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/ServiceManager/query',
    body: {...payload}
  }
  delete param.body.page
  delete param.body.limit
  delete param.body.hostIp
  return post(param, { params: {
    page: payload.page,
    limit: payload.limit,
    hostIp: payload.hostIp
  } })
}

// 一键重启服务
export const restartServiceApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/ServiceManager/restart',
    body: payload
  }
  return put(param)
}

// 获取服务器机构树接口
export const getServerTreeApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getLoadServerTree',
    query: payload
  }
  return get(param)
}

// 编辑服务

export const modifyService = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/ServiceManager/modify',
    body: payload
  }
  return post(param)
}
