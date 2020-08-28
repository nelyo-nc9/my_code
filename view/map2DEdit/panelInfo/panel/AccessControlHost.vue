<!--
 * @Description: 门禁主机面板
 * @Author: anli
 * @Date: 2020-05-25 11:09:39
 * @LastEditTime: 2020-05-25 12:01:24
 * @LastEditors: anli
-->

<template>
  <div id="AccessControlHost">
    <div class="access-control-content">
      <table class="table">
        <tr class="table-item">
          <td class="table-item-label">设备名称</td>
          <td>{{valData.device.name}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">地址</td>
          <td>
            <span class="table-item-ip">{{valData.device.ip}}</span>
            <el-button type="primary" size="mini" @click="handlerPing(valData.device.ip)">ping</el-button>
          </td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">主机类型</td>
          <td>{{valData.device.type}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">品牌</td>
          <td>{{valData.device.brand}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">型号</td>
          <td>{{valData.device.modelNum}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属平台</td>
          <td>{{valData.device.platformName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属子系统</td>
          <td>{{valData.device.subsystem}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属机构</td>
          <td>{{valData.device.orgName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">所属重点部位</td>
          <td>{{valData.device.keyPartName}}</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">状态</td>
          <td v-if="valData.device.status === 1">在线</td>
          <td v-else>离线</td>
        </tr>
        <tr class="table-item">
          <td class="table-item-label">可见层级</td>
          <td>{{this.visibleLevel}}</td>
        </tr>
      </table>
    </div>
    <div class="bottom_btn">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="ok">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import PanelInfoFun from './PanelInfoFun'
export default {
  name: 'AccessControlHost',
  mixins: [PanelInfoFun],
  data() {
    return {
      organizationInfo: {
        name: '名称',
        ip: '192.168.22.56',
        type: '类型',
        brand: '品牌',
        model: '型号',
        platform: '平台',
        subsystem: '子系统',
        keyParts: '重点部位',
        org: '机构',
        status: '状态',
        level: '1'
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    valData: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      isMapEdit: ({ map2d }) => map2d.mapIndex.isMapEdit
    }),
    // 可见层级
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    },
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
    /**
     * @description: 保存门禁主机点位信息
     * @param {String}
     */
    ok() {
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
    },
    /**
     * @description: 取消门禁主机点位修改信息
     * @param {String}
     */
    cancel() {
      this.closePanelInfo()
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 打开平面编辑
    }
  }
}
</script>

<style lang="less" scoped>
  #AccessControlHost {
    height: calc(~"100% - 34px");
    min-height: calc(~"100% - 34px");
    position: relative;
    .access-control-content {
      min-height: calc(~"100% - 30px");
      padding: 0 0 20px 0;
      .table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e6e6e6;
        border-bottom: none;

        .table-item {
          height: 30px;
          line-height: 30px;
          width: 100%;
          border-bottom: 1px solid #e6e6e6;
          text-align: center;

          .table-item-label {
            width: 80px;
            border-right: 1px solid #e6e6e6;
          }

          .table-item-ip {
            display: inline-block;
            width: 138px;
            height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
    }

    .bottom_btn {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
