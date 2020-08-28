/*
 * @Author: SongXiaoshan
 * @Date: 2020-06-18 10:45:30
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2020-07-29 20:12:53
 */
import {Message} from 'element-ui';
import {
  getTimeTemplateListApi, // 获取时间模板列表
  getStorageServersApi, // 获取存储服务器下拉框数据
  getClassApi,
  getStorageLocApi
} from '@src/http/video/recordConfig.api.js'
import _ from 'lodash'

const state = {
  channelClass:{ // 资源类型
    video:[] //视频资源
  },
  deviceClass:[],//设备类型
  // 变更模板
  changeComponent: {
    from: '', // 从哪个模板来
    to: '', // 到哪个模板去
    data: '' // data
  },
  // 存储路径备选项
  storagePathOption: [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12', value: 12 },
    { label: '13', value: 13 },
    { label: '14', value: 14 },
    { label: '15', value: 15 },
    { label: '16', value: 16 }
  ],
  storageLocOption:[],   //{ label: '营业网点存储服务', value: '1' }, { label: '计算中心存储服务', value: '2' },
  // 设备启用停用备选项
  deviceTypeOption: [
    { label: '启用', value: 1 },
    { label: '停用', value: 2 }
  ],
  // 录像码流备选项
  recordCodeOption: [
    { label: '主码流', value: 1 },
    { label: '子码流', value: 2 },
    { label: '第三码流', value: 3 }
  ],
  // 查看类型备选项
  patternOption: [
    { label: '按资源', value: 1 },
    { label: '按组织', value: 2 }
  ],
  // 存储服务器备选项
  storageServerOption: [],
  // 录像计划备选项
  recordPlanOption: [],
  // 查看类型 1-资源 2-组织
  pattern: 1
}

const mutations = {
  // 设置存储服务器data
  SET_STORAGE_SERVER(state, data) {
    state.storageServerOption = data
  },
  // 存储位置data
  SET_STORAGE_LOC(state, data) {
    state.storageLocOption=[];
    state.storageLocOption = data
  },
  // 设置录像计划data
  SET_RECORD_PLAN(state, data) {
    state.recordPlanOption = data
  },
  // 设置 变更模板
  SET_CHANGE_COMPONENT_DATA(state, data) {
    for (let key in data) {
      if (state.changeComponent.hasOwnProperty(key)) {
        state.changeComponent[key] = _.cloneDeep(data[key])
      }
    }
  },
  // 清空 变更模板
  CLEAR_CHANGE_COMPONENT_DATA(state, data) {
    state.changeComponent.from = ''
    state.changeComponent.to = ''
    state.changeComponent.data = ''
  },
  // 修改查看类型
  SET_PATTERN(state, data) {
    state.pattern = data
  },
  SET_DICTIONARY(state,data) {
    data.forEach((item)=> {
      if (item.dictId === '1') {
        state.deviceClass=[];
        item.attr.forEach(i => {
          state.deviceClass.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      }
      if (item.dictId === '6') {
        state.channelClass.video=[];
        item.attr.forEach(i => {
          state.channelClass.video.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      }
    });
  }
}

const actions = {
  // 获取存储服务器   //暂时没用了
  getStorageServer({ commit }) {
    getStorageServersApi()
      .then(res => {
        if (!res.data.code) {
          commit(
            'SET_STORAGE_SERVER',
            res.data.data.map(e => {
              return {
                value: e.id,
                label: e.name
              }
            })
          )
        } else {
          throw res.data.message
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 获取存储位置
  getStorageLoc({ commit }) {
    let reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    let ip = reg.exec(window.location.href)&&reg.exec(window.location.href)[0];
    getStorageLocApi({isInit:2,vedioType:2,hostIp:ip})  //
      .then(res => {
        if (!res.data.code) {
          commit(
            'SET_STORAGE_LOC',
            // 需要调整数据存成[{ value: e.id,label: e.name}]格式 
            res.data.data&&res.data.data.list&&res.data.data.list.map(e => {
              return {
                value: e.id,  // 待定id还是其他
                label: e.serverName
              }
            }) || []
          )
        } else {
          throw res.data.message
        }
      })
      .catch(err => {
        Message({type:'error',message:'存储位置获取失败'});
      })
  },
  // 获取字典
  getClassApi({commit}) {
    let obj={
        'queryList':[
          {
          'moduleId':'1',
          'childModuleId':'2',
          'dictId':'1',
          'type':'1'
         },
         {
          'moduleId':'1',
          'childModuleId':'2',
          'dictId':'6',
          'type':'2'
          }
        ]
      }
    getClassApi(obj).then((res)=> {
      if (!res.data.code) {
        commit('SET_DICTIONARY',res.data.data)
      }
    });
  },
  // 获取录像计划
  getRecordPlan({ commit }) {
    getTimeTemplateListApi()
      .then(res => {
        if (!res.data.code) {
          commit(
            'SET_RECORD_PLAN',
            res.data.data.map(e => {
              return {
                value: e.id,
                label: e.templateName
              }
            })
          )
        } else {
          throw res.data.message
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 一次性请求
  getBaseData({ dispatch }) {
    // dispatch('getStorageServer')
    dispatch('getRecordPlan');
    dispatch('getClassApi'); // 获取字典
    dispatch('getStorageLoc') // 获取存储位置
  }
}

const getters = {
  deviceClass(state) {
    return state.deviceClass;
  },
  channelClass(state) {
    return state.channelClass;
  },
  // 存储位置
  storageLocAllOption(state) {
    return [{ label: '全部', value: '' }, ...state.storageLocOption]
  },
  // 存储路径备选项
  storagePathAllOption(state) {
    return [{ label: '全部', value: '' }, ...state.storagePathOption]
  },
  storagePathSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.storagePathOption]
  },
  // 启用停用备选项
  deviceTypeAllOption(state) {
    return [{ label: '全部', value: '' }, ...state.deviceTypeOption]
  },
  deviceTypeSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.deviceTypeOption]
  },
  // 录像码流
  recordCodeAllOption(state) {
    return [{ label: '全部', value: '' }, ...state.recordCodeOption]
  },
  recordCodeSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.recordCodeOption]
  },
  // 录像计划
  recordPlanAllOption(state) {
    return [{ label: '全部', value: '' }, ...state.recordPlanOption]
  },
  recordPlanSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.recordPlanOption]
  },
  // 存储服务器
  storageServerAllOption(state) {
    return [{ label: '全部', value: 0 }, ...state.storageServerOption]
  },
  storageServerSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.storageServerOption]
  },
  // 查看类型备选项
  patternAllption(state) {
    return [{ label: '全部', value: '' }, ...state.patternOption]
  },
  patternSearchOption(state) {
    return [{ label: '请选择', value: -1 }, ...state.patternOption]
  },
  // 查看类型 Boolean 按资源查看-false 按组织查看-true
  patternBoolean(state) {
    return state.pattern === 2
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
