import { DEVICETYPE, ALARMDEVICETYPE, FIREFIGHTINGDEVICETYPE } from 'assets/2DMap/meta/common'
const { default: point } = require('../../../../store/modules/map2D/point')

function getShowInfo(type, subType, obj) {
  const setObj = {
    1: {
      attributeName: 'org', // 点位数据
      attributeArr: [
        { name_cn: '机构名称', attribute: 'name' },
        { name_cn: '机构地址', attribute: 'address' },
        { name_cn: '分管领导', attribute: 'functionary' },
        { name_cn: '分管领导电话', attribute: 'mobile' }
      ]
    }, // 'importPart', // 现在的机构 org
    2: {
      attributeName: 'keyPart', // 点位数据
      attributeArr: [
        { name_cn: '部位名称', attribute: 'name' },
        { name_cn: '部位地址', attribute: 'address' },
        { name_cn: '部位负责人', attribute: 'principal1' },
        { name_cn: '负责人电话', attribute: 'telephone1' }
      ]
    }, // 'keyParts', // 新重点部位 营业网点等
    3: {
      // 摄像机
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'class', attribute_dict: {1: '枪机', 2: '半球', 3: '球机', 4: '针孔', 5: '红外枪机', 6: '智能IPC', 7: '全景'} },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'camera', // 摄像机
    4: {
      // 录像机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type', attribute_dict: { 1: 'NVR', 2: 'HDVR', 3: 'DVR', 4: 'IPC' } },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'recorder', // 视频主机
    51: {
      // 报警主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    },
    52: {
      // 报警设备
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    },
    61: {
      // 报警主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    },
    62: {
      // 报警设备
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    },
    71: { // 对讲主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'intercom', // 对讲主机
    72: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '对讲通道名称', attribute: 'name' },
        { name_cn: '通道类型',
          attribute: 'type',
          attribute_dict: { 1: '对讲通道', 2: '输出通道' }},
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'keyParts', // 新重点部位 营业网点等
    81: {
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '主机类型', attribute: 'type', attribute_dict: { 1: '金库门禁', 2: '普通门禁', 3: '互锁门门禁' } },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' }
      ]
    }, // 'access', // 门禁主机
    82: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '门禁通道名称', attribute: 'name' },
        { name_cn: '门禁通道类型', attribute: 'type', attribute_dict: { 1: '门禁通道', 2: '读头通道', 3: '报警输入' } },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'access', // 门禁通道
    83: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' }
      ]
    }, // 'access', // 互锁门通道
    84: {
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '主机类型', attribute: 'type', attribute_dict: { 1: '金库门禁', 2: '普通门禁', 3: '互锁门门禁' } },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' }
      ]
    }, // 'access', // 互锁门主机
    91: { // 防护舱主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }, // 'intercom', //
    92: { // 防护舱通道
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '通道名称', attribute: 'name' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' }
      ]
    }
  }
  let selectObj = setObj[type] || setObj[getSelectSpecialObj(type, subType)]
  return getShowEndResult(selectObj.attributeArr, obj[selectObj.attributeName], subType)
}

function getSelectSpecialObj(type, subType) {
  subType = Number(subType)

  let endType
  if (type === 8 && subType === 1) {
    endType = 81
  } else if (type === 8 && subType === 2) {
    endType = 82
  } else if (type === 8 && subType === 3) {
    endType = 83
  } else if (type === 8 && subType === 4) {
    endType = 84
  } else if (type === 7 && Number(subType) === 1) {
    endType = 71
  } else if (type === 7 && Number(subType) === 2) {
    endType = 72
  } else if (type === 9 && Number(subType) === 1) {
    endType = 91
  } else if (type === 9 && Number(subType) === 2) {
    endType = 92
  } else if (type === DEVICETYPE.alarmDevice) {
    // 报警主机 1-4
    if (
      subType === ALARMDEVICETYPE.telephoneHost ||
      subType === ALARMDEVICETYPE.networkHost ||
      subType === ALARMDEVICETYPE.eleFenceBusHost ||
      subType === ALARMDEVICETYPE.vibrationFiberHost
    ) {
      endType = 51
    }

    if (
      // 5-20
      subType === ALARMDEVICETYPE.wallMountedDualDetector ||
      subType === ALARMDEVICETYPE.ceilingDoubleDetector ||
      subType === ALARMDEVICETYPE.atmShockDetector ||
      subType === ALARMDEVICETYPE.treasuryVibrationDetector ||
      subType === ALARMDEVICETYPE.doorMagneticDetector ||
      subType === ALARMDEVICETYPE.glassBreakDetector ||
      subType === ALARMDEVICETYPE.photoelectricSmokeDetector ||
      subType === ALARMDEVICETYPE.infraredCurtainDetectorIntrusion ||
      subType === ALARMDEVICETYPE.temperatureDetector ||
      subType === ALARMDEVICETYPE.waterLeakDetector ||
      subType === ALARMDEVICETYPE.emergencyButtonWithSound ||
      subType === ALARMDEVICETYPE.emergencyButtonSilent ||
      subType === ALARMDEVICETYPE.infraredDetector ||
      subType === ALARMDEVICETYPE.displacementDetector ||
      subType === ALARMDEVICETYPE.vibratingFiber ||
      subType === ALARMDEVICETYPE.electricFence
    ) {
      endType = 52
    }
  } else if (type === DEVICETYPE.fireDevice) {
    // 消防设备
    // hydraulicSensor: 10, // 液压传感器
    // liquidLevelSensor: 11, // 液位传感器
    if (subType === FIREFIGHTINGDEVICETYPE.hydraulicSensor || subType === FIREFIGHTINGDEVICETYPE.liquidLevelSensor) {
      endType = 62
    } else {
      endType = 61
    }
  }

  return endType
}

function getShowEndResult(arr, obj, subType) {
  let endArr = []
  if (!obj) {
    arr.forEach(element => {
      let endObj = {
        name: element.name_cn,
        value: ''
      }
      endArr.push(endObj)
    })
    return
  }

  arr.forEach(element => {
    let endObj = {
      name: element.name_cn,
      value: obj[element.attribute] ? obj[element.attribute] : ''
    }
    if (element.subType_dict) { endObj.name = element.subType_dict[subType] }
    if (element.attribute_dict) { endObj.value = element.attribute_dict[obj[element.attribute]] }
    endObj.name = endObj.name ? endObj.name : ''
    endObj.value = endObj.value ? endObj.value : ''
    endArr.push(endObj)
  })
  return endArr
}

// 顶部图片添加功能
function getTopImageIsShow(type, subType) {
  const DEVICETYPETRANSATE = {
    1: true, // 'importPart', // 现在的机构 org
    2: true, // 'keyParts', // 新重点部位 营业网点等
    3: false, // 'camera', // 摄像机
    4: false, // 'recorder', // 视频主机
    5: false, // 'alarm', // 报警设备
    6: false, // 'fireFighting', // 消防设备
    7: false, // 'intercom', // 对讲设备f
    8: false, // 'access', // 门禁设备
    9: false // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

// 微缩图形态
function getSmallImageIsShow(type, subType) {
  const DEVICETYPETRANSATE = {
    1: true, // 'importPart', // 现在的机构 org
    2: true, // 'keyParts', // 新重点部位 营业网点等
    3: false, // 'camera', // 摄像机
    4: false, // 'recorder', // 视频主机
    5: false, // 'alarm', // 报警设备
    6: false, // 'fireFighting', // 消防设备
    7: false, // 'intercom', // 对讲设备f
    8: false, // 'access', // 门禁设备
    9: false // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

// 环境平面图
function getOutFloorAddIsShow(type, subType) {
  const DEVICETYPETRANSATE = {
    1: true, // 'importPart', // 现在的机构 org
    2: true, // 'keyParts', // 新重点部位 营业网点等
    3: false, // 'camera', // 摄像机
    4: false, // 'recorder', // 视频主机
    5: false, // 'alarm', // 报警设备
    6: false, // 'fireFighting', // 消防设备
    7: false, // 'intercom', // 对讲设备f
    8: false, // 'access', // 门禁设备
    9: false // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

// 楼层添加
function getFloorAddIsShow(type, subType) {
  const DEVICETYPETRANSATE = {
    1: true, // 'importPart', // 现在的机构 org
    2: true, // 'keyParts', // 新重点部位 营业网点等
    3: false, // 'camera', // 摄像机
    4: false, // 'recorder', // 视频主机
    5: false, // 'alarm', // 报警设备
    6: false, // 'fireFighting', // 消防设备
    7: false, // 'intercom', // 对讲设备f
    8: false, // 'access', // 门禁设备
    9: false // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

// 可见层级
function getCanLevelIsShow(type, subType) {
  const DEVICETYPETRANSATE = {
    1: false, // 'importPart', // 现在的机构 org
    2: true, // 'keyParts', // 新重点部位 营业网点等
    3: true, // 'camera', // 摄像机
    4: true, // 'recorder', // 视频主机
    5: true, // 'alarm', // 报警设备
    6: true, // 'fireFighting', // 消防设备
    7: true, // 'intercom', // 对讲设备f
    8: true, // 'access', // 门禁设备
    9: true // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

// 类型名称
function getTypeName(type, subType) {
  const DEVICETYPETRANSATE = {
    1: '重点部位', // 'importPart', // 现在的机构 org
    2: '机构', // 'keyParts', // 新重点部位 营业网点等
    3: '摄像机', // 'camera', // 摄像机
    4: '视频主机', // 'recorder', // 视频主机
    5: '报警设备', // 'alarm', // 报警设备
    6: '消防设备', // 'fireFighting', // 消防设备
    7: '对讲设备', // 'intercom', // 对讲设备f
    8: '门禁设备', // 'access', // 门禁设备
    9: '防护舱' // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

export function setOverPlayInfo(point_obj) {
  let { type, subType } = point_obj
  subType = Number(subType)
  return {
    topImage: getTopImageIsShow(type, subType), // 顶部图片
    showInfo: getShowInfo(type, subType, point_obj), // 信息列表
    smallImage: getSmallImageIsShow(type, subType), // 微缩图形态
    outFloor: getOutFloorAddIsShow(type, subType), // 环境平面图
    floorAdd: getFloorAddIsShow(type, subType), // 楼层列表
    canLevel: getCanLevelIsShow(type, subType), // 显示层级
    typeName: getTypeName(type, subType) // 顶部名称
  }
}
