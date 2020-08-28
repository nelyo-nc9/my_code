/*
 * @Author: lidongyu
 * @Date: 2020-06-27 13:47:45
 * @LastEditTime: 2020-06-04 20:30:23
 * @LastEditors: lidongyu
 * @Description: 地图兴趣点图层配置及要素
 */
import { map, filter } from 'lodash'
import { mapState, mapGetters } from 'vuex'
import layerMap from 'assets/2DMap/meta/layerMapShow'
export default {
  data() {
    return {
      poi_cy_11Layer: layerMap['poi_cy_11'] // 餐饮
      // poi_cy_12Layer: layerMap['poi_cy_12'], // 住、宿
      // poi_cy_13Layer: layerMap['poi_cy_13'], //批发、零售
      // poi_cy_14Layer: layerMap['poi_cy_14'], // 汽车销售及服务
      // poi_cy_15Layer: layerMap['poi_cy_15'], // 金融、保险
      // poi_cy_16Layer: layerMap['poi_cy_16'], // 教育、文化
      // poi_cy_17Layer: layerMap['poi_cy_17'], // 卫生、社保
      // poi_cy_18Layer: layerMap['poi_cy_18'], // 运动、休闲
      // poi_cy_19Layer: layerMap['poi_cy_19'], // 公共设施
      // poi_cy_20Layer: layerMap['poi_cy_20'], // 商业设施、商务服务
      // poi_cy_21Layer: layerMap['poi_cy_21'], // 居民服务
      // poi_cy_22Layer: layerMap['poi_cy_22'], // 公司企业
      // poi_cy_23Layer: layerMap['poi_cy_23'], // 交通运输、仓储
      // poi_cy_24Layer: layerMap['poi_cy_24'], // 科研及技术服务
      // poi_cy_25Layer: layerMap['poi_cy_25'], // 农林牧渔业
      // poi_cy_26Layer: layerMap['poi_cy_26'] // 自然地物\地名
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['nowSelectAreaInfo', 'alarmSetting', 'mapConfig']),
    ...mapState('map2d/pointMapShow', {
      poi_cy_11Features(state) {
        return this.filterAllPoiFeatures(state.poi_cy_11Features)
      }
      // poi_cy_12Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_12Features)
      // }, // 住、宿
      // poi_cy_13Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_13Features)
      // }, //批发、零售
      // poi_cy_14Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_14Features)
      // }, // 汽车销售及服务
      // poi_cy_15Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_15Features)
      // }, // 金融、保险
      // poi_cy_16Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_16Features)
      // }, // 教育、文化
      // poi_cy_17Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_17Features)
      // }, // 卫生、社保
      // poi_cy_18Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_18Features)
      // }, // 运动、休闲
      // poi_cy_19Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_19Features)
      // }, // 公共设施
      // poi_cy_20Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_20Features)
      // }, // 商业设施、商务服务
      // poi_cy_21Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_21Features)
      // }, // 居民服务
      // poi_cy_22Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_22Features)
      // }, // 公司企业
      // poi_cy_23Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_23Features)
      // }, // 交通运输、仓储
      // poi_cy_24Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_24Features)
      // }, // 科研及技术服务
      // poi_cy_25Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_25Features)
      // }, // 农林牧渔业
      // poi_cy_26Features(state) {
      //   return this.filterPoiFeatures(state.poi_cy_26Features)
      // } // 自然地物\地名
    })
  },
  methods: {
    filterAllPoiFeatures(features = []) {
      if (this.mapToolbarStatus.policeControl || this.mapToolbarStatus.weatherControl || this.mapConfig.nowZoom < 15) {
        return [] //报警和天气隐藏兴趣点
      } else {
        return features
      }
    },
    // 过滤兴趣点显隐控制图层数据
    filterPoiFeatures(features = []) {
      if (this.mapToolbarStatus.policeControl || this.mapToolbarStatus.weatherControl || this.mapConfig.nowZoom < 14)
        return [] //报警和天气隐藏兴趣点
      const itemArray = JSON.parse(JSON.stringify(this.$store.state.map2d.mapIndex.selectPoiPoint)) // 转换为数组
      const checkedItem = filter(itemArray, { value: true }) // 提取选中项
      const checkedKeys = map(checkedItem, 'id') // 提取选中key

      let extent = window.$context2D.map.getView().calculateExtent(window.$context2D.map.getSize())
      let extentFeatures = filter(
        features,
        v =>
          Number(v.geom.points.split(',')[0]) > extent[0] &&
          Number(v.geom.points.split(',')[0]) < extent[2] &&
          Number(v.geom.points.split(',')[1]) > extent[1] &&
          Number(v.geom.points.split(',')[1]) < extent[3]
      )
      const endCheckedKeys = checkedKeys.filter(v => {
        return v.length === 6
      })
      return endCheckedKeys.length
        ? filter(extentFeatures, v => endCheckedKeys.includes(v.attributes.subType)).filter(v => {
            return v.attributes.adcode.substr(0, 2) === this.nowSelectAreaInfo.adcode.toString().substr(0, 2)
          })
        : [] // 过滤已选中类型要素
    }
  }
}
