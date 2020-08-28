import { get, post } from '../base'

// 获取短信列表
export const getShortMessageListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getShortMessageList',
    query: payload
  }
  return get(param)
}

// 懒加载获取人员树
export const getUserLoadingTree = (payload) => {
  let param = {
    url: '/user/v1/orgTree',
    body: payload
  }
  return post(param)
}

// 新建短信
export const creatShortMessageApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/createShortMessage',
    body: payload
  }
  return post(param)
}

// 删除短信
export const deleteShortMessageApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/deleteShortMessage',
    body: payload
  }
  return post(param)
}

// 查询短信
export const queryShortMessageApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryShortMessage',
    body: payload
  }
  return post(param)
}

// 短信发送
export const sendMessageApi = (payload) => {
  let param = {
    url: '/safm/api/sync/sms',
    body: payload
  }
  return post(param)
}
