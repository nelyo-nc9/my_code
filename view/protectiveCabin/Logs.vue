<template>
  <div class="log-box">
    <div class="log-content">
      <div class="titel">
        <span>防护舱管理 ></span>
        <span class="active">防护舱日志</span>
      </div>
      <div class="query-box">
        <div class="show-from"
             @click="activeName==='first'?operationShowFrom=!operationShowFrom:eventShowFrom=!eventShowFrom">
          <i :class="activeName==='first'?(operationShowFrom?'el-icon-arrow-down':'el-icon-arrow-up'):(eventShowFrom?'el-icon-arrow-down':'el-icon-arrow-up')"></i>
        </div>
        <el-tabs v-model="activeName"
                 type="card">
          <el-tab-pane label="操作日志"
                       name="first">
            <div class="query-form"
                 v-if="operationShowFrom">
              <el-form ref="operationForm"
                       :model="operationForm"
                       :rules="rulesFirst">
                <el-form-item label="姓名"
                              prop="name">
                  <el-input v-model="operationForm.name"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="用户"
                              prop="userName">
                  <el-input v-model="operationForm.userName"
                            placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="所属机构"
                              prop="orgName">
                  <el-autocomplete class="inline-input"
                                   size="mini"
                                   v-model="operationForm.orgName"
                                   value-key="name"
                                   :fetch-suggestions="(val, callback)=>{querySearch(1,'org', val,callback)}"
                                   placeholder="请输入机构"
                                   :trigger-on-focus="false"
                                   @select="val=>{selectItem(1,'org', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="客户端类型">
                  <el-select v-model="operationForm.clientType"
                             placeholder="请选择客户端类型">
                    <el-option label="全部"
                               value="0"></el-option>
                    <el-option label="B/S"
                               value="1"></el-option>
                    <el-option label="APP"
                               value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址"
                              prop="ip">
                  <el-input v-model="operationForm.ip"
                            placeholder="请输入IP地址"></el-input>
                </el-form-item>
                <el-form-item label="操作类型">
                  <el-select v-model="operationForm.operateType"
                             placeholder="请选择操作类型">
                    <el-option label="全部"
                               value=""></el-option>
                    <el-option v-for="item in operatelogType"
                               :label="item.value"
                               :key="item.key"
                               :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作对象"
                              prop="object">
                  <el-input v-model="operationForm.object"
                            placeholder="请输入操作对象"></el-input>
                </el-form-item>
                <el-form-item label="操作描述"
                              prop="description">
                  <el-input v-model="operationForm.description"
                            placeholder="请输入操作描述"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker v-model="operationForm.startTime"
                                  type="datetime"
                                  :picker-options="operationPickerStartDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker v-model="operationForm.endTime"
                                  type="datetime"
                                  :picker-options="operationPickerEndDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择结束时间"></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="from-button"
                 v-if="operationShowFrom">
              <el-button size="small"
                         @click="query(1)">查询</el-button>
              <el-button size="small"
                         @click="empty(1)">重置</el-button>
              <el-button size="small"
                         @click="operationGetTabList"
                         :disabled="operationTableData.length===0">导出</el-button>
            </div>
            <el-table :data="operationTableData"
                      style="width: 100%"
                      :height="operationShowFrom?'432px':'686px'"
                      :default-sort="{ prop: 'date', order: 'descending' }"
                      align="left"
                      tooltip-effect="dark"
                      stripe
                      @selection-change="operationHandleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in operationPropData"
                               :key="item.label"
                               :prop="item.prop"
                               :label="item.label"
                               show-overflow-tooltip
                               sortable></el-table-column>
            </el-table>
            <video-pagination ref="listPagination"
                              :total="operationTotal"
                              @paginationConfChange="operationChange"></video-pagination>
          </el-tab-pane>
          <el-tab-pane label="事件日志"
                       name="second">
            <div class="query-form"
                 v-if="eventShowFrom">
              <el-form ref="eventForm"
                       :model="eventForm"
                       :rules="rulesSecond">
                <el-form-item label="所属机构"
                              prop="orgName">
                  <el-autocomplete class="inline-input"
                                   size="mini"
                                   v-model="eventForm.orgName"
                                   value-key="name"
                                   :fetch-suggestions="(val, callback)=>{querySearch(2,'org', val,callback)}"
                                   placeholder="请输入机构"
                                   :trigger-on-focus="false"
                                   @select="val=>{selectItem(2,'org', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位"
                              prop="keyPartName">
                  <el-autocomplete class="inline-input"
                                   size="mini"
                                   v-model="eventForm.keyPartName"
                                   value-key="name"
                                   :fetch-suggestions="(val, callback)=>{querySearch(2,'kp', val,callback)}"
                                   placeholder="请输入重点部位"
                                   :trigger-on-focus="false"
                                   @select="val=>{selectItem(2,'kp', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="防护舱主机名称"
                              prop="deviceName">
                  <el-input v-model="eventForm.deviceName"
                            placeholder="请输入防护舱主机名称"></el-input>
                </el-form-item>
                <el-form-item label="防护舱通道名称"
                              prop="channelName">
                  <el-input v-model="eventForm.channelName"
                            placeholder="请输入防护舱通道名称"></el-input>
                </el-form-item>
                <el-form-item label="日志类型"
                              prop="eventName">
                  <el-input v-model="eventForm.eventName"
                            placeholder="请输入日志类型名称"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker v-model="eventForm.startTime"
                                  type="datetime"
                                  :picker-options="eventPickerStartDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker v-model="eventForm.endTime"
                                  type="datetime"
                                  :picker-options="eventPickerEndDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择结束时间"></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="from-button"
                 v-if="eventShowFrom">
              <el-button size="small"
                         @click="query(2)">查询</el-button>
              <el-button size="small"
                         @click="empty(2)">重置</el-button>
              <el-button size="small"
                         @click="eventGetTabList"
                         :disabled="eventTableData.length===0">导出</el-button>
            </div>
            <el-table :data="eventTableData"
                      style="width: 100%"
                      :height="eventShowFrom?'432px':'686px'"
                      :default-sort="{ prop: 'date', order: 'descending' }"
                      align="left"
                      @selection-change="eventHandleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in eventPropData"
                               :key="item.label"
                               :prop="item.prop"
                               :label="item.label"
                               sortable></el-table-column>
            </el-table>
            <video-pagination ref="listPagination"
                              :total="eventTotal"
                              @paginationConfChange="eventChange"></video-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import {
  operationLog,
  eventLog,
  operatelogType,
  warningListApi,
  eventListApi,
} from '../../http/protectiveCabin/channe.api'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { download } from '@src/common/download.js'
import rules from '@src/assets/rules/validation/security/protectiveCabin.js'
export default {
  components: {
    VideoPagination,
  },
  data() {
    return {
      eventPickerStartDate: {
        disabledDate: (time) => {
          if (!this.eventForm.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.eventForm.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      eventPickerEndDate: {
        disabledDate: (time) => {
          if (!this.eventForm.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.eventForm.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      },
      operationPickerStartDate: {
        disabledDate: (time) => {
          if (!this.operationForm.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.operationForm.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      operationPickerEndDate: {
        disabledDate: (time) => {
          if (!this.operationForm.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.operationForm.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      },
      activeName: 'first',
      orgId: '',
      eventForm: {
        page: '1',
        limit: '25',
        orgName: '',
        keyPartName: '',
        deviceName: '',
        channelName: '',
        eventName: '',
        startTime: '',
        endTime: '',
        orgId: '',
      },
      eventLimit: '',
      eventPage: '',
      eventTableData: [],
      eventMultipleSelection: [],
      eventPropData: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'deviceName', label: '所属防护舱主机', width: '', sortable: 'true' },
        { prop: 'channelName', label: '防护舱通道', width: '', sortable: 'true' },
        { prop: 'eventName', label: '日志类型', width: '', sortable: 'true' },
        { prop: 'occurTime', label: '时间', width: '', sortable: 'true' },
      ],
      eventTotal: 0,
      operationForm: {
        page: '1',
        limit: '25',
        name: '',
        userName: '',
        orgName: '',
        clientType: '',
        ip: '',
        operateType: '',
        object: '',
        description: '',
        startTime: '',
        endTime: '',
      },
      operationTableData: [],
      operationTotal: 0,
      operationPropData: [
        // 表格标题行内容
        { prop: 'name', label: '姓名', width: '', sortable: 'true' },
        { prop: 'userName', label: '用户名', width: '', sortable: 'true' },
        { prop: 'createdAt', label: '时间', width: '', sortable: 'true' },
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'clientType', label: '客户端类型', width: '', sortable: 'true' },
        { prop: 'ip', label: 'IP地址', width: '', sortable: 'true' },
        { prop: 'operateName', label: '操作类型', width: '', sortable: 'true' },
        { prop: 'action', label: '动作', width: '', sortable: 'true' },
        { prop: 'object', label: '操作对象', width: '', sortable: 'true' },
        { prop: 'result', label: '操作结果', width: '', sortable: 'true' },
        { prop: 'description', label: '操作描述', width: '250', sortable: 'true' },
      ],
      operationMultipleSelection: [],
      rulesFirst: rules.first,
      rulesSecond: rules.second,
      eventShowFrom: true,
      operationShowFrom: true,
      operatelogType: [],
      eventWarningList: {},
    }
  },
  watch: {},
  computed: {},
  created() {
    // eventListApi().then((res) => {
    //   this.eventWarningList = res.data.data
    // })
    operatelogType().then((res) => {
      if (res.data.data) {
        this.operatelogType = res.data.data
      }
    })
  },
  mounted() {},
  methods: {
    // changeApi(value) {
    //   if (value == 1) {
    //     warningListApi().then((res) => {
    //       if (res.data.data) {
    //         this.eventWarningList = res.data.data
    //       }
    //     })
    //   } else if (value == 2) {
    //     eventListApi().then((res) => {
    //       this.eventWarningList = res.data.data
    //     })
    //   } else {
    //     this.eventWarningList = {}
    //   }
    // },
    //操作分页
    operationChange(data) {
      this.operationForm.limit = data.limit
      this.operationForm.page = data.page
      this.query(1)
    },

    //事件分页
    eventChange(data) {
      console.log(data)
      this.eventForm.limit = data.limit
      this.eventForm.page = data.page
      this.query(2)
    },

    // 机构/重点部位 下拉选 过滤规则
    querySearch(classType, type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? (classType === 1 ? this.operationForm.orgId : this.eventForm.orgId) : undefined,
      }
      getSearchOrgApi(params)
        .then((res) => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch((err) => {
          console.log(err)
          callback([])
        })
    },

    // 选中 机构/重点部位 下拉选
    selectItem(classType, type, val) {
      if (classType === 1) {
        if (type === 'org') {
          this.operationForm.orgId = val.id
          this.operationForm.orgName = val.name
        } else if (type === 'kp') {
          this.operationForm.keyPartId = val.id
          this.operationForm.keyPartName = val.name
        }
      } else {
        if (type === 'org') {
          this.eventForm.orgId = val.id
          this.eventForm.orgName = val.name
        } else if (type === 'kp') {
          this.eventForm.keyPartId = val.id
          this.eventForm.keyPartName = val.name
        }
      }
    },

    //查询
    query(classType) {
      if (classType === 1) {
        this.$refs['operationForm'].validate((valid) => {
          if (valid) {
            let body = {}
            //过滤空值
            for (let i in this.operationForm) {
              if (this.operationForm[i]) {
                body[i] = this.operationForm[i]
              }
            }
            delete body.orgId
            operationLog(body).then((res) => {
              if (res.data.data && res.data.data.logs) {
                res.data.data.logs.forEach((element, index) => {
                  element.index = index
                  element.clientType = element.clientType == 1 ? 'B/S' : 'APP'
                  element.result = element.result == 1 ? '成功' : element.result == 2 ? '失败' : element.result
                })
                this.operationTableData = res.data.data.logs
                this.operationTotal = res.data.data.page.totalNumber
              } else {
                this.operationTableData = []
                this.operationTotal = 0
              }
            })
          }
        })
      } else {
        this.$refs['eventForm'].validate((valid) => {
          if (valid) {
            let body = {}
            //过滤空值
            for (let i in this.eventForm) {
              if (this.eventForm[i]) {
                body[i] = this.eventForm[i]
              }
            }
            delete body.orgId
            delete body.keyPartId
            eventLog(body).then((res) => {
              if (res.data.data && res.data.data.cabins) {
                res.data.data.cabins.forEach((item, index) => {
                  item.index = index
                })
                this.eventTableData = res.data.data.cabins
                this.eventTotal = res.data.data.page.totalNumber
              } else {
                this.eventTableData = []
                this.operationTotal = 0
              }
            })
          }
        })
      }
    },

    //清空
    empty(classType) {
      if (classType === 1) {
        this.operationForm = {
          page: '1',
          limit: '100',
          name: '',
          userName: '',
          orgName: '',
          clientType: '',
          ip: '',
          type: '',
          object: '',
          description: '',
          startTime: '',
          endTime: '',
        }
      } else {
        this.eventForm = {
          page: '1',
          limit: '100',
          orgName: '',
          keyPartName: '',
          deviceName: '',
          eventType: '',
          startTime: '',
          endTime: '',
          orgId: '',
        }
      }
    },

    operationHandleSelectionChange(val) {
      this.operationMultipleSelection = val
    },

    eventHandleSelectionChange(val) {
      this.eventMultipleSelection = val
    },

    //事件导出
    eventGetTabList() {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      let tHeader = this.eventPropData.map((item) => item.label)
      let filterVal = this.eventPropData.map((item) => item.prop)
      filterVal.unshift('index')
      tHeader.unshift('序号')
      let list = []
      if (this.eventMultipleSelection && this.eventMultipleSelection.length > 0) {
        list = this.eventMultipleSelection
        const data = list.map((v) => filterVal.map((j) => v[j]))
        export_json_to_excel(
          tHeader,
          data,
          `防护舱事件日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else if (this.eventMultipleSelection.length == 0) {
        let query = {
          ...this.eventForm,
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/cabin/v1/record/explode`
        let name = `防护舱事件日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'get',
          query
        )
        // list = this.aisleTableData
      }
    },

    //操作导出
    operationGetTabList() {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      let tHeader = this.operationPropData.map((item) => item.label)
      let filterVal = this.operationPropData.map((item) => item.prop)
      filterVal.unshift('index')
      tHeader.unshift('序号')
      let list = []
      if (this.operationMultipleSelection && this.operationMultipleSelection.length > 0) {
        list = this.operationMultipleSelection
        const data = list.map((v) => filterVal.map((j) => v[j]))
        export_json_to_excel(
          tHeader,
          data,
          `防护舱操作日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else if (this.operationMultipleSelection.length == 0) {
        let query = {
          ...this.operationForm,
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/cabin/v1/operatelog/explode`
        let name = `防护舱操作日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'get',
          query
        )
        // list = this.aisleTableData
      }
    },
  },

  mounted() {},
}
</script>

<style scoped lang='less'>
.log-box {
  width: 100%;
  height: 100%;
  background: #eaeef3;
  padding: 6px 6px 0px 6px;
  box-sizing: border-box;
  .log-content {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 0 21px 0 19px;
    box-sizing: border-box;
    .titel {
      padding: 17px 0 24px;
      span {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .active {
        color: #2d72d3;
      }
    }
    .query-box {
      width: 100%;
      position: relative;
      .show-from {
        width: 37px;
        height: 35px;
        border: 1px solid #9eadc1;
        position: absolute;
        right: 0px;
        top: 20px;
        cursor: pointer;
        text-align: center;
        i {
          color: #333;
          font-size: 18px;
          line-height: 35px;
          font-weight: 600;
        }
      }
      /deep/.el-tabs {
        height: calc(~'100% - 1px');
        .el-tabs__header {
          border-bottom: 1px solid #e1e1e1;
          margin-bottom: 19px;
          width: calc(~'100% - 75px');
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
      .query-form {
        width: 100%;
        background: rgba(245, 245, 245, 1);
        padding: 16px 16px 2px 16px;
        box-sizing: border-box;
        /deep/ .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            margin-right: 23px;
            display: inline-block;
            width: 19.23%;
            .el-form-item__label {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              width: 96px;
            }
            .el-form-item__content {
              display: inline-block;
              width: calc(~'100% - 96px');
              .el-select {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-autocomplete {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-input {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                }
              }
            }
          }
          .el-form-item:first-child {
            width: 17.27%;
            .el-form-item__label {
              width: 60px;
            }
            .el-form-item__content {
              width: calc(~'100% - 60px');
            }
          }
          .el-form-item:nth-child(5n) {
            margin-right: 0px;
          }
          .el-form-item:nth-child(5n + 1) {
            width: 17.27%;
            .el-form-item__label {
              width: 60px;
            }
            .el-form-item__content {
              width: calc(~'100% - 60px');
            }
          }
        }
      }
      .from-button {
        width: 100%;
        text-align: center;
        margin: 22px 0 44px;
      }
    }
  }
}
</style>