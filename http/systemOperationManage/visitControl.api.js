import { get, post } from '../base'

// 获取机构-部位-设备-资源树
export const orgResourceTree = (payload) => {
  let param = {
    url: '/resource/v1/tree/orgResLazyTree',
    query: payload
  }
  return get(param)
}

// 访问路数设置
export const setDeviceVisitCtrl = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/setDeviceVisitCtrl',
    body: payload
  }
  return post(param)
}

// 获取访问路数设置
export const queryVisitCtrlInfoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDeviceVisitCtrlInfo',
    body: payload
  }
  return post(param)
}
