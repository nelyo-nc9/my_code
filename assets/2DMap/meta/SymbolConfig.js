/*
 * @Author: fengbeibei
 * @Date: 2020-05-28 11:40:26
 * @LastEditTime: 2020-06-01 19:55:49
 * @LastEditors: fengbeibei
 * @LastEditTime: 2020-06-01 17:40:27
 * @Description: 全局要素样式
 */

/**
 * 配置功能：点位图标
 * 配置单位：对象
 * 配置说明：对象名称为图片名字加Symbol,对象路径为图片路径
 */
/**
 * 配置功能：需要补充
 * 配置单位：需要补充
 * 配置说明：需要补充
 */

// 要素样式
const iconStyleScale = 0.4
const iconStyleAnchor = [50, 45]
const videoSymbol = {
  rotation: 0,
  opacity: 1,
  anchor: iconStyleAnchor,
  scale: iconStyleScale
}

const selectSymbol = {
  rotation: 0,
  opacity: 1,
  anchor: [30, 40],
  scale: iconStyleScale
}

const poiSymbol = {
  rotation: 0,
  opacity: 1,
  anchor: [36, 36],
  scale: 0.4
}

const StyleIconConfig = {
  '13': 'featureIcon/recorder.default.0.png',
  '131': 'featureIcon/recorder.default.0.png',
  '6': 'featureIcon/recorder.default.0.png',
  '41': 'doubleDoor_open.png',
  '4': 'featureIcon/access.default.0.png',
  '42': 'featureIcon/intercom.default.0.png',
  '5': 'featureIcon/intercom.default.0.png',
  '1': 'featureIcon/recorder.default.0.png',
  '12': 'featureIcon/alarm.default.0.png',
  '16': 'featureIcon/alarm.default.0.png',
  '161': 'featureIcon/recorder.default.0.png'
}
const StyleConfig = {
  /**
   * @description: 动态获取要素展现风格样式
   * @param {String} type 设备主类型
   * @param {String} subType 设备子类型
   * @param {Number} status 设备主类型
   * @returns {*} opengis要素图标样式对象
   * 样式配置应该通过主类型、子类型、设备状态动态配置(建议:类型为key,状态为状态码)
   * const url = `/static/map2d/featureIcon/${type}.${subType}.${status}.png`
   */
  //
  randerFeatureStyle: ({ type, subType, status }) => ({
    iconStyle: { url: `/static/map2d/${type}/${subType}_${status}.png`, ...videoSymbol }
  }),

  /**
   * @description: 动态获取要素展现风格样式
   * @param {String} type 设备类型
   * @param {String} status 设备状态
   */
  renderCommonFeatureStyle: (type, status) => ({
    iconStyle: { url: `/static/map2d/${StyleIconConfig[type + '' + (status || '')]}`, ...videoSymbol }
  }),

  /**
   * @description: 动态获取兴趣点要素展现风格样式
   * @param {String} poiCode 设备类型
   * @param {String} status 设备状态
   */
  renderPoiFeatureStyle: (poiCode, status) => ({
    iconStyle: { url: `/static/map2d/poi/3.png`, ...poiSymbol }
  }),

  /**
   * 设备-摄像头，图标定义 -shen
   */

  /**
   * 枪机类型 点位在线状态
   */
  boltipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/boltipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 半球类型 点位在线状态
   */
  halfBallipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/halfBallipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 快球机类型 点位在线状态
   */
  fastBallipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/fastBallipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 针孔类型 点位在线状态
   */
  pinholeipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/pinholeipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 红外枪机类型 点位在线状态
   */
  redBoltipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/redBoltipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 全景类型 点位在线状态
   */
  allViewipcSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/allViewipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 智能IPC类型 点位在线状态
   */
  smartIPCSymbol: {
    iconStyle: {
      // url: '/static/map2d/camera/smartIPC_1.png',
      url: '/static/map2d/camera/intelligentipc_1.png',
      ...videoSymbol
    }
  },
  /**
   * 点位可视域图层样式
   */
  sectorLayerSymbol: {
    fillColor: 'rgba(242, 173, 81, 0.4)'
  },

  /**
   * 设备-录像机，图标定义
   */

  /**
   * 设备-报警设备，图标定义
   */

  /**
   * 电话报警主机类型 点位在线状态
   */
  telAlarmHostSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/telAlarmHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 网络报警主机类型 点位在线状态
   */
  networkAlarmHostSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/networkAlarmHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 电子围栏总线报警主机类型 点位在线状态
   */
  fenceAlarmHostSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/fenceAlarmHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 震动光纤报警主机类型 点位在线状态
   */
  shakeAlarmHostSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/shakeAlarmHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 壁挂双鉴探测器类型 点位在线状态
   */
  wallDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/wallDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 吸顶双鉴探测器类型 点位在线状态
   */
  ceilingDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/ceilingDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * ATM震动探测器类型 点位在线状态
   */
  atmShakeDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/atmShakeDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 金库震动探测器类型 点位在线状态
   */
  vaultShakeDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/vaultShakeDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 门磁探测器类型 点位在线状态
   */
  doorMagneticDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/doorMagneticDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 玻璃破碎探测器类型 点位在线状态
   */
  glassBrokenDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/glassBrokenDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 光电烟感探测器类型 点位在线状态
   */
  smokeDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/smokeDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 红外幕帘探测器类型 点位在线状态
   */
  pirCurtainDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/pirCurtainDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 温度探测器类型 点位在线状态
   */
  temperatureDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/temperatureDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 漏水探测器类型 点位在线状态
   */
  leakDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/leakDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 紧急按钮 (有声)类型 点位在线状态
   */
  voicedDangerButtonSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/voicedDangerButton_1.png',
      ...videoSymbol
    }
  },
  /**
   * 紧急按钮 无声类型 点位在线状态
   */
  silentDangerButtonSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/silentDangerButton_1.png',
      ...videoSymbol
    }
  },
  /**
   * 红外对射探测器类型 点位在线状态
   */
  correlationDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/correlationDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 位移探测器类型 点位在线状态
   */
  offsetDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/offsetDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 振动光纤类型 点位在线状态
   */
  shakeOpticalSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/shakeOptical_1.png',
      ...videoSymbol
    }
  },
  /**
   * 电子围栏总线报警主机类型 点位在线状态
   */
  electronicFenceSymbol: {
    iconStyle: {
      url: '/static/map2d/alarm/electronicFence_1.png',
      ...videoSymbol
    }
  },

  /**
   * 录像机类型 点位在线状态
   */
  videoRecorderSymbol: {
    iconStyle: {
      url: '/static/map2d/camera/videoRecorder_1.png',
      ...videoSymbol
    }
  },

  /**
   * 设备-门禁，图标定义
   */

  /**
   * 门禁主机类型 点位在线状态
   */
  accessHostSymbol: {
    iconStyle: {
      url: '/static/map2d/access/accessHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 门禁通道类型 点位在线状态
   */
  accessChannelSymbol: {
    iconStyle: {
      url: '/static/map2d/access/accessChannel_1.png',
      ...videoSymbol
    }
  },
  /**
   * 互锁门通道类型 点位在线状态
   */ LockDoorSymbol: {
    iconStyle: {
      url: '/static/map2d/access/LockDoor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 闸机类型 点位在线状态
   */ gateSymbol: {
    iconStyle: {
      url: '/static/map2d/access/gate_1.png',
      ...videoSymbol
    }
  },

  /**
   * 设备-防护舱，图标定义
   */

  /**
   * 防护舱主机类型 点位在线状态
   */
  protectedCabinHostSymbol: {
    iconStyle: {
      url: '/static/map2d/protectedCabin/protectedCabinHost_1.png',
      ...videoSymbol
    }
  },
  /**
   * 类型 点位在线状态
   */
  protectedCabinChannelSymbol: {
    iconStyle: {
      url: '/static/map2d/protectedCabin/protectedCabinChannel_1.png',
      ...videoSymbol
    }
  },

  /**
   * 对讲设备类型
   */
  intercomHostSymbol: {
    // 对讲主机
    iconStyle: {
      url: '/static/map2d/intercom/intercomHost_1.png',
      ...videoSymbol
    }
  },
  intercomChannelSymbol: {
    // 对讲通道
    iconStyle: {
      url: '/static/map2d/intercom/intercomChannel_1.png',
      ...videoSymbol
    }
  },

  /**
   * 机构选中类型
   */
  headOfficeSymbol: {
    // 总行
    iconStyle: {
      url: '/static/map2d/importPart/headOffice_1.png',
      ...videoSymbol
    }
  },
  tierOneBranchSymbol: {
    // 一级分行
    iconStyle: {
      url: '/static/map2d/importPart/tierOneBranch_1.png',
      ...videoSymbol
    }
  },
  secondLevelBranchSymbol: {
    // 二级分行
    iconStyle: {
      url: '/static/map2d/importPart/secondLevelBranch_1.png',
      ...videoSymbol
    }
  },
  countyLevelSymbol: {
    // 县级行
    iconStyle: {
      url: '/static/map2d/importPart/countyLevel_1.png',
      ...videoSymbol
    }
  },
  directlyBranchSymbol: {
    // 直属支行
    iconStyle: {
      url: '/static/map2d/importPart/directlyBranch_1.png',
      ...videoSymbol
    }
  },
  /**
   * 重点部位选中类型
   */
  businessOutletsSymbol: {
    // 营业网点
    iconStyle: {
      url: '/static/map2d/keyParts/businessOutlets_1.png',
      ...videoSymbol
    }
  },
  vaultSymbol: {
    // 金库
    iconStyle: {
      url: '/static/map2d/keyParts/vault_1.png',
      ...videoSymbol
    }
  },
  computerRoomSymbol: {
    // 计算机房
    iconStyle: {
      url: '/static/map2d/keyParts/computerRoom_1.png',
      ...videoSymbol
    }
  },
  officeBuildingSymbol: {
    // 办公楼
    iconStyle: {
      url: '/static/map2d/keyParts/officeBuilding_1.png',
      ...videoSymbol
    }
  },
  selfServiceBankSymbol: {
    // 自助银行
    iconStyle: {
      url: '/static/map2d/keyParts/selfServiceBank_1.png',
      ...videoSymbol
    }
  },
  selfServiceEquipmentSymbol: {
    // 自助设备
    iconStyle: {
      url: '/static/map2d/keyParts/selfServiceEquipment_1.png',
      ...videoSymbol
    }
  },
  selfServiceSilverSymbol: {
    // 自助银亭
    iconStyle: {
      url: '/static/map2d/keyParts/selfServiceSilver_1.png',
      ...videoSymbol
    }
  },
  privateBankSymbol: {
    // 私人银行
    iconStyle: {
      url: '/static/map2d/keyParts/privateBank_1.png',
      ...videoSymbol
    }
  },
  safeDepositSymbol: {
    // 保险箱库
    iconStyle: {
      url: '/static/map2d/keyParts/safeDeposit_1.png',
      ...videoSymbol
    }
  },
  archivesCenterSymbol: {
    // 档案室
    iconStyle: {
      url: '/static/map2d/keyParts/archivesCenter_1.png',
      ...videoSymbol
    }
  },
  remoteControlCenterSymbol: {
    // 远程监控中心
    iconStyle: {
      url: '/static/map2d/keyParts/remoteControlCenter_1.png',
      ...videoSymbol
    }
  },
  fiveGSmartBankingSymbol: {
    // 5G + 智能银行
    iconStyle: {
      url: '/static/map2d/keyParts/fiveGSmartBanking_1.png',
      ...videoSymbol
    }
  },
  fortuneCenterSymbol: {
    // 财富中心
    iconStyle: {
      url: '/static/map2d/keyParts/fortuneCenter_1.png',
      ...videoSymbol
    }
  },
  otherKeyPartsSymbol: {
    // 其他重点部位
    iconStyle: {
      url: '/static/map2d/keyParts/otherKeyParts_1.png',
      ...videoSymbol
    }
  },
  xuniSymbol: {
    // 虚拟重点部位
    iconStyle: {
      url: '/static/map2d/keyParts/xuni_1.png',
      ...videoSymbol
    }
  },
  // 消防设备

  /**
   *  用户信息传输装置+协议解析器 类型 点位在线状态
   */
  userInfoTransmissionDeviceSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/userInfoTransmissionDevice_1.png',
      ...videoSymbol
    }
  },
  /**
   * 消防泵监测仪 类型 点位在线状态
   */
  firePumpMonitorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/firePumpMonitor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 液压传感器 类型 点位在线状态
   */
  hydraulicSensorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/hydraulicSensor_2.png',//特殊
      ...videoSymbol
    }
  },
  /**
   *   液位传感器 类型 点位在线状态
   */
  liquidLevelSensorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/liquidLevelSensor_2.png',//特殊
      ...videoSymbol
    }
  },
  /**
   *  防排烟监测仪 类型 点位在线状态
   */
  smokePreventionMonitorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/smokePreventionMonitor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 气体监测仪 类型 点位在线状态
   */
  gasMonitorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/gasMonitor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 防火分隔监测仪 类型 点位在线状态
   */
  fireSeparationMonitorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/fireSeparationMonitor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 电气火灾探测器 类型 点位在线状态
   */
  electricalFireDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/electricalFireDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 剩余电流互感器 类型 点位在线状态
   */
  // residualCurrentTransformerSymbol: {
  //   iconStyle: {
  //     url: '/static/map2d/fireFighting/residualCurrentTransformer_1.png',
  //     ...videoSymbol
  //   }
  // },
  /**
   * 电流互感器 类型 点位在线状态
   */
  // currentTransformerSymbol: {
  //   iconStyle: {
  //     url: '/static/map2d/fireFighting/currentTransformer_1.png',
  //     ...videoSymbol
  //   }
  // },
  /**
   * 温度传感器 类型 点位在线状态
   */
  // temperatureSensorSymbol: {
  //   iconStyle: {
  //     url: '/static/map2d/fireFighting/temperatureSensor_1.png',
  //     ...videoSymbol
  //   }
  // },

  /**
   * 故障电弧探测器 类型 点位在线状态
   */
  // faultArcDetectorSymbol: {
  //   iconStyle: {
  //     url: '/static/map2d/fireFighting/faultArcDetector_1.png',
  //     ...videoSymbol
  //   }
  // },

  /**
   * 独立烟感探测器 类型 点位在线状态
   */
  independentSmokeDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/independentSmokeDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 独立温感探测器 类型 点位在线状态
   */
  independentTemperatureSensorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/independentTemperatureSensor_1.png',
      ...videoSymbol
    }
  },
  /**
   * 独立可燃气体探测器 类型 点位在线状态
   */
  independentCombustibleGasDetectorSymbol: {
    iconStyle: {
      url: '/static/map2d/fireFighting/independentCombustibleGasDetector_1.png',
      ...videoSymbol
    }
  },
  /**
   * 点位选中状态
   */
  selectOnlineSymbol: {
    iconStyle: {
      url: '/static/map2d/select.png',
      ...selectSymbol
    }
  },

  /**
   * 行政区划高亮图层样式
   */
  administrativeAreaSymbol: {
    fillColor: 'rgba(236, 227, 191, 0.4)',
    strokeStyle: {
      outLineWidth: 2,
      outLineColor: 'rgba(244,121,120)'
    },
    textStyle: {
      label: '',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#06E3B2',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    }
  },

  /**
   * 天气行政区划图层普通样式
   */
  weatherAreaSymbol: {
    fillColor: 'rgba(234, 244, 254, 0.9)',
    strokeStyle: {
      outLineWidth: 2,
      outLineColor: 'rgb(58,125,192)'
    }
  },
  /**
   * 天气行政区划图层高亮样式
   */
  weatherAreaHeightSymbol: {
    fillColor: 'rgba(140, 228, 254, 0.9)',
    strokeStyle: {
      outLineWidth: 2,
      outLineColor: 'rgb(34,111,182)'
    }
  },

  /**
   * 天气行政区划图层文字样式
   */
  weatherAreaTextSymbol: {
    fillColor: 'rgba(236, 227, 191, 0.0001)',
    strokeStyle: {
      outLineWidth: 2,
      outLineColor: 'rgba(244,121,120,00.0001)'
    },
    textStyle: {
      fontFamily: '微软雅黑',
      label: '',
      labelXOffset: 0,
      labelYOffset: 0,
      fontSize: 1.2,
      fillColor: 'rgb(10,10,10)'
    }
  },

  /**
   * 天气行政区划图层高亮样式
   */
  routePlanLineSymbol: {
    fillColor: 'rgba(140, 228, 254, 0.9)',
    strokeStyle: {
      outLineWidth: 6,
      outLineColor: '#0000ff'
    }
  },
  /**
   * 关联关系图层连线样式
   */
  associationLineSymbol: {
    fillColor: 'rgba(204,153,51, 0.7)',
    strokeStyle: {
      outLineWidth: 2,
      outLineColor: 'rgba(204,153,51, 0.7)',
      lineDash: [1, 2, 3, 4]
    }
  },
  /**
   * 高亮图标样式
   */
  hightLightSymbol: {
    iconStyle: {
      url: '/static/map2d/select.png',
      anchor: [25, 40],
      scale: 0.8
    }
  },
  /**
   * 高亮多点图标样式
   */
  hightLightMorePointSymbol: {
    iconStyle: {
      url: '/static/map2d/select.png',
      anchor: [12.5, 20],
      scale: 0.8
    }
  }
}
export default StyleConfig
