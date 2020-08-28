import { get, post, put, remove } from '../base'

// 获取值班内容管理状态
export const getDutysetupApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/content',
    query: payload
  }
  return get(param)
}

// 设置值班内容管理状态
export const putDutysetupApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/dutycontent',
    body: payload
  }
  return post(param)
}

// 修改交接班表信息
export const editShiftInfoApi = ({id, param}) => {
  let params = {
    url: `/daily/v1/duty/${id}`,
    body: param
  }
  return put(params)
}

// 获取交接班日志详情
export const getDutyInfoApi = (id) => {
  let param = {
    url: `/daily/v1/duty/shiftslog/detail/${id}`,
    query: ''
  }
  return get(param)
}
// 获取/查询交接班日志列表
export const getShiftsLogApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/shiftslog',
    query: payload
  }
  return get(param)
}

// 获取值班状态列表
export const getDutyStatuslistApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/member',
    query: payload
  }
  return get(param)
}

// 删除交接班列表
export const deletedutyListApi = (playload) => {
  let param = {
    url: 'daily/v1/duty/shiftslog'
  }
  return remove(param, { data: playload })
}

// 导出
export const exportListApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/export',
    body: playload
  }
  return post(param)
}

// 事件记录
export const eventlogApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/eventlog',
    query: payload
  }
  return get(param)
}

// 检查记录
export const checklogApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/checklog',
    query: payload
  }
  return get(param)
}

// 删除检查记录
export const deleteChecklogApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/checklog'
  }
  return remove(param, { data: playload })
}
// 检查记录导出
export const checklogExplodeApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/checklog/explode',
    query: payload
  }
  return get(param)
}

// 删除事件记录
export const deleteEventlogApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/eventlog',
    body: payload
  }
  return remove(param, { data: payload })
}

// 值班员登录可查看权限
export const getPermissionApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/permission',
    query: payload
  }
  return get(param)
}

// 获取报警数据
export const alarminfocountApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/alarminfocount',
    query: payload
  }
  return get(param)
}

// 查询下一个值班员
export const nextuserApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/nextuserinfo',
    query: payload
  }
  return get(param)
}
export const getMyInfoApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/myinfo',
    query: payload
  }
  return get(param)
}

// 登录完成开始开始值班
export const startDutyApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/start',
    body: playload
  }
  return post(param)
}

// 开始交班
export const startShiftApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/shiftslog',
    body: playload
  }
  return post(param)
}

// 确认接班
export const confirmofferApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/confirmoffer',
    body: playload
  }
  return put(param)
}

// 拒绝接班
export const refuseofferApi = (playload) => {
  let param = {
    url: '/daily/v1/duty/refuseoffer',
    body: playload
  }
  return put(param)
}

// 报警事件详情
export const alarmlistApi = (payload) => {
  let param = {
    url: '/daily/v1/duty/alarmlist',
    query: payload
  }
  return get(param)
}
