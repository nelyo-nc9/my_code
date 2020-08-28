import { get, post } from '../base'

// 设置定时提醒配置
export const setRegularlyRemindedConfigApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/setRegularlyRemindedConfig',
    body: payload
  }
  return post(param)
}

// 获取定时提醒列表
export const getRegularlyRemindedListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getRegularlyRemindedList',
    query: payload
  }
  return get(param)
}

// 定时日志查询
export const queryRegularlyRemindedInfoApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryRegularlyRemindedInfo',
    body: payload
  }
  return post(param)
}

// 获取定时提醒配置
export const getRegularlyRemindedConfigApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getRegularlyRemindedConfig',
    query: payload
  }
  return get(param)
}

// 上传声音文件
export const uploadRadioApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/upload',
    body: payload
  }
  return post(param)
}
