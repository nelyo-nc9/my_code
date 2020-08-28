import { post, put, get, remove } from '../base'
/**
 * 新增广播喊话api
 * @param {*} payload 新增广播喊话入参
 */

// 音频机构树
export const getAudiotreeApi = payload => {
  //console.log(payload,'123456')
  const param = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=3',
    query: payload
  }
  return get(param)
}
export const postAudiouploadApi = payload => {
  //console.log(payload,'123456')
  const param = {
    url: '/audio/v1/service/upload',
    body: payload
  }
  return post(param)
}
//创建分组（广播/对讲)
export const postCreategroupApi = payload => {
  const param = {
    url: '/audio/v1/broadcast',
    body: payload
  }
  return post(param)
}
//广播/对讲分组列表
export const getAudiougrouplistApi = payload => {
  const param = {
    url: '/audio/v1/broadcast',
    query: payload
  }
  return get(param)
}
//删除分组（广播/语音）
export const removeAudiougrouplistApi = payload => {
  const param = {
    url: '/audio/v1/broadcast',
    body: payload
  }
  return remove(param, { data: payload })
}
//删除设备和添加设备
export const putAddequipmentApi = payload => {
  const param = {
    url: '/audio/v1/broadcast/setdevice',
    body: payload
  }
  return put(param)
}
//（添加/删除）广播录音文件
export const postRadiofileApi = payload => {
  const param = {
    url: '/audio/v1/broadcast/setbroadfile',
    body: payload
  }
  return put(param)
}

//开启广播录音文件
export const postOpenradiofileApi = payload => {
  const param = {
    url: '/audio/v1/service/openfilebc',
    body: payload
  }
  return post(param)
}
//关闭广播录音文件
export const postDownradiofileApi = payload => {
  const param = {
    url: '/audio/v1/service/closefilebc',
    body: payload
  }
  return post(param)
}

//开启语音广播
export const postOpenradioApi = payload => {
  const param = {
    url: '/audio/v1/service/broadcall',
    body: payload
  }
  return post(param)
}
//关闭语音广播
export const postDwonradioApi = payload => {
  const param = {
    url: '/audio/v1/service/closebroadcall',
    body: payload
  }
  return post(param)
}
//获取分组
export const getGroupListApi = payload => {
  const param = {
    url: '/audio/v1/broadcast',
    query: payload
  }
  return get(param)
}
//查看设备状态
export const getStateApi = payload => {
  const param = {
    url: '/audio/v1/service/getstatue',
    query: payload
  }
  return get(param)
}
//根据MAC地址获取台麦主机及平台信息
export const postMacGetApi = payload => {
  const param = {
    url: '/resource/v1/audio/host/mac/relation-platform',
    body: payload
  }
  return post(param)
}
