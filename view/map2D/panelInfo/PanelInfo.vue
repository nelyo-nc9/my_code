<template>
  <div id="panelInfo">
    <!-- <header class="header">
      <span>{{ title }}</span>
      <span class="el-icon-close  header-close"  @click="close"  ></span>
    </header> -->
    <!-- 右侧设备属性编辑面板 -->
    <component :is="componentName" :valData="selectResourcePoint"></component>
  </div>
</template>
<script>
import PanelInfoImport from './panel/PanelInfoImport'
import DistrictSetting from './panel/DistrictSetting'
import PanelDistrict from './panel/PanelDistrict'
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  DEVICETYPE,
  ALARMDEVICETYPE,
  INTERCOMTYPE,
  ACCESSDEVICETYPE,
  CABINTYPE,
  KEYPARTTYPE,
  KEYPARTTYPEORG
} from 'assets/2DMap/meta/common'
export default {
  name: 'panel-info',
  components: {
    PanelInfoImport,
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
      handler(val) {
        this.resourceTypeFun(val)
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      nowSelectRealtionInfo: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 获取的关联设备的对象
      boltipcResource: ({ map2d }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      headLevelResource: ({ map2d }) => map2d.mapPoint.headLevelResourceArr, // 机构 总行  资源数组
      businessOutletsResource: ({ map2d }) => map2d.mapPoint.businessOutletsResourceArr, // 营业网点 资源数组
      doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门 资源数组
      doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      recorderVideoResource: ({ map2d }) => map2d.mapPoint.recorderVideoResourceArr, // 录像机 资源数组
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists, // 资源树
      selectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前选中的点信息
      currPanelToolComponent: ({ map2d }) => map2d.mapIndex.currPanelToolComponent
    }),
    ...mapGetters('map2d/mapIndex', ['isShowPanelTools', 'setIsMapEdit']),
    ...mapGetters('map2d/mapPanelSearch', ['selectedTreeNode']),
    ...mapGetters('map2d/mapIndex', ['isEditPanelTools'])
  },
  mounted() {
    this.resourceTypeFun(this.selectResourcePoint)
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setCurrPanelToolComponent']),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    ...mapActions('map2d/mapPoint', ['setPointResourceByType', 'deleteMapCommonResourcePoint']),

    /**
     * 从地图上删除点位
     * 取消对应树节点 active 状态
     * 删除地图上对应要素
     */
    // 当是编辑的时候  关闭
    close() {
      this.setPanelInfoStatus(false)
    },
    resourceTypeFun(val) {
      if (!val) {
        return
      }
      this.componentName = PanelInfoImport
    }
  }
}
</script>
<style lang="less" scoped>
#panelInfo {
  height: 100%;
  overflow-y: auto;
  padding: 15px 20px;
  background:rgba(255,255,255,0.95);
box-shadow:1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  .header {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    margin-bottom: 10px;
    position: relative;

    .header-delete {
      position: absolute;
      right: 10px;
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
