<template>
  <div>
    <div class="right-panel-info" v-if="!isShowSpaceSettings">
      <!-- <div class="panel-info-title">
        <span>重点部位</span>
        <i class="el-icon-delete" style="float: right;line-height: 32px;"></i>
      </div>-->
      <div class="organization-info">
        <div class="organize-info-readonly">
          <!-- 部位 -->
          <table style="border-collapse:collapse;">
            <tr>
              <td>探测器名称</td>
              <td>{{ importForm.name }}</td>
            </tr>
            <tr>
              <td>防区序号</td>
              <td>{{ importForm.serialNo }}</td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td>{{ importForm.type }}</td>
            </tr>
            <tr>
              <td>所属设备</td>
              <td>{{ importForm.theirEquipment }}</td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{{ importForm.brand }}</td>
            </tr>
            <tr>
              <td>型号</td>
              <td>{{ importForm.model }}</td>
            </tr>
            <tr>
              <td>所属子系统</td>
              <td>{{ importForm.subsystem }}</td>
            </tr>
            <tr>
              <td>所属重点部位</td>
              <td>{{ importForm.importPart }}</td>
            </tr>
            <tr>
              <td>所属机构</td>
              <td>{{ importForm.organization }}</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{ importForm.status }}</td>
            </tr>
            <tr>
              <td>可见层级</td>
              <td>{{ importForm.visibleLevel }}</td>
            </tr>
          </table>

          <!-- 重点部位 -->
        </div>
        <div class="organize-info-form" v-if="isEdit">
          <tr>
            <td>缩微图形态</td>
            <td>
              <el-select v-model="importForm.miniImg" size="mini" :placeholder="importForm.miniImgName">
                <el-option v-for="item in miniImgOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span @click.capture="selectMiniImg(item.value)" style="display:block;">{{ item.label }}</span>
                </el-option>
              </el-select>
            </td>
          </tr>
        </div>
      </div>
      <div class="panel-info-btn" v-if="isEdit">
        <el-row>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitSave">保 存</el-button>
        </el-row>
      </div>
    </div>
    <SpaceSettings isEditPolygon="true" v-else @closeSetting="closeSetting" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import UpLoadInput from '../../components/UpLoadInput'
import SpaceSettings from '../../components/SpaceSettings'
import { RESOURCETYPE, GEOMETRYTYPE, DEVICETYPE, SHAPETYPE } from 'assets/2DMap/meta/common'
// import { delete } from 'vue/types/umd'
export default {
  components: {
    SpaceSettings
  },
  computed: {
    ...mapState({
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 监听选中点位数据的变化
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc // 修改的点位位置
    }),
    ...mapGetters('map2d/mapIndex', ['importFormData'])
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    valData: {
      type: Object
    },
    addFloorObj: {
      type: Object
    }
  },
  watch: {
    // 楼层名称自定义输入正则判断
    // idfooleidName() {
    //   this.idfooleidName = this.idfooleidName.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
    // },
    curSelectResourcePoint: {
      // 监听选中点位数据的变化
      handler: function(newValue, oldValue) {
        if (newValue) {
          // 点位数据有效时
          this.importForm = this.curSelectResourcePoint ? _.cloneDeep(this.curSelectResourcePoint) : this.importForm
        }
      },
      deep: true
    }
  },
  data() {
    return {
      // showFloorForm: false,
      visibleLevel: window.$context2D.map.getView().getZoom(),
      mapFileName: this.valData.envImage, // 环境平面图名字
      // floorsNameUrl: '', // 楼层平面图路径
      importForm: {
        name: this.name,
        code: '105134000015',
        address: '河北省保定市东风中路1860号',
        chargeLeader: '张XXX',
        leaderPhoneNum: '0315-******',
        phoneNum: '0315-******',
        level: '二级分行',
        higher: '河北省分行',
        status: '正常营业',
        businessHours: '1985-02-06',
        remark: '',

        image: '',
        miniImg: this.valData.shapeType,
        miniImgName: ''
        // fileList: [],
        // floors: []
      },
      // idfooleidName: '',
      // foorForm: {
      //   keyPartId: '',
      //   orgId: '',
      //   floorIndex: ''
      // }, // 添加楼层对象
      miniImgOptions: [
        {
          value: 1,
          label: '点位'
        },
        {
          value: 2,
          label: '自定义区域'
        }
      ],
      isShowSpaceSettings: false
    }
  },
  created() {
    this.importForm = this.curSelectResourcePoint ? _.cloneDeep(this.curSelectResourcePoint) : this.importForm
  },
  mounted() {
    this.visibleLevel = window.$context2D.map.getView().getZoom()
    if (this.valData.shapeType === 1) {
      this.miniImgName = '点位'
    } else if (this.valData.shapeType === 2) {
      this.miniImgName = '自定义区域'
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setPanelInfoFormData',
      'setDrawActive',
      'setIsMapOuter'
      // 'setIsFloorMap'
    ]),
    ...mapActions('map2d/mapPoint', [
      // 'addFloorAKey',
      // 'getAllFloorAKey',
      // 'deleteFloorAKey',
      // 'getAllFloorAKey',
      'setPointIconFeatures',
      'setAreaDrawActive',
      'setAreaDrawLoc',
      'updateMapCommonResourcePoint',
      'getCommonResourceById',
      'getCommonResourceById',
      'setCurrentSelectResource'
    ]), // 修改地图设备点位
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setRefreshTreeList']),
    // ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setRefreshTreeList']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']), // 楼内平面图 环境平面图
    // 修改 楼层平面图
    uploadSuccessFloors(response, file, fileList) {},
    // 添加环境平面图
    uploadSuccess(response, file, fileList) {
      this.mapFileName = response.data.path
      console.log(this.mapFileName)

      const resource = this.curSelectResourcePoint
      resource.envImage = response.data.path
      this.updateMapCommonResourcePoint(resource)
        .then(res => {
          // 改变环境平面图
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
        .catch(err => console.log(err))
    },
    // showAddFloor() {
    //   this.showFloorForm = true
    // },
    // 楼层图片上传成功公共接口
    // uploadFoolsSuccess(response, file, fileList) {
    //   this.floorsNameUrl = response.data.path
    // },
    //
    // getImageWidthAndHeight(imageUrl, callback) {
    //   const img_url = imageUrl
    //   let img = new Image()
    //   img.src = img_url
    //   img.onload = function() {
    //     let img_width = img.width === 0 ? 0.00001 : img.width
    //     let img_height = img.height === 0 ? 0.00001 : img.height
    //     if (img_width / img_height > 2) {
    //       img_height = (img_height / img_width) * 180
    //       img_width = 180
    //     } else {
    //       img_width = (img_width / img_height) * 90
    //       img_height = 90
    //     }
    //     callback([-img_width, -img_height, img_width, img_height])
    //   }
    // },
    // 查看点位接口 查看环境平面图 // 获取地图设备点位详情
    // handEnvironmental(item) {
    //   let nowThis = this
    //   this.getCommonResourceById(this.importForm.id)
    //     .then(res => {
    //       if (res.data.envImage) {
    //         nowThis.UPDATE_OUTDOOR_LAYER_CONFIG({
    //           // 展示环境平面图
    //           key: 'url',
    //           value: res.data.envImage
    //         })
    //         this.selectedFloor = item
    //         let data = {
    //           id: item,
    //           isFloor: false
    //         }
    //         this.setIsFloorMap(data)
    //         this.setIsMapOuter(2)
    //       } else {
    //         this.$message({
    //           message: '请添加环境平面图',
    //           type: 'success'
    //         })
    //       }
    //     })
    //     .catch(err => console.log(err))
    // },
    // header 机构重点部位图片
    // handleImgSuccess(response, file, fileList) {
    //   // 图片上传成功方法
    //   // this.importForm.image = URL.createObjectURL(file.raw)
    //   this.importForm.image = response.data.path
    //   const resource = this.curSelectResourcePoint
    //   resource.image = response.data.path
    //   this.updateMapCommonResourcePoint(resource)
    //     .then(res => {
    //       console.log(res)
    //     })
    //     .catch(err => console.log(err))
    // },
    // handleChange(file, fileList) {
    //   this.importForm.fileList = fileList.slice(-1)
    // },
    // 监听上传图片
    // uploadFloorFile(data) {
    //   console.log(data)
    //   this.importForm.floors[data.Index].fileList = data.fileList
    // },
    // deleteFloor(Index) {
    //   // 删除楼层方法
    //   let ids = [Index]
    //   this.deleteFloorAKey(ids)
    //     .then(res => {
    //       if (!res.code) {
    //         this.getCommonResourceById(this.importForm.id)
    //           .then(res => {
    //             this.importForm = res.data
    //             this.$message({
    //               message: '添加成功',
    //               type: 'success'
    //             })
    //           })
    //           .catch(err => console.log(err))
    //       }
    //     })
    //     .catch(err => console.log(err))
    // },
    // // 监听修改楼层名称 idfooleidName楼层名，Index楼层下表
    // inputIdfooleidName(idfooleidName, Index) {
    //   this.importForm.floors[Index].idName = idfooleidName
    // },
    // 添加楼层
    // pushFloor() {
    //   if (this.idfooleidName !== '') {
    //     // 楼层名称不能为空
    //     if (this.curSelectResourcePoint.type === DEVICETYPE.keyPart.toString()) {
    //       let keyPartId = this.curSelectResourcePoint.keyPartId
    //       this.foorForm.keyPartId = keyPartId
    //     }
    //     console.log(this.curSelectResourcePoint)
    //     console.log(this.curSelectResourcePoint.orgId)
    //     this.foorForm.orgId = this.curSelectResourcePoint.orgId
    //     // 楼层名称索引
    //     this.foorForm.floorIndex = this.idfooleidName
    //     if (this.floorsNameUrl) {
    //       this.foorForm.image = this.floorsNameUrl
    //     }

    //     // 添加楼层
    //     this.addFloorAKey(this.foorForm)
    //       .then(suc => {
    //         this.getCommonResourceById(this.importForm.id)
    //           .then(res => {
    //             // 刷新楼层接口
    //             this.importForm = res.data
    //             this.$message({
    //               message: '添加成功',
    //               type: 'success'
    //             })
    //           })
    //           .catch(err => console.log(err))
    //         this.showFloorForm = false
    //         this.$forceUpdate()
    //       })
    //       .catch(err => console.log(err))
    //   }
    // },
    // 删除环境平面图
    // deletemapFileName() {
    //   this.mapFileName = ''
    //   const resource = this.curSelectResourcePoint
    //   resource.envImage = ''
    //   this.importForm.envImage = ''
    //   this.updateMapCommonResourcePoint(resource)
    //     .then(res => {
    //       this.$message({
    //         message: '添加成功',
    //         type: 'success'
    //       })
    //     })
    //     .catch(err => console.log(err))
    // },
    // 展示楼层平面图
    // floorsBatCicki(item, itmeId) {
    //   let nowThis = this
    //   // 展示楼内平面图
    //   this.getAllFloorAKey(itmeId)
    //     .then(suc => {
    //       if (suc.data.image !== '') {
    //         nowThis.UPDATE_INDOOR_LAYER_CONFIG({
    //           // 展示楼内平面图
    //           key: 'url',
    //           value: suc.data.image
    //         })
    //         this.selectedFloor = item
    //         let data = {
    //           id: item,
    //           isFloor: true
    //         }
    //         this.setIsFloorMap(data)
    //         this.setIsMapOuter(2)
    //       }
    //     })
    //     .catch(err => console.log(err))
    // },
    selectMiniImg(val) {
      if (this.importForm.shapeType !== val) {
        this.importForm.shapeType = val

        //  清除当前要素
        // this.clearCurrentFeature()
        if (val === SHAPETYPE.POLYGON) {
          // this.setAreaDrawActive(true) // 打开区域绘制
          // let defaultStyle = {
          //   fillColor: 'rgba(236,227,191,0.4)',
          //   strokeStyle: {
          //     lineDash: [1],
          //     outLineColor: 'rgba(255,0,0,0.4)',
          //     outLineWidth: 1
          //   },
          //   textStyle: {
          //     fillColor: '#FF0000',
          //     fontSize: 1.2,
          //     label: '',
          //     labelXOffset: 15,
          //     labelYOffset: -15,
          //     lineDash: [1],
          //     outLineColor: '#00ff00',
          //     outLineWidth: 5
          //   }
          // }
          this.setDrawActive({ active: false })
          this.setDrawActive({ active: true, type: GEOMETRYTYPE.POLYGON, styleType: 'areaDraw' }) // 打开平面编辑
        } else if (val === SHAPETYPE.POINT) {
          this.setDrawActive({ active: false })
          this.setDrawActive({ active: true, type: GEOMETRYTYPE.POLYGON })
          // this.importForm.miniImgName = '点位'
          // let equipmentType = this.equipmentType(this.selectedTreeNode)
          // const { iconType } = equipmentType
          // this.setDrawActive({ active: true, type: GEOMETRYTYPE.POINT, styleType: iconType }) // 打开点位绘制
          // this.setAreaDrawActive(false) // 关闭区域绘制
          // this.setAreaDrawLoc('') // 清除上次区域绘制坐标
        }
      }
    },
    /**
     * 清除当前要素
     */
    clearCurrentFeature() {
      // RESOURCETYPE.importPart 重点部位
      if (this.curSelectResourcePoint.rType === RESOURCETYPE.importPart) {
        const featureArr = JSON.parse(JSON.stringify(this.importPartIcons))
        if (featureArr) {
          const id = this.curSelectResourcePoint.id || this.curSelectResourcePoint.id
          let importPartArr = featureArr.filter(item => item.attributes.id !== id)
          this.setPointIconFeatures({ type: 'importPart', features: importPartArr })
        }
      }
    },
    closeSetting() {
      this.isShowSpaceSettings = false
    },
    // 取消按钮
    cancel() {
      this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
      this.setCurrentSelectResource(null) // 清空选中的点位资源数据
      this.setPanelInfoStatus(false) // 关闭点位信息面板
      this.setDrawActive({ active: false }) // 打开平面编辑
    },
    // 保存按钮
    submitSave() {
      let curSelectPoint
      curSelectPoint = cloneDeep(this.curSelectResourcePoint)
      let drawFeatureLoc = cloneDeep(this.drawFeatureLoc)
      if (this.drawFeatureLoc) {
        curSelectPoint.coordinate = drawFeatureLoc.toString()
      }
      // 当前可见层级
      curSelectPoint.level = window.$context2D.map.getView().getZoom()
      // 修改点位接口
      this.updateMapCommonResourcePoint(curSelectPoint)
        .then(res => {
          if (!res.code) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.setRefreshTreeList(true) // 强制刷新机构重点部位树
            this.selectedTreeCode && this.setSelectedTreeCode(null) // 清空选中的树节点数据
            this.setCurrentSelectResource(null) // 清空选中的点位资源数据
            this.setPanelInfoStatus(false) // 关闭点位信息面板
          }
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
<style lang="less" scoped>
.right-panel-info {
  height: 100%;
  // padding-top: 6px;
  position: relative;
  // .panel-info-title,.organization-info,.panel-info-btn{
  //   padding: 0 6px;
  // }
  .panel-info-title {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    background-color: rgba(242, 242, 242, 0.6);
  }
  .organization-info {
    overflow: auto;
    .organization-image {
      height: 150px;
      // margin-top: 6px;
      border: 1px solid #f2f2f2;
      box-sizing: border-box;
      .avatar-uploader {
        width: 100%;
        height: 100%;
      }
      .avatar-uploader-icon {
        font-size: 30px;
        line-height: 150px;
        color: #8c939d;
      }
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
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
  .upload-btn,
  .fileInput {
    display: table-cell;
  }
}
</style>
<style scoped>
.avatar-uploader >>> .el-upload {
  width: 100%;
  height: 100%;
}
.organization-info {
  height: calc(100% - 46px);
}
.upload-btn >>> button {
  border-radius: 0 2px 2px 0;
}
.fileInput >>> input {
  border-radius: 2px 0 0 2px;
}
</style>
