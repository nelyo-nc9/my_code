
import {postMicrophoneApi, postDeleteMemberApi ,postSaveGroupingApi ,postAddMemberApi, postEstablishApi} from '../../../http/audio/manyIntercom';
const state = {
    // componentId: 'AlarmList'
}
const getters = {

}
const mutations = {

}
const actions = {
    // 添加报警主机



    // 开始对讲接口
    postMicrophone({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postMicrophoneApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    //删除对讲组成员
    postDeleteMember({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postDeleteMemberApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 保存分组
    postSaveGrouping({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postSaveGroupingApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    
   

    
    // 添加对讲组成员
    postAddMember({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postAddMemberApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },


    // 创建音频日志记录
    postEstablish({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postEstablishApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}