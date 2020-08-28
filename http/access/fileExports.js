import { get, post, remove, put } from '../base'

// 导出门禁平台列表

export const exportPlatformList = payload => {
  let param = {
    url: '/resource/v1/guard/platform/download',
    body: payload
  }
  return post(param)
}

// 导出门禁主机列表

export const exportHostList = payload => {
  let param = {
    url: '/resource/v1/guard/host/download',
    body: payload
  }
  return post(param)
}

// 导出门禁主机联动配置
export const exportHostConfiguration = payload => {
  let param = {
    url: '/resource/v1/guard/host/linkage/download',
    body: payload
  }
  return post(param)
}

// 导出门禁通道联动配置

export const exportAisleConfiguration = payload => {
  let param = {
    url: '/resource/v1/guard/host/linkage/download',
    body: payload
  }
  return post(param)
}

// 导出报警输入关联配置

export const exportAlarmConfiguration = payload => {
  let param = {
    url: '/resource/v1/guard/input/linkage/download',
    body: payload
  }
  return post(param)
}
