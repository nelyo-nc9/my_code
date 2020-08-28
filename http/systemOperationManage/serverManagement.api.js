import { get, post } from '../base'

// 获取服务器列表接口
export const getServerListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getServerList',
    query: payload
  }
  return get(param)
}
// 新建服务器接口
export const creatServerApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/newCreateServer',
    body: {...payload}
  }
  delete param.body.hostIp
  return post(param, { params: { hostIp: payload.hostIp } })
}
// 查询服务器接口
export const queryServerInfoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryServerInfo',
    body: {...payload}
  }
  let hostIp = param.body.server.hostIp
  delete param.body.server.hostIp
  return post(param, { params: { hostIp: hostIp } })
}

// 获取懒加载机构树
export const getTreeApi = (payload) => {
  let param = {
    url: '/organizational/v1/org/loading-tree',
    query: payload
  }
  return get(param)
}

// 查询机构下所有重点部位
export const getKeyPartApi = (payload) => {
  let param = {
    url: '/organizational/v1/org/fuzzy-search',
    query: payload
  }
  return get(param)
}

// 通过类型查询重点部位
export const getKeyPartByTypeApi = (payload) => {
  let param = {
    url: '/organizational/v1/key-part/query',
    query: payload
  }
  return get(param)
}
// 机构、重点部位模糊查询
export const getSearchOrgApi = playload => {
  const params = {
    url: '/organizational/v1/org/fuzzy-search',
    query: playload
  }
  return get(params)
}
// 获取已注册的服务器列表
export const getAlreadyRegisteredServerListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getAlreadyRegisteredServerList',
    query: payload
  }
  return get(param)
}

// 编辑服务器信息
export const updateServerInfoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/updateServerInfo',
    body: payload
  }
  return post(param)
}

// 获取存储服务器信息
export const getStoreServerListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getStoreServerList',
    query: payload
  }
  return get(param)
}

// 查询存储服务器信息
export const queryStoreServerApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryStoreServer',
    body: {...payload}
  }
  delete param.body.hostIp
  return post(param, { params: { hostIp: payload.hostIp, page: payload.page, limit: payload.limit } })
}

// 初始化存储服务器
export const editorStoreServerApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/editorStoreServer',
    body: payload
  }
  return post(param)
}

// 删除服务器（包含存储服务器的删除）
export const deleteServerApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/deleteServer',
    body: payload
  }
  return post(param)
}
