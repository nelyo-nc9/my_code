import { get, post, put, remove } from '../base'

// 获取设备列表
export const getDeviceListApi = (playload) => {
  let params = {
    url: '/resource/v1/video/hosts',
    query: playload
  }
  return get(params)
}

// 更新设备
export const putDeviceApi = (id, playload) => {
  let params = {
    url: `/resource/v1/video/host/${id}`,
    body: playload
  }
  return put(params)
}

// 添加设备
export const addDeviceApi = (playload) => {
  let params = {
    url: '/resource/v1/video/host',
    body: playload
  }
  return post(params)
}

// 删除设备
export const deleteDeviceApi = (playload) => {
  let params = {
    url: '/resource/v1/video/host'
  }
  const config = { // 确定是data是params
    data: playload
  }
  return remove(params, config)
}

// 获取单个设备的信息
export const getDeviceInfoApi = (id) => {
  let params = {
    url: `resource/v1/video/host/${id}`,
    query: ''
  }
  return get(params)
}

// 设备搜索
export const serarchDeviceListApi = (playload) => {
  let params = {
    url: 'resource/v1/video/hosts',
    body: playload
  }
  return post(params)
}
// 获取单个资源的信息
export const getResourceInfoApi = (id) => {
  let params = {
    url: `resource/v1/video/channel/${id}`,
    query: ''
  }
  return get(params)
}

// 查询资源列表
export const getResourceListApi = (playload) => {
  let params = {
    url: '/resource/v1/video/channels',
    body: playload
  }
  return post(params)
}

// 更新资源
export const putResourceApi = (id, playload) => {
  let params = {
    url: `/resource/v1/video/channel/${id}`,
    body: playload
  }
  return put(params)
}

// 添加资源
export const addResourceApi = (playload) => {
  let params = {
    url: '/resource/v1/video/channel',
    body: playload
  }
  return post(params)
}

// 删除资源
export const deleteResourceApi = (playload) => {
  let params = {
    url: '/resource/v1/video/channel'
  }
  const config = { // 确定是data是params
    data: playload
  }
  return remove(params, config)
}

// 关联列表 摄像机关联报警输入关联
export const getRelateListApi = (playload) => {
  let params = {
    url: 'resource/v1/video/channel/linkages',
    body: playload
  }
  return post(params)
}
// 搜索列表 摄像机关联报警输入关联
export const postSearchListApi = (playload) => {
  let params = {
    url: 'resource/v1/video/channel/linkages',
    body: playload
  }
  return post(params)
}

// 视频主机关联搜索
export const postSearchVideoRelateApi = (playload) => {
  let params = {
    url: 'resource/v1/video/host/linkages',
    body: playload
  }
  return post(params)
}

// 视频主机关联列表
export const postVideoRelateListApi = (playload) => {
  let params = {
    url: 'resource/v1/video/host/linkages',
    body: playload
  }
  return post(params)
}

// 更新视频主机/通道联动配置
export const setDeviceOrResourceApi = (playload) => {
  let params = {
    url: 'resource/v1/video/linkage',
    body: playload
  }
  return put(params)
}

// 获取指定视频主机/通道联动配置
export const setMoreLinks = (playload) => {
  let params = {
    url: 'resource/v1/video/linkages',
    body: playload
  }
  return put(params)
}

// 获取指定视频主机/通道联动配置
export const getDeviceOrResourceApi = (id, playload) => {
  let params = {
    url: `resource/v1/video/linkage/${id}`,
    query: playload
  }
  return get(params)
}

// 获取指定视频主机/通道联动配置
export const getMoreLinks = (playload) => {
  let params = {
    url: 'resource/v1/video/linkages',
    body: playload
  }
  return post(params)
}

// 获取服务器列表的下拉填充
export const getServersApi = () => {
  let query = {
    servername: 'DA'
  }
  let params = {
    url: 'service/list',
    query: query
  }
  return get(params)
}

// 主机-下载视频主机查询列表
export const getHostDownloadApi = (playload) => {
  let params = {
    url: 'resource/v1/video/host/download/host',
    query: playload
  }
  return get(params)
}

// 主机-迁移视频主机
export const putHostTransferApi = (playload) => {
  let params = {
    url: 'resource/v1/video/transfer/host',
    body: playload
  }
  return put(params)
}

// 获取日志
export const postLogApi = (playload) => {
  let params = {
    url: 'video/v1/logs',
    body: playload
  }
  return post(params)
}

// 添加日志
export const setLogApi = (playload) => {
  let params = {
    url: 'video/v1/log',
    body: playload
  }
  return post(params)
}

// 按机构id 获取 机构重点部位 详情
export const getLocOrOrgInfoApi = (playload) => {
  let params = {
    url: 'organizational/v1/org/information',
    body: playload
  }
  return post(params)
}

// 查询设备状态
export const getStatueNew = payload => {
  const param = {
    url: '/audio/v1/newservice/getstatue',
    query: payload
  }
  return get(param)
}

// 获取并更新NVR设备通道信息
export const getNvrChannelInfoApi = (playload) => {
  let params = {
    url: 'resource/v1/video/sync',
    body: playload
  }
  return post(params)
}
// 获取并更新多个NVR设备通道信息  视频主机列表顶部获取按钮
export const getNvrChannelsInfoApis = (playload) => {
  let params = {
    url: 'resource/v1/video/syncMany',
    body: playload
  }
  return post(params)
}

// 视频主机排序
export const setSortHostSerialApi = (payload) => {
  let params = {
    url: 'resource/v1/video/host/sequence',
    body: payload
  }
  return put(params)
}

// 检查ip是否ping通
export const getIpIspingApi = (playload) => {
  let params = {
    url: 'systemOpsManager/v1/systemOpsManager/ipIsping',
    query: playload
  }
  return get(params)
}
// 获取数据字典
export const getDataInfoApi = (playload, config = {}) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: playload
  }
  return post(param, config)
}
// 获取操作日志
export const getVideoOperationLogApi = (playload, page) => {
  let params = {
    url: `/systemOpsManager/v1/systemOpsManager/queryOperationLog/?page=${page.page}&limit=${page.limit}`,
    body: playload
  }
  return post(params)
}
// 导出操作日志
export const downVideoOperationLogApi = (playload, page) => {
  let params = {
    url: `/system/v1/operationlog/download`,
    body: playload
  }
  return post(params)
}
