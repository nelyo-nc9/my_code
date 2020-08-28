import { get, post, remove } from '../base'

// 获取人员管理列表信息
export const getPeopleManageListApi = playload => {
  let param = {
    url: '/user/v1/list',
    body: playload
  }
  return post(param)
}
// 删除人员信息
export const deletePeopleManageApi = playload => {
  let param = {
    url: '/user/v1/delete'
  }
  console.log(playload)
  return remove(param, { data: playload })
}
// 人员同步信息
export const setPeopleManageSyncApi = playload => {
  let param = {
    url: '/user/v1/async',
    body: playload
  }
  return post(param)
}
// 根据条件检出
export const exportManageApi = playload => {
  let param = {
    url: '/user/v1/export',
    body: playload
  }
  return post(param)
}
