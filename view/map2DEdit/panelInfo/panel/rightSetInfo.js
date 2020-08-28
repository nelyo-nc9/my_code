import { DEVICETYPE, ALARMDEVICETYPE, FIREFIGHTINGDEVICETYPE } from 'assets/2DMap/meta/common'
const { default: point } = require('../../../../store/modules/map2D/point')

function getShowInfo(type, subType, obj) {
  const setObj = {
    1: {
      attributeName: 'org', // 点位数据
      attributeArr: [
        { name_cn: '机构名称', attribute: 'name' },
        { name_cn: '机构代码', attribute: 'ccbInsId' },
        { name_cn: '机构地址', attribute: 'address' },
        { name_cn: '分管领导', attribute: 'functionary' },
        { name_cn: '分管领导电话', attribute: 'mobile' },
        { name_cn: '机构电话', attribute: 'telephone' },
        { name_cn: '机构级别', attribute: 'kind' },
        { name_cn: '上级机构', attribute: 'parentName' },
        {
          name_cn: '机构状态',
          attribute: 'status',
          attribute_dict: { 1: '待营业', 2: '正常营业', 3: '暂停营业', 4: '终止营业' }
        },
        { name_cn: '营业时间', attribute: 'businessHours' }
      ]
    }, // 'importPart', // 现在的机构 org
    2: {
      attributeName: 'keyPart', // 点位数据
      attributeArr: [
        { name_cn: '名称', attribute: 'name' },
        { name_cn: '地址', attribute: 'address' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '负责人', attribute: 'principal1' },
        { name_cn: '电话', attribute: 'telephone' },
        { name_cn: '安保联系人', attribute: 'police' },
        { name_cn: '移动电话', attribute: 'principalPhone1' },
        { name_cn: '派出所名称', attribute: 'policeStation' },
        { name_cn: '派出所电话', attribute: 'policeTelephone' },
        { name_cn: '民警姓名', attribute: 'police' },
        { name_cn: '民警移动电话', attribute: 'policeMobilePhone' },
        {
          name_cn: '部位状态',
          attribute: 'status',
          attribute_dict: { 1: '正常', 2: '已撤销', 3: '已合并', 4: '临时停业' }
        }
      ]
    }, // 'keyParts', // 新重点部位 营业网点等

    3: {
      // 摄像机
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'hostIp' },
        {
          name_cn: '设备类型',
          attribute: 'class',
          attribute_dict: { 1: '枪机', 2: '半球', 3: '球机', 4: '针孔', 5: '红外枪机', 6: '智能IPC', 7: '全景' }
        },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        // { name_cn: '是否停用', attribute: 'status' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'camera', // 摄像机
    4: {
      // 录像机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '设备类型', attribute: 'type', attribute_dict: { 1: 'NVR', 2: 'HDVR', 3: 'DVR', 4: 'IPC' } },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'recorder', // 视频主机
    51: {

      // 报警主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '设备类型', attribute: 'deviceType' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'deviceModel' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    52: {
      // 报警设备
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        // { name_cn: 'IP地址', attribute: 'hostIp' },
        { name_cn: '防区序号', attribute: 'serialNumber' },
        { name_cn: '设备类型', attribute: 'deviceType' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'model' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    61: {
      // 消防主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'inputDeviceIp' },
        { name_cn: '设备类型', attribute: 'inputDeviceType' },
        { name_cn: '品牌', attribute: 'inputDeviceBrand' },
        { name_cn: '型号', attribute: 'inputDeviceModel' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }

      ]
    },
    62: {
      // 消防设备
      attributeName: 'resource', // 点位数据
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
    // 6: false, // 'fireFighting', // 消防设备
    71: {
      // 对讲主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属平台', attribute: 'platformName' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'intercom', // 对讲主机
    72: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '对讲通道名称', attribute: 'name' },
        { name_cn: '通道号', attribute: 'serise' },
        { name_cn: '通道类型', attribute: 'type', attribute_dict: { 1: '对讲通道', 2: '输出通道' } },
        { name_cn: '所属主机', attribute: 'deviceName' },
        { name_cn: '所属平台', attribute: 'platformName' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }, // 'keyParts', // 新重点部位 营业网点等
    81: {
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '主机类型', attribute: 'type', attribute_dict: { 1: '金库门禁', 2: '普通门禁', 3: '互锁门门禁' } },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属平台', attribute: 'platformName' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '左线' }
        }
      ]
    }, // 'access', // 门禁主机
    82: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '门禁通道名称', attribute: 'name' },
        { name_cn: '门禁通道号', attribute: 'serise' },
        { name_cn: '门禁通道类型', attribute: 'type', attribute_dict: { 1: '门禁通道', 2: '读头通道', 3: '报警输入' } },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属平台', attribute: 'platformName' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 门禁通道
    83: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 互锁门通道
    84: {
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        {
          name_cn: '状态',
          attribute: 'status',
          attribute_dict: { 1: '离线', 2: '在线' }
        }
      ]
    }, // 'access', // 互锁门主机
    91: {
      // 防护舱主机
      attributeName: 'device', // 点位数据
      attributeArr: [
        { name_cn: '主机名称', attribute: 'name' },
        { name_cn: 'IP地址', attribute: 'ip' },
        { name_cn: '品牌', attribute: 'brand' },
        { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '所属平台', attribute: 'platformName' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    },
    // 'intercom',防护舱通道
    92: {
      attributeName: 'resource', // 点位数据
      attributeArr: [
        { name_cn: '通道名称', attribute: 'name' },
        { name_cn: '通道号', attribute: 'serise' },
        { name_cn: '通道ID', attribute: 'uniqueId' },
        { name_cn: '所属主机', attribute: 'deviceName' },
        {
          name_cn: '所属子系统',
          attribute: 'subSystem',
          attribute_dict: {
            1: '视频子系统',
            2: '报警子系统',
            3: '门禁子系统',
            4: '音频子系统',
            5: '防护舱子系统',
            6: '停车场子系统',
            7: '电视墙子系统'
          }
        },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属重点部位', attribute: 'keyPartName' },
        { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }
  }

  let selectObj = setObj[type] || setObj[getSelectSpecialObj(type, subType)]
  return getShowEndResult(selectObj.attributeArr, obj[selectObj.attributeName], subType)
}
// telephoneHost: 1, // 电话报警主机
// networkHost: 2, // 网络报警主机
// eleFenceBusHost: 3, // 电子围栏总线报警主机
// vibrationFiberHost: 4, // 震动光纤报警主机
// wallMountedDualDetector: 5, // 壁挂双鉴探测器
// ceilingDoubleDetector: 6, // 吸顶双鉴探测器
// atmShockDetector: 7, // atm震动探测器
// treasuryVibrationDetector: 8, // 金库震动探测器
// doorMagneticDetector: 9, // 门磁探测器
// glassBreakDetector: 10, // 玻璃破碎探测器
// photoelectricSmokeDetector: 11, // 光电感烟探测器
// infraredCurtainDetectorIntrusion: 12, // 红外幕帘探测器(入侵)
// temperatureDetector: 13, // 温度探测器
// waterLeakDetector: 14, // 漏水探测器
// emergencyButtonWithSound: 15, // 紧急按钮(有声)
// emergencyButtonSilent: 16, // 紧急按钮(无声)
// infraredDetector: 17, // 红外对射探测器
// displacementDetector: 18, // 位移探测器
// vibratingFiber: 19, // 振动光纤
// electricFence: 20 // 电子围栏
function getSelectSpecialObj(type, subType) {
  //
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
  // 0 不显示
  // 1 显示点面
  // 2 显示点线面
  const DEVICETYPETRANSATE = {
    1: 1, // 'importPart', // 现在的机构 org
    2: 1, // 'keyParts', // 新重点部位 营业网点等
    3: 0, // 'camera', // 摄像机
    4: 0, // 'recorder', // 视频主机
    5: 0, // 'alarm', // 报警设备
    6: 0, // 'fireFighting', // 消防设备
    7: 0, // 'intercom', // 对讲设备f
    8: 0, // 'access', // 门禁设备
    9: 0 // 'protectedCabin' // 防护舱设备
  }
  let result = DEVICETYPETRANSATE[type]
  if (type === DEVICETYPE.alarmDevice) {
    // 报警
    if (
      subType !== ALARMDEVICETYPE.telephoneHost &&
      subType !== ALARMDEVICETYPE.networkHost &&
      subType !== ALARMDEVICETYPE.eleFenceBusHost &&
      subType !== ALARMDEVICETYPE.vibrationFiberHost
    ) {
      // 探测器
      result = 2
    }
  }
  if (type === DEVICETYPE.fireDevice) {
    // 消防
    if (subType === FIREFIGHTINGDEVICETYPE.hydraulicSensor || subType === FIREFIGHTINGDEVICETYPE.liquidLevelSensor) {
      // 部件
      result = 2
    }
  }
  return result
}
// 微缩图形态
function getSmallImageName(shapeType) {
  let result
  if (shapeType === 1) {
    result = '点位'
  } else if (shapeType === 2) {
    result = '自定义区域'
  } else if (shapeType === 3) {
    result = '自定义线'
  } else {
    result = '点位'
  }

  return result
}
// 返回绘制的类型
function polylineOrPolygon(shapeType) {
  return shapeType
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
  const boolValue = DEVICETYPETRANSATE[type]
  return boolValue
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
    1: '机构', // 'importPart', // 现在的机构 org
    2: '重点部位', // 'keyParts', // 新重点部位 营业网点等
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

// 可视域
function getSectorInfo(type, subType) {
  const DEVICETYPETRANSATE = {
    1: false, // 'importPart', // 现在的机构 org
    2: false, // 'keyParts', // 新重点部位 营业网点等
    3: true, // 'camera', // 摄像机
    4: false, // 'recorder', // 视频主机
    5: false, // 'alarm', // 报警设备
    6: false, // 'fireFighting', // 消防设备
    7: false, // 'intercom', // 对讲设备f
    8: false, // 'access', // 门禁设备
    9: false // 'protectedCabin' // 防护舱设备
  }
  return DEVICETYPETRANSATE[type]
}

export function getSetInfo(point_obj) {
  let { type, subType, shapeType } = point_obj
  subType = Number(subType)
  return {
    topImage: getTopImageIsShow(type, subType), // 顶部图片
    showInfo: getShowInfo(type, subType, point_obj), // 信息列表
    smallImage: getSmallImageIsShow(type, subType), // 微缩图形态
    outFloor: getOutFloorAddIsShow(type, subType), // 环境平面图
    floorAdd: getFloorAddIsShow(type, subType), // 楼层列表
    canLevel: getCanLevelIsShow(type, subType), // 显示层级
    typeName: getTypeName(type, subType), // 顶部名称
    sectorInfo: getSectorInfo(type, subType), // 可视域
    polylineOrPolygon: polylineOrPolygon(shapeType)
  }
}
