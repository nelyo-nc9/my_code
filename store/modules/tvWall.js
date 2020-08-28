import tvWallConfig from './tvWall/tvWallConfig'
const state = {
  ...tvWallConfig.state
}
const getters = {
  ...tvWallConfig.getters
}
const mutations = {
  ...tvWallConfig.mutations
}

const actions = {
  ...tvWallConfig.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}