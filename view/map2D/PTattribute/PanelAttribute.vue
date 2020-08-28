<!--
 * @Description: 气泡属性面板
-->
<template>
  <div class="panel">
    <transition name="el-zoom-in-bottom">
      <div>
        <div class="contents">
          <component :is="attributeName" :curSelectResourcePoint="curSelectResourcePoint"></component>
          <i class="el-icon-close" @click="close"></i>
          <i class="el-icon-tickets" title="查看详情" @click="more(curSelectResourcePoint)"></i>
        </div>
        <div class="index">
          <!-- 视频设备有预览回放按钮 -->
          <div class="videoBox" v-if="curSelectResourcePoint.type ==3">
            <el-button size="mini" type="info" plain @click="videoPreview(curSelectResourcePoint)"> 预览 </el-button>
            <el-button size="mini"  type="info" plain @click="videoBackview(curSelectResourcePoint)"> 回放 </el-button>
          </div>
          <!-- 机构重点部位 有楼层索引 -->
          <div class="floorsBox" v-if="curSelectResourcePoint.floors && curSelectResourcePoint.floors.length>0">
            <el-tag v-for="item in curSelectResourcePoint.floors" :key="item.key" size="small" @click="setFloorMap(item)">
              {{ item.floorIndex }}
            </el-tag>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { DEVICETYPE } from 'assets/2DMap/meta/common'
import { mapState, mapActions, mapMutations } from 'vuex'
import OrgAttribute from './attributes/OrgAttribute' // 机构
// import baseCtrl from '../ctrl/base'
export default {
  name: 'panel-attribute',
  components: {
    OrgAttribute
  },
  data() {
    return {
      showFoolrs: false,
      attributeName: '',
      currFloor: null, // 当前楼层
      // 楼层信息表数据
      tableData: [{ name: '机构名称', value: '保定分行' }],
      // 楼层列表
      floorList: []
    }
  },
  // mixins: [baseCtrl],
  computed: {
    ...mapState({
      curSelectResourcePoint: ({ map2d }) =>
        map2d.mapPoint.curSelectResourcePoint
          ? map2d.mapPoint.curSelectResourcePoint
          : {
            name: '',
            org: { name: '', address: '', functionary: '', mobile: '' },
            keyPart: { name: '', address: '', functionary: '', telephone: '' }
          }
    }),
    ...mapState('map2d/mapIndex', [
      'videoPlayInfo',
      'isMapOuter'
    ])
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setPanelInfoEditStatus',
      'setCurrPanelToolComponent',
      'setCurrFeature'
    ]),
    ...mapActions('map2d/mapPoint', ['setCurrentSelectResource', 'setEditActive', 'getCommonResourceById']),
    ...mapActions('map2d/mapIndex', ['setClickTreeNode', 'setIsFloorMap', 'setIsMapOuter', 'setShowFloorInfo']),
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']),
    ...mapMutations('map2d/mapIndex', ['SET_VIDEO_PLAY_INFO', 'SET_ALARM_SETTING', 'UPDATE_NOW_ZOOM' ]),

    close() {
      window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
      this.setClickTreeNode(null)
    },
    more(val) {
      let getPointFun = this.getCommonResourceById
      getPointFun(val.id).then(suc => {
        if (suc.code === 0) {
          this.setCurrentSelectResource(suc.data)
          this.setPanelInfoStatus(true)
          this.setCurrPanelToolComponent(null)
          this.setPanelInfoEditStatus(true)
        }
      })
    },
    videoPreview(item) {
      let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
      for (let i = 1; i < 5; i++) {
        if (
          (nowVideoPlayInfo['video' + i].isShowPlayBack || nowVideoPlayInfo['video' + i].isShowPreview) &&
          nowVideoPlayInfo['video' + i].playInfo &&
          nowVideoPlayInfo['video' + i].playInfo.id === item.id
        ) {
          return
        }
      }
      for (let i = 1; i < 5; i++) {
        if (!nowVideoPlayInfo['video' + i].isShowPlayBack && !nowVideoPlayInfo['video' + i].isShowPreview) {
          nowVideoPlayInfo['video' + i].isShowPreview = true
          nowVideoPlayInfo['video' + i].playInfo = item
          this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
          return
        }
      }
      this.$notify({ title: '警告',
        message: '已达到显示上限，请关闭播放页！',
        type: 'warning'})
    },
    videoBackview(item) {
      let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
      for (let i = 1; i < 5; i++) {
        if (
          (nowVideoPlayInfo['video' + i].isShowPlayBack || nowVideoPlayInfo['video' + i].isShowPreview) &&
          nowVideoPlayInfo['video' + i].playInfo &&
          nowVideoPlayInfo['video' + i].playInfo.id === item.id
        ) {
          return
        }
      }
      for (let i = 1; i < 5; i++) {
        if (!nowVideoPlayInfo['video' + i].isShowPreview && !nowVideoPlayInfo['video' + i].isShowPlayBack) {
          nowVideoPlayInfo['video' + i].isShowPlayBack = true
          nowVideoPlayInfo['video' + i].playInfo = item
          this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
          return
        }
      }
      this.$notify({ title: '警告',
        message: '已达到显示上限，请关闭播放页！',
        type: 'warning'})
    },
    setFloorMap(item) {
      this.UPDATE_INDOOR_LAYER_CONFIG({
        key: 'url',
        value: item.image
      })
      let data = {
        pointObj: this.curSelectResourcePoint,
        envImageData: null,
        floorsImageDate: item,
        id: item.id,
        isFloor: true,
        envId: ''
      }
      this.setShowFloorInfo(true)
      this.setIsFloorMap(data)
      this.setIsMapOuter(2)
    }
  },
  created() {
    this.attributeName = OrgAttribute
  }
}
</script>
<style scoped lang="less">
.panel {
  position: relative;
  width: 340px;
  color: #333333;
  height: 220px;
  background: rgba(255, 255, 255, 0.85);
   box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}
.el-icon-close {
  cursor:pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
.el-icon-tickets {
  // float: right;
  cursor:pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-block;
  width: 22px;
  line-height: 20px;
  text-align: center;
  border: 1px solid #cccccc;
  border-radius: 50%;
  margin-left: 90px;
}
.title {
  text-align: right;
  display: flex;
  justify-content: space-between;
  // background: rgba(0, 0, 0, 0.3);
  padding: 0 15px;
}
.title p {
  font-size: 14px;
  line-height: 22px;
}
.title i {
  font-size: 16px;
  line-height: 22px;
  margin-right: 5px;
}
.contents {
  min-height: 160px;
  position: relative;
}

.footcontent {
  line-height: 20px;
  display: flex;
  justify-content: space-around;
  margin-top: 1px;
  // background: rgba(0, 0, 0, 0.3);
  padding: 0 15px;
}
.index{
  width: 100%;
  position: absolute;
  height: 40px;
  line-height: 40px;
  bottom: 0;
  border-top: 1px solid #fff;
  .videoBox{
    background: #F5F5F5;
    padding-left: 10px;
  }
.floorsBox {
  //  background: rgba(0, 0, 0, 0.3);
height: 40px;
 line-height: 40px;
  text-align: right;
  padding: 3px;
  display: flex;
  overflow-x: scroll;
  background: #F5F5F5;
  .el-tag {
    float: left;
    margin-right: 5px;
    background: #F5F5F5;
     color: #333;
    border: none;
  }
  > *:not(:last-child) {
    float: left;
    margin-right: 8px;
  }
  /deep/ .el-tag:hover {
    cursor: pointer;
    background: #0091ff;
  }
}
}
</style>
