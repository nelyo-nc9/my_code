import {
  getSystemOpsManagerApi,//获取数据字典
  //防护舱日志
  recordApi,  // 防护舱记录查询
  recordEventListApi,  // 防护舱事件列表 
  recordWarningListApi,  // 防护舱警告列表
  recordAllListApi,  //防护舱全部列表
  //防护舱管理
  getAccessChannelApi,  //获取指定机构/重点部位的通道列表
  getAccessChannelStatusApi,//统计指定机构/重点部位防护舱通道状态
  getAccessChannelIdApi,  //获取指定防护舱通道信息
  getRelationChannelApi,//获取指定防护舱主机/通道联动配置
  getChannelIdDoorApi,//获取指定防护舱通道关联主机【开门、关门等操作】
  ctldoorChannelApi,  //防护舱开关门
  getcabinstatusChannelApi,  //查询防护舱状态
  channelStartTalkApi,    //开始对讲
  channelCloseTalkApi,  //关闭对讲
  getMacApi,//查询指定mac地址的台麦主机
  ctlalarmoutputApi, //报警输出
  //防护舱配置
  getHostApi,  // 防护舱设备配置-获取
  addHostApi,  // 防护舱设备配置-新建
  getServiceListApi, //防护舱设备配置新建-接入服务器列表
  lookupApi,//防护舱设备配置查询
  listInfoApi,  // 防护舱设备配置列表修改、查看(表单+通道列表)
  getAddHostChannelApi,//防护舱通道获取（点击下载按钮获取）
  addHostChannelGetApi,//获取防护舱主机下远程通道
  addHostChannelAddApi,
  addHostChannelDeleteApi,
  addHostChannelUpdateApi,
  deleteHostApi,  // 防护舱设备配置-删除
  updateHostApi,// 防护舱设备配置修改
  sortHostApi,  // 防护舱设备配置-排序
  moveHostApi,  // 防护舱设备配置-迁移
  relevanceHostApi,  // 防护舱主机关联配置列表
  relevanceChannelApi, // 防护舱(通道)(输入)关联配置列表
  linkHostApi, //获取防护舱关联配置(主机和通道)
  linkageApi,//更新防护舱主机/通道联动配置

} from '../../../http/protectiveCabin/channe.api'


const state = {
  componentId: 'EquipmentList',
  //管理
  cityData: {},  // 获取指定机构/重点部位的通道列表
  AccessChannelIdData: {},  //获取指定防护舱通道信息
  ctldoorChannelData: {}, //防护舱开关门
  getcabinstatusChannelData: {},//查询防护舱状态
  channelStartTalkData: {},   //开始对讲
  channelCloseTalkData: {},  //关闭对讲
  //日志
  recordEventData: {}, // 防护舱事件列表
  recordWarningData: {},  //防护舱警告列表
  recordAllData: {},  //防护舱全部列表
  //配置
  getHostData: [],    // 防护舱设备配置-获取
  relevanceHostData: {}, // 防护舱主机关联配置列表
  relevanceChannelData: {}, //  防护舱(通道)(输入)关联配置列表


}
const getters = {

}
const mutations = {
  SET_EQUIPMENT_COMPONENTID (state, data) {
    state.componentId = data
  },

  // 获取指定机构/重点部位的通道列表
  CITYDATA (state, data) {
    state.cityData = data
  },
  //获取指定防护舱通道信息
  CHANNELIDDATA (state, data) {
    state.AccessChannelIdData = data
  },
  //防护舱开关门
  CTLDOORCHANNELDATA (state, data) {
    state.ctldoorChannelData = data
  },
  //查询防护舱状态
  GETCABINSTATUSCHANNELDATA (state, data) {
    state.getcabinstatusChannelData = data
  },
  //开始对讲
  CHANNELSTARTTALKDATA (state, data) {
    state.channelStartTalkData = data
  },
  //关闭对讲
  CHANNELCLOSETALKDATA (state, data) {
    state.channelCloseTalkData = data
  },






  // 防护舱事件列表
  RECORDEVENT (state, data) {
    state.recordEventData = data
  },
  //防护舱警告列表
  RECORDWARNING (state, data) {
    state.recordWarningData = data
  },
  //防护舱全部列表
  RECORDALL (state, data) {
    state.recordAllData = data
  },
  // 防护舱主机关联配置列表
  RELEVANCEHOSTDATA (state, data) {
    state.relevanceHostData = data
  },
  //  防护舱(通道)(输入)关联配置列表
  RELEVANCECHANNELDATA (state, data) {
    state.relevanceChannelData = data
  },
}
const actions = {
  //获取数据字典
  getSystemOpsManager ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getSystemOpsManagerApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 防护舱记录(日志查询)
  record ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      recordApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 防护舱事件列表
  recordEventList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      recordEventListApi(payload).then(res => {
        resolve(res.data)
        commit('RECORDEVENT', res.data.data)
        // console.log("vuex",res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 防护舱警告列表
  recordWarningList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      recordWarningListApi(payload).then(res => {
        resolve(res.data)
        commit('RECORDWARNING', res.data.data)
        // console.log("vuex",res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 防护舱全部列表
  recordAllList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      recordAllListApi(payload).then(res => {
        resolve(res.data)
        commit('RECORDALL', res.data.data)
        // console.log("vuex",res)
      }).catch(err => {
        reject(err)
      })
    })
  },




  // 获取指定机构/重点部位的通道列表
  getAccessChannel ({ commit }, cityDataObj) {
    return new Promise((resolve, reject) => {
      getAccessChannelApi(cityDataObj).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //统计指定机构/重点部位防护舱通道状态
  getAccessChannelStatus ({ commit }, cityDataObj) {
    return new Promise((resolve, reject) => {
      getAccessChannelStatusApi(cityDataObj).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  //获取指定防护舱通道信息
  getAccessChannelId ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAccessChannelIdApi(payload).then(res => {
        resolve(res.data)
        commit('CHANNELIDDATA', res.data.data)
        // console.log("vuex", res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //获取指定防护舱主机/通道联动配置
  getRelationChannel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getRelationChannelApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //获取指定防护舱通道关联主机【开门、关门等操作】
  getChannelIdDoor ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getChannelIdDoorApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //防护舱开关门
  ctldoorChannel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      ctldoorChannelApi(payload).then(res => {
        if (res.data.data.code === 0) {
          this.$messageSuccess('开门成功')
        } else {
          this.$messageError(res.data.message)
        }
        resolve(res.data)
        commit('CTLDOORCHANNELDATA', res.data.data)
        // console.log("vuex",res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //查询防护舱状态
  getcabinstatusChannel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getcabinstatusChannelApi(payload).then(res => {
        resolve(res.data)
        commit('GETCABINSTATUSCHANNELDATA', res.data.data)
        // console.log("vuex",res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //开始对讲
  channelStartTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      channelStartTalkApi(payload).then(res => {
        resolve(res.data)
        commit('CHANNELSTARTTALKDATA', res.data.data)
        // console.log("vuex",res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //关闭对讲
  channelCloseTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      channelCloseTalkApi(payload).then(res => {
        resolve(res.data)
        commit('CHANNELCLOSETALKDATA', res.data.data)
        // console.log("vuex",res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //查询指定mac地址的台麦主机
  getMac ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getMacApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  //报警输出
  ctlalarmoutput ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      ctlalarmoutputApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },


  // 防护舱设备配置-获取
  getHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },


  // 防护舱设备配置-新建
  addHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //防护舱设备配置新建-接入服务器列表
  getServiceList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getServiceListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  //防护舱设备配置查询
  lookup ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      lookupApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 防护舱设备配置列表修改、查看(表单+通道列表)
  listInfo ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      listInfoApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //获取防护舱主机下远程通道
  addHostChannelGet ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addHostChannelGetApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //防护舱通道获取（点击下载按钮获取）
  getAddHostChannel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAddHostChannelApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //小按钮-增
  addHostChannelAdd ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addHostChannelAddApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //小按钮-删
  addHostChannelDelete ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addHostChannelDeleteApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //小按钮-修改
  addHostChannelUpdate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addHostChannelUpdateApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 防护舱设备配置-删除
  deleteHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      deleteHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 防护舱设备配置-修改
  updateHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      updateHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 防护舱设备配置-排序
  sortHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sortHostApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 防护舱设备配置-迁移
  moveHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      moveHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },



  // 防护舱主机关联配置列表
  relevanceHost ({ commit }, relevanceHostDataObj) {
    return new Promise((resolve, reject) => {
      relevanceHostApi(relevanceHostDataObj).then(res => {
        resolve(res.data)
        commit('RELEVANCEHOSTDATA', res.data.data)
        // console.log("vuex",res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //  防护舱(通道)(输入)关联配置列表
  relevanceChannel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      relevanceChannelApi(payload).then(res => {
        resolve(res.data)
        commit('RELEVANCECHANNELDATA', res.data.data)
        // console.log("vuex",res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  //  获取指定防护舱主机/通道联动配置
  linkHost ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      linkHostApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //  更新防护舱主机/通道联动配置
  linkage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      linkageApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },


}
export default {
  state,
  getters,
  mutations,
  actions
}

