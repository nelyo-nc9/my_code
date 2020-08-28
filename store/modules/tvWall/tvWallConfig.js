import {
  getTreeApi,
  addTvWallApi,
  deleteTvWallApi,
  chanegeTvWallApi,
  getTvWallListApi,
  removalTvWallApi,
  getDecodingDeviceApi,
  addDecodingDeviceApi,
  deleteDecodingDeviceApi,
  changeDecodingDeviceApi,
  getOneDecodingDeviceApi,
  removalDecodingDeviceApi,
  rankDecodingDeviceApi,
  getqueryDecodingDeviceApi,
  getTvWallMenuListApi,
  createdTvWallFloorApi,
  deleteTvWallFloorApi,
  getTvWallLayoutListApi,
  createdTvWallLayoutApi,
  deleteTvWallLayoutApi,
  changeTvWallLayoutApi,
  openWindowTvWallApi,
  resourcesToTvWallApi,
  exportTvWallApi,
  getDecodingLocalCannalListApi,
  creatDecodingLocalCannalApi,
  deleteDecodingLocalCannalApi,
  changeDecodingLocalCannalApi,
  closeresourcesToTvWallApi,
  divisionTvWallApi,
  getTvWallChannlListApi,
  channlAndwindowApi,
  opendecoderApi,
  closeopendecoderApi,
  getWindowCountApi,
  getdictionariesdataApi,
  m3divisionApi,
  getserviceApi,
  deletewndApi,
  TvWallsetwndApi,
  sortTvWallListApi,
  execLayoutApi,
  getPollingListApi,
  createdPollingApi,
  modifPollingApi,
  deletePollingApi,
  mergewndTvWallApi,
  splitwndTvWallApi,
  getDecodingLocalCannalApi,
  resourcesToTvWallLocalApi,
  closeresourcesToTvWallLocalApi,
  executePollingApi,
  getcurstatusApi,
  createdTvWallSceneApi,
  deleteTvWallSceneApi,
  changeTvWallSceneApi,
  getTvWallSceneListApi,
  executeSceneApi,
  showOrcloseNumberApi,
  showOrcloseNumberM3Api,
  createdTvWallPlanApi,
  deleteTvWallPlanApi,
  changeTvWallPlanApi,
  getTvWallPlanListApi,
  executePlanApi,
  executePollingM3Api,
  DecodingSortApi,
  createPartmanageApi,
  chanegePartmanageApi,
  deletePartmanageApi,
  getPartmanageListApi,
  getPartmanagerelationApi,
  geOutCannalB20Api,
  getOutCannalM3Api,
  SetAlarmApi,
  getfavoritesApi,
  refreshTvWallApi,
  relievedeviceApi,
  obtainApi,
  getChannlListM3AndB20Api,
  channlAndwindowM3AndB20Api,
  m3AndB20divisionApi,
  opendecoderM3AndB20Api,
  closeopendecoderM3AndB20Api,
  executePollingM3AndB20Api,
  getTvWallLogApi,
  openaudioApi,
  TvWallWindowStatusApi,
  searchTreeApi
} from '../../../http/tvWall/tvWallmanage.api'
import {
  reject
} from 'lodash'
const state = {
  whocomponentId: 'ManageList',
  whocomponentIndex: '',
  allTvWallList: {},
  tabIndex: 0,
  moveData: [],
  tvWallData: {},
  copy_data: {},
  tvWallchangeData: [],
  delect: false, // 删除信号
  createdTvWallFloor: {}, // 创建电视墙底板信号
  nodeDropData: {}, // 拖拽左侧资源数据
  nodeDropState: false,
  nodeDropWhere: '', // 拖拽什么上墙
  channlAndWindow: {}, // 普通电视墙将设备id和信号发送出去
  playParams: {} // 播放需要的参数
}
const getters = {

}
const mutations = {
  SET_COMPONENTID1(state, data) {
    state.whocomponentId = data
  },
  SET_MOVEDATA(state, data) {
    state.moveData = data
  },
  SET_COMPONENTID2(state, data) {
    state.whocomponentIndex = data
  },
  SET_TVWALLDATA1(state, data) {
    state.allTvWallList = data
  },
  SET_TVWALLDATA2(state, data) {
    state.allTvWallList.row = data.row
    state.allTvWallList.col = data.col
  },
  SET_TVWALL_CHANGE_DATA(state, data) { // 主页面(内容页面)将改变好的数据发出去
    state.tvWallchangeData = data
  },
  SET_TABLE_INDEX1(state, index) {
    state.tabIndex = index
  },
  SET_TVWALL_MESSAGE(state, index) { // 点击修改，将信息传出去
    state.tvWallData = index
  },
  SET_TVWALL_COPYDATA(state, index) { // 复制
    state.copy_data = index
  },
  SET_DELECT_STATE(state, index) { // 删除成功，将成功状态传出去，接受状态组件重新拉去列表
    state.delect = index
  },
  SET_CREATED_FLOOR(state, index) { // 创建底板成功，将状态传出去，接收状态组件重新拉去列表
    state.createdTvWallFloor = index
  },
  SET_NODEDROP_DATA(state, index) { // 当左侧资源拖拽起时，将退拽的起的信息发送出去
    state.nodeDropData = index
  },
  SET_NODEDROP_STATE(state, index) { // 当左侧资源拖拽起时，将退拽的起的信息发送出去
    state.nodeDropState = index
  },
  SET_NODEDROP_WHERE(state, index) { // 从哪拖拽的资源上墙: 资源 轮巡.....
    state.nodeDropWhere = index
  },
  SET_CHANNL_ID_STATE(state, index) { // 当通道与窗口号绑定后，将设备id和状态传送出去(M3)
    state.channlAndWindow = index
  },
  SET_VIDEO_PARAMS(state, index) { // 将播放需要的参数放到vuex中
    state.playParams = index
  }
}
const actions = {
  // 获取字典数据
  getdictionariesdata({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getdictionariesdataApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取接入服务器
  getservice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getserviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取树
  getTreeApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTreeApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 机构树搜索
  searchTreeApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      searchTreeApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取收藏夹
  getfavoritesApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getfavoritesApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取电视墙窗口信息(轮巡/预案)
  TvWallWindowStatusApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      TvWallWindowStatusApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 刷新电视墙
  refreshTvWallApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      refreshTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 设置/取消为报警屏幕
  SetAlarmApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      SetAlarmApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 打开音频
  openaudioApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      openaudioApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 窗口编号的显示和隐藏(b20)
  showOrcloseNumber({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      showOrcloseNumberApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 窗口编号的显示和隐藏(M3)
  showOrcloseNumberM3Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      showOrcloseNumberM3Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取当前窗口的播放状态信息
  getcurstatus({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getcurstatusApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取电视墙列表
  getTvWallListApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙列表排序
  sortTvWallListApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      sortTvWallListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙应用布局执行
  execLayoutApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      execLayoutApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙获取轮询列表数据
  getPollingListApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getPollingListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙配置创建轮询
  createdPollingApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createdPollingApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙配置修改轮询
  modifPollingApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      modifPollingApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙配置删除轮询
  deletePollingApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deletePollingApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙应用执行轮巡(b20)
  executePolling({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      executePollingApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙应用执行轮巡(m3)
  executePollingM3({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      executePollingM3Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙应用执行轮巡(解码器+拼控)
  executePollingM3AndB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      executePollingM3AndB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙列表导出
  exportTvWallList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      exportTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新增电视墙
  addTvWallApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      addTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除电视墙
  deleteTvWallApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙窗口关闭(点击X删除)
  deletewnd({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deletewndApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改电视墙信息
  chanegeTvWallApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      chanegeTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙迁移
  removalTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      removalTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙开窗操作
  openWindowTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      openWindowTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 资源上墙
  resourcesToTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      resourcesToTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 本地终端输入上墙
  resourcesToTvWallLocal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      resourcesToTvWallLocalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 资源下墙
  closeresourcesToTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      closeresourcesToTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 本地终端输入下墙
  closeresourcesToTvWallLocal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      closeresourcesToTvWallLocalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙的拼接(b20)
  mergewndTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      mergewndTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 电视墙的拆分(b20)
  splitwndTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      splitwndTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 拼控电视墙窗口分割合并
  TvWallsetwnd({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      TvWallsetwndApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 已开窗状态的窗口分割
  divisionTvWall({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      divisionTvWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取解码设备列表/LED
  getDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 添加解码设备/LED
  addDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      addDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除解码设备/LED
  deleteDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改解码设备/LED
  changeDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      changeDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取指定解码通道的相关通道/LED
  getOneDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getOneDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 迁移解码设备/LED
  removalDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      removalDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 解码设备排序/LED
  rankDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      rankDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 下载解码器设备查询列表/LED
  getqueryDecodingDevice({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getqueryDecodingDeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据解码器设备的id获取当前设备的本地终端输入列表/LED
  getDecodingLocalCannalList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getDecodingLocalCannalListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 创建本地终端输入信息/LED信息
  creatDecodingLocalCannal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      creatDecodingLocalCannalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取本地终端输入通道(设备本身的通道，真实通道)
  getDecodingLocalCannal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getDecodingLocalCannalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取输出通道b20(设备本身的通道，真实通道)
  geOutCannalB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      geOutCannalB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取输出通道M3(设备本身的通道，真实通道)
  getOutCannalM3Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getOutCannalM3Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除本地终端输入信息/LED信息
  deleteDecodingLocalCannal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteDecodingLocalCannalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改本地终端输入信息/LED信息
  changeDecodingLocalCannal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      changeDecodingLocalCannalApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 设备排序
  DecodingSort({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      DecodingSortApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取电视墙配置Menu列表
  getTvWallMenuList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallMenuListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 创建电视墙底板
  createdTvWallFloor({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createdTvWallFloorApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除电视墙底板
  deleteTvWallFloor({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteTvWallFloorApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取某一电视墙下所有的布局列表
  getTvWallLayoutList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallLayoutListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 创建布局
  createdTvWallLayout({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createdTvWallLayoutApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除布局
  deleteTvWallLayout({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteTvWallLayoutApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改布局
  changeTvWallLayout({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      changeTvWallLayoutApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新建场景
  createdTvWallScene({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createdTvWallSceneApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除场景
  deleteTvWallScene({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteTvWallSceneApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改场景
  changeTvWallScene({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      changeTvWallSceneApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取场景列表
  getTvWallSceneList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallSceneListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 执行场景
  executeScene({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      executeSceneApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新增预案
  createdTvWallPlan({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createdTvWallPlanApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除预案
  deleteTvWallPlan({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deleteTvWallPlanApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改预案
  changeTvWallPlan({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      changeTvWallPlanApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 执行预案
  executePlan({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      executePlanApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取预案列表
  getTvWallPlanList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallPlanListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取总解码窗口与已经解码窗口的数量(解码总资源，已使用，未使用)
  getWindowCount({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getWindowCountApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新建分区
  createPartmanage({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      createPartmanageApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 修改分区
  chanegePartmanage({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      chanegePartmanageApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除分区
  deletePartmanage({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      deletePartmanageApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取某一电视墙下的分区列表
  getPartmanageList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getPartmanageListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取分区管理的窗口权限配置
  getPartmanagerelationMethod({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getPartmanagerelationApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 解除设备与电视墙的绑定关系
  relievedeviceApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      relievedeviceApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //  解码器设备配置中获取设备信息
  obtainApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      obtainApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 普通电视墙
   * 解码器
   * M3
   * */
  // 获取电视墙下的所有解码器通道
  getTvWallChannlList({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallChannlListApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  channlAndwindow({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      channlAndwindowApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  opendecoder({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      opendecoderApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  closeopendecoder({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      closeopendecoderApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  m3divisionApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      m3divisionApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   *
   * M3+B20
   * 解码器+拼控的一系列接口
   *
   * */
  getChannlListM3AndB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getChannlListM3AndB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  channlAndwindowM3AndB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      channlAndwindowM3AndB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  m3AndB20divisionApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      m3AndB20divisionApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  opendecoderM3AndB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      opendecoderM3AndB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  closeopendecoderM3AndB20Api({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      closeopendecoderM3AndB20Api(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   *
   * 日志查询
   * */
  getTvWallLogApi({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getTvWallLogApi(payload).then(res => {
        resolve(res)
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
