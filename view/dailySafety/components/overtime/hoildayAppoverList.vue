<template>
  <div id="hoildayAppoverList">
    <div v-show="!isShowDetail">
      <div class="meus">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>节假日加班人员管理</el-breadcrumb-item>
          <el-breadcrumb-item>已审批列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="btns">
        <el-button size="mini" @click="handleDelete">删除</el-button>
        <el-button size="mini" @click="exportFile">导出</el-button>
        <el-button size="mini" @click="Toprint">打印</el-button>
      </div>
      <!-- 表格 -->
      <div class="list-box-table">
        <el-table
          stripe
          border
          size="medium"
          :data="tableData"
          @select="select"
          height="100%"
          max-height="770"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column
            v-for="(column, index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center"
            :resizable="true"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-link :underline="false" @click="back('已审批', scope.row)">查看</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
    <holiday-apply-detail
    v-show="isShowDetail"
    :isShowDetail.sync="isShowDetail"
    :title.sync="title"
    :detailList="detailList"></holiday-apply-detail>
  </div>
</template>

<script>
import holidayApplyDetail from './holidayApplyDetail'
export default {
  name: 'personnerlList',
  components: {
    holidayApplyDetail
  },
  data() {
    return {
      title: '',
      isShowDetail: false,
      detailList: {},
      tableData: [{
        mechanism: '12345',
        keyUnits: '12345',
        applicationId: '12345',
        location: '12345',
        startTime: '12345',
        endTime: '12345',
        peopleName: '12345',
        matter: '12345',
        status: '12345',
        matters: '12345'
      }, {}],
      columns: [
        { prop: 'mechanism', sortable: true, label: '申请人', width: '' },
        { prop: 'keyUnits', sortable: true, label: '申请编号', width: '' },
        { prop: 'applicationId', sortable: true, label: '所属机构', width: '' },
        { prop: 'location', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'status', sortable: true, label: '加班地点', width: '' },
        { prop: 'startTime', sortable: true, label: '开始时间', width: '' },
        { prop: 'endTime', sortable: true, label: '结束时间', width: '' },
        { prop: 'peopleName', sortable: true, label: '加班人员', width: '' },
        { prop: 'matter', sortable: true, label: '加班事项', width: '' },
        { prop: 'matters', sortable: true, label: '审批状态', width: '' }
      ],
      dropdownStatus: {
        detector: true
      },
      isShowList: false
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    back(title, row) {
      this.isShowDetail = true
      this.detailList = row
      this.title = title
    },
    select() {},
    collEvent(val) {},
    handleDelete() {},
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '申请人',
        '申请编号',
        '所属机构',
        '所属重点部位',
        '加班地点',
        '开始时间',
        '结束时间',
        '加班人员',
        '加班事项',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'mechanism',
        'keyUnits',
        'applicationId',
        'location',
        'status',
        'startTime',
        'endTime',
        'peopleName',
        'matter',
        'matters'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '已审批列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // eslint-disable-next-line no-undef
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'mechanism', displayName: '录入人' },
          { field: 'keyUnits', displayName: '申请编号' },
          { field: 'applicationId', displayName: '所属机构' },
          { field: 'location', displayName: '所属重点部位' },
          { field: 'status', displayName: '加班地点' },
          { field: 'startTime', displayName: '开始时间' },
          { field: 'endTime', displayName: '结束时间' },
          { field: 'peopleName', displayName: '加班人员' },
          { field: 'matter', displayName: '加班事项' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">待审批列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  }
}
</script>
<style lang="less" scoped>
#hoildayAppoverList {
  height: 100%;
  .btns {
    margin: 10px;
  }
  .pagination {
    text-align: right;
    margin-top: 30px;
  }
}
</style>
