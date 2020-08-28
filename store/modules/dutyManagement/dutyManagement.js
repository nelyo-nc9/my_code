/*
 * @Author:   脱朝平
 * @Date: 2020-06-01 21:18:14
 * @LastEditTime: 2020-06-02 09:50:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\store\modules\dutyManagement\dutyManagement.js
 */
import {
  editShiftInfoApi
} from '../../../http/dutyManagement/dutyManagement.api'
const state = {
  // 重点关注事项
  keyConcernsShow: false,
  // 接班弹窗
  dutyVisible: false,
  // 交班状态
  shiftStatus: false,
  id: '' // 下一个接班员用来查询接班日志的主键ID

}
const getters = {}
const mutations = {
  // 重点关注事项表单
  SET_KEY_CONCERNS_SHOW(state, payload) {
    state.keyConcernsShow = payload
  },
  SET_DUTY_MODEL_SHOW(state, payload) {
    state.dutyVisible = payload
  },
  SET_DUTY_STATUS(state, payload) {
    state.shiftStatus = payload
  },
  SET_CHECK_DETAIL_ID(state, payload) {
    state.id = payload
  }
}

const actions = {
  /*
   * 修改交接班表信息
   */
  editShiftInfoApi({ commit, payload }, param) {
    return new Promise((resolve, reject) => {
      editShiftInfoApi(param).then(res => {
        resolve(res.data)
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
