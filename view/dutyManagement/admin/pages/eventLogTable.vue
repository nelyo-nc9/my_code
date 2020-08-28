<!--
 * @Author: your name
 * @Date: 2020-07-01 11:21:11
 * @LastEditTime: 2020-07-01 17:55:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\eventLogTable.vue
-->
<template>
  <div class="event-log-table-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>值班管理</el-breadcrumb-item>
          <el-breadcrumb-item>事件记录</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="selectData.length ===0" @click="deleteTableList" icon="el-icon-delete">删除</el-button>
          <el-button size="small" :disabled="tableData.length ===0" @click="exportFile">导出</el-button>
          <el-button size="small" :disabled="tableData.length ===0" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
      </div>
      <p>事件记录列表</p>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="660" max-height="660" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="操作" width="" align="center">
              <template slot-scope="scope">
                <i class="button"  @click="eventRecordHandleClick(scope.row)">查看</i>
                <i class="button" @click="deleteEventRecordBtn(scope.row)">删除</i>
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
    </div>
    <!-- 事件记录详情弹框 -->
    <el-dialog :visible.sync="eventRecordDialogVisible" :before-close="eventRecordDialogHandleClose" width="400px">
      <div slot="title" class="dialog-title" style="height:35px;line-height:35px;font-size:16px;">
        <div style="float:left">
          <span>事件记录</span>
        </div>
        <div style="float:right;margin-right:30px;font-size:16px;cursor: pointer;" v-print="'#contentinfo'">
          <span title="打印" class="el-icon-printer"></span>
        </div>
      </div>
      <div style="padding-right:20px;" id="contentinfo">
        <el-form class="form" :model="eventRecordForm">
          <el-form-item label="发起人" :label-width="formLabelWidth">
            <el-input v-model="eventRecordForm.username" readonly></el-input>
          </el-form-item>
          <el-form-item label="资源信息" :label-width="formLabelWidth">
            <el-input v-model="eventRecordForm.channelName" readonly></el-input>
          </el-form-item>
          <el-form-item label="位置信息" :label-width="formLabelWidth">
            <el-input v-model="eventRecordForm.location" readonly></el-input>
          </el-form-item>
          <el-form-item label="事件类型" :label-width="formLabelWidth">
            <el-input v-model="eventRecordForm.event" readonly></el-input>
          </el-form-item>
          <el-form-item label="事件描述" :label-width="formLabelWidth">
            <el-input v-model="eventRecordForm.desc" type="textarea" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { download } from '@src/common/download.js'
import { eventlogApi, deleteEventlogApi } from '@src/http/dutyManagement/dutyManagement.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  components: {
    VideoPagination
  },
  name: 'eventLogTable',
  data() {
    return {
      columns: [
        { prop: 'username', sortable: true, label: '发起人', width: '' },
        { prop: 'channelName', sortable: true, label: '资源信息', width: '' },
        { prop: 'location', sortable: true, label: '位置信息', width: '' },
        { prop: 'event', sortable: true, label: '事件类型', width: '' },
        { prop: 'desc', sortable: true, label: '事件描述', width: '' }
      ],
      // 事件记录表单内容
      eventRecordForm: {
        username: '',
        channelName: '',
        location: '',
        event: '',
        desc: ''
      },
      eventRecordDialogVisible: false,
      // 表单label宽度
      formLabelWidth: '80px',
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      paginationConfig: {
        limit: 100,
        page: 1
      }
    }
  },
  computed: {
  },
  created() {
    this.eventlogApiFuc()
  },
  methods: {
    eventlogApiFuc() {
      eventlogApi().then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.logs || []
          this.total = res.data.data.total
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // handelData(list) {
    //   let arr = JSON.parse(JSON.stringify(list))
    //   arr.forEach(item => {
    //   })
    // },
    // 分页组件方法
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },
    eventRecordHandleClick(row) {
      this.eventRecordDialogVisible = true
      this.eventRecordForm = JSON.parse(JSON.stringify(row))
    },
    // 事件记录详情弹窗关闭按钮
    eventRecordDialogHandleClose() {
      this.eventRecordDialogVisible = false
    },
    // 事件记录表格删除按钮
    deleteEventRecordBtn(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          ids: row.id
        }
        this.deleteEventlogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteEventlogApiFuc(ids) {
      deleteEventlogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.eventlogApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 批量删除
    deleteTableList() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        this.selectData.forEach(item => {
          ids.push(item.id)
        })
        let param = {
          ids: ids.join(',')
        }
        this.deleteEventlogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/daily/v1/duty/eventlog/explode`
        let name = `事件记录导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'get', '')
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['发起人', '资源信息', '位置信息', '事件类型', '事件描述']
        const filterVal = ['username', 'channelName', 'location', 'event', 'desc']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '事件记录列表')
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
          { field: 'username', displayName: '发起人' },
          { field: 'channelName', displayName: '资源信息' },
          { field: 'location', displayName: '位置信息' },
          { field: 'event', displayName: '事件类型' },
          { field: 'desc', displayName: '事件描述' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">事件记录列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.event-log-table-box {
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
      height: calc(~'100% - 170px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
        .button {
          cursor: pointer;
          color: cornflowerblue;
        }
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
  .el-dialog__header {
    padding: 15px 20px 10px;
  }
}
</style>
