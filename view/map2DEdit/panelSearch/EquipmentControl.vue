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
      <!-- <el-tree :data="resourceSelectedLists" default-expand-all @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }" :class="{ active: data.id === data.activeId }">
          <span>{{ node.label }}</span>
          <span
            v-if="data.id === data.activeId"
            class="el-icon-delete-solid"
            @click.stop="() => deleteResource(node, data)"
          >
          </span>
        </span>
      </el-tree> -->
    </div>
    <!-- 设备资源懒加载树 -->
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
      selectedEquipment: '0',
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
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      boltipcResource: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      redBoltipcResource: ({ map2d }) => map2d.mapPoint.redBoltipcResourceArr, // 红外枪机 资源数组
      halfBallipcResource: ({ map2d }) => map2d.mapPoint.halfBallipcResourceArr, // 半球 资源数组
      fastBallipcResource: ({ map2d }) => map2d.mapPoint.fastBallipcResourceArr, // 球机 资源数组
      allViewipcResource: ({ map2d }) => map2d.mapPoint.allViewipcResourceArr, // 全景 资源数组
      pinholeipcResource: ({ map2d }) => map2d.mapPoint.pinholeipcResourceArr, // 针孔 资源数组
      smartIPCResource: ({ map2d }) => map2d.mapPoint.smartIPCResourceArr, // 智能IPC 资源数组
      videoRecorderResource: ({ map2d }) => map2d.mapPoint.videoRecorderResourceArr, // 录像机 资源数组
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
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode', 'changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setCurrentSelectResource',
      'setEditActive',
      'deleteMapCommonResourcePoint'
    ]),
    handleEquipment(item) {
      console.log(item)
      this.setDrawActive({ active: false })
      this.selectItemObj = item
      this.selectedEquipment = item.id
      this.typeIndex = item.index
    },
    /**
     * 点击树节点
     * 已添加的资源，定位地图中心
     * 未添加的资源，打开鼠标提示，点击后添加点位
     */
    handleNodeClick(data, node, ev) {
      if (!data.isParentNode) {
        this.setSelectedTreeCode(data) // 获取当前选中的树节点 点击字段
        this.setPanelInfoStatus(false) // 关闭右侧编辑面板
        this.setPanelInfoEditStatus(false) // 控制右侧详情面板是否可编辑
        if (!this.selectedTreeCode.activeId) {
          // 点位未添加
          // 打开绘制工具
          const styleType = this.getIconStyleType(data.type, data.monitype).style
          if (data.surface === '1') {
            // surface：1 点位添加
            this.setDrawActive({ active: true, type: GEOMETRYTYPE.POINT, styleType: styleType })
          } else if (data.surface === '2') {
            // surface：2 线位添加
            this.setDrawActive({ active: true, type: GEOMETRYTYPE.POLYLINE, styleType: styleType })
          } else if (data.surface === '3') {
            // surface：1 面位添加
            this.setDrawActive({ active: true, type: GEOMETRYTYPE.POLYGON, styleType: styleType })
          }
        } else if (this.selectedTreeCode.point && this.selectedTreeCode.point.loc) {
          // 点位已添加
          // 设置当前选中资源信息
          this.setCurrentSelectResource('设置当前选中资源信息' + data)
          // 定位地图中心
          const loc = this.selectedTreeCode.point.loc.split(',').map(item => Number(item))
          window.$context2D.map.getView().setCenter(loc)
        }
      }
    },
    /**
     * 从地图上删除点位
     * 取消对应树节点 active 状态
     * 删除地图上对应要素
     */
    deleteResource(node, data) {
      const ids = [data.id]
      this.deleteMapCommonResourcePoint(ids).then(res => {
        console.log('删除设备点位', res)
      })
      // 删除 data 对应资源数组中的值
      const info = this.getIconStyleType(data.monitype)
      const key = info.key
      const resourceCopy = info.resource
      const resource = []
      resourceCopy.map(item => {
        if (item.id !== data.id) {
          resource.push(item)
        }
      })
      console.log(resource)
      this.setPointResourceByType({ type: info.type, arr: resource })
      // 修改资源树的数据，取消高亮显示
      const tree = this.resourceTree[key]
      const treeCopy = JSON.parse(JSON.stringify(tree))
      treeCopy[0].children.map(item => {
        if (item.id === data.id) {
          item.activeId = ''
          delete item.loc
        }
      })
      this.changeResourceTree({ type: key, arr: treeCopy })
    },
    /**
     * 判断点击设备树的类型，返回相应的参数
     * @param {*} monitype RESOURCETYPE中对应的资源类型
     */
    getIconStyleType(type, monitype) {
      let style = 'boltipc' // 设置鼠标样式 对应drawStyle.js文件中的key值
      let key = '1' // 资源类型的key值 对应RESOURCETYPE
      let resourceType = 'boltipc' // 设置资源数组类型
      let resource // 需要修改的资源数组
      if (type === DEVICETYPE.video) {
        key = '1'
        if (monitype === VIDEOTYPEKEY.boltipc) {
          style = resourceType = 'boltipc'
        } else if (monitype === VIDEOTYPEKEY.redBoltipc) {
          style = resourceType = 'redBoltipc'
        } else if (monitype === VIDEOTYPEKEY.halfBallipc) {
          style = resourceType = 'halfBallipc'
        } else if (monitype === VIDEOTYPEKEY.fastBallipc) {
          style = resourceType = 'fastBallipc'
        } else if (monitype === VIDEOTYPEKEY.allViewipc) {
          style = resourceType = 'allViewipc'
        } else if (monitype === VIDEOTYPEKEY.pinholeipc) {
          style = resourceType = 'pinholeipc'
        } else if (monitype === VIDEOTYPEKEY.smartIPC) {
          style = resourceType = 'smartIPC'
        }
      } else if (type === DEVICETYPE.keyPart) {
        style = 'importPartDraw'
        key = '1'
        resourceType = 'importPart'
      } else if (type === DEVICETYPE.videoRecorder) {
        style = 'commonAlarm'
        key = '2'
        resourceType = 'videoRecorder'
      } else if (type === DEVICETYPE.commonAlarm) {
        // 当前只判断了2类，其他的18类后续添加
        if (monitype === ALARMDEVICETYPE.telephoneHost) {
          style = 'commonAlarm'
          key = '3'
          resourceType = 'commonAlarm'
        } else if (monitype === ALARMDEVICETYPE.networkHost) {
          style = 'alarmHost'
          key = '3'
          resourceType = 'commonAlarm'
          resource = this.detectorAlarmResource
        }
      } else if (type === DEVICETYPE.fireAlarm) {
        style = 'boltipc'
        key = '4'
      } else if (type === DEVICETYPE.speech) {
        if (monitype === INTERCOMTYPE.speechHost) {
          style = 'speechDraw'
          resourceType = 'speech'
          key = '5'
        } else if (monitype === INTERCOMTYPE.speechChannel) {
          style = 'speechDraw'
          resourceType = 'speechChannel'
          key = '5'
        }
      } else if (type === DEVICETYPE.doubleDoor) {
        style = 'doubleDoorDraw'
        key = '7'
        resourceType = 'doubleDoor'
      } else if (type === DEVICETYPE.doorControl) {
        if (monitype === ACCESSDEVICETYPE.doorControlHost) {
          style = 'doorControlDraw'
          key = '6'
          resourceType = 'doorControl'
        } else if (monitype === ACCESSDEVICETYPE.doorControlChannel) {
          style = 'doorControlDraw'
          key = '6'
          resourceType = 'doorControlChannel'
        }
      } else if (type === DEVICETYPE.protectiveTank) {
        if (monitype === CABINTYPE.doorControlHost) {
          style = 'boltipc'
          key = '8'
        } else if (monitype === CABINTYPE.doorControlChannel) {
          style = 'boltipc'
          key = '8'
        }
      }
      resource = resource
        ? JSON.parse(JSON.stringify(resource))
        : JSON.parse(JSON.stringify(this[resourceType + 'Resource']))
      return {
        style,
        key,
        resource: resource,
        type: resourceType
      }
    }
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
