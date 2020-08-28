
const state = {
    parentComponent: 'gatewayManage',
    childrenComponent: 'ownresManage',
    combinationName: 'gatewayManage-OwnresManage',
    isCreateBtnShow: true,
    isCloseBtnShow: false
}
const getters = {

}
const mutations = {
    // 点击侧导航切换页面
    SUPER_TAB (state, data) {
        state.combinationName = data
        state.parentComponent = data.split('-')[0]
        state.childrenComponent = data.split('-')[1]
    },
}

const actions = {
       
}

export default {
    state,
    mutations,
    actions,
    getters
}
