// 2D地图矢量图层配置信息
import {
  GEOMETRYTYPE,
  DEVICETYPE,
  VIDEOTYPEKEY,
  VIDEOTYPENAME,
  ACCESSDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  ALARMDEVICETYPE,
  KEYPARTTYPE,
  KEYPARTTNAME,
  KEYPARTTNAMEARR,
  KEYPARTTYPEORG,
  FIREFIGHTINGNAMEARR,
  FIREFIGHTINGDEVICETYPE
} from './common'
let zIndex = 1 // 初始图层索引

/** ------------------- 定义机构图层配置信息  ------------------- */
// 机构 // 总行 // 一级分行 // 二级分行 // 县级行 // 直属支行
const keyParts = ['headLevel', 'oneLevel', 'twoLevel', 'countyLevel', 'directlyLevel']
let PartsFeatureInfo = {}
for (let b = 0; b < keyParts.length; b++) {
  const type = keyParts[b]
  const sRType = KEYPARTTYPE[type] // 重点部位类型
  const rType = `${DEVICETYPE.org}-${sRType}`
  const label = KEYPARTTNAME[type]
  const typeinfo = { type: GEOMETRYTYPE.POINT, rType, sRType, label }
  const tt = type + 'Icon'
  PartsFeatureInfo[tt] = {
    id: `${tt}Layer`,
    name: tt,
    ...typeinfo,
    zIndex: zIndex++
  }
}

/** ------------------- 定义重点部位图层配置信息  ------------------- */
// 重点部位 // 营业网点 // 金库 // 计算机房 // 办公楼 // 自助银行 // 自助设备 // 自助银亭 // 私人银行 // 保险箱库 // 档案室 // 远程监控中心 // 5G + 智能银行 // 财富中心 // 其他重点部位 // 虚拟重点部位
const keyPartsArr = [
  'businessOutlets',
  'vault',
  'computerRoom',
  'officeBuilding',
  'selfServiceBank',
  'selfServiceEquipment',
  'selfServiceSilver',
  'privateBank',
  'safeDeposit',
  'archivesCenter',
  'remoteControlCenter',
  'fiveGSmartBanking',
  'fortuneCenter',
  'otherKeyParts',
  'xuni'
]
let PartsArrInfo = {}
for (let b = 0; b < keyPartsArr.length; b++) {
  const type = keyPartsArr[b]
  const sRType = KEYPARTTYPEORG[type] // 重点部位类型
  const rType = `${DEVICETYPE.keyPart}-${sRType}`
  const label = KEYPARTTNAMEARR[type]
  const typeinfo = { type: GEOMETRYTYPE.POINT, rType, sRType, label }
  const tt = type + 'Icon'
  PartsArrInfo[tt] = {
    id: `${tt}Layer`,
    name: tt,
    ...typeinfo,
    zIndex: zIndex++
  }
}

/** ------------------- 定义消防图层配置信息  ------------------- */
// 用户信息传输装置+协议解析器// 消防泵监测仪// 液压传感器// 液位传感器// 防排烟监测仪// 气体监测仪// 防火分隔监测仪// 电气火灾探测器// 剩余电流互感器// 电流互感器// 温度传感器// 故障电弧探测器// 独立烟感探测器// 独立温感探测器// 独立可燃气体探测器
// 用户信息传输装置+协议解析器// 消防泵监测仪// 液压传感器// 液位传感器// 防排烟监测仪// 气体监测仪// 防火分隔监测仪// 电气火灾探测器// 独立烟感探测器// 独立温感探测器// 独立可燃气体探测器
const fireFightingArr = [
  'userInfoTransmissionDevice',
  'firePumpMonitor',
  'hydraulicSensor',
  'liquidLevelSensor',
  'smokePreventionMonitor',
  'gasMonitor',
  'fireSeparationMonitor',
  'electricalFireDetector',
  // 'residualCurrentTransformer',
  // 'currentTransformer',
  // 'temperatureSensor',
  // 'faultArcDetector',
  'independentSmokeDetector',
  'independentTemperatureSensor',
  'independentCombustibleGasDetector'
]
let FireFightingInfo = {}
for (let b = 0; b < fireFightingArr.length; b++) {
  const type = fireFightingArr[b]
  const sRType = FIREFIGHTINGDEVICETYPE[type] // 消防类型
  const rType = `${DEVICETYPE.fireDevice}-${sRType}`
  const label = FIREFIGHTINGNAMEARR[type]
  const typeinfo = { type: GEOMETRYTYPE.POINT, rType, sRType, label }
  const tt = type + 'Icon'
  FireFightingInfo[tt] = {
    id: `${tt}Layer`,
    name: tt,
    ...typeinfo,
    zIndex: zIndex++
  }
}
/** ------------------- 定义视频图层配置信息  ------------------- */
const videoType = ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc', 'pinholeipc', 'smartIPC']
const featureType = ['Sector', 'Icon']
let videoFeatureInfo = {}
for (let i = 0; i < videoType.length; i++) {
  const type = videoType[i]
  const sRType = VIDEOTYPEKEY[type] // 视频类型
  const rType = `${DEVICETYPE.video}-${sRType}`
  const label = VIDEOTYPENAME[type]
  const typeinfo = { type: GEOMETRYTYPE.POINT, rType, sRType, label }
  for (let k = 0; k < featureType.length; k++) {
    const tt = type + featureType[k]
    videoFeatureInfo[tt] = {
      id: `${tt}Layer`,
      name: tt,
      ...typeinfo,
      zIndex: zIndex++
    }
  }
}
/** ------------------- 定义报警设备部位图层配置信息  ------------------- */
// 报警设备子类
const alermDevices = [
  'telAlarmHost', // 电话报警主机
  'networkAlarmHost', // 网络报警主机
  'fenceAlarmHost', // 电子围栏总线报警主机
  'shakeAlarmHost', // 震动光纤报警主机
  'wallDetector', // 壁挂双鉴探测器
  'ceilingDetector', // 吸顶双鉴探测器
  'atmShakeDetector', // atm震动探测器
  'vaultShakeDetector', // 金库震动探测器
  'doorMagneticDetector', // 门磁探测器
  'glassBrokenDetector', // 玻璃破碎探测器
  'smokeDetector', // 光电感烟探测器
  'pirCurtainDetector', // 红外幕帘探测器(入侵)
  'temperatureDetector', // 温度探测器
  'leakDetector', // 漏水探测器
  'voicedDangerButton', // 紧急按钮(有声)
  'silentDangerButton', // 紧急按钮(无声)
  'correlationDetector', // 红外对射探测器
  'offsetDetector', // 位移探测器
  'shakeOptical', // 振动光纤
  'electronicFence', // 电子围栏
  'videoRecorder' // 录像机
]
let alermDevicesInfo = {}
for (let b = 0; b < alermDevices.length; b++) {
  const type = alermDevices[b]
  const sRType = KEYPARTTYPEORG[type] // 重点部位类型
  const rType = `${DEVICETYPE.keyPart}-${sRType}`
  const label = KEYPARTTNAMEARR[type]
  const typeinfo = { type: GEOMETRYTYPE.POINT, rType, sRType, label }
  const tt = type + 'Icon'
  alermDevicesInfo[tt] = {
    id: `${tt}Layer`,
    name: tt,
    ...typeinfo,
    zIndex: zIndex++
  }
}
/** ------------------- 定义一般设备资源点位图层配置信息  ------------------- */
let generalFeatureInfo = {}
// rType ``设备大类key-设备子类key`
const generalList = [
  // {
  //   name: 'recorderVideoIcon',
  //   label: '录像机',
  //   rType: `${DEVICETYPE.recorderVideo}`
  // },
  {
    name: 'doubleDoorChannelIcon',
    label: '互锁门主机',
    rType: `${DEVICETYPE.accessControlDevice}-${ACCESSDEVICETYPE.doubleDoorChannel}`
  },
  {
    name: 'doubleDoorIcon',
    label: '互锁门通道',
    rType: `${DEVICETYPE.accessControlDevice}-${ACCESSDEVICETYPE.doubleDoor}`
  },
  {
    name: 'doorControlChannelIcon',
    label: '门禁通道',
    rType: `${DEVICETYPE.accessControlDevice}-${ACCESSDEVICETYPE.doorControlChannel}`
  },
  {
    name: 'doorControlIcon',
    label: '门禁主机',
    rType: `${DEVICETYPE.accessControlDevice}-${ACCESSDEVICETYPE.doorControlHost}`
  },
  {
    name: 'importPartIcon',
    label: '重点部位',
    rType: `${DEVICETYPE.keyPart}`
  },
  // 此处name值需修改
  // {
  //   name: 'commonAlarmIcon',
  //   label: '电话报警主机',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.telephoneHost}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '网络报警主机',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.networkHost}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '电子围栏总线报警主机',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.eleFenceBusHost}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '震动光纤报警主机',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.vibrationFiberHost}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '壁挂双鉴探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.wallMountedDualDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '吸顶双鉴探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.ceilingDoubleDetector}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: 'atm震动探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.atmShockDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '金库震动探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.treasuryVibrationDetector}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '门磁探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.doorMagneticDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '玻璃破碎探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.glassBreakDetector}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '光电感烟探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.photoelectricSmokeDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '红外幕帘探测器(入侵)',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.infraredCurtainDetectorIntrusion}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '温度探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.temperatureDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '漏水探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.waterLeakDetector}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '紧急按钮(有声)',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.emergencyButtonWithSound}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '紧急按钮(无声)',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.emergencyButtonSilent}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '红外对射探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.infraredDetector}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '位移探测器',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.displacementDetector}`
  // },
  // {
  //   name: 'commonAlarmIcon',
  //   label: '振动光纤',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.vibratingFiber}`
  // },
  // {
  //   name: 'detectorAlarmIcon',
  //   label: '电子围栏',
  //   rType: `${DEVICETYPE.commonAlarm}-${ALARMDEVICETYPE.electricFence}`
  // },
  {
    name: 'speechIcon',
    label: '对讲主机',
    rType: `${DEVICETYPE.intercomDevice}-${INTERCOMTYPE.speechHost}`
  },
  {
    name: 'speechChannelIcon',
    label: '对讲通道',
    rType: `${DEVICETYPE.intercomDevice}-${INTERCOMTYPE.speechChannel}`
  },
  {
    name: 'cabinIcon',
    label: '防护舱主机',
    rType: `${DEVICETYPE.cabin}-${CABINTYPE.cabinHost}`
  },
  {
    name: 'cabinChannelIcon',
    label: '防护舱通道',
    rType: `${DEVICETYPE.cabin}-${CABINTYPE.cabinChannel}`
  }
]
for (let l = 0; l < generalList.length; l++) {
  const $name = generalList[l].name
  generalFeatureInfo[$name] = {
    id: $name + 'Layer',
    type: GEOMETRYTYPE.POINT,
    zIndex: zIndex++,
    ...generalList[l]
  }
}

/** ------------------- 定义临时图层配置信息  ------------------- */
let tempFeatureInfo = {}
const tempFeatures = [
  {
    name: 'highLightLocate',
    label: '高亮定位'
  }
]
for (let i = 0; i < tempFeatures.length; i++) {
  const name = tempFeatures[i].name
  tempFeatureInfo[name] = {
    id: name + 'Layer',
    type: GEOMETRYTYPE.POINT,
    zIndex: zIndex++,
    ...tempFeatures[i]
  }
}

// const doubleDoorIcon = { id: 'doubleDoorIconLayer', name: 'doubleDoorIcon', label: '联动互锁门', type: GEOMETRYTYPE.POINT, rType: DEVICETYPE.doubleDoor, zIndex: zIndex++ }
export default {
  // 以下zIndex从 videoType.length * featureType.length开始
  ...PartsFeatureInfo, // 机构
  ...PartsArrInfo, // 重点部位
  ...videoFeatureInfo, // 视频
  ...generalFeatureInfo, // 一般设备资源点位
  ...tempFeatureInfo, // 临时图层
  ...alermDevicesInfo, // 报警设备
  ...FireFightingInfo // 消防设备
}
