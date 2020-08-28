// 2D配置模块 要素构造

import { GEOMETRYTYPE, MPSIGNKEY } from '../../meta/common'
import SymbolConfig from '../../meta/SymbolConfig'
import areaStyle from '../../areaStyle'
import styleConfig from 'assets/2DMap/meta/style'
import areaTrans from './area'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'

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
 * @param {*} item 监控类型
 * @param {*} item.id 唯一标识
 * @param {*} item.name 设备名称
 * @param {*} item.type 设备类型
 * @param {*} item.monitype 设备子类型
 * @param {*} item.coordinate 点位坐标
 * @param {*} item.projection 投影坐标系
 * @param {*} item.isouter 是否在楼外
 * @param {*} item.class 可见层级
 * @param {*} layerConfig 图层配置信息
 */
function transOneIconFeature(item, layerConfig) {
  let { id, type, monitype = 0 } = item
  let point = JSON.parse(JSON.stringify(item))

  const name = item.name
  let coods = point.coordinate.split(',').map(cood => Number(cood))
  let symbol = getSymbolByMonitortype(type) // 获取默认监控图标样式
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: layerConfig.name, // 设备类型名称,如枪机、重点部位...
      rType: type, // 设备类型 key值 可选值在 DEVICETYPE 中
      sRType: monitype, // 设备子类型,暂时备用
      label: name, // 设备名称，如摄像机通道1...
      loc: point.coordinate,
      isOuter: point.isouter // 楼内或楼外，暂时用不到
    },
    symbol: symbol // 显示图标及样式信息
  }
  let sector = {
    lon: coods[0],
    lat: coods[1],
    level: point.class
  }
  feature.attributes = Object.assign(feature.attributes, sector)
  return feature
}
/**
 * 获取监控图标样式
 * @param {*} type 设备类型
 */
function getSymbolByMonitortype(type) {
  let symbol = SymbolConfig.renderCommonFeatureStyle(type)
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 构造线要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getLineStringFeature(alarm, layerConfig) {
  let { id, name, type } = alarm
  let point = JSON.parse(JSON.stringify(alarm))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultLine
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
  let center = spaceUtil.getMultiLineStringCenter(point.coordinate).toString()
  let feature = {
    geom: {
      type: GEOMETRYTYPE.MULTIPOLYLINE,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: layerConfig.name,
      rType: type, // 资源类型
      label: name,
      loc: center || point.coordinate,
      isOuter: point.isouter
    },
    symbol: styleC
  }
  return feature
}
/**
 * 构造面要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getPolygonFeature(alarm, layerConfig) {
  let { id, name, type } = alarm
  let point = JSON.parse(JSON.stringify(alarm))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultArea
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
  let center = spaceUtil.getMultiPolygonCenter(point.coordinate).toString()
  let feature = {
    geom: {
      type: GEOMETRYTYPE.MULTIPOLYGON,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: layerConfig.name,
      rType: type, // 资源类型
      label: name,
      loc: center || point.coordinate,
      isOuter: point.isouter
    },
    symbol: styleC
  }
  return feature
}

/**
 * 构造单个要素
 * @param {*} resource 单个资源信息
 * @param {*} layerConfig 图层配置参数
 */
function transOneFeature(resource, layerConfig) {
  let feature = null
  let point = JSON.parse(JSON.stringify(resource))
  if (point && point.coordinate) {
    if (point.shapeType === MPSIGNKEY.point) {
      // 点
      feature = transOneIconFeature(resource, layerConfig)
    } else if (point.shapeType === MPSIGNKEY.lineString) {
      // 线
      feature = getLineStringFeature(resource, layerConfig)
    } else if (point.shapeType === MPSIGNKEY.polygon) {
      // 面
      feature = getPolygonFeature(resource, layerConfig)
    } else {
      feature = transOneIconFeature(resource, layerConfig)
    }
  }
  return feature
}

/**
 * 构造多个资源要素
 * @param {*} arr 资源数组
 * @param {*} layerConfig 图层配置参数
 */
function transFeatures(arr, layerConfig) {
  let features = []
  for (let item of arr) {
    let feature = null
    if (item.point) {
      let point = JSON.parse(JSON.stringify(item))
      if (point && point.coordinate) {
        if (point.shapeType === 'point') {
          // 点
          feature = transOneIconFeature(item, layerConfig)
        } else if (point.shapeType === MPSIGNKEY.lineString) {
          // 线
          feature = getLineStringFeature(item, layerConfig)
        } else if (point.shapeType === 'area') {
          // 面
          feature = getPolygonFeature(item, layerConfig)
        } else {
          feature = transOneIconFeature(item, layerConfig)
        }
      }
      feature && features.push(feature)
    }
  }
  return features
}

export default {
  transIconFeatures,
  transOneIconFeature,
  getLineStringFeature,
  getPolygonFeature,
  transOneFeature,
  transFeatures
}
