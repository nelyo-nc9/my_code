import { get, post, remove } from '../base'

// 查询权限列表
export const getPowerManageApi = playload => {
  let param = {
    url: '/user/v1/permission/list',
    body: playload
  }
  return post(param)
}
// 增加权限
export const setPowerManageApi = playload => {
  let param = {
    url: '/user/v1/permission/create',
    body: playload
  }
  return post(param)
}
// 修改权限
export const updatePowerManageApi = playload => {
  let param = {
    url: '/user/v1/permission/update',
    body: playload
  }
  return post(param)
}
// 删除权限列表
export const deletePowerManageApi = playload => {
  let param = {
    url: '/user/v1/permission/remove'
  }
  return remove(param, { data: { ...playload } })
}
// 获取所有角色列表
export const getRoleListApi = playload => {
  let param = {
    url: '/user/v1/role/allList'
  }
  return get(param)
}
// 获取人员机构树
export const getTreeApi = playload => {
  const params = {
    url: '/user/v1/orgTree',
    query: playload
  }
  return get(params)
}
// 获取人员数据
export const getUserApi = playload => {
  const params = {
    url: '/user/v1/orgUser',
    body: playload
  }
  return post(params)
}
// 根据条件检出
export const exportManageApi = playload => {
  let param = {
    url: '/user/v1/permission/export',
    body: playload
  }
  return post(param)
}