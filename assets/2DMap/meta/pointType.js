/**
 * 定义点位类型（大类+子类）与名称前缀的对应关系
 */
import {
  DEVICETYPE,
  KEYPARTTYPE,
  KEYPARTTYPEORG,
  VIDEOTYPEKEY,
  EnumToEnum,
  ACCESSDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  FIREFIGHTINGDEVICETYPE,
  ALARMDEVICETYPE
} from './common'
const pointTypeData = {
  // 机构
  [DEVICETYPE.org + '-' + KEYPARTTYPE.headLevel]: EnumToEnum.headLevel,
  [DEVICETYPE.org + '-' + KEYPARTTYPE.oneLevel]: EnumToEnum.oneLevel,
  [DEVICETYPE.org + '-' + KEYPARTTYPE.twoLevel]: EnumToEnum.twoLevel,
  [DEVICETYPE.org + '-' + KEYPARTTYPE.directlyLevel]: EnumToEnum.directlyLevel,
  [DEVICETYPE.org + '-' + KEYPARTTYPE.countyLevel]: EnumToEnum.countyLevel,
  // 重点部位
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.businessOutlets]: EnumToEnum.businessOutlets,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.vault]: EnumToEnum.vault,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.computerRoom]: EnumToEnum.computerRoom,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.officeBuilding]: EnumToEnum.officeBuilding,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.selfServiceBank]: EnumToEnum.selfServiceBank,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.selfServiceEquipment]: EnumToEnum.selfServiceEquipment,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.selfServiceSilver]: EnumToEnum.selfServiceSilver,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.privateBank]: EnumToEnum.privateBank,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.safeDeposit]: EnumToEnum.safeDeposit,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.archivesCenter]: EnumToEnum.archivesCenter,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.remoteControlCenter]: EnumToEnum.remoteControlCenter,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.fiveGSmartBanking]: EnumToEnum.fiveGSmartBanking,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.fortuneCenter]: EnumToEnum.fortuneCenter,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.otherKeyParts]: EnumToEnum.otherKeyParts,
  [DEVICETYPE.keyPart + '-' + KEYPARTTYPEORG.xuni]: EnumToEnum.xuni,
  // 摄像机
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.boltipc]: EnumToEnum.boltipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.halfBallipc]: EnumToEnum.halfBallipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.fastBallipc]: EnumToEnum.fastBallipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.redBoltipc]: EnumToEnum.redBoltipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.allViewipc]: EnumToEnum.allViewipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.pinholeipc]: EnumToEnum.pinholeipc,
  [DEVICETYPE.video + '-' + VIDEOTYPEKEY.smartIPC]: EnumToEnum.smartIPC,
  // 录像机
  [DEVICETYPE.videoHost]: EnumToEnum.videoRecorder,
  // 报警设备
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.telephoneHost]: EnumToEnum.telAlarmHost,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.networkHost]: EnumToEnum.networkAlarmHost,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.eleFenceBusHost]: EnumToEnum.fenceAlarmHost,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.vibrationFiberHost]: EnumToEnum.shakeAlarmHost,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.wallMountedDualDetector]: EnumToEnum.wallDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.ceilingDoubleDetector]: EnumToEnum.ceilingDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.atmShockDetector]: EnumToEnum.atmShakeDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.treasuryVibrationDetector]: EnumToEnum.vaultShakeDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.doorMagneticDetector]: EnumToEnum.doorMagneticDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.glassBreakDetector]: EnumToEnum.glassBrokenDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.photoelectricSmokeDetector]: EnumToEnum.smokeDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.infraredCurtainDetectorIntrusion]: EnumToEnum.pirCurtainDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.temperatureDetector]: EnumToEnum.temperatureDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.waterLeakDetector]: EnumToEnum.leakDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.infraredDetector]: EnumToEnum.correlationDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.displacementDetector]: EnumToEnum.offsetDetector,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.emergencyButtonWithSound]: EnumToEnum.voicedDangerButton,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.emergencyButtonSilent]: EnumToEnum.silentDangerButton,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.electricFence]: EnumToEnum.electronicFence,
  [DEVICETYPE.alarmDevice + '-' + ALARMDEVICETYPE.vibratingFiber]: EnumToEnum.shakeOptical,
  // 消防设备
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.userInfoTransmissionDevice]: EnumToEnum.userInfoTransmissionDevice, // 用户信息传输装置
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.firePumpMonitor]: EnumToEnum.firePumpMonitor, // 消防泵监测仪
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.hydraulicSensor]: EnumToEnum.hydraulicSensor, // 液压传感器
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.liquidLevelSensor]: EnumToEnum.liquidLevelSensor, // 液位传感器
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.smokePreventionMonitor]: EnumToEnum.smokePreventionMonitor, // 防排烟监测仪
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.gasMonitor]: EnumToEnum.gasMonitor, // 气体监测仪
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.fireSeparationMonitor]: EnumToEnum.fireSeparationMonitor, // 防火分隔监测仪
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.electricalFireDetector]: EnumToEnum.electricalFireDetector, // 电气火灾探测器
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.independentSmokeDetector]: EnumToEnum.independentSmokeDetector, // 独立烟感探测器
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.independentTemperatureSensor]: EnumToEnum.independentTemperatureSensor, // 独立温感探测器
  [DEVICETYPE.fireDevice + '-' + FIREFIGHTINGDEVICETYPE.independentCombustibleGasDetector]: EnumToEnum.independentCombustibleGasDetector, // 独立可燃气体探测器
  // 对讲设备
  [DEVICETYPE.intercomDevice + '-' + INTERCOMTYPE.speechHost]: EnumToEnum.speech,
  [DEVICETYPE.intercomDevice + '-' + INTERCOMTYPE.speechChannel]: EnumToEnum.speechChannel,
  // 门禁设备
  [DEVICETYPE.accessControlDevice + '-' + ACCESSDEVICETYPE.doorControlHost]: EnumToEnum.doorControl,
  [DEVICETYPE.accessControlDevice + '-' + ACCESSDEVICETYPE.doorControlChannel]: EnumToEnum.doorControlChannel,
  [DEVICETYPE.accessControlDevice + '-' + ACCESSDEVICETYPE.doubleDoor]: EnumToEnum.doubleDoor,
  [DEVICETYPE.accessControlDevice + '-' + ACCESSDEVICETYPE.doubleDoorChannel]: EnumToEnum.doubleDoorChannel,
  // 防护舱
  [DEVICETYPE.cabin + '-' + CABINTYPE.cabinHost]: EnumToEnum.protectiveCabin,
  [DEVICETYPE.cabin + '-' + CABINTYPE.cabinChannel]: EnumToEnum.protectiveCabinChannel
}

export { pointTypeData }
