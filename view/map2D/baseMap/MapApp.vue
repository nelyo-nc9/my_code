<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 18:47:13
 * @LastEditTime: 2020-06-06 15:33:58
 * @LastEditors: fengbeibei
 * @Description: 地图应用组件
-->
<template>
  <div id="map-div-class">
    <outer-map v-if="isMapOuter !== 2 && isMount" class="map-container" :key="outMapNum"></outer-map>
    <building-map v-if="isMapOuter === 2" class="map-container" :key="inMapNum"></building-map>
    <video-map></video-map>
    <video-alarm v-if="showAlarmVideoInfo.isShowAlarmVideo"></video-alarm>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import OuterMap from './OuterMap'
import BuildingMap from './BuildingMap'
import { getPorvinceInfoByAdcode } from './../../../assets/2DMap/utils/porvinceInfo'
import videoMap from './../components/video'
import videoAlarm from './../components/videoAlarm'
export default {
  name: 'map-app',
  data() {
    return {
      outMapNum: 1,
      inMapNum: 1,
      isMount: false
    }
  },
  components: { OuterMap, BuildingMap, videoMap, videoAlarm },
  computed: {
    ...mapGetters('map2d/mapIndex', [
      'mapConfigArr',
      'mapConfig',
      'administrativeAreaInfo',
      'isMapOuter',
      'videoPlayInfo',
      'mapToolbarStatus',
      'isShowAlarmVideo',
      'showAlarmVideoInfo'
    ]),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack']),

    listenVideoPlayShow() {
      return this.videoPlayInfo.ifShow
    }
  },
  beforeMount() {
    // 初始为楼外图层
    this.setIsMapOuter(1)
    this.setShowFloorInfo(false)
    this.setIsFloorMap(false)
    this.setCurrentSelectResource(null) // 清空当前选择点位
    this.setClickTreeNode() // 清空当前选择树节点信息
    this.SET_MAP_TOOLBAR_STATUS_FALSE() // 清空所有右上角工具条点击状态
    this.clearAllVideoPlaying() // 清空所有视频播放窗口
  },
  mounted() {
    this.getAndStartAreaInfo() // 获取并且开始行政区划
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
        let nowPorvinceInfo = getPorvinceInfoByAdcode(newObj.adcode.toString().substr(0, 2))
        if (nowPorvinceInfo) {
          // 加载省份底图
          this.updateMapChildAreaUrl(
            `http://128.192.155.0:6080/arcgis/rest/services/map/${nowPorvinceInfo.name}_basemap/MapServer/`
          )
        }

        // 取消显示天气
        if (this.mapToolbarStatus.weatherControl) {
          this.setMapToolbarStatus('weatherControl')
        }
      }
    },
    isMapOuter(newValue, oldVlaue) {
      console.log('isMapOuter', newValue, oldVlaue)
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setIsMapOuter',
      'setIsFloorMap',
      'setShowFloorInfo',
      'updateMapUrl',
      'getMapConfigDlgFormData',
      'setMapConfigDlgFormData',
      'setAdministrativeAreaInfo',
      'getAllTreeApiData',
      'setNowSelectAreaInfo',
      'setDrawActive',
      'updateMapChildAreaUrl',
      'setMapToolbarStatus',
      'setFeatures',
      'updateAlarmSetting',
      'setClickTreeNode',
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
              title: '失败',
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
    getAndStartAreaInfo() {
      let nowThis = this
      // 修改地图加载底图
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
                title: '失败',
                message: res.message
              })
            } else if (res.data && res.data.areas) {
              let nowArr = res.data.areas.filter(item => {
                return item.code !== '100000'
              })
              console.log(nowArr)
              this.setAdministrativeAreaInfo(JSON.parse(JSON.stringify(nowArr)))
              console.log(this.administrativeAreaInfo)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getNowSelectAreaDetailInfo(adcode) {
      let nowThis = this
      this.getDistrictSetting({ adcode })
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: 'error',
              title: '失败',
              message: res.message
            })
          } else if (res.data) {
            console.log('获取区域详情信息', res)
            nowThis.setNowSelectAreaInfo(res.data)
            nowThis.isMount = true
          }
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: '失败',
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
