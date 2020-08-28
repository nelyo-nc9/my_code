// 点位要素绘制
import { mapState, mapActions } from 'vuex'
import drawStyleMap from 'assets/2DMap/meta/drawStyle'
import {
  DEVICETYPE,
  VIDEOTYPEKEY,
  MPSIGNKEY,
  ALARMDEVICETYPE,
  INTERCOMTYPE,
  ACCESSDEVICETYPE,
  CABINTYPE
} from 'assets/2DMap/meta/common'
import videoTrans from 'assets/2DMap/feature/edit/video'
import drawConfig from 'assets/2DMap/meta/draw'
import styleConfig from 'assets/2DMap/meta/style'
import areaUtil from 'assets/2DMap/areaUtil'
import generalTrans from 'assets/2DMap/feature/edit/general'
import { each, filter, cloneDeep } from 'lodash'
export default {
  data() {
    return {
      pointDraw: {
        id: 'pointDrawer',
        name: 'point'
      },
      lineStringDraw: JSON.parse(JSON.stringify(drawConfig.commonAlarmLine)), // 线绘制样式
      polygonDraw: JSON.parse(JSON.stringify(drawConfig.grid)), // 区域绘制样式
      isDrawAreaInter: false, // 绘制区域是否相交
      resMapSign: null // 地图要素类型标识 MPSIGNKEY
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['mapConfig', 'currDrawType', 'drawActive', 'drawStyleType']),
    drawStyle() { // 区域绘制时的样式
      let style = cloneDeep(this.drawStyleType)
      if (style && typeof style === 'object') {
        return style
      } else {
        return drawStyleMap[this.drawStyleType] || drawStyleMap['default']
      }
    },
    drawEndStyle() { // 区域绘制完成后要素的样式
      let style = cloneDeep(this.drawStyleType)
      if (!(style && typeof style === 'object')) {
        style = drawStyleMap[this.drawStyleType] || drawStyleMap['default']
      }
      if (style) {
        style = JSON.parse(JSON.stringify(style))
        style.textStyle && delete style.textStyle
      }
      return style
    }
  },
  watch: {
    drawActive(flag) { // 监听区域绘制状态变化
      if (!flag) { // 关闭绘制时，需要清空绘制要素
        this.clearDrawAreaFeatures() // 清空绘制区域
      }
    }

  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setDrawActive']),
    ...mapActions('map2d/mapPoint', [
      'setVideoSectorFeatures',
      'setDrawFeatureLoc',
      'setAreaDrawActive',
      'setAreaDrawLoc',
      'setPointIconFeatures'
    ]),
    // 清空绘制区域
    clearDrawAreaFeatures() {
      this.clearFeaturesInLayer('draw')
    }
    // 处理绘制完成
    // handleDrawEnd(v) {
    //   // console.log('绘制完成', v, this.drawStyleType)
    //   const data = {
    //     wkt: v.wkt
    //   }
    //   this.getBoxSelection(data).then(res => {
    //     this.showKuangSel(res.data)
    //     this.setCurrPanelToolComponent('BoxSelectStatistic') // 设置右侧面板为筛选统计面板
    //     this.setPanelInfoStatus(true) // 显示右侧面板
    //   })
    //   // setTimeout(() => {
    //   this.setDrawActive({type: this.currDrawType, styleType: this.drawStyleType, active: false }) // 关闭绘制
    //   // }, 500)
    // }
  }
}
