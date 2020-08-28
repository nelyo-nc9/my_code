
import { postBeginTalkbackApi, postCloseTalkbackApi, postOpenVoicetubeApi, getFrequencyApi, getPagingApi, postOpenTheneDoorApi , postCloseTheneDoorApi ,getDownloadApi,postRelevanceApi} from '@http/audio/resource';
const state = {
    // componentId: 'AlarmList'
}
const getters = {

}
const mutations = {

}
const actions = {
    // 添加报警主机



    //-------------------------------
    //    模板
    //     lsqFnc({commit}, payload) {
    //       console.log(payload,21)
    //       return new Promise((resolve, reject) => {
    //         lsq(payload).then(res => {
    //           resolve(res.data)
    //         }).catch(err => {
    //           reject(err)
    //         })
    //       })
    //     }

    // 面板开始对讲接口
    postBeginTalkback({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postBeginTalkbackApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 关闭对讲接口
    postCloseTalkbac({ commit }, payload) {

        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postCloseTalkbackApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 开启话筒对讲接口
    postOpenVoicetube({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postOpenVoicetubeApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 获取音频平台
    getFrequency({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            getFrequencyApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 获取指定平台主机列表
    // getAppointPlatform({ commit }, payload) {
    //     console.log(payload, 21)
    //     return new Promise((resolve, reject) => {
    //         getAppointPlatformApi(payload).then(res => {
    //             resolve(res)
    //         }).catch(err => {
    //             reject(err)
    //         })
    //     })
    // },

    // 列表分页请求
    getPaging({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            getPagingApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 开门
    postOpenTheneDoor({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postOpenTheneDoorApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 关门
    postCloseTheneDoor({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postCloseTheneDoorApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 下载
    getDownload({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            getDownloadApi(payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 关联设备
    postRelevance({ commit }, payload) {
        console.log(payload, 21)
        return new Promise((resolve, reject) => {
            postRelevanceApi(payload).then(res => {
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
    getters,
    mutations,
    actions
}
