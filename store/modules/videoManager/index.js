import preview from './preview'
import recordConfig from './recordConfig'
import videoConfig from './videoConfig'

const state = {}
const getters = {}
const mutations = {}
const modules = {
  preview,
  recordConfig,
  videoConfig
}

const actions = {}

export default {
  namespaced: true,
  state,
  modules,
  mutations,
  actions,
  getters
}
