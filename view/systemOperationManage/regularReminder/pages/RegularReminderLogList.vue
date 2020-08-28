<!--
 * @Author: your name
 * @Date: 2020-06-27 08:51:17
 * @LastEditTime: 2020-06-27 16:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\regularReminder\pages\RegularReminderLogList.vue
-->
<template>
  <div class="regular-reminder-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
          <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="100%" max-height="740" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
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
import VideoPagination from '../../../videoManage/components/VideoPagination'
import { getRegularlyRemindedListApi } from '@src/http/systemOperationManage/regularReminder.api'
export default {
  name: 'RegularReminderLogList',
  components: {
    VideoPagination
  },
  data() {
    return {
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'Addr', sortable: true, label: 'IP/MAC地址', width: '' },
        { prop: 'name', sortable: true, label: '姓名', width: '' },
        { prop: 'time', sortable: true, label: '提醒时间', width: '' }
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
    this.getRegularlyRemindedListApiFuc()
  },
  methods: {
    // 获取定时提醒列表
    getRegularlyRemindedListApiFuc() {
      getRegularlyRemindedListApi(this.paginationConfig).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list || []
          this.total = res.data.data.page.totalNumber || 0
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
      console.log(val, '列表勾选')
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getRegularlyRemindedListApiFuc()
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['所属机构', 'IP/MAC地址', '姓名', '提醒时间']
      const filterVal = ['orgName', 'Addr', 'name', 'time']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '定时提醒日志列表')
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
          { field: 'orgName', displayName: '所属机构' },
          { field: 'Addr', displayName: 'IP/MAC地址' },
          { field: 'name', displayName: '姓名' },
          { field: 'time', displayName: '提醒时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">定时提醒日志列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/elementModify.less';
.regular-reminder-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 70px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
