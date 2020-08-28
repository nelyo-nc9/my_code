import { get, post, remove } from '../base'
// import { getTreeApi as videoTreeApi, getLazyTreeApi as videoLazyTreeApi } from '../video/videoPreview.api'
// 查询角色列表
export const getRoleManageApi = playload => {
  let param = {
    url: '/user/v1/role/list',
    body: playload
  }
  return post(param)
}
// 增加角色
export const setRoleManageApi = playload => {
  let param = {
    url: '/user/v1/role/created',
    body: playload
  }
  return post(param)
}
// 修改角色
export const updateRoleManageApi = playload => {
  let param = {
    url: '/user/v1/role/update',
    body: playload
  }
  return post(param)
}
// 获取角色详情
export const getRoleDetailApi = playload => {
  let param = {
    url: '/user/v1/role/details',
    body: playload
  }
  return post(param)
}
// 获取角色关联的操作权限
export const getRoleOperationApi = playload => {
  let param = {
    url: '/user/v1/role/operation',
    body: playload
  }
  return post(param)
}
// 获取关联的资源信息
export const getRoleResourceApi = playload => {
  let param = {
    url: '/user/v1/role/resource',
    body: playload
  }
  return post(param)
}
// 删除角色列表
export const deleteRoleManageApi = playload => {
  let param = {
    url: '/user/v1/role/remove'
  }
  return remove(param, { data: { ...playload } })
}
// 获取功能权限 树
export const getPowerTreeApi = playload => {
  let param = {
    url: '/user/v1/operation/tree'
  }
  return get(param)
}
// 获取机构树
export const orgTreeApi = playload => {
  const params = {
    url: '/organizational/v1/org/loading-tree',
    query: playload
  }
  return get(params)
}
// 获取机构树复选框递归
export const orgLazyTreeApi = playload => {
  const params = {
    url: '/organizational/v1/org/loading-tree/child-node',
    query: playload
  }
  return get(params)
}
// 获取视频机构树
// 获取视频机构树复选框递归
// export { videoTreeApi, videoLazyTreeApi }
export const videoTreeApi = playload => {
  const params = {
    url: '/resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(params)
}
export const videoLazyTreeApi = playload => {
  const params = {
    url: '/resource/v1/tree/orgResourceTree',
    query: playload
  }
  return get(params)
}
// 根据条件检出
export const exportManageApi = playload => {
  let param = {
    url: '/user/v1/role/export',
    body: playload
  }
  return post(param)
}

