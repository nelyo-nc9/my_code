import { post, get } from '../base'

// 新建业务参数信息
export const newCreateDataDictionary = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/newCreateDataDictionary',
    body: payload
  }
  return post(param)
}

// 更新业务参数字典信息
export const updateDataDictionary = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/updateDataDictionary',
    body: payload
  }
  return post(param)
}

// 删除业务参数字典信息
export const delDataDictionaryApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/delDataDictionary',
    body: payload
  }
  return post(param)
}

// 状态更新数据字典-启动-or-禁用
export const updateDictDictionaryStatusApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/updateDictDictionaryStatus',
    body: payload
  }
  return post(param)
}

// 获取绑定的sdk
export const getBindSdkListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getBindSdkList',
    body: payload
  }
  return post(param)
}
