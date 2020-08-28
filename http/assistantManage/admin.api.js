import { post, get, remove, put } from '../base'

// 获取协查事件列表
export const getQueryEventListApi = playload => {
  let param = {
    url: '/daily/v1/savespace',
    query: playload
  }
  return get(param)
}

// 添加任务
export const addTaskApi = playload => {
  let param = {
    url: '/daily/v1/',
    body: playload
  }
  return post(param)
}

// 上传功能
export const uploadApi = playload => {
  let param = {
    url: '/daily/v1/upload',
    body: playload
  }
  return post(param)
}

// 删除任务
export const deleteTaskApi = ids => {
  let param = {
    url: '/daily/v1/'
  }
  return remove(param, { data: { ids } })
}

// 修改任务
export const editTaskApi = (id, playload) => {
  let param = {
    url: `/daily/v1/${id}`,
    body: playload
  }
  return put(param)
}

// 获取任务详情
export const getTaskDetailsApi = playload => {
  let param = {
    url: '/daily/v1/list',
    query: playload
  }
  return get(param)
}

// 搜索任务列表
export const searchTaskListApi = playload => {
  let param = {
    url: '/daily/v1/searchList',
    query: playload
  }
  return get(param)
}
