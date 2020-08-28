<template>
  <div>
    <div class="header">
      <span class="titleName">{{ formData.typeName }}</span>
      <span class="el-icon-close  header-close"  @click="close" ></span>
    </div>
    <div class="right-panel-info" >
      <div class="organization-info">
        <div class="organization-image" v-if="formData.topImage  &&  curSelectResourcePoint  && curSelectResourcePoint.image">
          <img v-if="curSelectResourcePoint.image"  :src="curSelectResourcePoint.image" />
        </div>
        <div class="organize-info-readonly">
          <!-- 部位 -->
          <table style="border-collapse: collapse;">
            <tr v-for="(item, index) in formData.showInfo" :key="index">
              <td class="tbName">{{ item.name }}</td>
              <td class="tbValue">{{ item.value }}<el-button type="primary" size="mini" style="float: right;" :disabled="!item.value" v-if="item.name=='IP地址'"   @click="checkPing(item.value)">ping</el-button></td>
            </tr>
            <tr v-if='curSelectResourcePoint && curSelectResourcePoint.level'>
              <td>可见层级</td>
              <td>{{ curSelectResourcePoint.level }}</td>
            </tr>
          </table>
        </div>
        <div class="floorsList" v-if=" curSelectResourcePoint && curSelectResourcePoint.floors">
            <div class="header">
            <span class="titleName">楼层索引</span>
          </div>
             <div v-if="curSelectResourcePoint.floors">
               <el-button-group>
                     <el-button plain  class="floorsBtn" v-for="item in curSelectResourcePoint.floors"
                    :key="item.id"
                    size="mini"
                    @click="setFloorMap(item)" >   {{ item.floorIndex }}</el-button>
                       </el-button-group>
                </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import UpLoadInput from '../../components/UpLoadInput'
import SpaceSettings from '../../components/SpaceSettings'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import { getSetInfo } from '../../../map2DEdit/panelInfo/panel/rightSetInfo'
import {
  RESOURCETYPE,
  SHAPETYPE,
  GEOMETRYTYPE,
  KEYPARTTYPE,
  DEVICETYPE,
  VIDEOTYPEKEY,
  KEYPARTTYPEORG,
  SUBTYPEOBJTRANSATE,
  DEVICETYPETRANSATE,
  TREENODETYPE
} from 'assets/2DMap/meta/common'
import {
  checkPingAPI
} from 'http/map2D/index'
export default {
  components: {
    SpaceSettings
  },
  computed: {
    ...mapState({
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc, // 修改的点位位置
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint
    }),
    ...mapGetters('map2d/mapIndex', ['importFormData', 'drawActive']),
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    }
  },
  props: {
    valData: {
      type: Object
    },
    addFloorObj: {
      type: Object
    }
  },
  watch: {
    // 楼层名称自定义输入正则判断
    idfooleidName() {
      this.idfooleidName = this.idfooleidName.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
    },
    curSelectResourcePoint: {
      // 监听选中点位数据的变化
      handler(newValue, oldValue) {
        if (newValue) {
          console.log('newValue', newValue, getSetInfo(newValue))
          let data = getSetInfo(newValue)
          this.formData = data
        }
      },
      deep: true
    }
  },
  data() {
    return {
      formList: null,
      formData: {
        showInfo: []

      },
      isSaveOver: false, // 保存过程是否完成
      showFloorForm: false,
      mapFileName: this.valData.envImage, // 环境平面图名字
      floorsNameUrl: '', // 楼层平面图路径
      importForm: {
        name: this.name,
        code: '105134000015',
        address: '河北省保定市东风中路1860号',
        chargeLeader: '张XXX',
        leaderPhoneNum: '0315-******',
        phoneNum: '0315-******',
        level: '1',
        higher: '河北省分行',
        status: '正常营业',
        businessHours: '1985-02-06',
        remark: '',
        image: '',
        shapeType: this.valData.shapeType, // 缩略图形态
        miniImgName: '',
        fileList: [],
        floors: []
      },
      idfooleidName: ''
    }
  },
  created() {
    if (this.curSelectResourcePoint) {
      let data = getSetInfo(this.curSelectResourcePoint)
      this.formData = data
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setPanelInfoStatus',
      'setPanelInfoFormData',
      'setDrawActive',
      'setIsMapOuter',
      'setIsFloorMap'
    ]),
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'deleteMapCommonResourcePoint',
      'setCurrentSelectResource'
    ]),
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo', 'setRefreshTreeList']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']), // 楼内平面图 环境平面图
    setFloorMap(item) {
      // this.SET_MAP_GO_BACK(this.isMapOuter)
      this.UPDATE_INDOOR_LAYER_CONFIG({
        key: 'url',
        value: item.image
      })
      let data = {
        pointObj: this.curSelectResourcePoint,
        envImageData: null,
        floorsImageDate: item,
        id: item.id,
        isFloor: true
      }
      this.setShowFloorInfo(true)
      this.setIsFloorMap(data)
      this.setIsMapOuter(2)
    },
    close() {
      this.setPanelInfoStatus(false)
    },
    checkPing(val) {
      let data = {
        ipAddr: val
      }
      checkPingAPI(data).then(res => {
        console.log(res)
        if (res.data.code === 0) {
        //  this.$notify({ type: 'success', message: res.data.data.message })
          if (res.data.data.status === 1) {
            this.$notify({ type: 'success', title: '成功', message: '连接成功' })
          } else {
            this.$notify({ type: 'error', title: '失败', message: '无法连接主机' })
          }
        } else {
          this.$notify({ type: 'errer', title: '失败', message: res.data.data.message })
        }
      })
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
    padding-bottom: 90px;
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
        width: 80px;
        text-align: left;
      }
      height: 33px;
      padding: 0 6px;
      line-height: 32px;
      box-sizing: border-box;
    }
  }
  .floorsList{
    margin-top: 10px;
    .floorsBtn{
      margin-bottom: 5px;
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
.el-icon-edit-btn {
  height: 16px;
  width: 16px;
  cursor: pointer;
  background: url('./../../../../../static/map2d/routePlan/button.png');
}
.header {
  height: 30px;
  border-bottom: 1px solid #E1E1E1;
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
}
 .titleName{
 border-left: 2px solid #2d72d3;
    padding-left: 8px;
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
.tbName{
  min-width: 80px;
}
.tbValue{
  max-width: 160px;
  word-wrap:break-word
}
.floortags{
  margin-right: 5px;
}

</style>
