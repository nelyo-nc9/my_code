<!--
 * @Description: 摄像机面板
 * @Author: anli
 * @Date: 2020-05-25 17:01:30
 * @LastEditTime: 2020-05-25 17:07:11
 * @LastEditors: anli
-->
<template>
  <div class="right-panel">
    <div class="right-panel-info">
      <div class="camera-info">
        <div class="camera-info-readonly">
          <table style="border-collapse:collapse;">
            <tr>
              <td>设备名称</td>
              <td>{{ equipmentForm.resource.deviceName }}</td>
            </tr>
            <tr>
              <td>IP地址</td>
              <td>{{ equipmentForm.resource.hostIp }}</td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td>{{ equipmentForm.resource.deviceType }}</td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{{ equipmentForm.resource.brand }}</td>
            </tr>
            <tr>
              <td>型号</td>
              <td>{{ equipmentForm.resource.modelNum }}</td>
            </tr>
            <tr>
              <td>所属子系统</td>
              <td>{{ equipmentForm.resource.deviceName }}</td>
            </tr>
            <tr>
              <td>所属机构</td>
              <td>{{ equipmentForm.resource.orgName }}</td>
            </tr>
            <tr>
              <td>所属重点部位</td>
              <td>{{ equipmentForm.resource.keyPartName }}</td>
            </tr>
            <tr>
              <td>是否停用</td>
              <td>{{ equipmentForm.resource.status }}</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{ equipmentForm.resource.status }}</td>
            </tr>
            <tr>
              <td>可见层级</td>
              <td>{{ equipmentForm.level }}</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 可视域 -->
      <!-- <div class="panel-viewshed" v-if="isEdit">
        <div class="panel-camera-box">
          <span>缩微图调整</span>
        </div>
        <div class="panel-camera-box">
          <el-checkbox label="可视域" name="type" @change="checkboxChange"></el-checkbox>
        </div>
      
        <el-form ref="pointDataAn" :model="pointData" label-width="70px">
          <el-form-item label="照射半径" prop="radiation">
            <el-input
              :max="150"
              :disabled="disabled"
              :min="0"
              size="mini"
              type="number"
              v-model="pointData.radiation"
              @input="radiusInput"
            ></el-input
            >米
          </el-form-item>
          <el-form-item label="可视角度" prop="viewshed">
            <el-input
              :max="150"
              :disabled="disabled"
              :min="0"
              size="mini"
              type="number"
              v-model="pointData.viewshed"
              @input="anglesInput"
            ></el-input
            >°
          </el-form-item>
          <el-form-item label="点位角度" prop="viewshedAngle">
            <el-input
              :max="360"
              :min="-360"
              size="mini"
              type="number"
              v-model="pointData.viewshedAngle"
              @input="rangeInput"
            ></el-input
            >°
          </el-form-item>
        </el-form>
        <div id="panel-svg">
          <svg width="200px" height="200px" class="svgclass" version="1.1">
            <text x="185" y="105" fill="#000">0°</text>
            <text x="90" y="15" fill="#000">90°</text>
            <text x="0" y="105" fill="#000">180°</text>
            <text x="90" y="200" fill="#000">270°</text>
            <line x1="30" y1="100" x2="180" y2="100" style="stroke:rgb(000,000,000);stroke-width:1" />
            <line x1="100" y1="20" x2="100" y2="180" style="stroke:rgb(000,000,000);stroke-width:1" />
            <g id="ringIdMax2">
              <g ref="ringId2">
                <path ref="ring" fill="#20a1ff" />
                <circle cx="100" cy="100" r="10" stroke="black" stroke-width="1" fill="#FFF" />
              </g>
            </g>
          </svg>
        </div>
      </div> -->
      <!-- 取消，保存 -->
      <div class="panel-button" v-if="isMapEdit">
        <el-button size="mini" @click="panelCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="panelSave">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import { VIDEOTYPEKEY, RESOURCETYPE } from 'assets/2DMap/meta/common'
export default {
  name: 'panel-info',
  data() {
    return {
      disabled: true, // 输入框的禁用状态
      panelTitle: '摄像机',
      equipmentForm: this.valData,
      // equipmentForm: {
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
      isSector: ({ map2d }) => map2d.mapIndex.checkedEquipments.camera.sector.value // 可视域显隐
    })
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setVideoEditSectorChecked',
      'setVideoSectorFeatures',
      'setPointIconFeatures',
      'setDrawFeatureLoc',
      'setEditSector',
      'updateMapCommonResourcePoint',
      'setCurrentSelectResource'
    ]),
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setPanelInfoEditStatus', 'setDrawActive']),
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

      //
      this.equipmentForm = this.curSelectResourcePoint
      if (this.curSelectResourcePoint) {
        const point = this.curSelectResourcePoint
        this.pointData.radiation = point['radiation'] === undefined ? 50 : point.radiation
        this.pointData.viewshed = point['viewshed'] === undefined ? 90 : point.viewshed
        this.pointData.viewshedAngle = point['viewshedAngle'] === undefined ? 0 : point.viewshedAngle
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
        // const type = this.matchVideoType(this.curSelectResourcePoint.monitype)
        const type = this.matchVideoType(Number(this.curSelectResourcePoint.subType))
        if (!this.sectorChecked && !this.isSector) {
          this.setVideoSectorFeatures({ type: type, features: [] })
          return
        }
        // let obj = this[type + 'Sectors']
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
        // console.log('当前的坐标', sectorFeature.geom.points)
        sectorArr.push(sectorFeature)
        this.setVideoSectorFeatures({ type: type, features: sectorArr })
        // let that=this;
        // setTimeout(e=>{
        //    this.setVideoSectorFeatures({ type: type, features: [] })
        // },16000)
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
        const type = this.matchVideoType(Number(this.curSelectResourcePoint.subType))
        let IconArr = this[type + 'Icons'].filter(item => item.attributes.id !== video.id)
        // 修改地理坐标位置
        // video.point.loc = loc

        let iconFeature = videoTrans.transOneIconFeature(video, this[type + 'Layer'])
        IconArr.push(iconFeature)
        this.setPointIconFeatures({ type: type, features: IconArr })
      }
    },
    clearCurrentFeature() {
      // RESOURCETYPE.importPart 重点部位
      if (this.curSelectResourcePoint.rType === RESOURCETYPE.video) {
        const featureArr = JSON.parse(JSON.stringify(this.importPartIcons))
        if (featureArr) {
          const id = this.curSelectResourcePoint.id || this.curSelectResourcePoint.id
          let importPartArr = featureArr.filter(item => item.attributes.id !== id)
          this.setPointIconFeatures({ type: 'importPart', features: importPartArr })
        }
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
      const point = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
      const lnglat = point.coordinate
      // const fieldA = this.curSelectResourcePoint['point']
      // const fieldB = this.curSelectResourcePoint['loc']
      // let point = null
      // if (fieldA != undefined) {
      //   point = JSON.parse(JSON.stringify(fieldA))
      // }
      // if (fieldB != undefined) {
      //   point = JSON.parse(JSON.stringify(fieldB))
      // }
      // const point = JSON.parse(JSON.stringify(this.curSelectResourcePoint['loc']))

      if (this.drawFeatureLoc) {
        // 还原图标位置
        const loc = this.drawFeatureLoc.join(',')
        if (lnglat !== loc) {
          this.updateIconLoc(lnglat)
        }
        this.setDrawFeatureLoc(null) // 清除修改的位置信息
      }
      if (lnglat != null) {
        if (
          !(
            point.radiation === parseInt(this.inputRadius) &&
            point.viewshedAngle === parseInt(this.inputDirection) &&
            point.viewshed === parseInt(this.inputAngle)
          )
        ) {
          // 还原可视域
          this.updateCurrentSector(point.radiation, point.viewshedAngle, point.viewshed)
        }
      }
      this.setDrawActive({ active: false })
      this.setEditSector(null)
      this.setVideoEditSectorChecked(false)
      this.setPanelInfoStatus(false)
      this.setPanelInfoEditStatus(false)
    },

    /*
     * 面板右侧保存
     */
    panelSave() {
      // const point = {
      //   ...this.curSelectResourcePoint,
      //   radiation: this.pointData.radiation,
      //   viewshedAngle: this.pointData.viewshedAngle,
      //   viewshed: Number(this.pointData.viewshed)
      // }
      // console.log('请求参数', JSON.stringify(point))
      // this.updateMapCommonResourcePoint(point)
      //   .then(res => {
      //     console.log(res, '摄像机点位更新')

      //   })
      //   .catch(err => {
      //     console.log(err)
      //     alert('失败')
      //   })
      // eslint-disable-next-line no-
      let curSelectPoint
      curSelectPoint = cloneDeep(this.curSelectResourcePoint)
      let drawFeatureLoc = cloneDeep(this.drawFeatureLoc)
      if (this.drawFeatureLoc) {
        curSelectPoint.coordinate = drawFeatureLoc.toString()
      }
      // 当前可见层级
      curSelectPoint.level = window.$context2D.map.getView().getZoom()
      // 修改点位接口
      //
      //   radiation: this.pointData.radiation,
      //   viewshedAngle: this.pointData.viewshedAngle,
      //   viewshed: Number(this.pointData.viewshed)
      curSelectPoint.radiation = Number(this.pointData.radiation)
      curSelectPoint.viewshedAngle = Number(this.pointData.viewshedAngle)
      curSelectPoint.viewshed = Number(this.pointData.viewshed)
      //
      console.log('保存的信息', curSelectPoint)
      this.updateMapCommonResourcePoint(curSelectPoint)
        .then(res => {
          if (!res.code) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            // this.setRefreshTreeList(true) // 强制刷新机构重点部位树
            // this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
            // this.setCurrentSelectResource(null) // 清空选中的点位资源数据
            // this.setPanelInfoStatus(false) // 关闭点位信息面板
            this.setDrawActive({ active: false })
            this.setEditSector(null)
            this.setVideoEditSectorChecked(false)
            this.setPanelInfoStatus(false)
            this.setPanelInfoEditStatus(false)
          }
        })
        .catch(err => console.log(err))
    },
    // // 照射半径
    // radiusInput(val) {
    //   // this.setSvg(this.pointData.viewshed, val, 100)
    //   this.sectorChecked && this.updateCurrentSector()
    //   this.saveEditSector()
    // },
    // // 可视角度改变触发
    // anglesInput(val) {
    //   let svgMax = parseInt(val)
    //   let ringId2= this.$refs.ringId2
    //   this.setSvg(svgMax, 50, 100)
    //   if (ringId2.setAttribute) {
    //     ringId2.setAttribute('transform', 'rotate(' + (135 - svgMax) + ', 100,100)')
    //   }
    //   this.pointAngle = -(parseInt(val) - 90) / 2
    //   ringId2.setAttribute('transform', 'rotate(' + parseFloat(this.pointAngle) + ', 100,100)')
    //   // this.setSvg(val, this.pointData.radiation, 100)
    //   this.sectorChecked && this.updateCurrentSector()
    //   this.saveEditSector()
    // },
    // // 朝向改变(点位)
    // rangeInput(val) {
    //   let newVal = -val + this.pointAngle
    //   // let ringIdMax = this.$refs.ringIdMax
    //   this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
    //   // 获取g添加旋转属性
    //   ringIdMax2.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
    //   this.sectorChecked && this.updateCurrentSector()
    //   this.saveEditSector()
    // },
    // /**
    //  * @param {*} path 绘制扇形的div
    //  * @param {*} progress 可视域角度
    //  * @param {*} r 半径
    //  * @param {*} z 中心点坐标
    //  */
    // setSvg(progress, r, z) {
    //   // path自定义属性 d
    //   let path = this.$refs.ring
    //   path.setAttribute('transform', 'translate(' + z + ',' + z + ')')
    //   let degrees = progress
    //   let rad = degrees * (Math.PI / 180)
    //   let x = (Math.sin(rad) * r).toFixed(2)
    //   let y = -(Math.cos(rad) * r).toFixed(2)
    //   let lenghty = window.Number(degrees > 180)
    //   let descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z']
    //   path.setAttribute('d', descriptions.join(' '))
    // }
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
