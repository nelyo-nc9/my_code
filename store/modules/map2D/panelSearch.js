/*
 * @Author: anli
 * @Date: 2020-05-21 14:56:13
 * @LastEditTime: 2020-06-10 15:40:52
 * @LastEditors: yubeixin
 * @Description: 地图左侧资源列表
 */
import {
  DEVICETYPE,
  VIDEOTYPEKEY,
  KEYPARTTYPE,
  ALARMDEVICETYPE,
  INTERCOMTYPE,
  ACCESSDEVICETYPE,
  CABINTYPE,
  EQUIPMENTLABEL
} from 'assets/2DMap/meta/common'
const state = {
  // 设备列表
  equipmentList: [
    {
      id: '1',
      label: EQUIPMENTLABEL.video,
      type: 3,
      index: '1'
    },
    {
      id: '1',
      label: EQUIPMENTLABEL.videoHost,
      type: 4,
      index: '2'
    },
    {
      id: '2',
      label: EQUIPMENTLABEL.alarmDevice,
      type: 5,
      index: '3'
    },
    {
      id: '8',
      label: EQUIPMENTLABEL.fireDevice,
      type: 6,
      index: '4'
    },

    {
      id: '3',
      label: EQUIPMENTLABEL.accessControlDevice,
      type: 8,
      index: '5'
    },
    {
      id: '4',
      label: EQUIPMENTLABEL.intercomDevice,
      type: 7,
      index: '6'
    },
    {
      id: '3',
      label: EQUIPMENTLABEL.accessLockDoorDevice,
      type: 8,
      index: '7'
    },
    {
      id: '5',
      label: EQUIPMENTLABEL.cabin,
      type: 9,
      index: 8
    }
  ],
  // 资源列表
  // resourceLists: {
  //   '1': [
  //     {
  //       id: '01',
  //       label: '摄像机',
  //       type: '1',
  //       isParentNode: true,
  //       children: [
  //         {
  //           id: '11',
  //           label: '枪机',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.boltipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '12',
  //           label: '半球',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.halfBallipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '13',
  //           label: '球机',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.fastBallipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '14',
  //           label: '全景',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.allViewipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '15',
  //           label: '红外枪机',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.redBoltipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '16',
  //           label: '针孔',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.pinholeipc,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '17',
  //           label: '智能IPC',
  //           type: DEVICETYPE.video,
  //           monitype: VIDEOTYPEKEY.smartIPC,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '51',
  //           label: '重点部位-总行',
  //           type: DEVICETYPE.keyPart,
  //           monitype: KEYPARTTYPE.headLevel,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '52',
  //           label: '重点部位-一级分行',
  //           type: DEVICETYPE.keyPart,
  //           monitype: KEYPARTTYPE.oneLevel,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '53',
  //           label: '重点部位-二级分行',
  //           type: DEVICETYPE.keyPart,
  //           monitype: KEYPARTTYPE.twoLevel,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '54',
  //           label: '重点部位-县级行',
  //           type: DEVICETYPE.keyPart,
  //           monitype: KEYPARTTYPE.countryLevel,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         },
  //         {
  //           id: '55',
  //           label: '重点部位-直属支行',
  //           type: DEVICETYPE.keyPart,
  //           monitype: KEYPARTTYPE.directlyLevel,
  //           isParentNode: false,
  //           activeId: '',
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ],
  //   '2': [
  //     {
  //       id: '02',
  //       label: '视频主机',
  //       type: '02',
  //       isParentNode: true,
  //       children: [
  //         {
  //           id: '021',
  //           label: '视频主机1',
  //           isParentNode: false,
  //           type: DEVICETYPE.recorderVideo
  //         },
  //         {
  //           id: '022',
  //           label: '视频主机2',
  //           isParentNode: false,
  //           type: DEVICETYPE.recorderVideo
  //         },
  //         {
  //           id: '022',
  //           label: '视频主机3',
  //           isParentNode: false,
  //           type: DEVICETYPE.recorderVideo
  //         }
  //       ]
  //     }
  //   ],
  //   '3': [
  //     {
  //       id: '03',
  //       label: '报警设备',
  //       type: '03',
  //       isParentNode: true,
  //       children: [
  //         {
  //           id: '031',
  //           label: '电话报警主机',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.telephoneHost,
  //           surface: '1'
  //         },
  //         {
  //           id: '032',
  //           label: '网络报警主机',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.networkHost,
  //           surface: '1'
  //         },
  //         {
  //           id: '033',
  //           label: '电子围栏总线报警主机',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.eleFenceBusHost,
  //           surface: '1'
  //         },
  //         {
  //           id: '034',
  //           label: '震动光纤报警主机',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.vibrationFiberHost,
  //           surface: '1'
  //         },
  //         {
  //           id: '035',
  //           label: '壁挂双鉴探测器',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.wallMountedDualDetector,
  //           surface: '2'
  //         },
  //         {
  //           id: '036',
  //           label: '吸顶双鉴探测器',
  //           isParentNode: false,
  //           type: DEVICETYPE.commonAlarm,
  //           monitype: ALARMDEVICETYPE.ceilingDoubleDetector,
  //           surface: '3'
  //         }
  //       ]
  //     }
  //   ],
  //   '4': [
  //     {
  //       id: '04',
  //       label: '消防设备',
  //       type: '04',
  //       isParentNode: false,
  //       children: [
  //         {
  //           label: '消防设备1',
  //           isParentNode: false,
  //           id: '041',
  //           type: DEVICETYPE.fireAlarm,
  //           surface: '1'
  //         },
  //         {
  //           label: '消防设备2',
  //           isParentNode: false,
  //           id: '042',
  //           type: DEVICETYPE.fireAlarm,
  //           surface: '1'
  //         },
  //         {
  //           label: '消防设备3',
  //           isParentNode: false,
  //           id: '043',
  //           type: DEVICETYPE.fireAlarm,
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ],
  //   '5': [
  //     {
  //       id: '05',
  //       label: '对讲设备',
  //       isParentNode: true,
  //       type: '05',
  //       children: [
  //         {
  //           label: '对讲通道1',
  //           isParentNode: false,
  //           id: '051',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechChannel,
  //           surface: '1'
  //         },
  //         {
  //           label: '对讲主机1',
  //           isParentNode: false,
  //           id: '052',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechHost
  //         },
  //         {
  //           label: '对讲通道2',
  //           isParentNode: false,
  //           id: '053',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechChannel,
  //           surface: '1'
  //         },
  //         {
  //           label: '对讲主机2',
  //           isParentNode: false,
  //           id: '054',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechHost
  //         },
  //         {
  //           label: '对讲通道3',
  //           isParentNode: false,
  //           id: '055',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechChannel,
  //           surface: '1'
  //         },
  //         {
  //           label: '对讲主机3',
  //           isParentNode: false,
  //           id: '056',
  //           type: DEVICETYPE.speech,
  //           monitype: INTERCOMTYPE.speechHost,
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ],
  //   '6': [
  //     {
  //       id: '06',
  //       label: '门禁设备',
  //       isParentNode: true,
  //       type: '06',
  //       children: [
  //         {
  //           label: '门禁主机1',
  //           isParentNode: false,
  //           id: '061',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '门禁设备1',
  //           isParentNode: false,
  //           id: '062',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlChannel,
  //           surface: '1'
  //         },
  //         {
  //           label: '门禁主机2',
  //           isParentNode: false,
  //           id: '063',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '门禁设备2',
  //           isParentNode: false,
  //           id: '064',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlChannel,
  //           surface: '1'
  //         },
  //         {
  //           label: '门禁主机3',
  //           isParentNode: false,
  //           id: '065',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '门禁设备3',
  //           isParentNode: false,
  //           id: '066',
  //           type: DEVICETYPE.doorControl,
  //           monitype: ACCESSDEVICETYPE.doorControlChannel,
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ],
  //   '7': [
  //     {
  //       id: '07',
  //       label: '互锁门',
  //       isParentNode: false,
  //       type: '07',
  //       children: [
  //         {
  //           id: '071',
  //           label: '互锁门1',
  //           isParentNode: false,
  //           type: DEVICETYPE.doubleDoor,
  //           surface: '1'
  //         },
  //         {
  //           id: '072',
  //           label: '互锁门2',
  //           isParentNode: false,
  //           type: DEVICETYPE.doubleDoor,
  //           surface: '1'
  //         },
  //         {
  //           id: '073',
  //           label: '互锁门3',
  //           isParentNode: false,
  //           type: DEVICETYPE.doubleDoor,
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ],
  //   '8': [
  //     {
  //       id: '08',
  //       label: '防护舱',
  //       isParentNode: true,
  //       type: '08',
  //       children: [
  //         {
  //           id: '081',
  //           label: '防护舱主机1',
  //           isParentNode: false,
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '防护舱通道1',
  //           isParentNode: false,
  //           id: '082',
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinChannel,
  //           surface: '1'
  //         },
  //         {
  //           id: '083',
  //           label: '防护舱主机2',
  //           isParentNode: false,
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '防护舱通道2',
  //           isParentNode: false,
  //           id: '084',
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinChannel,
  //           surface: '1'
  //         },
  //         {
  //           id: '085',
  //           label: '防护舱主机3',
  //           isParentNode: false,
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinHost,
  //           surface: '1'
  //         },
  //         {
  //           label: '防护舱通道3',
  //           isParentNode: false,
  //           id: '086',
  //           type: DEVICETYPE.protectiveTank,
  //           monitype: CABINTYPE.cabinChannel,
  //           surface: '1'
  //         }
  //       ]
  //     }
  //   ]
  // },
  selectedTreeNode: {}, // 地图应用界面 机构重点部位选中的树节点   用于设备树查询   地图 平面图 楼层图切换回退判断
  selectedTreeNodeApply: {
    serial: '',
    tierType: 'org'
  },
  selectedTreeCode: {}, // 设备资源数
  floorList: '', // 楼层数组
  showFloorForm: false // 是否展示楼层修改弹框

}

const getters = {
  floorList: state => {
    return state.floorList
  },
  equipmentList: state => {
    return state.equipmentList
  },
  resourceLists: state => {
    return state.resourceLists
  },
  selectedTreeNode: state => {
    // console.log(sessionStorage.user)
    return state.selectedTreeNode
  },
  selectedTreeNodeApply: state => {
    return state.selectedTreeNodeApply
  },
  selectedTreeCode: state => {
    return state.selectedTreeCode
  }
}

const mutations = {
  SET_SELECTED_TREE_NODE(state, payload) {
    state.selectedTreeNode = payload
  },
  SET_SELECTED_TREE_NODE_APPLY(state, payload) {
    state.selectedTreeNodeApply = payload
  },
  SET_SELECTED_TREE_CODE(state, payload) {
    state.selectedTreeCode = payload
  },
  // 更新资源树信息
  CHANGE_RESOURCE_TREE(state, { type, arr }) {
    state.resourceLists[type] = arr
  },
  // 设置楼层列表数据
  SET_FLOOR_LIST(state, arr) {
    state.floorList = arr
  },
  // 设置楼层修改是否显示
  SET_FLOOR_FORM(state, arr) {
    state.showFloorForm = arr
  }
}
//
const actions = {
  setSelectedTreeNode({ commit }, data) {
    commit('SET_SELECTED_TREE_NODE', data)
  },
  setSelectedTreeNodeApply({ commit }, data) {
    commit('SET_SELECTED_TREE_NODE_APPLY', data)
  },
  setSelectedTreeCode({ commit }, data) {
    commit('SET_SELECTED_TREE_CODE', data)
  },
  // 更新资源树信息
  changeResourceTree({ commit }, { type, arr }) {
    commit('CHANGE_RESOURCE_TREE', { type, arr })
  },
  // 更新资源树信息
  setFloorList({ commit }, arr) {
    commit('SET_FLOOR_LIST', arr)
  },
  // 设置修改楼层弹框嫌疑
  setShowFloorForm({ commit }, arr) {
    commit('SET_FLOOR_FORM', arr)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
