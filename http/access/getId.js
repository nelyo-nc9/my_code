import { get, post, remove, put } from '../base'

// 获取接入服务器和服务器产生关联

export const getServeId = payload => {
  let param = {
    url: '/service/list',
    query: payload
  }
  return get(param)
}

export const brandOrModelNum = payload => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: payload
  }
  return post(param)
}


// 
