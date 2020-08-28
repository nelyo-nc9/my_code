import {
  post,
  get,
  put,
  remove
} from '../base'
//获取数据字典
export const getSystemOpsManagerApi = playload => {
  let params = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: playload
  }
  return post(params)
}
//获取树
//防护舱
export const getTreeApi = playload => {
  let params = {
    // url: '/resource/v1/tree/orgResLazyTree?subSystem=5&isRecursion=0',
    url: '/resource/v1/tree/orgResLazyTree?subSystem=5',
    query: playload
  }
  return get(params)
}
//视频
export const getVideoTreeApi = playload => {
  let params = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=1',
    query: playload
  }
  return get(params)
}
//对讲
export const getIntercomTreeApi = playload => {
  let params = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=4',
    query: playload
  }
  return get(params)
}
//报警输出
export const getOutputTreeApi = playload => {
  let params = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=2',
    query: playload
  }
  return get(params)
}
//获取指定机构/重点部位的通道列表
export const getAccessChannelApi = payload => {
  const param = {
    url: '/resource/v1/cabin/channel',
    query: payload
  }
  return get(param)
}
//统计指定机构/重点部位防护舱通道状态
export const getAccessChannelStatusApi = payload => {
  const param = {
    url: '/resource/v1/cabin/channel/statistic/status',
    query: payload
  }
  return get(param)
}
//获取指定防护舱通道信息
export const getAccessChannelIdApi = payload => {
  const param = {
    url: `/resource/v1/cabin/channel/${payload.id}`,
    body: payload
  }
  return get(param)
}
//获取指定防护舱主机/通道联动配置
export const getRelationChannelApi = payload => {
  const param = {
    url: `/resource/v1/cabin/linkage/${payload.id}`,
    query: payload.type
  }
  return get(param)
}
//获取指定防护舱通道关联主机【开门、关门等操作】
export const getChannelIdDoorApi = payload => {
  const param = {
    url: `/resource/v1/cabin/channel/${payload.id}/relation`,
    body: payload
  }
  return get(param)
}
//防护舱开关门
export const ctldoorChannelApi = payload => {
  const param = {
    url: '/cabin/v1/newservice/ctldoor',
    body: payload
  }
  return post(param)
}
//查询防护舱状态
export const getcabinstatusChannelApi = payload => {
  const param = {
    url: '/cabin/v1/service/getcabinstatus',
    query: payload
  }
  return get(param)
}
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
//报警输出
export const ctlalarmoutputApi = payload => {
  const param = {
    url: '/cabin/v1/service/ctlalarmoutput',
    body: payload
  }
  return post(param)
}

//日志
// 防护舱记录
export const recordApi = payload => {
  const param = {
    url: '/cabin/v1/record',
    query: payload
  }
  return get(param)
}
// 防护舱事件列表
export const recordEventListApi = payload => {
  const param = {
    url: '/cabin/v1/record/event/list',
    query: payload
  }
  return get(param)
}
// 防护舱警告列表
export const recordWarningListApi = payload => {
  const param = {
    url: '/cabin/v1/record/warning/list',
    query: payload
  }
  return get(param)
}
// 防护舱全部列表
export const recordAllListApi = payload => {
  const param = {
    url: '/cabin/v1/record/warning/event/list',
    query: payload
  }
  return get(param)
}

// 获取防护舱设备配置列表
export const getHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host',
    query: payload
  }
  return get(param)
}

//防护舱设备配置新建
export const addHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host',
    body: payload
  }
  return post(param)
}
//防护舱设备配置新建-接入服务器列表
export const getServiceListApi = payload => {
  const param = {
    url: '/service/list?servername=DA',
    body: payload
  }
  return get(param)
}
//防护舱设备配置查询
export const lookupApi = payload => {
  const param = {
    url: '/resource/v1/cabin/inquery',
    body: payload
  }
  return post(param)
}

//防护舱设备配置列表修改、查看(表单+通道列表)
export const listInfoApi = id => {
  const param = {
    url: `/resource/v1/cabin/host/${id}`,
  }
  return get(param)
}
//获取防护舱主机下远程通道（下载按钮）
export const addHostChannelGetApi = payload => {
  const param = {
    url: '/resource/v1/cabin/sync/channel/resource',
    query: payload
  }
  return get(param)
}
//防护舱通道获取（点击下载按钮获取）
export const getAddHostChannelApi = payload => {
  const param = {
    url: `resource/v1/cabin/host/${payload.id}/channel`,
    query: payload.type
  }
  return get(param)
}
//小按钮-增
export const addHostChannelAddApi = payload => {
  const param = {
    url: '/resource/v1/cabin/channel',
    body: payload
  }
  return post(param)
}
//小按钮-删
export const addHostChannelDeleteApi = (playload) => {
  const params = {
    url: '/resource/v1/cabin/channel',
  }
  const config = { // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
//小按钮-修改
export const addHostChannelUpdateApi = payload => {
  const param = {
    url: '/resource/v1/cabin/channel/' + payload.id,
    body: payload.message
  }
  return put(param)
}

// 防护舱设备配置删除
export const deleteHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host',
    body: payload
  }
  return remove(param, {
    data: {
      ...payload
    }
  })
}
// 防护舱设备配置修改
export const updateHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host/' + payload.id,
    body: payload.message
  }
  return put(param)
}

// 防护舱设备配置排序
export const sortHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host/sequence',
    body: payload
  }
  return put(param)
}

// 防护舱设备配置迁移
export const moveHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host/transfer',
    body: payload
  }
  return put(param)
}

// 防护舱主机关联配置列表
export const relevanceHostApi = payload => {
  const param = {
    url: '/resource/v1/cabin/host/linkage',
    query: payload
  }
  return get(param)
}
// 防护舱通道/输入关联配置列表
export const relevanceChannelApi = payload => {
  const param = {
    url: '/resource/v1/cabin/channel/linkage',
    query: payload
  }
  return get(param)
}
// 获取指定防护舱主机/通道联动配置
export const linkHostApi = payload => {
  const param = {
    url: `/resource/v1/cabin/linkage/${payload.id}`,
    query: payload.type
  }
  return get(param)
}
// 更新防护舱主机/通道联动配置
export const linkageApi = payload => {
  const param = {
    url: '/resource/v1/cabin/linkage',
    body: payload
  }
  return put(param)
}


// 获取指定主机的特定类型通道列表
export const getChannel = payload => {
  const param = {
    url: '/resource/v1/cabin/host/' + payload.id + '/channel',
    query: payload.type
  }
  return get(param)
}

// 获取指定主机的特定类型通道列表
export const information = payload => {
  const param = {
    url: '/organizational/v1/org/information',
    body: payload
  }
  return post(param)
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

//打开警铃
export const openAlarmoutputs = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/openoutput',
    body: payload
  }
  return post(param)
}

//关闭警铃
export const closeAlarmoutputs = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/closeoutput',
    body: payload
  }
  return post(param)
}

//警铃状态
export const getAlarmoutputs = payload => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/getOutputStatus',
    body: payload
  }
  return post(param)
}

//主机列表导出
export const downloadHost = payload => {
  let param = {
    url: '/resource/v1/cabin/host/download',
    body: payload
  }
  return post(param)
}

// 获取多个防护舱主机/通道联动配置
export const getMoreLinks = (playload) => {
  let params = {
    url: 'resource/v1/cabin/linkages',
    body: playload
  }
  return post(params)
}

// 更新多个防护舱主机/通道联动配置
export const setMoreLinks = (playload) => {
  let params = {
    url: 'resource/v1/cabin/linkages',
    body: playload
  }
  return put(params)
}

//批量获取远程通道
export const getChannes = (playload) => {
  let params = {
    url: '/resource/v1/cabin/sync/channel/resource',
    body: playload
  }
  return post(params)
}

//ping
export const getPing = (playload) => {
  let params = {
    url: '/systemOpsManager/v1/systemOpsManager/ipIsping',
    query: playload
  }
  return get(params)
}

//字典获取
export const getBasicInfo = (playload) => {
  let params = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: playload
  }
  return post(params)
}


//防护舱操作日志查询
export const operationLog = payload => {
  let param = {
    url: '/cabin/v1/operatelog',
    query: payload
  }
  return get(param)
}

//防护舱事件日志查询
export const eventLog = payload => {
  let param = {
    url: '/cabin/v1/record',
    query: payload
  }
  return get(param)
}


//防护舱操作类型列表
export const operatelogType = payload => {
  let param = {
    url: '/cabin/v1/operatelog/type/list',
    query: payload
  }
  return get(param)
}

//防护舱警告列表
export const warningListApi = payload => {
  let param = {
    url: '/cabin/v1/record/warning/list',
    query: payload
  }
  return get(param)
}

//防护舱事件列表
export const eventListApi = payload => {
  let param = {
    url: '/cabin/v1/record/event/list',
    query: payload
  }
  return get(param)
}

//获取对讲通道实时状态
export const getTalk = payload => {
  let param = {
    url: '/resource/v1/audio/channel/runtime/status',
    query: payload
  }
  return get(param)
}

//机构树所有模糊搜索
export const mistsSearch = payload => {
  let param = {
    url: '/resource/v1/tree/mists/search',
    query: payload
  }
  return get(param)
}

//获取事件配置
export const eventTypeStatus = payload => {
  let param = {
    url: '/resource/v1/event/' + payload.id,
    query: payload.type
  }
  return get(param)
}

//机构树重点部位
export const orgKeypart = payload => {
  let param = {
    url: '/resource/v1/tree/org/keypart/search',
    query: payload
  }
  return get(param)
}