<template>
  <div id="panelSearch" class="navigation">
    <el-tabs v-model="select" stretch>
      <el-tab-pane v-for="item in tabs" :key="item.key" :name="item.key" v-loading="!true">
        <span slot="label" :title="item.title">
          <i :class="item.icon" />
        </span>
        <div v-if="item.key === 'organization'" :class="`${item.key}-tab`">
          <!-- 机构设备树 -->
          <!-- treeState:0/2重点部位，机构树/重点部位机构设备树 -->
          <PanelSearchTreeBox :treeState="'2'" />
        </div>
        <div v-if="item.key === 'resource'" :class="`${item.key}-tab`">
          <!-- 设备资源 -->
            <div v-if="selectedTreeNode && selectedTreeNode.name" class="panel-search-content-floor">
              <PanelSearchDivision
                ref="PanelSearchDivision"
                :imgUrl="'/static/map2d/position.png'"
                :label="selectedTreeNode.name"
              ></PanelSearchDivision>
              <!-- 楼层遍历 -->
              <div class="panel-search-content-floor-list" v-if='floorList.length > 0' cellspacing="0" cellpadding="0" border="0">
                <el-tag
                  v-for="(item, index) in floorList"
                  @click="handleFloor(index, item.id)"
                  ize="small"
                  class="panel-search-content-floor-item"
                  :class="{ 'panel-search-content-floor-item-active': indoorInformation && indoorInformation.id === item.id }"
                  :key="index"
                >{{ item.floorIndex }}</el-tag>
              </div>
            </div>
            <div class="panel-search-content-back" v-if="false">
              <div class="panel-search-content-back-box">
                <span class="panel-search-content-back-label">返回</span>
                <span class="el-icon-right panel-search-content-back-icon"></span>
              </div>
            </div>
            <!-- 设备组件 -->
            <EquipmentControl ref="EquipmentControl"></EquipmentControl>
        </div>

        <div v-if="item.key === 'district'" :class="`${item.key}-tab`">
          <District :keywords="keywords" :select="select" ref="District"></District>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import EquipmentControl from './EquipmentControl'
import PanelSearchDivision from './PanelSearchDivision'
import PanelSearchTreeBox from './PanelSearchTreeBox'
import District from './District' // 行政区设置
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'panel-search',
  components: {
    EquipmentControl,
    PanelSearchDivision,
    PanelSearchTreeBox,
    District
  },
  data() {
    return {
      ifFloorInfo: this.$store.state.map2d.mapIndex.ifFloorInfo, // 楼层信息面板
      // 页面数据
      select: 'organization', // 下拉框选中key
      keywords: '', // 检索关键字
      defaultPropsOrgTree: {
        children: 'children',
        label: 'label'
      },
      selectedFloor: '',
      inputValue: '',
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      // 页签列表
      tabs: [
        { key: 'organization', label: '机构', title: '组织机构', icon: 'ccbjigou-buwei iconfont-ccb' },
        { key: 'resource', label: '资源', title: '资源列表', icon: 'ccbziyuanliebiao iconfont-ccb' },
        { key: 'district', label: '区划', title: '行政区划', icon: 'ccbhangzhengquyu iconfont-ccb' }
      ],
      // 点位详情 楼层信息
      FloorListCode: ''
    }
  },
  watch: {
    'mapToolbarStatus.equipmentControl'(val) {
      // console.log(val)
    }
  },
  computed: {
    ...mapState({
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 存在vuex中获取的机构重点部位树信息
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      floorList: ({ map2d }) => map2d.mapPanelSearch.floorList, // 楼层数组
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists, // 资源树
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint // 当前选中的资源
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList']),
    showFloorList() { // 是否显示楼层列表
      let flag = this.selectedTreeNode.point && this.floorList && this.floorList.length
      console.log('是否显示楼层列表：', this.floorList)
      return flag
    }
  },
  created() {
    this.handlefloorApi() // 展示楼层
  },
  mounted() {
    // console.log(this.mapToolbarStatus)
  },
  methods: {
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode', 'setSelectedTreeNode', 'setFloorList']),
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setindoorInformation', 'setDrawActive', 'setPanelInfoStatus', 'setFloorsPanelObj']),
    ...mapActions('map2d/mapPoint', ['getAllFloorAKey', 'setCurrentSelectResource', 'setEditActive']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG']), // 楼内平面图
    ...mapMutations('map2d/mapPoint', ['CLEAR_ALL_POINT_DATA']), // 清空所有点位相关数据
    handlefloorApi() { // 展示楼层
      let data = {
        orgId: JSON.parse(sessionStorage.getItem('user')).organizationIndexId,
        keyPartId: 0
      }
      if (data.orgId) {
        this.setFloorsPanelObj(data).then(suc => {
          if (!suc.code) {
            this.setSelectedTreeNode({name: suc.data.orgName})
            if (suc.data.floors && suc.data.floors.length > 0) {
              this.setFloorList(suc.data.floors)
            }
          }
        })
      }
    },
    handleFloor(item, itmeId) {
      this.clearCurrentOperatePoint() // 清空当前操作的点位数据
      this.selectedFloor = item
      let nowThis = this
      // 展示楼内平面图
      this.getAllFloorAKey(itmeId)
        .then(suc => {
          if (suc.data.image !== '') {
            this.CLEAR_ALL_POINT_DATA() // 清空所有点位相关数据（ResourceArr，IconFeatures， SectorFeatures和高亮要素）
            nowThis.UPDATE_INDOOR_LAYER_CONFIG({
              // 展示楼内平面图
              key: 'url',
              value: suc.data.image
            })
            let data = {
              id: item,
              isFloor: true
            }
            this.setIsFloorMap(data)
            this.setIsMapOuter(2)
            let foolXId = {
              id: itmeId
            }
            this.setindoorInformation(foolXId) // 存储楼层id
          }
        })
        .catch(err => console.log(err))
    },
    // 清空当前操作的点位数据
    clearCurrentOperatePoint() {
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 关闭点位绘制状态
      this.setEditActive(false) // 关闭点位编辑状态
    }
  }
}
</script>
<style lang="less" scoped>
.panel-search-content-floor {
  .panel-search-content-floor-list {
    overflow-x: scroll;
    text-align: right;
    padding: 3px;
    display: flex;
    .panel-search-content-floor-item {
      float: left;
      height: 24px;
      line-height: 24px;
      margin: 5px 20px 5px 0;
      cursor: pointer;
    }
    > *:not(:last-child) {
      float: left;
      margin-right: 8px;
    }
    /deep/ .el-tag:hover {
      cursor: pointer;
    }
    .panel-search-content-floor-item-active {
      color: #fff;
      background: #0091ff;
    }
  }
}
.iconfont {
  font-size: 22px;
  color: #409eff;
}
  .iconfont-ccb {
    font-size: 22px;
  }
#panelSearch {
  display: inline-block;
  height: inherit;
  width: 300px;
  position: relative;
  padding: 8px;
  top: 0px;
  background: rgba(255,255,255,0.95);
  box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  overflow-y: scroll;

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .el-tree {
    background: transparent !important;
  }

  // .panel-search-input {
  //   padding: 10px 20px;
  // }

  .panel-search-content {
    @val: 60px;
    height: calc(~'100% - @{val}');
    padding: 10px;
    // background: rgba(200, 200, 200, 0.7);
    /deep/ .treeBox .treeInfo {
      &[name='equ'] span.treeText {
        max-width: calc(~'100% - 94px');
      }
      &[name='res'] span.treeText {
        max-width: calc(~'100% - 58px');
      }
    }
    .panel-search-content-back {
      text-align: right;
      padding: 0 20px 0 0;

      .panel-search-content-back-box {
        display: inline-block;
        cursor: pointer;
      }

      .panel-search-content-back-box:hover {
        color: #0091ff;
      }
    }
  }
}
</style>
