/*
 * @Author: fengbeibei
 * @Date: 2020-05-19 14:56:13
 * @LastEditTime: 2020-05-28 14:43:35
 * @LastEditors: fengbeibei
 * @Description: 电子地图-地图应用-状态管理
 */
import alarm from './map2D/alarm'
import mapIndex from './map2D/index'
import mapPoint from './map2D/point'
import pointMapShow from './map2D/pointMapShow'
import mapPanelSearch from './map2D/panelSearch'

const state = {
}
const getters = {
}
const mutations = {
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    alarm,
    mapIndex,
    mapPoint, // 点位信息状态管理-地图编辑
    mapPanelSearch,
    pointMapShow // 点位信息状态管理-地图应用
  }
}
