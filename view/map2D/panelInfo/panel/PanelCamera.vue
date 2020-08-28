<template>
  <div class="right-panel">
    <div class="right-panel-info">
      <div class="camera-info">
        <div class="camera-info-readonly">
          <table style="border-collapse:collapse;">
            <tr>
              <td>设备名称</td>
              <td>{{deviceCameraInfo.name}}</td>
            </tr>
            <tr>
              <td>IP地址</td>
              <td >{{deviceCameraInfo.ip}}</td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td>{{deviceCameraInfo.type}}</td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{{deviceCameraInfo.brand}}</td>
            </tr>
            <tr>
              <td>型号</td>
              <td>{{deviceCameraInfo.model}}</td>
            </tr>
            <tr>
              <td>所属子系统</td>
              <td>{{deviceCameraInfo.system}}</td>
            </tr>
            <tr>
              <td>所属机构</td>
              <td>{{deviceCameraInfo.mechanism}}</td>
            </tr>
            <tr>
              <td>所属重点部位</td>
              <td>{{deviceCameraInfo.part}}</td>
            </tr>
            <tr>
              <td>是否停用</td>
              <td>{{deviceCameraInfo.deactivate}}</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{deviceCameraInfo.status}}</td>
            </tr>
            <tr>
              <td>可见层级</td>
              <td>{{deviceCameraInfo.level}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import { VIDEOTYPEKEY } from 'assets/2DMap/meta/common'
export default {
  name: 'panel-info',
  data() {
    return {
      disabled: true, // 输入框的禁用状态
      panelTitle: '摄像机',
      deviceCameraInfo: this.valData,
      // deviceCameraInfo: {
      //   name: '设备名称', // 设备名称
      //   ip: 'ping', // ip
      //   type: '类型', // 类型
      //   brand: '品牌', // 品牌
      //   model: '型号', // 型号
      //   system: '子系统', // 子系统
      //   mechanism: '机构', // 机构
      //   part: '所属重点部位', // 部位
      //   deactivate: '是否停用', // 是否停用
      //   status: '状态', // 状态
      //   level: '层级' // 层级
      // },
      // 摄像机表单对象
      pointData: {
        radiation: 50,
        viewshed: 90,
        viewshedAngle: 0
      },
      boltipcLayer: layerConfig.boltipcIcon, // 枪机
      boltipcSectorLayer: layerConfig.boltipcSector, // 枪机可视域
      redBoltipcLayer: layerConfig.redBoltipcIcon, // 红外枪机
      redBoltipcSectorLayer: layerConfig.redBoltipcSector, // 红外枪机可视域
      halfBallipcLayer: layerConfig.halfBallipcIcon, // 半球
      halfBallipcSectorLayer: layerConfig.halfBallipcSector, // 半球可视域
      fastBallipcLayer: layerConfig.fastBallipcIcon, // 快球
      fastBallipcSectorLayer: layerConfig.fastBallipcSector, // 快球可视域
      allViewipcLayer: layerConfig.allViewipcIcon, // 全景
      allViewipcSectorLayer: layerConfig.allViewipcSector // 全景可视域
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    valData: {
      type: Object
    }
  },
  watch: {
    curSelectResourcePoint() {
      this.setVideoEditSectorChecked(false)
      this.initCurrentResource()
    }
  },
  mounted() {
    this.initCurrentResource()
  },
  computed: {
    ...mapState({
      isMapEdit: ({ map2d }) => map2d.mapIndex.isMapEdit, // 保存 取消 是否显示
      sectorChecked: ({ map2d }) => map2d.mapPoint.videoEditSectorChecked,
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      boltipcIcons: ({ map2d }) => map2d.mapPoint.boltipcIconFeatures, // 枪机 点位要素
      boltipcSectors: ({ map2d }) => map2d.mapPoint.boltipcSectorFeatures, // 枪机 可视域要素
      redBoltipcIcons: ({ map2d }) => map2d.mapPoint.redBoltipcIconFeatures, // 红外枪机 点位要素
      redBoltipcSectors: ({ map2d }) => map2d.mapPoint.redBoltipcSectorFeatures, // 红外枪机 可视域要素
      halfBallipcIcons: ({ map2d }) => map2d.mapPoint.halfBallipcIconFeatures, // 半球 点位要素
      halfBallipcSectors: ({ map2d }) => map2d.mapPoint.halfBallipcSectorFeatures, // 半球 可视域要素
      fastBallipcIcons: ({ map2d }) => map2d.mapPoint.fastBallipcIconFeatures, // 快球 点位要素
      fastBallipcSectors: ({ map2d }) => map2d.mapPoint.fastBallipcSectorFeatures, // 快球 可视域要素
      allViewipcIcons: ({ map2d }) => map2d.mapPoint.allViewipcIconFeatures, // 全景 点位要素
      allViewipcSectors: ({ map2d }) => map2d.mapPoint.allViewipcSectorFeatures, // 全景 可视域要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc, // 修改的点位位置坐标
      isSector: ({map2d}) => map2d.mapIndex.checkedEquipments.camera.sector.value // 可视域显隐
    })
  },
  methods: {
    ...mapActions('map2d/mapPoint', ['setVideoEditSectorChecked', 'setVideoSectorFeatures', 'setPointIconFeatures', 'setDrawFeatureLoc', 'setEditSector', 'updateMapCommonResourcePoint']),
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setPanelInfoEditStatus']),
    // 可视域复选框选中状态
    checkboxChange(val) {
      this.disabled = !val
      this.setVideoEditSectorChecked(val)
      this.updateCurrentSector()
    },
    /**
     * 初始化参数
     */
    initCurrentResource() {
      this.setDrawFeatureLoc(null) // 清除修改的位置信息
      this.setEditSector(null)
      if (this.curSelectResourcePoint && this.curSelectResourcePoint.point) {
        const point = this.curSelectResourcePoint.point
        this.pointData.radiation = point.radiation
        this.pointData.viewshed = point.viewshed
        this.pointData.viewshedAngle = point.viewshedAngle
      }
      this.radiusInput(this.pointData.radiation)
      this.anglesInput(this.pointData.viewshed)
      this.rangeInput(this.pointData.viewshedAngle)
    },
    /**
     * 保存当前修改的可视域参数
     */
    saveEditSector() {
      this.setEditSector({
        radiation: parseInt(this.pointData.radiation),
        viewshedAngle: parseInt(this.pointData.viewshedAngle),
        viewshed: parseInt(this.pointData.viewshed)
      })
    },
    /**
     * 编辑修改可视域
     * @param {*} radiation 可选,可视域半径
     * @param {*} viewshedAngle 可选,朝向角度
     * @param {*} viewshed 可选,可视域角度
     */
    updateCurrentSector(radiation, viewshedAngle, viewshed) {
      if (this.curSelectResourcePoint) {
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        const type = this.matchVideoType(this.curSelectResourcePoint.monitype)
        if (!this.sectorChecked && !this.isSector) {
          this.setVideoSectorFeatures({ type: type, features: [] })
          return
        }
        let sectorArr = this[type + 'Sectors'].filter(item => item.attributes.id !== video.id)
        // 修改可视域
        const loc = (this.drawFeatureLoc && this.drawFeatureLoc.join(',')) || (video.point && video.point.loc)
        const saveRadius = radiation === undefined ? this.pointData.radiation : radiation
        const saveAngle = viewshedAngle === undefined ? this.pointData.viewshedAngle : viewshedAngle
        const saveViewshed = viewshed === undefined ? this.pointData.viewshed : viewshed
        video.point = {
          ...video.point,
          loc: loc,
          radiation: parseInt(saveRadius),
          viewshedAngle: parseInt(saveAngle),
          viewshed: parseInt(saveViewshed)
        }
        let sectorFeature = videoTrans.transOneSectorFeature(video, this[type + 'SectorLayer'])
        sectorArr.push(sectorFeature)
        this.setVideoSectorFeatures({ type: type, features: sectorArr })
      }
    },
    matchVideoType(monitype) {
      let type
      if (monitype === VIDEOTYPEKEY.boltipc) {
        type = 'boltipc'
      } else if (monitype === VIDEOTYPEKEY.redBoltipc) {
        type = 'redBoltipc'
      } else if (monitype === VIDEOTYPEKEY.halfBallipc) {
        type = 'halfBallipc'
      } else if (monitype === VIDEOTYPEKEY.fastBallipc) {
        type = 'fastBallipc'
      } else if (monitype === VIDEOTYPEKEY.allViewipc) {
        type = 'allViewipc'
      }
      return type
    },
    /**
     * 修改当前图标要素位置
     */
    updateIconLoc(loc) {
      if (this.curSelectResourcePoint && loc) {
        let video = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
        const type = this.matchVideoType(this.curSelectResourcePoint.monitype)
        let IconArr = this[type + 'Icons'].filter(item => item.attributes.id !== video.id)
        // 修改地理坐标位置
        video.point.loc = loc
        let iconFeature = videoTrans.transOneIconFeature(video, this[type + 'Layer'])
        IconArr.push(iconFeature)
        this.setPointIconFeatures({ type: type, features: IconArr })
      }
    },
    /*
     * 面板右侧删除
     */
    deleteCamera() {
      console.log(111)
    },
    /*
     * 面板右侧取消
     */
    panelCancel() {
      const point = JSON.parse(JSON.stringify(this.curSelectResourcePoint.point))
      if (this.drawFeatureLoc) {
        // 还原图标位置
        const loc = this.drawFeatureLoc.join(',')
        if (point.loc !== loc) {
          this.updateIconLoc(point.loc)
        }
        this.setDrawFeatureLoc(null) // 清除修改的位置信息
      }
      if (!(point.radiation === parseInt(this.inputRadius) && point.viewshedAngle === parseInt(this.inputDirection) && point.viewshed === parseInt(this.inputAngle))) {
        // 还原可视域
        this.updateCurrentSector(point.radiation, point.viewshedAngle, point.viewshed)
      }
      this.setEditSector(null)
      this.setVideoEditSectorChecked(false)
      this.setPanelInfoStatus(false)
      this.setPanelInfoEditStatus(false)
    },
    /*
     * 面板右侧保存
     */
    panelSave() {
      const point = {
        ...this.curSelectResourcePoint,
        radiation: this.pointData.radiation,
        viewshedAngle: this.pointData.viewshedAngle,
        viewshed: this.pointData.viewshed
      }
      this.updateMapCommonResourcePoint(point).then(res => {
        console.log(res, '摄像机点位更新')
      })
    },
    // 照射半径
    radiusInput(val) {
      // this.setSvg(this.pointData.viewshed, val, 100)
      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    // 可视角度改变触发
    anglesInput(val) {
      let svgMax = parseInt(val)
      let ringId = this.$refs.ringId
      this.setSvg(svgMax, 50, 100)
      if (ringId.setAttribute) {
        ringId.setAttribute('transform', 'rotate(' + (135 - svgMax) + ', 100,100)')
      }
      this.pointAngle = -(parseInt(val) - 90) / 2
      ringId.setAttribute('transform', 'rotate(' + parseFloat(this.pointAngle) + ', 100,100)')
      // this.setSvg(val, this.pointData.radiation, 100)
      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    // 朝向改变(点位)
    rangeInput(val) {
      let newVal = -val + this.pointAngle
      this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
      // 获取g添加旋转属性
      ringIdMax.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
      this.sectorChecked && this.updateCurrentSector()
      this.saveEditSector()
    },
    /**
     * @param {*} path 绘制扇形的div
     * @param {*} progress 可视域角度
     * @param {*} r 半径
     * @param {*} z 中心点坐标
     */
    setSvg(progress, r, z) {
      // path自定义属性 d
      let path = this.$refs.ring
      path.setAttribute('transform', 'translate(' + z + ',' + z + ')')
      let degrees = progress
      let rad = degrees * (Math.PI / 180)
      let x = (Math.sin(rad) * r).toFixed(2)
      let y = -(Math.cos(rad) * r).toFixed(2)
      let lenghty = window.Number(degrees > 180)
      let descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z']
      path.setAttribute('d', descriptions.join(' '))
    }
  }
}
</script>
<style lang="less" scoped>
.right-panel {
  height: 95%;
}
.panel-camera-box {
  width: 100%;
  padding-left: 12px;
  line-height: 30px;
}
.right-panel-info {
  position: relative;
  height: 100%;
  .el-icon-delete {
    float: right;
    color: rgb(45, 114, 211);
  }

  .camera-info-readonly,
  .camera-form-info {
    margin-top: 6px;
    // border: 1px solid rgb(242,242,242);
    box-sizing: border-box;
    table {
      width: 100%;
    }
    td {
      &:first-child {
        width: 90px;
        text-align: center;
        background-color: #f8f8f8;
      }
      height: 33px;
      padding: 0 6px;
      line-height: 32px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #f2f2f2;
    }
  }
  .el-form-item {
    margin-bottom: 5px;
    border-bottom: 1px solid #f2f2f2;
  }
  // .panel-button {
  //   position: absolute;
  //   bottom: 0;
  // }
}
.panel-button {
  width: 300px;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  .el-button {
    margin-left: 30px;
  }
}
#panel-svg {
  margin-top: 10px;
  color: #000;
  text-align: center;
}
</style>
<style scoped>
.el-input >>> .el-input__inner {
  border: 1px solid transparent;
  box-sizing: border-box;
}
.el-input {
  width: 90%;
  outline: none;
}
.el-checkbox >>> .el-checkbox__label {
  font-size: 12px;
  color: #000;
}
.el-form-item >>> .el-form-item__label {
  font-size: 12px;
  color: #000;
}
</style>
