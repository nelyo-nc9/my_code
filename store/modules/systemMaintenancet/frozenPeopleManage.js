import { getFrozenPeopleListApi, setPeopleStatusApi } from '../../../http/systemMaintain/frozenPeopleManage.api'
const state = {
  currentView: 'FrozenPeopleManageList',
  currentTitle: '列表',
  fromView: '',
  fromTitle: '',
  tableData: [],
  selectData: [] // 勾选存储
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
   * 请求列表数据
   */
  getList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getFrozenPeopleListApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 设置状态
   */
  setStatus({ commit }, data) {
    return new Promise((resolve, reject) => {
      setPeopleStatusApi(data).then(res => {
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
