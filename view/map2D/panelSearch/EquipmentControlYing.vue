<template>
  <div id="equipmentControl">
    <!-- 设备类型 -->
    <div class="panel-search-content-equipment">
      <PanelSearchDivision
        ref="PanelSearchDivision"
        :imgUrl="'/static/map2d/equipment.png'"
        :label="equipmentLabel"
      ></PanelSearchDivision>
      <ul class="panel-search-content-equipment-list">
        <li
          v-for="(item, index) in equipmentList"
          @click="handleEquipment(item)"
          class="panel-search-content-equipment-item"
          :class="{
            'panel-search-content-equipment-item-active': typeIndex === item.index,
            'float-right': index % 2,
            'float-left': !(index % 2)
          }"
          :key="index"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <!-- 资源列表 -->
    <div class="panel-search-content-resources">
      <PanelSearchDivision
        ref="PanelSearchDivision"
        :imgUrl="'/static/map2d/resources.png'"
        :label="resourcesLabel"
      ></PanelSearchDivision>
    </div>
    <!-- 重点部位，机构树/重点部位机构设备树 -->
    <PanelSearchBoxTreeBox :selectedEquipment="selectItemObj" />
  </div>
</template>

<script>
import PanelSearchDivision from './PanelSearchDivision'
import PanelSearchBoxTreeBox from './PanelSearchBoxTreeBox'
import {
  DEVICETYPE,
  GEOMETRYTYPE,
  VIDEOTYPEKEY,
  ALARMDEVICETYPE,
  INTERCOMTYPE,
  ACCESSDEVICETYPE,
  CABINTYPE
} from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'quipmentControl',
  components: {
    PanelSearchDivision,
    PanelSearchBoxTreeBox
  },
  data() {
    return {
      equipmentLabel: '设备类型',
      resourcesLabel: '资源列表',
      selectedEquipment: '1',
      typeIndex: '1',
      selectItemObj: {
        id: '1',
        label: '摄像机',
        type: 3,
        index: '1'
      }
    }
  },
  computed: {
    ...mapState({
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      boltipcResource: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      redBoltipcResource: ({ map2d }) => map2d.mapPoint.redBoltipcResourceArr, // 红外枪机 资源数组
      halfBallipcResource: ({ map2d }) => map2d.mapPoint.halfBallipcResourceArr, // 半球 资源数组
      fastBallipcResource: ({ map2d }) => map2d.mapPoint.fastBallipcResourceArr, // 球机 资源数组
      allViewipcResource: ({ map2d }) => map2d.mapPoint.allViewipcResourceArr, // 全景 资源数组
      pinholeipcResource: ({ map2d }) => map2d.mapPoint.pinholeipcResourceArr, // 针孔 资源数组
      intelligentipcResource: ({ map2d }) => map2d.mapPoint.smartIPCResourceArr, // 智能IPC 资源数组
      recorderVideoResource: ({ map2d }) => map2d.mapPoint.recorderVideoResourceArr, // 录像机 资源数组
      doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门 资源数组
      commonAlarmResource: ({ map2d }) => map2d.mapPoint.commonAlarmResourceArr, // 报警主机 资源数组
      detectorAlarmResource: ({ map2d }) => map2d.mapPoint.detectorAlarmResourceArr, // 报警探测器 资源数组
      doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists // 资源树
    }),
    ...mapGetters('map2d/mapPanelSearch', ['floorList', 'equipmentList', 'resourceLists']),
    resourceSelectedLists() {
      return this.resourceLists[this.typeIndex]
    }
  },
  methods: {
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode', 'changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setCurrentSelectResource',
      'setEditActive',
      'deleteMapCommonResourcePoint'
    ]),
    handleEquipment(item) {
      this.selectItemObj = item
      this.selectedEquipment = item.id
      this.typeIndex = item.index
    }
    /**
     * 点击树节点
     * 已添加的资源，定位地图中心
     * 未添加的资源，打开鼠标提示，点击后添加点位
     */
    /**
     * 从地图上删除点位
     * 取消对应树节点 active 状态
     * 删除地图上对应要素
     */
  }
}
</script>

<style lang="less">
#equipmentControl {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .active {
    color: #0091ff;
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .el-tree {
    background: none;
  }

  .panel-search-input {
    padding: 10px 20px;
  }

  .panel-search-content-equipment {
    .panel-search-content-equipment-list {
      overflow: hidden;

      .panel-search-content-equipment-item {
        width: 45%;
        text-align: center;
        height: 24px;
        line-height: 24px;
        border: 1px solid rgba(201, 201, 201, 1);
        color: #1e1e1e;
        margin: 0 0 5px 0;
        cursor: pointer;
      }

      .panel-search-content-equipment-item-active {
        background: #0091ff;
      }
    }
  }
}
</style>
