// const state = {
//         parentComponent: 'headOffice',
//         childrenComponent: 'List',
//         combinationName: 'headOffice-List',
//         isCreateBtnShow: true,
//         isCloseBtnShow: false
//     }
//     const getters = {

//     }
//     const mutations = {
//         // 点击侧导航切换页面
//         CHANGE_TAB1 (state, data) {
//             console.log('/////xxxxxxxxxxxxxx',state, data)

//             state.combinationName = data
//             state.parentComponent = data.split('-')[0]   //par
//             state.childrenComponent = data.split('-')[1] //child
//         },
//         CHANGE_EXA_BTN (state) {
//             state.isCreateBtnShow = true
//             state.isCloseBtnShow = false
//         }
//     }

//     const actions = {
//
//     }

//     export default {
//         state,
//         mutations,
//         actions,
//         getters
//     }
