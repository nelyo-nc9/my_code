import { get } from '../base'


// 门禁管理事件类型
export const accessEventAlarm = payload => {
  const param = {
    url: '/guard/v1/record/event/list',
    query: payload
  }
  return get(param)
}


//门禁管理 报警事件
export const accessAlarm = payload => {
  let param = {
    url: '/guard/v1/record/warning/list',
    query: payload
  }
  return get(param)
}

//门禁 日志api
export const accessLog = payload => {
  let param = {
    url: '/guard/v1/record',
    query: payload
  }
  return get(param)
}
