// 消防大数据首页接口
import { get, post, put, remove } from '../base'

// 获取左侧设备统计图表列表
export const equipmentStatus= (payload) => {
  let param = {
    url: '/fire/v1/system-manage/countHost',
    query: payload
  }
  return get(param)
}
export const getOrganization= (payload) => {
  let param ={
    url:'organizational/v1/org/statistics'
  }
  return get(param)
}
// 获取地图省份对应ID 
export const getMapId = (payload) => {
  let param = {
    url: `organizational/v1/org/loading-tree`,
    // query: payload
  }
  return get(param)
}
// 获取地图数据
export const getMap = (payload) => {
  let param = {
    url: 'resource/v1/video/statistic/keypart/distribution',
    // query: payload
  }
  return get(param)
}
// 获取右侧报警图表数据
/* 
2. 报警事件分类统计
接口： /api/fire/v1/fire-emergency/alarmclasscount

请求方式： get

传参： startTime：“2020-12-10 12:12:12”
           endTime:    "2020-12-10  23:59:59"

返回参数：
{
    "code": 0,
    "message": "success",
    "data": {
        "count": "{\"报警总数\":36,\"烟雾告警\":8,\"手动告警\":19,\"设备防拆告警\":9}",
        "reply": {
            "code": "0",
            "msg": "ok"
        }
    }
}
 2. 报警事件分类统计
*/
export const rightAlarmStatistics= (payload) => {
  let params = {
    url: 'fire/v1/fire-emergency/alarmclasscount',
    query: payload
  }
  return get(params)
}



// 获取右侧巡检任务完成统计
export const rightInspectionStatistics= ({id, param}) => {
  let params = {
    url: `/daily/v1/duty/${id}`,
    body: param
  }
  return put(params)
}

/* 
 

实时报警待处理，已处理：
接口： /api/fire/v1/fire-emergency/alarmNumber；

请求方式：get 无参


返回参数：
{
    "code": 0,
    "message": "success",
    "data": {
        "": "{\"total\":36,\"done\":1,\"toDo\":35,\"level1\":36,\"level2\":0,\"levelLocal\":36,\"levelUp\":0,\"level1Done\":1,\"level2Done\":0,\"levelLocalDone\":1,\"levelUpDone\":0}",
        "reply": {
            "code": "0",
            "msg": "ok"
        }
    }
}

done: 已处理
toDo: 待处理

*/



export const ReaTimeAlarm = (id) => {
  let param = {
    url: `fire/v1/fire-emergency/alarmNumber`,
    query: ''
  }
  return get(param)
}
 // 报警列表 
 export const weeklyAlarm = (id) => {
    let param = {
      url: 'fire/v1/fire-emergency',
      query: ''
    }
    return get(param)
 }

 // 获取底部周在线信息 
 export const weeklyOnline = (params) => {
    let param = {
      url: 'fire/v1/system-manage/countDayHost',
      query: params
    }
    return get(param)
 }
 // 获取每周在线设备统计

 

  // 获取底部周设备在线信息 
  export const weeklyEquipmen = () => {
    let param = {
      url: 'fire/v1/fire-emergency/alarmweekdaycount',
      query: ''
    }
    return get(param)
 }