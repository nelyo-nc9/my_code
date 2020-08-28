
const state = {
  componentId: 'hotWorkList',
  componentStatus: 0, // 0-申请 1-待审批 2-已审批 3-历史抄送，
  navName: '' // 二级导航的name 属性，用来改变选中项
}
const getters = {

}
const mutations = {
  // 调用组件的id
  SET_COMPONENT_ID({commit}, payload) {
    state.componentId = payload
  },
  // 消防审批状态
  SET_FIRECOMPONENT_STATUS({commit}, payload) {
    state.componentStatus = payload
  },
  // 二级导航的name 属性，用来改变选中项
  SET_NAV_NAME({commit}, payload) {
    state.navName = payload
  }

}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
