<!--
 *
 * @Description: 行政区统计面板
-->
<template>
  <div class="Panel-District">
    <div class="header">
      <span class="titleName">{{ nowSelectAreaInfo.name }}</span>
        <span class="el-icon-close  header-close"  @click="close" ></span>
    </div>
    <el-collapse v-model="activeName">
      <el-collapse-item v-for="type in typeList" :key="type.label" :name="type.key">
        <div slot="title">
          {{ type.name }} <span>{{ (drawResult[type.label] || []).length }}</span>
          <!-- <i
            :class="['tltle-icon', activeName === type.label ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
          /> -->
        </div>
        <el-row :gutter="8" style="margin-bottom:5px">
          <el-col :span="type.span || 8" v-for="(item, index) in drawResult[type.label]" :key="index">
            <el-button
              size="mini"
               :title="item.name "
              @click="handleClickItem(item, type, $event)"
              >{{ item.name }}</el-button
            >
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getMapLayerById } from '../../utils'
import {
  DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE, SHAPETYPE
} from 'assets/2DMap/meta/common'
import spaceUtil from '@src/assets/2DMap/spaceAnalysisUtil'
export default {
  name: 'panel-district',
  data() {
    return {
      activeName: ['importPart', 'keyParts'],
      typeList: [
        { key: 'importPart', label: 'org', name: '机构', span: 12, value: false },
        { key: 'keyParts', label: 'keyPart', name: '重点部位', span: 12, value: false }
      ]
    }
  },
  watch: {
    '$store.state.map2d.mapIndex.drawResult'(newValue, oldValue) {
      console.log(newValue, oldValue)
      console.log('框选弹窗', this.$store.state.map2d.mapIndex.drawResult)
    }
  },

  computed: {
    ...mapGetters('map2d/mapIndex', ['drawResult', 'boxSelectionArr', 'clickTreeNode', 'videoPlayInfo', 'nowSelectAreaInfo'])
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
      view.setZoom(10) // 显示级别放大
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
    }
  }
}
</script>

<style lang="less" scoped>
.Panel-District {
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
