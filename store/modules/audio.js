import talkback from './audioManagr/talkback'
const state = {
  ...talkback.state,
}
const getters = {
  ...talkback.getters,
}
const mutations = {
  ...talkback.mutations,
}

const actions = {
  ...talkback.actions,
}

export default {
  state,
  mutations,
  actions,
  getters
}