<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 18:47:13
 * @LastEditTime: 2020-06-06 15:33:58
 * @LastEditors: fengbeibei
 * @Description: 地图应用组件
-->
<template>
  <div>
    <!-- <keep-alive></keep-alive> -->
    <outer-map-edit
      v-if="this.$store.state.map2d.mapIndex.isMapOuter === 1 && isMount"
      class="map-container"
      :key="outMapNum"
    ></outer-map-edit>
    <building-map-edit
      v-if="this.$store.state.map2d.mapIndex.isMapOuter === 2"
      class="map-container"
      :key="inMapNum"
    ></building-map-edit>
    <video-map></video-map>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import OuterMapEdit from './OuterMapEdit'
import BuildingMapEdit from './BuildingMapEdit'
import { getPorvinceInfoByAdcode } from './../../../assets/2DMap/utils/porvinceInfo'
import videoMap from 'view/map2D/components/video'
export default {
  name: 'mapedit-app',
  data() {
    return { outMapNum: 1, isMount: false, inMapNum: 1 }
  },
  components: { OuterMapEdit, BuildingMapEdit, videoMap },
  computed: {
    ...mapGetters('map2d/mapIndex', ['mapConfigArr', 'mapConfig', 'administrativeAreaInfo']),
    ...mapGetters({
      isMapOuter: 'isMapOuter' // 楼内外地图标志
    }),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack'])
  },
  beforeMount() {
    this.updateMapUrl('https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer')
    this.setIsMapOuter(1)
    this.setShowFloorInfo(false)
    this.setIsFloorMap(false)
    this.setCurrentSelectResource(null) // 清空当前选择点位
  },
  mounted() {
    this.SET_MAP_TOOLBAR_STATUS_FALSE() // 清空所有右上角工具条点击状态
    this.setDrawActive({ active: false })
    let nowThis = this
    this.getMapSetInfo(function() {
      let userInfo = JSON.parse(sessionStorage.getItem('user'))
      let adcode = userInfo.adcode && userInfo.adcode ? userInfo.adcode : '110000'
      nowThis.getNowSelectAreaDetailInfo(adcode)
    })

    if (!this.administrativeAreaInfo || this.administrativeAreaInfo.length === 0) {
      // 获取所有省份信息
      this.getAllTreeApiData({})
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: 'error',
              message: res.message
            })
          } else if (res.data && res.data.areas) {
            let nowArr = res.data.areas.filter(item => {
              return item.code !== '100000'
            })
            this.setAdministrativeAreaInfo(JSON.parse(JSON.stringify(nowArr)))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    '$store.state.map2d.mapIndex.indoorLayerConfig.url'(newObj, oldObj) {
      this.inMapNum++
    },
    '$store.state.map2d.mapIndex.outdoorLayerConfig.url'(newObj, oldObj) {
      this.inMapNum++
    },
    '$store.state.map2d.mapIndex.nowSelectAreaInfo'(newObj, oldObj) {
      if (!oldObj || (newObj && Number(newObj.adcode))) {
        // console.log('监听到地图编码修改')
        this.setIsMapOuter(1)
        this.setShowFloorInfo(false)
        this.setIsFloorMap(false)
        this.outMapNum++
        // console.log(this.outMapNum)
        let nowPorvinceInfo = getPorvinceInfoByAdcode(newObj.adcode.toString().substr(0, 2))
        if (nowPorvinceInfo) {
          this.updateMapChildAreaUrl(
            `http://128.192.155.0:6080/arcgis/rest/services/map/${nowPorvinceInfo.name}_basemap/MapServer/`
          )
        }
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setIsMapOuter',
      'setIsFloorMap',
      'setShowFloorInfo',
      'setDrawActive',
      'updateMapUrl',
      'getMapConfigDlgFormData',
      'setMapConfigDlgFormData',
      'setNowSelectAreaInfo',
      'getAllTreeApiData',
      'setAdministrativeAreaInfo',
      'updateMapChildAreaUrl',
      'getDistrictSetting'
    ]),
    ...mapActions('map2d/mapPoint', ['setCurrentSelectResource']),
    ...mapMutations('map2d/mapIndex', ['SET_MAP_TOOLBAR_STATUS_FALSE', 'SET_VIDEO_PLAY_INFO']),
    getMapSetInfo(callback) {
      this.getMapConfigDlgFormData()
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: 'error',
              message: res.message
            })
          } else if (res.data && res.data.mapSource && res.data.tileType && res.data.serverUrl) {
            this.updateMapUrl(res.data.serverUrl)
            this.setMapConfigDlgFormData(res.data)
          }
          callback()
        })
        .catch(err => {
          console.log(err)
          callback()
        })
    },
    getNowSelectAreaDetailInfo(adcode) {
      let nowThis = this
      this.getDistrictSetting({ adcode })
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: 'error',
              message: res.message
            })
          } else if (res.data) {
            console.log('获取区域详情信息', res)
            nowThis.setNowSelectAreaInfo(res.data)
            nowThis.isMount = true
          }
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            type: 'error',
            message: '获取行政区划详细信息错误'
          })
        })
    },
    clearAllVideoPlaying() {
      this.SET_VIDEO_PLAY_INFO({
        video1: {
          isShowPlayBack: false,
          isShowPreview: false,
          playInfo: null
        },
        video2: {
          isShowPlayBack: false,
          isShowPreview: false,
          playInfo: null
        },
        video3: {
          isShowPlayBack: false,
          isShowPreview: false,
          playInfo: null
        },
        video4: {
          isShowPlayBack: false,
          isShowPreview: false,
          playInfo: null
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
