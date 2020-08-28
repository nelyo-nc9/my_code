import { get, post, remove } from '../base'

// 新建值班组接口
export const createGroup = (payload) => {
  let params = {
    url: 'coffer/v1/dutygroup',
    body: payload
  }
  return post(params)
}

// 新建值班组接口
export const getDutyGroupApi = () => {
  let params = {
    url: 'coffer/v1/dutygroup'
  }
  return get(params)
}

// 修改值班组接口
export const moddutyGroupApi = (payload) => {
  let params = {
    url: 'coffer/v1/moddutygroup',
    body: payload
  }
  return post(params)
}

// 值班授权保存接口
export const setAuthorizeApi = (payload) => {
  let params = {
    url: 'coffer/v1/authorize',
    body: payload
  }
  return post(params)
}

// 删除值班组接口
export const removeAuthorizeApi = (payload) => {
  let params = {
    url: 'coffer/v1/authorize'
  }
  const config = {
    data: payload
  }
  return remove(params, config)
}

// 获取指定人员重点部位权限数据
export const getUserPower = (payload) => {
  let params = {
    url: 'user/v1/findUserResource',
    body: payload
  }
  return post(params)
}

// 根据用户ID获取指纹仪所需参数接口 (录入人员指纹使用)
export const getFingerParam = (payload) => {
  let params = {
    url: 'coffer/v1/infocollect',
    body: payload
  }
  return post(params)
}

// 按机构获取机构列表
export const getOrgListApi = (payload) => {
  let params = {
    url: 'organizational/v1/org/list',
    query: payload
  }
  return get(params)
}

// 获取人员权限树接口
export const getPowerTree = payload => {
  const params = {
    url: 'organizational/v1/org/loading-tree',
    query: payload
  }
  return get(params)
}
