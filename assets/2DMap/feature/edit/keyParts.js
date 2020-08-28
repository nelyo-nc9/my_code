// 2D配置模块 要素构造

import { KEYPARTTYPE, GEOMETRYTYPE, DEVICETYPE, KEYPARTTYPEORG, getUniteDictData, SHAPETYPE, FIREFIGHTINGDEVICETYPE } from '../../meta/common'
import SymbolConfig from '../../meta/SymbolConfig'
import { convertStyleToSymbol, getDefaultStyle } from './area'
/**
 * 构造图标要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层配置信息
 * @returns
 */
function transIconFeatures(arr, layerConfig) {
  let features = []
  for (const item of arr) {
    if (item) {
      const feature = transOneIconFeature(item, layerConfig)
      features.push(feature)
    }
  }
  return features
}

/**
 * 构造单个图标要素
 * @param {*} item 重点部位类型
 * @param {*} item.id 点位唯一标识
 * @param {*} item.name 重点部位名称
 * @param {*} item.type 重点部位类型
 * @param {*} item.monitype 重点部位子类型
 * @param {*} item.coordinate 点位坐标
 * @param {*} item.isouter 是否在楼外
 * @param {*} item.class 可见层级
 * @param {*} layerConfig 图层配置信息
 */
function transOneIconFeature(item, layerConfig) {
  let { id, name, type, subType, shapeType } = item
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))
  let geometryType = GEOMETRYTYPE.POINT // 点位几何类型
  let symbol // 要素样式
  if (shapeType === SHAPETYPE.POINT) { // 点
    symbol = getSymbolByMonitortype(Number(type), Number(subType)) // 获取默认机构重点部位图标样式
    geometryType = GEOMETRYTYPE.POINT
  } else if (shapeType === SHAPETYPE.LINESTRING) { // 线
    symbol = convertStyleToSymbol(getDefaultStyle(), item)
    geometryType = GEOMETRYTYPE.POLYLINE
    delete symbol.fillColor
  } else if (shapeType === SHAPETYPE.POLYGON) { // 面
    symbol = convertStyleToSymbol(getDefaultStyle(), item)
    geometryType = GEOMETRYTYPE.POLYGON
  }
  const radius = point.radiation || 50
  const viewshed = point.viewshed || 90
  const angle = point.viewshedAngle || 0
  if (symbol && symbol.iconStyle) {
    symbol.iconStyle.rotation = angle // 设置旋转角度
  }
  let feature = {
    geom: {
      type: geometryType,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: name, // 类型
      rType: type, // 资源类型
      sRType: item.subType, // 视频资源类型
      label: name,
      loc: point.coordinate,
      isOuter: point.isouter
    },
    symbol: symbol
  }
  let sector = {
    lon: coods[0],
    lat: coods[1],
    level: point.level,
    radius: radius,
    endAngle: viewshed / 2 + angle,
    startAngle: angle - viewshed / 2,
    rotation: angle
  }
  feature.attributes = Object.assign(feature.attributes, sector)
  return feature
}
/**
 * 获取机构重点部位图标样式
 * @param {*} type 机构重点部位类型
 * @param {*} monitype 机构重点部位类型
 * 当前默认使用枪机图标，后续需要对应为SymbolConfig中的样式
 */
function getSymbolByMonitortype(type, subType) {
  let symbol = null
  if (type === DEVICETYPE.org) {
    switch (subType) {
      case KEYPARTTYPE.headLevel: // 总行
        symbol = SymbolConfig.headOfficeSymbol
        break
      case KEYPARTTYPE.oneLevel: // 一级分行
        symbol = SymbolConfig.tierOneBranchSymbol
        break
      case KEYPARTTYPE.twoLevel: // 二级分行
        symbol = SymbolConfig.secondLevelBranchSymbol
        break
      case KEYPARTTYPE.countyLevel: // 县级行
        symbol = SymbolConfig.countyLevelSymbol
        break
      case KEYPARTTYPE.directlyLevel: // 直属支行
        symbol = SymbolConfig.directlyBranchSymbol
        break
    }
  } else if (type === DEVICETYPE.keyPart) {
    switch (subType) {
      case KEYPARTTYPEORG.businessOutlets: // 营业网点
        symbol = SymbolConfig.businessOutletsSymbol
        break
      case KEYPARTTYPEORG.vault: // 金库
        symbol = SymbolConfig.vaultSymbol
        break
      case KEYPARTTYPEORG.computerRoom: // 计算机房
        symbol = SymbolConfig.computerRoomSymbol
        break
      case KEYPARTTYPEORG.officeBuilding: // 办公楼
        symbol = SymbolConfig.officeBuildingSymbol
        break
      case KEYPARTTYPEORG.selfServiceBank: // 自助银行
        symbol = SymbolConfig.selfServiceBankSymbol
        break
      case KEYPARTTYPEORG.selfServiceEquipment: // 自助设备
        symbol = SymbolConfig.selfServiceEquipmentSymbol
        break
      case KEYPARTTYPEORG.selfServiceSilver: // 自助银亭
        symbol = SymbolConfig.selfServiceSilverSymbol
        break
      case KEYPARTTYPEORG.privateBank: // 私人银行
        symbol = SymbolConfig.privateBankSymbol
        break
      case KEYPARTTYPEORG.safeDeposit: // 保险箱库
        symbol = SymbolConfig.safeDepositSymbol
        break
      case KEYPARTTYPEORG.archivesCenter: // 档案室
        symbol = SymbolConfig.archivesCenterSymbol
        break
      case KEYPARTTYPEORG.remoteControlCenter: // 远程监控中心
        symbol = SymbolConfig.remoteControlCenterSymbol
        break
      case KEYPARTTYPEORG.fiveGSmartBanking: // 5G + 智能银行
        symbol = SymbolConfig.fiveGSmartBankingSymbol
        break
      case KEYPARTTYPEORG.fortuneCenter: // 财富中心
        symbol = SymbolConfig.fortuneCenterSymbol
        break
      case KEYPARTTYPEORG.otherKeyParts: // 其他重点部位
        symbol = SymbolConfig.otherKeyPartsSymbol
        break
      case KEYPARTTYPEORG.xuni: // 虚拟重点部位
        symbol = SymbolConfig.xuniSymbol
        break
    }
  } else {
    let obj = getUniteDictData(type, subType)
    let onlineStatus = 1
    if (Number(type) === DEVICETYPE.fireDevice && [FIREFIGHTINGDEVICETYPE.hydraulicSensor, FIREFIGHTINGDEVICETYPE.liquidLevelSensor].includes(Number(subType))) { 
      // 消防设备（液压传感器、液位传感器）特殊
      onlineStatus = 2
    }
    // console.log(obj)
    symbol = SymbolConfig.randerFeatureStyle({ type: obj.pathName, subType: obj.imageName, status: onlineStatus })
  }
  return JSON.parse(JSON.stringify(symbol))
}
export default {
  transIconFeatures,
  transOneIconFeature
}
