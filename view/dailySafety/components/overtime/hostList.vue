<template>
  <div id="hostList">
    <div v-if="!isShowDetail && !isMap">
      <div class="meus">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>施工加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>施工区域管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="btns">
        <el-button size="mini" @click="exportFile">
          <i class="icon iconfont-ccb ccbdaoru el-icon-"></i>
          导出
        </el-button>
        <el-button size="mini" @click="Toprint">
          <i class="el-icon-printer"></i>
          打印
        </el-button>
      </div>
      <div class="Subsidiaries">
        <el-checkbox v-model="checked">显示子机构</el-checkbox>
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
                <el-link :underline="false" @click="handleDetail('查看', scope.row)">查看</el-link>
                <el-link :underline="false" @click="handleEdit(scope.row)">投射区域</el-link>
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
    <apply-detail
      v-if="isShowDetail && !isMap"
      :isShowDetail.sync="isShowDetail"
      :title.sync="title"
      :detailList="detailList">
      </apply-detail>
    <map-list
      v-if="isMap"
      :isMap.sync="isMap"
      :detailList="detailList">
    </map-list>
  </div>
</template>
<script>
import applyDetail from './applyDetail'
import mapList from './map'
export default {
  name: 'constructionList',
  components: {
    applyDetail,
    mapList
  },
  data() {
    return {
      isShowDetail: false,
      detailList: {},
      title: '',
      // tableData: [{ status: '已保存', }, { status: '审批中' }, { status: '已结束' }, { status: '已通过' }],
      columns: [
        { prop: 'peoples', sortable: true, label: '申请人', width: '' },
        { prop: 'applicationId', sortable: true, label: '申请编号', width: '' },
        { prop: 'mechanism', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyUnits', sortable: true, label: '所属重点领域', width: '' },
        { prop: 'unit', sortable: true, label: '施工单位', width: '' },
        { prop: 'address', sortable: true, label: '施工区域', width: '' },
        { prop: 'state', sortable: true, label: '开始时间', width: '' },
        { prop: 'end', sortable: true, label: '结束时间', width: '' },
        { prop: 'peopleName', sortable: true, label: '施工人员', width: '' },
        { prop: 'status', sortable: true, label: '审批状态', width: '' }
      ],
      tableData: [
        {
          peoples: 'zs',
          applicationId: 'app',
          mechanism: 'nos',
          keyUnits: 'key',
          unit: 'state',
          address: 'address',
          state: 'start',
          end: 'end',
          peopleName: 'peopleName',
          status: '已审批'
        },
        {
          peoples: 'ls',
          applicationId: 'app',
          mechanism: 'nos',
          keyUnits: 'key',
          unit: 'state',
          address: 'address',
          state: 'start',
          end: 'end',
          status: '已审批'
        }
      ],
      dropdownStatus: {
        detector: true
      },
      isShowList: false,
      checked: false,
      isMap: false
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    select() {},
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    handleDetail(title, row) {
      this.isShowDetail = true
      this.detailList = row
      this.title = title
    },
    handleEdit(row) {
      this.detailList = row
      this.isMap = true
    },
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '申请人',
        '申请编号',
        '所属机构',
        '所属重点领域',
        '施工单位',
        '施工区域',
        '开始时间',
        '结束时间',
        '施工人员',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'peoples',
        'applicationId',
        'mechanism',
        'keyUnits',
        'unit',
        'address',
        'state',
        'end',
        'peopleName',
        'status'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '施工区域管理列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    // 打印方法
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
          { field: 'peoples', displayName: '申请人' },
          { field: 'applicationId', displayName: '申请编号' },
          { field: 'mechanism', displayName: '所属机构' },
          { field: 'keyUnits', displayName: '所属重点领域' },
          { field: 'unit', displayName: '施工单位' },
          { field: 'address', displayName: '施工区域' },
          { field: 'state', displayName: '开始时间' },
          { field: 'end', displayName: '结束时间' },
          { field: 'peopleName', displayName: '施工人员' },
          { field: 'status', displayName: '审批状态' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">施工区域管理列表</p>',
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
#hostList {
  height: 100%;
  .btns {
    margin: 10px;
  }
  .Subsidiaries {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .pagination {
    text-align: right;
    margin-top: 30px;
  }
}
</style>
