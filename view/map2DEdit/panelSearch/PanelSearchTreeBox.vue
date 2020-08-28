<!--
 * @Description: 机构重点部位树
 * @Author: zuoshaohua
 * @Date: 2020-07-01 11:57:43
 * @LastEditTime: 2020-07-01 11:57:43
 * @LastEditors: zuoshaohua
-->
<template>
  <div>
    <!-- 机构重点部位树 -->
    <!-- :lazyTreeSearchApi="getLoadingTreeSearch"
      :searchType="search" -->
    <div class="treeBoxCentent">
        <treeBox
        :lazyTreeApi="getTreeApi"
        :lazyTreeSearchApi="getLazyTreeSearchApi"
        :showSlotIcon='true'
        :treeType="2"
        searchType="search"
        :customizeQuer="customizeQuer"
        @onceClick="handleClick"
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
          <i
            class="iconfont icon-loufangdianwei"
            v-if=" data.point && data.hasEnvImage && data.point.place === 1"
            title="平面图"
            @click.stop="changeBuildingMap(data)"
          ></i>
        </template>
      </treeBox>
    </div>
    <!-- 设备资源 -->
      <div v-if="buildingDirectory" class="panel-search-content-floor">
        <div>楼层索引</div>
        <!-- 楼层遍历 -->
        <div class="panel-search-content-floor-list" v-if='showFloorList' cellspacing="0" cellpadding="0" border="0">
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
  </div>
</template>
<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getLoadingTreeSearchApi, getSearchOrgTreeApi} from '@src/http/map2D/index.js'
import eventCtrl from '../baseMap/ctrl/event'
import {
  GEOMETRYTYPE,
  KEYPARTTYPE,
  DEVICETYPE,
  VIDEOTYPEKEY,
  KEYPARTTYPEORG,
  TREENODETYPE,
  MAPTYPENUMBER
} from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { cloneDeep, each, find, filter, map } from 'lodash'
export default {
  mixins: [eventCtrl],
  name: 'PanelSearchTreeBox',
  data() {
    return {
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      customizeQuer: {
        params: {
          type: '2',
          isRecursion: '0'
        }
      }
    }
  },
  components: {
    treeBox
  },
  watch: {
    // 监听树添加删除点位时候刷新
    '$store.state.map2d.mapIndex.refreshTreeList'(newValue, oldValue) {
      if (newValue) {
        this.$refs.inside.insideRefreshs()
        // this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
        this.setRefreshTreeList(false)
      }
    }
  },
  computed: {
    ...mapState({
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 存在vuex中获取的机构重点部位树信息
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists, // 资源树
      buildingDirectory: ({ map2d }) => map2d.mapIndex.buildingDirectory, // 楼层索引现因控制 机构重点部位树下面的
      floorList: ({ map2d }) => map2d.mapPanelSearch.floorList // 楼层数组
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus', 'isMapEdit', 'refreshTreeList']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList']),
    showFloorList() { // 是否显示楼层列表
      let flag = this.selectedTreeNode && this.selectedTreeNode.point && this.floorList && this.floorList.length
      return flag
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setRefreshTreeList', 'setenvironmentalScienceInformation', 'setindoorInformation',
      'setVarNowZoom' //   点击树保存的可见层级
    ]),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode', 'setSelectedTreeCode', 'setShowFloorForm']),
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    ...mapMutations('map2d/mapIndex', [
      'REFRESH_TREE_LIST',
      'UPDATE_INDOOR_LAYER_CONFIG',
      'UPDATE_OUTDOOR_LAYER_CONFIG'
    ]),
    ...mapMutations('map2d/mapPoint', ['CLEAR_ALL_POINT_DATA']), // 清空所有点位相关数据
    ...mapActions('map2d/mapPoint', ['getAllFloorAKey', 'setCurrentSelectResource', 'setEditActive', 'getCommonResourceById']),
    // 清空当前操作的点位数据
    clearCurrentOperatePoint() {
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 关闭点位绘制状态
      this.setEditActive(false) // 关闭点位编辑状态
    },
    // 不同楼层切换
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
    // 点击加载环境平面图
    changeBuildingMap(val) {
      this.clearCurrentOperatePoint()
      this.UPDATE_OUTDOOR_LAYER_CONFIG({
        key: 'url',
        value: val.point.envImageData.image
      })
      this.setenvironmentalScienceInformation(val.point.envImageData)
      this.setIsMapOuter(2)
      this.setShowFloorInfo(true)
      this.setIsFloorMap(false)
    },
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
    equipmentType(nodeData) {
      let data = JSON.parse(JSON.stringify(nodeData))
      let type // 类型（机构-1,重点部位-2）
      let iconType // 绘制图标类型
      let typeOfing // 机构/重点部位 子类
      if (data.tierType === TREENODETYPE.org) {
        type = DEVICETYPE.org
        data.kind = Number(data.kind)
        // 机构
        // 机构* 1-总行、2-  一级分行、3- 二级分行、4- 直管行、5- 县级行
        if (data.kind === KEYPARTTYPE.headLevel) {
          iconType = 'headOfficeDraw'
          typeOfing = data.kind
        } else if (data.kind === KEYPARTTYPE.oneLevel) {
          iconType = 'tierOneBranchDraw'
          typeOfing = data.kind
        } else if (data.kind === KEYPARTTYPE.twoLevel) {
          iconType = 'secondLevelBranchDraw'
          typeOfing = data.kind
        } else if (data.kind === KEYPARTTYPE.countyLevel) {
          iconType = 'countyLevelDraw'
          typeOfing = data.kind
        } else if (data.kind === KEYPARTTYPE.directlyLevel) {
          iconType = 'directlyBranchDraw'
          typeOfing = data.kind
        }
      } else if (data.tierType === TREENODETYPE.loc) {
        type = DEVICETYPE.keyPart
        // 重点部位类型
        if (data.keyPartType === KEYPARTTYPEORG.businessOutlets) {
          // 营业网点
          iconType = 'businessOutletsDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.vault) {
          // 金库
          iconType = 'vaultDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.computerRoom) {
          // 计算机房
          iconType = 'computerRoomDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.officeBuilding) {
          // 办公楼
          iconType = 'officeBuildingDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.selfServiceBank) {
          // 自助银行
          iconType = 'selfServiceBankDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.selfServiceEquipment) {
          // 自助设备
          iconType = 'selfServiceEquipmentDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.selfServiceSilver) {
          // 自助银亭
          iconType = 'selfServiceSilverDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.privateBank) {
          // 私人银行
          iconType = 'privateBankrDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.safeDeposit) {
          // 保险箱库
          iconType = 'safeDepositDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.archivesCenter) {
          // 档案室
          iconType = 'archivesCenterDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.remoteControlCenter) {
          // 远程监控中心
          iconType = 'remoteControlCenterDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.fiveGSmartBanking) {
          // 5G + 智能银行
          iconType = 'fiveGSmartBankingDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.fortuneCenter) {
          // 财富中心
          iconType = 'fortuneCenterDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.otherKeyParts) {
          // 其他重点部位
          iconType = 'otherKeyPartsDraw'
          typeOfing = data.keyPartType
        } else if (data.keyPartType === KEYPARTTYPEORG.xuni) {
          // 虚拟重点部位
          iconType = 'xuniDraw'
          typeOfing = data.keyPartType
        }
      }
      return {
        type,
        iconType,
        typeOfing
      }
    },
    handleClick(data) { // 机构重点部位树节点点击处理
      console.log('选中的机构/重点部位树节点：', JSON.parse(JSON.stringify(data)))
      this.setDrawActive({ active: false }) // 关闭绘制状态
      this.setSelectedTreeNode(cloneDeep(data)) // 获取当前选中的树节点 点击字段
      this.setSelectedTreeCode(cloneDeep(data)) // 设备树中存的节点
      this.setShowFloorForm(false) // 楼层弹框隐藏
      // 点位未添加 打开绘制工具
      if (!(data && data.point && data.point.id && data.isPoint)) {
        this.setCurrentSelectResource(null) // 清空选中资源
        this.setPanelInfoStatus(false) // 关闭右侧编辑面板
        this.setPanelInfoEditStatus(false) // 控制右侧详情面板是否可编辑
        let equipmentType = this.equipmentType(data)
        const { iconType } = equipmentType
        this.setDrawActive({ active: true, type: GEOMETRYTYPE.POINT, styleType: iconType })
      } else {
        this.setVarNowZoom(data.point.level) //  点击树保存的可见层级
      }
    },
    // 懒加载树接口
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        keyword: params.search
      }
      return getSearchOrgTreeApi(params)
    },
    getLoadingTreeSearch(params) {
      // 懒加载树搜索接口
      return getLoadingTreeSearchApi(params)
    },
    // 设备按钮开关
    filterIconEqu(val) {
      return val.tierType === 'equ'
    },
    // 资源按钮开关
    filterIconRes(val) {
      return val.tierType === 'loc'
    },
    aaa(data, node) {}
  }
}
</script>
<style lang="less" scoped>
/deep/ .treeBox .tree {
  overflow: visible!important;
}
/deep/.activeItem .treeText {
  color: #4887be;
}
/deep/.treeText {
  color: #151515;
}
/deep/ .el-tree {
  background: transparent;
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
.panel-search-content-floor {
   padding: 0 20px;
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
</style>
