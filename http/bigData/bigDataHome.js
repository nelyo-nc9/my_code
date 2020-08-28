// 安防大数据首页接口
import { get, post, put, remove } from '../base'

// 获取左侧视频主机在线离线状态
// get 
// 获取左侧设备统计图表列表
export const VideoStatus= (payload) => {
  let param = {
    url: 'resource/v1/video/statistic/status',
    query: ''
  }
  return get(param)
}

//get api/alarm-manage/v1/alarm-host/host-state
export const warnCount= (payload) => {
  let param = {
    url: 'alarm-manage/v1/alarm-host/host-state',
  }
  return get(param)
}
//get /
// 统计视频主机总数
export const VideoCount= (payload) => {
  let param = {
    url: 'resource/v1/video/statistic/host',
    query: ''
  }
  return get(param)
}

// 获取左侧设备统计图表列表
export const equipmentStatus= (payload) => {
  let param = {
    url: '/daily/v1/duty/content',
    query: payload
  }
  return get(param)
}

// 获取地图数据
export const getMap = (payload) => {
  let param = {
    url: '/daily/v1/duty/dutycontent',
    body: payload
  }
  return post(param)
}
// 获取右侧值班信息数据 


export const rightDutyInformation= ({id, param}) => {
  let params = {
    url: `/daily/v1/duty/${id}`,
    body: param
  }
  return put(params)
}


// 获取右侧报警分类设备统计
export const rightAccessStatistics  = (param) => {
  let params = {
    url: '/alarm-manage/v1/alarm-statistics/kindcount',
    query: param
  }
  return get(params)
}

// 获取右侧报警分类统计
export const rightAlarmStatistics  = (id) => {
  let param = {
    url: `/daily/v1/duty/shiftslog/detail/${id}`,
    query: ''
  }
  return get(param)
}
 // 获取底部重点报警分类统计 
 export const keyAlarmStatistics = (id) => {
    let param = {
      url: `/daily/v1/duty/shiftslog/detail/${id}`,
      query: ''
    }
    return get(param)
 }
 