<!--
 * @Description: 机构重点部位设备资源树
 * @Author: zuoshaohua
 * @Date: 2020-07-01 11:57:43
 * @LastEditTime: 2020-07-01 11:57:43
 * @LastEditors: zuoshaohua
-->
<template>
  <div class="tree    resTree">
    <!-- 机构重点部位设备资源树 -->
    <treeBox
      v-if="treeToogle !== 0"
      :lazyTreeApi="getTreeApi"
      :showSlotIcon='true'
      :treeType="treeType"
       :lazyTreeSearchApi="getLazyTreeSearchApi"
      :customizeQuery="customizeQuery"
      searchType="search"
      @onceClick="handleClick"
      @dblclick="playVideo"
      treeLazyToggle
      ref="inside"

      :customizeClassName="
        data => {
          if (data.isPoint) {
            return ['activeItem']
          } else {
            return []
          }
        }
      "
    >
      <template slot-scope="{ data, node }">
        <i class="iconfont icon-loufangdianwei"  v-if="data.hasEnvImage" title="平面图" @click="changeBuildingMap(data)"></i>
            <!-- 是否有红色报警状态图标 -->
        <i class="iconfont icon-baojing2" v-if="Boolean((data.tierType=='org' && checkOrgs(data.id)) || (data.tierType=='loc' && checkKeyParts(data.id)) )"  style="color:red"></i>
      </template>
    </treeBox>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getSearchTreeApi } from '@src/http/map2D/index.js'
import baseCtrl from '../baseMap/ctrl/base'
import {
  TREENODETYPE,
  SHAPETYPE,
  DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE
} from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import spaceUtil from '@src/assets/2DMap/spaceAnalysisUtil'
export default {
  name: 'PanelSearchTreeBox',
  data() {
    return {
      treeType: '0',
      treeToogle: 1,
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      // 机构树传参
      customizeQuery: {
        params: {
          subSystem: this.selectedEquipment.id,
          isRecursion: '0',
          isFilter: true
          // searchType: this.selectedEquipment.type

        }
      }
    }
  },
  props: {
    selectedEquipment: { type: Object, default: '' }
  },
  mixins: [
    baseCtrl // 基础控制
  ],
  components: { treeBox },
  computed: {
    ...mapState({
      alarmSetting: ({ map2d }) => map2d.mapIndex.alarmSetting, // 接警相关信息
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      selectedTreeNodeApply: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNodeApply, // 当前选中的树节点
      clickTreeNode: ({ map2d }) => map2d.mapIndex.clickTreeNode //  当前设置的定位 树节点
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus', 'isMapEdit', 'videoPlayInfo']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList']),
    listenkeyPartIds() {
      return this.alarmSetting.alarmFeatureIds.keyPartIds
    },
    listenOrgIds() {
      return this.alarmSetting.alarmFeatureIds.orgIds
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setRefreshTreeList']),
    ...mapActions('map2d/mapPanelSearch', ['setselectedTreeCode']),
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments', 'setClickTreeNode']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    ...mapActions('map2d/mapPoint', ['getCommonResourceById', 'setCurrentSelectResource', 'getAllFloorAKey']),
    ...mapMutations('map2d/mapIndex', ['SET_VIDEO_PLAY_INFO', 'UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']),
    // 当前选中的树节点是资源数组还是点位要素 //   'org' / 'loc' / 'equ' / 'res', // 本节点类型 机构、重点部位、设备、资源
    preview(val) {
      let data = {
        channel: val.channel,
        devIp: val.ip,
        devPort: val.cPort,
        dport: val.dPort,
        streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2'
      }
      this.$refs.preview.openPreview(data)
    },
    // 判断机构报警图标显隐
    checkOrgs(id) {
      if (this.alarmSetting.isReceive) {
        return this.listenOrgIds.includes(id)
      } else {
        return false
      }
    },
    // 判断重点部位报警图标显隐
    checkKeyParts(id) {
      if (this.alarmSetting.isReceive) {
        return this.listenkeyPartIds.includes(id)
      } else {
        return false
      }
    },
    handleClick(data) {
      let { point, tierType } = data
      let { type } = this.selectedEquipment
      // 切换树节点  清空之前赋值 的点位详情    定位图标   关闭跟随面板
      this.setClickTreeNode(null)
      this.setCurrentSelectResource(null)
      window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
      let obj = {}
      let getPointFun = this.getCommonResourceById
      const location = this.getFeaturCenterLoction(data.point)
      if (data.isPoint && Number(point.type) === Number(type)) {
        this.setMapType(data)
        // if (data.isPoint && tierType !== 'loc' && tierType !== 'org') {
        // 调取详情   方便跟随面板取值
        getPointFun(data.point.id).then(suc => {
          if (suc.code === 0) {
            this.setCurrentSelectResource(suc.data)
            obj = {
              id: data.point.id,
              type: DEVICETYPETRANSATE[`${data.point.type}`],
              subType: SUBTYPEOBJTRANSATE[`${data.point.type}`][`${data.point.subType}`],
              location: location,
              level: data.point.level
            }
            // 设置存储图层类型 方便显隐定位
            this.setClickTreeNode(obj)
          }
        })
      } else {
        this.setClickTreeNode(null)
        this.setCurrentSelectResource(null)
      }
    },

    // 判断是否切换地图
    setMapType(data) {
      let { place, floorId, envId } = data.point
      const loction = this.getFeaturCenterLoction(data.point)
      let nowPlace = this.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2 // 当前地图类型(1-室外gis，2-环境平面图，3-楼层平面图)
      if ((floorId === this.floorMap.id && nowPlace === 2 && place === 2) || (envId === this.floorMap.envId && nowPlace === 3 && place === 3) || (nowPlace === 1 && place === 1)) {
      } else {
        //
        // 点位所在地图类型与当前地图类型不一致时，需要跳转到点位所在的地图
        if (place === 1) {
          // 跳转到室外gis图：isMapOuter设置为 1 ，数据清空（environmentalScienceInformation最新的环境信息，indoorInformation最新的室内信息）
          this.setIsMapOuter(1)
          this.setIsFloorMap({
            pointObj: null,
            isFloor: false, // ture 室内 false 环境
            id: '',
            envId: ''})
        } else if (place === 2) {
          if (data.point.envImageData.image && data.point.envId) {
            this.UPDATE_OUTDOOR_LAYER_CONFIG({
              key: 'url',
              value: data.point.envImageData.image
            })
            this.setIsFloorMap({
              envImageData: data.envImageData,
              floorsImageDate: null,
              isFloor: false, // ture 室内 false 环境
              id: '',
              envId: data.point.envId})
            this.setIsMapOuter(2)
          } else {
            this.$notify({
              message: '点位数据错误，平面图id或平面图缺失',
              type: 'warning'
            })
          }
        } else if (place === 3) {
          // 跳转到楼层平面图：isMapOuter设置为 2，floorMap.isFloor设置为true，设置indoorInformation最新的室内信息和indoorLayerConfig.url，数据清空（environmentalScienceInformation最新的环境信息）
          if (data.point.floorId) {
            // 点位所在楼层id
            // 获取点位所在的楼层数据
            this.getAllFloorAKey(data.point.floorId)
              .then(res => {
                let floorData = cloneDeep(res.data)
                this.setIsFloorMap({
                  envImageData: null,
                  floorsImageDate: floorData,
                  isFloor: true, // ture 室内 false 环境
                  id: floorData.id,
                  envId: ''})
                this.UPDATE_INDOOR_LAYER_CONFIG({
                  // 展示环境平面图
                  key: 'url',
                  value: floorData.image
                })
                this.setIsMapOuter(2)
              })
              .catch(err => {
                console.error('跳转到楼层平面图时，获取楼层信息失败！', err)
              })
          }
        }
      }
    },
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
    // 计算地图中心
    playVideo(data) {
      console.log('播放视频。。。。')
      if (data.pointType === 3) {
        this.videoPreview(data.point)
      }
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
    changeBuildingMap(val) {
      this.UPDATE_OUTDOOR_LAYER_CONFIG({
        key: 'url',
        value: val.point.envImageData.image
      })
      this.setIsFloorMap({
        pointObj: val.point,
        isFloor: false, // ture 室内 false 环境
        id: '',
        envId: val.point.envId})
      this.setIsMapOuter(2)
    },
    getTreeApi(customizeQuery) {
      if (
        !customizeQuery.hasOwnProperty('oId') &&
        !customizeQuery.hasOwnProperty('kpId') &&
        !customizeQuery.hasOwnProperty('dId')
      ) {
        if (this.selectedTreeNodeApply.tierType === TREENODETYPE.org) {
          customizeQuery.oId = this.selectedTreeNodeApply.serial
        } else if (this.selectedTreeNodeApply.tierType === TREENODETYPE.loc) {
          customizeQuery.kpId = this.selectedTreeNodeApply.id
        }
      }
      if (this.treeType === '1' && customizeQuery.hasOwnProperty('dId')) {
        customizeQuery['kpId'] = customizeQuery.dId
        delete customizeQuery.dId
      }
      if (this.hostType === '7') {
        customizeQuery['hostType'] = '3'
      } else if (this.hostType === '5') {
        customizeQuery['isGuard'] = true
      }
      return getTreeApi(customizeQuery)
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      if (this.hostType === '7') {
        params = {
          keyword: params.search,
          searchType: this.selectedEquipment.type,
          isDoor: true
        }
      } else {
        params = {
          keyword: params.search,
          searchType: this.selectedEquipment.type
        }
      }
      return getSearchTreeApi(params)
    }
    /**
     * 判断点击机构，机构，资源，设备树的类型，返回相应的参数
     * @param {*} largeType 类型
     * @param {*} smallType 子类型
     * @param {*} monitype 树节点子类型
     */

  },
  watch: {
    // 监听树添加删除点位时候刷新
    '$store.state.map2d.mapIndex.refreshTreeList'(newValue, oldValue) {
      if (newValue) {
        this.$refs.inside.insideRefreshs()
        this.setRefreshTreeList(false)
      }
    },
    selectedEquipment: {
      deep: true,
      immediate: true,
      handler: function(newValue, oldValue) {
        if (newValue != oldValue) {
          this.treeToogle = 0
          this.customizeQuery.params.subSystem = this.selectedEquipment.id
          setTimeout(() => {
            if (newValue.index === '2') {
              this.treeType = '1'
              this.hostType = ''
            } else if (newValue.index === '7') {
              this.treeType = '0'
              this.hostType = '7'
            } else if (newValue.index === '5') {
              this.hostType = '5'
            } else {
              this.hostType = ''
              this.treeType = '0'
            }
            this.treeToogle = 1
          }, 0)
        }
      }
    },
    selectedTreeNodeApply: {
      deep: true,
      immediate: true,
      handler: function(newValue, oldValue) {
        if (newValue != oldValue) {
          this.treeToogle = 0
          setTimeout(() => {
            this.treeToogle = 1
          }, 0)
        }
      }
    },
    customizeQuery: {
      handler(val) {
        console.log('customizeQuery', { ...val })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .resTree{
  height: auto;
  // height: calc(100%-200px);
}

.tree {
  background: transparent;
  /deep/ .treeBox .tree{
    overflow: visible !important;
     .treeText {
       color:#151515 ;
     }
     /deep/.activeItem .treeText {
  color: #4887be;
}
}
}
/deep/ .treeBox .treeInfo {
  &[name='equ'] span.treeText {
    max-width: calc(~'100% - 94px');
  }
  &[name='res'] span.treeText {
    max-width: calc(~'100% - 58px');
  }
}
/deep/.el-tree-node__content{
  border-left:0
}

</style>
