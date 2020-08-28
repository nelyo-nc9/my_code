/**
 * 北京接口连接调试
 */
// import moment from 'moment'
// import _ from 'lodash'
import { post } from '../../../../http/base'
// import { post } from '@http/base'

// 前端-国标 录像查询
export const GB_NVR_RECORD_QUERY = payload => {
  /**
   * gbDevIp: '' ,  //国标平台的的ip
   * gbDevPort: int,  //国标平台的端口port
   * channel: int,  //设备通道
   * platformID: '',  //国标平台id
   * gbDevId: '',  //国标设备id
   * recordType: 'timeRecord',  //请求查询录像类型，见文件头上录像查询类型
   * startTime: int,  //录像开始时间
   * endTime: int,  //录像结束时间
   * streamType: 'main',  //码流类型
   */
  const params = {
    url: 'record/frontdevGbQuery',
    body: payload
  }
  // “recordList”: [
  // {
  //  “channel”: int,  //请求查询设备通道号
  //  “fileName”: string,  //请求查询录像类型
  //  “startTime”: int,  //录像开始时间
  //  “endTime”: int,  //录像结束时间
  //  “filesize”: int,
  //  “streamType”: int,  //码流类型
  //  “recordType”: int,  //查询录像类型
  // }
  // ]
  return post(params)
}

// 前端-非国标 录像查询
export const NVR_RECORD_QUERY = payload => {
  /**
   * devIp, // 设备ip,
   * devPort, // 设备端口,
   * channel, // 通道号,
   * recordType, // 录像请求类型,
   * sTime, // 开始时间,
   * eTime, // 结束时间,
   * streamType = 'mian', // 码流类型,
   * rowId,
   * rowCount
   */
  const params = {
    url: 'record/frontdevSearch',
    body: payload
  }
  // {
  //   “rowId”: int,
  //   “rowCount”: int,
  //   “total”: int,
  //   {
  // “recordList”: [
  //   {
  //        “channel”: int,  //请求查询设备通道号
  //        “fileName”: string,  //请求查询录像类型
  //        “startTime”: int,  //录像开始时间
  //        “endTime”: int,  //录像结束时间
  //        “filesize”: int,
  //        “streamType”: int,  //码流类型
  //        “recordType”: int,  //查询录像类型
  //       } ,
  //     ]
  //   }
  // }
  return post(params)
}

// 中心-国标 录像查询
export const GB_RECORD_QUERY = payload => {
  /**
   * gbPlaDevIp, // 设备ip,
   * gbPlaDevPort, // 设备端口,
   * channel, // 通道号,
   * parentId, // 国标平台id,
   * childId, // 国标设备id,
   * startTime, // 开始时间,
   * endTime, // 结束时间,
   * streamType = 'mian', // 码流类型,
   * recordType // 录像类型
   */
  const params = {
    url: 'record/gbquery',
    body: payload
  }
  //   “rowId”: int,
  //   “rowCount”: int,
  //   “total”: int,
  //   {
  // “recordList”: [
  //   {
  //        “channel”: int,  //请求查询设备通道号
  //        “fileName”: string,  //请求查询录像类型
  //        “startTime”: int,  //录像开始时间
  //        “endTime”: int,  //录像结束时间
  //        “filesize”: int,
  //        “streamType”: int,  //码流类型
  //        “recordType”: int,  //查询录像类型
  //       } ,
  //     ]
  //   }
  return post(params)
}

// 中心-非国标 录像查询
export const RECORD_QUERY = payload => {
  /**
   * devIp: '设备IP,127.0.0.1', // VMR通道
   * devPort: int, // 设备端口，
   * channel: int, // 设备通道
   * eventType: [''], // 事件类型; 名称在报警类型值和其他事件类型里面寻找；
   * typeName: '', // 名称；现阶段，当eventType类型是标记事件有效，此处为标签名称；
   * typeContent: '', // 内容；现阶段，当eventType类型是标记事件有效，此处为标签内容；
   * startTime: int, // 开始时间
   * endTime: int, // 结束时间
   * streamType: '', // 码流类型（main,sub,）
   * page: int, // 当前第几页
   * rows: int // 一页多少行,rows只能按1000的整数倍(由vmfs限制)
   */
  const params = {
    url: 'record/query',
    body: payload
  }
  // {
  //   'total': '', // 查询到的总条数
  //   'page': '', // 当前第几页
  //   'rows': '', // 一页多少行
  //   'eventList': [
  //     {
  //       flag: '', // 字符串 vm 或者 ivs
  //       startTime: 1212121, // 数字 utc 开始时间
  //       endTime: 3232323, // 数字  utc结束时间
  //       eventType: '', // 字符串名称在报警类型值和其他事件类型里面寻找；
  //       fileList: ['url', 'url'], // 如果是华为IVS3800则有此项
  //       streamType: '', // 流类型
  //       channel: 3434 // 数字,
  //     }
  //   ],
  //   dsIp: '192.168.10.2',
  //   dsPort: '3720'
  // }
  return post(params)
}

// 前端-国标 录像开流
export const GB_NVR_RECORD_OPEN = payload => {
  /**
   * gbDevIp: '', //要回放的国标平台ip
   * gbDevPort: int, //要回放国标平台的port
   * gbPlatformID: '', //国标平台id
   * gbDeviceID: '', //要回放的设备id
   * startTime: int, //开始时间
   * endTime: int, //结束时间
   * streamType: 'main', //流类型
   * downLoad: 'FrontDownload', // 如果是下载后面的是固定的FrontDownload 这个名称 如果是回放固定是OpenPlayBack 这个字段
   * Internet: 'WAN'/'LAN'
   */
  const params = {
    url: 'record/frontdevGbStreamOpen',
    body: payload
  }
  return post(params)
}

// 前端-非国标 录像开流
export const NVR_RECORD_OPEN = payload => {
  /**
   * devIp: '', // 要回放的设备ip
   * devPort: int, // 要回放的设备port
   * channel: int,
   * startTime: int, // 开始时间
   * endTime: int, // 结束时间
   * streamType: 'main', // 流类型
   * Internet: 'WAN'/'LAN'
   */
  const params = {
    url: 'record/frontdevPlayBack',
    body: payload
  }
  return post(params)
}

// 中心-国标 录像开流
export const GB_RECORD_OPEN = payload => {
  /*
    gbPlaDevIp: data.devIp,
    gbPlaDevPort: data.devCport,
    gbPlatformID: data.gbPlaNvrId,
    gbDeviceID: data.gbDevId,
    startTime: newSTime,
    endTime: data.endTime,
    streamType: data.streamType
    downLoad: 'Download', // 下载的时候再带这给参数
  */
  const params = {
    url: 'record/gbreplay',
    body: payload
  }
  return post(params)
}

// 中心-非国标 录像开流 没有接口，给插件传ip、端口号、开流时间
export const RECORD_OPEN = payload => {}

// 中心-非国标 日历显示
export const CALENDAR = payload => {
  /**
   * devIp: '',
   * devPort: 80, // 设备端口数字类型
   * channel: 1, // 通道
   * streamType: '', // 流类型
   * timeRecord: [ 1434567890, 1897655210], // 定时录像 日期值。如12月5号的时间为 12月5日0点0分
   * eventRecord: [ 1434567890, 1897655210], // 事件录像 日期值。如12月5号的时间为 12月5日0点0分
   * manualRecord: [ 1434567890, 1897655210], // **录像 日期值。如12月5号的时间为 12月5日0点0分
   */
  const params = {
    url: 'record/calendar',
    body: payload
  }
  return post(params)
}

// 前端-非国标 日历显示
export const NVR_CALENDAR = payload => {
  /**
   * ip: '192.168.78.101',
   * channel: 1, // 通道号
   * startTime: '2020-07-20 00:00:00', // 开始日期
   * endTime: '2020-07-30 00:00:00' // 结束时间
   */
  const params = {
    url: 'dev/getChannelCalendar',
    body: payload
  }
  return post(params)
}

/**
 * 获取 视频查询请求
 * @param { Object } payload
 * @return { Array } 返回参数整理
 *
 * 定义 devType 对资源进行校验 1-前端非国标 2-前端国标 3-中心非国标 4-中心国标
 * isEmitTotal是否返回查询录像的总条数（用于分页）,true时返回的不是数组，而是对象
 * 如何校验 国标/非国标 及相对应的入参，暂时未定义
 */
export const queryData = (payload, isEmitTotal) => {
  /**
   * -仅获取单个通道的数据
   * -根据类型判断是用哪个接口
   * -关于分页
   * --若给分页，则不递归
   * --若不给分页，则递归
   * -出参
   * --根据 前端 非国标 出参处理
   * --多的参数干掉，少的参数值为''
   */
  // payload = {
  //   devType: 1, // 必传 1:前端非国标;2:前端国标;3:中心非国标;4:中心国标
  //   channel: 1, // 必传 通道号
  //   devIp: '10.2.2.20', // 必传
  //   devPort: 3721, // 必传
  //   devDport: 3720, // 必传
  //   gbDevId: '303000001001', // 国标必传
  //   gbPlaNvrId: '352200255622023', // 国标必传
  //   streamType: 'main', // 必传
  //   name: 'CH1枪机-值守区域1电视墙显示区', // 必传
  //   startTime: 1596441501, // 必传
  //   endTime: 1596441601, // 必传
  //   recordType: 0, // 选传 录像类型，默认前端录像0为全部；中心录像all为全部
  //   page: 1, // 选传 默认1
  //   rows: 1000 // 选传 默认1000
  // }
  // const recordTypeMap = {
  //   // 后期录像类型必须按次定义处理
  //   1: '定时录像',
  //   2: '事件录像',
  //   3: '智能录像',
  //   4: '手动录像'
  // }
  let queryFun, // 请求方法
    params // 入参
  let limit = 0 // 每页数量
  let total = 0 // 查询录像总数量
  let gbRowId = 0 // 国标行号
  if (payload.page && payload.rows) {
    gbRowId = (payload.page - 1) * payload.rows + 1
  }
  let resourceList = [] // 返回的参数
  let errInfo = '' // 错误信息
  if (payload.devType === 1) { // 前端非国标
    queryFun = NVR_RECORD_QUERY
    params = {
      devIp: payload.devIp,
      devPort: payload.devPort,
      channel: +payload.channel,
      recordType: payload.recordType || 0,
      sTime: payload.startTime,
      eTime: payload.endTime,
      streamType: payload.streamType,
      rowId: payload.page || 1, // 在前端非国标定义为第几页
      rowCount: payload.rows || 1000
    }
    limit = payload.rows
  } else if (payload.devType === 2) { // 前端国标
    queryFun = GB_NVR_RECORD_QUERY
    params = {
      gbDevIp: payload.devIp,
      gbDevPort: payload.devCport,
      channel: +payload.channel,
      platformID: payload.gbPlaNvrId,
      gbDevId: payload.gbDevId,
      recordType: payload.recordType || 'all',
      startTime: payload.startTime,
      endTime: payload.endTime,
      streamType: payload.streamType,
      rowId: gbRowId || 1, // 行号，rowId = (page-1) * rowCount
      rowCount: payload.rows || 30 // 国标最多一次30条
    }
  } else if (payload.devType === 3) { // 中心非国标
    queryFun = RECORD_QUERY
    params = {
      devIp: payload.devIp,
      devPort: payload.devPort,
      channel: +payload.channel,
      eventType: payload.recordType || 'all',
      typeName: payload.typeName || '', // ?
      typeContent: payload.typeContent || '', // ?
      startTime: payload.startTime,
      endTime: payload.endTime,
      streamType: payload.streamType ? 'main' : 'sub',
      page: payload.page || 1,
      rows: payload.rows || 50
    }
    limit = payload.rows
  } else if (payload.devType === 4) { // 中心国标
    queryFun = GB_RECORD_QUERY
    params = {
      gbPlaDevIp: payload.devIp,
      gbPlaDevPort: payload.devPort || payload.devCport,
      channel: +payload.channel,
      parentId: payload.parentId || payload.gbPlaNvrId, // ?
      childId: payload.childId || payload.gbDevId, // ?
      startTime: payload.startTime,
      endTime: payload.endTime,
      streamType: payload.streamType ? 'main' : 'sub',
      recordType: payload.recordType || 'all',
      rowId: gbRowId || 1, // 行号，rowId = (page-1) * rowCount
      rowCount: payload.rows || 30 // 国标最多一次30条
    }
  }
  if (!queryFun || !params) {
    return []
  }
  // @ts-ignore
  return queryFun(params)
    .then(res => {
      if (typeof res.data === 'string') {
        throw res.data
      }
      // 前端非国标、中心国标、中心非国标
      resourceList = [].concat(resourceList, filterResData(res.data.res || res.data))
      // let resLimit = (res.data.hasOwnProperty('rows') ? res.data.rows : res.data.rowCount) || 0
      let resLimit
      if (!Object.keys(res.data).length) { // 返回空对象
        total = 0
        resLimit = 0
      } else {
        total = res.data.hasOwnProperty('total') ? res.data.total : 0
        resLimit = (res.data.hasOwnProperty('rows') ? res.data.rows : res.data.recordList.length) || 0
      }
      /**
       * 出参有返回页码
       * 入参有设置页码
       * 校验 是否需要全查
       */
      if (resLimit && total && !limit && total > resLimit && !isEmitTotal) {
        let q = []
        for (let i = 2; i <= Math.ceil(total / resLimit); i++) {
          if (params.hasOwnProperty('rowId')) {
            if (params.devType === 1 || params.devType === 2 || params.devType === 4) {
              params['rowId'] = (i - 1) * params.rows + 1
            } else {
              params['rowId'] = i
            }
          } else {
            params['page'] = i
          }
          q.push(queryFun({ ...params }))
        }
        return Promise.all(q)
          .then(re => {
            re.forEach(e => {
              resourceList = [].concat(resourceList, filterResData(e.data))
            })
          })
      }
    })
    .catch(err => {
      errInfo = err
      console.error('queryFun', err)
    })
    .then(() => {
      if (errInfo) { return errInfo }
      resourceList = videoFilter(resourceList, payload)
      let params = {
        total: total,
        resourceList: resourceList
      }
      if (!isEmitTotal) {
        return resourceList
      } else {
        return params
      }
    })
}

// 过滤中心数据
export const videoFilter = (result, data) => {
  if (!result.length) { return [] }
  // 录像段排序
  result = JSON.parse(JSON.stringify(result))
  function compare() { // 这是比较函数
    return function(m, n) {
      var a = m.startTime
      var b = n.startTime
      return a - b // 升序
    }
  }
  result.sort(compare())

  // 默认返回录像段数组 是按时间顺序排列
  let startTime = data.startTime
  let endTime = data.endTime
  let eventList = []
  try {
    for (const iterator of result) {
      // 过滤录像段 没在起始时间范围去掉
      if (iterator.endTime < startTime || iterator.startTime > endTime) { continue }
      eventList.push(JSON.parse(JSON.stringify(iterator)))
    }
    console.log(eventList, 'eventList++++++++++')
    // 将录像段的起止时间改为查询的起止时间， 若第一个录像段开始时间大于查询开始时间则不修改； 若最后一个录像段的结束时间小于查询的结束时间则不修改
    if (eventList[0].startTime < startTime) {
      eventList[0].startTime = startTime
    }
    if (eventList[eventList.length - 1].endTime > endTime) {
      eventList[eventList.length - 1].endTime = endTime
    }
  } catch (err) {
    console.log(err, '录像段过滤错误')
    eventList = []
  }
  return eventList
}

// 过滤数据
const filterResData = payload => {
  let res = []
  const list = payload.hasOwnProperty('eventList') ? 'eventList' : 'recordList'
  if (payload[list]) {
    if (payload.hasOwnProperty('dsIp')) { // 如果是中心非国标
      payload[list] && payload[list].forEach(e => {
        res.push({
          channel: '',
          fileName: '',
          startTime: '',
          endTime: '',
          filesize: '',
          streamType: '',
          recordType: '',
          ...e,
          dsIp: payload.dsIp,
          dsPort: payload.dsPort
        })
      })
    } else {
      res = [].concat(res, payload[list])
    }
  }
  return res
}
