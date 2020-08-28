<!--
 * @Description: 录像主机面板
 * @Author: anli
 * @Date: 2020-05-25 17:01:30
 * @LastEditTime: 2020-05-25 17:07:11
 * @LastEditors: anli
-->

<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-readonly">
        <table style="border-collapse:collapse;">
          <tr>
            <td>设备名称</td>
            <td>{{ equipmentForm.resource.deviceName }}</td>
          </tr>
          <tr>
            <td>IP地址</td>
            <td>
              <span>{{ equipmentForm.resource.hostIp }}</span
              ><el-button type="primary" size="mini" style="float: right;">ping</el-button>
            </td>
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
            <td>状态</td>
            <td>{{ equipmentForm.resource.status }}</td>
          </tr>
        </table>
      </div>
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
// import { VIDEOTYPEKEY } from 'assets/2DMap/meta/common'
export default {
  name: 'panel-info',
  data() {
    return {
      boltipcLayer: layerConfig.boltipcIcon, // 枪机
      equipmentForm: this.valData,
      equipmentForm: {
        name: '',
        ipAddress: '',
        type: '',
        brand: '',
        model: '',
        subsystem: '',
        organization: '',
        importPart: '',
        status: ''
      }
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
      this.initCurrentResource()
    }
  },
  mounted() {
    this.initCurrentResource()
  },
  computed: {
    ...mapState({
      isMapEdit: ({ map2d }) => map2d.mapIndex.isMapEdit, // 保存 取消 是否显示
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      videoRecorderIcons: ({ map2d }) => map2d.mapPoint.videoRecorderIconFeatures, // 录像机 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc // 修改的点位位置坐标
    })
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointIconFeatures',
      'setDrawFeatureLoc',

      'updateMapCommonResourcePoint',
      'setCurrentSelectResource'
    ]),
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setPanelInfoEditStatus']),
    // 可视域复选框选中状态
    checkboxChange(val) {
      this.disabled = !val
    },
    /**
     * 初始化参数
     */
    initCurrentResource() {
      this.setDrawFeatureLoc(null) // 清除修改的位置信息

      // 赋值表单必须-shen

      this.equipmentForm = this.curSelectResourcePoint
    },

    /**
     * 编辑修改可视域
     * @param {*} radiation 可选,可视域半径
     * @param {*} viewshedAngle 可选,朝向角度
     * @param {*} viewshed 可选,可视域角度
     */

    matchVideoType(monitype) {
      // let type
      // if (monitype === VIDEOTYPEKEY.boltipc) {
      //   type = 'boltipc'
      // } else if (monitype === VIDEOTYPEKEY.redBoltipc) {
      //   type = 'redBoltipc'
      // } else if (monitype === VIDEOTYPEKEY.halfBallipc) {
      //   type = 'halfBallipc'
      // } else if (monitype === VIDEOTYPEKEY.fastBallipc) {
      //   type = 'fastBallipc'
      // } else if (monitype === VIDEOTYPEKEY.allViewipc) {
      //   type = 'allViewipc'
      // } else if (monitype === VIDEOTYPEKEY.pinholeipc) {
      //   type = 'pinholeipc'
      // } else if (monitype === VIDEOTYPEKEY.smartIPC) {
      //   type = 'smartIPC'
      // }
      // return type
      return 'videoRecorder'
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
    // clearCurrentFeature() {
    //   // RESOURCETYPE.importPart 重点部位
    //   if (this.curSelectResourcePoint.rType === RESOURCETYPE.video) {
    //     const featureArr = JSON.parse(JSON.stringify(this.importPartIcons))
    //     if (featureArr) {
    //       const id = this.curSelectResourcePoint.id || this.curSelectResourcePoint.id
    //       let importPartArr = featureArr.filter(item => item.attributes.id !== id)
    //       this.setPointIconFeatures({ type: 'importPart', features: importPartArr })
    //     }
    //   }
    // },
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

      this.setPanelInfoStatus(false)
      this.setPanelInfoEditStatus(false)
    },
    /*
     * 面板右侧保存
     */
    panelSave() {
      let curSelectPoint
      curSelectPoint = cloneDeep(this.curSelectResourcePoint)
      let drawFeatureLoc = cloneDeep(this.drawFeatureLoc)
      if (this.drawFeatureLoc) {
        curSelectPoint.coordinate = drawFeatureLoc.toString()
      }
      // 当前可见层级
      curSelectPoint.level = window.$context2D.map.getView().getZoom()

      console.log('请求参数', JSON.stringify(curSelectPoint))
      return null
      // this.updateMapCommonResourcePoint(curSelectPoint)
      //   .then(res => {
      //     console.log(res, '录像机点位更新')
      //     if (!res.code) {
      //       this.$message({
      //         message: '保存成功',
      //         type: 'success'
      //       })
      //       // this.setRefreshTreeList(true) // 强制刷新机构重点部位树
      //       // this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      //       this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      //       this.setPanelInfoStatus(false) // 关闭点位信息面板
      //       //
      //       this.setPanelInfoStatus(false)
      //       this.setPanelInfoEditStatus(false)
      //     }
      //   })
      // .catch(err => {
      //   console.log(err)
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.organize-info-readonly,
.organize-info-form,
.organize-info-add {
  margin-top: 6px;
  box-sizing: border-box;
  table {
    width: 100%;
    td {
      &:first-child {
        background-color: #f8f8f8;
      }
      border: 1px solid #f2f2f2;
      background-color: #fff;
    }
  }
  td {
    &:first-child {
      width: 90px;
      text-align: center;
    }
    height: 33px;
    padding: 0 6px;
    line-height: 32px;
    box-sizing: border-box;
  }
}
//
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
//
</style>
