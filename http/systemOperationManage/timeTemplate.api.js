import { get, post } from '../base'

// 获取时间模板列表
export const getTimeTemplateListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getTimeTemplateList',
    query: payload
  }
  return get(param)
}

// 添加时间模板
export const addTimeTemplateApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/addTimeTemplate',
    body: payload
  }
  return post(param)
}

// 修改时间模板
export const modifyTimeTemplateApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/modifyTimeTemplate',
    body: payload
  }
  return post(param)
}

// 删除时间模板
export const delTimeTemplateApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/delTimeTemplate',
    body: payload
  }
  return post(param)
}

// 查找时间模板
export const queryTimeTemplateApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryTimeTemplate',
    body: payload
  }
  return post(param)
}

// 添加节假日
export const addTimeTemplateHolidayApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/addTimeTemplateHoliday',
    body: payload
  }
  return post(param)
}

// 修改节假日
export const modifyHolidayTemplateApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/modifyHolidayTemplate',
    body: payload
  }
  return post(param)
}

// 删除模板中的节假日
export const deleteHolidayInfoApi = (payload) => {
  let param = {
    url: 'systemOpsManager/v1/systemOpsManager/deleteHolidayInfo',
    body: payload
  }
  return post(param)
}

// 获取时间模板节假日
export const getTimeTemplateHolidayApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/getTimeTemplateHoliday',
    query: payload
  }
  return get(param)
}
