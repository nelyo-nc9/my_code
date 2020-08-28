import {
  getDayDatasApi,
  getAlarmDataApi,
  getHourDataApi,
  alarmTypeApi
} from '../../../http/fireVisualization/fireDetail.api'

const state = {
  countNums: {
    total: 0,
    level1: 0,
    level2: 0
  },
  hourData: {},
  nums: 1,
  tableData: [],
  pageInfo: {
    pageCount: 4,
    pageNum: 1,
    pageSize: 10,
    sum: 0
  },
  alarmType: [],
  chooseAlarmType: -1,
  treeOptions: {},
  alarmLeavl: -1,
  alarmState: -1
}

const getters = {}

const mutations = {
  getNum(state, payload = '{}') {
    // console.log(JSON.parse(payload))
    state.countNums = JSON.parse(payload)
    // console.log(state)
  },
  getHourData(state, payload = {}) {
    state.hourData = payload
  },
  getTableData(state, payload = []) {
    state.tableData = payload
  },
  getPageData(state, payload = {}) {
    state.pageInfo = payload
  },
  getAlarmType(state, payload) {
    state.alarmType = payload
  },
  changeChooseType(state, payload) {
    //报警类型
    state.chooseAlarmType = payload
  },
  changeleavl(state, payload) {
    //报警等级
    state.alarmLeavl = payload
  },
  changeState(state, payload) {
    //处理状态
    state.alarmState = payload
  },
  changeTreeOptions(state, payload) {
    state.treeOptions = payload
  }
}

const actions = {
  //获取每日报警数
  getDayCount({ commit }, payload) {
    getDayDatasApi(payload).then(res => {
      console.log('获取每日报警数', res)
      if (res.data.data.count) {
        commit('getNum', res.data.data.count)
      }
    })
  },

  //获取报警数据
  getAlarmFilter({ commit }, payload) {
    getAlarmDataApi(payload).then(res => {
      console.log(res)
      if (res.data.data.results) {
        res.data.data.results.forEach((item, index) => {
          item.index = (res.data.data.page.pageNum - 1) * res.data.data.page.pageSize + index + 1
        })
        commit('getTableData', res.data.data.results)
        commit('getPageData', res.data.data.page)
      } else {
        commit('getTableData', [])
      }
    })
  },

  //获取每小时报警数量
  getHourCount({ commit }, payload) {
    getHourDataApi(payload).then(res => {
      console.log('hour：', res)
      if (res.data.data) {
        commit('getHourData', res.data.data)
      }
    })
  },

  //获取报警类型
  getAlarmCon({ commit }, payload) {
    alarmTypeApi(payload).then(res => {
      console.log('type：', res)
      if (res.data.data) {
        commit('getAlarmType', res.data.data)
      }
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
