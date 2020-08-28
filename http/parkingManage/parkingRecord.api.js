import { post, put, get, remove } from '../base'
// 查询实时过车今日黑名单和布控信息
export const getRealTimeBlackListApi = (payload) => {
  let param = {
    url: 'park/v1/record/defense/today',
    query: payload
  }
  return get(param)
}
// 过车记录查询
export const getParkingRecordListApi = (payload) => {
  let param = {
    url: 'park/v1/record',
    query: payload
  }
  return get(param)
}
// 停车日志查询
export const getParkingLogListApi = (payload) => {
  let param = {
    url: 'park/v1/log',
    query: payload
  }
  return get(param)
}
// 平台配置-新建
export const addParkPlatformApi = payload => {
  const param = {
    url: 'park/v1/platform',
    body: payload
  }
  return post(param)
}
// 平台配置--停车平台列表查询
export const getParkPlatformApi = (payload) => {
  let param = {
    url: 'park/v1/platform',
    query: payload
  }
  return get(param)
}
// 停车平台-编辑
export const updateParkPlatformApi = (payload) => {
  let param = {
    url: 'park/v1/platform',
    body: payload
  }
  return put(param)
}
// 删除停车平台
export const deleteParkPlatformApi = ids => {
  const param = {
    url: 'park/v1/platform'
  }
  return remove(param, { data: { ids } })
}
// 导出停车平台
export const exportParkPlatformApi = (payload) => {
  let param = {
    url: 'park/v1/platform/export',
    query: payload
  }
  return get(param)
}
// 查询停车平台--停车主机
export const getParkHostListApi = (payload) => {
  let param = {
    url: 'park/v1/host',
    query: payload
  }
  return get(param)
}
// 停车主机编辑
export const updateParkHostApi = (payload) => {
  let param = {
    url: 'park/v1/host',
    body: payload
  }
  return put(param)
}
// 停车主机保存
export const addParkHostApi = (payload) => {
  let param = {
    url: 'park/v1/host',
    body: payload
  }
  return post(param)
}
// 车辆配置-新建
export const addParkConfigApi = payload => {
  const param = {
    url: 'park/v1/config/defense',
    body: payload
  }
  return post(param)
}
// 车辆配置-编辑
export const updateParkConfigApi = (payload) => {
  let param = {
    url: 'park/v1/config/defense',
    body: payload
  }
  return put(param)
}

// 车辆配置-查询
export const getParkConfigApi = (payload) => {
  const param = {
    url: 'park/v1/config/defense',
    query: payload
  }
  return get(param)
}
// 车辆配置-批量删除
export const deleteParkConfigApi = ids => {
  const param = {
    url: 'park/v1/config/defense'
  }
  return remove(param, { data: { ids } })
}
// 获取机构树递归
export const getTreeApi = playload => {
  const params = {
    url: 'park/v1/tree/orgResourceTree',
    query: playload
  }
  return get(params)
}
// 查询过车记录详情
export const getDetailApi = playload => {
  const params = {
    url: 'park/v1/record/detail',
    query: playload
  }
  return get(params)
}
// 确认/拒绝通行
export const setControlApi = (payload) => {
  let param = {
    url: 'park/v1/record/control',
    body: payload
  }
  return post(param)
}
// 获取数据字典信息
export const queryDataDictBasicInfoApi = (payload) => {
  let param = {
    url: 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: payload
  }
  return post(param)
}
// 根据停车平台获取该平台下的主机信息
export const getHostListApi = playload => {
  const params = {
    url: '/park/v1/platform/hosts',
    query: playload
  }
  return get(params)
}
// 关联配置-----------------------------分割线-------------------------
// 获取停车主机关联配置列表
export const getHostLinkageListApi = playload => {
    const params = {
      url: '/park/v1/host/linkage',
      query: playload
    }
    return get(params)
  }
// getinfo停车登录
export const getinfoApi = (payload) => {
  let param = {
    url: '/park/getinfo',
    body: payload
  }
  return post(param)
}
// 控制闸机接口
export const controlApi = (payload) => {
    let param = {
      url: '/park/control',
      body: payload
    }
    return post(param)
  }
  // 获取指定视频主机/通道联动配置
export const getHostOrResourceApi = (id, playload) => {
    let params = {
        url: '/park/v1/linakge/'+id,
        query: playload
    }
    return get(params)
}
//创建或更新关联配置
export const setHostOrResourceApi = (payload) => {
    let param = {
      url: 'park/v1/linkage',
      body: payload
    }
    return put(param)
  }
  