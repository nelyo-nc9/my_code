import { getPeopleManageListApi, deletePeopleManageApi, setPeopleManageSyncApi, exportManageApi } from '../../../http/systemMaintain/peopleManage.api'
const state = {
  currentView: 'PeopleManageList',
  currentTitle: '列表',
  fromView: '',
  fromTitle: '',
  // tableData: [],
  orgId: '',
  orgName: '',
  nodeKey: '',
  detailData: [] // 查看存储
}
const getters = {
  currentView(state) {
    return state.currentView
  },
  isShowTree() { // 中间机构树是否显示
    if (state.currentTitle === '查询') {
      return false
    } else {
      return true
    }
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
    console.log(state)
    return new Promise((resolve, reject) => {
      getPeopleManageListApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 删除列表数据
   */
  deletePeople({ commit }, data) {
    return new Promise((resolve, reject) => {
      deletePeopleManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 人员同步信息
   */
  peopleAsync({ commit }, data) {
    return new Promise((resolve, reject) => {
      setPeopleManageSyncApi(data).then(res => {
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
