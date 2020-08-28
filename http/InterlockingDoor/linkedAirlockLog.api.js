import {
  get,
  post,
  put
} from '../base'
// 查询互动连锁门记录
export const interactiveDoorRecord = playload => {
  let param = {
    url: '/guard/v1/door/record',
    query: playload
  }
  return get(param)
}

// 获取事件列表
export const getEventList = playload => {
  let param = {
    url: '/guard/v1/event/list'
  }
  return get(param)
}

// 获取报警事件
export const getWarningList = playload => {
  let param = {
    url: '/guard/v1/warning/list'
  }
  return get(param)
}

// 获取指定机构/重点部位的通道列表
export const getChannelList = playload => {
  let param = {
    url: '/resource/v1/guard/interlocking-door/channel',
    query: playload
  }
  return get(param)
}

// 获取指定主机/通道联动配置
export const linkageConfiguration = (id, playload) => {
  let param = {
    url: '/resource/v1/guard/linkage/' + id,
    query: playload
  }
  return get(param)
}

// 报警列表
export const getPoliceList = playload => {
  let param = {
    url: '/guard/v1/record/warning/list'
  }
  return get(param)
}

// 事件列表
export const getEvent = playload => {
  let param = {
    url: '/guard/v1/record/event/list'
  }
  return get(param)
}

// // 导出
// export const exportFile = playload => {
//   let param = {
//     url: '/guard/v1/door/record/explode',
//     headers: playload
//   }
//   return get(param)
// }

// 开门服务
export const openDoor = playload => {
  let param = {
    url: '/guard/v1/service/open',
    body: playload
  }
  return post(param)
}

// 关门服务
export const closeDoor = playload => {
  let param = {
    url: '/guard/v1/service/close',
    body: playload
  }
  return post(param)
}

// 话筒开启对讲
export const startTalking = playload => {
  let param = {
    url: '/audio/v1/service/mike/start/talk',
    body: playload
  }
  return post(param)
}

// 话筒关闭对讲
export const stopTalking = playload => {
  let param = {
    url: '/audio/v1/service/close/talk',
    body: playload
  }
  return post(param)
}

// 报警
export const callPolice = playload => {
  let param = {
    url: '/guard/v1/service/close',
    body: playload
  }
  return post(param)
}

// 消警
export const eliminationPolice = playload => {
  let param = {
    url: '/guard/v1/service/close',
    body: playload
  }
  return post(param)
}

// 资源树
export const getTreeApi = playload => {
  const param = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=3&hostType=3',
    query: playload
  }
  return get(param)
}

// 获取门禁平台信息列表
export const getAccessControl = playload => {
  let param = {
    url: '/resource/v1/guard/platform',
    query: playload
  }
  return get(param)
}

// 报警开门
export const alarmOpen = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/openDoor',
    body: payload
  }
  return post(param)
}

// 报警关门
export const AlarmClose = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/closeDoor',
    body: payload
  }
  return post(param)
}

// 门禁事件总列表
export const eventWarningList = payload => {
  let param = {
    url: '/guard/v1/record/event/warning/list'
  }
  return get(param)
}

//获取对讲通道关联主机信息
export const audioLink = id => {
  let param = {
    url: '/resource/v1/audio/channel/' + id + '/relation'
  }
  return get(param)
}

//获取指定id门禁平台及所属主机信息
export const getPlatform = id => {
  let param = {
    url: '/resource/v1/guard/platform/' + id
  }
  return get(param)
}

//统计指定机构/重点部位的互锁门通道列状态
export const getStatus = playload => {
  let param = {
    url: '/resource/v1/guard/interlocking-door/status/statistic',
    query: playload
  }
  return get(param)
}

//获取指定门禁主机及所属通道信息
export const getAppointHost = id => {
  let param = {
    url: '/resource/v1/guard/host/' + id
  }
  return get(param)
}

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
    url: '/alarm-manage/v1/alarm-bstar/linkOpenoutput',
    body: payload
  }
  return post(param)
}

//报警开关
export const closeAlarmoutputs = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/linkCloseoutput',
    body: payload
  }
  return post(param)
}


//互锁门操作日志查询
export const operationLog = payload => {
  let param = {
    url: '/guard/v1/operatelog/door',
    query: payload
  }
  return get(param)
}

//互锁门事件日志查询
export const eventLog = payload => {
  let param = {
    url: '/guard/v1/door/record',
    query: payload
  }
  return get(param)
}

//互锁门操作日志
export const operatelogType = payload => {
  let param = {
    url: '/guard/v1/operatelog/type/door/list',
    query: payload
  }
  return get(param)
}

export const getPing = (playload) => {
  let params = {
    url: '/systemOpsManager/v1/systemOpsManager/ipIsping',
    query: playload
  }
  return get(params)
}

//机构树模糊搜索
export const mistsSearch = payload => {
  let param = {
    url: '/resource/v1/tree/mists/search',
    query: payload
  }
  return get(param)
}