import {
      talkbackListApi,
      talkbackHostListApi,
      createTalkbackListApi,
      searchTalkbackListApi,
      getTalkbackListApi,
      getChannelListApi,
      deletTalkbackListApi,
      getTalkbackLookListApi,
      getVoiceListApi,
      getHostLookApi,
      getHostListApi
} from "../../../http/audioManage/talkback.api"
  const state = {
     detailData:[]
  }
  const getters = {
  
  }
  const mutations = {
//        TALKBACK_LIST(state,data){
//         state.talkbackList=data
//       },
  }
  const actions = {  
    //获取对讲平台列表
     talkbackList({commit}, payload) {
       return new Promise((resolve, reject) => {
        talkbackListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
     //获取主机
     getHostList({commit}, payload) {
     return new Promise((resolve, reject) => {
       getHostListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
     //获取主机关联列表
     talkbackHostList({commit}, payload) {
     return new Promise((resolve, reject) => {
          talkbackHostListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
    //新建对讲平台
     createTalkbackList({commit}, payload) {
     return new Promise((resolve, reject) => {
          createTalkbackListApi(payload).then(res => {
               console.log(res);
               let {id}=res.data.data
               // getTalkbackListApi({id}).then(res=>{
               //    console.log(res)
               //    return res
               // })
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
    //查询对讲平台信息
    searchTalkbackList({commit}, payload) {
     return new Promise((resolve, reject) => {
          searchTalkbackListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
   getChannelList({commit}, payload) {
     return new Promise((resolve, reject) => {
          getChannelListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
   //删除对讲平台列表
   deletTalkbackList({commit}, payload) {
     return new Promise((resolve, reject) => {
          deletTalkbackListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
   //获取指定主机/通道联动配置
   getTalkbackLookList({commit}, payload) {
     return new Promise((resolve, reject) => {
          getTalkbackLookListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
   getVoiceList({commit}, payload) {
     return new Promise((resolve, reject) => {
          getVoiceListApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
   getHostLooklist({commit}, payload) {
     return new Promise((resolve, reject) => {
          getHostLookApi(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })   
      })
    },
    //获取查看平台列表
//     getTalkbackList({commit}, payload) {
//      return new Promise((resolve, reject) => {
//           getTalkbackListApi({id}).then(res => {
//                console.log(res)
//           resolve(res)
//         }).catch(err => {
//           reject(err)
//         })   
//       })
//     },
  
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }