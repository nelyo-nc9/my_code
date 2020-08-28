/**
 * 要素变量配置
 **/
// 几何要素类型
const GEOMETRYTYPE = {
  POINT: 'Point', // 点
  CIRCLE: 'Circle', // 圆
  POLYLINE: 'LineString', // 线
  POLYGON: 'Polygon', // 面
  MULTIPOINT: 'MultiPoint', // 多点
  MULTIPOLYLINE: 'MultiLineString', // 多线
  MULTIPOLYGON: 'MultiPolygon' // 多面
}
// （点、线、面）默认绘制样式类型
const DRAWSTYLETYPE = {
  POINT: 'defaultDraw', // 点
  LINESTRING: 'lineDraw', // 线
  POLYGON: 'areaDraw' // 面
}
// 缩略图形态
const SHAPETYPE = {
  POINT: 1, // 点
  MULTIPOINT: 1, // 多点
  POLYGON: 2, // 面
  MULTIPOLYGON: 2, // 多面
  LINESTRING: 3, // 线
  MULTILINESTRING: 3 // 多线
}
// 树节点类型
//  'org' / 'loc' / 'equ' / 'res', // 本节点类型 机构、重点部位、设备、资源
const TREENODETYPE = {
  org: 'org',
  loc: 'loc',
  equ: 'equ',
  res: 'res'
}
// 地图形态枚举 git:1 gis地图 ，hj：2 环境平面图， lc：3楼层平面图
const MAPTYPENUMBER = {
  gis: 1,
  hj: 2,
  lc: 3
}

// 设备大类
const DEVICETYPE = {
  org: 1, // 现在的机构 org
  keyPart: 2, // 新重点部位 营业网点等
  video: 3, // 摄像机
  videoHost: 4, // 视频主机
  alarmDevice: 5, // 报警设备
  fireDevice: 6, // 消防设备
  intercomDevice: 7, // 对讲设备
  accessControlDevice: 8, // 门禁设备
  cabin: 9 // 防护舱设备
}
// 设备列表中显示的文字标签
const EQUIPMENTLABEL = {
  video: '摄像机',
  videoHost: '录像机',
  alarmDevice: '报警设备',
  fireDevice: '消防设备',
  intercomDevice: '对讲设备',
  accessControlDevice: '门禁设备',
  accessLockDoorDevice: '互锁门',
  cabin: '防护舱'
}
//设备大类转译
const DEVICETYPETRANSATE = {
  1: 'importPart', // 现在的机构 org
  2: 'keyParts', // 新重点部位 营业网点等
  3: 'camera', // 摄像机
  4: 'recorder', // 视频主机
  5: 'alarm', // 报警设备
  6: 'fireFighting', // 消防设备
  7: 'intercom', // 对讲设备
  8: 'access', // 门禁设备
  9: 'protectedCabin' // 防护舱设备
}
const FEATUREARR = [
  'importPart', // 现在的机构 org
  'keyParts', // 新重点部位 营业网点等
  'camera', // 摄像机
  'recorder', // 视频主机
  'alarm', // 报警设备
  'fireFighting', // 消防设备
  'intercom', // 对讲设备
  'access', // 门禁设备
  'protectedCabin' // 防护舱设备
]
//  资源转换数组
const AllRESOURCEARR = [
  { type: '1', subTypeArr: 'ORGTYPE', Features: 'importPartFeatures', rtype: 'org', FeaturesType: 'importPart' }, // 原重点部位现在叫机构 总行 分行等
  { type: '2', subTypeArr: 'KEYPARTTYPE', Features: 'keyPartsFeatures', rtype: 'keyPart', FeaturesType: 'keyParts' }, // 原重点部位现在叫机构 总行 分行等
  { type: '3', subTypeArr: 'VIDEOTYPEKEY', Features: 'cameraFeatures', rtype: 'video', FeaturesType: 'camera' }, // 摄像机
  { type: '4', subTypeArr: null, Features: 'recorderFeatures', rtype: 'videoHost', FeaturesType: 'recorder' }, // 视频主机   //recorderVideo
  { type: '5', subTypeArr: 'ALARMDEVICETYPE', Features: 'alarmFeatures', rtype: 'alarmDevice', FeaturesType: 'alarm' }, // 报警设备          //commonAlarm
  { type: '6', subTypeArr: null, Features: 'fireFightingFeatures', rtype: 'fireDevice', FeaturesType: 'fireFighting' }, // 消防设备   //fireAlarm
  {
    type: '7',
    subTypeArr: 'INTERCOMTYPE',
    Features: 'intercomFeatures',
    rtype: 'intercomDevice',
    FeaturesType: 'intercom'
  }, // 对讲设备    //speechChannel
  {
    type: '8',
    subTypeArr: 'ACCESSDEVICETYPE',
    Features: 'accessFeatures',
    rtype: 'accessControlDevice',
    FeaturesType: 'access'
  }, // 门禁设备    //doorControlChannel
  // { type: "8", subTypeArr: null, Features: 'mutualLockDoorFeatures', rtype: 'lockingDoor', FeaturesType: 'mutualLockDoor' }, // 互锁门设备       //doubleDoor
  {
    type: '9',
    subTypeArr: 'CABINTYPE',
    Features: 'protectedCabinFeatures',
    rtype: 'cabin',
    FeaturesType: 'protectedCabin'
  } // 防护舱设备           //protectiveTank
]

// 资源类型 视频/门禁/消防/报警...
const RESOURCETYPE = {
  video: 0, // 摄像机
  recorderVideo: 6, // 录像机
  commonAlarm: 1, // 报警
  detectorAlarm: 12, // 报警探测器
  fireAlarm: 11, // 消防报警
  speech: 13, // 对讲主机
  speechChannel: 131, // 对讲通道
  doorControl: 4, // 门禁主机
  doorControlChannel: 42, // 门禁通道
  doubleDoor: 41, // 互锁门
  protectiveTank: 16, // 防护舱主机
  protectiveTankChannel: 161, // 防护舱通道
  alarmHost: 9, // 报警主机报警
  importPart: 5 // 重点部位
}

// 机构部位子类型
const KEYPARTTYPE = {
  headLevel: 1, // 总行
  oneLevel: 2, // 一级分行
  twoLevel: 3, // 二级分行
  directlyLevel: 4, // 直属支行
  countyLevel: 5 // 县级行
}

// 摄像机 设备类型key值
//  * 1|枪机,2|半球,3|球机,4|针孔,5|红外枪机,6|智能IPC,7|全景
const VIDEOTYPEKEY = {
  boltipc: 1, // 枪机
  halfBallipc: 2, // 半球
  fastBallipc: 3, // 球机
  redBoltipc: 5, // 红外枪机
  allViewipc: 7, // 全景
  pinholeipc: 4, // 针孔
  // intelligentipc: 6 // 智能IPC
  smartIPC: 6 // 智能IPC
}
// 定义录像机子类型
const VIDEOHOSTTYPE = {
  recorderVideo: 1
}
// 防护舱
const SHELTER = {
  protectiveTank: 1, // 防护舱主机
  protectiveTankChannel: 2 // 防护舱通道
}
// //对讲
// const AUDIOEQUIPMENT = {
//   audioHost: 1, // 对讲主机
//   audioChannel: 2 // 对讲通道
// }

// 摄像机 设备类型key值
const VIDEOTYPENAME = {
  boltipc: '枪机',
  redBoltipc: '红外枪机',
  halfBallipc: '半球',
  fastBallipc: '球机',
  allViewipc: '全景',
  pinholeipc: '针孔',
  intelligentipc: '智能IPC'
}
// 机构类型key值
const KEYPARTTNAME = {
  headLevel: '总行',
  oneLevel: '一级分行',
  twoLevel: '二级分行',
  countyLevel: '县级行',
  directlyLevel: '直属支行'
}
// 重点部位类型key值
const KEYPARTTNAMEARR = {
  businessOutlets: '营业网点',
  vault: '金库',
  computerRoom: '计算机房',
  officeBuilding: '办公楼',
  selfServiceBank: '自助银行',
  selfServiceEquipment: '自助设备',
  selfServiceSilver: '自助银亭',
  privateBank: '私人银行',
  safeDeposit: '保险箱库',
  archivesCenter: '档案室',
  remoteControlCenter: '远程监控中心',
  fiveGSmartBanking: '5G + 智能银行',
  fortuneCenter: '财富中心',
  otherKeyParts: '其他重点部位',
  xuni: '虚拟重点部位'
}
// 消防设备类型key值
const FIREFIGHTINGNAMEARR = {
  userInfoTransmissionDevice: '用户信息传输装置', // 用户信息传输装置+协议解析器
  firePumpMonitor: '消防泵监测仪', // 消防泵监测仪
  hydraulicSensor: '液压传感器', // 液压传感器
  liquidLevelSensor: '液位传感器', // 液位传感器
  smokePreventionMonitor: '防排烟监测仪', // 防排烟监测仪
  gasMonitor: '气体监测仪', // 气体监测仪
  fireSeparationMonitor: '防火分隔监测仪', // 防火分隔监测仪
  electricalFireDetector: '电气火灾探测器', // 电气火灾探测器
  independentSmokeDetector: '独立烟感探测器', // 独立烟感探测器
  independentTemperatureSensor: '独立温感探测器', // 独立温感探测器
  independentCombustibleGasDetector: '独立可燃气体探测器' // 独立可燃气体探测器
}
// 报警设备子类
const ALARMDEVICETYPE = {
  telephoneHost: 1, // 电话报警主机
  networkHost: 2, // 网络报警主机
  eleFenceBusHost: 3, // 电子围栏总线报警主机
  vibrationFiberHost: 4, // 震动光纤报警主机
  wallMountedDualDetector: 5, // 壁挂双鉴探测器
  ceilingDoubleDetector: 6, // 吸顶双鉴探测器
  atmShockDetector: 7, // ATM震动探测器
  treasuryVibrationDetector: 8, // 金库震动探测器
  doorMagneticDetector: 9, // 门磁探测器
  glassBreakDetector: 10, // 玻璃破碎探测器
  photoelectricSmokeDetector: 11, // 光电感烟探测器
  infraredCurtainDetectorIntrusion: 12, // 红外幕帘探测器(入侵)
  temperatureDetector: 13, // 温度探测器
  waterLeakDetector: 14, // 漏水探测器
  infraredDetector: 15, // 红外对射探测器
  displacementDetector: 16, // 位移探测器
  emergencyButtonWithSound: 17, // 紧急按钮(有声)
  emergencyButtonSilent: 18, // 紧急按钮(无声)
  electricFence: 19, // 电子围栏
  vibratingFiber: 20 // 振动光纤
}
// 报警设备子类 英文-汉字 1-20
const ALARMDEVICENameTYPE = {
  telephoneHost: '电话报警主机', // 电话报警主机
  networkHost: '网络报警主机', // 网络报警主机
  eleFenceBusHost: '电子围栏总线报警主机', // 电子围栏总线报警主机
  vibrationFiberHost: '震动光纤报警主机', // 震动光纤报警主机
  wallMountedDualDetector: '壁挂双鉴探测器', // 壁挂双鉴探测器
  ceilingDoubleDetector: '吸顶双鉴探测器', // 吸顶双鉴探测器
  atmShockDetector: 'ATM震动探测器', // ATM震动探测器
  treasuryVibrationDetector: '金库震动探测器', // 金库震动探测器
  doorMagneticDetector: '门磁探测器', // 门磁探测器
  glassBreakDetector: '玻璃破碎探测器', // 玻璃破碎探测器
  photoelectricSmokeDetector: '光电感烟探测器', // 光电感烟探测器
  infraredCurtainDetectorIntrusion: '红外幕帘探测器(入侵)', // 红外幕帘探测器(入侵)
  temperatureDetector: '温度探测器', // 温度探测器
  waterLeakDetector: '漏水探测器', // 漏水探测器
  emergencyButtonWithSound: '紧急按钮(有声)', // 紧急按钮(有声)
  emergencyButtonSilent: '紧急按钮(无声)', // 紧急按钮(无声)
  infraredDetector: '红外对射探测器', // 红外对射探测器
  displacementDetector: '位移探测器', // 位移探测器
  vibratingFiber: '振动光纤', // 振动光纤
  electricFence: '电子围栏' // 电子围栏
}

// 消防设备子类
const FIREFIGHTINGDEVICETYPE = {
  userInfoTransmissionDevice: 1, // 用户信息传输装置+协议解析器
  firePumpMonitor: 2, // 消防泵监测仪
  smokePreventionMonitor: 3, // 防排烟监测仪
  gasMonitor: 4, // 气体监测仪
  fireSeparationMonitor: 5, // 防火分隔监测仪
  electricalFireDetector: 6, // 电气火灾探测器
  independentSmokeDetector: 7, // 独立烟感探测器
  independentTemperatureSensor: 8, // 独立温感探测器
  independentCombustibleGasDetector: 9, // 独立可燃气体探测器
  hydraulicSensor: 10, // 液压传感器
  liquidLevelSensor: 11 // 液位传感器
}
// 返回的前缀，layer resourearr iconsarr需要，和图层id名的前缀直接对应
//
const EnumToEnum = {
  // 机构相关
  headLevel: 'headLevel', // 总行
  oneLevel: 'oneLevel', // 一级分行
  twoLevel: 'twoLevel', // 二级分行
  countyLevel: 'countyLevel', // 县级行
  directlyLevel: 'directlyLevel', // 直属级行
  // 重点部位
  businessOutlets: 'businessOutlets', // 营业网点
  vault: 'vault', // 金库
  computerRoom: 'computerRoom', // 计算机房
  officeBuilding: 'officeBuilding', // 办公楼
  selfServiceBank: 'selfServiceBank', // 自助银行
  selfServiceEquipment: 'selfServiceEquipment', // 自助设备
  selfServiceSilver: 'selfServiceSilver', // 自助银亭
  privateBank: 'privateBank', // 私人银行
  safeDeposit: 'safeDeposit', // 保险箱库
  archivesCenter: 'archivesCenter', // 档案室
  remoteControlCenter: 'remoteControlCenter', // 远程监控中心
  fiveGSmartBanking: 'fiveGSmartBanking', // 5G+智能银行
  fortuneCenter: 'fortuneCenter', // 财富中心
  otherKeyParts: 'otherKeyParts', // 其他重点部位
  xuni: 'xuni', // 虚拟
  // 摄像头相关
  boltipc: 'boltipc', // 枪机
  halfBallipc: 'halfBallipc', // 半球
  fastBallipc: 'fastBallipc', // 球机
  redBoltipc: 'redBoltipc', // 红外枪机
  allViewipc: 'allViewipc', // 全景
  pinholeipc: 'pinholeipc', // 针孔
  smartIPC: 'smartIPC', // 智能IPC
  // 视频主机相关
  videoRecorder: 'videoRecorder',
  // 报警设备相关
  telAlarmHost: 'telAlarmHost', // 电话报警主机
  networkAlarmHost: 'networkAlarmHost', // 网络报警主机
  fenceAlarmHost: 'fenceAlarmHost', // 电子围栏总线报警主机
  shakeAlarmHost: 'shakeAlarmHost', // 震动光纤报警主机
  wallDetector: 'wallDetector', // 壁挂双鉴探测器
  ceilingDetector: 'ceilingDetector', // 吸顶双鉴探测器
  atmShakeDetector: 'atmShakeDetector', // ATM震动探测器
  vaultShakeDetector: 'vaultShakeDetector', // 金库震动探测器
  doorMagneticDetector: 'doorMagneticDetector', // 门磁探测器
  glassBrokenDetector: 'glassBrokenDetector', // 玻璃破碎探测器
  smokeDetector: 'smokeDetector', // 光电感烟探测器
  pirCurtainDetector: 'pirCurtainDetector', // 红外幕帘探测器(入侵)
  temperatureDetector: 'temperatureDetector', // 温度探测器
  leakDetector: 'leakDetector', // 漏水探测器
  voicedDangerButton: 'voicedDangerButton', // 紧急按钮(有声)
  silentDangerButton: 'silentDangerButton', // 紧急按钮(无声)
  correlationDetector: 'correlationDetector', // 红外对射探测器
  offsetDetector: 'offsetDetector', // 位移探测器
  shakeOptical: 'shakeOptical', // 振动光纤
  electronicFence: 'electronicFence', // 电子围栏
  // 对讲相关
  intercomHost: 'intercomHost', // 对讲主机
  intercomChannel: 'intercomChannel', // 对讲通道
  speech: 'speech', // 对讲主机---配置用
  speechChannel: 'speechChannel', // 对讲通道---配置用
  // 门禁相关
  accessHost: 'accessHost', // 门禁主机
  accessChannel: 'accessChannel', // 门禁通道
  LockDoor: 'LockDoor', // 互锁门主机//互锁门
  gate: 'gate', // 互锁门通道//闸机---配置用
  doorControl: 'doorControl', // 门禁主机---配置用
  doorControlChannel: 'doorControlChannel', // 门禁通道---配置用
  doubleDoor: 'doubleDoor', // 互锁门通道//闸机---配置用
  doubleDoorChannel: 'doubleDoorChannel', // 互锁门主机//互锁门---配置用
  // 防护舱相关
  protectedCabinHost: 'protectedCabinHost', // 防护舱主机
  protectedCabinChannel: 'protectedCabinChannel', // 防护舱通道
  protectiveCabin: 'protectiveCabin', // 防护舱主机---配置用
  protectiveCabinChannel: 'protectiveCabinChannel', // 防护舱通---配置用道
  // 消防设备
  userInfoTransmissionDevice: 'userInfoTransmissionDevice', //   用户信息传输装置+协议解析器
  firePumpMonitor: 'firePumpMonitor', // 消防泵监测仪
  hydraulicSensor: 'hydraulicSensor', // 液压传感器
  liquidLevelSensor: 'liquidLevelSensor', // 液位传感器
  smokePreventionMonitor: 'smokePreventionMonitor', // 防排烟监测仪
  gasMonitor: 'gasMonitor', // 气体监测仪
  fireSeparationMonitor: 'fireSeparationMonitor', // 防火分隔监测仪
  electricalFireDetector: 'electricalFireDetector', // 电气火灾探测器
  independentSmokeDetector: 'independentSmokeDetector', // 独立烟感探测器
  independentTemperatureSensor: 'independentTemperatureSensor', // 独立温感探测器
  independentCombustibleGasDetector: 'independentCombustibleGasDetector' // 独立可燃气体探测器
}
// 根据一级二级获得的英文前缀对照表 --判断图标类型用
const EnglishNamePrefix = {
  '1': {
    '1': EnumToEnum.headLevel,
    '2': EnumToEnum.oneLevel,
    '3': EnumToEnum.twoLevel,
    '4': EnumToEnum.countyLevel,
    '5': EnumToEnum.directlyLevel
  },
  '2': {
    '1': EnumToEnum.businessOutlets,
    '2': EnumToEnum.vault,
    '3': EnumToEnum.computerRoom,
    '4': EnumToEnum.officeBuilding,
    '5': EnumToEnum.selfServiceBank,
    '6': EnumToEnum.selfServiceEquipment,
    '7': EnumToEnum.selfServiceSilver,
    '8': EnumToEnum.privateBank,
    '9': EnumToEnum.safeDeposit,
    '10': EnumToEnum.archivesCenter,
    '11': EnumToEnum.remoteControlCenter,
    '12': EnumToEnum.fiveGSmartBanking,
    '13': EnumToEnum.fortuneCenter,
    '14': EnumToEnum.otherKeyParts
  },
  '3': {
    '1': EnumToEnum.boltipc,
    '2': EnumToEnum.halfBallipc,
    '3': EnumToEnum.fastBallipc,
    '4': EnumToEnum.pinholeipc,
    '5': EnumToEnum.redBoltipc,
    '6': EnumToEnum.smartIPC,
    '7': EnumToEnum.allViewipc
  },
  '4': {
    '1': EnumToEnum.videoRecorder
  },
  '5': {
    '1': EnumToEnum.telAlarmHost, // 电话报警主机
    '2': EnumToEnum.networkAlarmHost, // 网络报警主机
    '3': EnumToEnum.fenceAlarmHost, // 电子围栏总线报警主机
    '4': EnumToEnum.shakeAlarmHost, // 震动光纤报警主机
    '5': EnumToEnum.wallDetector, // 壁挂双鉴探测器
    '6': EnumToEnum.ceilingDetector, //吸顶双鉴探测器
    '7': EnumToEnum.atmShakeDetector, // ATM震动探测器
    '8': EnumToEnum.vaultShakeDetector, // 金库震动探测器
    '9': EnumToEnum.doorMagneticDetector, // 门磁探测器
    '10': EnumToEnum.glassBrokenDetector, // 玻璃破碎探测器
    '11': EnumToEnum.smokeDetector, // 光电感烟探测器
    '12': EnumToEnum.pirCurtainDetector, // 红外幕帘探测器(入侵)
    '13': EnumToEnum.temperatureDetector, // 温度探测器
    '14': EnumToEnum.leakDetector, // 漏水探测器
    // '15': EnumToEnum.voicedDangerButton, // 紧急按钮（有声）
    // '16': EnumToEnum.silentDangerButton, // 紧急按钮（无声）
    // '17': EnumToEnum.correlationDetector, //红外对射探测器
    // '18': EnumToEnum.offsetDetector, // 位移探测器
    // '19': EnumToEnum.shakeOptical, //振动光纤
    // '20': EnumToEnum.electronicFence, //电子围栏
    '15': EnumToEnum.correlationDetector, // 红外对射探测器
    '16': EnumToEnum.offsetDetector, // 位移探测器
    '17': EnumToEnum.voicedDangerButton, // 紧急按钮（有声）
    '18': EnumToEnum.silentDangerButton, // 紧急按钮（无声）
    '19': EnumToEnum.electronicFence, // 电子围栏
    '20': EnumToEnum.shakeOptical // 振动光纤
    //
    // 电话报警主机: EnumToEnum.telAlarmHost, // 电话报警主机
    // 网络报警主机: EnumToEnum.networkAlarmHost, // 网络报警主机
    // 电子围栏总线报警主机: EnumToEnum.fenceAlarmHost, // 电子围栏总线报警主机
    // 震动光纤报警主机: EnumToEnum.shakeAlarmHost, // 震动光纤报警主机
    // 壁挂双鉴探测器: EnumToEnum.wallDetector, // 壁挂双鉴探测器
    // 吸顶双鉴探测器: EnumToEnum.ceilingDetector, //吸顶双鉴探测器
    // ATM震动探测器: EnumToEnum.atmShakeDetector, // ATM震动探测器
    // 金库震动探测器: EnumToEnum.vaultShakeDetector, // 金库震动探测器
    // 门磁探测器: EnumToEnum.doorMagneticDetector, // 门磁探测器
    // 玻璃破碎探测器: EnumToEnum.glassBrokenDetector, // 玻璃破碎探测器
    // 光电感烟探测器: EnumToEnum.smokeDetector, // 光电感烟探测器
    // '红外幕帘探测器(入侵)': EnumToEnum.pirCurtainDetector, // 红外幕帘探测器(入侵)
    // 温度探测器: EnumToEnum.temperatureDetector, // 温度探测器
    // 漏水探测器: EnumToEnum.leakDetector, // 漏水探测器
    // '紧急按钮（有声）': EnumToEnum.voicedDangerButton, // 紧急按钮（有声）
    // '紧急按钮（无声）': EnumToEnum.silentDangerButton, // 紧急按钮（无声）
    // 红外对射探测器: EnumToEnum.correlationDetector, //红外对射探测器
    // 位移探测器: EnumToEnum.offsetDetector, // 位移探测器
    // 振动光纤: EnumToEnum.shakeOptical, //振动光纤
    // 电子围栏: EnumToEnum.electronicFence //电子围栏
  },

  '6': {
    // 消防设备预留
    '1': EnumToEnum.userInfoTransmissionDevice, //   用户信息传输装置+协议解析器
    '2': EnumToEnum.firePumpMonitor, // 消防泵监测仪
    '10': EnumToEnum.hydraulicSensor, // 液压传感器
    '11': EnumToEnum.liquidLevelSensor, // 液位传感器
    '3': EnumToEnum.smokePreventionMonitor, // 防排烟监测仪
    '4': EnumToEnum.gasMonitor, // 气体监测仪
    '5': EnumToEnum.fireSeparationMonitor, // 防火分隔监测仪
    '6': EnumToEnum.electricalFireDetector, // 电气火灾探测器
    '7': EnumToEnum.independentSmokeDetector, // 独立烟感探测器
    '8': EnumToEnum.independentTemperatureSensor, // 独立温感探测器
    '9': EnumToEnum.independentCombustibleGasDetector // 独立可燃气体探测器
  },
  '7': {
    '1': EnumToEnum.intercomHost,
    '2': EnumToEnum.intercomChannel,
    '1_1': 'speech',
    '2_1': 'speechChannel'
  },
  '8': {
    '1': EnumToEnum.accessHost,
    '2': EnumToEnum.accessChannel,
    '4': EnumToEnum.LockDoor,
    '3': EnumToEnum.gate,
    '1_1': 'doorControl',
    '2_1': 'doorControlChannel',
    '3_1': 'doubleDoorChannel',
    '4_1': 'doubleDoor'
  },
  '9': {
    '1': EnumToEnum.protectedCabinHost,
    '1_1': 'protectedCabin',
    '2': EnumToEnum.protectedCabinChannel
  }
}
// 重点部位
const KEYPARTTYPEORG = {
  businessOutlets: 1, // 营业网点
  vault: 2, // 金库
  computerRoom: 3, // 计算机房
  officeBuilding: 4, // 办公楼
  selfServiceBank: 5, // 自助银行
  selfServiceEquipment: 6, // 自助设备
  selfServiceSilver: 7, // 自助银亭
  privateBank: 8, // 私人银行
  safeDeposit: 9, // 保险箱库
  archivesCenter: 10, // 档案室
  remoteControlCenter: 11, // 远程监控中心
  fiveGSmartBanking: 12, // 5G + 智能银行
  fortuneCenter: 13, // 财富中心
  otherKeyParts: 14, // 其他重点部位
  xuni: 15 // 虚拟重点部位
}

// 应用模块所有二级子类大对象//  这个变量一定要配置，不然点击设备资源树，定位的点只能高亮，不显示对应的图标（此变量被lidongyu的封装方法调用了）-shen
const SUBTYPEOBJTRANSATE = {
  1: {
    1: 'headOffice', // 总行
    2: 'tierOneBranch', // 一级分行
    3: 'secondLevelBranch', // 二级分行
    4: 'countyLevel', // 县级行
    5: 'directlyBranch' // 直属支行
  },
  // 重点部位
  2: {
    1: 'businessOutlets', // 营业网点
    2: 'vault', // 金库
    3: 'computerRoom', // 计算机房
    4: 'officeBuilding', // 办公楼
    5: 'selfServiceBank', // 自助银行
    6: 'selfServiceEquipment', // 自助设备
    7: 'selfServiceSilver', // 自助银亭
    8: 'privateBank', // 私人银行
    9: 'safeDeposit', // 保险箱库
    10: 'archivesCenter', // 档案室
    11: 'remoteControlCenter', // 远程监控中心
    12: 'fiveGSmartBanking', // 5G + 智能银行
    13: 'fortuneCenter', // 财富中心
    14: 'otherKeyParts', // 其他重点部位
    15: 'xuni' // 虚拟重点部位
  },
  3: {
    1: 'boltipc', // 枪机
    2: 'halfBallipc', // 半球
    3: 'fastBallipc', // 球机
    4: 'pinholeipc', // 针孔
    5: 'redBoltipc', // 红外枪机
    6: 'intelligentipc', // 智能IPC
    7: 'allViewipc' // 全景
  },
  4: {
    1: 'videoHost'
  },
  5: {
    1: 'telAlarmHost', // 电话报警主机
    2: 'networkAlarmHost', // 网络报警主机
    3: 'fenceAlarmHost', // 电子围栏总线报警主机
    4: 'shakeAlarmHost', // 震动光纤报警主机
    5: 'wallDetector', // 壁挂双鉴探测器
    6: 'ceilingDetector', // 吸顶双鉴探测器
    7: 'atmShakeDetector', // ATM震动探测器
    8: 'vaultShakeDetector', // 金库震动探测器
    9: 'doorMagneticDetector', // 门磁探测器
    10: 'glassBrokenDetector', // 玻璃破碎探测器
    11: 'smokeDetector', // 光电感烟探测器
    12: 'pirCurtainDetector', // 红外幕帘探测器(入侵)
    13: 'temperatureDetector', // 温度探测器
    14: 'leakDetector', // 漏水探测器
    15: 'correlationDetector', // 红外对射探测器
    16: 'offsetDetector', // 位移探测器
    17: 'voicedDangerButton', // 紧急按钮(有声)
    18: 'silentDangerButton', // 紧急按钮(无声)
    20: 'shakeOptical', // 振动光纤
    19: 'electronicFence' // 电子围栏
    // 电话报警主机: 'telAlarmHost', // 电话报警主机
    // 网络报警主机: 'networkAlarmHost', // 网络报警主机
    // 电子围栏总线报警主机: 'fenceAlarmHost', // 电子围栏总线报警主机
    // 震动光纤报警主机: 'shakeAlarmHost', // 震动光纤报警主机
    // 壁挂双鉴探测器: 'wallDetector', // 壁挂双鉴探测器
    // 吸顶双鉴探测器: 'ceilingDetector', // 吸顶双鉴探测器
    // ATM震动探测器: 'atmShakeDetector', // ATM震动探测器
    // 金库震动探测器: 'vaultShakeDetector', // 金库震动探测器
    // 门磁探测器: 'doorMagneticDetector', // 门磁探测器
    // 玻璃破碎探测器: 'glassBrokenDetector', // 玻璃破碎探测器
    // 光电感烟探测器: 'smokeDetector', // 光电感烟探测器
    // '红外幕帘探测器(入侵)': 'pirCurtainDetector', // 红外幕帘探测器(入侵)
    // 温度探测器: 'temperatureDetector', // 温度探测器
    // 漏水探测器: 'leakDetector', // 漏水探测器
    // '紧急按钮（有声）': 'voicedDangerButton', // 紧急按钮(有声)
    // '紧急按钮（无声）': 'silentDangerButton', // 紧急按钮(无声)
    // 红外对射探测器: 'correlationDetector', // 红外对射探测器
    // 位移探测器: 'offsetDetector', // 位移探测器
    // 振动光纤: 'shakeOptical', // 振动光纤
    // 电子围栏: 'electronicFence' // 电子围栏
  },

  6: {
    //以下是系统名称，就是为了对应到资源名称
    //以下是资源数组的名字
    1: 'userInfoTransmissionDevice', // 用户信息传输装置+协议解析器
    2: 'firePumpMonitor', // 消防泵监测仪
    3: 'smokePreventionMonitor', // 防排烟监测仪
    4: 'gasMonitor', // 气体监测仪
    5: 'fireSeparationMonitor', // 防火分隔监测仪
    6: 'electricalFireDetector', // 电气火灾探测器
    7: 'independentSmokeDetector', // 独立烟感探测器
    8: 'independentTemperatureSensor', // 独立温感探测器
    9: 'independentCombustibleGasDetector', // 独立可燃气体探测器
    10: 'hydraulicSensor', // 液压传感器
    11: 'liquidLevelSensor' // 液位传感器
  },
  7: {
    '1': 'intercomHost',
    '2': 'intercomChannel'
  },
  8: {
    1: 'accessHost',
    2: 'accessChannel',
    3: 'lockDoor',
    4: 'lockDoorChannel'
  },
  9: {
    1: 'protectedCabinHost',
    2: 'protectedCabinChannel'
  }
}

const ALARMINTTOSTRING = {
  电话报警主机: 1,
  网络报警主机: 2,
  电子围栏总线报警主机: 3,
  震动光纤报警主机: 4,
  壁挂双鉴探测器: 5,
  吸顶双鉴探测器: 6,
  ATM震动探测器: 7,
  金库震动探测器: 8,
  门磁探测器: 9,
  玻璃破碎探测器: 10,
  光电感烟探测器: 11,
  '红外幕帘探测器(入侵)': 12,
  温度探测器: 13,
  漏水探测器: 14,
  红外对射探测器: 15,
  位移探测器: 16,
  '紧急按钮（有声）': 17,
  '紧急按钮（无声）': 18,
  电子围栏: 19,
  振动光纤: 20
}
/**
 * 根据类型和子类型获取各个属性名称
 * @param {*} type 大类
 * @param {*} subType 子类
 */
function getUniteDictData(type, subType) {
  type = type.toString()
  let onlineStatus = '1'
  if (
    Number(type) === DEVICETYPE.fireDevice &&
    [FIREFIGHTINGDEVICETYPE.hydraulicSensor, FIREFIGHTINGDEVICETYPE.liquidLevelSensor].includes(Number(subType))
  ) {
    // 消防设备（液压传感器、液位传感器）特殊
    onlineStatus = '2'
  }
  let obj = {
    subTypeLayerName: EnglishNamePrefix[type][subType], // 子类图层名称前缀
    subTypeIconAndSourceName: EnglishNamePrefix[type][`${subType}_${onlineStatus}`] || EnglishNamePrefix[type][subType], // 子类型feature和资源名称前缀
    subTypeImageName: SUBTYPEOBJTRANSATE[type][subType], // 子类型对应图片名称
    typeImagePathName: DEVICETYPETRANSATE[type] // 类型对应图片路径名称
  }
  return {
    layerName: obj.subTypeLayerName,
    subName: obj.subTypeIconAndSourceName,
    subIconAllName: obj.subTypeIconAndSourceName + 'IconFeatures',
    subResourceAllName: obj.subTypeIconAndSourceName + 'ResourceArr',
    imageName: obj.subTypeImageName,
    pathName: obj.typeImagePathName
  }
}

// 门禁设备子类
const ACCESSDEVICETYPE = {
  doorControlHost: 1,
  doorControlChannel: 2,
  doubleDoor: 3, // 互锁门通道
  doubleDoorChannel: 4 // 互锁门主机
}

// 对讲设备子类
const INTERCOMTYPE = {
  speechHost: 1,
  speechChannel: 2
}
// 防护舱设备子类
const CABINTYPE = {
  cabinHost: 1,
  cabinChannel: 2
}
// 要素类型
const FEATURETYPE = {
  icon: 'icon', // 图标
  geometry: 'geometry', // 几何图形
  label: 'label' // 标注
}
// 地图标志key
const MPSIGNKEY = {
  point: 1, // 点
  polygon: 2, // 面
  lineString: 3 // 线
}
// 投影坐标系
const PROJ = {
  PREID: 'EPSG:', // OGC 投影坐标系前缀
  EPSG4326: 'EPSG:4326', // WGS84 经纬度坐标系
  EPSG3857: 'EPSG:3857', // WGS84 墨卡托投影坐标系（官方）
  EPSG900913: 'EPSG:900913', // 墨卡托投影坐标系（非官方）
  EPSG102113: 'EPSG:102113', // 墨卡托投影坐标系（非官方）———ArcGis 用
  GCJ02: 'GCJ02' // 墨卡托投影坐标系（非官方）———ArcGis 用
}
export {
  GEOMETRYTYPE,
  DRAWSTYLETYPE,
  SHAPETYPE,
  VIDEOTYPEKEY,
  RESOURCETYPE,
  FEATURETYPE,
  VIDEOTYPENAME,
  KEYPARTTNAME,
  KEYPARTTNAMEARR,
  MPSIGNKEY,
  PROJ,
  DEVICETYPE,
  EQUIPMENTLABEL,
  KEYPARTTYPE,
  KEYPARTTYPEORG,
  ACCESSDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  ALARMDEVICETYPE,
  AllRESOURCEARR,
  TREENODETYPE,
  SUBTYPEOBJTRANSATE,
  DEVICETYPETRANSATE,
  FEATUREARR,
  ALARMDEVICENameTYPE,
  VIDEOHOSTTYPE,
  EnumToEnum,
  EnglishNamePrefix,
  getUniteDictData,
  ALARMINTTOSTRING,
  MAPTYPENUMBER,
  FIREFIGHTINGDEVICETYPE,
  FIREFIGHTINGNAMEARR
}
