import Channe from './protectiveCabin/channe'
import Host from "./protectiveCabin/host"
import Configuration from "./protectiveCabin/Configuration"
const state = {
  ...Channe.state,
  ...Host.state,
  ...Configuration.state,
}
const getters = {
  ...Channe.getters,
  ...Host.getters,
  ...Configuration.getters,
}
const mutations = {
  ...Channe.mutations,
  ...Host.mutations,
  ...Configuration.mutations,
}

const actions = {
  ...Channe.actions,
  ...Host.actions,
  ...Configuration.actions,
}

export default {
  state,
  mutations,
  actions,
  getters
}
