import { get, post, remove, put } from '../base'

//门禁平台 新建
export const manCreate = payload => {
  let param = {
    url: '/resource/v1/guard/platform',
    body: payload
  }
  return post(param)
}

// 获取指定门禁平台下所有主机列表
export const getHosts = payload => {
  console.log('Log 查看该平台下的主机', payload.id)
  let param = {
    url: `/resource/v1/guard/platform/${payload.id}/host`
    // query: payload
  }
  return get(param)
}

/* 
列表页面 点击修改 查看 删除 迁移等操作都需要请求这个接口
*/
export const getDetal = (id, payload) => {
  let param = {
    url: `/resource/v1/guard/platform/${id}`,
    query: payload
  }
  return get(param)
}

//门禁平台修改 api
export const AccessmModify = (url, payload) => {
  let param = {
    url,
    body: payload
  }
  return put(param)
}

//create 平台/主机 调用获取平台/主机接口 list
export const getPlatformListT = payload => {
  let param = {
    url: `/resource/v1/guard/platform/${payload.id}`,
    query: payload
  }
  return get(param)
}

//创建门禁平台
export const getAccessList = payload => {
  let param = {
    url: '/resource/v1/guard/platform',
    query: payload
  }
  return get(param)
}

//获取门禁平台下远程主机及所属通道资源
export const getRemoteHost = (url, payload) => {
  let param = {
    // '/resource/v1/guard/platform'
    url,
    query: payload
  }
  return get(param)
}

// 删除列表
export const del = payload => {
  let param = {
    ///api/resource/v1/guard/platform
    url: '/resource/v1/guard/platform',
    body: payload
  }
  return remove(param, { data: payload })
}

//平台排序
export const platformSort = payload => {
  let param = {
    ///api/resource/v1/guard/platform/sequence
    url: '/resource/v1/guard/platform/sequence',
    body: payload
  }
  return put(param)
}

// 主机排序
export const HostSort = payload => {
  let param = {
    ///api/resource/v1/guard/platform/sequence
    url: '/resource/v1/guard/host/sequence',
    body: payload
  }
  return put(param)
}

//平台迁移
export const terraceMigrate = payload => {
  let param = {
    url: '/resource/v1/guard/platform/transfer',
    body: payload
  }
  return put(param)
}

// 主机迁移
export const HostTerraceMigrate = payload => {
  let param = {
    url: '/resource/v1/guard/host/transfer',
    body: payload
  }
  return put(param)
}

// 下载门禁配置平台信息列表

export const downPtList = (url, payload) => {
  let param = {
    url,
    body: payload
  }
  return post(param)
}

//获取指定门禁主机/通道联动配置 [4]

export const getGanged = (url, payload) => {
  let param = {
    url,
    query: payload
  }

  return get(param)
}

//获取tree

export const getTreeApi = playload => {
  const param = {
    ///resource/v1/tree/orgResLazyTree
    url: '/resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(param)
}

export const pZTreeApi = playload => {
  const param = {
    ///resource/v1/tree/orgResLazyTree
    url: '/resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(param)
}

// 获取门禁平台通道信息列表
export const getPlatformList = playload => {
  const param = {
    url: '/resource/v1/guard/sync/host/resource',
    query: playload
  }
  return get(param)
}

// 获取门禁平台综合查询列表
export const getAccessCommonList = playload => {
  const param = {
    url: '/resource/v1/guard/inquery',
    body: playload
  }
  return post(param)
}

// export const getAccessCommonList = playload => {
//   const param = {
//     url: '/resource/v1/guard/inquery',
//     body: playload
//   }
//   return post(param)
// }

//批量获取门禁平台资源
export const getBatchPlatform = playload => {
  const param = {
    url: '/resource/v1/guard/sync/platform/resource',
    body: playload
  }
  return post(param)
}
