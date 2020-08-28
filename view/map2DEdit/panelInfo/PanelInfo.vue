<template>
  <div id="panelInfo">
    <header class="header">
      <span class="titleName">{{ title }}</span>
      <span class="el-icon-delete-solid header-delete" v-if="isEditPanelTools" @click="deleteResource"></span>
    </header>
    <!-- 右侧设备属性编辑面板 -->
    <!-- 重点部位 -->
    <!-- :is="componentName"  -->
    <!-- :is="currPanelToolComponent" -->
    <component :is="componentName" :isEdit="isEditPanelTools" :valData="selectResourcePoint"></component>
  </div>
</template>
<script>
import PanelInfoImport from './panel/PanelInfoImport'
import VideoRecorder from './panel/VideoRecorder'
import AlarmHost from './panel/AlarmHost'
import WarningDetector from './panel/WarningDetector'
import FireControlHost from './panel/FireControlHost'
import TalkbackHost from './panel/TalkbackHost'
import TalkbackChannel from './panel/TalkbackChannel'
// import AccessControlHost from './panel/AccessControlHost'
// import AccessControlChannel from './panel/AccessControlChannel'
import Airlock from './panel/Airlock'
import PanelCamera from './panel/PanelCamera'
import ProtectiveHost from './panel/ProtectiveHost'
import ProtectiveChannel from './panel/ProtectiveChannel'
import DistrictSetting from './panel/DistrictSetting'
import PanelDistrict from './panel/PanelDistrict'
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  DEVICETYPE,
  INTERCOMTYPE,
  ACCESSDEVICETYPE,
  CABINTYPE
} from 'assets/2DMap/meta/common'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
import { cloneDeep } from 'lodash'

export default {
  name: 'panel-info',
  components: {
    PanelInfoImport,
    VideoRecorder,
    AlarmHost,
    WarningDetector,
    FireControlHost,
    TalkbackHost,
    TalkbackChannel,
    Airlock,
    PanelCamera,
    ProtectiveHost,
    ProtectiveChannel,
    DistrictSetting,
    PanelDistrict
  },
  data() {
    return {
      title: '',
      componentName: ''
    }
  },
  watch: {
    selectResourcePoint: {
      immediate: true,
      handler(val) {
        this.resourceTypeFun(val)
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      boltipcResource: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      headLevelResource: ({ map2d }) => map2d.mapPoint.headLevelResourceArr, // 机构 总行  资源数组
      businessOutletsResource: ({ map2d }) => map2d.mapPoint.businessOutletsResourceArr, // 营业网点 资源数组
      doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门 资源数组
      doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      videoRecorderResource: ({ map2d }) => map2d.mapPoint.videoRecorderResourceArr, // 录像机 资源数组
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists, // 资源树
      selectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前选中的点信息
      currPanelToolComponent: ({ map2d }) => map2d.mapIndex.currPanelToolComponent
    }),
    ...mapGetters('map2d/mapIndex', ['isShowPanelTools', 'setIsMapEdit']),
    ...mapGetters('map2d/mapPanelSearch', ['selectedTreeCode']),
    ...mapGetters('map2d/mapIndex', ['isEditPanelTools'])
  },
  mounted() {
    this.resourceTypeFun(this.selectResourcePoint)
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setCurrPanelToolComponent',
      'setRefreshTreeList',
      'setRefreshTreeListBox'
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree', 'setSelectedTreeCode']),
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'deleteMapCommonResourcePoint', // 删除设备点位
      'deleteMapCommonOrgKeyPartId', // 删除机构重点部位点位
      'setCurrentSelectResource'
    ]),

    /**
     * 从地图上删除点位
     * 取消对应树节点 active 状态
     * 删除地图上对应要素
     */
    // 当是编辑的时候  关闭
    close() {
      this.setPanelInfoStatus(false)
    },
    deleteResource() {
      this.$confirm('是否删除该点位', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          let { id, type, subType } = this.selectResourcePoint
          // ids.push('2561','2562','2563','2564','2565')
          ids.push(id)
          // 删除机构重点部位
          if (type === DEVICETYPE.org || type === DEVICETYPE.keyPart) {
            this.deleteMapCommonOrgKeyPartId(id).then(res => {
              if (!res.code) {
                this.setRefreshTreeListBox(true) // 刷新设备树
                this.setRefreshTreeList(true) // 刷新机构重点部位树
                this.setPanelInfoStatus(false) // 关闭右侧详情面板

                this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
                this.setCurrentSelectResource(null) // 清空选中的点位资源数据
                this.deletePointFromResourceArr(id, type, subType) // 从vuex点位数据数组中删除点位数据
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
          } else {
            this.deleteMapCommonResourcePoint(ids).then(res => {
              if (!res.code) {
                this.setRefreshTreeListBox(true) // 刷新设备树
                this.setRefreshTreeList(true) // 刷新机构重点部位树
                this.setPanelInfoStatus(false) // 关闭右侧详情面板
                this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
                this.setCurrentSelectResource(null) // 清空选中的点位资源数据
                this.deletePointFromResourceArr(id, type, subType) // 从vuex点位数据数组中删除点位数据
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 从vuex点位数据数组中删除点位数据
     * id 删除点位的id
     * type 删除点位的大类
     * subType 删除点位的子类
    */
    deletePointFromResourceArr(id, type, subType) {
      let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
      let pointTypeValue = pointTypeData[pointTypeKey]
      if (pointTypeValue && this.$store.state.map2d.mapPoint[pointTypeValue + 'ResourceArr']) {
        let resourceArr = cloneDeep(this.$store.state.map2d.mapPoint[pointTypeValue + 'ResourceArr'])
        resourceArr = resourceArr.filter(item => { return item.id !== id }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
        this.setPointResourceByType({ type: pointTypeValue, arr: resourceArr })
      }
    },
    resourceTypeFun(val) {
      if (!val) {
        return
      }
      const subType = Number(val.subType)
      switch (val.type) {
        case DEVICETYPE.videoHost:
          this.title = '录像机'
          break
        case DEVICETYPE.alarmDevice:
          // 当前只判断了2类，其他的18类后续添加
          this.title = '报警设备'
          break
        case DEVICETYPE.fireDevice:
          this.title = '消防设备'
          break
        case DEVICETYPE.intercomDevice:
          if (subType === INTERCOMTYPE.speechChannel) {
            this.title = '对讲通道'
          } else if (subType === INTERCOMTYPE.speechHost) {
            this.title = '对讲主机'
          }
          this.title = '对讲设备' // 只显示大类
          break
        case DEVICETYPE.accessControlDevice:
          if (subType * 1 === ACCESSDEVICETYPE.doorControlHost) {
            this.title = '门禁主机'
          } else if (subType * 1 === ACCESSDEVICETYPE.doorControlChannel) {
            this.title = '门禁通道'
          } else if (subType * 1 === ACCESSDEVICETYPE.doubleDoor) {
            this.title = '互锁门通道'
          } else if (subType * 1 === ACCESSDEVICETYPE.doubleDoorChannel) {
            this.title = '互锁门主机'
          }
          this.title = '门禁设备' // 只显示大类
          break

        case DEVICETYPE.video:
          this.title = '摄像机'
          break
        case DEVICETYPE.cabin:
          if (subType === CABINTYPE.cabinHost) {
            this.title = '防护舱主机'
          } else if (subType === CABINTYPE.cabinChannel) {
            this.title = '防护舱通道'
          }
          this.title = '防护舱' // 只显示大类
          break
        case DEVICETYPE.org:
          this.title = '机构'
          break
        case DEVICETYPE.keyPart:
          this.title = '重点部位'
          break
      }
      this.componentName = PanelInfoImport
    }
  },
  created() {
    this.resourceTypeFun(this.selectResourcePoint)
  }
}
</script>
<style lang="less" scoped>
#panelInfo {
  height: 100%;
  overflow-y: auto;
  padding: 0 17px 0 20px;
  box-shadow:1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  .header {
    height: 30px;
    width: 300px;
    border-bottom: 1px solid #E1E1E1;
    line-height: 24px;
    font-size: 14px;
    position: relative;
    margin-top: 10px;
    .titleName {
      border-left: 2px solid #2d72d3;
      padding-left: 8px;
    }

    .header-delete {
      position: absolute;
      right: 0;
      top: 5px;
      cursor: pointer;
    }
    .header-close {
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
    .header-delete:hover {
      color: #2d72d3;
    }
  }
}
</style>
