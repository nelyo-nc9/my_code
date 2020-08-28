import {
  post,
  put,
  get,
  remove
} from '../base'
// 获取字典数据dictionaries_data
export const getdictionariesdataApi = payload => {
  let params = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
    body: payload
  }
  return post(params)
}
// 获取接入服务器
export const getserviceApi = playload => {
  const params = {
    url: '/service/list?servername=DA',
    query: playload
  }
  return get(params)
}
// 获取机构树
export const getTreeApi = playload => {
  const params = {
    url: '/resource/v1/tree/orgResourceTree',
    query: playload
  }
  return get(params)
}
// 机构树搜索(机构-重点部位-设备-通道)
export const searchTreeApi = (playload) => {
  const params = {
    url: 'resource/v1/tree/mists/search',
    query: playload
  }
  return get(params)
}
// 机构树搜索(机构-重点部位-电视墙)
export const searchTreeToWallApi = (playload) => {
  const params = {
    url: '/tvwall/v1/manage/wall/likesearch',
    query: playload
  }
  return get(params)
}
// 机构树搜索(机构-重点部位)
export const searchTreeApi2 = (playload) => {
  const params = {
    url: '/resource/v1/tree/org/keypart/search',
    query: playload
  }
  return get(params)
}
// 获取收藏夹
export const getfavoritesApi = playload => {
  const params = {
    url: '/video/v1/favorites',
    query: playload
  }
  return get(params)
}
// 获取电视墙窗口信息(轮巡/预案)
export const TvWallWindowStatusApi = payload => {
  let params = {
    url: '/tvwall/v1/polling/status',
    body: payload
  }
  return post(params)
}
// 刷新电视墙
export const refreshTvWallApi = payload => {
  let params = {
    url: '/tvwall/v1/wall/syncstatus',
    body: payload
  }
  return post(params)
}
// 分区列表
export const getLedTreeApi = playload => {
  let params = {
    url: '/resource/v1/tree/orgResLazyTree?subSystem=8',
    query: playload
  }
  return get(params)
}

// 获取电视墙机构树
export const getTvWallTreeApi = playload => {
  const params = {
    url: '/tvwall/v1/manage/wall/tree',
    query: playload
  }
  return get(params)
}
// -----------------------  通用的一系列接口 ----------
// 获取当前窗口的播放状态信息
export const getcurstatusApi = payload => {
  let params = {
    url: '/tvwall/v1/wall/wnd/curstatus',
    body: payload
  }
  return post(params)
}
// 解除设备与电视墙的绑定关系
export const relievedeviceApi = payload => {
  let params = {
    url: '/tvwall/v1/manage/wall/relievedevice',
    body: payload
  }
  return post(params)
}
// 显示/隐藏编号(b20)
export const showOrcloseNumberApi = payload => {
  let params = {
    url: '/tvwall/v1/wall/setosd',
    body: payload
  }
  return post(params)
}
// 显示/隐藏编号(M3)
export const showOrcloseNumberM3Api = payload => {
  let params = {
    url: '/tvwall/v1/wall/cmdctlwnddecoder',
    body: payload
  }
  return post(params)
}
// 新建分区
export const createPartmanageApi = payload => {
  let params = {
    url: '/tvwall/v1/partmanage',
    body: payload
  }
  return post(params)
}
// 修改分区
export const chanegePartmanageApi = payload => {
  let param = {
    url: '/tvwall/v1/partmanage',
    body: payload
  }
  return put(param)
}
// 删除分区
export const deletePartmanageApi = playload => {
  let params = {
    url: '/tvwall/v1/partmanage'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 获取某电视墙下的分区
export const getPartmanageListApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/partmanage',
    query: playload
  }
  return get(params)
}
// 获取分区管理的窗口权限配置
export const getPartmanagerelationApi = playload => {
  const params = {
    url: '/tvwall/v1/partmanage/relation',
    query: playload
  }
  return get(params)
}
// 设置/取消为报警屏幕
export const SetAlarmApi = payload => {
  let params = {
    url: '/tvwall/v1/wall/setalarm',
    body: payload
  }
  return post(params)
}
// 打开音频(b20)
export const openaudioApi = payload => {
  let params = {
    url: '/tvwall/v1/wall/openaudio',
    body: payload
  }
  return post(params)
}
// --------------------电视墙管理------------------------------------------
// 获取电视墙列表查询
export const getTvWallListApi = playload => {
  const params = {
    url: '/tvwall/v1/manage/wall/list',
    query: playload
  }
  return get(params)
}
// 电视墙列表导出
export const exportTvWallApi = payload => {
  let params = {
    url: '/tvwall/v1/manage/wall/export',
    body: payload
  }
  return post(params)
}
// 添加电视墙
export const addTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall',
    body: playload
  }
  return post(params)
}
// 删除电视墙
export const deleteTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改电视墙信息
export const chanegeTvWallApi = payload => {
  let param = {
    url: '/tvwall/v1/manage/wall',
    body: payload
  }
  return put(param)
}
// 电视墙的迁移
export const removalTvWallApi = payload => {
  let param = {
    url: '/tvwall/v1/manage/wall/migration',
    body: payload
  }
  return put(param)
}
// 电视墙列表排序
export const sortTvWallListApi = payload => {
  let param = {
    url: '/tvwall/v1/manage/wall/sequence',
    body: payload
  }
  return post(param)
}
// 电视墙应用布局执行接口
export const execLayoutApi = payload => {
  let param = {
    url: '/tvwall/v1/layout/exec',
    body: payload
  }
  return post(param)
}
// 获取电视墙轮询列表数据
export const getPollingListApi = payload => {
  let param = {
    // url: `/tvwall/v1/wall/${payload}/polling`,
    url: '/tvwall/v1/wall/polling',
    query: payload
  }
  return get(param)
}
// 电视墙配置创建轮询
export const createdPollingApi = payload => {
  let param = {
    url: '/tvwall/v1/polling',
    body: payload
  }
  return post(param)
}
// 电视墙配置修改轮询
export const modifPollingApi = payload => {
  let param = {
    url: '/tvwall/v1/polling',
    body: payload
  }
  return put(param)
}
// 电视墙配置删除轮询
export const deletePollingApi = payload => {
  let param = {
    url: '/tvwall/v1/polling'
  }
  const config = {
    data: payload
  }
  return remove(param, config)
}
// 电视墙应用执行轮巡(b20)
export const executePollingApi = payload => {
  let param = {
    url: '/tvwall/v1/polling/exec',
    body: payload
  }
  return post(param)
}
// 电视墙应用执行轮巡(m3)
export const executePollingM3Api = payload => {
  let param = {
    url: '/tvwall/v1/polling/execdecoder',
    body: payload
  }
  return post(param)
}
// 电视墙应用执行轮巡(解码器+拼控)
export const executePollingM3AndB20Api = payload => {
  let param = {
    url: '/tvwall/v1/polling/execjoint',
    body: payload
  }
  return post(param)
}
// ---------------------解码器的一系列接口------------------------
// 获取解码器设备列表/LED信息
export const getDecodingDeviceApi = playload => {
  const params = {
    url: '/resource/v1/tvwall/host',
    query: playload
  }
  return get(params)
}
// 添加解码设备/LED信息
export const addDecodingDeviceApi = playload => {
  let params = {
    url: '/resource/v1/tvwall/resource',
    body: playload
  }
  return post(params)
}
// 删除解码设备/LED信息
export const deleteDecodingDeviceApi = playload => {
  let params = {
    url: '/resource/v1/tvwall/host'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改解码设备/LED信息
export const changeDecodingDeviceApi = payload => {
  let param = {
    url: '/resource/v1/tvwall/resource',
    body: payload
  }
  return put(param)
}
// 获取指定解码器的相关信息/LED信息
export const getOneDecodingDeviceApi = playload => {
  const params = {
    url: '/resource/v1/tvwall/host/' + playload.id,
    query: playload
  }
  return get(params)
}
// 迁移解码设备/LED信息
export const removalDecodingDeviceApi = payload => {
  let param = {
    url: '/resource/v1/tvwall/host/transfer',
    body: payload
  }
  return put(param)
}
// 解码设备排序/LED信息
export const rankDecodingDeviceApi = payload => {
  let param = {
    url: '/resource/v1/tvwall/host/sequence',
    body: payload
  }
  return put(param)
}
// 下载解码器设备查询列表/LED信息
export const getqueryDecodingDeviceApi = playload => {
  const params = {
    url: '/resource/v1/tvwall/host/download',
    query: playload
  }
  return get(params)
}
// 根据解码器设备的id获取当前设备的本地终端输入列表/LED信息
export const getDecodingLocalCannalListApi = playload => {
  const params = {
    url: '/resource/v1/tvwall/channel',
    query: playload
  }
  return get(params)
}
// 创建本地终端输入信息/LED信息
export const creatDecodingLocalCannalApi = playload => {
  let params = {
    url: '/resource/v1/tvwall/channel',
    body: playload
  }
  return post(params)
}
// 获取本地终端输入通道(设备本身的通道，真实通道)
export const getDecodingLocalCannalApi = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall/tim',
    body: playload
  }
  return post(params)
}
// 获取输出通道(b20)
export const geOutCannalB20Api = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall/jointchan',
    body: playload
  }
  return post(params)
}
// 获取输出通道(m3)
export const getOutCannalM3Api = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall/decoderchan',
    body: playload
  }
  return post(params)
}
// 删除本地终端输入信息/LED信息
export const deleteDecodingLocalCannalApi = playload => {
  let params = {
    url: '/resource/v1/tvwall/channel'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改本地终端输入信息/LED信息
export const changeDecodingLocalCannalApi = payload => {
  let param = {
    url: '/resource/v1/tvwall/channel',
    body: payload
  }
  return put(param)
}
// 设备排序
export const DecodingSortApi = payload => {
  let param = {
    url: '/resource/v1/tvwall/host/sequence',
    body: payload
  }
  return put(param)
}
// 解码器设备配置中获取设备信息
export const obtainApi = playload => {
  let params = {
    url: '/tvwall/v1/manage/wall/obtain',
    body: playload
  }
  return post(params)
}
// ------------------------------------电视墙配置-------------------------------------------------------
// 获取电视墙menu列表
export const getTvWallMenuListApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/conf',
    query: playload
  }
  return get(params)
}
// 创建电视墙底板
export const createdTvWallFloorApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/layoutvirtual',
    body: playload
  }
  return post(params)
}
// 删除电视墙底板
export const deleteTvWallFloorApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/layoutvirtual'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 电视墙窗口关闭(点击X删除)
export const deletewndApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/deletewnd'
  }
  const config = {
    data: playload
  }
  return remove(params, config)
}
// 电视墙开窗操作
export const openWindowTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/createwnd',
    body: playload
  }
  return post(params)
}
// 资源上墙
export const resourcesToTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/open',
    body: playload
  }
  return post(params)
}
// 本地终端输入上墙
export const resourcesToTvWallLocalApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/tim/open',
    body: playload
  }
  return post(params)
}
// 资源下墙
export const closeresourcesToTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/close',
    body: playload
  }
  return post(params)
}
// 本地终端输入资源下墙(停止解码)
export const closeresourcesToTvWallLocalApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/tim/close',
    body: playload
  }
  return post(params)
}
// 拼控电视墙窗口分割合并
export const TvWallsetwndApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/setwnd',
    body: playload
  }
  return post(params)
}
// 已开窗状态的窗口分割
export const divisionTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/splitwnd',
    body: playload
  }
  return post(params)
}
// 获取总解码窗口与已经解码窗口的数量(解码总资源，已使用，未使用)
export const getWindowCountApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/openwnd/count',
    query: playload
  }
  return get(params)
}
// 电视墙的拼接(b20)
export const mergewndTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/mergewnd',
    body: playload
  }
  return post(params)
}
// 电视墙的拆分(b20)
export const splitwndTvWallApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/splitwnd',
    body: playload
  }
  return post(params)
}
// ------------------布局——————————————————————————————
// 获取某一电视墙下所有布局列表列表
export const getTvWallLayoutListApi = playload => {
  const params = {
    // url: `/tvwall/v1/wall/${playload.wallId}/layout`,
    url: '/tvwall/v1/wall/layout',
    query: playload
  }
  return get(params)
}
// 创建布局
export const createdTvWallLayoutApi = playload => {
  let params = {
    url: '/tvwall/v1/layout',
    body: playload
  }
  return post(params)
}
// 删除布局
export const deleteTvWallLayoutApi = playload => {
  let params = {
    url: '/tvwall/v1/layout'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改布局名称
export const changeTvWallLayoutApi = payload => {
  let param = {
    url: '/tvwall/v1/layout',
    body: payload
  }
  return put(param)
}
// -------------------场景-----------------------------------------
// 新建场景
export const createdTvWallSceneApi = playload => {
  let params = {
    url: '/tvwall/v1/scene',
    body: playload
  }
  return post(params)
}
// 删除场景
export const deleteTvWallSceneApi = playload => {
  let params = {
    url: '/tvwall/v1/scene'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改场景
export const changeTvWallSceneApi = payload => {
  let param = {
    url: '/tvwall/v1/scene',
    body: payload
  }
  return put(param)
}
// 获取场景列表
export const getTvWallSceneListApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/scene',
    query: playload
  }
  return get(params)
}
// 执行场景
export const executeSceneApi = payload => {
  let param = {
    url: '/tvwall/v1/scene/exec',
    body: payload
  }
  return post(param)
}
// -----------------------------预案-----------------------------------
// 新增预案
export const createdTvWallPlanApi = playload => {
  let params = {
    url: '/tvwall/v1/plan',
    body: playload
  }
  return post(params)
}
// 删除预案
export const deleteTvWallPlanApi = playload => {
  let params = {
    url: '/tvwall/v1/plan'
  }
  const config = {
    // 确定是data是params
    data: playload
  }
  return remove(params, config)
}
// 修改预案
export const changeTvWallPlanApi = payload => {
  let param = {
    url: '/tvwall/v1/plan',
    body: payload
  }
  return put(param)
}
// 获取预案列表
export const getTvWallPlanListApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/plan',
    query: playload
  }
  return get(params)
}
// 执行预案
export const executePlanApi = payload => {
  let param = {
    url: '/tvwall/v1/plan/exec',
    body: payload
  }
  return post(param)
}
/**
 *
 * 普通电视墙相关接口
 * 解码器的一系列接口
 *
 * */
// 获取电视墙下的所有解码器通道
export const getTvWallChannlListApi = playload => {
  const params = {
    url: '/tvwall/v1/wall/decoder/channel',
    query: playload
  }
  return get(params)
}
// 设置解码器通道和窗口的绑定关系
export const channlAndwindowApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/decoder/setmonitor',
    body: playload
  }
  return post(params)
}
// 解码器解码上流
export const opendecoderApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/opendecoder',
    body: playload
  }
  return post(params)
}
// 解码器停止解码
export const closeopendecoderApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/closedecoder',
    body: playload
  }
  return post(params)
}
// M3窗口的分割
export const m3divisionApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/decoder/setwnd',
    body: playload
  }
  return post(params)
}
/**
 *
 * M3+B20
 * 解码器+拼控的一系列接口
 *
 * */
// 获取电视墙下的所有解码器通道(解码器+拼控)
export const getChannlListM3AndB20Api = playload => {
  const params = {
    url: '/tvwall/v1/wall/joint/channel',
    query: playload
  }
  return get(params)
}
// 设置解码器通道和窗口的绑定关系(解码器+拼控)
export const channlAndwindowM3AndB20Api = playload => {
  let params = {
    url: '/tvwall/v1/wall/joint/setmonitor',
    body: playload
  }
  return post(params)
}
// (解码器+拼控)窗口的分割
export const m3AndB20divisionApi = playload => {
  let params = {
    url: '/tvwall/v1/wall/setjointwnd',
    body: playload
  }
  return post(params)
}
// 解码上流(解码器+拼控)
export const opendecoderM3AndB20Api = playload => {
  let params = {
    url: '/tvwall/v1/wall/openjoint',
    body: playload
  }
  return post(params)
}
// 停止解码(解码器+拼控)
export const closeopendecoderM3AndB20Api = playload => {
  let params = {
    url: '/tvwall/v1/wall/stopjoint',
    body: playload
  }
  return post(params)
}
/**
 *
 * 日志查询
 *
 * */
export const getTvWallLogApi = playload => {
  const params = {
    url: '/tvwall/v1/logging/log',
    query: playload
  }
  return get(params)
}
