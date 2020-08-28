
const state = {
  isNewFile: null,
  componentId: 'evaluationRankingRules'
}
const getters = {
}
const mutations = {
  // 设置点击新建
  SET_IS_NEW_FILE({commit}, payload) {
    state.isNewFile = payload
  },
  // 调用组件的id
  SET_COMPONENT_ID({commit}, payload) {
    state.componentId = payload
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
