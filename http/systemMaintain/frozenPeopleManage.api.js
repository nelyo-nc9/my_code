import { post } from '../base'

// 获取冻结用户管理列表信息
export const getFrozenPeopleListApi = playload => {
  let param = {
    url: '/user/v1/list',
    body: playload
  }
  return post(param)
}
// 设置人员状态
export const setPeopleStatusApi = playload => {
  let params = {
    url: '/user/v1/setStatus',
    body: playload
  }
  return post(params)
}
