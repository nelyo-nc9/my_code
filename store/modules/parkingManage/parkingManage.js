/*
 * @Author: your name
 * @Date: 2020-06-12 10:23:35
 * @LastEditTime: 2020-06-16 16:15:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\store\modules\parkingManage\pakingConfig.js
 */
import {
  getParkingRecordListApi,
  getParkingLogListApi,
  addParkPlatformApi,
  addParkConfigApi,
  deleteParkConfigApi,
  getParkConfigApi,
  updateParkConfigApi,
  getRealTimeBlackListApi,
  getParkHostListApi,
  getParkPlatformApi,
  deleteParkPlatformApi,
  updateParkPlatformApi,
  exportParkPlatformApi,
  updateParkHostApi,
  getDetailApi,
  setControlApi,
  queryDataDictBasicInfoApi,
  getHostListApi,
  addParkHostApi,
  getinfoApi,
  controlApi,
  getHostLinkageListApi,
  getHostOrResourceApi,
  setHostOrResourceApi
} from '../../../http/parkingManage/parkingRecord.api'
const state = {
  parentComponent: 'platformConfig',
  childrenComponent: 'list',
  combinationName: 'platformConfig-List',
  isCreateBtnShow: '',
  handleSelectionChangeArr: [], // 被选中的表格数据
  activeData: {}
}
const getters = {

}
const mutations = {
  // 点击侧导航切换页面
  CHANGE_TAB(state, data) {
    state.combinationName = data
    state.parentComponent = data.split('-')[0]
    state.childrenComponent = data.split('-')[1]
  },
  // 点击查看
  CHANGE_EXA_SAVE(state, data) {
    state.activeData = data
    state.handleSelectionChangeArr = []
  },
  // 点击保存按钮展示
  CHANGE_EXA_BTN(state, data) {
    state.isCreateBtnShow = data
  },
  // 表格中的数据编辑查看
  SELECTION_CHANGE_HTGHT(state, data) {
    state.handleSelectionChangeArr = data
  }
}

const actions = {
  // 查询实时过车今日黑名单和布控信息
  getRealTimeBlackList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getRealTimeBlackListApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 过车记录查询
  getParkingRecordList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getParkingRecordListApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 停车日志查询
  getParkingLogList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getParkingLogListApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 平台配置-新建
  addParkPlatform({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addParkPlatformApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 平台配置--停车平台列表查询
  getParkPlatform({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getParkPlatformApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 平台配置-删除停车平台
  deleteParkPlatform({ commit }, payload) {
    return new Promise((resolve, reject) => {
      deleteParkPlatformApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 停车平台编辑
  updateParkPlatform({ commit }, payload) {
    return new Promise((resolve, reject) => {
      updateParkPlatformApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 停车平台导出
  exportParkPlatform({ commit }, payload) {
    return new Promise((resolve, reject) => {
      exportParkPlatformApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 查询停停车主机
  getParkHost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getParkHostListApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 编辑停车主机
  updateParkHost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      updateParkHostApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 车辆配置-新建
  addParkConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addParkConfigApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 车辆配置-编辑
  updateParkConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      updateParkConfigApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 车辆配置-查询
  getParkConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getParkConfigApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 车辆配置-删除
  deleteParkConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      deleteParkConfigApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // --------------------分割线--------------
  // 查询过车记录详情
  getDetailList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getDetailApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 确认/拒绝通行
  setControl({ commit }, payload) {
    return new Promise((resolve, reject) => {
      setControlApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // queryDataDictBasicInfoApi
  queryDataDictBasicInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      queryDataDictBasicInfoApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 根据停车平台获取该平台下的主机信息
  getPlatformHostList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getHostListApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 批量保存停车主机信息
  batchSaveParkHost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      addParkHostApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // 关联配置-----------------------------分割线-------------------------
  // 获取停车主机关联配置列表
  getHostLinkageList({ commit }, payload) {
    return new Promise((resolve, reject) => {
        getHostLinkageListApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // getinfo停车登录
  getLogininfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getinfoApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  // controlApi控制闸机接口controlApi
  getControlInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
        controlApi(payload)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
   // 获取视频关联信息 
   getHostOrResource ({ commit }, payload) {
    return new Promise((resolve, reject) => {
        getHostOrResourceApi(payload.id, { ref: payload.ref }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改创建关联配置
  setHostOrResource ({ commit }, payload) {
    return new Promise((resolve, reject) => {
        setHostOrResourceApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  } 
}

export default {
  state,
  mutations,
  actions,
  getters
}
