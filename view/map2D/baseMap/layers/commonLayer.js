/*
 * @Author: fengbeibei
 * @Date: 2020-05-27 13:47:45
 * @LastEditTime: 2020-06-04 20:30:23
 * @LastEditors: fengbeibei
 * @Description: 地图图层配置及要素
 */
import { map, filter, cloneDeep } from 'lodash'
import { mapState, mapGetters } from 'vuex'
import layerMap from 'assets/2DMap/meta/layerMapShow'
export default {
  data() {
    return {
      administrativeAreaLayer: layerMap['administrativeArea'], //行政区划
      weatherAreaLayer: layerMap['weatherArea'], //天气
      routePlanLayer: layerMap['routePlan'] //线路规划
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['administrativeArea']),
    ...mapState('map2d/pointMapShow', {
      administrativeAreaFeatures(state) {
        return state.administrativeAreaFeatures
      }, //行政区划
      weatherAreaEndFeatures(state) {
        return this.filterWeatherFeatures(state.weatherAreaFeatures)
      }, //天气
      routePlanFeatures(state) {
        return state.routePlanFeatures
      } //线路规划
    })
  },
  methods: {
    filterWeatherFeatures(features = []) {
      let endFeatures = []
      for (let i = 0; i < features.length; i++) {
        if (features[i].attributes.type !== 'weatherArea') {
          continue
        } else if (features[i].attributes.subType !== 'weatherAreaText') {
          endFeatures.push(features[i])
          continue
        }
        let isPush = true
        for (let k = i + 1; k < features.length; k++) {
          let point1 = features[i].geom.points[0][0][0]
          let point2 = features[k].geom.points[0][0][0]
          let wgs84Sphere = new window.$context2D.ol.Sphere(6378137)
          let distance = wgs84Sphere.haversineDistance(
            window.$context2D.ol.proj.toLonLat(point1),
            window.$context2D.ol.proj.toLonLat(point2)
          )
          if (distance < 80000 * Math.pow(2, -(window.$context2D.map.getView().getZoom() - 5))) {
            isPush = false
            break
          }
        }
        if (isPush) {
          endFeatures.push(features[i])
        }
      }
      return endFeatures
    }
  }
}
