// 2D配置模块 要素构造

import { VIDEOTYPEKEY, GEOMETRYTYPE } from '../../meta/common'
import SymbolConfig from '../../meta/SymbolConfig'

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
 * @param {*} item.id 点位唯一标识
 * @param {*} item.name 设备名称
 * @param {*} item.type 设备类型
 * @param {*} item.monitype 设备子类型
 * @param {*} item.coordinate 点位坐标
 * @param {*} item.projection 投影坐标系
 * @param {*} item.isouter 是否在楼外
 * @param {*} item.class 可见层级
 * @param {*} item.radius  半径
 * @param {*} item.angle 朝向
 * @param {*} item.viewshed 可视区域角度大小
 * @param {*} layerConfig 图层配置信息
 */
function transOneIconFeature(item, layerConfig) {
  let { id, name, type = 1, subType = 1 } = item
  type = Number(type)
  subType = Number(subType)
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))
  let symbol = getSymbolByMonitortype(subType) // 获取默认监控图标样式
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.coordinate
    },
    attributes: {
      id: id,
      type: layerConfig.name, // 类型
      rType: type, // 资源类型
      sRType: subType, // 视频资源类型
      projection: point.projection, // 要素坐标——投影坐标系
      label: name,
      loc: point.coordinate,
      isOuter: point.isouter
    },
    symbol: symbol
  }
  const radius = point.radiation || 50
  const viewshed = point.viewshed || 90
  const angle = point.viewshedAngle || 0
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
 * 获取监控图标样式
 * @param {*} monitype 监控类型
 * 当前默认使用枪机图标，后续需要对应为SymbolConfig中的样式
 */
function getSymbolByMonitortype(monitype) {
  // 图标绘制的渲染-shen
  let symbol = null
  switch (monitype) {
    case VIDEOTYPEKEY.boltipc: // 枪机
      symbol = SymbolConfig.boltipcSymbol
      break
    case VIDEOTYPEKEY.halfBallipc: // 半球
      symbol = SymbolConfig.halfBallipcSymbol
      break
    case VIDEOTYPEKEY.fastBallipc: // 球机
      symbol = SymbolConfig.fastBallipcSymbol
      break
    case VIDEOTYPEKEY.allViewipc: // 全景
      symbol = SymbolConfig.allViewipcSymbol
      break
    case VIDEOTYPEKEY.redBoltipc: // 红外枪机
      symbol = SymbolConfig.redBoltipcSymbol
      break
    case VIDEOTYPEKEY.pinholeipc: // 针孔
      symbol = SymbolConfig.pinholeipcSymbol
      break
    case VIDEOTYPEKEY.smartIPC: // 智能IPC
      symbol = SymbolConfig.smartIPCSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 构造扇形覆盖域要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层信息
 * @returns
 */
function transSectorFeatures(arr, layerConfig) {
  let features = []
  for (const item of arr) {
    if (item) {
      const feature = transOneSectorFeature(item, layerConfig)
      features.push(feature)
    }
  }
  return features
}

/**
 * 获取视频覆盖区域扇形的几何点
 * @param {*} attr 资源信息
 */
function getSectorGeometryPoints(attr) {
  let points = [] // 返回点集
  let { lon, lat, sides = 60, endAngle, startAngle = 0, radius } = attr
  let angle = endAngle - startAngle // 扇形角度
  let origin = [lon, lat] // 根据要素的投影坐标系进行转换
  let anglePer = angle / sides // 每个分割扇形角度
  points.push([lon, lat]) // 存入起始点
  for (let i = 0; i < sides; ++i) {
    // 遍历分割数量，将旋转后的点放入点集中
    let rotatedAngle = ((i * anglePer + startAngle) * Math.PI) / 180
    let cur = [origin[0] + radius * Math.cos(rotatedAngle), origin[1] + radius * Math.sin(rotatedAngle)] // 计算旋转点
    points.push(cur)
  }
  points.push(points[0]) // 再次放入起始点，组成封闭的图形
  return points
}

/**
 * 构造单个扇形覆盖域要素
 * @param {*} item 视频资源
 * @param {*} layerConfig 图层信息
 * @returns
 */
function transOneSectorFeature(item, layerConfig) {
  let { id, type = 1, monitype = 0 } = item
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))

  // const radius = point.point.radiation || 50
  // const viewshed = point.point.viewshed || 90
  // const angle = point.point.viewshedAngle || 0
  const radius = point['point'] == undefined ? point.radiation || 50 : point.point.radiation || 50
  const viewshed = point['point'] == undefined ? point.viewshed || 90 : point.point.viewshed || 90
  const angle = point['point'] == undefined ? point.viewshedAngle || 0 : point.point.viewshedAngle || 0
  let attr = {
    id: id,
    type: layerConfig.name,
    rType: type, // 资源类型
    sRType: monitype, // 视频资源类型
    projection: point.projection,
    isOuter: point.isouter,
    lon: coods[0],
    lat: coods[1],
    level: point.class,
    radius: radius,
    endAngle: viewshed / 2 + angle,
    startAngle: angle - viewshed / 2,
    rotation: angle
  }

  let points = getSectorGeometryPoints(attr)
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POLYGON,
      points: points
    },
    attributes: attr,
    symbol: SymbolConfig.sectorLayerSymbol
  }
  return feature
}

export default {
  transIconFeatures,
  transSectorFeatures,
  transOneSectorFeature,
  transOneIconFeature
}
