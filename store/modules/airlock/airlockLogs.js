// import {
//   getAirlockLogsListsApi,
//   exportLogsListsApi
// } from 'http/airlock/airlockLogs'

const state = {
  affiliatedInstitutionsOptions: [
    {
      value: '1',
      label: '11'
    },
    {
      value: '2',
      label: '22'
    }
  ],
  airlockLogLists: [
    {
      mechanism: '所属机构',
      keyParts: '重点部位',
      equipment: '门禁主机',
      jllx: '记录类型',
      sjlx: '事件类型',
      bjlx: '报警类型',
      startTime: '2020/05/11 12:05:00'
    },
    {
      mechanism: '所属机构',
      keyParts: '重点部位',
      equipment: '门禁主机',
      jllx: '记录类型',
      sjlx: '事件类型',
      bjlx: '报警类型',
      startTime: '2020/05/11 12:05:00'
    }
  ],
  selectedLogLists: [], // 选中的日志集合
  defaultFormData: {
    affiliatedInstitutions: '',
    keyParts: '',
    equipment: '',
    eventType: '',
    recordType: '',
    alarmType: ''
  }
}

const getters = {
  /*
   * 日志列表
   */
  airlockLogLists(state) {
    return state.airlockLogLists
  },
  /*
   * 选中的日志集合
   */
  selectedLogLists(state) {
    return state.selectedLogLists
  }
}
const mutations = {
  /*
   * 更新日志列表数据
   */
  SET_AIRLOCK_LOG_LISTS(state, data) {
    state.airlockLogLists = data
  },
  /*
  * 更新选中的日志集合
  */
  SET_SELECTED_LOG_LISTS(state, data) {
    state.selectedLogLists = data
  }
}

const actions = {
  /*
   * 更新日志列表数据
   */
  setAirlockLogLists({ commit }, data) {
    commit('SET_AIRLOCK_LOG_LISTS', data)
  },
  /*
  * 更新选中的日志集合
  */
  setSelectedLogLists({ commit }, data) {
    commit('SET_SELECTED_LOG_LISTS', data)
  },
  /*
   * 获取日志列表数据
   */
  getAirlockLogsLists({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.getAirlockLogsListsApi(data).then(res => {
        commit('SET_AIRLOCK_LOG_LISTS', res.data)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 导出日志列表数据
   */
  exportLogsLists({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.exportLogsListsApi(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
