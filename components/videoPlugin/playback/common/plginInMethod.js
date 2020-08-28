// import axios from 'axios'
import Vue from 'vue'
import { RECORD_QUERY, GB_RECORD_OPEN, GB_NVR_RECORD_OPEN, NVR_RECORD_OPEN } from './requestFunction'
/**
 * @description: 插件回放开流
 * @param {type}
 * @return:
 * @author: dfk
 */
export const pluginPlayBackOpen = async(pluginDom, data, type = 'frontEnd', isNewTime = false) => {
  console.log(data, type, isNewTime, 'datadata')
  let param = {}
  let newSTime = isNewTime ? data.newStartTime : data.startTime
  if (!data.devType) {
    data.devType = getDevType(data)
  }
  let objOpen // 请求是数据
  let resOpen // 请求接口返回的数据
  // 中心回放
  if (data.devType === 3) { // 中心-非国标回放录像开流
    objOpen = {
      devIp: data.devIp,
      devPort: data.devPort,
      channel: +data.channel,
      eventType: data.recordType || 'all',
      typeName: data.typeName || '', // ?
      typeContent: data.typeContent || '', // ?
      startTime: data.startTime,
      endTime: data.endTime,
      streamType: data.streamType ? 'main' : 'sub'
    }
    try {
      resOpen = await RECORD_QUERY(objOpen) // 中心-非国标回放录像开流
    } catch (error) {
      return {}
    }
    let getD = resOpen.data
    console.log(getD, '中心非国标回放查询结果')
    let cmd = {
      startTime: newSTime,
      endTime: data.endTime,
      channel: data.channel,
      ip: data.devIp,
      port: data.devPort,
      streamType: data.streamType
    }
    param = JSON.stringify({
      ip: getD.dsIp,
      port: getD.dsPort + '',
      beginTime: newSTime + '',
      endTime: data.endTime + '',
      cmdStr: JSON.stringify(cmd)
    })
  } else if (data.devType === 4) { // 中心-国标
    objOpen = {
      gbPlaDevIp: data.devIp,
      gbPlaDevPort: data.devCport,
      gbPlatformID: data.gbPlaNvrId,
      gbDeviceID: data.gbDevId,
      startTime: newSTime,
      endTime: data.endTime,
      streamType: data.streamType
      // downLoad: 'Download', // 下载的时候再带这给参数
      // Internet: 'WAN'
    }
    if (type === 'download') {
      objOpen.downLoad = 'Download'
    }
    try {
      resOpen = await GB_RECORD_OPEN(objOpen) // 中心-国标回放录像开流
    } catch (error) {
      return {}
    }
    let getD = resOpen.data
    console.log(getD, '中心回放查询结果')
    const pluginParam = JSON.stringify({
      streamType: data.streamType,
      vendor: 'bstar',
      session: '11',
      ip: data.ip,
      channel: data.channel,
      port: data.devDport,
      streamId: getD.streamId
    })
    param = JSON.stringify({
      port: getD.TsPort + '',
      ip: getD.TsIp,
      beginTime: newSTime + '',
      endTime: data.endTime + '',
      cmdStr: pluginParam
    })
  } else if (data.devType === 2) { // 前端-国标
    objOpen = {
      gbDevIp: data.devIp,
      gbDevPort: data.devCport,
      gbPlatformID: data.gbPlaNvrId,
      gbDeviceID: data.gbDevId,
      startTime: newSTime,
      endTime: data.endTime,
      streamType: data.streamType,
      downLoad: 'OpenPlayBack' // 下载时为 'FrontDownload'
      // Internet: 'WAN'
    }
    if (type === 'download') {
      objOpen.downLoad = 'FrontDownload'
    }
    try {
      resOpen = await GB_NVR_RECORD_OPEN(objOpen) // 前端-国标回放录像开流
    } catch (error) {
      return {}
    }
    let getD = resOpen.data
    // var getD = resOpen
    console.log(getD, '前端国标回放查询结果')
    const pluginParam = JSON.stringify({
      streamType: data.streamType, // 兼容前端设备回放 同步
      vendor: 'bstar',
      session: '11',
      ip: data.ip,
      channel: data.channel,
      port: data.devDport,
      streamId: getD.streamId
    })
    param = JSON.stringify({
      port: getD.TsPort + '',
      ip: getD.TsIp,
      beginTime: newSTime + '',
      endTime: data.endTime + '',
      cmdStr: pluginParam
    })
  } else { // 前端-非国标
    objOpen = {
      channel: data.channel,
      devIp: data.devIp,
      devPort: data.devPort,
      endTime: data.endTime,
      startTime: newSTime,
      streamConnPort: data.cPort,
      streamType: data.streamType || 0
    }
    try {
      resOpen = await NVR_RECORD_OPEN(objOpen) // 前端回放录像查询
    } catch (error) {
      return {}
    }
    let getD = resOpen.data
    // var getD = resOpen
    console.log(getD, '前端回放查询结果')
    const pluginParam = JSON.stringify({
      streamType: data.streamType, // 兼容前端设备回放 同步
      vendor: 'bstar',
      session: '11',
      ip: data.ip,
      channel: data.channel,
      port: data.devDport,
      streamId: getD.streamId
    })
    param = JSON.stringify({
      port: getD.TsPort + '',
      ip: getD.TsIp,
      beginTime: newSTime + '',
      endTime: data.endTime + '',
      cmdStr: pluginParam
    })
  }
  console.log(pluginDom, param, '++++++++++++++++++++++++++')
  if (type === 'download') {
    return param
  } else {
    return pluginDom.OpenRecordPlayerEx(param)
  }
}

export const getDevType = data => {
  /**
   * sipCode: '34232545', //判断是否是国标
   * deviceType: int, //设备类型1-NVR;2-HDVR;3-DVR;4-IPC;5-VNVR。（4和5走中心回放）
   * @return: 1-前端非国标；2-前端国标；3-中心非国标；4-中心国标
   */
  if (data.sipCode) {
    if (data.deviceType > 3) {
      return 4
    } else {
      return 2
    }
  } else {
    if (data.deviceType > 3) {
      return 3
    } else {
      return 1
    }
  }
}

/**
 * @description: 下载
 * record：{
 *  channelName: '通道名称',
 *  fileType: '文件类型',
 *  startTime: '开始时间，格式：YYYY-MM-DD HH:mm:ss'
 *  endTime: '结束时间，格式：YYYY-MM-DD HH:mm:ss',
 *  fileSize: '文件大小'
 *  result：{}通道信息
 * }
 * time：时间戳
 * path：下载路径
 * @return:
 * @author: dfk
 */
var downLSData = JSON.parse(window.localStorage.getItem('downListDataArr')) || []
export const newDownloadDev = async(record, time, path) => {
  downLSData = JSON.parse(window.localStorage.getItem('downListDataArr')) || []
  console.log(record, 'record')
  let getLocalConf = JSON.parse(window.localStorage.getItem('confParam')) // 获取localStorage中的参数
  let dVType = getLocalConf ? getLocalConf.download : 2 // 录像下载格式
  let format = dVType === 2 ? '.avi' : '.bsr'
  // let format = '.avi'
  let seTime =
        record.startTime && record.endTime
          ? '(' +
        Vue.moment(record.startTime).format('YYYYMMDDHHmmss') +
        '-' +
        Vue.moment(record.endTime).format('YYYYMMDDHHmmss') +
        ')'
          : '_'

  const fileName = path + '\\' + record.fileName + seTime + time + format
  let reParam = {
    ...record.result,
    startTime: parseInt(new Date(record.startTime).getTime() / 1000),
    endTime: parseInt(new Date(record.endTime).getTime() / 1000)
  }
  let param
  param = await pluginPlayBackOpen('', reParam, 'download')
  let ppm = JSON.parse(param)
  ppm.fileName = fileName
  let jParam = JSON.stringify(ppm)
  console.log(ppm, 'paramparamparamparamparamparamparamparam')
  recordDump(jParam).then(dump => {
    console.log('==我的record==')
    console.log(record)
    const item = {
      result: record.result,
      fileName: record.fileName,
      startTime: record.startTime,
      endTime: record.endTime,
      fileSize: record.fileSize,
      fileType: record.fileType,
      downStatus: '--',
      state: '',
      dumpHandle: dump.DumpHandle,
      path: record.path,
      channelName: record.fileName
    }

    item.__id = new Date().getTime()
    if (dump.success) {
      item.state = '下载中'
    } else {
      item.state = '下载失败'
    }
    console.log(item, 'ioioiioioioi')
    downLSData.push(item)
    window.localStorage.setItem('downListDataArr', JSON.stringify(downLSData))
  })
  return downLSData
}

// 获取插件的下载的开始和关闭的时间
export const recordDump = async(data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  // OpenRecordDump VMR 录像下载
  const gpPlugin = document.getElementById('global-plugin')
  const dump = JSON.parse(gpPlugin.OpenRecordDump(data))
  console.log(dump, 'dumpdumpdumpdumpdump')
  let cback = function(index, DumpHandle, cc) {
    console.log('DumpHandle2222222++++++++++++++++++++', DumpHandle, cc)
    gpPlugin.CloseRecordDump(DumpHandle)
    let downStatus
    if (cc === 33) {
      downStatus = '100%'
    } else {
      downStatus = '--'
    }
    let params = {
      dumpHandle: Number(DumpHandle),
      downStatus: downStatus
    }
    updateDownLSData(params)
  }
  if (dump.success) {
    gpPlugin.SetRecordDumpNotifyCallback(dump.DumpHandle, cback)
  }
  return dump
}

export const updateDownLSData = (params) => { // 按照下载句柄更新下载状态
  downLSData = JSON.parse(window.localStorage.getItem('downListDataArr')) || []
  downLSData.forEach(item => {
    if (Number(item.dumpHandle) === params.dumpHandle) {
      item.downStatus = params.downStatus
      if (params.downStatus === '100%') {
        item.state = '下载完成'
      } else if (params.downStatus === '--') {
        item.state = '下载失败'
      }
    }
  })
  window.localStorage.setItem('downListDataArr', JSON.stringify(downLSData))
}

export const getCompleteData = (params) => { // 获取下载完成的__id
  let cArr = []
  downLSData.forEach(item => {
    if (item.state === '下载完成') {
      cArr.push(item.__id)
    }
  })
  return cArr
}
