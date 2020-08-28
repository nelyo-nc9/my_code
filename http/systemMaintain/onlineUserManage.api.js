import { post } from '../base'

// 获取在线人员列表
export const getOnlineUserManageApi = playload => {
  let param = {
    url: '/user/v1/live',
    body: playload
  }
  return post(param)
}
// 强制用户下线
export const setOfflineManageApi = playload => {
  let param = {
    url: '/user/v1/offline',
    body: playload
  }
  return post(param)
}
// 根据条件检出
export const exportManageApi = playload => {
  let param = {
    url: '/user/v1/liveExport',
    body: playload
  }
  return post(param)
}
