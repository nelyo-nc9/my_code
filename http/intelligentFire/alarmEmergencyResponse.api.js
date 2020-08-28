import { get, post, remove, put } from '../base'
export const getAlarmReceiveListApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency',
    query: payload
  }
  return get(param)
}
// 消防报警批量处理
export const alarmDealSubmitApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency',
    body: payload
  }
  return put(param)
}
// 向上级推送   // 走北京接口
export const superiorPushApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/alarmup',
    body: payload
  }
  return post(param)
}

// 移除
export const alarmDealDeleteApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency'
  }
  return remove(param, { data: payload })
}
// 获取短信列表
export const shortMessageApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-log/address-book',
    query: payload
  }
  return get(param)
}
// 发送短信接口
export const sendSMSApi = (payload) => {
  let param = {
    url: '/safm/api/sync/sms',
    body: payload
  }
  return post(param)
}

// 开门（北京接口）
export const postOpenDoorApi = (payload) => {
  let param = {
    // url: '/alarm-manage/v1/alarm-bstar/openDoor',
    // body: {
    //   'devIp': '10.1.1.91',
    //   'devPort': 9708,
    //   'hostId': '228e86910a2349e9a7f17dab97cb8054',
    //   'channelId': '228e86910a2349e9a7f17dab97cb8054_1'
    // }
    url: '/guard/v1/newservice/open',
    body: payload
  }
  return post(param)
}
// 关门（北京接口）
export const postCloseDoorApi = (payload) => {
  let param = {
    // url: '/alarm-manage/v1/alarm-bstar/closeDoor',
    url: '/guard/v1/newservice/close',
    body: payload
  }
  return post(param)
}
// 对讲设备登录
export const postTalkDeviceLoginApi = (payload) => {
  let param = {
    url: '/talk/login',
    body: payload
  }
  return post(param)
}
// 开始对讲
export const postBeginTalkApi = (payload) => {
  let param = {
    // url: '/talk/assigncenteranswer',
    url: '/alarm-manage/v1/alarm-bstar/opentalk',
    body: payload
  }
  return post(param)
}
// 开始对讲拨打
export const postStartinTalkApi = (payload) => {
  let param = {
    // url: '/talk/assigncenteranswer',
    url: '/audio/v1/newservice/mike/start/talk',
    body: payload
  }
  return post(param)
}
// 对讲拨打挂断
export const postCloseTalkApi = (payload) => {
  let param = {
    // url: '/talk/assigncenteranswer',
    url: '/audio/v1/newservice/close/talk',
    body: payload
  }
  return post(param)
}
// 结束对讲
export const postEndTalkApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/closetalk',
    body: payload
  }
  return post(param)
}
// 警笛打开
export const postSetDevAlarmOutPuOpenApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/linkOpenoutput',
    body: payload
  }
  return post(param)
}
// 警笛关闭
export const postSetDevAlarmOutPuCloseApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/linkCloseoutput',
    body: payload
  }
  return post(param)
}
// 布防
export const postAlarmArmApi = (payload) => {
  let param = {
    // url: '/alarmhost/arm',
    url: '/alarm-manage/v1/alarm-bstar/arm',
    body: payload
  }
  return post(param)
}

// 撤防
export const postAlarmdisarmApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/disarm',
    body: payload
  }
  return post(param)
}
// 布防登录
export const postAlarmarmLoginApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/armLogin',
    // url: '/dev/login',
    // body: {
    //   'devIp': '10.1.7.10',
    //   'devPort': 8000,
    //   'username': 'admin',
    //   'passwd': 'test-123',
    //   'vendor': 'HIKVISION', // 厂商
    //   'devType': 'AlarmHost', // 设备类型
    //   'devBaseType': 'AlarmHost', // 设备类型
    //   'connMode': 'active', //
    //   'version': '1',
    //   'daServerId': 'DAPYTHON:192.168.14.10:12000:E3060500FFFBAB1F' //
    // }
    body: payload
  }
  return post(param)
}

// 消警
export const postAlarmcleanApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-bstar/clean',
    body: payload
  }
  return post(param)
}

// 重点部位
export const findLocationDetailApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency/location',
    query: payload
  }
  return get(param)
}
// 统计数量接口
export const findCountApi = (payload) => {
  let param = {
    url: '/fire/v1/fire-emergency/count',
    query: payload
  }
  return get(param)
}
// 获取关联关系
export const findHostBindApi = (id, payload) => {
  let param = {
    // url: '/alarm-manage/v1/alarm-host/host-bind',
    url: '/alarm-manage/v1/alarm-host/bind/' + id,
    query: payload
  }
  return get(param)
}
// 获取重点资源树
export const findorgHostTreeApi = (payload) => {
  let param = {
    url: 'alarm-manage/v1/alarm-host/orgHostTree',
    query: payload
  }
  return get(param)
}
// 获取对讲树
export const findorgTolkTreeApi = (payload) => {
  let param = {
    url: '/resource/v1/tree/orgResLazyTree',
    query: payload
  }
  return get(param)
}
// 获取布撤防状态
export const getstatusApi = (payload) => {
  let param = {
    url: 'alarm-manage/v1/alarm-bstar/getstatus',
    // body: {
    //   'devIp': '10.1.4.30',
    //   'devPort': 8000,
    //   'subSystems': [{ 'subSystem': 1, 'zoneList': [1, 2, 3] }]
    // }
    body: payload
  }
  return post(param)
}

// // 根据mac 获取台麦信息
export const getMacMessageApi = (payload) => {
  let param = {
    url: '/resource/v1/audio/host/mac/relation-platform',
    body: payload
  }
  return post(param)
}
//  获取重点关注资源
export const getFocusApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-log/focus',
    query: payload
  }
  return get(param)
}
//  增加重点资源
export const postFocusApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-log/focus',
    body: payload
  }
  return post(param)
}
//  修改重点关注资源
export const putFocusApi = (payload) => {
  let param = {
    url: '/alarm-manage/v1/alarm-log/focus',
    body: payload
  }
  return put(param)
}
//  获取消防设备报警关系
export const getGuardLinkApi = (id, payload) => {
  let param = {
    url: '/fire/v1/device-config/bind/' + id,
    query: payload
  }
  return get(param)
}
//  获取防护舱联动关系
export const getCabinLinkApi = (id, payload) => {
  let param = {
    url: '/resource/v1/cabin/linkage/' + id,
    query: payload
  }
  return get(param)
}
//  获取报警主机下探测器联动关系
export const findHostBindDetectorApi = (id,payload) => {
  let param = {
    // url: '/alarm-manage/v1/alarm-host/detector-bind',
    url: '/alarm-manage/v1/alarm-host/bind/' + id,
    query: payload
  }
  return get(param)
}

//  接听对讲 获取分组信息
export const findAssigncenteranswerApi = (payload) => {
  let param = {
    url: '/talk/assigncenteranswer',
    body: payload
  }
  return post(param)
}
// 获取视频主机报警关联关系
export const findVideoLinkApi = (payload, id) => {
  let param = {
    url: '/resource/v1/video/linkage' + id,
    query: payload
  }
  return get(param)
}
// 获取对讲关联关系
export const findAudioLinkApi = (payload, id) => {
  let param = {
    url: '/resource/v1/audio/linkage' + id,
    query: payload
  }
  return get(param)
}
// 获取视频信息
export const findVideoApi = (id) => {
  let param = {
    url: '/resource/v1/video/channel/' + id
  }
  return get(param)
}
