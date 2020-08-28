<template>
  <div  class="realtionEqu">
     <div class="header">
      <span  class="titleName">关联设备</span>
         <span class="el-icon-close  header-close"  @click="close" ></span>
    </div>
    <div class="right-panel-info" >
      <div class="organization-info">
        <div class="organize-info-readonly">
         <div class="equtit"> 主设备</div>
          <table style="border-collapse: collapse;">
            <tr v-for="(item, index) in formData.showInfo" :key="index">
              <td class="tbName">{{ item.name }}</td>
              <td class="tbValue">{{ item.value }}</td>
            </tr>
          </table>
          <ul v-if="showList">
            <li v-for="(item, index) in equList"  :key="index">
               <div class="equtit"> 关联设备 {{index+1}}</div>
               <table style="border-collapse: collapse;">
             <tr v-for="(i, inds) in item.showInfo" :key="inds">
              <td class="tbName">{{ i.name }}</td>
              <td class="tbValue">{{ i.value }}</td>
            </tr>
          </table>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getSetInfo } from '../../map2DEdit/panelInfo/panel/rightSetInfo'
import { getRealtionEquInfo } from './RealtionEquSetInfo'
export default {
  computed: {
    ...mapState({
      nowSelectRealtionInfo: ({ map2d }) => map2d.mapIndex.nowSelectRealtionInfo, // 获取的关联设备的对象
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc, // 修改的点位位置
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint
    }),
    ...mapGetters('map2d/mapIndex', ['importFormData', 'drawActive', '']),
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    },
    listenNowSelectRealtionInfo() {
      return this.nowSelectRealtionInfo
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
    },
    listenNowSelectRealtionInfo: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.equList = cloneDeep(newValue)
          this.equList.forEach(element => {
            element.showInfo = getRealtionEquInfo(element).showInfo
          })
        }
        this.showList = true
        console.log(this.equList)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      formList: null,
      formData: {
        showInfo: []
      },
      equList: [],
      showList: false
    }
  },
  mounted() {
    if (this.nowSelectRealtionInfo) {
      this.equList = cloneDeep(this.nowSelectRealtionInfo)
      this.equList.forEach(element => {
        element.showInfo = getRealtionEquInfo(element).showInfo
      })
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
    ...mapMutations('map2d/mapIndex', ['CLEAR_NOW_SELECT_REALTION_INFO']), // 楼内平面图 环境平面图
    close() {
      this.setPanelInfoStatus(false)
      this.CLEAR_NOW_SELECT_REALTION_INFO(null)

      console.log(this.nowSelectRealtionInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.realtionEqu{
 background:  rgba(255, 255, 255, 0.8)
}
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
.upload-btn >>> button {
  border-radius: 0 2px 2px 0;
}
.fileInput >>> input {
  border-radius: 2px 0 0 2px;
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
.equtit{
line-height: 25px;
font-size: 14px;
 background: #eeeeee;
 padding: 5px;
}
.tbName{
  min-width: 80px;
}
.tbValue{
  max-width: 160px;
  word-wrap:break-word
}
</style>
