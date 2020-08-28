import axios from 'axios'
export const openFlow = async(pluginDom, data) => {
  // 因为是私有协议 所以去掉“protocol”: ”bstar, rtmp”//协议类型,没有此字段为私有协议 bstar， Internet也可以去掉
  // 非国标设备
  //  {
  //    “devIp”: ”设备ip”,
  //    “devPort”: int,
  //    “channel”: int,
  //    “streamType”: ”流类型”,
  //    “dPort”: int//使用的视频连接数据端口
  // }

  // 国标设备
  // {
  //   “gbPlaDevIp”: ”国标设备IP或者平台IP”,
  //   “gbPlaDevPort”: int,//”国标设备或者平台的port”,
  //   “gbDevId”: ”国标设备编码”,
  //   “gbPlaNvrId”: ”国标平台ID”
  // }
  let obj = {
    devIp: data.devIp,
    devPort: data.devCport,
    dport: data.devDport,
    channel: Number(data.channel) || 1,
    streamType: data.streamType || 'main'
  }
  let obj2 = obj
  if (data.sipCode) { // 国标开流
    obj = {
      gbPlaDevIp: data.devIp,
      gbPlaDevPort: data.devDport,
      gbDevId: data.gbDevId,
      gbPlaNvrId: data.gbPlaNvrId
    }
    obj2 = {
      gbDevId: data.gbDevId,
      gbPlaNvrId: data.gbPlaNvrId
    }
  }
  let res
  let url = 'ctl/video'
  try {
    res = await axios.post(url, obj)
  } catch (err) {
    return err
  }
  if (res.status !== 200) { return '-1' }
  let params = {
    port: res.data.tsPort + '',
    ip: res.data.tsIp,
    cmdStr: JSON.stringify(obj2)
  }
  return pluginDom.OpenRealStreamEx(JSON.stringify(params))
}
