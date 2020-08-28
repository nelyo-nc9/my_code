import { getRoleManageApi, setRoleManageApi, updateRoleManageApi, deleteRoleManageApi, getPowerTreeApi, getRoleDetailApi, getRoleOperationApi, getRoleResourceApi, exportManageApi } from '../../../http/systemMaintain/roleManage.api'
// RoleManage
const state = {
  currentView: 'RoleManageList',
  currentTitle: '列表',
  fromView: '',
  fromTitle: '',
  detailData: [], // 编辑存储
  roleTitle: '',
  lastTitle: '',
  rigthTree: [],
  leftTree: [],
  currentId: '1',
  checkedKeys: [],
  halfCheckedKeys: [],
  resourceData: [],
  setLeft: [],
  checkRigth: [],
  lastCheckOver: [],
  openKey: '',
  rootNodeKey: '',
  checkNode: {}
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
      getRoleManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 增加角色
   */
  setRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      setRoleManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 修改角色
   */
  updateRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateRoleManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取角色详情
   */
  getRoleDetail({ commit }, data) {
    return new Promise((resolve, reject) => {
      getRoleDetailApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取角色关联的操作权限
   */
  getRoleOperation({ commit }, data) {
    return new Promise((resolve, reject) => {
      getRoleOperationApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取关联的资源信息
   */
  getRoleResource({ commit }, data) {
    return new Promise((resolve, reject) => {
      getRoleResourceApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 删除角色列表
   */
  deleteRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteRoleManageApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 获取功能权限 树
   */
  getPowerTree({ commit }, data) {
    return new Promise((resolve, reject) => {
      getPowerTreeApi(data).then(res => {
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