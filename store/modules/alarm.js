import alarmConfig from './alarm/alarmConfig'
import alarmHost from './alarm/alarmHost'
const state = {
  ...alarmConfig.state,
  ...alarmHost.state
}
const getters = {
  ...alarmConfig.getters,
  ...alarmHost.getters
}
const mutations = {
  ...alarmConfig.mutations,
  ...alarmHost.mutations
}

const actions = {
  ...alarmConfig.actions,
  ...alarmHost.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}