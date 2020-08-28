import { get, post, remove, put } from '../base'

// 获取金库值守表格数据
export const getGuardTableDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/cofferalarm',
    body: payload
  }
  return post(params)
}

// 修改金库值守表格数据状态
export const setGuardTableDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/cofferalarm',
    body: payload
  }
  return put(params)
}

// 删除指定的金库值守表格数据
// export const removeGuardDataApi = (payload) => {
//   let params = {
//     url: 'coffer/v1/cofferalarm'
//   }
//   const config = {
//     data: payload
//   }
//   return remove(params, config)
// }

// 获取金库事件表格数据
export const getEventTableDataApi = () => {
  let params = {
    url: 'coffer/v1/event'
  }
  return get(params)
}

// 新增金库事件表格数据
export const setEventTableDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/event',
    body: payload
  }
  return post(params)
}

// 新增检查记录表格数据
export const sendInspectDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/checkrecord',
    body: payload
  }
  return post(params)
}

// 获取检查记录表格数据
export const getInspectDataApi = () => {
  let params = {
    url: 'coffer/v1/checkrecord'
  }
  return get(params)
}

// 删除检查记录表格数据
export const removeInspectDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/checkrecord'
  }
  const config = {
    data: payload
  }
  return remove(params, config)
}

// 获取检查记录 - 记录处理表单数据
export const getInspectFormDataApi = () => {
  let params = {
    url: 'coffer/v1/checkhandle'
  }
  return get(params)
}

// 开门服务
export const openDoorApi = (payload) => {
  let params = {
    url: 'guard/v1/service/open',
    body: payload
  }
  return post(params)
}

// 从门禁控制器获取通道信息
export const getDoorStatusApi = (payload) => {
  let params = {
    url: 'guard/v1/service/getchannelinfo',
    body: payload
  }
  return post(params)
}

// 发送检查记录 - 记录处理表单数据
export const sendInspectFormDataApi = (payload) => {
  let params = {
    url: 'coffer/v1/checkhandle',
    body: payload
  }
  return post(params)
}

// 对讲接听
export const answerTalkApi = (payload) => {
  let params = {
    url: 'alarm-manage/v1/alarm-bstar/assigncenteranswer',
    body: payload
  }
  return post(params)
}

// 开启对讲接口
export const openTalkApi = (payload) => {
  let params = {
    url: 'audio/v1/newservice/mike/start/talk',
    body: payload
  }
  return post(params)
}

// 关闭对讲接口
export const closeTalkApi = (payload) => {
  let params = {
    url: 'audio/v1/newservice/close/talk',
    body: payload
  }
  return post(params)
}

// 查询指定MAC地址的台麦主机及平台信息
export const getAudioPlatformApi = (payload) => {
  let params = {
    url: 'resource/v1/audio/host/mac/relation-platform',
    body: payload
  }
  return post(params)
}

// 根据机构ID获取机构详情
export const getOrgInfoApi = (payload) => {
  let params = {
    url: 'organizational/v1/org/information',
    body: payload
  }
  return post(params)
}

// 根据用户ID获取指纹仪所需参数接口 (校验人员指纹使用)
export const getVerifyFingerParam = (payload) => {
  let params = {
    url: 'coffer/v1/verification',
    body: payload
  }
  return post(params)
}

// 检查记录 - 获取检查项接口
export const getCheckerCordApi = () => {
  let params = {
    url: 'video/v1/hardware/checkrecord/items'
  }
  return get(params)
}

// 检查记录 - 删除 不处理检查项接口
export const deleteCheckerCordApi = payload => {
  let params = {
    url: `video/v1/hardware/checkrecord/item/${payload}`
  }
  if (typeof payload === 'object') {
    params = {
      url: 'video/v1/hardware/checkrecord/items',
      body: payload
    }
  }
  return put(params)
}

// 检查记录 - 批量处理检查项
export const disposeCheckerCordApi = payload => {
  let params = {
    url: 'video/v1/hardware/checkrecords',
    body: payload
  }
  return post(params)
}

// 报警输出接口
export const alarmOutputApi = payload => {
  let params = {
    // url: 'alarm-manage/v1/alarm-bstar/linkOpenoutput',
    url: 'alarm-manage/v1/alarm-bstar/openoutput',
    body: payload
  }
  return post(params)
}

// 获取报警主机列表
export const getAlarmhostListApi = payload => {
  let params = {
    url: 'alarm-manage/v1/alarm-host/host',
    query: payload
  }
  return get(params)
}

// 获取布防状态信息
export const getGuardStatusApi = payload => {
  let params = {
    url: 'alarm-manage/v1/alarm-bstar/getstatus',
    body: payload
  }
  return post(params)
}

// 布防
export const setGuardApi = payload => {
  let params = {
    url: 'alarm-manage/v1/alarm-bstar/arm',
    body: payload
  }
  return post(params)
}

// 撤防
export const removeGuardApi = payload => {
  let params = {
    url: 'alarm-manage/v1/alarm-bstar/disarm',
    body: payload
  }
  return post(params)
}
