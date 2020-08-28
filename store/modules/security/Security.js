import { getSecurityBranchApi } from '../../../http/fireVisualization/fireDetail.api'

const state = {
  tableData: [],
  dataed: []
}

const getters = {}

const getKeyObj = (arr, key, value) => {
  console.log(key, value)
  let arrObj = {}
  arr.forEach(item => {
    console.log('item', item)
    if (item[key] === value) {
      console.log(123)
      arrObj = item
    }
    if (item.children.length > 0) {
      getKeyObj(item.children, key, value)
    }
  })
  return arrObj
}

const changeChildren = (oldArr, newObj, key, value) => {
  oldArr.forEach(item => {
    if (item[key] === value && newObj[key] === value) {
      item = newObj
    }
    if (item.children.length > 0) {
      changeChildren(item, newObj, key, value)
    }
  })
}

const mutations = {
  changeTableData(state, payload) {
    state.tableData = payload.table_data
  },
  changeTreeData(state, payload) {
    payload.forEach(item => {
      if (item.isRoot) {
        const obj = {
          label: item.name,
          treeid: 1,
          id: item.orgId,
          children: []
        }
        state.dataed.push(obj)
      } else {
        const arrObj = getKeyObj(state.dataed, 'id', item.parentId)
        console.log(arrObj)
        const obj = {
          label: item.name,
          treeid: arrObj.treeid + 1,
          id: item.orgId,
          children: []
        }
        arrObj.children.push(obj)
        changeChildren(state.dataed, arrObj, 'id', item.parentId)
      }
    })
    console.log(state.dataed)
  }
}

const actions = {
  //获取dom树
  getTreeList({ commit }, payload) {
    getSecurityBranchApi(payload).then(res => {
      console.log(res)
      commit('changeTreeData', res.data.data.nodes)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
