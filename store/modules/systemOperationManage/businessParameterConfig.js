
const state = {
  // 业务参数配置请求列表参数
  businessParameterConfigParam: {}

}
const getters = {}
const mutations = {
  // 存储业务参数配置请求参数
  SET_BUSINESS_PARAMETER_LIST_PARAM(state, payload) {
    state.businessParameterConfigParam = payload
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
