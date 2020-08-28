<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-readonly">
        <table style="border-collapse:collapse;">
          <tr><td>对讲通道名称</td><td>   <span class="value" v-if="curSelectResourcePoint.name">{{ curSelectResourcePoint.name }}</span></td></tr>
          <tr><td>通道号</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.serise">{{ curSelectResourcePoint.resource.serise }}</span></td></tr>
          <tr><td>通道类型</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.type">{{ curSelectResourcePoint.resource.type }}</span></td></tr>
          <tr><td>所属主机</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.deviceName">{{ curSelectResourcePoint.resource.deviceName }}</span></td></tr>
          <tr><td>所属平台</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.platformName">{{ curSelectResourcePoint.resource.platformName }}</span></td></tr>
          <tr><td>所属子系统</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.name">{{ curSelectResourcePoint.resource.subs }}</span></td></tr>
          <tr><td>所属机构</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.orgName">{{ curSelectResourcePoint.resource.orgName }}</span></td></tr>
          <tr><td>所属重点部位</td><td>  <span class="value" v-if="curSelectResourcePoint.resource.keyPartName ">{{ curSelectResourcePoint.resource.keyPartName }}</span></td></tr>
          <tr><td>状态</td><td>  <span class="value" v-if="curSelectResourcePoint.resource.status">{{ curSelectResourcePoint.resource.status }}</span></td></tr>
          <tr><td>可见层级</td><td>   {{ this.visibleLevel }}</td></tr>
        </table>
      </div>
    </div>
      <div class="panel-info-btn">
        <el-row>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitSave">保 存</el-button>
        </el-row>
      </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  /* mixins: [AttrInfo, seatListFun], */
  data() {
    return {
      isFinder: false,
      tempName: '',
      isLayout: true,
      tempId: ''
      //   visibleLevel: ''

    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      curSelectResourcePoint: ({ map2d }) =>
        map2d.mapPoint.curSelectResourcePoint
          ? map2d.mapPoint.curSelectResourcePoint
          : { name: '',
            level: '',
            resource: {
              brand: '',
              serise: '',
              type: '',
              deviceName: '',
              modelNum: '',
              platformName: '',
              orgName: '',
              keyPartName: ''

            }
          },
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc // 修改的点位位置
    }),

    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    }
  },
  watch: {

  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setPanelInfoFormData',
      'setDrawActive',
      'setIsMapOuter',
      'setIsFloorMap',
      'setShowFloorInfo', 'setRefreshTreeList'
    ]),
    ...mapActions('map2d/mapPoint', [
      'addFloorAKey',
      'getAllFloorAKey',
      'deleteFloorAKey',
      'getAllFloorAKey',
      'setPointIconFeatures',
      'setAreaDrawActive',
      'setAreaDrawLoc',
      'updateMapCommonResourcePoint',
      'getCommonResourceById',
      'getCommonResourceById',
      'setCurrentSelectResource'
    ]), // 修改地图设备点位
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']), // 楼内平面图 环境平面图
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES']), // 取消按钮
    cancel() {
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 打开平面编辑
    },
    // 保存按钮
    submitSave() {
      let curSelectPoint
      // console.log(this.valData)
      curSelectPoint = cloneDeep(this.curSelectResourcePoint)
      let drawFeatureLoc = cloneDeep(this.drawFeatureLoc)
      // 当前可见层级
      curSelectPoint.level = Number(this.visibleLevel)
      curSelectPoint.shapeType = Number(this.importForm.shapeType) // 缩略图形态
      console.log(curSelectPoint, this.curSelectResourcePoint)
      let endResult = { ...cloneDeep(this.curSelectResourcePoint), ...curSelectPoint }
      if (
        (curSelectPoint.coordinate.split(',').length === 2 && curSelectPoint.shapeType !== SHAPETYPE.POINT) ||
        (curSelectPoint.coordinate.split(',').length > 2 && curSelectPoint.shapeType === SHAPETYPE.POINT)
      ) {
        alert('当前绘制未结束，请结束绘制再保存！')
        return
      }
      if (this.isSaveOver) { return }
      this.isSaveOver = true
      // 修改点位接口
      this.updateMapCommonResourcePoint(endResult)
        .then(res => {
          this.isSaveOver = false
          if (!res.code) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.setRefreshTreeList(true) // 强制刷新机构重点部位树
            this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
            this.setCurrentSelectResource(null) // 清空选中的点位资源数据
            this.setPanelInfoStatus(false) // 关闭点位信息面板
            this.setAreaDrawActive(false) // 关闭区域绘制
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            message: '保存失败',
            type: 'error'
          })
          this.isSaveOver = false
        })
    }

  }
}
</script>
<style lang="less" scoped>
.organize-info-readonly,.organize-info-form,.organize-info-add{
      margin-top: 6px;
      box-sizing: border-box;
      table{
        width: 100%;
        td{
          &:first-child{
            background-color: #f8f8f8;
          }
          border: 1px solid #f2f2f2;
          background-color: #fff;
        }
      }
      td{
        &:first-child{
          width: 90px;
          text-align: center;
        }
        height: 33px;
        padding: 0 6px;
        line-height: 32px;
        box-sizing: border-box;
      }
    }
    .panel-info-btn {
    width: 300px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: rgba(51, 51, 51, 0.4);
  }

</style>
