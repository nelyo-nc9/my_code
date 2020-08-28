import {audiologListApi,audiologExportApi} from "../../../http/audioManage/audiolog.api"
  const state = {
    // componentId: 'AlarmList'
  }
  const getters = {
    
  }
  const mutations = {
    
  }
  const actions = {
    //音频事件日志列表
   audiologList({commit}, payload) {
      return new Promise((resolve, reject) => {
        audiologListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
    //音频事件日志列表 导出
   audiologExport({commit}, payload) {
      return new Promise((resolve, reject) => {
        audiologExportApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
  
}
  
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }