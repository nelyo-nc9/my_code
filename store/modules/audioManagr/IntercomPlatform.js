
const state = {
    parentComponent: 'IntercomPlatform',
    childrenComponent: 'list',
    combinationName: 'IntercomPlatform-List',
    isCreateBtnShow: true,
    isCloseBtnShow: false
}
const getters = {

}
const mutations = {
    // 点击侧导航切换页面
    AUDIO_TAB (state, data) {
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
