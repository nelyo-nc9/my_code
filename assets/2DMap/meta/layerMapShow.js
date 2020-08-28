/*
 * @Author: fengbeibei
 * @Date: 2020-05-28 14:27:19
 * @LastEditTime: 2020-06-04 17:39:00
 * @LastEditors: fengbeibei
 * @Description: 地图应用-图层基本配置
 */
import _ from 'lodash';
import { GEOMETRYTYPE } from './common';
// 设备主分类: 重点部位、摄像机、录像机、报警设备、消防设备、对讲设备、门禁设备、互锁门、防护舱
const typeList = ['administrativeArea', 'weatherArea', 'importPart', 'camera', 'recorder', 'alarm', 'fireFighting', 'intercom', 'access', 'mutualLockDoor', 'protectedCabin'];
const subTypeMap = {
  administrativeArea: [],//行政区划
  weatherArea: [],
  importPart: [], // 重点部位: 总行、一级分行、二级分行、县级行、直属支行
  camera: ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'], // 摄像机
  recorder: [], // 录像机
  alarm: [], // 报警设备
  fireFighting: [], // 消防设备
  intercom: [], // 对讲设备
  access: [], // 门禁设备
  mutualLockDoor: [], // 互锁门
  protectedCabin: [] // 防护舱
};

const layers = _.map(typeList, v => {
  return _.map(subTypeMap[v] || [], sv => Object.assign({ type: GEOMETRYTYPE.POINT, zIndex: 0 }, { id: `${sv}Layer`, name: sv }));
});

const layerList = _.concat([], ...layers); // 图层数组
const administrativeArea = { id: 'administrativeAreaLayer', name: 'administrateArea', type: GEOMETRYTYPE.MULTIPOLYGON, zIndex: 0 };//行政区划
const weatherArea = { id: 'weatherAreaLayer', name: 'weatherArea', type: GEOMETRYTYPE.MULTIPOLYGON, zIndex: 0 };//天气
const routePlan = { id: 'routePlanLayer', name: 'routePlan', type: GEOMETRYTYPE.POLYLINE, zIndex: 0 };//线路规划
const ambientImportPart = { id: 'ambientImportPartLayer', name: 'ambientImportPart', type: GEOMETRYTYPE.POINT, zIndex: 0 };//环境平面图中的重点部位
const association = { id: 'associationLayer', name: 'association', type: GEOMETRYTYPE.POLYLINE, zIndex: 0 };//关联关系
const insideBuild = { id: 'insideBuildLayer', name: 'insideBuild', type: GEOMETRYTYPE.POINT, zIndex: 0 };//楼内地图元素
const importPart = { id: 'importPartLayer', name: 'importPart', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 机构
const keyParts = { id: 'keyPartsLayer', name: 'keyParts', type: GEOMETRYTYPE.POINT, zIndex: 0 };//重点部位

const camera = { id: 'cameraLayer', name: 'camera', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 摄像机
const cameraSector = { id: 'cameraSectorLayer', name: 'cameraSector', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 摄像机扇形可视域图层
const recorder = { id: 'recorderLayer', name: 'recorder', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 录像机
const alarm = { id: 'alarmLayer', name: 'alarm', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 报警设备
const alarmRange = { id: 'alarmRangeLayer', name: 'alarmRange', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 报警设备探测范围
const fireFighting = { id: 'fireFightingLayer', name: 'fireFighting', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 消防设备
const intercom = { id: 'intercomLayer', name: 'intercom', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 对讲设备
const access = { id: 'accessLayer', name: 'access', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 门禁设备
const mutualLockDoor = { id: 'mutualLockDoorLayer', name: 'mutualLockDoor', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 互锁门
const protectedCabin = { id: 'protectedCabinLayer', name: 'protectedCabin', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 防护舱

const poi_cy_11 = { id: 'poi_cy_11_layer', name: 'poi_cy_11', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 餐饮
const poi_cy_12 = { id: 'poi_cy_12_layer', name: 'poi_cy_12', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 住、宿
const poi_cy_13 = { id: 'poi_cy_13_layer', name: 'poi_cy_13', type: GEOMETRYTYPE.POINT, zIndex: 0 }; //批发、零售
const poi_cy_14 = { id: 'poi_cy_14_layer', name: 'poi_cy_14', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 汽车销售及服务
const poi_cy_15 = { id: 'poi_cy_15_layer', name: 'poi_cy_15', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 金融、保险
const poi_cy_16 = { id: 'poi_cy_16_layer', name: 'poi_cy_16', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 教育、文化
const poi_cy_17 = { id: 'poi_cy_17_layer', name: 'poi_cy_17', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 卫生、社保
const poi_cy_18 = { id: 'poi_cy_18_layer', name: 'poi_cy_18', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 运动、休闲
const poi_cy_19 = { id: 'poi_cy_19_layer', name: 'poi_cy_19', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 公共设施
const poi_cy_20 = { id: 'poi_cy_20_layer', name: 'poi_cy_20', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 商业设施、商务服务
const poi_cy_21 = { id: 'poi_cy_21_layer', name: 'poi_cy_21', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 居民服务
const poi_cy_22 = { id: 'poi_cy_22_layer', name: 'poi_cy_22', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 公司企业
const poi_cy_23 = { id: 'poi_cy_23_layer', name: 'poi_cy_23', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 交通运输、仓储
const poi_cy_24 = { id: 'poi_cy_24_layer', name: 'poi_cy_24', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 科研及技术服务
const poi_cy_25 = { id: 'poi_cy_25_layer', name: 'poi_cy_25', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 农林牧渔业
const poi_cy_26 = { id: 'poi_cy_26_layer', name: 'poi_cy_26', type: GEOMETRYTYPE.POINT, zIndex: 0 }; // 自然地物\地名


export default {
  administrativeArea,
  weatherArea,
  routePlan,
  ambientImportPart,
  association,
  insideBuild,
  importPart,
  keyParts,
  camera,
  cameraSector,
  recorder,
  alarm,
  alarmRange,
  fireFighting,
  intercom,
  access,
  mutualLockDoor,
  protectedCabin,
  poi_cy_11,// 餐饮
  poi_cy_12,// 住、宿
  poi_cy_13,//批发、零售
  poi_cy_14,// 汽车销售及服务
  poi_cy_15,// 金融、保险
  poi_cy_16,// 教育、文化
  poi_cy_17,// 卫生、社保
  poi_cy_18,// 运动、休闲
  poi_cy_19,// 公共设施
  poi_cy_20,// 商业设施、商务服务
  poi_cy_21,// 居民服务
  poi_cy_22,// 公司企业
  poi_cy_23,// 交通运输、仓储
  poi_cy_24,// 科研及技术服务
  poi_cy_25,// 农林牧渔业
  poi_cy_26// 自然地物\地名
};
