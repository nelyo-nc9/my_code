import axios from 'axios'
import moment from 'moment'
var downListData = JSON.parse(window.localStorage.getItem('downListDataArr')) || []
// 过滤中心数据
export const videoFilter = (result, data) => {
  try {
    if (!result.eventList.length) {
      return { eventList: [] }
    }
  } catch (err) {
    return { eventList: [] }
  }

  // 去掉广播对讲开始时间与结束时间相同的录像段
  result.eventList = result.eventList.filter(item => {
    return item.evtTblInfo.startTime !== item.evtTblInfo.endTime
  })
  // 录像段排序
  function compare() { // 这是比较函数
    return function(m, n) {
      var a = m.evtTblInfo.startTime
      var b = n.evtTblInfo.startTime
      return a - b // 升序
    }
  }
  result.eventList.sort(compare())

  if ((data.videoSegmentsIndex !== undefined) && result.eventList.length !== 0) {
    // 对讲只播放某段录像， videoSegmentsIndex 为对应录像段索引
    result.eventList = data.videoSegmentsIndex <= result.eventList.length ? [JSON.parse(JSON.stringify(result.eventList[data.videoSegmentsIndex]))] : []
  }

  // 默认返回录像段数组 是按时间顺序排列
  let startTime = data.startTime
  let endTime = data.endTime
  let eventList = []
  let backList = JSON.parse(JSON.stringify(result))
  try {
    for (const iterator of result.eventList) {
      // 过滤录像段 没在起始时间范围去掉
      if (iterator.evtTblInfo.endTime < startTime || iterator.evtTblInfo.startTime > endTime) { continue }
      eventList.push(JSON.parse(JSON.stringify(iterator)))
    }
    // 将录像段的起止时间改为查询的起止时间， 若第一个录像段开始时间大于查询开始时间则不修改； 若最后一个录像段的结束时间小于查询的结束时间则不修改
    if (eventList[0].evtTblInfo.startTime < startTime) {
      eventList[0].evtTblInfo.startTime = startTime
    }
    if (eventList[eventList.length - 1].evtTblInfo.endTime > endTime) {
      eventList[eventList.length - 1].evtTblInfo.endTime = endTime
    }
    backList.startTime = eventList[0].evtTblInfo.startTime
    backList.endTime = eventList[eventList.length - 1].evtTblInfo.endTime
  } catch (err) {
    console.log(err, '录像段过滤错误')
    eventList = []
  }
  backList.eventList = eventList
  return backList
}
export const videoFilterOK = (result, data) => {
  try {
    if (!result.eventList.length) {
      return { eventList: [] }
    }
  } catch (err) {
    return { eventList: [] }
  }

  // 去掉广播对讲开始时间与结束时间相同的录像段
  result.eventList = result.eventList.filter(item => {
    return item.startTime !== item.endTime
  })
  // 录像段排序
  function compare() { // 这是比较函数
    return function(m, n) {
      var a = m.startTime
      var b = n.startTime
      return a - b // 升序
    }
  }
  result.eventList.sort(compare())

  if ((data.videoSegmentsIndex !== undefined) && result.eventList.length !== 0) {
    // 对讲只播放某段录像， videoSegmentsIndex 为对应录像段索引
    result.eventList = data.videoSegmentsIndex <= result.eventList.length ? [JSON.parse(JSON.stringify(result.eventList[data.videoSegmentsIndex]))] : []
  }

  // 默认返回录像段数组 是按时间顺序排列
  let startTime = data.startTime
  let endTime = data.endTime
  let eventList = []
  let backList = JSON.parse(JSON.stringify(result))
  try {
    for (const iterator of result.eventList) {
      // 过滤录像段 没在起始时间范围去掉
      if (iterator.endTime < startTime || iterator.startTime > endTime) { continue }
      eventList.push(JSON.parse(JSON.stringify(iterator)))
    }
    // 将录像段的起止时间改为查询的起止时间， 若第一个录像段开始时间大于查询开始时间则不修改； 若最后一个录像段的结束时间小于查询的结束时间则不修改
    if (eventList[0].startTime < startTime) {
      eventList[0].startTime = startTime
    }
    if (eventList[eventList.length - 1].endTime > endTime) {
      eventList[eventList.length - 1].endTime = endTime
    }
    backList.startTime = eventList[0].startTime
    backList.endTime = eventList[eventList.length - 1].endTime
  } catch (err) {
    console.log(err, '录像段过滤错误')
    eventList = []
  }
  backList.eventList = eventList
  return backList
}
// 中心获取数据列表
export const checkVideoList = async(data) => {
  let obj = {
    devIp: data.devIp,
    devPort: data.devPort,
    channel: data.channel,
    eventType: data.eventType || ['all'],
    typeName: data.typeName || '',
    typeContent: data.typeContent || '',
    startTime: parseInt(data.startTime),
    endTime: parseInt(data.endTime),
    streamType: data.streamType || 'main',
    page: data.page || 1,
    rows: data.rows || 1000
  }
  let res
  try {
    res = await axios.post('record/query', obj) // 中心回放录像查询
  } catch (error) {
    return {}
  }
  return res
}
export const newOpenBack = async(data) => {
  if (data.flag == 'vm') {
    let res = {}
    let param = {}
    res = await checkVideoList(data)
    if (typeof res.data !== 'object') {
      return [{ msg: '查询无录像！' }]
    }
    res = videoFilter(res.data.result || res.data, data)
    if (!res.eventList.length) {
      return [{ msg: '查询无录像！' }]
    }
    let startTime = res.eventList[0].startTime
    let endTime = res.eventList[res.eventList.length - 1].endTime
    param = {
      'startTime': startTime, // 开始时间
      'endTime': endTime, // 结束时间
      'channel': data.channel, // 通道,数字类型
      'ip': res.dsIp,
      'port': 9000 + '', // 端口
      'streamType': data.streamType // 流类型
    }
    return {
      res,
      param
    }
  } else {
    // 取FileList
    // data.fileList
    return {
      fileUrl: data.fileList
    }
  }
}
// 开流
export const openPlaybackList = async(pluginDom, data, isQuery, isTime = false) => {
  console.log(data, 'datadatadata')
  let obj = {}
  let cmd = {}
  let res = {}
  let param = {}
  if (data.isCenter) {
    // 中心回放
    // isQuery 是否需要查询路线段
    res = data // 不查询直接传插件参数
    if (isQuery) {
      res = await checkVideoList(data)
      if (typeof res.data !== 'object') {
        return [{ msg: '查询无录像！' }]
      }
      res = videoFilter(res.data.result || res.data, data)
      if (!res.eventList.length) {
        return [{ msg: '查询无录像！' }]
      }
    }
    let startTime = isQuery ? isTime ? data.time : res.eventList[0].evtTblInfo.startTime : data.newStartTime
    // 结束时间为录像查询的最后时间  videoFilter 方法中已将录像段的最后结束时间转成查询时间 若录像段结束时间小于查询时间 就以录像段结束时间为准
    let endTime = isQuery ? res.eventList[res.eventList.length - 1].evtTblInfo.endTime : data.eventList[data.eventList.length - 1].evtTblInfo.endTime
    let strmInfo = {}
    if (isQuery) {
      strmInfo = res.eventList[0].strmInfo
    } else {
      for (const iterator of data.eventList) {
        if (iterator.evtTblInfo.startTime < data.newStartTime < iterator.evtTblInfo.endTime) {
          strmInfo = iterator.strmInfo
        }
      }
      if (Object.keys(strmInfo).length === 0) {
        // 录像跳转  没有匹配的 录像段
        return { msg: '无可用录像段！' }
      }
    }
    obj = {
      eventList: {
        timeInfo: {
          startTime: startTime,
          endTime: endTime
        },
        strmInfo: strmInfo
      }
    }
    cmd = {
      params: {
        jsonrpc: '2.0',
        id: '1',
        method: 'brest',
        call: 'AV.Record.playopen',
        args: obj
      }
    }
    param = JSON.stringify({
      ip: isQuery ? res.dsIp : data.dsIp,
      port: 9000 + '',
      beginTime: startTime + '',
      endTime: endTime + '',
      cmdStr: JSON.stringify(cmd)
    })
    res = Object.assign(data, res)
  } else {
    let startTime = isQuery ? data.sTime : data.newStartTime
    // 结束时间为录像查询的最后时间  videoFilter 方法中已将录像段的最后结束时间转成查询时间 若录像段结束时间小于查询时间 就以录像段结束时间为准
    // 开流接口
    let objOpen = {
      channel: data.channel,
      devIp: data.devIp,
      devPort: data.devPort,
      endTime: data.eTime,
      startTime: startTime,
      streamConnPort: data.dPort,
      streamType: data.streamType || 'main'
    }
    let resOpen
    try {
      resOpen = await axios.post('/record/frontdevPlayBack', objOpen) // qia回放录像查询
    } catch (error) {
      return {}
    }
    var getD = resOpen.data
    const pluginParam = JSON.stringify({
      streamType: data.streamType, // 兼容前端设备回放 同步
      vendor: 'bstar',
      session: '11',
      ip: data.devIp,
      channel: data.channel,
      port: data.devPort,
      streamId: getD.streamId
    })
    param = JSON.stringify({
      port: getD.TsPort + '',
      ip: getD.TsIp,
      beginTime: data.sTime + '',
      endTime: data.eTime + '',
      cmdStr: pluginParam
    })
    data.result = getD
    res = data
  }
  return [pluginDom.OpenRecordPlayerEx(param), res, isQuery]
}

// 获取前端回放数据列表
export const getQianDuanList = async(data) => {
  let res = data // 查询
  res = await queryQianduanList(data)
  return res.data
}
// 查询前端数据列表
export const queryQianduanList = async(data) => {
  let obj = {
    // recordType: data.eventType || ['all'],
    rowId: 1,
    rowCount: 50,
    sTime: data.sTime,
    eTime: data.eTime,
    streamType: data.streamType || 'main',
    channel: data.channel,
    devIp: data.devIp,
    devPort: data.devPort
  }
  let res
  console.log(JSON.stringify(obj))
  try {
    res = await axios.post('record/frontdevSearch', obj) // 前端回放录像查询
    if (res.data.recordList) {
      res.data.recordInfo = res.data.recordList.map(item => {
        let cpItem = JSON.parse(JSON.stringify(item))
        delete item.startTime
        delete item.endTime
        delete item.fileSize
        return {
          ...item,
          sTime: cpItem.startTime,
          eTime: cpItem.endTime,
          filesize: cpItem.fileSize,
          devIp: data.devIp,
          devPort: data.devPort
        }
      })
    }
  } catch (error) {
    return {}
  }
  return res
}

export const stopRecordPlay = async(pluginDom, isPlay) => {
  isPlay ? pluginDom.StartRecordPlay() : pluginDom.StopRecordPlay()
}
export const downloadVideoSegments = async(pluginDom, data, isQuery, callback) => {
  let res, startTime, endTime, strmInfo
  try {
    res = data
    if (isQuery) {
      res = await checkVideoList(data)
      if (res.data.result === undefined) {
        if (typeof res.data !== 'object' || res.data.eventList.length === 0) { return { success: false } }
        res = videoFilter(res.data, data)
      } else {
        if (typeof res.data !== 'object' || res.data.result.eventList.length === 0) { return { success: false } }
        res = videoFilter(res.data.result, data)
      }
      if (res.eventList.length === 0) { return { success: false } } // 没有录像段返回失败
      strmInfo = res.eventList[0].strmInfo
      startTime = res.eventList[0].evtTblInfo.startTime
      endTime = res.eventList[res.eventList.length - 1].evtTblInfo.endTime
    } else {
      strmInfo = data.eventList[0].strmInfo
      startTime = data.startTime
      endTime = data.endTime
    }
  } catch (err) {
    console.log(err)
  }
  let obj = {
    eventList: {
      timeInfo: {
        startTime: startTime,
        endTime: endTime
      },
      strmInfo: strmInfo
    }
  }
  const cmd = {
    params: {
      jsonrpc: '2.0',
      id: '1',
      method: 'brest',
      call: 'AV.Record.playopen',
      args: obj
    }
  }
  let param = {
    ip: isQuery ? res.dsIp : data.dsIp,
    port: 9000 + '',
    beginTime: startTime + '',
    fileName: data.fileName,
    endTime: endTime + '',
    cmdStr: JSON.stringify(cmd)
  }
  // return pluginDom.OpenRecordDump(JSON.stringify(param))
  const r = JSON.parse(pluginDom.OpenRecordDump(JSON.stringify(param)))
  if (r.success) {
    pluginDom.SetRecordDumpNotifyCallback(r.DumpHandle, (index, DumpHandle, status) => {
      // 插件下载完成回调 完成后关闭下载
      // closeDownload(pluginDom, DumpHandle)
      pluginDom.CloseRecordDump(DumpHandle)
      callback && callback(DumpHandle)
    })
  }
  return r
}
export const batchDownloadVideoSegments = async(data, parameters, path) => {
  let dom = document.querySelector('#global-plugin')
  let arr = []
  // 批量下载名称上拼接上index
  for (let index = 0; index < data.length; index++) {
    if (!data[index].fileName) {
      data[index].fileName = `${path || parameters.downloadVideoPath}\\${data[index].name}_${moment(new Date()).format('YYYYMMDDHHmmss')}_${index}.${parameters.downloadVideoType.toLowerCase()}`
    }
    arr.push(downloadVideoSegments(dom, data[index], true))
  }
  return Promise.all(arr)
}
// 设置回放速度
export const setRecordPlayerRate = (pluginDom, { nRate, nScale }) => {
  return pluginDom.SetRecordPlayerRate(nRate, nScale)
}
// 设置播放模式
export const setRecordPlayerMode = (pluginDom, nPlayMode) => {
  // [in] nPlayMode  播放模式  0:正常模式   1:逐帧模式   2 :I帧播放
  let status = pluginDom.SetRecordPlayerMode(nPlayMode)
  if (status === 0 && nPlayMode === 1) {
    // 逐帧的时候要开始播放
    pluginDom.StartRecordPlay()
  }
}

export const getPicture = (plugin, param) => {
  return plugin.GetPlayerPicture(param.path, param.type)
}
export const setScale = (p, mode) => {
  console.log(mode, 'mode')
  var w
  var h
  var auto
  if (mode == '原比例') {
    w = 1
    h = 1
    auto = true
  } else {
    w = 0
    h = 0
    auto = false
  }
  return p.SetPlayStretchBlt(w, h, auto)
}

export const openSound = (plugin) => {
  return plugin.OpenPlayerSound()
}
export const closeSound = (plugin) => {
  return plugin.StopPlayerSound()
}
export const setVolume = (plugin, vol) => {
  return plugin.SetPlayerVolume(vol)
}
export const getVolume = (plugin) => {
  let result = plugin.GetPlayerVolume()
  result = JSON.parse(result)
  return result
}

// 格式化byte
export const byteConversion = (b) => {
  const GB = 1024 * 1024 * 1024
  const MB = 1024 * 1024
  const KB = 1024
  if (b / GB >= 1) {
    return (b / GB).toFixed(2) + ' Gb'
  } else if (b / MB >= 1) {
    return (b / MB).toFixed(2) + ' Mb'
  } else if (b / KB >= 1) {
    return (b / KB).toFixed(2) + ' Kb'
  } else {
    return b + ' b'
  }
}

export const formatSpendTime = (start, end) => {
  let value = end - start
  if (!value) {
    value = 0
  }
  const seconds = value % 60
  value = parseInt(value / 60)
  const minutes = value % 60
  value = parseInt(value / 60)
  return [value, minutes, seconds].map((item, index) => {
    if (index) {
      return ('00' + item).slice(-2)
    } else {
      return item
    }
  }).filter(item => item).join(':')
}

// 格式化录像类型
export const formatRecordType = (type) => {
  if (type == 800 || type == 'timeVideo') {
    return '定时录像'
  } else if (type == 512) {
    return '手动录像'
  } else if (type == 'eventVideo') {
    return '事件录像'
  } else {
    return '智能录像'
  }
}

export const downloadDev = async(record, time) => {
  downListData = JSON.parse(window.localStorage.getItem('downListDataArr')) || []
  console.log(record, 'record')
  let deviceIp = ''
  // const format = this.parameters.downloadVideoType === 'BSR' ? '.bsr' : '.avi'
  const format = '.avi'
  let type = record.fileType
  let seTime =
        record.startTime && record.endTime
          ? '(' +
        moment(record.startTime).format('YYYYMMDDHHmmss') +
        '-' +
        moment(record.endTime).format('YYYYMMDDHHmmss') +
        ')'
          : '_'

  const fileName = 'D:\\BC8100\\Download' + '\\' + record.fileName + seTime + time + format
  let param, openParam, objOpen
  if (!record.isCenter) {
    // 前端需要查询
    objOpen = {
      channel: record.result.channel,
      devIp: record.result.devIp,
      devPort: record.result.devPort,
      endTime: record.result.eTime,
      startTime: record.result.sTime,
      streamConnPort: record.dPort,
      streamType: record.result.streamType
    }
    let resOpen
    try {
      resOpen = await axios.post('/record/frontdevPlayBack', objOpen) // qia回放录像查询
    } catch (error) {
      return {}
    }
    console.log(resOpen, 'resOpen')
    const info = record.result
    console.log(info, 'info')
    param = {
      ip: resOpen.data.TsIp,
      port: resOpen.data.TsPort + '',
      fileName,
      beginTime: info.sTime + '',
      endTime: info.eTime + '',
      cmdStr: JSON.stringify({
        streamType: info.streamType,
        vendor: 'bstar',
        session: '',
        ip: info.devIp,
        channel: info.channel,
        port: info.devPort + '',
        streamId: resOpen.data.streamId
      })
    }
  } else {
    // 中心录像
    const obj = {}
    obj.eventList = {}
    obj.eventList.timeInfo = {}
    obj.eventList.strmInfo = {}
    obj.eventList.timeInfo.startTime = record.startTime
    obj.eventList.timeInfo.endTime = record.endTime
    obj.eventList.strmInfo = record.result.eventList[0].strmInfo
    param = {
      ip: record.result.dsIp + '',
      port: record.result.dsPort + '',
      beginTime: record.startTime + '',
      endTime: record.endTime + '',
      fileName: fileName,
      cmdStr: JSON.stringify({
        params: {
          jsonrpc: '2.0',
          id: '1',
          method: 'brest',
          call: 'AV.Record.playopen',
          args: obj
        }
      })
    }
  }
  console.log(param, 'paramparamparamparamparamparamparamparam')
  recordDump(param).then(dump => {
    console.log(dump, 'dump', record)
    const item = {
      openParam: !record.isCenter ? objOpen : null, // 前端录像请求参数
      param: param,
      fileName: record.fileName,
      startTime: record.startTime || record.sTime,
      endTime: record.endTime || record.eTime,
      fileSize: record.fileSize,
      fileType: record.fileType || record.recordType,
      downStatus: '--',
      state: '',
      dumpHandle: dump.DumpHandle,
      path: record.path
    }
    item.__id = new Date().getTime()
    if (dump.success) {
      item.state = '下载中'
    } else {
      item.state = '下载失败'
    }
    console.log(item, 'ioioiioioioi')
    downListData.push(item)
    window.localStorage.setItem('downListDataArr', JSON.stringify(downListData))
  })

  return downListData
}

// 获取插件的当前时间和下载的开始和关闭的时间
export const recordDump = async(data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  const dump = JSON.parse(document.getElementById('global-plugin').OpenRecordDump(data))
  console.log(dump, 'dumpdumpdumpdumpdump')
  const callback = function(index, DumpHandle, c) {
    console.log('DumpHandle', DumpHandle)
    document.getElementById('global-plugin').CloseRecordDump(+DumpHandle)
  }
  if (dump.success) {
    document.getElementById('global-plugin').SetRecordDumpNotifyCallback(dump.DumpHandle, callback)
  }
  return dump
}
