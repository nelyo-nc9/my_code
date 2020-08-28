import { getSysConfig } from '@src/http/systemOperationManage/systemParameters.api.js'
const state = {
}

const mutations = { // 存储服务器上的参数配置
  SET_SERVER_CONFPARAM(state, payload) {
    let confParam = {
      download: payload.formats.download, // 下载格式 1.bsr格式 2.avi
      screenshots: payload.formats.screenshots, // 1.jpg格式（暂时只有一种）
      downPath: payload.fireStore.downPath, // 消防下载录像存储路径
      screenshotsPath: payload.store.screenshotsPath, // 手动截图路径
      talkBackPath: payload.store.talkBackPath, // 对讲音视频合成录像路径
      downLoadVideoPath: payload.store.talkBackPath, // 下载录像存储路径
      appVideoPath: payload.store.appVideoPath, // 手机APP视频文件存储路径
      appPhotosPath: payload.store.appPhotosPath, // 手机APP拍摄照片存储路径
      alarmVedioStream: payload.alarmVedioStream // 报警录像码流(1主码流2子码流)
    }
    window.localStorage.setItem('confParam', JSON.stringify(confParam))
  },
  SET_CONFPARAM(state, payload) { // 接口故障，存储默认参数
    let confParam = {
      download: 1, // 下载格式 1.bsr格式 2.avi
      screenshots: 1, // 1.jpg格式（暂时只有一种）
      downPath: 'C:\\Program Files (x86)', // 消防下载录像存储路径
      screenshotsPath: '', // 手动截图路径
      talkBackPath: '', // 对讲音视频合成录像路径
      downLoadVideoPath: 'C:\\Program Files (x86)', // 下载录像存储路径
      appVideoPath: '', // 手机APP视频文件存储路径
      appPhotosPath: '', // 手机APP拍摄照片存储路径
      alarmVedioStream: 2 // 报警录像码流(1主码流2子码流)默认子码流
    }
    window.localStorage.setItem('confParam', JSON.stringify(confParam))
  }
}

const actions = {
  getConfParam({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getSysConfig().then(res => {
        resolve(res)
        if (res.data.code === 0) {
          commit('SET_SERVER_CONFPARAM', res.data.data)
        } else {
          commit('SET_CONFPARAM')
        }
      }).catch(err => {
        commit('SET_CONFPARAM')
        reject(err)
      })
    })
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
