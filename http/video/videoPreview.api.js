import { post, get, put, remove } from '../base'

// 云台控制
export const YUNNAN_CTRL_SET = (params, id, type) => {
  let sendData = {
    url: 'ctl/ptzctl',
    body: params
  }
  return post(sendData)
}

// 云台获取
export const YUNNAN_CTRL_GET = {
  // 预置点
  getpreset: (params) => {
    let sendData = {
      url: `ctl/getpreset`,
      body: params
    }
    return post(sendData)
  },
  // 巡航路径
  getcruisepath: (params) => {
    let sendData = {
      url: `ctl/getcruisepath`,
      body: params
    }
    return post(sendData)
  },
  // 巡航轨迹
  getcruiselocus: (params) => {
    let sendData = {
      url: `ctl/getcruiselocus`,
      body: params
    }
    return post(sendData)
  },
  // 扫描
  getscan: (params) => {
    let sendData = {
      url: `ctl/getscan`,
      body: params
    }
    return post(sendData)
  }
}

export const recordUserLog = (obj) => {
  if (+obj.logType === 1) {
    obj.logType = '操作日志'
  } else if (+obj.logType === 2) {
    obj.logType = '管理日志'
  }
  return post({
    url: 'setting/user/log',
    body: obj
  })
}

// 图像调节
export const GET_PICCFG = (params) => {
  let sendData = {
    url: `ctl/getpiccfg`,
    body: params
  }
  return post(sendData)
}

export const SET_PICCFG = (params) => {
  let sendData = {
    url: 'ctl/setpiccfg',
    body: params.param1
  }
  return post(sendData)
}

// 开启对讲或者广播
export const TALK_STREAM_START = params => {
  let sendData = {
    url: 'ctl/talk',
    body: params
  }
  return post(sendData)
}

// 中心录像的开启
export const OPEN_CENTRERECORD = params => {
  let sendData = {
    url: '/playback/start',
    body: params
  }
  return post(sendData)
}

// 中心录像的关闭
export const STOP_CENTRERECORD = params => {
  let sendData = {
    url: '/playback/stop',
    body: params
  }
  return post(sendData)
}

// 获取机构树递归
export const getTreeApi = playload => {
  const params = {
    url: 'resource/v1/tree/orgResourceTree',
    query: playload
  }
  return get(params)
}

// 获取机构树懒加载
export const getLazyTreeApi = playload => {
  const params = {
    url: 'resource/v1/tree/orgResLazyTree',
    query: playload
  }
  return get(params)
}

// 获取收藏夹列表
export const getCollectList = playload => {
  const params = {
    url: 'video/v1/favorites',
    query: playload
  }
  return get(params)
}

// 新建收藏夹
export const postCollect = playload => {
  const params = {
    url: 'video/v1/favorite',
    body: playload
  }
  return post(params)
}

// 修改收藏夹
export const updataCollect = playload => {
  const params = {
    url: 'video/v1/favorite',
    body: playload
  }
  return put(params)
}

// 删除收藏夹
export const deleteCollect = playload => {
  const params = {
    url: 'video/v1/favorites'
  }
  const config = {
    data: playload
  }
  return remove(params, config)
}

// 分享收藏夹
export const shareCollect = playload => {
  const params = {
    url: 'video/v1/favorite/share',
    body: playload
  }
  return post(params)
}

// 紧急录像
export const manualrecordApi = playload => {
  const params = {
    url: 'video/v1/hardware/manualrecord',
    body: playload
  }
  return post(params)
}

// 事件记录
export const eventRecode = playload => {
  const params = {
    url: 'video/v1/hardware/eventrecord',
    body: playload
  }
  return post(params)
}

// 检查记录查询
export const getCheckRecode = () => {
  const params = {
    url: 'video/v1/hardware/checkrecord/items',
    query: ''
  }
  return get(params)
}

// 检查记录-删除(不处理检查项)
export const oneDelete = (id) => {
  const params = {
    url: `video/v1/hardware/checkrecord/item/${id}`,
    body: ''
  }
  return put(params)
}

// 检查记录-批量删除(不处理检查项)
export const batchDelete = (playload) => {
  const params = {
    url: 'video/v1/hardware/checkrecord/items',
    body: playload
  }
  return put(params)
}

// 检查类型16 检查项目17
export const getDictBasicInfo = (playload) => {
  const params = {
    url: 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: playload
  }
  return post(params)
}

// 抓图
export const screenShootApi = (playload) => {
  const params = {
    url: 'video/v1/hardware/screenshot',
    body: playload
  }
  return post(params)
}

// 检查记录-批量处理检查项
export const setCheckRecode = (playload) => {
  const params = {
    url: 'video/v1/hardware/checkrecords',
    body: playload
  }
  return post(params)
}

// 上墙
export const addToWall = (playload) => {
  const params = {
    url: 'tvwall/v1/wall/previewplay',
    body: playload
  }
  return post(params)
}

// 机构树搜索
export const searchTree = (playload) => {
  const params = {
    url: 'resource/v1/tree/mists/search',
    query: playload
  }
  return get(params)
}

// 日志记录
// 需要转发的接口
export const repostLog = (playload) => {
  const params = {
    url: 'resource/v1/video/proxy',
    body: playload
  }
  return post(params)
}

// 记录日志不用转发的
export const noRepostlog = (playload) => {
  const params = {
    url: 'resource/v1/video/operationlog',
    body: playload
  }
  return post(params)
}
