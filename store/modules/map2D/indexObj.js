// 地图配置
let checkedEquipments = {
  // 勾选的设备/要素
  importPart: {
    // 机构
    headOffice: { label: '总行', value: true },
    tierOneBranch: { label: '一级分行', value: true },
    secondLevelBranch: { label: '二级分行', value: true },
    countyLevel: { label: '县级行', value: true },
    directlyBranch: { label: '直属支行', value: true }
  },
  keyParts: {
    // 重点部位
    businessOutlets: { label: '营业网点', value: false },
    vault: { label: '金库', value: false },
    computerRoom: { label: '计算机房', value: false },
    officeBuilding: { label: '办公楼', value: false },
    selfServiceBank: { label: '自助银行', value: false },
    selfServiceEquipment: { label: '自助设备', value: false },
    selfServiceSilver: { label: '自助银亭', value: false },
    privateBank: { label: '私人银行', value: false },
    safeDeposit: { label: '保险箱库', value: false },
    archivesCenter: { label: '档案室', value: false },
    remoteControlCenter: { label: '远程监控中心', value: false },
    fiveGSmartBanking: { label: '5G + 智能银行', value: false },
    fortuneCenter: { label: '财富中心', value: false },
    otherKeyParts: { label: '其他重点部位', value: false },
    xuni: { label: '虚拟重点部位', value: false }
  },
  camera: {
    // 摄像机
    boltipc: { label: '枪机', value: false },
    halfBallipc: { label: '半球', value: false },
    fastBallipc: { label: '球机', value: false },
    redBoltipc: { label: '红外枪机', value: false },
    allViewipc: { label: '全景', value: false },
    pinhole: { label: '针孔', value: false },
    smartIPC: { label: '智能IPC', value: false },
    sector: { label: '可视域', value: false }
  },
  recorder: {
    // 录像机
    videoHost: { label: '视频主机', value: false }
  },
  alarm: {
    // 报警设备
    telAlarmHost: { label: '电话报警主机', value: false },
    networkAlarmHost: { label: '网络报警主机', value: false },
    fenceAlarmHost: { label: '电子围栏总线报警主机', value: false },
    shakeAlarmHost: { label: '震动光纤报警主机', value: false },
    wallDetector: { label: '壁挂双鉴探测器', value: false },
    ceilingDetector: { label: '吸顶双鉴探测器', value: false },
    atmShakeDetector: { label: 'ATM震动探测器', value: false },
    vaultShakeDetector: { label: '金库震动探测器', value: false },
    doorMagneticDetector: { label: '门磁探测器', value: false },
    glassBrokenDetector: { label: '玻璃破碎探测器', value: false },
    smokeDetector: { label: '光电感烟探测器', value: false },
    pirCurtainDetector: { label: '红外幕帘探测器(入侵)', value: false },
    temperatureDetector: { label: '温度探测器', value: false },
    leakDetector: { label: '漏水探测器', value: false },
    voicedDangerButton: { label: '紧急按钮(有声)', value: false },
    silentDangerButton: { label: '紧急按钮(无声)', value: false },
    correlationDetector: { label: '红外对射探测器', value: false },
    offsetDetector: { label: '位移探测器', value: false },
    shakeOptical: { label: '振动光纤', value: false },
    electronicFence: { label: '电子围栏', value: false }
  },
  // fireFighting: {
  //   // 消防设备
  //   Fighting: { label: '消防设备', value: false }
  // },
  intercom: {
    // 对讲设备
    intercomHost: { label: '对讲主机', value: false },
    intercomChannel: { label: '对讲通道', value: false }
  },
  access: {
    // 门禁设备
    accessHost: { label: '门禁主机', value: false },
    accessChannel: { label: '门禁通道', value: false },
    lockDoorChannel: { label: '互锁门主机', value: false },
    lockDoor: { label: '互锁门通道', value: false }
    // gate: { label: '闸机', value: false }
  },
  protectedCabin: {
    // 防护舱
    protectedCabinHost: { label: '防护舱主机', value: false },
    protectedCabinChannel: { label: '防护舱通道', value: false }
  },
  fireFighting: {
    // 消防设备
    userInfoTransmissionDevice: { label: '用户信息传输装置', value: false },
    firePumpMonitor: { label: '消防泵监测仪', value: false },
    hydraulicSensor: { label: '液压传感器', value: false },
    liquidLevelSensor: { label: '液位传感器', value: false },
    smokePreventionMonitor: { label: '防排烟监测仪', value: false },
    gasMonitor: { label: '气体监测仪', value: false },
    fireSeparationMonitor: { label: '防火分隔监测仪', value: false },
    electricalFireDetector: { label: '电气火灾探测器', value: false },
    // residualCurrentTransformer: { label: '剩余电流互感器', value: false },
    // currentTransformer: { label: '电流互感器', value: false },
    // temperatureSensor: { label: '温度传感器', value: false },
    // faultArcDetector: { label: '故障电弧探测器', value: false },
    independentSmokeDetector: { label: '独立烟感探测器', value: false },
    independentTemperatureSensor: { label: '独立温感探测器', value: false },
    independentCombustibleGasDetector: { label: '独立可燃气体探测器', value: false }
  }
}
// 地图应用
let checkedEquipmentsApply = {
  // 勾选的设备/要素
  importPart: {
    // 机构
    headOffice: { label: '总行', value: true },
    tierOneBranch: { label: '一级分行', value: true },
    secondLevelBranch: { label: '二级分行', value: true },
    countyLevel: { label: '县级行', value: true },
    directlyBranch: { label: '直属支行', value: true }
  },
  keyParts: {
    // 重点部位
    businessOutlets: { label: '营业网点', value: false },
    vault: { label: '金库', value: false },
    computerRoom: { label: '计算机房', value: false },
    officeBuilding: { label: '办公楼', value: false },
    selfServiceBank: { label: '自助银行', value: false },
    selfServiceEquipment: { label: '自助设备', value: false },
    selfServiceSilver: { label: '自助银亭', value: false },
    privateBank: { label: '私人银行', value: false },
    safeDeposit: { label: '保险箱库', value: false },
    archivesCenter: { label: '档案室', value: false },
    remoteControlCenter: { label: '远程监控中心', value: false },
    fiveGSmartBanking: { label: '5G + 智能银行', value: false },
    fortuneCenter: { label: '财富中心', value: false },
    otherKeyParts: { label: '其他重点部位', value: false },
    xuni: { label: '虚拟重点部位', value: false }
  },
  camera: {
    // 摄像机
    boltipc: { label: '枪机', value: false },
    halfBallipc: { label: '半球', value: false },
    fastBallipc: { label: '球机', value: false },
    pinholeipc: { label: '针孔', value: false },
    redBoltipc: { label: '红外枪机', value: false },
    intelligentipc: { label: '智能IPC', value: false },
    allViewipc: { label: '全景', value: false },
    sector: { label: '可视域', value: false }
  },
  recorder: {
    // 录像机
    videoHost: { label: '视频主机', value: false }
  },
  alarm: {
    // 报警设备
    telAlarmHost: { label: '电话报警主机', value: false },
    networkAlarmHost: { label: '网络报警主机', value: false },
    fenceAlarmHost: { label: '电子围栏总线报警主机', value: false },
    shakeAlarmHost: { label: '震动光纤报警主机', value: false },
    wallDetector: { label: '壁挂双鉴探测器', value: false },
    ceilingDetector: { label: '吸顶双鉴探测器', value: false },
    atmShakeDetector: { label: 'ATM震动探测器', value: false },
    vaultShakeDetector: { label: '金库震动探测器', value: false },
    doorMagneticDetector: { label: '门磁探测器', value: false },
    glassBrokenDetector: { label: '玻璃破碎探测器', value: false },
    smokeDetector: { label: '光电感烟探测器', value: false },
    pirCurtainDetector: { label: '红外幕帘探测器(入侵)', value: false },
    temperatureDetector: { label: '温度探测器', value: false },
    leakDetector: { label: '漏水探测器', value: false },
    voicedDangerButton: { label: '紧急按钮(有声)', value: false },
    silentDangerButton: { label: '紧急按钮(无声)', value: false },
    correlationDetector: { label: '红外对射探测器', value: false },
    offsetDetector: { label: '位移探测器', value: false },
    shakeOptical: { label: '振动光纤', value: false },
    electronicFence: { label: '电子围栏', value: false }
  },
  // fireFighting: {
  //   // 消防设备
  //   userInfoTransmissionDevice: { label: '用户信息传输装置', value: false },
  //   firePumpMonitor: { label: '消防泵监测仪', value: false },
  //   smokePreventionMonitor: { label: '防排烟监测仪', value: false },
  //   gasMonitor: { label: '气体监测仪', value: false },
  //   fireSeparationMonitor: { label: '防火分隔监测仪', value: false },
  //   electricalFireDetector: { label: '电气火灾探测器', value: false },
  //   // residualCurrentTransformer: { label: '剩余电流互感器', value: false },
  //   // currentTransformer: { label: '电流互感器', value: false },
  //   // temperatureSensor: { label: '温度传感器', value: false },
  //   // faultArcDetector: { label: '故障电弧探测器', value: false },
  //   independentSmokeDetector: { label: '独立烟感探测器', value: false },
  //   independentTemperatureSensor: { label: '独立温感探测器', value: false },
  //   independentCombustibleGasDetector: { label: '独立可燃气体探测器', value: false },
  //   hydraulicSensor: { label: '液压传感器', value: false },
  //   liquidLevelSensor: { label: '液位传感器', value: false }
  // },
  intercom: {
    // 对讲设备
    intercomHost: { label: '对讲主机', value: false },
    intercomChannel: { label: '对讲通道', value: false }
  },
  access: {
    // 门禁设备
    accessHost: { label: '门禁主机', value: false },
    accessChannel: { label: '门禁通道', value: false },
    lockDoor: { label: '互锁门通道', value: false },
    lockDoorChannel: { label: '互锁门主机', value: false }
  },
  protectedCabin: {
    // 防护舱
    protectedCabinHost: { label: '防护舱主机', value: false },
    protectedCabinChannel: { label: '防护舱通道', value: false }
  },
  fireFighting: {
    // 消防设备
    userInfoTransmissionDevice: { label: '用户信息传输装置', value: false },
    firePumpMonitor: { label: '消防泵监测仪', value: false },
    hydraulicSensor: { label: '液压传感器', value: false },
    liquidLevelSensor: { label: '液位传感器', value: false },
    smokePreventionMonitor: { label: '防排烟监测仪', value: false },
    gasMonitor: { label: '气体监测仪', value: false },
    fireSeparationMonitor: { label: '防火分隔监测仪', value: false },
    electricalFireDetector: { label: '电气火灾探测器', value: false },
    // residualCurrentTransformer: { label: '剩余电流互感器', value: false },
    // currentTransformer: { label: '电流互感器', value: false },
    // temperatureSensor: { label: '温度传感器', value: false },
    // faultArcDetector: { label: '故障电弧探测器', value: false },
    independentSmokeDetector: { label: '独立烟感探测器', value: false },
    independentTemperatureSensor: { label: '独立温感探测器', value: false },
    independentCombustibleGasDetector: { label: '独立可燃气体探测器', value: false }
  }
}
// 报警配置
let alarmSetting = {
  // 报警配置信息
  isReceive: false, // 是否接收报警
  isCount: '0', // 是否统计报警    //1 开启  0 关闭
  isLocation: false, // 是否定位报警
  nowAlarmStatus: 0, // 当前报警状态 0:初始态，1：报警中，2：鼠标选中
  nowSelectFeatureId: '', // 当前鼠标选中feature的id
  featureInterval: null, // feature闪烁时间定时器
  isKwinKel: false, // 报警点位是否闪烁
  alarmFeatureIds: {
    pointIds: [],
    keyPartIds: [],
    orgIds: []
  }, // 报警feature的主键数组
  alarmPushInfo: [],
  alarmInfo: []
}

function updateSetPoiInfoByLocalStorage(result) {
  let { selectPoiPoint } = result
  let userInfo = JSON.parse(sessionStorage.getItem('user'))
  const pageType = sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice' ? 'fireDevice' : 'allDevice'
  let poiPoint = localStorage.getItem(userInfo.id + '*selectPoiPoint*' + pageType)
  console.log('poiPoint', poiPoint)
  if (poiPoint) {
    let ids = poiPoint.split(',')
    selectPoiPoint.forEach(item => {
      if (ids.includes(item.id)) { item.value = true }
    })
  }
  return {
    selectPoiPoint: selectPoiPoint
  }
}

function updateSetInfoByLocalStorage(result) {
  let { checkedEquipmentsApply, checkedEquipments, alarmSetting, pageType } = result
  let userInfo = JSON.parse(sessionStorage.getItem('user'))
  let applyLocal = localStorage.getItem(userInfo.id + '*checkedEquipmentsApply*' + pageType)
  let setLocal = localStorage.getItem(userInfo.id + '*checkedEquipments*' + pageType)
  let alarm = localStorage.getItem(userInfo.id + '*alarmSetting*' + pageType)

  if (alarm) {
    alarm = JSON.parse(alarm)
    alarmSetting.isReceive = alarm.isReceive
    alarmSetting.isCount = alarm.isCount
    alarmSetting.isLocation = alarm.isLocation
  }

  return {
    checkedEquipmentsApply: applyLocal ? JSON.parse(applyLocal) : checkedEquipmentsApply,
    checkedEquipments: setLocal ? JSON.parse(setLocal) : checkedEquipments,
    alarmSetting: alarmSetting
  }
}

function updateLocalStorageBySetInfo(updateObj, updateName) {
  console.log('设置默认保存' + updateName, updateObj)
  let userInfo = JSON.parse(sessionStorage.getItem('user'))
  let pageType = 'allDevice'
  if (sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice') {
    pageType = 'fireDevice'
  }
  if (updateName === 'checkedEquipmentsApply') {
    localStorage.setItem(userInfo.id + '*checkedEquipmentsApply*' + pageType, JSON.stringify(updateObj))
  } else if (updateName === 'checkedEquipments') {
    localStorage.setItem(userInfo.id + '*checkedEquipments*' + pageType, JSON.stringify(updateObj))
  } else if (updateName === 'alarmSetting') {
    let endAlarmStatus = {
      isReceive: updateObj.isReceive, // 是否接收报警
      isCount: updateObj.isCount, // 是否统计报警    //1 开启  0 关闭
      isLocation: updateObj.isLocation // 是否定位报警
    }
    localStorage.setItem(userInfo.id + '*alarmSetting*' + pageType, JSON.stringify(endAlarmStatus))
  } else if (updateName === 'selectPoiPoint') {
    let ids = []
    updateObj.forEach(item => {
      if (item.value) { ids.push(item.id) }
    })
    localStorage.setItem(userInfo.id + '*selectPoiPoint*' + pageType, ids.join(','))
  }
}

export default {
  updateSetInfoByLocalStorage,
  updateLocalStorageBySetInfo,
  updateSetPoiInfoByLocalStorage,
  checkedEquipments,
  checkedEquipmentsApply,
  alarmSetting
}
