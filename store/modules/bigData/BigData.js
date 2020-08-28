import {
  getAllCount,
  getTvCount,
  getNowDayCount,
  getNowAndToChange,
  getTvEventApi,
  getEventApi,
  doorLineApi,
  doorDayAndYesApi,
  doorBranchCountApi,
  doorEventCountApi,
  doorEventHourCountApi,
  audioLineApi,
  audioDayAndYesApi,
  audioBranchCountApi,
  audioEventCountApi,
  audioEventHourCountApi
} from '../../../http/alarmBigData/bigDataDetail.api'

const state = {
  titleName: '',
  branchList: [],
  allCount: 10,
  tvTotal: [],
  dayNowCount: {}, // 今日在线离线数据
  dayNowAndTos: {}, // 昨天今天同比在线状态
  tvBranchCount: {}, // 视频事件分布
  eventCount: {}, // 视频每半小时统计

  doorLineCount: {}, // 门禁主机在线离线
  doorDayYesCount: {}, // 门禁主机今日昨日对比
  doorBranchCount: {}, // 门禁主机分布数量
  doorBranchEventCount: {}, // 门禁主机事件分布数量
  doorEventCount: {}, // 门禁主机事件半小时统计

  audioLineCount: {}, // 门禁主机在线离线
  audioDayYesCount: {}, // 门禁主机今日昨日对比
  audioBranchCount: {}, // 门禁主机分布数量
  audioBranchEventCount: {}, // 门禁主机事件分布数量
  audioEventCount: {}// 门禁主机事件半小时统计
}

function changeThis() {
  sessionStorage.setItem('alarm_bigdata_store', JSON.stringify(state))
}

const getters = {}

const mutations = {
  changeTitle(state, payload) {
    state.titleName = payload.titleName
    changeThis()
  },
  changeCountList(state, payload) {
    state.allCount = payload
    changeThis()
  },
  totalEveryCount(state, payload) {
    state.tvTotal = payload
    changeThis()
  },
  dayCountNow(state, payload) {
    state.dayNowCount = payload
    changeThis()
  },
  dayNowAndTo(state, payload) {
    state.dayNowAndTos = payload
    changeThis()
  },
  tvCount(state, payload) {
    state.tvBranchCount = payload
    changeThis()
  },
  eventCount(state, payload) {
    state.eventCount = payload
    changeThis()
  },

  doorLine(state, payload) {
    state.doorLineCount = payload
    changeThis()
  },
  doorDayAndYes(state, payload) {
    state.doorDayYesCount = payload
    changeThis()
  },
  doorBranchCount(state, payload) {
    state.doorBranchCount = payload
    changeThis()
  },
  doorBranchEvent(state, payload) {
    state.doorBranchEventCount = payload
    changeThis()
  },
  doorEventHourCount(state, payload) {
    state.doorEventCount = payload
    changeThis()
  },

  audioLine(state, payload) {
    state.audioLineCount = payload
    changeThis()
  },
  audioDayAndYes(state, payload) {
    state.audioDayYesCount = payload
    changeThis()
  },
  audioBranchCount(state, payload) {
    state.audioBranchCount = payload
    changeThis()
  },
  audioBranchEvent(state, payload) {
    state.audioBranchEventCount = payload
    changeThis()
  },
  audioEventHourCount(state, payload) {
    state.audioEventCount = payload
    changeThis()
  }
}

const actions = {
  /**
   * 视频主机
   */
  // 获取视频主机总数
  getAllcount({ commit }, payload) {
    getAllCount(payload).then(res => {
      console.log('视频总数：', res)
      commit('changeCountList', res.data.data.hostTotal)
    })
  },
  // 获取视频主机分布数量
  getEveryCount({ commit }, payload) {
    getTvCount().then(res => {
      console.log('分布视频总数：', res)
      if (res.data.data) {
        const arr = []
        let total = 0
        res.data.data.forEach(item => {
          arr.push({
            value: item.total,
            name: item.name,
            type: item.type
          })
          total += item.total
        })
        commit('changeCountList', total)
        commit('totalEveryCount', arr)
      }
    })
  },
  // 获取视频主机在线运行状态
  getDayNowCounts({ commit }, payload) {
    getNowDayCount().then(res => {
      console.log('今日在线离线：', res)
      if (res.data.data) {
        const newObj = {
          online: res.data.data.online,
          offline: res.data.data.offline,
          time: res.data.data.time
        }
        commit('dayCountNow', newObj)
      }
    })
  },
  // 获取视频主机运行状态昨日今日对比分析
  getDayAndTomCounts({ commit }, payload) {
    getNowAndToChange().then(res => {
      console.log('昨天今天同比在线状态：', res)
      if (res.data.data) {
        const obj = {
          day: res.data.data.today.online,
          yesterday: res.data.data.yesterday.online,
          time: res.data.data.today.time
        }
        commit('dayNowAndTo', obj)
      }
    })
  },
  // 视频事件分布
  getTvEventCount({ commit }, payload) {
    getTvEventApi(payload).then(res => {
      console.log('事件分布：', res.data.data)
      if (!res.data.data) {
        return
      }
      const objArr = {
        data: [],
        total: 0
      };
      let countTotal = 0;
      res.data.data.name.forEach((item, index) => {
        objArr.data.push({
          value: res.data.data.eventNum[index],
          name: item
        })
        countTotal += res.data.data.eventNum[index]
      })

      objArr.total = countTotal
      commit('tvCount', objArr)
    })
  },
  // 获取视频主机事件分析
  getEventCount({ commit }, payload) {
    getEventApi(payload).then(res => {
      console.log('事件分析：', res)
      if (!res.data.data) {
        return
      }
      const newObj = {
        input: [],
        miss: [],
        exception: []
      }

      newObj.input = res.data.data.io
      newObj.miss = res.data.data.lo
      newObj.exception = res.data.data.tr
      commit('eventCount', newObj)
    })
  },

  /**
   * 门禁主机
   */
  // 在线离线状态
  getDoorLineState({ commit }, payload) {
    doorLineApi(payload).then(res => {
      console.log('门禁主机在线离线状态：', res)
      if (res.data.data) {
        const newObj = {
          online: res.data.data.online,
          offline: res.data.data.offline,
          time: res.data.data.time
        }
        commit('doorLine', newObj)
      }
    })
  },
  // 今日昨日对比
  getDoorDayAndYer({ commit }, payload) {
    doorDayAndYesApi(payload).then(res => {
      console.log('门禁主机今日昨日对比：', res)
      if (!res.data.data) {
        return
      }
      const obj = {
        day: res.data.data.today.online,
        yesterday: res.data.data.yesterday.online,
        time: res.data.data.today.time
      }
      commit('doorDayAndYes', obj)
    })
  },
  // 重点部位分布数量
  getDoorBranchCount({ commit }, payload) {
    doorBranchCountApi(payload).then(res => {
      console.log('门禁主机重点部位分布统计：', res)
      if (!res.data.data) {
        return
      }
      const arr = []
      let total = 0
      res.data.data.forEach(item => {
        arr.push({
          value: item.total,
          name: item.name
        })
        total += item.total
      })
      commit('changeCountList', total)
      commit('doorBranchCount', arr)
    })
  },
  // 重点部位事件分部
  getDoorBranchEventCount({ commit }, payload) {
    doorEventCountApi(payload).then(res => {
      console.log('事件分布：', res.data.data)
      if (!res.data.data) {
        return
      }
      const objArr = {
        data: [],
        total: 0
      }
      let countTotal = 0
      res.data.data.name.forEach((item, index) => {
        objArr.data.push({
          value: res.data.data.eventNum[index],
          name: item
        })
        countTotal += res.data.data.eventNum[index]
      })

      objArr.total = countTotal
      commit('doorBranchEvent', objArr)
    })
  },
  // 按半小时统计
  getDoorHourCount({ commit }, payload) {
    doorEventHourCountApi(payload).then(res => {
      console.log('门禁主机按半小时统计：', res.data.data)
      if (!res.data.data) {
        return
      }
      const newObj = {
        input: []
      }

      newObj.input = res.data.data.oc
      commit('doorEventHourCount', newObj)
    })
  },

  /**
   * 对讲主机
   */
  // 在线离线状态
  getAudioLineState({ commit }, payload) {
    audioLineApi(payload).then(res => {
      console.log('对讲主机在线离线状态：', res)
      if (res.data.data) {
        const newObj = {
          online: res.data.data.online,
          offline: res.data.data.offline,
          time: res.data.data.time
        }
        commit('audioLine', newObj)
      }
    })
  },
  // 今日昨日对比
  getAudioDayAndYer({ commit }, payload) {
    audioDayAndYesApi(payload).then(res => {
      if (!res.data.data) {
        return
      }
      const obj = {
        day: res.data.data.today.online,
        yesterday: res.data.data.yesterday.online,
        time: res.data.data.today.time
      }
      commit('audioDayAndYes', obj)
    })
  },
  // 重点部位分布数量
  getAudioBranchCount({ commit }, payload) {
    audioBranchCountApi(payload).then(res => {
      console.log('门禁主机重点部位分布统计：', res)
      if (!res.data.data) {
        return
      }
      const arr = []
      let total = 0
      res.data.data.forEach(item => {
        arr.push({
          value: item.total,
          name: item.name
        })
        total += item.total
      })
      commit('changeCountList', total)
      commit('audioBranchCount', arr)
    })
    // const obj = [
    //   { value: 12, name: '北京市' },
    //   { value: 56, name: '天津市' },
    //   { value: 24, name: '上海市' },
    //   { value: 26, name: '武汉市' }
    // ]
    // commit('audioBranchCount', obj)
  },
  // 重点部位事件分部
  getAudioBranchEventCount({ commit }, payload) {
    audioEventCountApi(payload).then(res => {
      console.log('事件分布：', res.data.data)
      if (!res.data.data) {
        return
      }
      const objArr = {
        data: [],
        total: 0
      }
      let countTotal = 0
      res.data.data.name.forEach((item, index) => {
        objArr.data.push({
          value: res.data.data.eventNum[index],
          name: item
        })
        countTotal += res.data.data.eventNum[index]
      })

      objArr.total = countTotal

      commit('audioBranchEvent', objArr)
    })
  },
  // 按半小时统计
  getAudioHourCount({ commit }, payload) {
    audioEventHourCountApi(payload).then(res => {
      console.log('对讲主机按半小时统计：', res.data.data)
      if (!res.data.data) {
        return
      }
      const newObj = {
        input: []
      }

      newObj.input = res.data.data.tk
      commit('audioEventHourCount', newObj)
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
