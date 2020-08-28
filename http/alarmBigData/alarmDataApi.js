/**
 * author: wangpengcheng
 */
import { get, post, put, remove } from '../base'

const baseUrl = '/alarm-manage/v1/alarm-statistics/'

//报警各类数量统计
export const alarmCountApi = payload => {
  const params = {
    url: `${baseUrl}count`,
    query: payload
  }
  return get(params)
}

//重点部位统计分析
export const alarmPortantApi = payload => {
  const params = {
    url: `${baseUrl}keypartcount`,
    query: payload
  }
  return get(params)
}

//报警分类昨日、今日统计
export const alarmDayAndYestApi = payload => {
  const params = {
    url: `${baseUrl}classifycount`,
    query: payload
  }
  return get(params)
}

//报警区域对比分析
export const alarmAddressApi = payload => {
  const params = {
    url: `${baseUrl}orgcount`,
    query: payload
  }
  return get(params)
}
//报警总数统计分析（当天、7天、当月）
export const alarmAllCountApi = payload => {
  const params = {
    url: `${baseUrl}comparison/event`,
    query: payload
  }
  return get(params)
}


//重点部位实时报警监测
export const alarmOnTimeCountApi = payload => {
  const params = {
    url: `${baseUrl}timely`,
    query: payload
  }
  return get(params)
}
