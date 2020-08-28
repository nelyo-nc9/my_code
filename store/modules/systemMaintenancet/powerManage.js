import { getPowerManageApi, setPowerManageApi, updatePowerManageApi, deletePowerManageApi, getRoleListApi, getUserApi, exportManageApi } from '../../../http/systemMaintain/powerManage.api'
// powerManage
const state = {
  currentView: 'PowerManageList',
  currentTitle: '列表',
  fromView: '',
  fromTitle: '',
  detailData: [], // 编辑存储
  powerTitle: '',
  lastTitle: '',
  orgId: '',
  orgName: '',
  powerObj: {},
  powerList: [] // 新建存储
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
  setPowerState({ commit }, data) {
    commit(data)
  },
  /*
   * 请求列表数据
   */
  getList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getPowerManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 增加权限
   */
  setPower({ commit }, data) {
    return new Promise((resolve, reject) => {
      setPowerManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 修改权限
   */
  updatePower({ commit }, data) {
    return new Promise((resolve, reject) => {
      updatePowerManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 删除权限列表
   */
  deletePower({ commit }, data) {
    return new Promise((resolve, reject) => {
      deletePowerManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取所有角色列表
   */
  getRoleList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getRoleListApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取人员数据
   */
  getUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      getUserApi(data).then(res => {
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