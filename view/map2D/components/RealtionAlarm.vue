<template>
  <div class="realtionEqu">
    <div class="equtit">报警设备</div>
    <div class="right-panel-info">
      <div class="organization-info">
        <div class="organize-info-readonly">
          <table style="border-collapse: collapse;">
            <tr>
              <td class="tbName">
                <span class="alarmType">{{ formData.alarmTypeName }}</span>
              </td>
              <td class="tbValue"><span class="alarmTime"></span> {{ formData.startTime }}</td>
            </tr>
            <tr>
              <td class="tbName">报警名称</td>
              <td class="tbValue">{{ formData.alarmName }}</td>
            </tr>
            <tr>
              <td class="tbName">所属设备</td>
              <td class="tbValue">{{ formData.deviceName }}</td>
            </tr>
            <tr>
              <td class="tbName">所属部位</td>
              <td class="tbValue">{{ formData.keyPartName }}</td>
            </tr>
            <tr>
              <td class="tbName">所属机构</td>
              <td class="tbValue">{{ formData.orgName }}</td>
            </tr>
          </table>

          <ul v-if="showList">
            <li    v-for="(item, index) in equList" :key="index" >
              <div class="equtit">关联设备 {{ index + 1 }}</div>
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
import moment from 'moment'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getRealtionAlarmInfo } from './RealtionAlarmSetInfo'
export default {
  computed: {
    ...mapState({
      nowSelectRealtionInfo: ({ map2d }) => map2d.mapIndex.nowSelectRealtionInfo, // 获取的关联设备的对象
      indoorLayerConfig: ({ map2d }) => map2d.mapIndex.indoorLayerConfig,
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      drawFeatureLoc: ({ map2d }) => map2d.mapPoint.drawFeatureLoc, // 修改的点位位置
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint,
      showAlarmVideoInfo: ({ map2d }) => map2d.mapIndex.showAlarmVideoInfo
    }),
    ...mapGetters('map2d/mapIndex', ['importFormData', 'drawActive', '']),
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    },
    listenShowAlarmVideoRelationArr() {
      return this.showAlarmVideoInfo.showAlarmVideoRelationArr
    },
    listenNowShowAlarmDetailInfo() {
      return this.showAlarmVideoInfo.nowShowAlarmDetailInfo
    }
  },

  watch: {
    listenNowShowAlarmDetailInfo: {
      // 监听选中点位数据的变化
      handler(newValue, oldValue) {
        console.log(newValue)
        if (newValue) {
          this.formData = cloneDeep(this.showAlarmVideoInfo.nowShowAlarmDetailInfo)
          if (typeof this.formData.startTime === 'number') {
            this.formData.startTime = moment(
              this.formData.startTime < 15978158610 ? this.formData.startTime * 1000 : this.formData.startTime
            ).format('yyyy-MM-DD HH:mm')
          }
        }
      },
      immediate: true,
      deep: true
    },
    listenShowAlarmVideoRelationArr: {
      handler(newValue, oldValue) {
        console.log(newValue)
        if (newValue && newValue.length > 0) {
          this.equList = cloneDeep(newValue)
          this.equList.forEach(element => {
            element.showInfo = getRealtionAlarmInfo(element).showInfo
          })
          this.showList = true
          console.log(this.equList)
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      formList: null,
      formData: {},
      equList: [],
      showList: false
    }
  },
  mounted() {
    console.log('当前报警视频设备', this.showAlarmVideoInfo)
  },
  created() {
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
.realtionEqu {
  background: rgba(255, 255, 255, 0.8);
  height: 550px;
  overflow: scroll;
}
.right-panel-info {
  // height: 100%;

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
    // padding-bottom: 90px;
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
      background: #f5f7fa;

      td {
        text-align: left;
        .alarmType {
          min-width: 60px;
          background: red;
          padding: 2px;
          transform: skewX(-10deg);
          display: inline-block;
          color: #fff;
          height: 25px;
          line-height: 20px;
        }
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
.header {
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
}
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
.equtit {
  line-height: 25px;
  font-size: 14px;
  padding-left: 10px;
  line-height: 40px;
}
.tbName {
  max-width: 80px;
}
.tbValue {
  max-width: 200px;
}
</style>
