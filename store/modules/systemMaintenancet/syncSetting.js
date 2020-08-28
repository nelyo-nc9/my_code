import { getSyncLogListApi, getSettingManageApi, updateSettingManageApi, setSettingManageApi } from '../../../http/systemMaintain/syncSetting.api'
const state = {
  currentView: 'SyncSetting',
  currentTitle: '同步设置'
}
const getters = {
  currentView(state) {
    return state.currentView
  }
}
const mutations = {
  SET_STATE(state, payload) {
    state[payload.key] = payload.value
  }
}
const actions = {
  /*
   * 更新state属性
   */
  setState({ commit }, data) {
    commit(data)
  },
  /*
   * 获取同步日志列表信息
   */
  getList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getSyncLogListApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
 * 获取服务配置信息
 */
  getConfig({ commit }, data) {
    return new Promise((resolve, reject) => {
      getSettingManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 更新服务配置
   */
  updateSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateSettingManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
  * 增加服务配置
  */
  addSetSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      setSettingManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
