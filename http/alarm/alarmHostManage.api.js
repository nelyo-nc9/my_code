/*
 * @Author: your name
 * @Date: 2020-06-22 12:11:03
 * @LastEditTime: 2020-06-22 21:10:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \新建文件夹\client\src\http\alarm\alarmHostManage.api.js
 */
import { get, post, put } from '../base'
// 报警主机列表查询
export const getAlarmHostListApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-host/host',
    query: payload
  }
  return get(param)
}
// 报警主机下的子系统
export const getSubsystemListApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-host/subsystem-detector',
    query: payload
  }
  return get(param)
}
// 报警主机-探测器(2&3)
export const getDetectorListApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-host/detector',
    query: payload
  }
  return get(param)
}
// 获取重点部位信息
export const getLocationListApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-log/location',
    query: payload
  }
  return get(param)
}
// 获取机构树
export const getHostTreeApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/orgHostTree',
    query: playload
  }
  return get(params)
}
// 登录
export const loginApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/armLogin',
    body: payload
  }
  return post(param)
}
// 布防
export const defendnApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/arm',
    body: payload
  }
  return post(param)
}
// 撤防
export const undefendnApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/disarm',
    body: payload
  }
  return post(param)
}
// 旁路
export const bypassApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/bypass',
    body: payload
  }
  return post(param)
}
// 旁路回复
export const passApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/pass',
    body: payload
  }
  return post(param)
}
// 消警
export const clearAlarmApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/clean',
    body: payload
  }
  return post(param)
}
// 门禁开门
// export const openDoorApi = payload => {
//   const param = {
//     url: 'alarm-manage/v1/alarm-bstar/openDoor',
//     body: payload
//   }
//   return post(param)
// }
// 门禁关门
// export const closeDoorApi = payload => {
//   const param = {
//     url: 'alarm-manage/v1/alarm-bstar/closeDoor',
//     body: payload
//   }
//   return post(param)
// }
// 开始对讲
export const opentalkApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/opentalk',
    body: payload
  }
  return post(param)
}
// 结束对讲
export const closetalkApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/closetalk',
    body: payload
  }
  return post(param)
}
// 打开警铃
export const openoutputApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/openoutput',
    body: payload
  }
  return post(param)
}
// 关闭警铃
export const closeoutputApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-bstar/closeoutput',
    body: payload
  }
  return post(param)
}
// 获取报警主机IO警铃状态
export const getoutputStatusApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-bstar/getOutputStatus',
    body: payload
  }
  return post(param)
}
// 获取布撤防状态
export const getStatusApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-bstar/getstatus',
    body: payload
  }
  return post(param)
}
// 获取在线状态
export const getOnlinelistApi = payload => {
  let param = {
    url: 'alarm-manage/v1/alarm-bstar/onlinelist',
    body: payload
  }
  return post(param)
}
// 报警主机关联配置查询
export const getHostBindApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/host-bind',
    query: playload
  }
  return get(params)
}
// 获取探测器关联配置查询
export const getDetectorBindApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/detector-bind',
    query: playload
  }
  return get(params)
}
// 报警主机列表查询（报警主机管理页面使用）
export const getalrmHostListQueryApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/host',
    query: playload
  }
  return get(params)
}
// 单机页面查询输出警灯信息
export const getOutputChanApi = payload => {
  const param = {
    url: 'alarm-manage/v1/alarm-host/output-chan',
    query: payload
  }
  return get(param)
}
// ——————————————————————2020.8.9分割线————————————————————
//开始对讲
export const channelStartTalkApi = payload => {
  const param = {
    url: '/audio/v1/newservice/mike/start/talk',
    body: payload
  }
  return post(param)
}
//关闭对讲
export const channelCloseTalkApi = payload => {
  const param = {
    url: '/audio/v1/newservice/close/talk',
    body: payload
  }
  return post(param)
}
//查询指定mac地址的台麦主机
export const getMacApi = payload => {
  const param = {
    url: '/resource/v1/audio/host/mac/relation-platform',
    body: payload
  }
  return post(param)
}
// 门禁开门
export const openDoorApi = payload => {
  const param = {
    url: '/guard/v1/newservice/open',
    body: payload
  }
  return post(param)
}
// 门禁关门
export const closeDoorApi = payload => {
  const param = {
    url: '/guard/v1/newservice/close',
    body: payload
  }
  return post(param)
}
// 获取门实时状态
export const runtimeGuardApi = payload => {
  const param = {
    url: '/resource/v1/guard/channel/runtime/status',
    query: payload
  }
  return get(param)
}
// 获取音频实时状态
export const runtimeAudioApi = payload => {
  const param = {
    url: '/resource/v1/audio/channel/runtime/status',
    query: payload
  }
  return get(param)
}
// 操作布撤防后给存储状态到数据库
export const setHostZoneStatusApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/device-status',
    body: playload
  }
  return put(params)
}
// 报警面板数量统计
export const getalrmHostListStateApi = playload => {
  const params = {
    url: 'alarm-manage/v1/alarm-host/host-state',
    query: playload
  }
  return get(params)
}
// 获取报警主机联动关系
export const findHostBindApi = (id, payload) => {
  let param = {
    // url: '/alarm-manage1/alarm-host/host-bind',
    url: '/alarm-manage/v1/alarm-host/bind/' + id,
    query: payload
  }
  return get(param)
}
//  获取报警主机下探测器联动关系
export const findHostBindDetectorApi = (id, payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-host/bind/' + id,
    // url: '/alarm-manage1/alarm-host/detector-bind',
    query: payload
  }
  return get(param)
}
// 机构树（新）
export const getAlarmHostTreeApi = payload => {
  const param = {
    url: '/resource/v1/tree/orgResLazyTree',
    query: payload
  }
  return get(param)
}
// 机构树搜索(机构-重点部位-设备-通道)
export const AlarmHostSearchTreeApi = playload => {
  const params = {
    url: '/resource/v1/tree/mists/search',
    query: playload
  }
  return get(params)
}
