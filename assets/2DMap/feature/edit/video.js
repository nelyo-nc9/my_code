// 2D配置模块 要素构造

import { VIDEOTYPEKEY, GEOMETRYTYPE, DEVICETYPE, ALARMDEVICENameTYPE, EnglishNamePrefix, SHAPETYPE } from '../../meta/common'
import SymbolConfig from '../../meta/SymbolConfig'
import { convertStyleToSymbol, getDefaultStyle } from './area'
import { cloneDeep } from 'lodash'
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
    delete symbol.fillColor // 线的样式删除填充颜色
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
 * 获取监控图标样式
 * @param {*} monitype 监控类型
 * 当前默认使用枪机图标，后续需要对应为SymbolConfig中的样式
 */
function getSymbolByMonitortype(monitype, type) {
  // 设备图标绘制的渲染，必须改 -shen
  const result = EnglishNamePrefix[String(monitype)][String(type)]
  // 设备树点击后，地图图标判断-shen
  let symbol
  const symbolString = result + 'Symbol'
  if (result !== undefined) {
    symbol = cloneDeep(SymbolConfig[symbolString])
  }

  return symbol
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
  let { id, type = 1, monitype = 0, subType = 0 } = item
  let point = JSON.parse(JSON.stringify(item))
  let coods = point.coordinate.split(',').map(cood => Number(cood))

  // const radius = point.point.radiation || 50
  // const viewshed = point.point.viewshed || 90
  // const angle = point.point.viewshedAngle || 0
  const radius = point['point'] === undefined ? point.radiation || 50 : point.point.radiation || 50
  const viewshed = point['point'] === undefined ? point.viewshed || 90 : point.point.viewshed || 90
  const angle = point['point'] === undefined ? point.viewshedAngle || 0 : point.point.viewshedAngle || 0
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
  // console.log(attr)
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
