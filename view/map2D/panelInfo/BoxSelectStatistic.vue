<!--
 * @Author: fengbeibei
 * @Date: 2020-06-02 20:02:49
 * @LastEditors: fengbeibei
 * @LastEditTime: 2020-06-05 17:40:12
 * @Description: 框选统计面板
-->
<template>
  <div class="box-select-statistics">
    <div class="header">
      <span  class="titleName">框选结果</span>
         <span class="el-icon-close  header-close"  @click="close" ></span>
    </div>
    <el-collapse v-model="activeName" >
      <el-collapse-item
        v-for="type in typeList"
        :key="type.key"
        :name="type.key"
        v-if="Boolean((drawResult[type.key] || []).length)"
      >
        <div slot="title">
          {{ type.name }} <span>{{ (drawResult[type.key] || []).length }}</span>
          <!-- <i
            :class="['tltle-icon', activeName. ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
          /> -->
        </div>
        <el-row :gutter="8" style="margin-bottom:5px">
          <el-col :span="type.span || 12" v-for="(item, index) in drawResult[type.key]" :key="index">
            <el-button size="mini" @click="handleClickItem(item, type, $event)"  :title="item.name " @dblclick.native="ifPalyVideo(item,type)">{{ item.name }}</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getMapLayerById } from '../utils'
import {
  DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE, SHAPETYPE
} from 'assets/2DMap/meta/common'
import spaceUtil from '@src/assets/2DMap/spaceAnalysisUtil'
export default {
  name: 'box-select-statistics',
  data() {
    return {
      activeName: ['importPart', 'keyParts', 'camera'],
      typeList: [
        { key: 'importPart', label: 'org', name: '机构', span: 12, value: false },
        { key: 'keyParts', label: 'keyPart', name: '重点部位', span: 12, value: false },
        { key: 'camera', label: 'video', name: '摄像机', value: false },
        { key: 'recorder', label: 'videoHost', name: '录像机', value: false },
        { key: 'alarm', label: 'alarmDevice', name: '报警设备', value: false },
        { key: 'fireFighting', label: 'fireDevice', name: '消防设备', value: false },
        { key: 'intercom', label: 'intercomDevice', name: '对讲设备', value: false },
        { key: 'access', label: 'accessControlDevice', name: '门禁设备', value: false },
        { key: 'protectedCabin', label: 'cabin', name: '防护舱', value: false }
      ]
    }
  },
  watch: {
    '$store.state.map2d.mapIndex.drawResult'(newValue, oldValue) {
      console.log('当前框选最新结果', newValue)
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['drawResult', 'boxSelectionArr', 'clickTreeNode', 'videoPlayInfo'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setClickTreeNode']),
    ...mapMutations('map2d/mapIndex', [
      'SET_VIDEO_PLAY_INFO'
    ]),
    ...mapActions('map2d/mapPoint', ['getCommonResourceById', 'setCurrentSelectResource']),
    // 通过要素设置地图视角中心
    setCenterByFeature(feature) {
      const { map, ol } = window.$context2D // 获取map实例
      const view = map.getView() // 获取地图视角
      const extent = feature.getGeometry().getExtent() // 获取图形范围
      const center = ol.extent.getCenter(extent) // 获取范围中心
      view.setCenter(center) // 视角切换至要素范围中心
    },
    close() {
      this.setPanelInfoStatus(false)
    },
    // 点位类型点击事件
    handleClickItem(item, type) {
      console.log('查看item level', item)
      item.value = !item.value
      let getPointFun = this.getCommonResourceById
      const location = this.getFeaturCenterLoction(item)
      getPointFun(item.id).then(suc => {
        this.setCurrentSelectResource(suc.data)
        if (typeof (item.type) === 'number') {
          let obj = {
            id: item.id,
            type: DEVICETYPETRANSATE[`${item.type}`],
            subType: SUBTYPEOBJTRANSATE[`${item.type}`][`${item.subType}`],
            location: location,
            level: item.level
          }
          this.setClickTreeNode(obj)
        } else {
          let obj = {
            id: item.id,
            type: item.type,
            subType: item.subType,
            location: location,
            level: item.level
          }
          this.setClickTreeNode(obj)
        }

        // 设置存储图层类型 方便显隐定位
      })
      this.$forceUpdate()
    },
    // 获取点位中心
    getFeaturCenterLoction(data) {
      if (data && data.coordinate) {
        let { coordinate, shapeType } = data
        let centerCoordinates = Array.isArray(coordinate) ? coordinate : coordinate.split(',').map(item => Number(item))
        // ---需要考虑地图形态是点、线、面
        if (shapeType) {
          if (shapeType === SHAPETYPE.LINESTRING) {
          // 线
            centerCoordinates = spaceUtil.getMultiLineStringCenter(coordinate)
          } else if (shapeType === SHAPETYPE.POLYGON) {
          // 面
            centerCoordinates = spaceUtil.getMultiPolygonCenter(coordinate)
          }
        }
        return centerCoordinates
      }
    },
    // 点位类型s双击事件
    ifPalyVideo(item, type) {
      let getPointFun = this.getCommonResourceById
      if (item.type === 3) {
        getPointFun(item.id).then(suc => {
          if (suc.code === 0) {
            const pointInfo = cloneDeep(suc.data)
            this.showVideo(pointInfo, 2)
          }
        })
      }
    },
    // 频播放窗口
    showVideo(data, max) {
      let nowVideoPlayInfo = cloneDeep(this.videoPlayInfo)
      if (nowVideoPlayInfo.video1.isShowPlayBack || nowVideoPlayInfo.video1.isShowPreview) {
        nowVideoPlayInfo.video1.playInfo = data
        this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
      } else {
        nowVideoPlayInfo.video1.isShowPreview = true
        nowVideoPlayInfo.video1.playInfo = data
        this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-select-statistics {
  height: 100%;
  .el-button--primary {
    height: 22px;
  }
.header {
  height: 30px;
  // border-bottom: 1px solid #E1E1E1;
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
}
.titleName{
 border-left: 2px solid #2d72d3;
    padding-left: 8px;
}
.header-close {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
}
  /deep/ .el-collapse {
    /deep/ .el-collapse-item__header .tltle-icon {
      margin-left: 8px;
    }
    /deep/ .el-collapse-item__header {
      height: 36px;
      line-height: inherit;
      background-color: inherit;
    }
    /deep/ .el-collapse-item__wrap {
      background-color: inherit;
      max-height: 300px;
      overflow-y: scroll;
    }

    /deep/ .el-button {
      width: 100%;
      height:25px;
     margin-bottom: 5px;
      // margin: 4px 0px;
      // padding: 4px 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-collapse-item__content {
    padding-bottom: 5px;
    }
  }
}
</style>
