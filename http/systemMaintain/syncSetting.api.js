import { get, post } from '../base'

// 获取同步日志列表信息
export const getSyncLogListApi = playload => {
  let param = {
    url: '/user/v1/async/log'
  }
  return get(param)
}

// 获取服务配置信息
export const getSettingManageApi = playload => {
  let param = {
    url: '/user/v1/async/config'
  }
  return get(param)
}
// 更新服务配置
export const updateSettingManageApi = playload => {
  let param = {
    url: '/user/v1/async/update',
    body: playload
  }
  return post(param)
}
// 增加服务配置
export const setSettingManageApi = playload => {
  let param = {
    url: '/user/v1/async/config',
    body: playload
  }
  return post(param)
}
