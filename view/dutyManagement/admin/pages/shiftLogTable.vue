<!--
 * @Author: your name
 * @Date: 2020-07-01 14:21:11
 * @LastEditTime: 2020-07-01 18:17:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\shiftLogTable.vue
-->
<template>
  <div class="shift-log-table-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>值班管理</el-breadcrumb-item>
          <el-breadcrumb-item>交接班日志</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          <el-breadcrumb-item v-if="checkShiftLogStatus">详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button @click="checkShiftLogStatus = false" v-if="checkShiftLogStatus" size="small">返回</el-button>
          <el-button size="small" :disabled="selectData.length === 0" icon="el-icon-delete" @click="deleteShiftLog">删除</el-button>
          <el-button size="small" :disabled="tableData.length === 0" @click="exportFile">导出</el-button>
          <el-button size="small" :disabled="tableData.length === 0" icon="el-icon-printer">打印</el-button>
        </div>
      </div>
      <p v-if="!checkShiftLogStatus">交接班日志列表</p>
      <p v-if="checkShiftLogStatus">交班信息表</p>
      <div class="main" v-if="!checkShiftLogStatus">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange"  @sort-change="sortChange" ref="Table" height="640" max-height="640" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="操作" width="" align="center">
              <template slot-scope="scope">
                <el-button @click="checkShiftChangeLog(scope.row)" type="text" size="medium">查看</el-button>
                <el-button @click="deleteShiftChangeLog(scope.row)" type="text" size="medium">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
      <dutyInfoTable ref="dutyInfoTable"  v-if="checkShiftLogStatus"></dutyInfoTable>
    </div>
  </div>
</template>

<script>
import Bus from '../common/Bus'
import { download } from '@src/common/download.js'
import dutyInfoTable from './dutyInfoTable'
import VideoPagination from '../../../videoManage/components/VideoPagination'
import { deletedutyListApi, getShiftsLogApi, getDutyInfoApi } from '../../../../http/dutyManagement/dutyManagement.api'
export default {
  components: {
    dutyInfoTable,
    VideoPagination
  },
  name: 'eventLogTable',
  data() {
    return {
      columns: [
        { prop: 'userName', sortable: true, label: '交班人姓名', width: '' },
        { prop: 'userPhone', sortable: true, label: '联系电话', width: '' },
        { prop: 'nextUserName', sortable: true, label: '接班人姓名', width: '' },
        { prop: 'nextUserPhone', sortable: true, label: '联系电话', width: '' },
        { prop: 'closeTime', sortable: true, label: '交班时间', width: '' },
        { prop: 'officeTime', sortable: true, label: '值班时间', width: '' },
        { prop: 'alarmTotal', sortable: true, label: '报警事件', width: '' },
        { prop: 'faultTotal', sortable: true, label: '故障报修', width: '' },
        { prop: 'checkTotal', sortable: true, label: '检查记录', width: '' },
        { prop: 'eventTotal', sortable: true, label: '事件记录', width: '' }
      ],
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      paginationConfig: {
        limit: 100,
        page: 1
      },
      checkShiftLogStatus: false
    }
  },
  computed: {
  },
  created() {
    this.getDutyListApiFuc()
    this.checkShiftChangeLog('7')
  },
  methods: {
    // 通过列表查看交接班日志详情
    checkShiftChangeLog(row) {
      this.checkShiftLogStatus = true
      let id = '7'
      getDutyInfoApi(id).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('日志详情获取成功')
          Bus.$emit('shiftInfo', res.data.data.details[0])
        } else {
          this.$messageError('日志详情获取失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    deleteShiftChangeLog(row) {
      let param = {
        ids: []
      }
      param.ids.push(row.id)
      this.deletedutyListApiFuc(param)
    },
    // 获取交接班日志列表
    getDutyListApiFuc() {
      // let param = {
      //   skip: this.paginationConfig.page,
      //   limit: this.paginationConfig.limit
      // }
      getShiftsLogApi().then(res => {
        this.tableData = []
        if (res.data.code === 0) {
          res.data.data.results.forEach((it, i) => {
            this.tableData.push(it.duty)
            this.tableData[i].id = it.id
          })
        } else {
          this.$messageError('获取失败', '提示')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 分页组件方法
    paginationConfChange(obj) {
      console.log(obj)
      this.paginationConfig = obj
      this.getDutyListApiFuc()
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(this.selectData, '列表勾选')
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    // 导出
    exportFile() {
      if (this.selectData.length !== 0) {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['交班人姓名', '联系电话', '接班人姓名', '联系电话', '交班时间', '值班时间', '报警事件', '故障报修', '检查记录', '事件记录']
        const filterVal = ['userName', 'userPhone', 'nextUserName', 'nextUserPhone', 'closeTime', 'officeTime', 'alarmTotal', 'faultTotal', 'checkTotal', 'eventTotal']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '交接班日志列表')
      } else {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/daily/v1/duty/shiftslog/explode`
        let name = `交接班日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'get', '')
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'username', displayName: '交班人姓名' },
          { field: 'userPhone', displayName: '联系电话' },
          { field: 'nextUserName', displayName: '接班人姓名' },
          { field: 'nextUserPhone', displayName: '联系电话' },
          { field: 'closeTime', displayName: '交班时间' },
          { field: 'officeTime', displayName: '值班时间' },
          { field: 'alarmTotal', displayName: '报警事件' },
          { field: 'faultTotal', displayName: '故障报修' },
          { field: 'checkTotal', displayName: '检查记录' },
          { field: 'eventTotal', displayName: '事件记录' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">交接班日志列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 删除
    deleteShiftLog() {
      let param = {
        ids: []
      }
      this.selectData.forEach(item => {
        param.ids.push(item.id)
      })
      this.deletedutyListApiFuc(param)
    },
    deletedutyListApiFuc(param) {
      deletedutyListApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
        } else {
          this.$messageError('删除失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.shift-log-table-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left:10px;
    p {
      width: 100%;
      height: 40px;
      font-size: 16px;
      text-align: center;
      }
    .directory {
      overflow: hidden;
      margin-top: 10px;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
      .breadcrumb {
        margin-top:3px;
      }
    }
    .top {
      width: 100%;
      height: 50px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 165px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
      .main-footer {
        height: 40px;
        width: 500px;
        margin: 0 auto;
      // display: flex;
      // justify-content: center;
      // align-items: flex-end;
      }
    }
  }
}
</style>
