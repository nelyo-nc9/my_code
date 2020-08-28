import { get, post } from '../base'
export const getEventDealListApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-log',
    query: payload
  }
  return get(param)
}
export const postAddtogroupApi = (payload) => {
  let param = {
    url: '/audio/v1/newservice/addtogroup',
    body: payload
  }
  return post(param)
}
// 删除对讲组
export const postDelgroupApi = (payload) => {
  let param = {
    url: '/audio/v1/service/delgroup',
    body: payload
  }
  return post(param)
}
// 挂断
export const postCloseTalkApi = (payload) => {
  let param = {
    url: '/audio/v1/newservice/close/talk',
    body: payload
  }
  return post(param)
}
// 查看对讲状态
export const checkAudioStatusApi = (payload) => {
  let param = {
    url: '/audio/v1/newservice/getstatue',
    query: payload
  }
  return get(param)
}
// 获取重点部位树
export const getKeyPartVideoTreeApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-host/keyPartVideoTree',
    query: payload
  }
  return get(param)
}