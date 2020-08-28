import { brandOrModelNum } from '@src/http/access/getId'

const state = {
  treeInfo: {},
  brand: [],
  modelNum: [],
  logAccess: [],
  comDatas: {}
}
// let result;
// let modelNums;
const actions = {
  getBrand({ commit }, body) {
    brandOrModelNum(body).then(res => {
      commit('brandModelNum', res)
    })
  },
  getTreeObj({ commit }, payload) {
    commit('GETINFO', payload)
  },
  getMol({ commit }, body) {
    brandOrModelNum({ body }).then(res => {
      commit('modelNums', res)
    })
  }
}

const mutations = {
  getinfo(state, result) {
    state.treeInfo = result
  },
  brandModelNum(state, result) {
    result.data.data.forEach((item, index) => {
      if (item.dictId == '1') {
        item.attr.forEach(i => {
          state.brand.push({
            label: i.data,
            value: i.serialNum
          })
        })
      }
    })
  },
  modelNums(state, result) {
    result.data.data.forEach((item, index) => {
      item.attr.forEach(i => {
        state.modelNum.push({
          label: i.data,
          value: i.serialNum
        })
      })
    })
  },
  comData(state, result) {
    state.comDatas = result
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
