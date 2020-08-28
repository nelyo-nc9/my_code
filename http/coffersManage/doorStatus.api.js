/*
 * @Author: yanglei
 * @Date: 2020-07-03 22:01:47
 * @LastEditTime: 2020-08-20 10:49:08
 * @LastEditors: your name
 * @Description:
 * @FilePath: \ccb-client\client\src\http\coffersManage\doorStatus.api.js
 */
import { get } from '../base'

// 获取指定机构/重点部位的金库门禁通道列表
export const queryDoorStatusApi = (payload) => {
  let params = {
    url: 'resource/v1/guard/vault/channel',
    query: payload
  }
  return get(params)
}

// /api/resource/v1/guard/host/:id/relation-platform
// 获取指定门禁主机信息及关联平台信息
export const getDoorRelationApi = (payload) => {
  let params = {
    url: `resource/v1/guard/host/${payload}/relation-platform`
  }
  return get(params)
}

export const pingIPAddrApi = (payload) => {
  let params = {
    url: 'coffer/v1/ping',
    query: payload
  }
  return get(params)
}

// 获取金库门状态机构树接口
export const getTreeApi = payload => {
  const params = {
    url: 'organizational/v1/org/loading-tree',
    query: payload
  }
  return get(params)
}

// 获取门禁主机关联镜头接口
export const getRelevCameraApi = payload => {
  const params = {
    // /api/resource/v1/guard/linkage/{id}
    url: `resource/v1/guard/linkage/${payload.queryParam}`
  }
  // if ([...payload].pop() === '1') {
  //   params.url = `resource/v1/audio/linkage/${payload}`
  // }
  if (payload.mode === 1) {
    params.url = `resource/v1/audio/linkage/${payload.queryParam}`
  }
  return get(params)
}

// 获取单个镜头信息
export const getCameraInfoApi = payload => {
  const params = {
    url: `resource/v1/video/channel/${payload}`
  }
  return get(params)
}
