<!--
 * @Description: 机构重点部位设备资源树
 * @Author: zuoshaohua
 * @Date: 2020-07-01 11:57:43
 * @LastEditTime: 2020-07-01 11:57:43
 * @LastEditors: zuoshaohua
-->

<template>
  <div class="treeBoxCentent">
    <!-- 机构重点部位设备资源树 -->
    <treeBox
      v-if="treeToogle !== 0"
      :lazyTreeApi="getTreeApi"
      :treeType="treeType"
      :showSlotIcon='true'
      :lazyTreeSearchApi="getLazyTreeSearchApi"
      :customizeQuery="customizeQuery"
      searchType="search"
      @onceClick="handleTreeClick"
      treeLazyToggle
      ref="insidetree"
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
    </treeBox>
  </div>
</template>
<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getSearchTreeApi } from '@src/http/map2D/index.js'
import eventCtrl from '../baseMap/ctrl/event'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
import {
  GEOMETRYTYPE,
  DEVICETYPE,
  TREENODETYPE,
  ACCESSDEVICETYPE,
  EnglishNamePrefix,
  INTERCOMTYPE,
  CABINTYPE,
  EQUIPMENTLABEL
} from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  mixins: [eventCtrl],
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
          isRecursion: '0'
        }
      }
    }
  },
  props: {
    selectedEquipment: { type: Object }
  },
  components: { treeBox },
  computed: {
    ...mapState({
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 存在vuex中获取的机构重点部位树信息
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr // 机构 资源数组
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus', 'isMapEdit']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setRefreshTreeListBox', 'setindoorInformation']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode', 'setSelectedTreeCode']),
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    ...mapActions('map2d/mapPoint', ['setCurrentSelectResource', 'setEditActive', 'getCommonResourceById']),
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
    // 用来控制地图上添加点位的图标
    equipmentType2(data) {
      // data.pointSubType=13 //-shen开发赋值
      const field = data.pointSubType
      let result
      if (field !== undefined) {
        result = EnglishNamePrefix[String(data.pointType)][String(data.pointSubType)]
      }
      // 设备树点击后，地图图标判断-shen
      let iconType // 绘制图标类型
      iconType = result + 'Draw'
      return {
        iconType
      }
    },
    // 用来控制地图上添加点位的图标
    equipmentType(data) {
      // 设备树点击后，地图图标判断-shen
      let iconType // 绘制图标类型
      let type = data.pointType
      let subtype = data.pointSubType * 1
      if (type === DEVICETYPE.video) {
        iconType = this.equipmentType2(data).iconType
      } else if (type === DEVICETYPE.videoHost) {
        // 视频主机录像机
        iconType = this.equipmentType2(data).iconType
      } else if (type === DEVICETYPE.alarmDevice) {
        // 报警设备
        iconType = this.equipmentType2(data).iconType
      } else if (type === DEVICETYPE.fireDevice) {
        // 消防设备
        iconType = this.equipmentType2(data).iconType
      } else if (type === DEVICETYPE.intercomDevice) {
        // 对讲设备
        if (subtype === INTERCOMTYPE.speechHost) {
          // 对讲主机
          iconType = 'intercomHostDraw'
        } else if (subtype === INTERCOMTYPE.speechChannel) {
          // 对讲通道
          iconType = 'intercomChannelDraw'
        }
      } else if (type === DEVICETYPE.accessControlDevice) {
        // 门禁设备
        if (subtype === ACCESSDEVICETYPE.doorControlHost) {
          // 门禁主机
          iconType = 'accessHostDraw'
        } else if (subtype === ACCESSDEVICETYPE.doorControlChannel) {
          // 门禁通道
          iconType = 'accessChannelDraw'
        } else if (subtype === ACCESSDEVICETYPE.doubleDoorChannel) {
          // 互锁门主机
          iconType = 'doubleDoorChannelDraw'
        } else if (subtype === ACCESSDEVICETYPE.doubleDoor) {
          // 互锁门通道
          iconType = 'LockDoorDraw'
        }
      } else if (type === DEVICETYPE.cabin) {
        // 防护舱设备
        if (subtype === CABINTYPE.cabinHost) {
          iconType = 'protectedCabinHostDraw'
        } else if (subtype === CABINTYPE.cabinChannel) {
          iconType = 'protectedCabinChannelDraw'
        }
      }
      return {
        iconType
      }
    },
    handleTreeClick(data, node) { // 点击设备资源树节点
      console.log('点击到的设备资源树节点：', JSON.parse(JSON.stringify(data)))
      // console.log('点击到的设备资源树节点：', data.pointType, data.pointSubType)
      if (data) {
        this.setDrawActive({ active: false }) // 关闭绘制状态
        let targetNodeParam = this.setSelectedEquipmentTreeCode(data) // 设置选中的设备树节点，返回数据 isTargetNode：点击的树节点是否与选中资源对应
        if (targetNodeParam.isValid) { // 点击的树节点（设备、资源）类型是有效时（类型在地图定义的范围内）
          if (targetNodeParam.isTargetNode) { // 点击的树节点与选中资源对应时
            if (!(data.isPoint && data.point && data.point.id)) { // 点位未添加时
              this.setCurrentSelectResource(null) // 清空选中资源
              this.setPanelInfoStatus(false) // 关闭右侧编辑面板
              this.setPanelInfoEditStatus(false) // 控制右侧详情面板是否可编辑
              let equipmentType = this.equipmentType(data) // 获取设备类型相关参数
              const { iconType } = equipmentType
              this.setDrawActive({ active: true, type: GEOMETRYTYPE.POINT, styleType: iconType }) // 打开绘制工具
            }
          }
        } else {
          this.$notify({ title: '警告',
            message: '设备资源类型不规范，无法进行点位添加操作',
            type: 'warning'})
        }
      }
    },
    /**
     * 设置选中的设备树节点
     * @param {*} node 选中的树节点
     * @return {*} isTargetNode 点击的树节点是否与选中资源对应
     */
    setSelectedEquipmentTreeCode(data) {
      // console.log('点击到的设备资源树节点：', JSON.parse(JSON.stringify(data)))
      // console.log('选中的资源列表类型：', JSON.parse(JSON.stringify(this.selectedEquipment)))
      let isTargetNode = false // 点击的树节点是否与选中资源对应
      let isValid = false // 点击的树节点（设备、资源）类型是否有效（类型是否是地图定义的范围内）
      let { label } = this.selectedEquipment
      let { pointType, pointSubType } = data
      pointType = Number(pointType)
      pointSubType = Number(pointSubType)
      if (pointType && pointSubType) {
        let pointTypeKey = pointType === DEVICETYPE.videoHost ? `${pointType}` : `${pointType}-${pointSubType}`
        isValid = pointTypeData.hasOwnProperty(pointTypeKey)
      }
      if (label === EQUIPMENTLABEL.video) {
        // 摄像机
        isTargetNode = pointType === DEVICETYPE.video
      } else if (label === EQUIPMENTLABEL.videoHost) {
        // 录像机
        isTargetNode = pointType === DEVICETYPE.videoHost
      } else if (label === EQUIPMENTLABEL.alarmDevice) {
        // 报警设备
        isTargetNode = pointType === DEVICETYPE.alarmDevice
      } else if (label === EQUIPMENTLABEL.fireDevice) {
        // 消防设备
        isTargetNode = pointType === DEVICETYPE.fireDevice
      } else if (label === EQUIPMENTLABEL.intercomDevice) {
        // 对讲设备
        isTargetNode = pointType === DEVICETYPE.intercomDevice
      } else if (label === EQUIPMENTLABEL.accessControlDevice) {
        // 门禁设备
        isTargetNode =
          pointType === DEVICETYPE.accessControlDevice &&
          [ACCESSDEVICETYPE.doorControlHost, ACCESSDEVICETYPE.doorControlChannel].includes(pointSubType)
      } else if (label === EQUIPMENTLABEL.accessLockDoorDevice) {
        // 互锁门
        isTargetNode =
          pointType === DEVICETYPE.accessControlDevice &&
          [ACCESSDEVICETYPE.doubleDoor, ACCESSDEVICETYPE.doubleDoorChannel].includes(pointSubType)
      } else if (label === EQUIPMENTLABEL.cabin) {
        // 防护舱
        isTargetNode = pointType === DEVICETYPE.cabin
      }
      isTargetNode && this.setSelectedTreeCode(JSON.parse(JSON.stringify(data))) // 设备树中存的节点
      return {isTargetNode, isValid}
    },
    getTreeApi(customizeQuery) {
      if (
        !customizeQuery.hasOwnProperty('oId') &&
        !customizeQuery.hasOwnProperty('kpId') &&
        !customizeQuery.hasOwnProperty('dId')
      ) {
        if (this.selectedTreeNode.tierType === TREENODETYPE.org) {
          customizeQuery.oId = this.selectedTreeNode.serial
        } else if (this.selectedTreeNode.tierType === TREENODETYPE.loc) {
          customizeQuery.kpId = this.selectedTreeNode.id
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
  },
  watch: {
    // 监听树添加删除点位时候刷新
    '$store.state.map2d.mapIndex.refreshTreeListBox'(newValue, oldValue) {
      if (newValue) {
        this.$refs.insidetree.insideRefreshs()
        // this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
        this.setRefreshTreeListBox(false)
      }
    },
    selectedEquipment: {
      deep: true,
      immediate: true,
      handler: function(newValue, oldValue) {
        console.log(newValue, oldValue)
        //
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
    selectedTreeNode: {
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
        // console.log('customizeQuery', { ...val })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.activeItem .treeText {
  color: #4887be;
}
/deep/.treeText {
  color: #151515;
}
// .treeBoxCentent {
//   height: 594px;
//   background: transparent;
// }
/deep/ .treeBox .treeInfo {
  &[name='equ'] span.treeText {
    max-width: calc(~'100% - 94px');
  }
  &[name='res'] span.treeText {
    max-width: calc(~'100% - 58px');
  }
}
/deep/ .treeBox {
  .tree {
    overflow: visible;
  }
}
/deep/.el-tree-node__content{
  border-left:0
}
</style>
