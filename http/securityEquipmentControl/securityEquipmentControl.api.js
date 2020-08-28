import { get, post, put, remove } from '../base'
// 数字字典 子模块id{    1 = 报警管理    2 = 视频管理    3 = 音频管理    4 =门禁管理    5=联动互锁门    6=防护舱    7=安防设备管控    8=电视墙    9=金库远程管理   10=停车管理}
export const queryDataDictBasicInfoApi = (payload) => {
  let param = {
    url: 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: payload
  }
  return post(param)
}

/**
子系统类型：1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙
 * */
//  获取设备列表
export const getsubsystemListApi = playload => {
  let params = {
    url: 'inspection/v1/hosts',
    body: playload
  }
  return post(params)
}

// 服务器
export const getServerApi = playload => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/queryServerBySpecialCondition',
    body: playload
  }
  return post(params)
}

// 平台服务
export const getServiceApi = playload => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/ServiceManager/queryBySpecialCondition',
    body: playload
  }
  return post(params)
}

// 服务器导出execl
export const exportServerList = playload => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/exportServerList',
    body: playload
  }
  return post(params)
}

// 平台服务导出execl
export const exportServiceManager = playload => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/ServiceManager/export',
    body: playload
  }
  return post(params)
}

// ping 检测
export const getPingApi = playload => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/ipIsping',
    query: playload
  }
  return get(params)
}

// 设备巡检参数配置 获取
export const getDeviceConfig = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/config',
    query: playload
  }
  return get(params)
}

// 设备巡检参数配置 修改
export const putDeviceeConfig = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/config',
    body: playload
  }
  return put(params)
}

// 设备巡检列表
export const getTasksList = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/tasks',
    query: playload
  }
  return get(params)
}
// 巡检任务新建
export const addTask = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/task',
    body: playload
  }
  return post(params)
}

// 巡检任务修改
export const putTask = (id, playload) => {
  let params = {
    url: `inspection/v1/deviceInspection/task/${id}`,
    body: playload
  }
  console.log(params, params.body)
  return put(params)
}
// 巡检任务删除
export const removeTask = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/tasks',
    body: playload
  }
  return remove(params, { data: playload })
}

// 巡检任务启用停用

export const isStopTask = (id, status, playload) => {
  let params = {
    url: `inspection/v1/deviceInspection/task/${id}/status/${status}`,
    body: playload
  }
  return put(params, { data: playload })
}

// 巡检结果
export const result = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/task/results',
    query: playload
  }
  return get(params)
}

// 巡检结果详情列表
export const resultInfos = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/task/result/infos',
    query: playload
  }
  return get(params)
}
// 巡检结果详情通道明细-列表 inspection/v1/deviceInspection/task/result/info/channels
export const resultAisleInfos = playload => {
  let params = {
    url: 'inspection/v1/deviceInspection/task/result/info/channels',
    query: playload
  }
  return get(params)
}

// 视频参数巡检
// 视频参数巡检配置-获取
export const getVideoDeviceConfig = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/config',
    // url: 'mock/inspection/v1/videoInspection/config',
    query: playload
  }
  return get(params)
}
// 视频巡检参数配置 修改
export const putVideoDeviceeConfig = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/config',
    body: playload
  }
  return put(params)
}
// 视频参数巡检任务-列表
export const getTasksVideoList = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/tasks',
    query: playload
  }
  return get(params)
}
// 视频参数巡检任务-获取单个 /api/inspection/v1/deviceInspection/task/:id

export const getOneItem = id => {
  let params = {
    url: `/inspection/v1/deviceInspection/task/${id}`
  }
  return get(params)
}
// 视频参数巡检任务-新建
export const addVideoTask = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/task',
    query: playload
  }
  return post(params)
}
// 视频参数巡检任务-修改
export const putVideoTask = (id, playload) => {
  let params = {
    url: `/inspection/v1/videoInspection/task/${id}`,
    body: playload
  }
  return put(params)
}
// 视频参数巡检任务-删除
export const removeVideoTask = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/tasks',
    body: playload
  }
  return remove(params, { ids: playload })
}
// 视频参数巡检任务-启用/停用
export const putVideoTaskStuta = (id, status, playload) => {
  let params = {
    url: `/inspection/v1/videoInspection/task/${id}/status/${status}`,
    body: playload
  }
  return put(params)
}
// 视频参数巡检结果-列表
export const getTasksVideoListResults = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/task/results',
    query: playload
  }
  return get(params)
}
// 视频参数巡检结果-列表
export const getTasksVideoListInfo = playload => {
  let params = {
    url: '/inspection/v1/videoInspection/task/result/infos',
    query: playload
  }
  return get(params)
}
// 树形菜单栏
export const getTreeApi = playload => {
  const params = {
    url: '/resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(params)
}

// 递归懒加载树接口
export const getLazyTreeCheckApi = playload => {
  const params = {
    // url: '/resource1/tree/orgResourceTree',接口地址路径错误，做的修改
    // url: 'resource/v1/tree/orgResourceTree',
    url: '/resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(params)
}
// 系统校时
// 系统校时配置获取
export const getCorrection = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/config'
  }
  return get(params)
}

// 系统校时配置修改
export const putCorrection = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/config',
    body: playload
  }
  return put(params)
}

// 设备校时列表
export const getCorrectionList = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/device/timeDiffrent',
    query: playload
  }
  return get(params)
}
// 第三方平台列表
export const getThreeList = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/platform/timeDiffrent',
    query: playload
  }
  return get(params)
}
// 校时任务列表
export const getCorrectingTaskList = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/tasks',
    query: playload
  }
  return get(params)
}

// 校时任务 新建
export const newCorrectingTask = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/task',
    body: playload
  }
  return post(params)
}

// 校时任务 修改 /api/inspection/v1/correctingTime/task/:id
export const putCorrectingTask = (id, playload) => {
  const params = {
    url: `inspection/v1/correctingTime/task/${id}`,
    body: playload
  }
  return put(params)
}
//校时任务 获取单个 /api/inspection/v1/correctingTime/task/:id
export const getCorrectiongTask = ( id,playload ) => {
  const params = {
    url: `inspection/v1/correctingTime/task/${id}`,
    query: playload
  }
  return get(params)
}
// 校时任务 - 删除
export const delCorrectingTask = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/tasks',
    body: playload
  }
  return remove(params, { data: playload })
}

// 校时任务 -启用/停用
export const putFlagCorrecting = playload => {
  const params = {
    url: `inspection/v1/correctingTime/task/${playload.id}/status/${playload.status}`
    // body: playload
  }
  return put(params)
}
// 校时结果列表
export const resultCorrectList = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/task/results',
    query: playload
  }
  return get(params)
}

// 校时结果详情
export const resultCorrectInfos = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/task/result/infos',
    query: playload
  }
  return get(params)
}

// 设备校时-校时 /api/inspection/v1/correctingTime/synctime
export const syncTime = playload => {
  const params = {
    url: 'inspection/v1/correctingTime/synctime',
    body: playload
  }
  return put(params)
}
