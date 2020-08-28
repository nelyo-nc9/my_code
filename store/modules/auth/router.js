/*
* @Author: mahuichun
* @Date: 2020-05-18 21:23:06
* @Last Modified by: mahuichun
* @Last Modified time: 2020-05-19 10:21:49
*/
const state = {
  thirdRouterArray: []
}
const getters = {}
const mutations = {
  SET_THIRD_ROUTER(state, data) {
    state.thirdRouterArray = data
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions,
  getters
}
