
const state = {
  componentId: 'EquipmentList',
  idsObj: '', //修改参数id,
  isShowMove: false,//迁移判断
  isShowMoveObj: {},//迁移Obj,
  title:'',//新建页面表单标题


}
const getters = {

}
const mutations = {
  SET_EQUIPMENT_COMPONENTID(state, data) {
    state.componentId = data
  },
  //修改参数id
  SETTERIDSOBG(state, data) {
    state.idsObj = data
  },
  //迁移判断
  ISSHOWMOVE(state, data) {
    state.isShowMove = data
  },
  //迁移Obj
  ISSHOWMOVEOBJ(state, data) {
    state.isShowMoveObj = data
  },
  //新建页面表单标题
  ADDTITLE(state, data){
    state.title = data
  },

}
const actions = {
}
export default {
  state,
  getters,
  mutations,
  actions
}
