import { get, post } from '../base'

// 获取系统参数接口
export const getSysConfig = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getSysConfig',
    query: payload
  }
  return get(param)
}

// 设置系统参数接口
export const setSysConfig = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/setSysConfig',
    body: payload
  }
  return post(param)
}

// 获取录像存储下拉框数据
export const storageserversexportApi = (payload) => {
  let param = {
    url: '/video/v1/data/storageserversexport',
    query: payload
  }
  return get(param)
}

// 上传图片接口
export const uploadLogoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/uploadLogo',
    body: payload
  }
  return post(param)
}
