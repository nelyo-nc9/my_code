<template>
  <div class="create-tab-box">
    <el-tabs v-model="activeTabName"
             @tab-click="tabChange"
             type="card">
      <el-tab-pane label="通道管理"
                   name="chan">
        <table-result v-if="reloadChanelInfo"
                      :id="id"
                      :devInfo="devInfo"
                      :deviceName="deviceName"
                      :showOptIcon="showOptIcon"></table-result>
      </el-tab-pane>
      <el-tab-pane label="事件管理"
                   name="event">
        <div class="button-box">
          <el-button size="small">设备异常</el-button>
        </div>
        <el-form ref="form"
                 label-width="80px">
          <el-form-item label="异常类型"
                        v-if="activeEventName === 'alarm'">
            <el-select v-model="deviceErrorValue"
                       placeholder="请选择"
                       multiple>
              <el-option v-for="item in eventType"
                         :key="item.key"
                         :label="item.data"
                         :value="item.data">
              </el-option>
            </el-select>
            <el-checkbox v-model="alarmInputChecked">启用</el-checkbox>
          </el-form-item>
          <!-- <el-button type="primary">保存</el-button> -->
        </el-form>
        <video-table type="cabin"
                     :columns='cabinChanColumns'
                     :tableData='cabinChanTableData'>
        </video-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoTable from './VideoTable'
import TableResult from './TableResult'
import { DEVICEERROR, MOVESENSE, VIDEOSENSE } from '@src/view/videoManage/components/selectConf'
import { getSystemOpsManagerApi, eventTypeStatus } from '../../../../http/protectiveCabin/channe.api'
export default {
  name: 'CreateResult',
  props: {
    id: {
      type: String,
      required: true,
    },
    reloadChanelInfo: {
      type: Boolean,
    },
    devInfo: {
      type: Object,
    },
    deviceName: {
      type: String,
      required: true,
    },
    showOptIcon: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    TableResult,
    VideoTable,
  },
  data() {
    return {
      activeTabName: 'chan',
      alarmInputChecked: false,
      deviceExceptionChecked: false,
      mobileDetectionChecked: false,
      videoDiagnoseChecked: false,
      activeEventName: 'alarm',
      deviceErrorValue: [],
      deviceErrors: DEVICEERROR,
      moveSenseValue: '',
      moveSenses: MOVESENSE,
      videoSenseValue: '',
      videoSenses: VIDEOSENSE,
      eventType: [],
      cabinChanColumns: [
        { prop: 'name', label: '异常类型', width: '' },
        { prop: 'status', label: '状态', width: '' },
      ],
      cabinChanTableData: [],
    }
  },
  created() {
    getSystemOpsManagerApi({ queryList: [{ moduleId: '1', childModuleId: '6', dictId: '3' }] }).then((res) => {
      this.cabinChanTableData = []
      if (res.data.data) {
        this.eventType = res.data.data[0].attr
        res.data.data[0].attr.forEach((item) => {
          this.cabinChanTableData.push({ name: item.data, status: 1 })
        })
      }
    })
    eventTypeStatus({ id: this.id, type: { subsystem: 6 } }).then((res) => {
      console.log(res)
    })
  },
  methods: {
    tabChange(value) {
      console.log(value)
    },
  },
}
</script>

<style lang="less" scoped>
.create-tab-box {
  /deep/.el-tabs {
    height: calc(~'100% - 1px');
    .el-tabs__header {
      border-bottom: 1px solid #e1e1e1;
      margin-bottom: 19px;
      width: 100%;
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            border-radius: 0;
            border: none;
            .el-tabs__item {
              border-top-color: #fff;
              border-left: 1px solid #fff;
              border-right: 1px solid #fff;
            }
            .is-active {
              position: relative;
              border-left: 1px solid #e1e1e1;
              border-right: 1px solid #e1e1e1;
            }
            .is-active::after {
              content: '';
              display: block;
              width: 98px;
              height: 2px;
              background: #2d72d3;
              position: absolute;
              left: 0px;
              top: 0px;
            }
          }
        }
      }
    }
    .el-tabs__content {
      height: calc(~'100% - 55px');
      .el-tab-pane {
        height: 100%;
      }
      .el-pagination {
        height: 29px;
      }
    }
  }
}
</style>
