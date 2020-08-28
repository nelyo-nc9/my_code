import { DEVICETYPE, ALARMDEVICETYPE, FIREFIGHTINGDEVICETYPE } from 'assets/2DMap/meta/common'
const { default: point } = require('../../../store/modules/map2D/point')

function getShowInfo(type, subType, obj) {
  const setObj = {
    3: {
      // 摄像机
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '设备类型', attribute: 'class', attribute_dict: {1: '枪机', 2: '半球', 3: '球机', 4: '针孔', 5: '红外枪机', 6: '智能IPC', 7: '全景'} },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'camera', // 摄像机
    4: {
      // 录像机
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type', attribute_dict: { 1: 'NVR', 2: 'HDVR', 3: 'DVR', 4: 'IPC' } },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'recorder', // 视频主机
    51: {
      // 报警主机
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    52: {
      // 报警设备

      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '设备类型', attribute: 'type' },
        { name_cn: '防区序号', attribute: 'serialNumber' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    61: {
      // 消防主机
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'inputDeviceIp' },
        { name_cn: '设备类型', attribute: 'inputDeviceType' },
        { name_cn: '品牌', attribute: 'inputDeviceBrand' },
        { name_cn: '型号', attribute: 'inputDeviceModel' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }

      ]
    },
    62: {
      // 消防设备
      attributeArr: [
        { name_cn: '探测器名称', attribute: 'deviceName' },
        { name_cn: '设备ID', attribute: 'hostId' },
        { name_cn: '设备类型', attribute: 'deviceType' },
        { name_cn: '所属设备', attribute: '' },
        { name_cn: '品牌', attribute: 'deviceBrand' },
        { name_cn: '设备型号', attribute: 'modelNum' },
        { name_cn: '关联系统', attribute: 'subSystem' },
        { name_cn: '关联部件', attribute: 'name' },
        { name_cn: '设备协议', attribute: 'communicationType' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 2: '离线', 1: '在线' } } // 这个是对调的
      ]
    },
    71: {
      // 对讲主机

      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属平台', attribute: 'platformName' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'intercom', // 对讲主机
    72: {

      attributeArr: [
        { name_cn: '对讲通道名称', attribute: 'name' },
        { name_cn: '通道号', attribute: 'serise' },
        { name_cn: '通道类型', attribute: 'type', attribute_dict: { 1: '对讲通道', 2: '输出通道' } },
        { name_cn: '所属主机', attribute: 'deviceName' },
        { name_cn: '所属平台', attribute: 'platformName' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'keyParts', // 新重点部位 营业网点等
    81: {

      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '主机类型', attribute: 'type', attribute_dict: { 1: '金库门禁', 2: '普通门禁', 3: '互锁门门禁' } },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属平台', attribute: 'platformName' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 门禁主机
    82: {

      attributeArr: [
        { name_cn: '门禁通道名称', attribute: 'name' },
        { name_cn: '门禁通道号', attribute: 'serise' },
        { name_cn: '门禁通道类型', attribute: 'type', attribute_dict: { 1: '门禁通道', 2: '读头通道', 3: '报警输入' } },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 门禁通道
    83: {

      attributeArr: [
        { name_cn: '设备名称', attribute: 'class' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 互锁门通道
    84: {

      attributeArr: [
        { name_cn: '设备名称', attribute: 'class' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 防护舱主机
    91: {
      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    // '防护舱通道s
    92: {
      attributeArr: [
        { name_cn: '通道名称', attribute: 'name' },
        { name_cn: '通道号', attribute: 'serise' },
        { name_cn: '通道ID', attribute: 'uniqueId' },
        { name_cn: '所属主机', attribute: 'deviceName' },
        { name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: { 1: '视频子系统', 2: '报警子系统', 3: '门禁子系统', 4: '音频子系统', 5: '防护舱子系统', 6: '停车场子系统', 7: '电视墙子系统' }},
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keypartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }
  }

  let selectObj = setObj[type] || setObj[getSelectSpecialObj(type, subType)]
  return getShowEndResult(selectObj.attributeArr, obj, subType)
}

function getSelectSpecialObj(type, subType) {
  // debugger
  subType = Number(subType)
  console.log(type, subType)
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
    if (element.subType_dict) {
      endObj.name = element.subType_dict[subType]
    }
    if (element.attribute_dict) {
      endObj.value = element.attribute_dict[obj[element.attribute]]
    }
    endObj.name = endObj.name ? endObj.name : ''
    endObj.value = endObj.value ? endObj.value : ''
    endArr.push(endObj)
  })
  return endArr
}

export function getRealtionEquInfo(point_obj) {
  let { type, subType } = point_obj.point
  subType = Number(subType)
  return {
    showInfo: getShowInfo(type, subType, point_obj) // 信息列表
  }
}
