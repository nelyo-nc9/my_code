import {
  getCommonResourceByIdApi, // 获取地图设备点位详情
  addMapCommonResourcePointApi, // 新增地图设备点位
  updateMapCommonResourcePointApi, // 修改地图设备点位
  deleteMapCommonResourcePointApi, // 删除地图设备点位
  deleteMapCommonOrgKeyPartIdApi, // 删除机构重点部位点位
  addFloorAKeyApi, // 添加楼层
  updateFloorAKeyApi, // 修改楼层
  deleteFloorAKeyApi, // 删除楼层
  getAllFloorAKeyApi, // 根据楼层id获取楼层详情
  addEnvironmentalApi, // 创建环境平面图
  getEnvironmentalApi, // 根据id查询环境平面图
  updateEnvironmentalApi, // 修改环境平面图
  deleteEnvironmentalApi, // 批量删除环境平面图
  getAllTypePointApi, // 获取所有已经添加的设备点位
  getBoxSelectionApi // 框选结果统计
} from 'http/map2D/point'
// import { dataToMyData, dataToMyDataObject_subType } from 'src/view/map2DEdit/components/datatransform_map'
import {
  VIDEOTYPEKEY,
  DEVICETYPE,
  ACCESSDEVICETYPE,
  KEYPARTTYPE,
  ALARMDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  KEYPARTTYPEORG,
  FIREFIGHTINGDEVICETYPE
} from 'assets/2DMap/meta/common'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
import { cloneDeep } from 'lodash'
// 地图配置 设备点位相关
const state = {
  showAllPoint: [], // 接口获取到的所有点
  boltipcResourceArr: [], // 枪机 资源数组
  boltipcIconFeatures: [], // 枪机 点位要素
  boltipcSectorFeatures: [], // 枪机 可视域要素
  redBoltipcResourceArr: [], // 红外枪机 资源数组
  redBoltipcIconFeatures: [], // 红外枪机 点位要素
  redBoltipcSectorFeatures: [], // 红外枪机 可视域要素
  halfBallipcResourceArr: [], // 半球 资源数组
  halfBallipcIconFeatures: [], // 半球 点位要素
  halfBallipcSectorFeatures: [], // 半球 可视域要素
  fastBallipcResourceArr: [], // 球机 资源数组
  fastBallipcIconFeatures: [], // 球机 点位要素
  fastBallipcSectorFeatures: [], // 球机 可视域要素
  allViewipcResourceArr: [], // 全景 资源数组
  allViewipcIconFeatures: [], // 全景 点位要素
  allViewipcSectorFeatures: [], // 全景 可视域要素
  pinholeipcResourceArr: [], // 针孔 资源数组
  pinholeipcIconFeatures: [], // 针孔 点位要素
  pinholeipcSectorFeatures: [], // 针孔 可视域要素
  smartIPCResourceArr: [], // 智能IPC 资源数组
  smartIPCIconFeatures: [], // 智能IPC 点位要素
  smartIPCSectorFeatures: [], // 智能IPC 可视域要素
  curSelectResourcePoint: null, // 当前选中的资源
  videoEditSectorChecked: false, // 可视域编辑

  drawFeatureLoc: null, // 修改的点位位置
  editSector: null,
  // recorderVideoResourceArr: [], // 录像机 资源数组
  // recorderVideoIconFeatures: [], // 录像机 点位要素
  videoRecorderResourceArr: [], // 录像机 资源数组
  videoRecorderIconFeatures: [], // 录像机 点位要素

  doorControlResourceArr: [], // 门禁主机 资源数组
  doorControlIconFeatures: [], // 门禁主机 点位要素
  doorControlChannelResourceArr: [], // 门禁通道 资源数组
  doorControlChannelIconFeatures: [], // 门禁通道 点位要素

  doubleDoorChannelResourceArr: [], // 互锁门主机 资源数组
  doubleDoorChannelIconFeatures: [], // 互锁门主机 点位要素
  doubleDoorResourceArr: [], //  互锁门通道 资源数组
  doubleDoorIconFeatures: [], //  互锁门通道 点位要素

  protectiveCabinResourceArr: [], // 防护舱主机 资源数组
  protectiveCabinIconFeatures: [], // 防护舱主机 点位要素
  protectiveCabinChannelResourceArr: [], // 防护舱通道 资源数组
  protectiveCabinChannelIconFeatures: [], // 防护舱通道 点位要素

  speechResourceArr: [], // 对讲主机 资源数组
  speechIconFeatures: [], // 对讲主机 要素数组
  speechChannelResourceArr: [], // 对讲通道 资源数组
  speechChannelIconFeatures: [], // 对讲通道 点位要素

  importPartResourceArr: [], // 机构 资源数组
  importPartIconFeatures: [], // 机构 要素数组
  headLevelResourceArr: [], // 机构 总行  资源数组
  headLevelIconFeatures: [], // 机构 总行  要素数组
  oneLevelResourceArr: [], // 机构 一行  资源数组
  oneLevelIconFeatures: [], // 机构 一行 要素数组
  twoLevelResourceArr: [], // 机构 二行  资源数组
  twoLevelIconFeatures: [], // 机构 二行 要素数组
  countyLevelResourceArr: [], // 机构 县行  资源数组
  countyLevelIconFeatures: [], // 机构 县行  要素数组
  directlyLevelResourceArr: [], // 机构 直属行  资源数组
  directlyLevelIconFeatures: [], // 机构 直属行  要素数组

  keyparttypeorgResourceArr: [], // 重点部位 资源数组
  keyparttypeorgIconFeatures: [], // 重点部位 资源数组

  businessOutletsResourceArr: [], // 营业网点 资源数组
  businessOutletsIconFeatures: [], // 营业网点 资源数组

  vaultResourceArr: [], // 金库 资源数组
  vaultIconFeatures: [], // 金库 资源数组

  computerRoomResourceArr: [], // 计算机房 资源数组
  computerRoomIconFeatures: [], // 计算机房 资源数组

  officeBuildingResourceArr: [], // 办公楼 资源数组
  officeBuildingIconFeatures: [], // 办公楼 资源数组

  selfServiceBankResourceArr: [], // 自助银行 资源数组
  selfServiceBankIconFeatures: [], // 自助银行 资源数组

  selfServiceEquipmentResourceArr: [], // 自助设备 资源数组
  selfServiceEquipmentIconFeatures: [], // 自助设备 资源数组

  selfServiceSilverResourceArr: [], // 自助银亭 资源数组
  selfServiceSilverIconFeatures: [], // 自助银亭 资源数组

  privateBankResourceArr: [], // 私人银行 资源数组
  privateBankIconFeatures: [], // 私人银行 资源数组

  safeDepositResourceArr: [], // 保险箱库 资源数组
  safeDepositIconFeatures: [], // 保险箱库 资源数组

  archivesCenterResourceArr: [], // 档案室 资源数组
  archivesCenterIconFeatures: [], // 档案室 资源数组

  remoteControlCenterResourceArr: [], // 远程监控中心 资源数组
  remoteControlCenterIconFeatures: [], // 远程监控中心 资源数组

  fiveGSmartBankingResourceArr: [], // 5G + 智能银行 资源数组
  fiveGSmartBankingIconFeatures: [], // 5G + 智能银行 资源数组

  fortuneCenterResourceArr: [], // 财富中心 资源数组
  fortuneCenterIconFeatures: [], // 财富中心 资源数组

  otherKeyPartsResourceArr: [], // 其他重点部位 资源数组
  otherKeyPartsIconFeatures: [], // 其他重点部位 资源数组

  xuniResourceArr: [], // 虚拟重点部位 资源数组
  xuniIconFeatures: [], // 虚拟重点部位 资源数组

  fireDeviceResourceArr: [], // 消防 资源数组
  fireDeviceIconFeatures: [], // 消防 点位要素
  // 消防设备
  userInfoTransmissionDeviceResourceArr: [], // 户信息传输装置+协议解析器 资源数组
  userInfoTransmissionDeviceIconFeatures: [], // 户信息传输装置+协议解析器 点位要素
  firePumpMonitorResourceArr: [], // 消防泵监测仪 资源数组
  firePumpMonitorIconFeatures: [], // 消防泵监测仪 点位要素
  hydraulicSensorResourceArr: [], // 液压传感器 资源数组
  hydraulicSensorIconFeatures: [], // 液压传感器 点位要素
  liquidLevelSensorResourceArr: [], // 液位传感器 资源数组
  liquidLevelSensorIconFeatures: [], // 液位传感器  点位要素
  smokePreventionMonitorResourceArr: [], // 防排烟监测仪 资源数组
  smokePreventionMonitorIconFeatures: [], // 防排烟监测仪 点位要素
  gasMonitorResourceArr: [], // 气体监测仪 资源数组
  gasMonitorIconFeatures: [], // 气体监测仪 点位要素
  fireSeparationMonitorResourceArr: [], // 防火分隔监测仪 资源数组
  fireSeparationMonitorIconFeatures: [], // 防火分隔监测仪 点位要素
  electricalFireDetectorResourceArr: [], // 电气火灾探测器 资源数组
  electricalFireDetectorIconFeatures: [], // 电气火灾探测器 点位要素
  // residualCurrentTransformerResourceArr: [], // 剩余电流互感器 资源数组
  // residualCurrentTransformerIconFeatures: [], // 剩余电流互感器 点位要素
  // currentTransformerResourceArr: [], // 电流互感器 资源数组
  // currentTransformerIconFeatures: [], // 电流互感器 点位要素
  // temperatureSensorResourceArr: [], // 温度传感器 资源数组
  // temperatureSensorIconFeatures: [], // 温度传感器 点位要素
  // faultArcDetectorResourceArr: [], // 故障电弧探测器 资源数组
  // faultArcDetectorIconFeatures: [], // 故障电弧探测器 点位要素
  independentSmokeDetectorResourceArr: [], // 独立烟感探测器 资源数组
  independentSmokeDetectorIconFeatures: [], // 独立烟感探测器 点位要素
  independentTemperatureSensorResourceArr: [], // 独立温感探测器 资源数组
  independentTemperatureSensorIconFeatures: [], // 独立温感探测器 点位要素
  independentCombustibleGasDetectorResourceArr: [], // 独立可燃气体探测器 资源数组
  independentCombustibleGasDetectorIconFeatures: [], // 独立可燃气体探测器 点位要素
  //

  //

  commonAlarmResourceArr: [], // 报警主机 资源数组
  commonAlarmIconFeatures: [], // 报警主机 点位要素

  /// 报警设备
  telAlarmHostResourceArr: [], // 电话报警主机 资源数组
  telAlarmHostIconFeatures: [], // 电话报警主机 点位要素

  networkAlarmHostResourceArr: [], // 网络报警主机 资源数组
  networkAlarmHostIconFeatures: [], // 网络报警主机 点位要素

  fenceAlarmHostResourceArr: [], // 电子围栏总线报警主机 资源数组
  fenceAlarmHostIconFeatures: [], // 电子围栏总线报警主机 点位要素

  shakeAlarmHostResourceArr: [], // 震动光纤报警主机 资源数组
  shakeAlarmHostIconFeatures: [], // 震动光纤报警主机 点位要素

  wallDetectorResourceArr: [], // 壁挂双鉴探测器 资源数组
  wallDetectorIconFeatures: [], // 壁挂双鉴探测器 点位要素

  ceilingDetectorResourceArr: [], // 吸顶双鉴探测器 资源数组
  ceilingDetectorIconFeatures: [], // 吸顶双鉴探测器 点位要素

  atmShakeDetectorResourceArr: [], // atm震动探测器 资源数组
  atmShakeDetectorIconFeatures: [], // atm震动探测器 点位要素

  vaultShakeDetectorResourceArr: [], // 金库震动探测器 资源数组
  vaultShakeDetectorIconFeatures: [], // 金库震动探测器 点位要素

  doorMagneticDetectorResourceArr: [], // 门磁探测器 资源数组
  doorMagneticDetectorIconFeatures: [], // 门磁探测器 点位要素

  glassBrokenDetectorResourceArr: [], // 玻璃破碎探测器 资源数组
  glassBrokenDetectorIconFeatures: [], // 玻璃破碎探测器 点位要素

  smokeDetectorResourceArr: [], // 光电感烟探测器 资源数组
  smokeDetectorIconFeatures: [], // 光电感烟探测器 点位要素

  pirCurtainDetectorResourceArr: [], // 红外幕帘探测器(入侵) 资源数组
  pirCurtainDetectorIconFeatures: [], // 红外幕帘探测器(入侵) 点位要素

  temperatureDetectorResourceArr: [], // 温度探测器 资源数组
  temperatureDetectorIconFeatures: [], // 温度探测器 点位要素

  leakDetectorResourceArr: [], // 漏水探测器 资源数组
  leakDetectorIconFeatures: [], // 漏水探测器 点位要素

  voicedDangerButtonResourceArr: [], // 紧急按钮(有声) 资源数组
  voicedDangerButtonIconFeatures: [], // 紧急按钮(有声) 点位要素

  silentDangerButtonResourceArr: [], // 紧急按钮(无声) 资源数组
  silentDangerButtonIconFeatures: [], // 紧急按钮(无声) 点位要素

  correlationDetectorResourceArr: [], // 红外对射探测器 资源数组
  correlationDetectorIconFeatures: [], // 红外对射探测器 点位要素

  offsetDetectorResourceArr: [], // 位移探测器 资源数组
  offsetDetectorIconFeatures: [], // 位移探测器 点位要素

  shakeOpticalResourceArr: [], // 振动光纤 资源数组
  shakeOpticalIconFeatures: [], // 振动光纤 点位要素

  electronicFenceResourceArr: [], // 电子围栏 资源数组
  electronicFenceIconFeatures: [], // 电子围栏 点位要素\

  highLightLocateIconFeatures: [], // 地图高亮定位要素

  areaDrawActive: false, // 区域绘制是否激活
  areaDrawLoc: '', // 绘制区域的位置
  editActive: false, // 要素编辑是否激活
  selectedTreeNode: {} // 选中的树节点
}
const getters = {
  showAllPoint: state => state.showAllPoint
}
const mutations = {
  /**
   * 资源数组相关
   * @param {*} state 相关store实例
   * @param {*} type 点位类型 可选值 boltipc redBoltipc halfBallipc fastBallipc allViewipc doubleDoor importPart
   * @param {*} arr 设置的数组
   */
  // SET_SHOW_ALL_POINT(state, data) {
  //   state.showAllPoint = data;
  // },
  SET_POINT_RESOURCE(state, { type, arr }) {
    console.log('state', state)
    state[type + 'ResourceArr'] = arr
  },
  /**
   * 点位要素相关
   * @param {*} state 相关store实例
   * @param {*} type 点位类型 可选值 boltipc redBoltipc halfBallipc fastBallipc allViewipc doubleDoor importPart
   * @param {*} feature 设置的数组
   */
  SET_POINT_ICON_FEATURES(state, { type, features }) {
    state[type + 'IconFeatures'] = features
  },
  /**
   * 清空所有点位相关数据（ ResourceArr，IconFeatures， SectorFeatures和高亮要素）
   * @param {*} state 相关store实例
   */
  CLEAR_ALL_POINT_DATA(state) {
    console.log('点位类型相关数据：', pointTypeData)
    for (const key in pointTypeData) {
      if (pointTypeData.hasOwnProperty(key)) {
        const type = pointTypeData[key]
        state[type + 'ResourceArr'] = []
        state[type + 'IconFeatures'] = []
        if (key.split('-')[0] === DEVICETYPE.video) {
          state[type + 'SectorFeatures）'] = []
        }
      }
    }
    state.highLightLocateIconFeatures = []
  },
  /**
   * 摄像机可视域要素
   * @param {*} state 相关store实例
   * @param {*} type 点位类型 可选值 boltipc redBoltipc halfBallipc fastBallipc allViewipc
   * @param {*} feature 设置的要素数组
   */
  SET_VIDEO_SECTOR_FEATURES(state, { type, features }) {
    state[type + 'SectorFeatures'] = features
  },
  SET_VIDEO_EDIT_SECTOR_CHECKED(state, flag) {
    state.videoEditSectorChecked = flag
  },
  SET_CURRENT_SELECT_RESOURCE(state, obj) {
    state.curSelectResourcePoint = obj
  },
  SET_EDIT_SECTOR(state, obj) {
    state.editSector = obj
  },
  SET_DRAW_FEATURE_LOC(state, loc) {
    state.drawFeatureLoc = loc
  },
  SET_AREA_DRAW_ACTIVE(state, flag) {
    state.areaDrawActive = flag
  },
  SET_AREA_DRAW_LOC(state, loc) {
    state.areaDrawLoc = loc
  },
  SET_EDIT_ACTIVE(state, flag) {
    state.editActive = flag
  },
  SET_ALL_SHOW_POINT(state, data) {
    state.showAllPoint = data
    // this.formatPoiData(this.AllTypePointArr, AllRESOURCEARR)
    // this.formatFeatures(this.AllTypePointArr, AllRESOURCEARR)
  },
  SET_ALL_TYPE_RESOURCE(state, data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.type) {
        // console.log(item.type, DEVICETYPE.keyPart);
        // if (item.id) { (左加的)
        if (item.type === DEVICETYPE.video) {
          // 摄像机
          if (item.subType === VIDEOTYPEKEY.boltipc) {
            state.boltipcResourceArr.push(item)
          } else if (item.subType === VIDEOTYPEKEY.redBoltipc) {
            state.redBoltipcResourceArr.push(item)
          } else if (item.subType === VIDEOTYPEKEY.halfBallipc) {
            state.halfBallipcResourceArr.push(item)
          } else if (item.subType === VIDEOTYPEKEY.fastBallipc) {
            state.fastBallipcResourceArr.push(item)
          } else if (item.subType === VIDEOTYPEKEY.allViewipc) {
            state.allViewipcResourceArr.push(item)
          } else if (item.subType === VIDEOTYPEKEY.pinholeipc) {
            state.pinholeipcResourceArr.push(item)
          // } else if (item.subType === VIDEOTYPEKEY.intelligentipc) {
          } else if (item.subType === VIDEOTYPEKEY.smartIPC) {
            state.smartIPCResourceArr.push(item)
          }
        } else if (item.type === DEVICETYPE.org) {
          // 机构
          if (item.subType === KEYPARTTYPE.headLevel) {
            state.headLevelResourceArr.push(item) // 机构 总行  资源数组
          } else if (item.subType === KEYPARTTYPE.oneLevel) {
            state.oneLevelResourceArr.push(item) // 机构 一行  资源数组
          } else if (item.subType === KEYPARTTYPE.twoLevel) {
            state.twoLevelResourceArr.push(item) // 机构 二行  资源数组
          } else if (item.subType === KEYPARTTYPE.countyLevel) {
            state.countyLevelResourceArr.push(item) // 机构 县行  资源数组
          } else if (item.subType === KEYPARTTYPE.directlyLevel) {
            state.directlyLevelResourceArr.push(item) // 机构 直属行  资源数组
          }
          // state.importPartResourceArr.push(item)
        } else if (item.type === DEVICETYPE.keyPart) {
          // 重点部位
          if (item.subType === KEYPARTTYPEORG.businessOutlets) {
            // 营业网点
            state.businessOutletsResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.vault) {
            // 金库
            state.vaultResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.computerRoom) {
            // 计算机房
            state.computerRoomResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.officeBuilding) {
            // 办公楼
            state.officeBuildingResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.selfServiceBank) {
            // 自助银行
            state.selfServiceBankResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.selfServiceEquipment) {
            // 自助设备
            state.selfServiceEquipmentResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.selfServiceSilver) {
            // 自助银亭
            state.selfServiceSilverResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.privateBank) {
            // 私人银行
            state.privateBankResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.safeDeposit) {
            // 保险箱库
            state.safeDepositResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.archivesCenter) {
            // /档案室
            state.archivesCenterResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.remoteControlCenter) {
            // 远程监控中心
            state.remoteControlCenterResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.fiveGSmartBanking) {
            // 5G + 智能银行
            state.fiveGSmartBankingResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.fortuneCenter) {
            // 财富中心
            state.fortuneCenterResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.otherKeyParts) {
            // 其他重点部位
            state.otherKeyPartsResourceArr.push(item)
          } else if (item.subType === KEYPARTTYPEORG.xuni) {
            // 虚拟重点部位
            state.xuniResourceArr.push(item)
          }
          state.keyparttypeorgResourceArr.push(item)
        } else if (item.type === DEVICETYPE.videoHost) {
          // 视频主机
          state.videoRecorderResourceArr.push(item)
        } else if (item.type === DEVICETYPE.accessControlDevice) {
          // 门禁设备
          if (item.subType === ACCESSDEVICETYPE.doorControlHost) {
            state.doorControlResourceArr.push(item)
          } else if (item.subType === ACCESSDEVICETYPE.doorControlChannel) {
            state.doorControlChannelResourceArr.push(item)
          } else if (item.subType === ACCESSDEVICETYPE.doubleDoor) {
            //  互锁门通道
            state.doubleDoorResourceArr.push(item)
          } else if (item.subType === ACCESSDEVICETYPE.doubleDoorChannel) {
            // 互锁门主机
            state.doubleDoorChannelResourceArr.push(item)
          }
        } else if (item.type === DEVICETYPE.intercomDevice) {
          // 对讲设备类
          if (item.subType === INTERCOMTYPE.speechHost) {
            state.speechResourceArr.push(item)
          } else if (item.subType === INTERCOMTYPE.speechChannel) {
            state.speechChannelResourceArr.push(item)
          }
        } else if (item.type === DEVICETYPE.lockingDoor) {
          // 防护舱
          if (item.subType === CABINTYPE.cabinHost) {
            state.protectiveCabinResourceArr.push(item)
          } else if (item.subType === CABINTYPE.cabinChannel) {
            state.protectiveCabinChannelResourceArr.push(item)
          }
          // state.protectiveCabinResourceArr.push(item)
        } else if (item.type === DEVICETYPE.alarmDevice) {
          // 报警设备
          console.log('报警设备' + item.id, item.subType)
          item.subType = Number(item.subType)
          // state.doubleDoorResourceArr.push(item)
          if (item.subType === ALARMDEVICETYPE.telephoneHost) {
            // 电话报警主机

            state.telAlarmHostResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.networkHost) {
            // 网络报警主机
            state.networkAlarmHostResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.eleFenceBusHost) {
            // 电子围栏总线报警主机
            state.fenceAlarmHostResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.vibrationFiberHost) {
            // 震动光纤报警主机
            state.shakeOpticalResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.wallMountedDualDetector) {
            // 壁挂双鉴探测器
            state.wallDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.ceilingDoubleDetector) {
            // 吸顶双鉴探测器
            state.ceilingDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.atmShockDetector) {
            // atm震动探测器
            state.atmShakeDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.treasuryVibrationDetector) {
            // 金库震动探测器
            state.vaultShakeDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.doorMagneticDetector) {
            // 门磁探测器
            state.doorMagneticDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.glassBreakDetector) {
            // 玻璃破碎探测器
            state.glassBrokenDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.photoelectricSmokeDetector) {
            // 光电感烟探测器
            state.smokeDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.infraredCurtainDetectorIntrusion) {
            // 红外幕帘探测器(入侵)
            state.pirCurtainDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.temperatureDetector) {
            // 温度探测器
            state.temperatureDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.waterLeakDetector) {
            // 漏水探测器
            state.leakDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.emergencyButtonWithSound) {
            // 紧急按钮(有声)
            state.voicedDangerButtonResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.emergencyButtonSilent) {
            // 紧急按钮(无声)
            state.silentDangerButtonResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.infraredDetector) {
            // 红外对射探测器
            state.correlationDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.displacementDetector) {
            // 位移探测器
            state.offsetDetectorResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.vibratingFiber) {
            // 振动光纤
            state.shakeOpticalResourceArr.push(item)
          } else if (item.subType === ALARMDEVICETYPE.electricFence) {
            // 电子围栏
            state.electronicFenceResourceArr.push(item)
          }
        } else if (item.type === DEVICETYPE.fireDevice) {
          // 消防设备
          // 暂无

          // state.fireDeviceResourceArr.push(item)
          if (item.subType === FIREFIGHTINGDEVICETYPE.userInfoTransmissionDevice) {
            // 用户信息传输装置+协议解析器
            state.userInfoTransmissionDeviceResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.firePumpMonitor) {
            //   消防泵监测仪
            state.firePumpMonitorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.hydraulicSensor) {
            //     液压传感器
            state.hydraulicSensorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.liquidLevelSensor) {
            //   液位传感器
            state.liquidLevelSensorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.smokePreventionMonitor) {
            //    防排烟监测仪
            state.smokePreventionMonitorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.gasMonitor) {
            //  气体监测仪
            state.gasMonitorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.fireSeparationMonitor) {
            // 防火分隔监测仪
            state.fireSeparationMonitorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.electricalFireDetector) {
            //    电气火灾探测器
            state.electricalFireDetectorResourceArr.push(item)
          }
          // else if (item.subType === FIREFIGHTINGDEVICETYPE.residualCurrentTransformer) {
          //   // 剩余电流互感器
          //   state.residualCurrentTransformerResourceArr.push(item)
          // } else if (item.subType === FIREFIGHTINGDEVICETYPE.currentTransformer) {
          //   // 电流互感器
          //   state.currentTransformerResourceArr.push(item)
          // } else if (item.subType === FIREFIGHTINGDEVICETYPE.temperatureSensor) {
          //   //  温度传感器
          //   state.temperatureSensorResourceArr.push(item)
          // } else if (item.subType === FIREFIGHTINGDEVICETYPE.faultArcDetector) {
          //   // 故障电弧探测器
          //   state.faultArcDetectorResourceArr.push(item)
          // }
          else if (item.subType === FIREFIGHTINGDEVICETYPE.independentSmokeDetector) {
            //    独立烟感探测器
            state.independentSmokeDetectorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.independentTemperatureSensor) {
            //  独立温感探测器
            state.independentTemperatureSensorResourceArr.push(item)
          } else if (item.subType === FIREFIGHTINGDEVICETYPE.independentCombustibleGasDetector) {
            //  独立可燃气体探测器
            state.independentCombustibleGasDetectorResourceArr.push(item)
          }
        }
      } else {
        state.boltipcResourceArr.push(item)
      }
    }
  }
}

const actions = {
  /**
   * 点位要素相关
   * @param {*} state 相关store实例
   * @param {*} type 点位类型 可选值 boltipc redBoltipc halfBallipc fastBallipc allViewipc doubleDoor
   * @param {*} arr/feature 设置的数组
   */
  setPointResourceByType({ commit }, { type, arr }) {
    commit('SET_POINT_RESOURCE', { type, arr })
  },
  setPointIconFeatures({ commit }, { type, features }) {
    commit('SET_POINT_ICON_FEATURES', { type, features })
  },
  /**
   * 摄像机可视域要素
   * @param {*} state 相关store实例
   * @param {*} type 点位类型 可选值 boltipc redBoltipc halfBallipc fastBallipc allViewipc pinholeipc smartIPC
   * @param {*} arr/feature 设置的数组
   */
  setVideoSectorFeatures({ commit }, { type, features }) {
    commit('SET_VIDEO_SECTOR_FEATURES', { type, features })
  },
  // 可视域编辑状态
  setVideoEditSectorChecked({ commit }, flag) {
    commit('SET_VIDEO_EDIT_SECTOR_CHECKED', flag)
  },
  // 当前选中资源信息
  setCurrentSelectResource({ commit }, obj) {
    commit('SET_CURRENT_SELECT_RESOURCE', obj)
  },
  // 点位要素移动后的坐标
  setDrawFeatureLoc({ commit }, loc) {
    commit('SET_DRAW_FEATURE_LOC', loc)
  },
  // 修改的可视域参数
  setEditSector({ commit }, obj) {
    commit('SET_EDIT_SECTOR', obj)
  },
  // 设置区域绘制状态
  setAreaDrawActive({ commit }, flag) {
    commit('SET_AREA_DRAW_ACTIVE', flag)
  },
  // 设置区域绘制的位置信息
  setAreaDrawLoc({ commit }, loc) {
    commit('SET_AREA_DRAW_LOC', loc)
  },
  // 设置要素编辑状态
  setEditActive({ commit }, loc) {
    commit('SET_EDIT_ACTIVE', loc)
  },
  // 获取地图设备点位详情
  getCommonResourceById({ commit }, data) {
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(data)
        .then(res => {
          if (res.data && res.data.data && !Number(res.data.data.subType)) {
            return res.data.data.subType
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 新增地图设备点位
  addMapCommonResourcePoint({ commit }, data) {
    return new Promise((resolve, reject) => {
      addMapCommonResourcePointApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改地图设备点位
  updateMapCommonResourcePoint({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateMapCommonResourcePointApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除地图设备点位
  deleteMapCommonResourcePoint({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteMapCommonResourcePointApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除地图设备点位
  deleteMapCommonOrgKeyPartId({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteMapCommonOrgKeyPartIdApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 根据楼层id获取楼层详情
  getAllFloorAKey({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAllFloorAKeyApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 添加楼层
  addFloorAKey({ commit }, data) {
    return new Promise((resolve, reject) => {
      addFloorAKeyApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改楼层
  updateFloorAKey({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateFloorAKeyApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除楼层
  deleteFloorAKey({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteFloorAKeyApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 创建环境平面图
  addEnvironmental({ commit }, data) {
    return new Promise((resolve, reject) => {
      addEnvironmentalApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据id查询环境平面图
  getEnvironmental({ commit }, data) {
    return new Promise((resolve, reject) => {
      getEnvironmentalApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改环境平面图
  updateEnvironmental({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateEnvironmentalApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 批量删除环境平面图
  deleteEnvironmental({ commit }, data) {
    return new Promise((resolve, reject) => {
      deleteEnvironmentalApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  showGetAllTypePoint({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAllTypePointApi(data)
        .then(res => {
          console.log('showAllPoint', res, res.data.data.points)
          commit('SET_ALL_SHOW_POINT', res.data.data.points)
          // commit('SET_ALL_TYPE_RESOURCE', res.data.data.points)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取已添加的所有设备点位
  getAllTypePoint({ commit }, data) {
    return new Promise((resolve, reject) => {
      getAllTypePointApi(data)
        .then(res => {
          // if (Number(res.code) === 0) {
          if (res.data === {}) {
            // console.log('showAllPoint', res, res.data.data.points)
            commit('SET_ALL_SHOW_POINT', cloneDeep(res.data))
            // res.data.data.points = dataToMyData(res.data, 5)
          } else {
            // console.log('showAllPoint', res, res.data.data.points)
            commit('SET_ALL_SHOW_POINT', cloneDeep(res.data.data.points))
            // res.data.data.points = dataToMyData(res.data.data.points, 5)
          }
          var arrgetArrType = []
          for (const iterator of res.data.data.points) {
            if (iterator.coordinate && iterator.subType && iterator.type !== 5) {
              iterator.subType = Number(iterator.subType) // 报警设备都是汉字，转换类型会报错
            }
            arrgetArrType.push(iterator)
          }
          commit('SET_ALL_TYPE_RESOURCE', arrgetArrType)
          resolve(res.data)
          // }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取框选结果
  getBoxSelection(data) {
    return new Promise((resolve, reject) => {
      getBoxSelectionApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
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
