import { get, post } from '../base'

// 设置防瞌睡配置
export const setPreventSleepyConfigApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/setPreventSleepyConfig',
    body: payload
  }
  return post(param)
}

// 防瞌睡日志列表
export const getPreventSleepyListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getPreventSleepyList',
    query: payload
  }
  return get(param)
}

// 防瞌睡日志查询
export const queryPreventSleepyInfoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryPreventSleepyInfo',
    body: payload
  }
  return post(param)
}

// 获取防瞌睡配置
export const getPreventSleepyConfigApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getPreventSleepyConfig',
    query: payload
  }
  return get(param)
}

// 获取当前在线用户
export const getLiveUserApi = (payload) => {
  let param = {
    url: '/user/v1/live',
    body: payload
  }
  return post(param)
}

// 防瞌睡提醒
export const insertPreventSleepyMsg = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/insertPreventSleepyMsg',
    body: payload
  }
  return post(param)
}

// 获取声音文件在服务器上的地址
export const getFilePathApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getFilePath',
    query: payload
  }
  return get(param)
}
