import { getDataInfoApi, getVideoOperationLogApi, downVideoOperationLogApi } from '@src/http/video/videoConfig.api.js'
const state = {
  dataInfo: ['111'],
  objs: {
    queryList: [
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '1',
        type: '1'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '2',
        type: '1'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '3',
        type: '1'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '4',
        type: '1'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '5',
        type: '1'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '6',
        type: '2'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '7',
        type: '2'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '8',
        type: '2'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '9',
        type: '2'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '10',
        type: '2'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '18'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '19'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '20'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '21'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '22'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '23'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '24'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '25'
      },
      {
        moduleId: '1',
        childModuleId: '2',
        dictId: '26'
      }
    ]
  },
  doubleInfo: {
    // 设备
    BRANDS: [], // 品牌
    MODELS: {}, // 设备型号
    DEVICETYPE: [], // 设备类型
    TRANSPORTPROTOCOLS: [], // 传输协议
    PROTOCOL: [], // 接入协议
    // 视频资源
    RESOURCETYPEVIDEO: [], // 资源类型
    RESOURCEBRANDSVIDEO: [], // 资源品牌
    RESOURCEMODELSVIDEO: {}, // 资源型号
    TRANSPORTPROTOCOLSVIDEO: [], // 传输协议
    STREAMVIDEO: [], // 码流信息
    // 音频资源
    RESOURCETYPEAUDIO: [], // 资源类型
    RESOURCEBRANDSAUDIO: [], // 资源品牌
    RESOURCEMODELSAUDIO: {}, // 资源型号
    // 报警输入资源
    RESOURCETYPEVINPUT: [], // 资源类型
    RESOURCEBRANDSINPUT: [], // 资源品牌
    RESOURCEMODELSINPUT: {}, // 资源型号
    // 报警输出资源
    RESOURCETYPEOUTPUT: [], // 资源类型
    RESOURCEBRANDSOUTPUT: [], // 资源品牌
    RESOURCEMODELSOUTPUT: {} // 资源型号
  }
}

const getters = {
  // 设备
  BRANDS() {
    // 品牌
    return state.doubleInfo['BRANDS']
  },
  MODELS() {
    // 设备型号
    return state.doubleInfo['MODELS']
  },
  DEVICETYPE() {
    // 设备类型
    return state.doubleInfo['DEVICETYPE']
  },
  TRANSPORTPROTOCOLS() {
    // 传输协议
    return state.doubleInfo['TRANSPORTPROTOCOLS']
  },
  PROTOCOL() {
    // 接入协议
    return state.doubleInfo['PROTOCOL']
  },
  // 视频资源
  RESOURCETYPEVIDEO() {
    // 资源类型
    return state.doubleInfo['RESOURCETYPEVIDEO']
  },
  RESOURCEBRANDSVIDEO() {
    // 资源品牌
    return state.doubleInfo['RESOURCEBRANDSVIDEO']
  },
  RESOURCEMODELSVIDEO() {
    // 资源型号
    return state.doubleInfo['RESOURCEMODELSVIDEO']
  },
  TRANSPORTPROTOCOLSVIDEO() {
    // 传输协议
    return state.doubleInfo['TRANSPORTPROTOCOLSVIDEO']
  },
  STREAMVIDEO() {
    // 码流信息
    return state.doubleInfo['STREAMVIDEO']
  },
  // 音频资源
  RESOURCETYPEAUDIO() {
    // 资源类型
    return state.doubleInfo['RESOURCETYPEAUDIO']
  },
  RESOURCEBRANDSAUDIO() {
    // 资源品牌
    return state.doubleInfo['RESOURCEBRANDSAUDIO']
  },
  RESOURCEMODELSAUDIO() {
    // 资源型号
    return state.doubleInfo['RESOURCEMODELSAUDIO']
  },
  // 报警输入资源
  RESOURCETYPEVINPUT() {
    // 资源类型
    return state.doubleInfo['RESOURCETYPEVINPUT']
  },
  RESOURCEBRANDSINPUT() {
    // 资源品牌
    return state.doubleInfo['RESOURCEBRANDSINPUT']
  },
  RESOURCEMODELSINPUT() {
    // 资源型号
    return state.doubleInfo['RESOURCEMODELSINPUT']
  },
  // 报警输出资源
  RESOURCETYPEOUTPUT() {
    // 资源类型
    return state.doubleInfo['RESOURCETYPEOUTPUT']
  },
  RESOURCEBRANDSOUTPUT() {
    // 资源品牌
    return state.doubleInfo['RESOURCEBRANDSOUTPUT']
  },
  RESOURCEMODELSOUTPUT() {
    // 资源型号
    return state.doubleInfo['RESOURCEMODELSOUTPUT']
  }
}

const mutations = {
  SET_STATE(state, payload) {
    state[payload.key] = payload.value
  },
  SET_STATEDOUBLE(state, payload) {
    state[payload.key[0]][payload.key[1]] = payload.value
  }
}

const actions = {
  /*
   * 更新state属性
   */
  setState({ commit }, data) {
    commit(data)
  },
  /*
   * 获取数据字典
   */
  getDataInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      getDataInfoApi(data)
        .then(res => {
          let { code, data } = res.data
          if (code === 0) {
            data &&
              data.forEach(item => {
                if (item.dictId === '1') {
                  let DEVICETYPE = []
                  item.attr.forEach(i => {
                    DEVICETYPE.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({ type: 'SET_STATEDOUBLE', key: ['doubleInfo', 'DEVICETYPE'], value: DEVICETYPE })
                } else if (item.dictId === '2') {
                  let BRANDS = []
                  item.attr.forEach(i => {
                    BRANDS.push({
                      label: i.data,
                      value: i.englishName || i.data
                    })
                  })
                  commit({ type: 'SET_STATEDOUBLE', key: ['doubleInfo', 'BRANDS'], value: BRANDS })
                } else if (item.dictId === '3') {
                  let MODELS = {}
                  item.attr.forEach(i => {
                    if (MODELS[i.homeClass]) {
                      MODELS[i.homeClass].push({
                        label: i.data,
                        value: i.data,
                        sdk: i.sdkName ? i.sdkName : ''
                      })
                    } else {
                      MODELS[i.homeClass] = [
                        {
                          label: i.data,
                          value: i.data,
                          sdk: i.sdkName ? i.sdkName : ''
                        }
                      ]
                    }
                  })
                  commit({ type: 'SET_STATEDOUBLE', key: ['doubleInfo', 'MODELS'], value: MODELS })
                } else if (item.dictId === '4') {
                  let PROTOCOL = []
                  item.attr.forEach(i => {
                    PROTOCOL.push({
                      label: i.data,
                      value: i.data
                    })
                  })
                  commit({ type: 'SET_STATEDOUBLE', key: ['doubleInfo', 'PROTOCOL'], value: PROTOCOL })
                } else if (item.dictId === '5') {
                  let TRANSPORTPROTOCOLS = []
                  item.attr.forEach(i => {
                    TRANSPORTPROTOCOLS.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'TRANSPORTPROTOCOLS'],
                    value: TRANSPORTPROTOCOLS
                  })
                } else if (item.dictId === '6') {
                  let RESOURCETYPEVIDEO = []
                  item.attr.forEach(i => {
                    RESOURCETYPEVIDEO.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCETYPEVIDEO'],
                    value: RESOURCETYPEVIDEO
                  })
                } else if (item.dictId === '7') {
                  let RESOURCEBRANDSVIDEO = []
                  item.attr.forEach(i => {
                    RESOURCEBRANDSVIDEO.push({
                      label: i.data,
                      value: i.englishName || i.data
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEBRANDSVIDEO'],
                    value: RESOURCEBRANDSVIDEO
                  })
                } else if (item.dictId === '8') {
                  let RESOURCEMODELSVIDEO = {}
                  item.attr.forEach(i => {
                    if (RESOURCEMODELSVIDEO[i.homeClass]) {
                      RESOURCEMODELSVIDEO[i.homeClass].push({
                        label: i.data,
                        value: i.data
                      })
                    } else {
                      RESOURCEMODELSVIDEO[i.homeClass] = [
                        {
                          label: i.data,
                          value: i.data
                        }
                      ]
                    }
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEMODELSVIDEO'],
                    value: RESOURCEMODELSVIDEO
                  })
                } else if (item.dictId === '9') {
                  let TRANSPORTPROTOCOLSVIDEO = []
                  item.attr.forEach(i => {
                    TRANSPORTPROTOCOLSVIDEO.push({
                      label: i.data,
                      value: i.data
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'TRANSPORTPROTOCOLSVIDEO'],
                    value: TRANSPORTPROTOCOLSVIDEO
                  })
                } else if (item.dictId === '10') {
                  let STREAMVIDEO = []
                  item.attr.forEach(i => {
                    STREAMVIDEO.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({ type: 'SET_STATEDOUBLE', key: ['doubleInfo', 'STREAMVIDEO'], value: STREAMVIDEO })
                } else if (item.dictId === '18') {
                  let RESOURCETYPEAUDIO = []
                  item.attr.forEach(i => {
                    RESOURCETYPEAUDIO.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCETYPEAUDIO'],
                    value: RESOURCETYPEAUDIO
                  })
                } else if (item.dictId === '19') {
                  let RESOURCEBRANDSAUDIO = []
                  item.attr.forEach(i => {
                    RESOURCEBRANDSAUDIO.push({
                      label: i.data,
                      value: i.englishName || i.data
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEBRANDSAUDIO'],
                    value: RESOURCEBRANDSAUDIO
                  })
                } else if (item.dictId === '20') {
                  let RESOURCEMODELSAUDIO = {}
                  item.attr.forEach(i => {
                    if (RESOURCEMODELSAUDIO[i.homeClass]) {
                      RESOURCEMODELSAUDIO[i.homeClass].push({
                        label: i.data,
                        value: i.data
                      })
                    } else {
                      RESOURCEMODELSAUDIO[i.homeClass] = [
                        {
                          label: i.data,
                          value: i.data
                        }
                      ]
                    }
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEMODELSAUDIO'],
                    value: RESOURCEMODELSAUDIO
                  })
                } else if (item.dictId === '21') {
                  let RESOURCETYPEVINPUT = []
                  item.attr.forEach(i => {
                    RESOURCETYPEVINPUT.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCETYPEVINPUT'],
                    value: RESOURCETYPEVINPUT
                  })
                } else if (item.dictId === '22') {
                  let RESOURCEBRANDSINPUT = []
                  item.attr.forEach(i => {
                    RESOURCEBRANDSINPUT.push({
                      label: i.data,
                      value: i.englishName || i.data
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEBRANDSINPUT'],
                    value: RESOURCEBRANDSINPUT
                  })
                } else if (item.dictId === '23') {
                  let RESOURCEMODELSINPUT = {}
                  item.attr.forEach(i => {
                    if (RESOURCEMODELSINPUT[i.homeClass]) {
                      RESOURCEMODELSINPUT[i.homeClass].push({
                        label: i.data,
                        value: i.data
                      })
                    } else {
                      RESOURCEMODELSINPUT[i.homeClass] = [
                        {
                          label: i.data,
                          value: i.data
                        }
                      ]
                    }
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEMODELSINPUT'],
                    value: RESOURCEMODELSINPUT
                  })
                } else if (item.dictId === '24') {
                  let RESOURCETYPEOUTPUT = []
                  item.attr.forEach(i => {
                    RESOURCETYPEOUTPUT.push({
                      label: i.data,
                      value: Number(i.key)
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCETYPEOUTPUT'],
                    value: RESOURCETYPEOUTPUT
                  })
                } else if (item.dictId === '25') {
                  let RESOURCEBRANDSOUTPUT = []
                  item.attr.forEach(i => {
                    RESOURCEBRANDSOUTPUT.push({
                      label: i.data,
                      value: i.englishName || i.data
                    })
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEBRANDSOUTPUT'],
                    value: RESOURCEBRANDSOUTPUT
                  })
                } else if (item.dictId === '26') {
                  let RESOURCEMODELSOUTPUT = {}
                  item.attr.forEach(i => {
                    if (RESOURCEMODELSOUTPUT[i.homeClass]) {
                      RESOURCEMODELSOUTPUT[i.homeClass].push({
                        label: i.data,
                        value: i.data
                      })
                    } else {
                      RESOURCEMODELSOUTPUT[i.homeClass] = [
                        {
                          label: i.data,
                          value: i.data
                        }
                      ]
                    }
                  })
                  commit({
                    type: 'SET_STATEDOUBLE',
                    key: ['doubleInfo', 'RESOURCEMODELSOUTPUT'],
                    value: RESOURCEMODELSOUTPUT
                  })
                }
              })
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /*
   * 获取操作日志
   */
  getVideoOperationLog({ commit }, data) {
    return new Promise((resolve, reject) => {
      getVideoOperationLogApi(data['obj'], data['page']).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /*
   * 导出操作日志
   */
  downVideoOperationLog({ commit }, data) {
    return new Promise((resolve, reject) => {
      downVideoOperationLogApi(data).then(res => {
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
  mutations,
  actions,
  getters
}
