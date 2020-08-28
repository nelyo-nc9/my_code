<!--
 * @Description: 机构重点部位树
 * @Author: zuoshaohua
 * @Date: 2020-07-01 11:57:43
 * @LastEditTime: 2020-07-01 11:57:43
 * @LastEditors: zuoshaohua
-->
<template>
  <div class="orgtree">
    <treeBox
      v-if="treeState === '2'"
      :lazyTreeApi="getTreeApi"
      :lazyTreeSearchApi="getLazyTreeSearchApi"
      :customizeQuery="customizeQuery"
      :showSlotIcon='true'
      :treeType="treeState"
      searchType="search"
      ref='orgTree'
      @onceClick="handleClick"
      treeLazyToggle
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
        <!-- v-if="data.hasEnvImage" -->
        <i class="iconfont icon-loufangdianwei"  v-if="data.hasEnvImage"   title="平面图" @click.stop="changeBuildingMap(data)"></i>
        <!-- 是否有红色报警状态图标 -->
        <i class="iconfont icon-baojing2" v-if="Boolean((data.tierType=='org' && checkOrgs(data.id)) || (data.tierType=='loc' && checkKeyParts(data.id)) )"  style="color:red"></i>
      </template>
    </treeBox>

  </div>

</template>
<script>
import { cloneDeep } from 'lodash'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getSearchOrgTreeApi } from '@src/http/map2D/index.js'
import { DEVICETYPETRANSATE, SUBTYPEOBJTRANSATE } from '@src/assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { SHAPETYPE } from 'assets/2DMap/meta/common'
import spaceUtil from '@src/assets/2DMap/spaceAnalysisUtil'
import FloorInfo from './FloorInfo'
export default {
  name: 'PanelSearchTreeBox',
  components: {
    FloorInfo
  },
  computed: {
    ...mapState({
      showFloorInfo: ({ map2d }) => map2d.mapIndex.showFloorInfo
    })
  },
  data() {
    return {
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      customizeQuery: {
        // 机构树传参
        params: {
        //  isFilter: true,
          type: 0,
          // oId: '1', // 机构id
          // kpId: '2', // 部位id
          // dId: '1',// 设备id
          subSystem: this.equipment,
          isRecursion: '0'
        }
      }
    }
  },
  props: {
    treeState: {
      type: String,
      default: ''
    },
    equipment: {
      type: String,
      default: ''
    }
  },
  components: { treeBox },
  computed: {
    ...mapState({
      alarmSetting: ({ map2d }) => map2d.mapIndex.alarmSetting, // 接警相关信息
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      selectedTreeNodeApply: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNodeApply, // 当前选中的树节点
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组
      clickTreeNode: ({ map2d }) => map2d.mapIndex.clickTreeNode //  当前设置的定位 树节点
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus', 'isMapEdit', 'isMapOuter']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList']),
    ...mapGetters('map2d/mapPointMapShow', ['clickOrgFeatures']),
    listenkeyPartIds() {
      return this.alarmSetting.alarmFeatureIds.keyPartIds
    },
    listenOrgIds() {
      return this.alarmSetting.alarmFeatureIds.orgIds
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNodeApply']),
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments']),
    ...mapActions('map2d/mapIndex', [
      'setDrawActive',
      'setPanelInfoStatus',
      'setPanelInfoEditStatus',
      'setClickTreeNode'
    ]),
    ...mapActions('map2d/mapPoint', ['getCommonResourceById', 'setCurrentSelectResource', 'getAllFloorAKey']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']),
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
    // 树节点点击事件
    handleClick(data) {
      // 点击 设置到设备资源树的查询条件
      this.setSelectedTreeNodeApply(data)
      //  console.log(data)
      // 清空定位图标 对象
      this.setClickTreeNode(null)
      this.setCurrentSelectResource(null)
      window.$context2D.map.removeOverlay(window.$context2D.nowOverlayArrribute)
      // 切换树节点  清空之前赋值 的点位详情    定位图标   关闭跟随面板
      let obj = {}
      let getPointFun = this.getCommonResourceById
      const location = this.getFeaturCenterLoction(data.point)
      if (data.isPoint) {
        this.setMapType(data.point)
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
      let { place, floorId, envId } = data
      let nowPlace = this.isMapOuter === 1 ? 1 : this.floorMap.isFloor ? 3 : 2 // 当前地图类型(1-室外gis，2-环境平面图，3-楼层平面图)
      if ((floorId === this.floorMap.id && nowPlace === 2 && place === 2) || (envId === this.floorMap.envId && nowPlace === 3 && place === 3) || (nowPlace === 1 && place === 1)) {
      } else {
        //
        // 点位所在地图类型与当前地图类型不一致时，需要跳转到点位所在的地图
        if (place === 1) {
          // 跳转到室外gis图：isMapOuter设置为 1 ，数据清空（environmentalScienceInformation最新的环境信息，indoorInformation最新的室内信息）
          this.setIsMapOuter(1)
          this.setIsFloorMap({
            envImageData: null,
            floorsImageDate: null,
            isFloor: false, // ture 室内 false 环境
            id: '',
            envId: ''})
        } else if (place === 2) {
          this.UPDATE_OUTDOOR_LAYER_CONFIG({
            key: 'url',
            value: data.envImageData.image
          })
          this.setIsFloorMap({
            envImageData: data.envImageData,
            floorsImageDate: null,
            isFloor: false, // ture 室内 false 环境
            id: '',
            envId: data.envId})
          this.setIsMapOuter(2)
        } else if (place === 3) {
          if (data.floorId) {
            // 点位所在楼层id
            // 获取点位所在的楼层数据
            this.getAllFloorAKey(data.floorId)
              .then(res => {
                let floorData = cloneDeep(res.data)
                this.setIsFloorMap({
                  envImageData: null,
                  floorsImageDate: floorData,
                  isFloor: true, // ture 室内 false 环境
                  id: floorData.id})
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
    // 点击平面图图标 跳转平面图
    changeBuildingMap(val) {
      this.UPDATE_OUTDOOR_LAYER_CONFIG({
        key: 'url',
        value: val.point.envImageData.image
      })
      this.setIsFloorMap({
        envImageData: val.point.envImageData,
        floorsImageDate: null,
        isFloor: false, // ture 室内 false 环境
        id: '',
        envId: val.point.envId})
      this.setIsMapOuter(2)
    },
    // 懒加载树调取接口
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        keyword: params.search
      }
      return getSearchOrgTreeApi(params)
    }
  }
}
</script>
<style lang="less" scoped>
.orgtree{
  height: 100%;
  position: relative;
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
/deep/.activeItem .treeText {
  color: #4887be;
}
/deep/ .treeBox .tree{
    overflow: visible !important;
}
}

</style>
