/*
 * @Author: mahuichun
 * @Date: 2020-05-28 14:56:13
 * @LastEditTime: 2020-05-28 18:11:38
 * @LastEditors: mahuichun
 * @Description: 报警配置相关
 */
import { getEventDealListApi, postAddtogroupApi, getKeyPartVideoTreeApi, postDelgroupApi, checkAudioStatusApi, postCloseTalkApi } from '../../../http/alarm/eventDeal.api'
// 报警相关
const state = {
  stopResiveStatas: true,
}
const getters = {
  stopResiveStatas () {
    return state.stopResiveStatas
  }
}
const mutations = {
  // 改变接警的状态
  STOP_RESIVE_STATAS (state, payload) {
    console.log(arguments, state, payload)
    state.stopResiveStatas = payload
  }
}

const actions = {
  // 获取报警配置列表
  getEventDealList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getEventDealListApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 怎講对讲人员
  postAddtogroup ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAddtogroupApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除对讲人员
  postDelgroup ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postDelgroupApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除对讲人员
  getKeyPartVideoTree ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getKeyPartVideoTreeApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除对讲人员
  postCloseTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postCloseTalkApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取设备状态
  checkAudioStatus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      checkAudioStatusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
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
