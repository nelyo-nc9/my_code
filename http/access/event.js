import { get, post, remove, put } from '../base'
let href = 'http://192.168.30.56:40001'
export const getEventType = payload => {
  let param = {
    url: 'http://192.168.30.56:40001/api/v1/guard/eventList',
    query: payload
  }
  return get(param)
}

//事件日志导出
export const eventDownLoad = payload => {
  let param = {
    url: '/guard/v1/record/explode',
    query: payload
  }
  return get(param)
}

/**
 * @description: 操作日志导出
 * @param {type}: Object
 * @return: data
 */
export const operatingLogDownLoad = payload => {
  let param = {
    url: '/guard/v1/operatelog/explode',
    query: payload
  }
  return get(param)
}

//删除
export const delLogList = payload => {
  let param = {
    url: '/guard/v1/record'
  }
  return remove(param, { data: payload })
}

/* 上传文件 */
export function upFile(url) {
  return href + url
}

//开门
let hresfs = 'http://192.168.14.17:8010'
export const openAccess = payload => {
  let param = {
    url: '/guard/v1/newservice/open',
    body: payload
  }
  return post(param)
}

//关门

export const closeTheflor = payload => {
  let param = {
    url: '/guard/v1/newservice/close',
    body: payload
  }
  return post(param)
}

//从门禁控制器获取通道信息
export const getPassageway = payload => {
  let param = {
    url: '/guard/v1/service/getchannelinfo',
    body: payload
  }

  return post(param)
}

// 对讲控制  开启对讲

export const openVideo = payload => {
  let param = {
    url: '/audio/v1/newservice/mike/start/talk',
    body: payload
  }
  return post(param)
}

//关闭对讲
export const offVideo = payload => {
  let param = {
    url: '/audio/v1/newservice/close/talk',
    body: payload
  }

  return post(param)
}

//报警开门
export const alarmOpen = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/openDoor',
    body: payload
  }
  return post(param)
}

//报警关门
export const AlarmClose = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/closeDoor',
    body: payload
  }
  return post(param)
}

//获取mak

export const getMac = payload => {
  let param = {
    url: '/resource/v1/audio/host/mac/relation-platform',
    body: payload
  }
  return post(param)
}

/* ------------------
-------------------------------------------------- */
//视频输出开关
export const alarmoutput = payload => {
  let param = {
    url: '/video/v1/hardware/alarmoutput',
    body: payload
  }
  return post(param)
}

//防护舱输出开关
export const ctlalarmoutput = payload => {
  let param = {
    url: '/cabin/v1/newservice/ctlalarmoutput',
    body: payload
  }
  return post(param)
}

//报警开关
export const alarmoutputs = payload => {
  let param = {
    // url: '/alarm-manage/v1/alarm-bstar/linkOpenoutput',
    url: '/alarm-manage/v1/alarm-bstar/openoutput',
    body: payload
  }
  return post(param)
}

//报警开关
export const closeAlarmoutputs = payload => {
  let param = {
    // url: '/alarm-manage/v1/alarm-bstar/linkCloseoutput',
    url: '/alarm-manage/v1/alarm-bstar/closeoutput',
    body: payload
  }
  return post(param)
}

//导出门禁管理列表

export const exportChannelList = payload => {
  let param = {
    url: '/resource/v1/guard/channel/download',
    body: payload
  }
  return post(param)
}

// 门禁日志操作日志
export const OperationLog = payload => {
  let param = {
    url: '/guard/v1/operatelog',
    query: payload
  }
  return get(param)
}

// 门禁操作类型
export const operatingType = payload => {
  let param = {
    url: '/guard/v1/operatelog/type/list',
    query: payload
  }
  return get(param)
}

// 机构数模糊查询
export const blurredTree = payload => {
  let param = {
    url:'/resource/v1/tree/mists/search',
    query:payload
  }
  return get(param)
}