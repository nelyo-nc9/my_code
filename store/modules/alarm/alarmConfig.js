import {
    addAlarmHostApi,
    addAlarmHostBindApi,
    updataAlarmHostBindApi,
    addDetectorBindApi,
    updateAlarmHostApi,
    getAlarmLogListApi,
    getAlarmHostApi,
    getServerListApi,
    getAlarmTypeApi,
    getLogSubsystemApi,
    getAlarmHostBindApi,
    getDetectorBindApi,
    getSingleAlarmHostApi,
    getSearchAlarmHostApi,
    searchHostApi,
    sortAlarmHostApi,
    deleteAlarmHostApi,
    addDetectorApi,
    getDataDictBasicInfoApi,
    updateDetectorApi,
    getDetectorApi,
    getDetectorsApi,
    deleteDetectorApi,
    addOutputChanApi,
    updateOutputChanApi,
    getOutputChanApi,
    deleteOutputChanApi,
    addSubsystemApi,
    updateSubsystemApi,
    getSubsystemApi,
    deleteSubsystemApi,
    getPolicyConfigurationApi,
    putPolicyConfigurationApi,
    getAlarmLinkConfigApi,
    getAlarmLevelLinkVideoApi,
    putAlarmLevelLinkVideoApi,
    getAlarmNonFocusApi,
    putAlarmNonFocusApi,
    putAlarmEventRemindApi,
    getAlarmEventRemindApi,
    putAlarmLinkApi,
    getAlarmlinkApi,
    getTimeTemplateApi,
    moveAlarmHostApi,
    getAlarmHostOrderApi,
  getWallApi
} from '../../../http/alarm/alarmHostConfig.api'
const state = {
    componentId: 'AlarmList',
    updataHostInfo: [],
    skipToNum: 1
}
const getters = {

}
const mutations = {
    SET_COMPONENTID(state, data) {
        state.componentId = data
    },
    SET_SKIP_NUM(state, num) {
        state.skipToNum = num
    },
    SET_HOST_INFO(state, data) {
        state.updataHostInfo = data[0]
    }
}
const actions = {
    // 获取报警配置列表
    getAlarmLogList({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmLogListApi(payload).then(res => {
                // this.SET_ALARM_DEAL_TABLE_DATA(res.data)
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 添加报警主机
    addAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addAlarmHostApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警主机关联配置新增
    addAlarmHostBind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addAlarmHostBindApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警主机关联配置新增
    updataAlarmHostBind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            updataAlarmHostBindApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警主机关联配置新增
    addDetectorBind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addDetectorBindApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改报警主机
    updateAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            updateAlarmHostApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改报警主机
    moveAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            moveAlarmHostApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警主机排序
    sortAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            sortAlarmHostApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取报警主机列表
    getAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmHostApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 排序获取报警主机列表
    getAlarmHostOrder({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmHostOrderApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取服务器列表
    getHostServerList({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getServerListApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取服务器列表
    getAlarmType({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmTypeApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取日志子系统列表
    getLogSubsystem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getLogSubsystemApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警主机关联配置查询
    getAlarmHostBind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmHostBindApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDetectorBind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getDetectorBindApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取单个报警主机列表
    getSingleAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getSingleAlarmHostApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取根据各个条件查询列表
    getSearchAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getSearchAlarmHostApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取根据各个条件查询列表
    searchHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            searchHostApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除报警主机列表
    deleteAlarmHost({ commit }, payload) {
        return new Promise((resolve, reject) => {
            deleteAlarmHostApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 添加探测器
    addDetector({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addDetectorApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 添加探测器
    getDataDictBasicInfo({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getDataDictBasicInfoApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改探测器
    updateDetector({ commit }, payload) {
        return new Promise((resolve, reject) => {
            updateDetectorApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取探测器列表
    getDetector({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getDetectorApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取探测器列表
    getDetectors({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getDetectorsApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除探测器
    deleteDetector({ commit }, payload) {
        return new Promise((resolve, reject) => {
            deleteDetectorApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 添加输出通道
    addOutputChan({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addOutputChanApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改输出通道
    updateOutputChan({ commit }, payload) {
        return new Promise((resolve, reject) => {
            updateOutputChanApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取输出通道
    getOutputChan({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getOutputChanApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除输出通道
    deleteOutputChan({ commit }, payload) {
        return new Promise((resolve, reject) => {
            deleteOutputChanApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 添加子系统
    addSubsystem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            addSubsystemApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改子系统
    updateSubsystem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            updateSubsystemApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取子系统
    getSubsystem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getSubsystemApi(payload).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 删除子系统
    deleteSubsystem({ commit }, payload) {
        return new Promise((resolve, reject) => {
            deleteSubsystemApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取报警策略配置
    getPolicyConfiguration() {
        return new Promise((resolve, reject) => {
            getPolicyConfigurationApi().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 保存报警策略配置
    putPolicyConfiguration({ commit }, data) {
        return new Promise((resolve, reject) => {
            putPolicyConfigurationApi(data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警联动配置参数获取
    // getAlarmLinkConfig() {
    //   return new Promise((resolve, reject) => {
    //     getAlarmLinkConfigApi().then(res => {
    //       resolve(res.data)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    // 报警等级及联动录像配置获取
    getAlarmLevelLinkVideo() {
        return new Promise((resolve, reject) => {
            getAlarmLevelLinkVideoApi().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警等级及联动录像配置更新
    putAlarmLevelLinkVideo({ commit }, data) {
        return new Promise((resolve, reject) => {
            putAlarmLevelLinkVideoApi(data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警非重点时段获取
    getAlarmNonFocus() {
        return new Promise((resolve, reject) => {
            getAlarmNonFocusApi().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取时间模板
    getTimeTemplate() {
        return new Promise((resolve, reject) => {
            getTimeTemplateApi().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警非重点时段更新
    putAlarmNonFocus({ commit }, data) {
        return new Promise((resolve, reject) => {
            putAlarmNonFocusApi(data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 事件提醒获取
    getAlarmEventRemind() {
        return new Promise((resolve, reject) => {
            getAlarmEventRemindApi().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 事件提醒更新
    putAlarmEventRemind({ commit }, payload) {
        return new Promise((resolve, reject) => {
            putAlarmEventRemindApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警联动获取
    getAlarmlink({ commit }, payload) {
        return new Promise((resolve, reject) => {
            getAlarmlinkApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 报警联动更新
    putAlarmlink({ commit }, payload) {
        return new Promise((resolve, reject) => {
            putAlarmLinkApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
  getWall({ commit }, payload) {
        return new Promise((resolve, reject) => {
          getWallApi(payload).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
