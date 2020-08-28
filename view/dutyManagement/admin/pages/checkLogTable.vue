<!--
 * @Author: your name
 * @Date: 2020-07-01 10:49:39
 * @LastEditTime: 2020-07-01 16:26:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\checkLogTable.vue
-->
<template>
  <div class="check-log-table-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>值班管理</el-breadcrumb-item>
          <el-breadcrumb-item>检查记录</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="selectData.length === 0" @click="deleteTableList" icon="el-icon-delete">删除</el-button>
          <el-button size="small" :disabled="tableData.length === 0" @click="exportFile">导出</el-button>
          <el-button size="small" :disabled="tableData.length === 0" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
      </div>
      <p>检查记录列表</p>
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
                <i class="button" @click="checkLogHandleClick(scope.row)">查看</i>
                <i class="button" @click="deleteCheckLog(scope.row)">删除</i>
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
  </div>
</template>

<script>
import Bus from '../common/Bus'
import { download } from '@src/common/download.js'
import { checklogApi, deleteChecklogApi } from '@src/http/dutyManagement/dutyManagement.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  components: {
    VideoPagination
  },
  name: 'checkLogTable',
  data() {
    return {
      columns: [
        { prop: 'orgName', sortable: true, label: '机构', width: '' },
        { prop: 'keyPartName', sortable: true, label: '重点部位', width: '' },
        { prop: 'channelName', sortable: true, label: '镜头', width: '' },
        { prop: 'action', sortable: true, label: '检查动作', width: '' },
        { prop: 'time', sortable: true, label: '记录时间', width: '' },
        { prop: 'username', sortable: true, label: '值班员', width: '' },
        { prop: 'event', sortable: true, label: '检查类型', width: '' },
        { prop: 'project', sortable: true, label: '检查项目', width: '' },
        { prop: 'desc', sortable: true, label: '内容描述', width: '' },
        { prop: 'updatedDept', sortable: true, label: '填写单位', width: '' },
        { prop: 'updatedAt', sortable: true, label: '填写时间', width: '' }
      ],
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
    this.checklogApiFuc()
  },
  methods: {
    checklogApiFuc() {
      checklogApi().then(res => {
        if (res.data.code === 0) {
          this.tableData = this.handelData(res.data.data.logs)
          this.total = res.data.data.total
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    handelData(list) {
      let arr = JSON.parse(JSON.stringify(list)) || []
      arr.forEach(item => {
        if (item.event === 'MANUALRECORD') {
          item.event = '紧急录像'
          item.time = this.$moment(Number(item.startTime)).format('YYYY-MM-DD HH:mm:ss') + '-' + this.$moment(Number(item.endTime)).format('YYYY-MM-DD HH:mm:ss')
        } else if (item.event === 'SCREENSHOT') {
          item.event = '抓图'
          item.time = item.createAt
        }
      })
      return arr
    },
    checkLogHandleClick(row) {
      Bus.$emit('checkLogTable', true, row)
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
        this.deleteChecklogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 检查记录表格删除按钮
    deleteCheckLog(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          ids: row.id
        }
        this.deleteChecklogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteChecklogApiFuc(ids) {
      deleteChecklogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.checklogApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
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
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    // 导出
    exportFile() {
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/daily/v1/duty/checklog/explode`
        let name = `检查记录导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'get', '')
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['机构', '重点部位', '镜头', '检查动作', '记录时间', '值班员', '检查类型', '检查项目', '内容描述', '填写单位', '填写时间']
        const filterVal = ['org', 'keyPartName', 'channelName', 'action', 'time', 'username', 'event', 'project', 'desc', 'updatedDept', 'updatedAt']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '检查记录列表')
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
          { field: 'org', displayName: '机构' },
          { field: 'keyPartName', displayName: '重点部位' },
          { field: 'channelName', displayName: '镜头' },
          { field: 'action', displayName: '检查动作' },
          { field: 'time', displayName: '记录时间' },
          { field: 'username', displayName: '值班员' },
          { field: 'event', displayName: '检查类型' },
          { field: 'project', displayName: '检查项目' },
          { field: 'desc', displayName: '内容描述' },
          { field: 'updatedDept', displayName: '填写单位' },
          { field: 'updatedAt', displayName: '填写时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">检查记录列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.check-log-table-box {
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
          color: cornflowerblue;
          cursor: pointer;
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
}
</style>
