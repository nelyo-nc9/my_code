import { get, post, remove, put } from '../base'

//获取机构 部位 设备树
export const getTreeList = payload => {
  let param = {
    url: '/video/v1/tree/orgResLazyTree',
    query: payload
  }
  return get(param)
}

//获取门禁主机信息列表   门禁主机列表数据
export const getHostList = payload => {
  let param = {
    url: '/resource/v1/guard/host',
    query: payload
  }
  return get(param)
}

//获取指定主机及通道信息 包含三类通道信息及当前主机
export const getDesignated = payload => {
  let param = {
    url: `/resource/v1/guard/host/${payload.id}`
    // query: payload
  }
  return get(param)
}
// 获取指定门禁信息及关联平台信息
export const getHostInfo = (id, payload) => {
  let param = {
    url: `/resource/v1/guard/host/${id}/relation-platform`,
    query: payload
  }
  return get(param)
}

// 创建门禁主机
export const creatHost = payload => {
  let param = {
    url: '/resource/v1/guard/host',
    body: payload
  }
  return post(param)
}

//修改门机主机
export const removeHost = (url, payload) => {
  let param = {
    url,
    body: payload
  }
  return put(param)
}

// 删除门禁主机
export const delHostList = payload => {
  ///api/resource/v1/guard/host
  let param = {
    url: '/resource/v1/guard/host'
  }
  return remove(param, { data: payload })
}

// 创建 / 编辑门禁主机 或者 删除主机后 都需要调用一次这个接口
export const getRmOrDelHostsList = (url, payload) => {
  let param = {
    url,
    query: payload
  }
  return get(param)
}
//迁移门禁主机
export const AccessMigrateHost = payload => {
  let param = {
    url: '/resource/v1/guard/host/transfer',
    body: payload
  }
  return put(param)
}

//门禁主机排序
export const hostSort = payload => {
  let param = {
    url: '/resource/v1/guard/host/sequence',
    body: payload
  }
  return put(param)
}

//获取主机列表
export const getHostAssociation = payload => {
  let param = {
    ///api
    url: '/resource/v1/guard/host/linkage',
    query: payload
  }
  return get(param)
}

//获取门禁通道配置列表

export const getAisleAssociation = payload => {
  let param = {
    url: '/resource/v1/guard/channel/linkage',
    query: payload
  }
  return get(param)
}

// 批量获取主机资源 远程接口
export const getBatchHost = payload => {
  let param = {
    url: '/resource/v1/guard/sync/host/resource',
    body: payload
  }
  return post(param)
}
