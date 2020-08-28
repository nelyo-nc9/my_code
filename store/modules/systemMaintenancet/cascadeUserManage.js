// import { getPowerManageApi, setPowerManageApi, updatePowerManageApi, deletePowerManageApi } from '../../../http/systemMaintain/roleManage.api'
// powerManage
const state = {
  currentView: 'CascadeUserManageList',
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
  }
  // ,
  /*
   * 请求列表数据
   */
  // getList({ commit }, data) {
  //   return new Promise((resolve, reject) => {
  //     getPowerManageApi(data).then(res => {
  //       resolve(res)
  //     }).catch(err => {
  //       reject(err)
  //     })
  //   })
  // },
  /*
   * 增加权限
   */
  // setPower({ commit }, data) {
  //   return new Promise((resolve, reject) => {
  //     setPowerManageApi(data).then(res => {
  //       resolve(res)
  //     }).catch(err => {
  //       reject(err)
  //     })
  //   })
  // },
  /*
   * 修改权限
   */
  // updatePower({ commit }, data) {
  //   return new Promise((resolve, reject) => {
  //     updatePowerManageApi(data).then(res => {
  //       resolve(res)
  //     }).catch(err => {
  //       reject(err)
  //     })
  //   })
  // },
  /*
   * 删除权限列表
   */
  // deletePower({ commit }, data) {
  //   return new Promise((resolve, reject) => {
  //     deletePowerManageApi(data).then(res => {
  //       resolve(res)
  //     }).catch(err => {
  //       reject(err)
  //     })
  //   })
  // }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
