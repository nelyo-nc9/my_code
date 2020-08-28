// 2D配置模块 要素构造

import { KEYPARTTYPE, GEOMETRYTYPE, DEVICETYPE, KEYPARTTYPEORG, ACCESSDEVICETYPE } from '../../meta/common'
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
  let { id, name, type } = item
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))
  let symbol
  if (coods.length === 2) {
    symbol = getSymbolByMonitortype(Number(item.type), Number(item.subType)) // 获取默认机构重点部位图标样式
  } else {
    symbol = convertStyleToSymbol(getDefaultStyle(), item)
  }
  if (item.oneStyle) { symbol = item.oneStyle }
  let feature = {
    geom: {
      type: coods.length > 2 ? GEOMETRYTYPE.POLYGON : GEOMETRYTYPE.POINT,
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
    level: point.level
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
  if (type === DEVICETYPE.accessControlDevice) {
    switch (subType) {
      case ACCESSDEVICETYPE.doorControlHost: // 门禁主机
        symbol = SymbolConfig.accessHostSymbol
        break
      case ACCESSDEVICETYPE.doorControlChannel: // 门禁通道
        symbol = SymbolConfig.accessChannelSymbol
        break
      case ACCESSDEVICETYPE.doubleDoor: // 互锁门通道
        symbol = SymbolConfig.LockDoorSymbol
        break
      case ACCESSDEVICETYPE.doubleDoorChannel: // 产品需求 互锁门主机图标与门禁图标一样
        symbol = SymbolConfig.accessHostSymbol
        break
    }
  }
  return JSON.parse(JSON.stringify(symbol))
}
export default {
  transIconFeatures,
  transOneIconFeature
}
