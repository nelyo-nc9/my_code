<template>
  <div id="viewRealted">
    <div v-show="!isShowDetail">
      <div class="meus">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>施工加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>待审批列表</el-breadcrumb-item>
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
                <el-link :underline="false" @click="handleScope('审批', scope.row)">审批</el-link>
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
    v-show="isShowDetail"
    :isShowDetail.sync="isShowDetail"
    :title.sync="title"
    :detailList="detailList">
    </apply-detail>
  </div>
</template>

<script>
import applyDetail from './applyDetail'
export default {
  name: 'paddingList',
  components: {
    applyDetail
  },
  data() {
    return {
      isShowDetail: false,
      detailList: {},
      title: '',
      tableData: [{
        inputPeople: 'zs',
        applicationId: 1234,
        mechanism: '123456',
        keyUnits: 'asdz',
        location: 'sxxxx',
        area: '区域',
        start: '2020',
        endTime: '2021',
        peopleName: '施工人员'
      }, {
        inputPeople: 'ls',
        applicationId: 1234,
        mechanism: '123456',
        keyUnits: 'asdz',
        location: 'sxxxx',
        area: '区域',
        start: '2020',
        endTime: '2021',
        peopleName: '施工人员'
      }],
      columns: [
        { prop: 'inputPeople', sortable: true, label: '录入人', width: '' },
        { prop: 'applicationId', sortable: true, label: '申请编号', width: '' },
        { prop: 'mechanism', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyUnits', sortable: true, label: '所属重点单位', width: '' },
        { prop: 'location', sortable: true, label: '施工单位', width: '' },
        { prop: 'area', sortable: true, label: '施工区域', width: '' },
        { prop: 'start', sortable: true, label: '开始时间', width: '' },
        { prop: 'endTime', sortable: true, label: '结束时间', width: '' },
        { prop: 'peopleName', sortable: true, label: '施工人员', width: '' }
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
    back() {
      this.$emit('cloneExamine')
    },
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '录入人',
        '申请编号',
        '所属机构',
        '所属重点单位',
        '施工单位',
        '施工区域',
        '开始时间',
        '结束时间',
        '施工人员'
      ]
      // 字段名
      const filterVal = [
        'inputPeople',
        'applicationId',
        'mechanism',
        'keyUnits',
        'location',
        'area',
        'start',
        'endTime',
        'peopleName'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '待审批列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
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
          { field: 'inputPeople', displayName: '录入人' },
          { field: 'applicationId', displayName: '申请编号' },
          { field: 'mechanism', displayName: '所属机构' },
          { field: 'keyUnits', displayName: '所属重点单位' },
          { field: 'location', displayName: '施工单位' },
          { field: 'area', displayName: '施工区域' },
          { field: 'start', displayName: '开始时间' },
          { field: 'endTime', displayName: '结束时间' },
          { field: 'peopleName', displayName: '施工人员' }
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
    },
    collEvent(val) {},
    select() {},
    handleScope(title, row) {
      this.isShowDetail = true
      this.detailList = row
      this.title = title
    }
  }
}
</script>
<style lang="less" scoped>
#viewRealted {
  height: 100%;
  .btns {
    margin: 10px;
  }
  .tableView {
    display: flex;
    margin: 10px;
    height: 260px;
    .tableList {
      width: 473px;
      padding: 5px;
      border: 1px solid #e6e6e6;
      height: 108px;
      ul {
        // padding: 4px;
        border: 1px solid #e6e6e6;

        li {
          text-align: center;
          display: flex;
          line-height: 31px;
          border-bottom: 1px solid #e6e6e6;
          &:nth-child(1) {
            border-bottom: 1px solid #e6e6e6;
          }
          &:last-child {
            border: none;
          }
          i {
            width: 40%;
            height: 30px;
            background: #e6e6e6;
          }
          span {
            text-indent: 5px;
          }
        }
      }
    }
  }
  .box-big {
    display: flex;
    height: 500px;
    flex-direction: column;
    overflow: auto;
  }
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    margin-top: 20px;
    i {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 120px;
      margin-top: -12px;
    }
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 10px;
      font-size: 16px;
      height: 20px;
      line-height: 20px;
    }
  }
  .buttom-box {
    height: 200px;
    margin-left: 20px;
  }
  .TopologyView {
    width: 100%;
    margin-top: -48px;
  }
  .collItem {
    height: 400px;
    overflow: auto;
  }
  .pagination {
    text-align: right;
    margin-top: 30px;
  }
}
</style>
