import airlockControl from './airlock/airlockControl'
import airlockLogs from './airlock/airlockLogs'
const state = {
  ...airlockControl.state,
  ...airlockLogs.state
}
const getters = {
  ...airlockControl.getters,
  ...airlockLogs.getters
}
const mutations = {
  ...airlockControl.mutations,
  ...airlockLogs.mutations
}

const actions = {
  ...airlockControl.actions,
  ...airlockLogs.actions
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
