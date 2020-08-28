import { get, post, remove, put } from '../base'

// 获取指定机构 重点部位 列表 (门禁管理)
export const getGlList = payload => {
  let param = {
    url: '/resource/v1/guard/channel',
    query: payload
  }
  return get(param)
}

export const getCpntrolStatus = payload => {
  let param = {
    url: '/resource/v1/guard/normal-door/status/statistic',
    query: payload
  }
  return get(param)
}

// 获取门禁主机下远程通道 勾选主机进入新建页面 点击小按钮调用
export const getHostAllControl = payload => {
  let param = {
    url: '/resource/v1/guard/sync/channel/resource',
    query: payload
  }
  return get(param)
}

//创建通道
/*  getControlList*/
/*  */
export const CreateControlList = payload => {
  let param = {
    url: '/resource/v1/guard/channel',
    body: payload
  }
  return post(param)
}

// 获取指定门禁主机下特定类型通道
export const getHostControlList = (url, payload) => {
  let param = {
    url,
    query: payload
  }
  return get(param)
}

///api
export const getZhiDhosts = payload => {
  let param = {
    url: `/resource/v1/guard/sync/host/resource`,
    query: payload
  }
  return get(param)
}

// 获取指定主机下所有通道信息
/* /api/resource/v1/guard/host/{id} */
export const getHostControlAllTypeList = (url, payload) => {
  let param = {
    url: `/resource/v1/guard/host/${id}`,
    query: payload
  }
  return get(param)
}
// 修改门禁通道信息
export const removeControl = (id, payload) => {
  let param = {
    url: `/resource/v1/guard/channel/${id}`,
    body: payload
  }
  return put(param)
}

// 删除指定通道

export const delControl = payload => {
  ///api/resource/v1/guard/host
  let param = {
    url: '/resource/v1/guard/channel'
  }
  return remove(param, { data: payload })
}

// 获取指定主机/ 通道 联动配置
export const getPeiZhi = (url, payload) => {
  let param = {
    url,
    query: payload
  }
  return get(param)
}

// 获取开关门实时状态
export const getDoorStatus = payload => {
  let param = {
    url: '/resource/v1/guard/channel/runtime/status',
    query: payload
  }
  return get(param)
}
