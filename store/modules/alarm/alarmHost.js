/*
 * @Author: your name
 * @Date: 2020-06-20 15:57:42
 * @LastEditTime: 2020-06-24 16:25:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \新建文件夹\client\src\store\modules\alarm\alarmHost.js
 */
import {
  getAlarmHostListApi,
  getSubsystemListApi,
  getDetectorListApi,
  defendnApi,
  undefendnApi,
  loginApi,
  bypassApi,
  passApi,
  clearAlarmApi,
  getStatusApi,
  getHostBindApi,
  closeDoorApi,
  openDoorApi,
  opentalkApi,
  closetalkApi,
  openoutputApi,
  closeoutputApi,
  getDetectorBindApi,
  getLocationListApi,
  getOnlinelistApi,
  getalrmHostListQueryApi,
  getOutputChanApi,
  getoutputStatusApi,
  channelStartTalkApi, //开始对讲
  channelCloseTalkApi, //关闭对讲
  getMacApi, //查询指定mac地址的台麦主机
  runtimeGuardApi, // 查询实时门禁状态
  runtimeAudioApi, // 查询音频实时状态
  setHostZoneStatusApi, // 存储改变后主机/防区的状态到数据库
  getalrmHostListStateApi,
  findHostBindApi, //主机联动关系
  findHostBindDetectorApi //主机下探测器的联动关系
} from '../../../http/alarm/alarmHostManage.api'
// 报警主机相关
const state = {
  alarmHostList: [],
  channelStartTalkData: {}, //开始对讲
  channelCloseTalkData: {} //关闭对讲
}
const getters = {}
const mutations = {
  GET_HOST_INFO(state, data) {
    state.alarmHostList = data
  },
  //开始对讲
  CHANNELSTARTTALKDATA(state, data) {
    state.channelStartTalkData = data
  },
  //关闭对讲
  CHANNELCLOSETALKDATA(state, data) {
    state.channelCloseTalkData = data
  }
}
const actions = {
  // 报警主机列表
  getAlarmHostManage({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmHostListApi(payload)
        .then(res => {
          resolve(res)
          // commit('GET_HOST_INFO', payload)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警主机下的子系统
  getHostSubsystem({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getSubsystemListApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警主机-探测器(2&3)
  getDetectorList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getDetectorListApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 登录
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      loginApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 布防
  changeDefendn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      defendnApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 撤防
  changeUndefendn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      undefendnApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 旁路
  changeBypass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      bypassApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 旁路
  changePass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      passApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 消警
  clearAlarmFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      clearAlarmApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 门禁开门
  openDoorFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      openDoorApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 门禁关门
  closeDoorFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      closeDoorApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 开始对讲
  opentalkFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      opentalkApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 结束对讲
  closetalkFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      closetalkApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 打开警铃
  openoutputFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      openoutputApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 关闭警铃
  closeoutputFn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      closeoutputApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取报警主机警铃IO状态
  getoutputStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getoutputStatusApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取布撤防状态
  getStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getStatusApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取在线状态getOnlinelistApi
  getOnlinelist({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getOnlinelistApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警主机关联配置查询
  getHostBind({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getHostBindApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取探测器关联配置
  getDetectorBind({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getDetectorBindApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getLocationList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getLocationListApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警主机列表查询（报警主机管理页面使用）
  getalrmHostListQuery({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getalrmHostListQueryApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取输出通道
  getOutputChan({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getOutputChanApi(payload)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // ___________2020.8.9分割线——————————————————————————
  //开始对讲
  startTalk({ commit }, payload) {
    return new Promise((resolve, reject) => {
      channelStartTalkApi(payload)
        .then(res => {
          resolve(res.data)
          commit('CHANNELSTARTTALKDATA', res.data.data)
          // console.log("vuex",res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  //关闭对讲
  closeTalk({ commit }, payload) {
    return new Promise((resolve, reject) => {
      channelCloseTalkApi(payload)
        .then(res => {
          resolve(res.data)
          commit('CHANNELCLOSETALKDATA', res.data.data)
          // console.log("vuex",res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  //查询指定mac地址的台麦主机
  getHostMac({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getMacApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取门实时状态
  runtimeGuardStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      runtimeGuardApi(payload)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  runtimeAudioStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      runtimeAudioApi(payload)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 操作布撤防后给存储状态到数据库
  setHostZoneStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      setHostZoneStatusApi(payload)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 报警主机列表统计
  getalrmHostListState({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getalrmHostListStateApi(payload)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取主机关联关系
  getFindHostBind({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findHostBindApi(payload.id, { ref: payload.ref, whichPage: 'deal' })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取探测器的关联关系
  getFindHostBindDetector({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findHostBindDetectorApi(payload.id, { ref: payload.ref, whichPage: 'deal' })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
