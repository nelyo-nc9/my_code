// 点、线、区域 绘制时鼠标提示样式
import defaultStyle from './style'
const iconStyleScale = 0.4
const iconStyleAnchor = [48, 48]
// 常用字符串 -shen
const clickadd_text = '点击绘制'
const dianwei_text = '点位'

const defaultDraw = {
  // 默认摄像机-枪机绘制
  textStyle: {
    label: '单击添加视频点位',
    labelXOffset: 0,
    labelYOffset: -25,
    fillColor: '#ff0000',
    outLineColor: '#00ff00',
    outLineWidth: 5,
    lineDash: [1],
    fontFamily: ''
  },
  iconStyle: {
    url: '/static/map2d/video_gun_online.png',
    anchor: iconStyleAnchor,
    scale: iconStyleScale,
    rotation: 0,
    opacity: 1
  }
}
export default {
  // 点选要素
  clickSelect: {
    textStyle: {
      label: '单击定位',
      labelXOffset: 0,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0.5, 0.5],
      scale: 0.01
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  // 圆形框选
  circleSelect: {
    textStyle: {
      label: '单击绘制区域中心,再次单击确定范围半径',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  // 多边形框选
  polygonSelect: {
    textStyle: {
      label: '单击绘制区域节点,双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  areaDraw: {
    textStyle: {
      label: '单击绘制区域节点,双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    fillColor: 'rgba(255, 0, 0, 0.5)',
    strokeStyle: {
      lineDash: [1],
      outLineColor: 'rgba(255, 0, 0, 0)',
      outLineWidth: 1
    }
  },
  lineDraw: {
    textStyle: {
      label: '单击绘制线节点,双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      lineDash: [1],
      outLineColor: 'rgba(255, 0, 0, 0)',
      outLineWidth: 1
    }
  },
  areaDrawEnd: {
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  gridDraw: {
    // 网格绘制
    textStyle: {
      label: '单击绘制网格',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  gridDrawEnd: {
    // 网格绘制完成
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  buildDraw: {
    // 楼宇绘制
    textStyle: {
      label: '单击绘制楼宇',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/building.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  buildDrawEnd: {
    // 楼宇绘制完成
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  boltipc: {
    // 摄像机-枪机绘制
    ...defaultDraw
  },
  //消防设备
  userInfoTransmissionDeviceDraw: {
    // 消防设备-用户信息传输装置+协议解析器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '用户信息传输装置+协议解析器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/userInfoTransmissionDevice_1.png'
    }
  },
  firePumpMonitorDraw: {
    // 消防设备-消防泵监测仪绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '消防泵监测仪' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/firePumpMonitor_1.png'
    }
  },
  hydraulicSensorDraw: {
    // 消防设备-液压传感器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '液压传感器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/hydraulicSensor_2.png' // 特殊
    }
  },
  liquidLevelSensorDraw: {
    // 消防设备-液位传感器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '液位传感器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/liquidLevelSensor_2.png' // 特殊
    }
  },
  smokePreventionMonitorDraw: {
    // 消防设备-防排烟监测仪绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '防排烟监测仪' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/smokePreventionMonitor_1.png'
    }
  },
  gasMonitorDraw: {
    // 消防设备-气体监测仪绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '气体监测仪' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/gasMonitor_1.png'
    }
  },
  fireSeparationMonitorDraw: {
    // 消防设备-防火分隔监测仪绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '防火分隔监测仪' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/fireSeparationMonitor_1.png'
    }
  },
  electricalFireDetectorDraw: {
    // 消防设备-电气火灾探测器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '电气火灾探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/electricalFireDetector_1.png'
    }
  },
  // residualCurrentTransformerDraw: {
  //   // 消防设备-剩余电流互感器绘制
  //   textStyle: {
  //     ...defaultDraw.textStyle,
  //     label: clickadd_text + '剩余电流互感器' + dianwei_text
  //   },
  //   iconStyle: {
  //     ...defaultDraw.iconStyle,
  //     url: '/static/map2d/fireFighting/residualCurrentTransformer_1.png'
  //   }
  // },
  // currentTransformerDraw: {
  //   // 消防设备-电流互感器绘制
  //   textStyle: {
  //     ...defaultDraw.textStyle,
  //     label: clickadd_text + '电流互感器' + dianwei_text
  //   },
  //   iconStyle: {
  //     ...defaultDraw.iconStyle,
  //     url: '/static/map2d/fireFighting/currentTransformer_1.png'
  //   }
  // },
  // temperatureSensorDraw: {
  //   // 消防设备-温度传感器绘制
  //   textStyle: {
  //     ...defaultDraw.textStyle,
  //     label: clickadd_text + '温度传感器' + dianwei_text
  //   },
  //   iconStyle: {
  //     ...defaultDraw.iconStyle,
  //     url: '/static/map2d/fireFighting/temperatureSensor_1.png'
  //   }
  // },
  // faultArcDetectorDraw: {
  //   // 消防设备-故障电弧探测器绘制
  //   textStyle: {
  //     ...defaultDraw.textStyle,
  //     label: clickadd_text + '故障电弧探测器' + dianwei_text
  //   },
  //   iconStyle: {
  //     ...defaultDraw.iconStyle,
  //     url: '/static/map2d/fireFighting/faultArcDetector_1.png'
  //   }
  // },
  independentSmokeDetectorDraw: {
    // 消防设备-独立烟感探测器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '独立烟感探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/independentSmokeDetector_1.png'
    }
  },
  independentTemperatureSensorDraw: {
    // 消防设备-独立温感探测器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '独立温感探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/independentTemperatureSensor_1.png'
    }
  },
  independentCombustibleGasDetectorDraw: {
    // 消防设备-独立可燃气体探测器绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '独立可燃气体探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/fireFighting/independentCombustibleGasDetector_1.png'
    }
  },
  // 绘制样式设置-shen
  boltipcDraw: {
    // 摄像机-枪机绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '枪机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/boltipc_1.png'
    }
  },
  redBoltipcDraw: {
    // 摄像机-红外枪机绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '红外枪机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/redBoltipc_1.png'
    }
  },
  halfBallipcDraw: {
    // 摄像机-半球绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '半球' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/halfBallipc_1.png'
    }
  },
  fastBallipcDraw: {
    // 摄像机-球机绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '球机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/fastBallipc_1.png'
    }
  },
  allViewipcDraw: {
    // 摄像机-全景绘制
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '全景' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/allViewipc_1.png'
    }
  },
  pinholeipcDraw: {
    // 摄像机-针孔
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '针孔' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/pinholeipc_1.png'
    }
  },
  smartIPCDraw: {
    // 摄像机-智能IPC
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '智能IPC' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      // url: '/static/map2d/camera/smartIPC_1.png'
      url: '/static/map2d/camera/intelligentipc_1.png'
    }
  },
  // 定义视频主机/录像机
  videoRecorderDraw: {
    // 录像机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '录像机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/camera/videoRecorder_1.png'
    }
  },
  //
  // 定义报警设备的绘制-shen
  telAlarmHostDraw: {
    // 电话报警主机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '电话报警主机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/telAlarmHost_1.png'
    }
  },
  networkAlarmHostDraw: {
    // 网络报警主机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '网络报警主机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/networkAlarmHost_1.png'
    }
  },
  fenceAlarmHostDraw: {
    // 电子围栏总线报警主机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '电子围栏总线报警主机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/fenceAlarmHost_1.png'
    }
  },
  shakeAlarmHostDraw: {
    // 震动光纤报警主机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '震动光纤报警主机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/shakeAlarmHost_1.png'
    }
  },
  wallDetectorDraw: {
    // 壁挂双鉴探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '壁挂双鉴探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/wallDetector_1.png'
    }
  },
  ceilingDetectorDraw: {
    // 吸顶双鉴探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '吸顶双鉴探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/ceilingDetector_1.png'
    }
  },
  atmShakeDetectorDraw: {
    // ATM震动探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + 'ATM震动探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/atmShakeDetector_1.png'
    }
  },
  vaultShakeDetectorDraw: {
    // 金库震动探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '金库震动探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/vaultShakeDetector_1.png'
    }
  },
  doorMagneticDetectorDraw: {
    // 门磁探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '门磁探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/doorMagneticDetector_1.png'
    }
  },
  glassBrokenDetectorDraw: {
    // 玻璃破碎探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '玻璃破碎探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/glassBrokenDetector_1.png'
    }
  },
  smokeDetectorDraw: {
    // 光电烟感探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '光电烟感探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/smokeDetector_1.png'
    }
  },
  pirCurtainDetectorDraw: {
    // 红外幕帘探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '红外幕帘探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/pirCurtainDetector_1.png'
    }
  },
  temperatureDetectorDraw: {
    // 温度探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '温度探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/temperatureDetector_1.png'
    }
  },
  leakDetectorDraw: {
    // 漏水探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '漏水探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/leakDetector_1.png'
    }
  },
  voicedDangerButtonDraw: {
    // 紧急按钮 (有声)
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '紧急按钮 (有声)' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/voicedDangerButton_1.png'
    }
  },
  silentDangerButtonDraw: {
    // 紧急按钮 无声
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '紧急按钮 无声' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/silentDangerButton_1.png'
    }
  },
  correlationDetectorDraw: {
    // 红外对射探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '红外对射探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/correlationDetector_1.png'
    }
  },
  offsetDetectorDraw: {
    // 位移探测器
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '位移探测器' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/offsetDetector_1.png'
    }
  },
  shakeOpticalDraw: {
    // 振动光纤
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '振动光纤' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/shakeOptical_1.png'
    }
  },
  electronicFenceDraw: {
    // 电子围栏总线报警主机
    textStyle: {
      ...defaultDraw.textStyle,
      label: clickadd_text + '电子围栏总线报警主机' + dianwei_text
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/alarm/electronicFence_1.png'
    }
  },
  //
  //
  commonAlarm: {
    // 普通报警绘制
    textStyle: {
      label: '单击添加普通报警点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/featureIcon/recorder.default.0.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  commonAlarmAreaDraw: {
    // 普通报警区域绘制样式
    textStyle: {
      label: '单击添加普通报警区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  commonAlarmAreaDrawEnd: {
    // 普通报警区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  commonAlarmLineDraw: {
    // 普通报警线绘制样式
    textStyle: {
      label: '单击添加普通报警线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  commonAlarmLineDrawEnd: {
    // 普通报警线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  alarmHost: {
    // 报警主机绘制
    textStyle: {
      label: '单击添加报警主机点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/featureIcon/alarm.default.0.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmHostAreaDraw: {
    // 报警主机区域绘制样式
    textStyle: {
      label: '单击添加报警主机区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarmHost_online.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  alarmHostAreaDrawEnd: {
    // 报警主机区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  alarmHostLineDraw: {
    // 报警主机线绘制样式
    textStyle: {
      label: '单击添加报警主机线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarmHost_online.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  alarmHostLineDrawEnd: {
    // 报警主机线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  fireAlarm: {
    // 消防报警绘制
    textStyle: {
      label: '单击添加消防报警点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  fireAlarmAreaDraw: {
    // 消防报警区域绘制样式
    textStyle: {
      label: '单击添加消防报警区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  fireAlarmAreaDrawEnd: {
    // 消防报警区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  fireAlarmLineDraw: {
    // 消防报警线绘制样式
    textStyle: {
      label: '单击添加消防报警线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  fireAlarmLineDrawEnd: {
    // 消防报警线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  alarmBoxDraw: {
    // 报警箱绘制
    textStyle: {
      label: '单击添加报警箱点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_box_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmColumnDraw: {
    // 报警柱绘制
    textStyle: {
      label: '单击添加报警柱点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_column_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolDraw: {
    // 巡更点绘制
    textStyle: {
      label: '单击添加巡更点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/patrol_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  doorControlDraw: {
    // 门禁点绘制
    textStyle: {
      label: '单击添加门禁点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/featureIcon/intercom.default.0.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  doubleDoorDraw: {
    // 互锁门绘制
    textStyle: {
      label: '单击添加互锁门点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/doubleDoor_open.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  speechDraw: {
    // 对讲绘制
    textStyle: {
      label: '单击添加对讲点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/doubleDoor_open.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 防护舱设备

  protectedCabinHostDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加防护舱主机点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/protectedCabin/protectedCabinHost_1.png',
      scale: iconStyleScale
    }
  },
  protectedCabinChannelDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加防护舱通道点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/protectedCabin/protectedCabinChannel_1.png',
      scale: iconStyleScale
    }
  },
  // 门禁设备
  accessHostDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加门禁主机点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/access/accessHost_1.png',
      scale: iconStyleScale
    }
  },
  accessChannelDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加门禁通道点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/access/accessChannel_1.png',
      scale: iconStyleScale
    }
  },
  LockDoorDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加互锁门通道点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/access/LockDoor_1.png',
      scale: iconStyleScale
    }
  },
  // 互锁门主机图标
  doubleDoorChannelDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加互锁门主机点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/access/accessHost_1.png',
      scale: iconStyleScale
    }
  },
  // gateDraw: {
  //   textStyle: {
  //     ...defaultDraw.textStyle,
  //     label: '单击添加闸机点位',
  //     labelXOffset: 10,
  //     labelYOffset: -15
  //   },
  //   iconStyle: {
  //     ...defaultDraw.iconStyle,
  //     url: '/static/map2d/access/gate_1.png',
  //     scale: iconStyleScale
  //   }
  // },

  // 对讲设备
  intercomHostDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加对讲主机点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/intercom/intercomHost_1.png',
      scale: iconStyleScale
    }
  },
  intercomChannelDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加对讲通道点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/intercom/intercomChannel_1.png',
      scale: iconStyleScale
    }
  },
  // 机构点位绘制
  headOfficeDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加总行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/importPart/headOffice_1.png',
      scale: iconStyleScale
    }
  },
  tierOneBranchDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加一级分行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/importPart/tierOneBranch_1.png',
      scale: iconStyleScale
    }
  },
  secondLevelBranchDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加二级分行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/importPart/secondLevelBranch_1.png',
      scale: iconStyleScale
    }
  },
  countyLevelDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加县级行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/importPart/countyLevel_1.png',
      scale: iconStyleScale
    }
  },
  directlyBranchDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加直属级行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/importPart/directlyBranch_1.png',
      scale: iconStyleScale
    }
  },
  // 重点部位
  businessOutletsDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加营业网点点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/businessOutlets_1.png',
      scale: iconStyleScale
    }
  },
  vaultDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加金库点位',
      labelXOffset: 0,
      labelYOffset: -24
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/vault_1.png',
      scale: iconStyleScale
    }
  },
  computerRoomDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加计算机房点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/computerRoom_1.png',
      scale: iconStyleScale
    }
  },
  officeBuildingDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加办公楼点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/officeBuilding_1.png',
      scale: iconStyleScale
    }
  },
  selfServiceBankDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加自助银行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/selfServiceBank_1.png',
      scale: iconStyleScale
    }
  },
  selfServiceEquipmentDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加自助设备点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/selfServiceEquipment_1.png',
      scale: iconStyleScale
    }
  },
  selfServiceSilverDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加自助银亭点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/selfServiceSilver_1.png',
      scale: iconStyleScale
    }
  },
  privateBankrDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加私人银行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/privateBank_1.png',
      scale: iconStyleScale
    }
  },
  safeDepositDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加保险箱库点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/safeDeposit_1.png',
      scale: iconStyleScale
    }
  },
  archivesCenterDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加档案室点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/archivesCenter_1.png',
      scale: iconStyleScale
    }
  },
  remoteControlCenterDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加远程监控中心点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/remoteControlCenter_1.png',
      scale: iconStyleScale
    }
  },
  fiveGSmartBankingDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加5G+智能银行点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/fiveGSmartBanking_1.png',
      scale: iconStyleScale
    }
  },
  fortuneCenterDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加财富中心点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/fortuneCenter_1.png',
      scale: iconStyleScale
    }
  },
  otherKeyPartsDraw: {
    textStyle: {
      ...defaultDraw.textStyle,
      label: '单击添加其他重点部位点位',
      labelXOffset: 10,
      labelYOffset: -15
    },
    iconStyle: {
      ...defaultDraw.iconStyle,
      url: '/static/map2d/keyParts/otherKeyParts_1.png',
      scale: iconStyleScale
    }
  },
  xuniDraw: {
    // 重点部位区域绘制样式
    textStyle: {
      label: '单击添加重点部位区域',
      labelXOffset: 10,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/map2d/keyParts/xuni_1.png',
      anchor: [0, 15],
      scale: iconStyleScale
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  }
}
