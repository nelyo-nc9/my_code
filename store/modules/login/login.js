import { loginApi, tokenApi, logoutApi, userRouterApi } from '../../../http/login/login.api'
import { Notification } from 'element-ui'
const state = {
  useRouter: sessionStorage.useRouter ? JSON.parse(sessionStorage.useRouter) : {}, // 用户页面权限信息存储
  user: {}, // 登录信息存储token
  poweRoute: sessionStorage.poweRoute ? JSON.parse(sessionStorage.poweRoute) : [],
  list: [],
  tab: [],
  child: [],
  btn: [],
  newMenu: [],
  defaultComponent: {},
  changComponent: '',
  url: window.location.pathname
}
const getters = {
  currentPath() {
    return state.url
  },
  isBtn(data) {
    return (data) => {
      if (state.btn[0] === 'superUser') {
        return true
      } else {
        let arr = state.btn.filter(item => item.resource === state.changComponent)
        let flag = arr.some(item => item.name === data)
        return flag
      }
    }
  },
  isChild(data) {
    return (data) => {
      if (state.child && state.child.length > 0) {
        let arr = data.filter(item => state.child.some(i => i.name === item.title))
        return arr
      } else {
        return data
      }
    }
  }
}
const mutations = {
  SET_STATE(state, payload) {
    state[payload.key] = payload.value
  },
  SET_INFI_STATE(state, payload) {
    // console.log(state, payload)
    let init = state.useRouter && state.userRouter ? state.userRouter : JSON.parse(sessionStorage.useRouter)
    let {tab, operation, type} = init
    // console.log(tab, operation, type)
    if (type && type === 3) {
      state.list = ['superUser']
      state.tab = ['superUser']
      state.child = ['superUser']
      state.btn = ['superUser']
    } else {
      let arr = tab && tab.filter(item => item.url === payload.path)
      let currentList = arr && arr.filter(item => {
        if (item.resource && item.resource.split('_')[0] === 'list') {
          return item
        }
      })
      state.list = currentList
      let currentTab = arr && arr.filter(item => {
        if (item.resource && item.resource.split('_')[0] === 'tab') {
          return item
        }
      })
      state.tab = currentTab
      let currentChild = arr && arr.filter(item => {
        if (item.resource && item.resource.split('_')[0] === 'child') {
          return item
        }
      })
      state.child = currentChild
      let currentBtn = operation && operation.filter(item => item.url === payload.path)
      state.btn = currentBtn
      // console.log(currentList, currentTab, currentChild, state, arr, payload)
    }
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
   * 用户登录
   */
  userLogin({ commit }, data) {
    return new Promise((resolve, reject) => {
      loginApi(data, {headers: {}}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 用户token
   */
  userToken({ commit }, data) {
    return new Promise((resolve, reject) => {
      tokenApi(data, {headers: {}}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * logout
   */
  logout({ commit }, data, obj = {}) {
    return new Promise((resolve, reject) => {
      logoutApi(data, obj).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  async userOut({commit}, data) {
    let res = await logoutApi(data = {}, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    let {code} = res.data
    if (code === 0) {
      Notification({
        type: 'info',
        title: '已退出',
        offset: 100,
        message: '',
        position: 'top-right'
      })
    } else {
      Notification({
        type: 'info',
        title: '异常退出',
        offset: 100,
        message: '',
        position: 'top-right'
      })
    }
    sessionStorage.removeItem('poweRoute')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('superUser')
    sessionStorage.removeItem('useRouter')
    // console.log(res, data)
  },
  /*
   * 根据人员Id获取功能权限
   */
  userRouter({ commit }, data, obj = {}) {
    return new Promise((resolve, reject) => {
      userRouterApi(data, obj).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  removeUserInfo() {
    sessionStorage.removeItem('poweRoute')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('superUser')
    sessionStorage.removeItem('useRouter')
  },
  setTab({ commit }, data) {
    // console.log(data,'1111111111')
    commit({ type: 'SET_STATE', key: 'url', value: data })
    commit({ type: 'SET_INFI_STATE', path: data })
  },
  changIndex({ commit, state }, data) {
    let {newMenu} = state
    let obj = {}
    newMenu[0] && newMenu.forEach(i => {
      if (i.index === data) {
        obj = i
      } else {
        if (i.items && i.items[0]) {
          i.items.forEach(j => {
            if (j.index === data) {
              obj = j
            } else {
              if (j.items && j.items[0]) {
                j.items.forEach(o => {
                  if (o.index === data) {
                    obj = o
                  }
                })
              }
            }
          })
        }
      }
    })
    commit({ type: 'SET_STATE', key: 'defaultComponent', value: obj })
    commit({ type: 'SET_STATE', key: 'changComponent', value: data })
  },
  setMenu({ commit, state, getters }, data) {
    let path = getters.currentPath
    commit({ type: 'SET_INFI_STATE', path: path })
    let {list, tab, child} = state
    let superUser = sessionStorage.getItem('superUser') // 管理员信息
    let arr = []
    let ctm = {}
    if (superUser) {
      arr = data
    } else {
      arr = data && data.filter(item => {
        if (list.some(i => i.name === item.title && i.resource.split('_')[1] === item.index)) {
          if (item.items) {
            item.items = item.items.filter(atm => {
              if (tab.some(i => i.name === atm.title && i.resource.split('_')[1] === atm.index)) {
                if (atm.items) {
                  atm.items = atm.items.filter(etm => {
                    if (child.some(i => i.name === etm.title && i.resource.split('_')[1] === etm.index)) {
                      return etm
                    }
                  })
                }
                return atm
              }
            })
          }
          return item
        }
      })
    }
    function filterIndex(arr = [], ctm = {}) {
      let flag = arr[0] && arr.some(i => i.title.includes('列表'))
      if (arr && arr.length > 0 && arr[0].items) {
        return filterIndex(arr[0].items)
      } else {
        if (!flag) {
          ctm = arr[0]
        } else {
          ctm = arr[0] && arr.filter(i => i.title.includes('列表'))[0]
        }
      }
      return ctm
    }
    ctm = filterIndex(arr)
    // console.log(list, tab, child, arr, ctm)
    commit({ type: 'SET_STATE', key: 'defaultComponent', value: ctm })
    commit({ type: 'SET_STATE', key: 'changComponent', value: ctm.index })
    commit({ type: 'SET_STATE', key: 'newMenu', value: arr })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
