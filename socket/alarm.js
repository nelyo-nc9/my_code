/**
 * 报警采用pubsub，提供多种报警类型供订阅，使用说明如下
 * *******************************************************
 * 1. 需要收报警的地方，import alarm from '本文件路径'
 * 2. alarm.on(类型, callback) 例：接收除巡更、单兵外的所有报警,可用类型下面给出
 * const receiveAllAlarm = data => console.log('alarm', data)
 * alarm.on('all', receiveAllAlarm)
 * 3.重点，重点，重点，不需要继续收报警时调用
 *    alarm.remove(on的类型, receiveAllAlarm) 移除callback
 * *******************************************************
 * 常用类型：
 * all --- 全部类型的报警不包括巡更、单兵报警
 * confirmAlarm --- 报警确认的消息
 * patrol --- 巡更报警
 * singlePawn --- 单兵报警
 * singlePawnLoc --- 单兵实时位置
 * singlePawnMsg --- 单兵消息采集
 * patrolConfirm --- 巡更报警确认消息
 * patrolStatus --- 巡更状态更新
 * singleStatus --- 巡更app状态更新
 * intercomComplete --- 对讲连接成功
 * singleTimeOut --- 单兵超时报警
 * intercomReceiving --- 接收对讲
 * *******************************************************
 * 类型详见26行ALARM_TYPES、95行EXTEND中定义的类型
 */

import { getWebSocket, getSocket } from './socket'

// 报警事件的枚举
const ALARM_TYPES = [
  'alarmDeal' // 报警处置页面接受报警
]
const EXTEND = [ // 根据报警类型分类
  'alarmVideo', // 视频报警
  'eventVideo', // 视频事件
  'alarmIntrusion', // 入侵报警
  'eventIntrusion', // 入侵事件
  'alarmIntercom', // 对讲报警
  'eventIntercom', // 对讲事件
  'alarmGuard', // 门禁报警
  'alarmGuardOrdinary', // 普通门禁报警
  'alarmGuardAirlock', // 互锁门门禁报警
  'alarmGuardVault', // 金库门禁报警
  'eventGuard', // 门禁事件
  'eventGuardOrdinary', // 普通门禁事件
  'eventGuardAirlock', // 互锁门门禁事件
  'eventGuardVault', // 金库门禁事件
  'alarmEntrance', // 出入口报警
  'alarmProtectionCabin', // 防护舱报警
  'eventProtectionCabin', // 防护舱事件
  'alarmParking', // 停车场报警
  'alarmIntelligent', // 智能报警
  'fireAlarm' //消防报警
]
const ALARM_EVENTS = ALARM_TYPES.concat(EXTEND)

class PubSub {
  constructor(events) {
    this.list = {}
    events.forEach(v => {
      this.list[v] = []
    })
  }

  on (ev, callback) {
    if (this.list[ev]) {
      this.list[ev].push(callback)
      return true
    } else {
      return false
    }
  }

  emit (ev, data) {
    // 防止其他callback修改data，data拷贝
    const dataStr = JSON.stringify(data)
    if (this.list[ev]) {
      this.list[ev].forEach(v => {
        new Promise(() => { v(JSON.parse(dataStr)) }).catch(err => { console.log('alarm callback error:', err, v) })
      })
      return true
    } else {
      return false
    }
  }

  remove (ev, callback) {
    console.log(this.list[ev][0])
    console.log(this.list)
    console.log(callback === this.list[ev][0])
    if (callback && this.list[ev]) {
      this.list[ev].forEach((v, i) => {
        this.list[ev].splice(i, 1)
      })
      callback('success')
    } else {
      callback('err')
    }
  }
}

const alarm = new PubSub(ALARM_EVENTS)
export function connectAlarm () {
  // 接收报警socket
  const websocket = getWebSocket()
  websocket.onmessage = msgEvent => {
    const data = JSON.parse(msgEvent.data)
    if (data.type) {
      switch (data.type) {
        case 'alarmInfo':
          // 报警处置，接收总的报警
          if (data.alarmInfo.alarmClassEn.indexOf('event') === -1) {
            alarm.emit('alarmDeal', data)
          }
          // 根据不同的报警类型，将报警分发到不同的页面
          EXTEND.forEach(item => {
            if (item === data.alarmInfo.alarmClassEn) {
              if (data.alarmInfo.alarmClassEn === 'alarmGuard') {
                switch (parseInt(data.alarmInfo.type)) {
                  case 1: // 金库门禁
                    alarm.emit('alarmGuardVault', data)
                    break
                  case 2: // 普通门禁
                    alarm.emit('alarmGuardOrdinary', data)
                    break
                  case 3: // 互锁门
                    alarm.emit('alarmGuardAirlock', data)
                    break
                }
              } else if (data.alarmInfo.alarmClassEn === 'eventGuard') {
                switch (parseInt(data.alarmInfo.type)) {
                  case 1: // 金库门禁
                    alarm.emit('eventGuardVault', data)
                    break
                  case 2: // 普通门禁
                    alarm.emit('eventGuardOrdinary', data)
                    break
                  case 3: // 互锁门
                    alarm.emit('eventGuardAirlock', data)
                    break
                }
              } else {
                alarm.emit(item, data)
              }
            }
          })
          break
        case 'personInfo':
          if (data.alarmInfo.alarmClassEn.indexOf('event') === -1) {
            alarm.emit('alarmDeal', data)
          }
          if (data.alarmInfo.alarmClassEn === 'alarmGuard') {
            switch (parseInt(data.alarmInfo.type)) {
              case 1: // 金库门禁
                alarm.emit('alarmGuardVault', data)
                break
              case 2: // 普通门禁
                alarm.emit('alarmGuardOrdinary', data)
                break
              case 3: // 互锁门
                alarm.emit('alarmGuardAirlock', data)
                break
            }
          } else if (data.alarmInfo.alarmClassEn === 'eventGuard') {
            switch (parseInt(data.alarmInfo.type)) {
              case 1: // 金库门禁
                alarm.emit('eventGuardVault', data)
                break
              case 2: // 普通门禁
                alarm.emit('eventGuardOrdinary', data)
                break
              case 3: // 互锁门
                alarm.emit('eventGuardAirlock', data)
                break
            }
          }
          break
        case 'fireInfo':
          if (data.alarmInfo.alarmClassEn === 'fireAlarm') {
            alarm.emit('fireAlarm', data)//消防报警
          }
      }
    } else {
      console.log('未知websocket消息:', data)
    }
  }
  // socketIO 接受socket推送
  // const socketIO = getSocket()

  // eg:
  // socketIO.on('message', data => {
  //   alarm.emit('message', data)
  // })
}

export function disconnectAlarm () {
  const websocket = getWebSocket()
  websocket.close()
  const socketIO = getSocket()
  socketIO.close()
}

export default alarm
