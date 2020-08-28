/**
 * author wangpengcheng
 */
import {
  alarmCountApi,
  alarmPortantApi,
  alarmDayAndYestApi,
  alarmAddressApi
} from '../../../http/alarmBigData/alarmDataApi'

const classAlarm = {
  cabin: '防护舱报警',
  guard: '门禁报警',
  intercom: '对讲报警',
  intrusion: '入侵报警',
  park: '停车场报警',
  passageway: '出入口报警',
  smart: '智能报警',
  video: '视频报警'
}

const state = {
  countObj: {
    isFocus: 0,
    alarmInfoTotal: 0,
    done: 0,
    toDo: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    levelLocal: 0,
    levelUp: 0,
    level1Done: 0,
    level2Done: 0,
    level3Done: 0,
    level4Done: 1,
    level5Done: 0,
    levelLocalDone: 0,
    levelUpDone: 0,
    level1ToDo: 0,
    level2ToDo: 1,
    level3ToDo: 2,
    level4ToDo: 1,
    level5ToDo: 2,
    levelLocalToDo: 0,
    levelUpToDo: 0,
    percentage: 30
  },
  countPortant: {
    name: [],
    count: []
  },
  countDayAndYesterday: {
    todayCount: [],
    yesterdayCount: [],
    nameArr: []
  },
  countAddress: {
    name: [],
    count: []
  }
}

const getters = {}

const mutations = {
  // 报警统计
  Alarm_count(state, payload) {
    state.countObj = payload
  },
  // 重点部位统计
  Alarm_portant(state, payload) {
    state.countPortant = payload
  },
  // 报警分类昨日今日分析比较
  Alarm_dayAndYesterday(state, payload) {
    state.countDayAndYesterday = payload
  },
  Alarm_address(state, payload) {
    state.countAddress = payload
  }
}

const actions = {
  // 获取报警统计
  getAlarmCount({ commit }, payload) {
    return alarmCountApi(payload).then(res => {
      console.log('报警统计：', res)
      if (res.data.data.count) {
        commit('Alarm_count', res.data.data.count)
      }
    })
  },
  // 重点部位统计分析
  getAlarmPortantCount({ commit }, payload) {
    return alarmPortantApi(payload).then(res => {
      console.log('重点部位：', res)
      if (res.data.data.count) {
        const countObj = {
          name: [],
          count: []
        }
        res.data.data.count.forEach(item => {
          countObj.name.push(item.name || '234')
          countObj.count.push(item.count)
        })
        commit('Alarm_portant', countObj)
      }
    })
  },
  // 报警分类昨日今日分析比较
  getAlarmDayAndYestCount({ commit }, payload) {
    return alarmDayAndYestApi(payload).then(res => {
      console.log('今日昨日:', res)
      if (res.data.data) {
        const newObj = {
          todayCount: [],
          yesterdayCount: [],
          nameArr: []
        }
        Object.keys(res.data.data.today).forEach(item => {
          newObj.nameArr.push(classAlarm[item])
          newObj.todayCount.push(res.data.data.today[item])
          newObj.yesterdayCount.push(res.data.data.yesterday[item])
        })
        commit('Alarm_dayAndYesterday', newObj)
      }
    })
  },
  // 报警区域对比分析
  getAlarmAddressCount({ commit }, payload) {
    return alarmAddressApi(payload).then(res => {
      console.log('区域对比分析：', res)
      const countObj = {
        name: [],
        count: []
      }
      if (res.data.data && res.data.data.count) {
        res.data.data.count.forEach(item => {
          countObj.name.push(item.name || '234')
          countObj.count.push(item.count)
        })
      }

      commit('Alarm_address', countObj)
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
