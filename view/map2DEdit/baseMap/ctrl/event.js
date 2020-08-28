// 地图事件处理逻辑
import { mapState, mapActions, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'
import { DEVICETYPE, SUBTYPEOBJ } from 'assets/2DMap/meta/common'
import layerConfig from 'assets/2DMap/meta/layer'
import layer from '../../../../assets/2DMap/meta/layer'
import { getCenterByPolygonFeature } from 'assets/2DMap/spaceAnalysisUtil'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      drawActive: ({ map2d }) => map2d.mapIndex.drawActive,
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      selectedTreeCode: ({ map2d }) => map2d.panelSearch.selectedTreeCode,
      videoPlayInfo: ({ map2d }) => map2d.mapIndex.videoPlayInfo
    })
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setCurrPanelToolComponent',
      'setPanelInfoEditStatus',
      'setOverFlowFeature',
      'setDrawActive'
    ]),
    ...mapMutations('map2d/mapIndex', ['SET_VIDEO_PLAY_INFO']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode', 'setSelectedTreeCode']),
    ...mapActions('map2d/mapPoint', ['setCurrentSelectResource', 'setEditActive', 'getCommonResourceById']),
    // 地图单击事件
    handleMapClick(event) {
      // 添加点位时
      if (this.drawActive) {
        return
      }

      let { feature, attributes } = event
      if (attributes) {
        // 点击点位要素开启编辑面板
        let attr = JSON.parse(JSON.stringify(attributes))
        // console.log(attr)
        if (!this.curSelectResourcePoint || this.curSelectResourcePoint.id !== attr.id) {
          this.getCommonResourceById(attr.id).then(res => {
            console.log('请求点位详情信息', res)
            if (res && Number(res.code) === 0 && res.data) {
              res.data.isPoint = true
              this.setCurrentSelectResource(cloneDeep(res.data))
              this.setShowFloorForm(false) // 楼层弹框隐藏
              this.setPanelInfoStatus(true) // 控制右侧详情面板显隐
              this.setCurrPanelToolComponent(null) // 设置为空 map2d 与map2dedit 显示点位详情面板
              this.setPanelInfoEditStatus(true) // 设置当前面板是编辑还是应用(true：可编辑,false：不可编辑)
            }
          })
        } else {
        }
      }
    },
    // 地图双击事件
    handleMapDBClick(e) {
      console.log('地图双击', e)
      let { feature, attributes } = e
      if (attributes && attributes.rType === 3) {
        this.showVideo(attributes, 5)
      }
    },
    // zoom层级变化
    handleMapZoomChange(e) {
      // console.log('地图层级变化', e)
    },
    // 打开视频播放窗口
    showVideo(data, max) {
      let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
      for (let i = 1; i < max; i++) {
        if (
          (nowVideoPlayInfo['video' + i].isShowPlayBack || nowVideoPlayInfo['video' + i].isShowPreview) &&
          nowVideoPlayInfo['video' + i].playInfo &&
          nowVideoPlayInfo['video' + i].playInfo.id === data.id
        ) {
          return
        }
      }
      for (let i = 1; i < max; i++) {
        if (!nowVideoPlayInfo['video' + i].isShowPlayBack && !nowVideoPlayInfo['video' + i].isShowPreview) {
          nowVideoPlayInfo['video' + i].isShowPreview = true
          nowVideoPlayInfo['video' + i].playInfo = data
          this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
          return
        }
      }
      this.$notify({
        type: 'error',
        message: '已超过同时播放上限！'
      })
    },
    // 鼠标移动事件
    handkeMapMouseMove(param) {
      let { feature, attributes } = param
      if (this.editActive && feature && attributes && attributes.type && attributes.type.indexOf('Sector') < 0) {
        // 编辑要素时且悬浮要素不是可视域时
        if (this.curSelectResourcePoint && attributes.id === this.curSelectResourcePoint.id) {
          this.currentEditFeature = feature
        }
      }
      if (feature && attributes && attributes.type && attributes.type.indexOf('Sector') < 0) {
        let coords = feature.getGeometry().getCoordinates()
        if (!attributes.label) {
          return
        }
        if (coords.length !== 2) {
          coords = getCenterByPolygonFeature(coords)
        }
        window.$context2D.nowOverlayLabel.setPosition(coords)
        attributes.name = attributes.label
        this.setOverFlowFeature(attributes)
      } else {
        if (window.$context2D.nowOverlayLabel) {
          window.$context2D.nowOverlayLabel.setPosition([12971547.26829515, 48596082.86922005])
        }
      }
    }
  }
}
