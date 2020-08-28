const state = {
  assistantManageUserListShowStatus: true
}
const getters = {
  getUserListShowStatus: state => state.assistantManageUserListShowStatus
}
const mutations = {
  SET_USER_LIST_SHOW_STATUS(state, flag) {
    state.assistantManageUserListShowStatus = flag
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
