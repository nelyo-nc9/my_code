/**
 * 使用原生websocket
 * 定时提醒信息推送
 */
import { getFilePathApi } from '../http/systemOperationManage/preventDrowsy.api'
// const WEBSOCKET_URL = `ws://${window.location.hostname + ':8000'}/trace`
const WEBSOCKET_URL = `ws://${'192.168.12.90:8000'}/trace`
// 原生websocket
let websocket = null
let timer = null
// 连接
export function getWebSocket() {
  if (!websocket || websocket.readyState !== 1) {
    // 1 - 表示连接已建立，可以进行通信。
    return openWebSocket()
  }
  return websocket
}

export function openWebSocket() {
  websocket = new WebSocket(WEBSOCKET_URL)
  websocket.onopen = () => {
    // 连接成功
    console.log('websocket 连接成功')
  }
  websocket.onmessage = (data) => {
    if (data && data.data !== 'heatbeat') {
      console.log('收到提醒通知-------------------------------------------------------------')
      let param = {
        type: 2
      }
      getFilePathApi(param).then(res => {
        let audio = new Audio() // 前端播放本地声音
        audio.controls = true
        audio.src = res.data.data // 声音文件路径
        if (typeof timer === 'object') {
          let playPromise = audio.play()
          if (playPromise) {
            console.log('开始播放，时长为30S')
            let second = 30
            timer = setInterval(() => {
              second--
              if (second <= 0) {
                audio.pause()
                console.log('暂停')
                clearInterval(timer)
                timer = null
              }
            }, 1000)
          }
        }
      })
    }
  }
  websocket.onerror = err => {
    // 连接失败
    console.log('websocket error:', err)
  }
  return websocket
}
// 断开连接
export function disconnectWebSocket() {
  websocket.close()
  console.log('websocket 断开连接')
}
