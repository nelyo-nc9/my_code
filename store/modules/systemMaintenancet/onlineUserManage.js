import { getOnlineUserManageApi, setOfflineManageApi, exportManageApi } from '../../../http/systemMaintain/onlineUserManage.api'
// powerManage
const state = {
  currentView: 'OnlineUserManageList',
  currentTitle: '列表',
  fromView: '',
  fromTitle: '',
  detailData: [], // 编辑存储
  roleTitle: '',
  lastTitle: ''
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
   * 获取在线人员列表
   */
  getList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getOnlineUserManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 强制用户下线
   */
  setOffline({ commit }, data) {
    return new Promise((resolve, reject) => {
      setOfflineManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 根据条件检出
   */
  exportManage({ commit }, data) {
    return new Promise((resolve, reject) => {
      exportManageApi(data).then(res => {
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
