
<!--
 * @Author: your name
 * @Date: 2020-06-08 15:43:29
 * @LastEditTime: 2020-06-08 16:03:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\shiftLogSearch.vue
-->
<template>
  <div class="shift-log">
    <div style="margin:10px 0 0 20px;">
        <div style="width:100%;">
          查询条件
          <i style="cursor: pointer;" @click="searchConditionsDis" :class="shiftLogSearchConditionsIsShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="shift-log-top" v-if="shiftLogSearchConditionsIsShow">
        <p>交接班日志查询</p>
        <div class="shift-log-inquire">
            <div class="shift-log-select">
                <ul>
                    <li>
                        <i>交班人姓名</i>
                        <el-input v-model="formInline.userName" placeholder="" size="mini"></el-input>
                    </li>
                    <li>
                        <i>接班人姓名</i>
                        <el-input v-model="formInline.nextUserName" placeholder="" size="mini"></el-input>
                    </li>
                    <li>
                        <i>交班时间</i>
                        <el-date-picker
                          size="mini"
                          v-model="formInline.closeTime"
                          type="datetime"
                          placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                    </li>
                    <li>
                        <i>接班时间</i>
                        <el-date-picker
                          size="mini"
                          v-model="formInline.dutyTime"
                          type="datetime"
                          placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                    </li>
                    <li>
                        <i>值班时间</i>
                        <el-date-picker
                          size="mini"
                          v-model="formInline.officeTime"
                          type="datetime"
                          placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                        <!-- <el-input v-model="formInline.officeTime" size="mini"></el-input> -->
                    </li>
                    <li>
                        <i>接班状态</i>
                        <el-select v-model="formInline.status"  placeholder="" style="width:100%;" size="mini">
                          <el-option v-for="(item,index) in dutyStatus" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <!-- <el-input v-model="formInline.officeTime" size="mini"></el-input> -->
                    </li>
                </ul>
            </div>
            <div class="shift-log-btn">
                <el-button type="primary" icon="el-icon-search" @click="inquireClick" size="small">查询</el-button>
                <el-button @click="resetClick" size="small">重置</el-button>
            </div>
        </div>
      </div>
      <div style="margin:10px 0 20px 20px;">
        <div style="width:100%;">
          查询结果
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <div style="margin-bottom:20px;font-size:16px;">
            <el-button  size="small" :disabled="shiftChangeLogTableData.length === 0" @click="exportFile">导出</el-button>
            <el-button  size="small" :disabled="shiftChangeLogTableData.length === 0" icon="el-icon-printer" @click="print">打印</el-button>
            <el-button  size="small" :disabled="selectData.length === 0" icon="el-icon-delete" @click="deleteShiftLog">删除</el-button>
          </div>
          <el-table stripe border size="medium" :data="shiftChangeLogTableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="350" max-height="350" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
  </div>
</template>

<script>
import { download } from '@src/common/download.js'
import { getShiftsLogApi, deletedutyListApi } from '@src/http/dutyManagement/dutyManagement.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  components: {
    VideoPagination
  },
  name: 'shiftLogSearch',
  data() {
    return {
      // 交接班记录列表数据
      shiftChangeLogTableData: [],
      columns: [
        { prop: 'userName', sortable: true, label: '交班人姓名', width: '' },
        { prop: 'userPhone', sortable: true, label: '联系电话', width: '' },
        { prop: 'officeTime', sortable: true, label: '值班时间', width: '' },
        { prop: 'closeTime', sortable: true, label: '交班时间', width: '' },
        { prop: 'alarmTotal', sortable: true, label: '报警事件', width: '' },
        { prop: 'faultTotal', sortable: true, label: '故障报修', width: '' },
        { prop: 'checkTotal', sortable: true, label: '检查记录', width: '' },
        { prop: 'eventTotal', sortable: true, label: '事件记录', width: '' },
        { prop: 'nextUserName', sortable: true, label: '接班人姓名', width: '' },
        { prop: 'nextUserPhone', sortable: true, label: '联系电话', width: '' },
        { prop: 'dutyTime', sortable: true, label: '接班时间', width: '' },
        { prop: 'status', sortable: true, label: '接班状态', width: '' }
      ],
      selectData: [], // 选中数据
      obj: {},
      resizable: false,
      formInline: {
        userName: '', // 交班人姓名
        nextUserName: '', // 接班人姓名
        closeTime: '', // 交班时间
        dutyTime: '', // 接班时间
        officeTime: '', // 值班时间
        pageSize: 10,
        page: 1,
        status: ''
      },
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1
      },
      dutyStatus: [
        {value: 1, label: '全部'},
        {value: 2, label: '接班'},
        {value: 3, label: '拒绝'}
      ],
      shiftLogSearchConditionsIsShow: true
    }
  },
  created() {
  },
  methods: {
    // 分页组件方法
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getDutyListApiFuc()
    },
    /**
     * @description:  交接班日志查询按钮
     * @param {无}
     * @return: 无
     */
    inquireClick() {
      this.getDutyListApiFuc()
    },
    getDutyListApiFuc() {
      if (this.formInline.closeTime === '' || this.formInline.officeTime === '') {
        return this.$messageError('请选择交班时间和值班时间')
      }
      this.formInline = {
        closeTime: new Date(this.formInline.closeTime).getTime(),
        officeTime: new Date(this.formInline.officeTime).getTime(),
        ...this.formInline,
        ...this.paginationConfig
      }
      getShiftsLogApi(this.formInline).then(res => {
        if (res.data.code === 0) {
          res.data.data.results.forEach((it, i) => {
            this.shiftChangeLogTableData.push(it.duty)
            this.shiftChangeLogTableData[i].id = it.id
          })
          this.shiftChangeLogTableData = this.handleData(this.shiftChangeLogTableData)
        } else {
          this.$messageError('查询失败')
        }
      })
        .catch(err => {
          console.log(err, '查询交接班日志失败')
        })
    },
    // 表格数据格式化
    handleData(data) {
      let arr = JSON.parse(JSON.stringify(data))
      arr.forEach((item, index) => {
        if (item.status === 1) {
          item.status = '值班中'
        } else if (item.status === 2) {
          item.status = '挂起'
        } else if (item.status === 3) {
          item.status = '交班'
        }
      })
      return arr
    },
    /**
     * @description:  交接班日志查询重置按钮
     * @param {无}
     * @return: 无
     */
    resetClick() {
      this.formInline = {...this.obj}
    },
    /**
     * @description:  列表勾选
     * @param {无}
     * @return: 无
     */
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    /**
     * @description:  表格排序
     * @param {无}
     * @return: 无
     */
    sortChange(a) {
      console.log(a)
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    // 导出
    exportFile() {
      if (this.selectData.length !== 0) {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['交班人姓名', '联系电话', '值班时间', '交班时间', '报警事件', '故障报修', '检查记录', '事件记录', '接班人姓名', '联系电话', '接班时间', '接班状态']
        const filterVal = ['userName', 'userPhone', 'officeTime', 'closeTime', 'alarmTotal', 'faultTotal', 'checkTotal', 'eventTotal', 'nextUserName', 'nextUserPhone', 'dutyTime', 'status']
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
        list = this.shiftChangeLogTableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'username', displayName: '交班人姓名' },
          { field: 'userPhone', displayName: '联系电话' },
          { field: 'officeTime', displayName: '值班时间' },
          { field: 'closeTime', displayName: '交班时间' },
          { field: 'alarmTotal', displayName: '报警事件' },
          { field: 'faultTotal', displayName: '故障报修' },
          { field: 'checkTotal', displayName: '检查记录' },
          { field: 'eventTotal', displayName: '事件记录' },
          { field: 'nextUserName', displayName: '接班人姓名' },
          { field: 'nextUserPhone', displayName: '联系电话' },
          { field: 'dutyTime', displayName: '接班时间' },
          { field: 'status', displayName: '接班状态' }
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
    /**
     * @description:  列表删除
     * @param {无}
     * @return: 无
     */
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
    },
    /**
     * @description:  查询条件显隐控制
     * @param {无}
     * @return: 无
     */
    searchConditionsDis() {
      this.shiftLogSearchConditionsIsShow = !this.shiftLogSearchConditionsIsShow
    }
  }
}
</script>

<style scoped lang="less">
.shift-log {
  padding: 5px;
  height: 100%;
  overflow: hidden;
  .shift-log-top {
    width: 870px;
    margin: 0 auto;
    p {
      padding: 10px 0;
      font-size: 16px;
      text-align:center;
    }
  }
  .main {
    width: 100%;
    height: 64%;
    margin-left: 10px;
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
  .host-header {
    margin-bottom: 15px;
  }
  .shift-log-inquire {
    margin: 10px 0;
    .shift-log-select {
      width: 866px;
      overflow: hidden;
      border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
        margin: 10px;
        li {
          float: left;
          width: 420px;
          margin: 0 2px 2px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 136px;
            line-height: 32px;
            text-align: center;
            background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input {
            width: 270px!important;
            margin-top: 2px;
          }
          .el-select {
            width: 270px!important;
            margin-top: 2px;
          }
        }
      }
    }
    .shift-log-btn {
      width: 866px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;
    i {
      float: left;
      width: 4%;
      font-size: 14px;
    }
    .zone-header-line {
      float: right;
      width: 96%;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
.shift-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.shift-log .el-form--inline .el-form-item__content {
  width: 200px !important;
}
</style>
