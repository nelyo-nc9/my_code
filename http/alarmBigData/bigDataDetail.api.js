/**
 * author: wangpengcheng
 * describe: Big data Detail interface
 */
import { get, post, put, remove } from '../base'

// 树形菜单栏
export const getTreeApi = playload => {
  const params = {
    url: `/resource/v1/tree/orgResLazyTree`,
    query: playload
  }
  return get(params)
}

/**
 * 视频主机
 */

//统计视频主机总数
export const getAllCount = () => {
  const params = {
    url: `/resource/v1/video/statistic/host`
  }
  return get(params)
}

//统计各个重点部位视频主机总数
export const getTvCount = () => {
  const params = {
    url: `/resource/v1/video/statistic/keypart/distribution`
  }
  return get(params)
}

//统计今日，当前时间截止前在线、离线状态
export const getNowDayCount = payload => {
  const params = {
    url: `/resource/v1/video/statistic/status`,
    query: payload
  }
  return get(params)
}

//统计今明两天，运行状态分析
export const getNowAndToChange = payload => {
  const params = {
    url: `/resource/v1/video/statistic/comparison/status`,
    query: payload
  }
  return get(params)
}

//统计视频主机事件在重点部位的分布
export const getTvEventApi = payload => {
  const params = {
    url: `/resource/v1/video/statistic/keypart/event`,
    query: payload
  }
  return get(params)
}

//获取事件统计分析
export const getEventApi = payload => {
  const params = {
    url: `/resource/v1/video/statistic/event`,
    query: payload
  }
  return get(params)
}

/**
 * 门禁主机
 */
var baseDoor = '/resource/v1/guard/statistic/'

//门禁主机今日截止当前在线离线状态
export const doorLineApi = payload => {
  const params = {
    url: `${baseDoor}status`,
    query: payload
  }
  return get(params)
}

//门禁主机今日昨日同比在线状态
export const doorDayAndYesApi = payload => {
  const params = {
    url: `${baseDoor}comparison/status`,
    query: payload
  }
  return get(params)
}

//门禁主机在重点部位分部数量
export const doorBranchCountApi = payload => {
  const params = {
    url: `${baseDoor}keypart/distribution`,
    query: payload
  }
  return get(params)
}

//统计门禁主机在重点部位的事件分布
export const doorEventCountApi = payload => {
  const params = {
    url: `${baseDoor}keypart/event`,
    query: payload
  }
  return get(params)
}

//统计门禁主机按半小时统计
export const doorEventHourCountApi = payload => {
  const params = {
    url: `${baseDoor}event`,
    query: payload
  }
  return get(params)
}


/**
 * 对讲主机
 */
var baseAudio = '/resource/v1/audio/statistic/'

//门禁主机今日截止当前在线离线状态
export const audioLineApi = payload => {
  const params = {
    url: `${baseAudio}status`,
    query: payload
  }
  return get(params)
}

//门禁主机今日昨日同比在线状态
export const audioDayAndYesApi = payload => {
  const params = {
    url: `${baseAudio}comparison/status`,
    query: payload
  }
  return get(params)
}

//门禁主机在重点部位分部数量
export const audioBranchCountApi = payload => {
  const params = {
    url: `${baseAudio}keypart/distribution`,
    query: payload
  }
  return get(params)
}

//统计门禁主机在重点部位的事件分布
export const audioEventCountApi = payload => {
  const params = {
    url: `${baseAudio}keypart/event`,
    query: payload
  }
  return get(params)
}

//统计门禁主机按半小时统计
export const audioEventHourCountApi = payload => {
  const params = {
    url: `${baseAudio}event`,
    query: payload
  }
  return get(params)
}


//安防大数据首页 -左侧底部第四个
export const alarmStatistics = payload => {
  const params = {
    url: `/alarm-manage/v1/alarm-statistics/status`,
    query: payload
  }
  return get(params)
}


