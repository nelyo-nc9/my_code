// 2D配置模块 要素构造

import { INTERCOMTYPE, GEOMETRYTYPE, DEVICETYPE, CABINTYPE } from '../../meta/common'
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
  let { id, name, type, subType } = item
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))
  let symbol = getSymbolByMonitortype(type, subType)
  if (item.oneStyle) { symbol = item.oneStyle }
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: name, // 类型
      rType: type, // 资源类型
      sRType: item.subType, //
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
  subType = Number(subType)
  if (type === DEVICETYPE.intercomDevice) {
    switch (subType) {
      case INTERCOMTYPE.speechHost: // 对讲主机
        symbol = SymbolConfig.intercomHostSymbol
        break
      case INTERCOMTYPE.speechChannel: // 对讲通道
        symbol = SymbolConfig.intercomChannelSymbol
        break
    }
  } else if (type === DEVICETYPE.cabin) {
    switch (subType) {
      case CABINTYPE.cabinHost: // 防护舱主机
        symbol = SymbolConfig.protectedCabinHostSymbol
        break
      case CABINTYPE.cabinChannel: // 防护舱通道
        symbol = SymbolConfig.protectedCabinChannelSymbol
        break
    }
  }
  return JSON.parse(JSON.stringify(symbol))
}
export default {
  transIconFeatures,
  transOneIconFeature
}
