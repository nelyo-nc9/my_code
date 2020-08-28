/*
 * @Author: fengbeibei
 * @Date: 2020-05-21 14:13:23
 * @LastEditTime: 2020-06-04 21:08:47
 * @LastEditors: fengbeibei
 * @Description: 工具集
 */
import { map, each, filter, find } from 'lodash'
import symbolConfig from '../../../assets/2DMap/meta/SymbolConfig'

/**
 * @description: 列表数据转树数据
 * @param list {Array<any>} 原始列表数据
 * @param id {String} 节点标识符
 * @param pid {String} 关联父节点ID
 * @param children {String} 子节点列表
 * @param rootid {String} 根节点标识符
 * @return: Array<any>
 */
const toTree = (list = [], id = 'id', pid = 'pid', children = 'children', rootid = '') => {
  each(list, v => {
    const subFilterOption = {}
    subFilterOption[pid] = v[id]
    const sub = filter(list, subFilterOption)
    if (sub.length) {
      v[children] = sub
    }
  })
  return filter(list, { pid: rootid })
}

/**
 * 获取视频覆盖区域扇形的几何点
 * @param {*} options 资源信息
 */
const getSectorGeometryPoints = options => {
  let points = [] // 返回点集
  let { lonlat, sides = 360, startAngle = 0, endAngle = 0, radius } = options
  let angle = endAngle - startAngle // 扇形角度
  let [lon, lat] = lonlat // 根据要素的投影坐标系进行转换
  let anglePer = angle / sides // 每个分割扇形角度
  points.push(lonlat) // 放入起始点，组成封闭的图形
  for (let i = 0; i < sides; ++i) { // 遍历分割数量，将旋转后的点放入点集中
    let rotatedAngle = (i * anglePer + startAngle) * Math.PI / 180 // 计算当前旋转度
    let cur = [lon + radius * Math.cos(rotatedAngle), lat + radius * Math.sin(rotatedAngle)] // 计算旋转点
    points.push(cur)
  }
  points.push(lonlat) // 放入终点形成封闭图形
  return points
}

/**
 * @description: 生成矩形选区
 * @param {Object} options 配置参数
 * @return {Array<*>}
 */
const generateRectGeometryPoints = options => {
  let extent = [] // 返回点集
  const { lonlat: [lon, lat], width = 160, height = 90 } = options || {}
  const offsetX = width / 2
  const offsetY = height / 2
  extent.push([lon - offsetX, lat - offsetY])
  extent.push([lon + offsetX, lat - offsetY])
  extent.push([lon + offsetX, lat + offsetY])
  extent.push([lon - offsetX, lat + offsetY])
  extent.push([lon - offsetX, lat - offsetY])
  return extent
}

// TODO 生成摄像机可视域数据
const generateCameraSectorFeatures = (features, attr) => {
  return map(features, ({ geom, attributes, symbol }) => {
    const lonlat = geom.points.split(',').map(v => Number(v))
    let {radiation, viewshedAngle, viewshed} = attributes
    radiation = radiation || 50 // 照射半径
    viewshed = viewshed || 90 // 照射角度
    viewshedAngle = viewshedAngle === undefined ? 0 : viewshedAngle // 旋转角度
    // const  viewshedAngle=
    // 经纬度、开始角度、结束角度、半径、精度
    const options = { lonlat, startAngle: viewshedAngle - viewshed / 2, endAngle: viewshed / 2 + viewshedAngle, radius: radiation, sides: 60 }
    // console.log('可视域参数查看', options)
    const feature = {
      geom: { type: 'Polygon', points: getSectorGeometryPoints(options) },
      attributes: Object.assign({}, { ...attributes }, { id: `${attr.subType}_${attributes.id}` }, attr),
      symbol: symbolConfig.sectorLayerSymbol
    }
    return feature
  })
}

// TODO 生成报警设备探测范围
const generateAlarmRangeFeatures = (features, attr) => {
  const generateMap = { line: generateRectGeometryPoints, rect: generateRectGeometryPoints }
  return map(features, ({ geom, attributes, symbol }) => {
    const { rangeType = 'rect' } = attributes || {} // 获取范围类型
    const lonlat = geom.points.split(',').map(v => Number(v))
    // 经纬度、宽、高、旋转角度
    const options = { lonlat, width: 160 * Math.random() * 100, height: 90 * Math.random() * 100, angle: 0 }
    const feature = {
      geom: { type: 'Polygon', points: generateMap[rangeType](options) },
      attributes: Object.assign({}, { ...attributes }, { id: `${attr.subType}_${attributes.id}` }, attr),
      symbol: symbolConfig.sectorLayerSymbol
    }
    return feature
  })
}

// 获取地图图层
const getMapLayerById = layerId => {
  const { map } = window.$context2D
  const layers = map.getLayers().getArray()
  return find(layers, v => v.get('id') === layerId)
}

/**
 * 判断一个点是否在多边形内部
 * @param {Array<Number>} points 多边形坐标集合
 * @param {Array<Number>} testPoint 测试点坐标
 * @return {Boolean} 返回true为真，false为假
 *  */
const insidePolygon = (points, testPoint) => {
  const x = testPoint[0]
  const y = testPoint[1]
  var inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0]
    const yi = points[i][1]
    const xj = points[j][0]
    const yj = points[j][1]
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) { inside = !inside }
  }
  return inside
}

/**
 * 判断一个点是否在圆的内部
 * @param {Array<Number>} point 测试点坐标
 * @param {Array<Number>} circle 圆心坐标
 * @param {Number} r 圆半径
 * 返回true为真，false为假
 * */
function pointInsideCircle(point, circle, r) {
  if (r === 0) { return false }
  const dx = circle[0] - point[0]
  const dy = circle[1] - point[1]
  return dx * dx + dy * dy <= r * r
}

export {
  toTree,
  insidePolygon,
  getMapLayerById,
  pointInsideCircle,
  getSectorGeometryPoints,
  generateCameraSectorFeatures,
  generateAlarmRangeFeatures
}
